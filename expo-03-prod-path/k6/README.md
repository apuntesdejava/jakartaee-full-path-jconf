# k6 - Expo 03

Prueba para mirar comportamiento de produccion y O11Y. Genera carga en la API, consulta readiness y simula scrapes al endpoint Prometheus para que Grafana/Loki tengan senales mientras corre la demo.

```powershell
k6 run .\o11y-stress.js
```

Variables utiles:

```powershell
$env:APP_URL = "http://localhost:8080"
$env:API_BASE_URL = "http://localhost:8080/project-tracker/resources"
$env:HEALTH_URL = "http://localhost:8080/health/ready"
$env:METRICS_URL = "http://localhost:8080/project-tracker/resources/observability/metrics"
$env:USERNAME = "admin"
$env:PASSWORD = "admin123"
k6 run .\o11y-stress.js
```

Sin instalar k6, usando Docker:

```powershell
Get-Content .\o11y-stress.js | docker run --rm -i `
  -e APP_URL="http://host.docker.internal:8080" `
  -e API_BASE_URL="http://host.docker.internal:8080/project-tracker/resources" `
  -e HEALTH_URL="http://host.docker.internal:8080/health/ready" `
  -e METRICS_URL="http://host.docker.internal:8080/project-tracker/resources/observability/metrics" `
  -e USERNAME="admin" `
  -e PASSWORD="admin123" `
  grafana/k6 run -
```

Mientras corre, abre:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`
- Logs del contenedor: `docker logs -f project-tracker-container`

Consultas utiles en Prometheus:

```promql
up
project_tracker_http_requests_total
rate(project_tracker_http_requests_total[1m])
```

En Grafana, el dashboard `ProjectTracker O11Y` deberia mostrar la subida de requests, el readiness y los logs recolectados por Loki.
