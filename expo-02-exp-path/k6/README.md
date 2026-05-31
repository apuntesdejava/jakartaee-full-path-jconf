# k6 - Expo 02

Prueba enfocada en la experiencia autenticada. Hace login REST, usa el JWT para crear proyectos protegidos y confirma que un cliente anonimo no pueda escribir.

```powershell
k6 run .\auth-stress.js
```

Variables utiles:

```powershell
$env:BASE_URL = "http://localhost:8080/project-tracker/resources"
$env:K6_USERNAME = "admin"
$env:K6_PASSWORD = "admin123"
k6 run .\auth-stress.js
```

Sin instalar k6, usando Docker:

```powershell
Get-Content .\auth-stress.js | docker run --rm -i `
  -e BASE_URL="http://host.docker.internal:8080/project-tracker/resources" `
  -e K6_USERNAME="admin" `
  -e K6_PASSWORD="admin123" `
  grafana/k6 run -
```

Para una demo de autorizacion negativa puedes probar `pepe/pepe123`; ese usuario debe poder autenticarse, pero no crear proyectos porque no tiene rol `ADMIN`.
