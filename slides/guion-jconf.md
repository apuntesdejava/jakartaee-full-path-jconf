# Guion pautado - Jakarta EE 11 en 45 minutos

## Objetivo de la charla

Presentar Jakarta EE 11 con GlassFish 8 como una plataforma moderna para construir una aplicación empresarial completa con Java 21, sin recorrer todo el tutorial carpeta por carpeta.

La idea central no es decir que React, Angular u otras herramientas no sirven. La idea es mostrar que muchas aplicaciones empresariales pueden resolverse muy bien dentro del estándar, sin traer piezas adicionales por reflejo.

## Distribución sugerida del tiempo

| Bloque      |        Tiempo | Slides                          | Objetivo                                 |
|-------------|--------------:|---------------------------------|------------------------------------------|
| Apertura    |   0:00 - 3:00 | Título, tesis, ejemplo          | Plantear la provocación                  |
| Mapa mental |   3:00 - 5:00 | No voy a recorrer el repo carpeta por carpeta | Ordenar la charla en tres actos          |
| Acto 1      |  5:00 - 18:00 | Camino del dato                 | REST, CDI, JPA, Validation, Jakarta Data |
| Demo 1      | 18:00 - 20:30 | De API a datos reales           | Mostrar API, validación y repositorio    |
| Acto 2      | 20:30 - 30:00 | Camino de la experiencia        | Faces, Security, WebSocket               |
| Demo 2      | 30:00 - 33:00 | Aplicación completa             | Mostrar UI, login y endpoint protegido   |
| Acto 3      | 33:00 - 40:00 | Camino de producción            | Concurrency, JMS, Batch, Health, Deploy  |
| Demo 3      | 40:00 - 42:00 | Moderna y operable              | Mostrar async, health, metrics           |
| Cierre      | 42:00 - 45:00 | Mapa completo, criterio, cierre | Reforzar el mensaje final                |

## Apertura - 0:00 a 3:00

### Mensaje

Esta charla no es un tour API por API de Jakarta EE. Eso no cabe en 45 minutos y, para una audiencia experta en Java, tampoco sería lo más valioso.

La pregunta que quiero responder es:

> Si hoy tengo que construir una aplicación empresarial completa con Java 21, Jakarta EE 11 y GlassFish 8, ¿cuánto puedo resolver dentro de la plataforma antes de traer herramientas externas por costumbre?

### Guion sugerido

“Esta charla no es un recorrido exhaustivo por todas las especificaciones de Jakarta EE. El tutorial completo sí tiene una estructura incremental, pero hoy tenemos 45 minutos.

Lo que quiero proponer es una forma distinta de mirar Jakarta EE 11: no como una colección de APIs históricas, sino como una plataforma integrada para construir aplicaciones empresariales completas.

Y aclaro algo desde el inicio: no vengo a decir que no usen React, Angular u otras herramientas. Vengo a decir que no deberíamos traerlas por reflejo cuando el estándar ya resuelve suficientemente bien el caso.”

## ProjectTracker y mapa mental - 3:00 a 5:00

### Mensaje

ProjectTracker es el ejemplo conductor. Aunque el repositorio viene de un tutorial incremental, la charla se entiende mejor como tres caminos:

1. El camino del dato.
2. El camino de la experiencia.
3. El camino de producción.

### Guion sugerido

“El ejemplo es ProjectTracker: proyectos, tareas, usuarios, seguridad, API REST, UI server-side, eventos en tiempo real, procesos asíncronos, observabilidad y despliegue.

El repositorio está organizado como un tutorial paso a paso. Pero no voy a recorrerlo carpeta por carpeta, porque eso sería convertir la charla en una lista.

Prefiero contarlo como una historia técnica en tres actos: primero cómo modelo y persisto información, luego cómo entrego una experiencia usable, y finalmente cómo llevo esto a producción.”

## Acto 1 - El camino del dato - 5:00 a 18:00

### Objetivo

Mostrar cómo Jakarta EE permite pasar de un endpoint HTTP a un modelo persistente, validado y expresado con repositorios declarativos.

### Slide: Del endpoint al contrato

#### Mensaje

REST y JSON-B son la superficie de entrada, pero el contrato no debe absorber toda la lógica.

#### Guion sugerido

“El primer contacto con la aplicación es HTTP. Tenemos Jakarta REST, JSON-B y DTOs con records para crear y consultar proyectos.

Pero para una audiencia Java, lo interesante no es que exista un `GET` o un `POST`. Eso ya lo sabemos.

Lo importante es que el endpoint sea una frontera, no el lugar donde vive todo el negocio.”

### Slide: CDI como pegamento

#### Mensaje

CDI separa transporte, servicio, repositorio y otros componentes.

#### Guion sugerido

