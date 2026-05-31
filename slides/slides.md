---
theme: default
title: Jakarta EE 11 en 45 minutos
info: |
  Una charla sobre construir una aplicación empresarial completa con Java,
  Jakarta EE 11 y GlassFish 8, organizada en tres actos: dato, experiencia y producción.
colorSchema: dark
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Jakarta EE 11 en 45 minutos

## De cero a una aplicación empresarial completa con Java y GlassFish 8

JConf - ProjectTracker

<!--
Nota:
Abrir dejando claro que no es un tour API por API.
La pregunta guía: ¿cuánto puedo resolver hoy con Java 21, Jakarta EE 11 y GlassFish 8 antes de traer herramientas externas por costumbre?
-->

---

# La tesis

Jakarta EE 11 permite construir una aplicación empresarial completa usando Java como plataforma principal.

No se trata de prohibir Angular, React u otras herramientas.

Se trata de no traerlas por reflejo cuando el estándar ya resuelve el caso.

<!--
Nota:
Insistir en el matiz: no es una charla anti-frontend.
La provocación es contra el reflejo automático, no contra React o Angular.
Frase clave: "No se trata de prohibir herramientas externas, se trata de no traerlas por reflejo."
-->

---

# El ejemplo

ProjectTracker:

- Gestión de proyectos
- Tareas por proyecto
- Usuarios y seguridad
- API REST
- UI server-side
- Eventos en tiempo real
- Procesos asíncronos
- Observabilidad
- Despliegue con GlassFish 8

[Repositorio de la charla](../README.md)

<!--
Nota:
Presentar ProjectTracker como hilo conductor: proyectos, tareas, seguridad, API, UI, eventos, procesos asíncronos, observabilidad y despliegue.
La idea es que la audiencia vea una aplicación completa, no ejemplos aislados.
-->

---

# No voy a recorrer 16 carpetas

El repositorio está organizado como sesiones incrementales.

Para una charla de 45 minutos, la historia se entiende mejor como un solo camino:

1. El camino del dato
2. El camino de la experiencia
3. El camino de producción

[Mapa del repositorio](../SUMMARY.md)

<!--
Nota:
Explicar que el tutorial completo estaba organizado por sesiones, pero en 45 minutos eso se vuelve una lista.
Reencuadrar la charla como tres caminos: dato, experiencia y producción.
-->

---
layout: section
---

# Acto 1

## El camino del dato

Cómo modelo, valido, expongo y persisto información.

<!--
Nota:
Objetivo del acto: pasar de una superficie HTTP a un modelo persistente, validado y expresado con repositorios declarativos.
-->

---

# Del endpoint al contrato

Primero aparece la superficie HTTP:

- Jakarta REST
- JSON-B
- DTOs con records
- Un contrato simple para crear y consultar proyectos

Sesiones:

- [Expo 00: Setup local](../expo-00-setup/create-jdbc.asadmin.md)
- [Expo 01: Camino del dato](../expo-01-data-path/project-tracker/README.md)

<!--
Nota:
REST y JSON-B son la puerta de entrada, pero el punto importante es arquitectónico.
El endpoint debe ser una frontera, no el lugar donde vive todo el negocio.
-->

---

# CDI como pegamento

La lógica deja de vivir en el recurso REST.

Jakarta CDI conecta las piezas:

- `@ApplicationScoped`
- `@Inject`
- Qualifiers
- Separación entre API y servicio

[Expo 01: CDI en el camino del dato](../expo-01-data-path/project-tracker/README.md)

<!--
Nota:
CDI mueve el centro de gravedad fuera del recurso REST.
Frase clave: "El endpoint habla HTTP; el servicio habla negocio."
-->

---

# Persistencia real

La aplicación ya no trabaja con datos en memoria.

Jakarta Persistence permite modelar:

- Entidades
- Relaciones
- Transacciones
- `@Embeddable`
- Records y tipos modernos de Java

[Expo 01: Persistencia con Jakarta Persistence](../expo-01-data-path/project-tracker/README.md)

<!--
Nota:
No vender JPA por nostalgia.
El mensaje es que el modelo persistente sigue siendo una pieza central de una aplicación empresarial.
-->

---

# Validar antes de confiar

La validación forma parte del contrato.

```java
public record ProjectDTO(
    Long id,
    @NotBlank @Size(min = 3, max = 80) String name,
    String description,
    String status
) {}
```

[Expo 01: Validación del contrato REST](../expo-01-data-path/project-tracker/README.md)

<!--
Nota:
La validación no debería estar escondida en condicionales sueltos.
Si el nombre es obligatorio y tiene reglas, eso pertenece al contrato.
-->

---

