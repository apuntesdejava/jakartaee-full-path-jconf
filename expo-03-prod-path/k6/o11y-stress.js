import http from 'k6/http';
import { check, fail, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const APP_URL = __ENV.APP_URL || 'http://localhost:8080';
const API_BASE_URL = __ENV.API_BASE_URL || `${APP_URL}/project-tracker/resources`;
const HEALTH_URL = __ENV.HEALTH_URL || `${APP_URL}/health/ready`;
const METRICS_URL = __ENV.METRICS_URL || `${API_BASE_URL}/observability/metrics`;
const USERNAME = __ENV.USERNAME || 'admin';
const PASSWORD = __ENV.PASSWORD || 'admin123';

const loginSuccess = new Rate('project_tracker_k6_login_success');
const healthUp = new Rate('project_tracker_k6_health_up');
const metricsAvailable = new Rate('project_tracker_k6_metrics_available');
const createdProjects = new Counter('project_tracker_k6_created_projects');
const createdTasks = new Counter('project_tracker_k6_created_tasks');
const requestedReports = new Counter('project_tracker_k6_requested_reports');

export const options = {
  scenarios: {
    api_load: {
      executor: 'ramping-vus',
      exec: 'apiLoad',
      stages: [
        { duration: '30s', target: 8 },
        { duration: '1m', target: 25 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '15s',
    },
    readiness_probe: {
      executor: 'constant-arrival-rate',
      exec: 'readinessProbe',
      rate: 1,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 2,
      maxVUs: 5,
    },
    metrics_scrape: {
      executor: 'constant-arrival-rate',
      exec: 'metricsScrape',
      rate: 1,
      timeUnit: '5s',
      duration: '2m',
      preAllocatedVUs: 1,
      maxVUs: 3,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.08'],
    http_req_duration: ['p(95)<1200'],
    'http_req_duration{endpoint:readiness}': ['p(95)<500'],
    'http_req_duration{endpoint:metrics}': ['p(95)<500'],
    'project_tracker_k6_login_success': ['rate>0.99'],
    'project_tracker_k6_health_up': ['rate>0.99'],
    'project_tracker_k6_metrics_available': ['rate>0.99'],
  },
};

export function setup() {
  const token = login(USERNAME, PASSWORD);

  if (!token) {
    fail('No se pudo obtener token JWT para la prueba O11Y');
  }

  const seedProjectId = createProject(token, 'seed');

  if (!seedProjectId) {
    fail('No se pudo crear proyecto semilla para tareas/reportes');
  }

  return { token, seedProjectId };
}

export function apiLoad(data) {
  const roll = Math.random();

  if (roll < 0.45) {
    listProjects();
  } else if (roll < 0.7) {
    createProject(data.token, 'load');
  } else if (roll < 0.9) {
    createTask(data.token, data.seedProjectId);
  } else {
    requestReport(data.token, data.seedProjectId);
  }

  sleep(Math.random());
}

export function readinessProbe() {
  const response = http.get(HEALTH_URL, {
    tags: { endpoint: 'readiness' },
  });

  const ok = check(response, {
    'readiness returns 200': (r) => r.status === 200,
    'readiness body is UP': (r) => r.body.includes('"status":"UP"') || r.body.includes('UP'),
  });

  healthUp.add(ok);
}

export function metricsScrape() {
  const response = http.get(METRICS_URL, {
    tags: { endpoint: 'metrics' },
  });

  const ok = check(response, {
    'metrics returns 200': (r) => r.status === 200,
    'metrics include HTTP counter': (r) => r.body.includes('project_tracker_http_requests_total'),
  });

  metricsAvailable.add(ok);
}

function login(username, password) {
  const response = http.post(
    `${API_BASE_URL}/auth/login`,
    JSON.stringify({ username, password }),
    jsonParams('auth_login')
  );

  const token = readJson(response).token;
  const ok = check(response, {
    'login returns 200': (r) => r.status === 200,
    'login returns token': () => Boolean(token),
  });

  loginSuccess.add(ok);
  return ok ? token : null;
}

function listProjects() {
  const response = http.get(`${API_BASE_URL}/projects`, {
    tags: { endpoint: 'projects_list' },
  });

  check(response, {
    'GET /projects returns 200': (r) => r.status === 200,
  });
}

function createProject(token, label) {
  const vu = typeof __VU === 'number' && __VU > 0 ? __VU : 'setup';
  const iter = typeof __ITER === 'number' ? __ITER : 0;

  const response = http.post(
    `${API_BASE_URL}/projects`,
    JSON.stringify({
      name: `k6 o11y ${label} ${vu}-${iter}-${Date.now()}`,
      description: 'Proyecto creado para generar metricas, logs y actividad en MySQL',
      status: 'ACTIVE',
    }),
    authJsonParams(token, 'projects_create')
  );

  const ok = check(response, {
    'POST /projects returns 201': (r) => r.status === 201,
  });

  if (!ok) {
    return null;
  }

  createdProjects.add(1);
  return Number(readJson(response).id);
}

function createTask(token, projectId) {
  const response = http.post(
    `${API_BASE_URL}/projects/${projectId}/tasks`,
    JSON.stringify({
      title: `k6 task ${__VU}-${__ITER}-${Date.now()}`,
      status: 'TODO',
    }),
    authJsonParams(token, 'tasks_create')
  );

  const ok = check(response, {
    'POST /projects/{id}/tasks returns 200': (r) => r.status === 200,
  });

  if (ok) {
    createdTasks.add(1);
  }
}

function requestReport(token, projectId) {
  const response = http.post(
    `${API_BASE_URL}/reports/${projectId}`,
    null,
    authJsonParams(token, 'reports_request')
  );

  const ok = check(response, {
    'POST /reports/{id} returns 202': (r) => r.status === 202,
  });

  if (ok) {
    requestedReports.add(1);
  }
}

function jsonParams(endpoint) {
  return {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint },
  };
}

function authJsonParams(token, endpoint) {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    tags: { endpoint },
  };
}

function readJson(response) {
  try {
    return response.json();
  } catch (error) {
    return {};
  }
}