“Aquí entra CDI. El recurso REST deja de ser el centro de gravedad y pasa a delegar en servicios.

CDI es el pegamento de la plataforma: conecta recursos, servicios, repositorios, validadores y eventos.

La aplicación empieza a tener una forma más limpia: el endpoint habla HTTP, el servicio habla negocio.”

### Slide: Persistencia real

#### Mensaje

JPA sigue siendo la pieza estándar para modelar entidades, relaciones y transacciones.

#### Guion sugerido

“Después dejamos de trabajar con datos en memoria. Con Jakarta Persistence modelamos entidades, relaciones y transacciones.

En Jakarta EE 11 esto conversa mejor con Java moderno: tipos de `java.time`, records como `@Embeddable`, y un modelo más expresivo.

El punto no es nostalgia por JPA. El punto es que el modelo de dominio sigue siendo una pieza central en una aplicación empresarial.”

### Slide: Validar antes de confiar

#### Mensaje

La validación es parte del contrato, no un detalle secundario.

#### Guion sugerido

“La validación no debería quedar escondida en condicionales sueltos.

Si un proyecto necesita nombre, longitud mínima y reglas claras, eso debe formar parte del contrato.

Jakarta Validation permite que esa intención sea visible en DTOs, entidades y puntos de entrada.”

### Slide: Jakarta Data

#### Mensaje

Jakarta Data es uno de los momentos más importantes de la charla.

#### Guion sugerido

“Aquí aparece una de las grandes novedades de Jakarta EE 11: Jakarta Data.

Durante mucho tiempo escribimos demasiado código de acceso a datos que no aportaba lenguaje de negocio.

Con un repositorio declarativo, el código empieza a decir lo que quiere:

`findByStatus`

Eso es más interesante que repetir infraestructura manual. Menos ruido, más intención.”

### Demo 1 - 18:00 a 20:30

#### Mostrar

- `GET /resources/projects`
- `POST /resources/projects`
- Validación fallando con un error claro
- `ProjectRepository`
- Servicio usando el repositorio declarativo

#### Cierre de demo

“En este primer acto ya tenemos REST, JSON, validación, CDI, transacciones y datos bajo contratos estándar. Todavía no hemos salido del ecosistema Jakarta EE.”

## Acto 2 - El camino de la experiencia - 20:30 a 30:00

### Objetivo

Mostrar que se puede entregar una aplicación usable sin asumir automáticamente que toda UI debe ser una SPA.

### Slide: UI server-side

#### Mensaje

Jakarta Faces tiene sentido para aplicaciones internas, administrativas y transaccionales.

#### Guion sugerido

“Aquí normalmente alguien dice: listo, backend terminado, ahora necesitamos una SPA.

Mi respuesta es: depende.

Para aplicaciones internas, administrativas, transaccionales, con formularios, tablas, seguridad y flujos CRUD, una UI server-side sigue siendo una opción muy seria.

Jakarta Faces permite construir pantallas con XHTML, backing beans CDI, formularios, tablas y validación integrada.”

### Slide: Seguridad integrada

#### Mensaje

La seguridad debe proteger UI y API de forma coherente.

#### Guion sugerido

“En aplicaciones empresariales, proteger una pantalla y proteger un endpoint no son problemas completamente separados.

Jakarta Security permite combinar login por formulario, roles, `@RolesAllowed`, JWT para REST e identity stores.

La ventaja es que la seguridad entra como parte del modelo de aplicación, no como una pieza pegada al final.”

### Slide: Tiempo real sin cambiar de stack

#### Mensaje

WebSocket y CDI Events permiten agregar tiempo real sin abandonar Java.

#### Guion sugerido

“Cuando necesitamos interacción en tiempo real, tampoco tenemos que cambiar de stack automáticamente.

Jakarta WebSocket junto con CDI Events permite un patrón bastante limpio: el servicio crea o cambia algo, dispara un evento de dominio, y el endpoint WebSocket lo transmite a los clientes conectados.

No digo que esto reemplace todos los casos de frontend rico. Digo que para dashboards internos y notificaciones empresariales puede ser suficiente y simple.”

### Demo 2 - 30:00 a 33:00

#### Mostrar

- Login
- Pantalla de proyectos
- Crear proyecto desde UI
- Endpoint protegido
- Actualización por WebSocket, solo si el entorno está estable

#### Cierre de demo

“Esto no significa que toda aplicación deba usar Faces. Significa que no toda aplicación necesita pagar el costo de una SPA.”

## Acto 3 - El camino de producción - 33:00 a 40:00

### Objetivo

Mostrar que Jakarta EE también cubre ejecución asíncrona, trabajo desacoplado, observabilidad y despliegue.

### Slide: Concurrencia moderna

#### Mensaje

Jakarta Concurrency 3.1 se vuelve especialmente interesante con Java 21 y Virtual Threads.