# Jakarta Data

El momento clave del Acto 1.

```java
@Repository
public interface ProjectRepository
    extends BasicRepository<Project, Long> {

    List<Project> findByStatus(String status);
}
```

Menos infraestructura manual, más intención de negocio.

[Expo 01: Jakarta Data](../expo-01-data-path/project-tracker/README.md)

<!--
Nota:
Marcar este como uno de los momentos importantes de Jakarta EE 11.
Menos código de acceso a datos que no aporta lenguaje de negocio.
Frase clave: "Menos ruido, más intención."
-->

---

# Demo 1

## De API a datos reales

Mostrar:

- `GET /resources/projects`
- `POST /resources/projects`
- Validación fallando con error claro
- `ProjectRepository`
- Servicio usando repositorio declarativo

Mensaje:

> REST, JSON, validación, CDI, transacciones y datos bajo contratos estándar.

<!--
Nota:
Mostrar GET, POST, validación fallando, ProjectRepository y servicio usando repositorio declarativo.
Cierre: todavía no salimos del ecosistema Jakarta EE.
-->

---
layout: section
---

# Acto 2

## El camino de la experiencia

Puedo entregar una aplicación usable sin traer una SPA por defecto.

<!--
Nota:
Transición: aquí normalmente alguien dice "backend terminado, ahora necesitamos una SPA".
Respuesta: depende.
-->

---

# UI server-side

Jakarta Faces permite construir pantallas transaccionales con el mismo modelo de aplicación:

- XHTML
- Backing beans CDI
- Formularios
- Tablas
- validación integrada

[Expo 02: Jakarta Faces](../expo-02-exp-path/project-tracker/README.md)

<!--
Nota:
Jakarta Faces tiene sentido en aplicaciones internas, administrativas y transaccionales.
No venderlo como reemplazo universal del frontend rico.
-->

---

# Seguridad integrada

La aplicación necesita proteger UI y API.

Jakarta Security permite combinar:

- Login por formulario
- Roles
- `@RolesAllowed`
- JWT para REST
- Identity store para pruebas y demo

[Expo 02: Seguridad integrada](../expo-02-exp-path/project-tracker/README.md)

<!--
Nota:
Proteger pantalla y endpoint no deberían ser mundos separados.
La seguridad entra como parte del modelo de aplicación, no como una pieza pegada al final.
-->

---

# Tiempo real sin cambiar de stack

Cuando el modelo cambia, la UI puede recibir eventos.

Jakarta WebSocket + CDI Events:

- `@ServerEndpoint`
- `@Observes`
- Broadcast a sesiones conectadas
- Dashboard reactivo desde Java

[Expo 02: WebSockets y CDI Events](../expo-02-exp-path/project-tracker/README.md)

<!--
Nota:
Explicar el patrón: servicio cambia algo, dispara evento CDI, WebSocket transmite a clientes conectados.
Suficiente para dashboards internos y notificaciones empresariales.
-->

---

# Demo 2

## Aplicación completa, no solo backend

Mostrar:

- Login
- Pantalla de proyectos
- Crear proyecto desde UI
- Endpoint protegido
- Actualización via WebSocket si el entorno está listo

Mensaje:

> Para muchas apps empresariales, server-side UI reduce piezas móviles sin renunciar a productividad.

<!--
Nota:
Mostrar login, pantalla de proyectos, creación desde UI, endpoint protegido.
WebSocket solo si el entorno está estable.
-->

---
layout: section
---

# Acto 3

## El camino de producción

Esto debe poder operar más allá del laptop.

<!--
Nota:
Transición: una aplicación empresarial no termina cuando responde en localhost.
Producción implica ejecución asíncrona, operación, despliegue y señales observables.
-->

---

# Concurrencia moderna

Jakarta Concurrency 3.1 se encuentra con Java 21.

```java
@ManagedExecutorDefinition(
    name = "java:app/concurrent/VirtualExecutor",
    virtual = true
)
```

El runtime gestiona contexto, seguridad y ejecución asíncrona.

[Expo 03: Virtual threads con Jakarta Concurrency](../expo-03-prod-path/project-tracker/README.md)

<!--
Nota:
Java 21 y virtual threads vuelven especialmente interesante a Jakarta Concurrency.
El punto clave: no crear hilos a mano; el runtime sigue gestionando contexto, seguridad y ciclo de vida.
-->

---

# Trabajo desacoplado

No todo debe ocurrir dentro de la request HTTP.

Jakarta EE cubre varios patrones:

- JMS para mensajería
- MDB para consumidores
- `@Schedule` para tareas periódicas
- Batch para procesos largos y chunked

Sesiones:

