# k6 - Expo 03

Prueba para mirar comportamiento de produccion y O11Y. Genera carga en la API, consulta readiness y simula scrapes al endpoint Prometheus para que Grafana/Loki tengan senales mientras corre la demo.

```powershell
k6 run .\o11y-stress.js
```

Por defecto apunta a GlassFish en `8080`. Para Payara usa `SERVER=PY`, que cambia el puerto por defecto a `9080`.

GlassFish:

```powershell
$env:SERVER = "GF"
$env:PORT = "8080"
$env:USERNAME = "admin"
$env:PASSWORD = "admin123"
$env:TASKS_PER_PROJECT = "3"
k6 run .\o11y-stress.js
```

Payara:

```powershell
$env:SERVER = "PY"
$env:PORT = "9080"
$env:USERNAME = "admin"
$env:PASSWORD = "admin123"
$env:TASKS_PER_PROJECT = "3"
k6 run .\o11y-stress.js
```

Variables utiles:

- `SERVER`: `GF` o `PY`; solo decide el puerto por defecto.
- `HOST`: host de la app. Default: `localhost`.
- `PORT`: puerto HTTP de la app. Default: `8080` para GF, `9080` para PY.
- `APP_URL`: URL completa; si la defines, tiene prioridad sobre `HOST`/`PORT`.
- `API_BASE_URL`, `HEALTH_URL`, `METRICS_URL`: overrides puntuales.
- `TASKS_PER_PROJECT`: cuantas tareas crea por cada proyecto seleccionado o creado. Default: `3`.
- `PROJECT_POOL_SIZE`: cuantos proyectos semilla crea en `setup()`. Default: `5`.

Sin instalar k6, usando Docker:

```powershell
Get-Content .\o11y-stress.js | docker run --rm -i `
  -e SERVER="GF" `
  -e HOST="host.docker.internal" `
  -e PORT="8080" `
  -e USERNAME="admin" `
  -e PASSWORD="admin123" `
  -e TASKS_PER_PROJECT="3" `
  grafana/k6 run -
```

Para Payara con Docker/k6 cambia `SERVER="PY"` y `PORT="9080"`.

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