#### Guion sugerido

“Una aplicación empresarial no termina cuando responde en localhost.

Tarde o temprano necesitamos trabajo asíncrono. Jakarta Concurrency 3.1 es interesante porque se encuentra con Java 21 y Virtual Threads.

Pero el punto clave es este: no se trata de crear hilos a mano y perder el contexto del runtime. El servidor sigue gestionando contexto, seguridad y ciclo de vida.”

### Slide: Trabajo desacoplado

#### Mensaje

Jakarta EE cubre varios patrones de trabajo fuera de la request HTTP.

#### Guion sugerido

“No todo debe ocurrir dentro de una request HTTP.

Si necesito desacoplar componentes, tengo JMS y MDB.

Si necesito tareas periódicas declarativas, tengo `@Schedule`.

Si necesito procesos largos, por chunks, con estado y posibilidad de reinicio, tengo Jakarta Batch.

La idea no es usar todo siempre. La idea es tener opciones estándar para distintos tipos de carga.”

### Slide: Observabilidad

#### Mensaje

GlassFish 8 complementa Jakarta EE con MicroProfile para operar la aplicación.

#### Guion sugerido

“Para operar la aplicación, GlassFish 8 integra MicroProfile.

Health, readiness y métricas en formato Prometheus permiten que la aplicación hable el idioma de plataformas cloud: probes, métricas y estado observable.

Y para cerrar el ciclo, puedo conectar esos endpoints a un stack local con Prometheus, Loki y Grafana. No es solo imprimir JSON en el navegador; es ver la aplicación desde afuera, como la vería una plataforma de operación: salud, métricas y logs en un mismo lugar.

Esto importa porque producción no es solamente empaquetar un WAR. Producción es saber si la aplicación está viva, lista y comportándose como esperamos.”

### Slide: Despliegue

#### Mensaje

GlassFish 8 ofrece un camino claro para desplegar la aplicación como contenedor.

#### Guion sugerido

“Finalmente, despliegue.

Puedo empaquetar el WAR sobre una imagen de GlassFish 8, descargar el driver MySQL en la imagen y crear el pool JDBC por `asadmin` usando variables de entorno.

La cereza no es solo que corre en Docker: es que la configuración queda reproducible y observable.”

### Demo 3 - 40:00 a 42:00

#### Mostrar

- Endpoint que dispara un reporte asíncrono
- Logs mostrando `VirtualThread`
- `/health`
- `/metrics`
- Empaquetado con GlassFish 8 + MySQL, si está listo
- Grafana mostrando readiness y métricas personalizadas
- Loki mostrando logs del contenedor

#### Cierre de demo

“La plataforma no termina en escribir endpoints. También cubre concurrencia, operación, despliegue y señales para observarla.”

## Cierre - 42:00 a 45:00

### Mensaje

La decisión madura no es SPA siempre ni server-side siempre. La decisión madura es elegir con criterio.

### Guion sugerido

“Entonces, ¿cuándo sí usar React o Angular?

Cuando aportan valor real: interacción altamente dinámica, estado complejo en cliente, equipos frontend especializados, ecosistemas de componentes ya adoptados o productos públicos con una experiencia muy rica.

Pero cuando hablamos de aplicaciones internas, administrativas, transaccionales, con seguridad fuerte, formularios, tablas y equipos Java full-stack, Jakarta EE 11 con GlassFish 8 sigue siendo una alternativa muy competitiva.

Mi cierre es este: Jakarta EE 11 no es una colección de APIs viejas.

Es una plataforma estándar para construir aplicaciones completas: API, UI, datos, seguridad, concurrencia, mensajería, batch, observabilidad y despliegue.

Todo con Java como columna vertebral.”

## Regla de recorte si el tiempo se va

Si notas que estás excediendo el tiempo, recorta en este orden:

1. Demo de WebSocket.
2. Detalle de Batch.
3. Detalle del contenedor GlassFish/MySQL.
4. Comparación React/Angular.

No recortes demasiado Jakarta Data ni Concurrency con Virtual Threads. Para una audiencia experta en Java, esos son dos de los momentos más importantes porque muestran Jakarta EE 11 como una plataforma actual.

## Frases clave para recordar

- “No se trata de prohibir herramientas externas, se trata de no traerlas por reflejo.”
- “El endpoint debe ser una frontera, no el lugar donde vive todo el negocio.”
- “CDI es el pegamento arquitectónico de la plataforma.”
- “Jakarta Data reduce ruido y aumenta intención.”
- “No toda aplicación necesita pagar el costo de una SPA.”
- “Java moderno, sí, pero dentro de un runtime empresarial.”
- “Producción no es solamente empaquetar un WAR.”
- “La decisión madura no es SPA siempre ni server-side siempre. Es elegir con criterio.”