- [Expo 03: Jakarta Messaging](../expo-03-prod-path/project-tracker/README.md)
- [Expo 03: EJB Timer](../expo-03-prod-path/project-tracker/README.md)
- [Expo 03: Jakarta Batch](../expo-03-prod-path/project-tracker/README.md)

<!--
Nota:
No todo debe ocurrir dentro de una request HTTP.
JMS/MDB para desacoplar, @Schedule para tareas periódicas, Batch para procesos largos por chunks.
La idea no es usar todo siempre; es tener opciones estándar.
-->

---

# Observabilidad

GlassFish 8 integra MicroProfile para operar la aplicación:

- Health
- Readiness
- Métricas Prometheus de la app
- Logs con Loki
- Prometheus + Loki + Grafana como visor local

[Expo 03: Health & Metrics](../expo-03-prod-path/project-tracker/README.md)

<!--
Nota:
Health, readiness y métricas permiten que la app hable el idioma de plataformas cloud.
Frase clave: "Producción no es solamente empaquetar un WAR."
-->

---

# Despliegue

Una forma reproducible de llevarlo a producción:

- GlassFish 8 en contenedor
- MySQL como dependencia externa
- Stack O11Y local en Docker Compose

Referencia:

- [Expo 03: Docker + GlassFish 8 + MySQL](../expo-03-prod-path/project-tracker/README.md)

<!--
Nota:
El valor no es solo "corre en Docker".
El valor es una configuración reproducible: WAR, GlassFish 8, driver MySQL, pool JDBC por asadmin y variables de entorno.
-->

---

# Demo 3

## Moderna y operable

Mostrar:

- Endpoint que dispara un reporte asíncrono
- Logs mostrando `VirtualThread`
- `/health`
- `/metrics`
- Empaquetado con GlassFish 8 + MySQL
- Dashboard local de O11Y
- Logs centralizados con Loki

Mensaje:

> La plataforma no termina en escribir endpoints: también cubre concurrencia, operación y despliegue.

<!--
Nota:
Mostrar reporte asíncrono, logs con VirtualThread, /health, /metrics y dashboard O11Y si está listo.
Cierre: la plataforma también cubre señales para observarla.
-->

---

# El mapa completo

| Acto        | Pregunta                           | Sesiones                 |
|-------------|------------------------------------|--------------------------|
| Dato        | Como modelo y persisto información | 0, 1, 2, 3, 4, 5         |
| Experiencia | Como entrego una app usable        | 6, 7, 11                 |
| Produccion  | Como escalo, opero y despliego     | 8, 9, 10, 12, 13, 14, 15 |

[Mapa del repositorio](../SUMMARY.md)

<!--
Nota:
Usar esta slide para respirar y volver a la historia completa.
Dato: contrato y persistencia.
Experiencia: UI, seguridad, tiempo real.
Producción: concurrencia, mensajería, batch, observabilidad, despliegue.
-->

---

# Cuando si usar React o Angular

Úsalos cuando aporten valor real:

- Interacción altamente dinámica
- Estado complejo en cliente
- Equipos frontend especializados
- Ecosistemas de componentes ya adoptados
- Producto público con experiencia muy rica

La propuesta no es menos frontend.

La propuesta es elegir con criterio.

<!--
Nota:
Ser justo: React y Angular aportan mucho cuando hay interacción altamente dinámica, estado complejo en cliente o equipos frontend especializados.
El mensaje maduro no es "SPA nunca"; es "no por reflejo".
-->

---

# Cuando Jakarta Faces tiene sentido

Brilla en aplicaciones:

- Internas
- Administrativas
- Transaccionales
- CRUD con seguridad fuerte
- Formularios y tablas
- Equipos Java full-stack
- Menor tolerancia a integración accidental

[Expo 02: Jakarta Faces](../expo-02-exp-path/project-tracker/README.md)

<!--
Nota:
Conectar con el tipo de aplicación: interna, administrativa, transaccional, seguridad fuerte, formularios y tablas.
Frase clave: "No toda aplicación necesita pagar el costo de una SPA."
-->

---

# Cierre

Jakarta EE 11 no es una colección de APIs viejas.

Es una plataforma estándar para construir aplicaciones completas:

- API
- UI
- Datos
- Seguridad
- Concurrencia
- Mensajería
- Batch
- Observabilidad
- Despliegue

Todo con Java como columna vertebral.

<!--
Nota:
Cierre:
Jakarta EE 11 no es una colección de APIs viejas.
Es una plataforma estándar para construir aplicaciones completas.
La decisión madura no es SPA siempre ni server-side siempre; es elegir con criterio.
-->

---

# Preguntas

## Y después, código

[Repositorio](../README.md)
