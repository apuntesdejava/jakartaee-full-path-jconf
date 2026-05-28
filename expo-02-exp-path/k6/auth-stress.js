import http from 'k6/http';
import { check, fail, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/project-tracker/resources';
const USERNAME = __ENV.USERNAME || 'admin';
const PASSWORD = __ENV.PASSWORD || 'admin123';

http.setResponseCallback(http.expectedStatuses({ min: 200, max: 399 }, 401, 403));

const loginSuccess = new Rate('project_tracker_k6_login_success');
const protectedWrites = new Counter('project_tracker_k6_protected_writes');
const protectedWriteSuccess = new Rate('project_tracker_k6_protected_write_success');
const anonymousDenials = new Rate('project_tracker_k6_anonymous_denials');

export const options = {
  scenarios: {
    authenticated_api_load: {
      executor: 'ramping-vus',
      stages: [
        { duration: '20s', target: 5 },
        { duration: '50s', target: 20 },
        { duration: '20s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.08'],
    http_req_duration: ['p(95)<1000'],
    'http_req_duration{endpoint:auth_login}': ['p(95)<800'],
    'project_tracker_k6_login_success': ['rate>0.99'],
    'project_tracker_k6_protected_write_success': ['rate>0.95'],
    'project_tracker_k6_anonymous_denials': ['rate>0.95'],
  },
};

export function setup() {
  const token = login(USERNAME, PASSWORD);

  if (!token) {
    fail('No se pudo obtener token JWT para la prueba autenticada');
  }

  return { token };
}

export default function (data) {
  const roll = Math.random();

  if (roll < 0.5) {
    listProjects();
  } else if (roll < 0.9) {
    createProject(data.token);
  } else {
    assertAnonymousCannotCreate();
  }

  sleep(Math.random() * 1.2);
}

function login(username, password) {
  const response = http.post(
    `${BASE_URL}/auth/login`,
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
  const response = http.get(`${BASE_URL}/projects`, {
    tags: { endpoint: 'projects_public_list' },
  });

  check(response, {
    'public GET /projects returns 200': (r) => r.status === 200,
  });
}

function createProject(token) {
  const payload = JSON.stringify({
    name: `k6 auth path ${__VU}-${__ITER}-${Date.now()}`,
    description: 'Proyecto creado por k6 usando JWT',
    status: 'ACTIVE',
  });

  const response = http.post(`${BASE_URL}/projects`, payload, authJsonParams(token, 'projects_protected_create'));
  const ok = check(response, {
    'authenticated POST /projects returns 201': (r) => r.status === 201,
  });

  protectedWriteSuccess.add(ok);
  if (ok) {
    protectedWrites.add(1);
  }
}

function assertAnonymousCannotCreate() {
  const response = http.post(
    `${BASE_URL}/projects`,
    JSON.stringify({
      name: `k6 anonymous ${__VU}-${__ITER}`,
      description: 'Este request debe ser rechazado',
      status: 'ACTIVE',
    }),
    jsonParams('projects_anonymous_create')
  );

  const denied = response.status === 401 || response.status === 403;
  anonymousDenials.add(denied);

  check(response, {
    'anonymous POST /projects is denied': () => denied,
  });
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
