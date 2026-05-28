# k6 - Expo 01

Prueba basica para el camino del dato. Mezcla lectura, escritura y validacion sobre la API publica de proyectos.

```powershell
k6 run .\basic-stress.js
```

Con URL explicita:

```powershell
$env:BASE_URL = "http://localhost:8080/project-tracker/resources"
k6 run .\basic-stress.js
```

Sin instalar k6, usando Docker:

```powershell
Get-Content .\basic-stress.js | docker run --rm -i `
  -e BASE_URL="http://host.docker.internal:8080/project-tracker/resources" `
  grafana/k6 run -
```

La senal esperada es sencilla: `GET /projects` estable, `POST /projects` creando registros y algunos `400` controlados para demostrar Jakarta Validation bajo carga.
