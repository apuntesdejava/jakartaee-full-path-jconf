import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/project-tracker/resources';

http.setResponseCallback(http.expectedStatuses({ min: 200, max: 399 }, 400));

const createdProjects = new Counter('project_tracker_k6_created_projects');
const validationErrors = new Rate('project_tracker_k6_validation_errors');

export const options = {
  scenarios: {
    basic_api_load: {
      executor: 'ramping-vus',
      stages: [
        { duration: '20s', target: 5 },
        { duration: '40s', target: 15 },
        { duration: '20s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<900'],
    'http_req_duration{endpoint:projects_list}': ['p(95)<700'],
    'project_tracker_k6_validation_errors': ['rate>0.95'],
  },
};

export default function () {
  const roll = Math.random();

  if (roll < 0.65) {
    listProjects();
  } else if (roll < 0.9) {
    createProject();
  } else {
    sendInvalidProject();
  }

  sleep(Math.random() * 1.5);
}

function listProjects() {
  const response = http.get(`${BASE_URL}/projects`, {
    tags: { endpoint: 'projects_list' },
  });

  check(response, {
    'GET /projects returns 200': (r) => r.status === 200,
    'GET /projects returns JSON': (r) => contentType(r).includes('application/json'),
  });
}

function createProject() {
  const payload = JSON.stringify({
    name: `k6 data path ${__VU}-${__ITER}-${Date.now()}`,
    description: 'Proyecto creado por k6 para el camino del dato',
    status: 'ACTIVE',
  });

  const response = http.post(`${BASE_URL}/projects`, payload, jsonParams('projects_create'));

  const ok = check(response, {
    'POST /projects returns 201': (r) => r.status === 201,
    'POST /projects returns Location': (r) => Boolean(r.headers.Location),
  });

  if (ok) {
    createdProjects.add(1);
  }
}

function sendInvalidProject() {
  const payload = JSON.stringify({
    name: 'x',
    description: 'Este request debe fallar validacion',
    status: 'ACTIVE',
  });

  const response = http.post(`${BASE_URL}/projects`, payload, jsonParams('projects_validation'));
  validationErrors.add(response.status === 400);

  check(response, {
    'invalid POST returns 400': (r) => r.status === 400,
  });
}

function jsonParams(endpoint) {
  return {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint },
  };
}

function contentType(response) {
  return response.headers['Content-Type'] || response.headers['content-type'] || '';
}
