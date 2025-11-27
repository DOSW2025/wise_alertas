## Sobre el repositorio – Wise Alertas 

Este repositorio contiene el módulo de notificaciones y mensajería asincrónica del ecosistema ECIWISE, implementado en NestJS, con soporte para:

- Envío de correos individuales, masivos y por rol
- Registro automático de notificaciones internas
- Integración con Azure Service Bus
- Almacenamiento de notificaciones en base de datos mediante Prisma
- Plantillas dinámicas usando Handlebars
- Soporte para múltiples módulos del sistema ECIWISE

El servicio actúa como un microservicio especializado en alertas, capaz de ser extendido o acoplado con otros módulos del sistema, tales como:

- Módulo de autenticación  
- Módulo académico  
- Módulo de recursos digitales  
- Módulo de gestión de roles y permisos  

Gracias a su arquitectura modular (Bus + Alerta + Prisma), el servicio está diseñado para ser:

### Escalable
Permite agregar nuevas colas, nuevas plantillas o nuevos tipos de notificación sin modificar la estructura base.

### Reutilizable
Puede integrarse con cualquier módulo que necesite comunicación con usuarios: estudiantes, docentes, administradores o servicios automáticos.

### Adaptable
El sistema de plantillas permite personalizar fácilmente correos según el módulo que lo invoque.

### Extendible
Es posible añadir nuevos canales (por ejemplo: WhatsApp, SMS, push notifications) usando la misma estructura del Bus.

En resumen, este repositorio es la capa central de notificaciones del sistema ECIWISE, ofreciendo una forma estandarizada y robusta de enviar mensajes, registrar eventos y gestionar alertas de manera asincrónica.

##

## Documentación Nest

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


https://eciwise-events.canadacentral-1.eventgrid.azure.net/api/events


### Diagramas del Módulo


### Diagrama de contexto
![alt text](doc/imgs/DiagramaContexto.png)

**Descripción:**
Este diagrama ofrece una vista de alto nivel del sistema **Wise Alertas**, situándolo en su entorno operativo. Ilustra las interacciones principales entre el microservicio y los actores externos (usuarios y sistemas).

*   **Actor Principal (Usuario):** Representa a los estudiantes, tutores o administradores de la plataforma ECIWISE que interactúan con el sistema para consultar sus notificaciones a través de interfaces web o móviles.
*   **Sistema (Wise Alertas):** Es el núcleo de este repositorio. Actúa como una "caja negra" que centraliza la lógica de recepción de eventos, persistencia de notificaciones y despacho de correos electrónicos.
*   **Sistemas Externos:**
    *   **Azure Service Bus:** Actúa como el mecanismo de integración asíncrona. El sistema se suscribe a colas específicas (`mail.envio.individual`, `mail.envio.masivo`, `mail.envio.rol`) para recibir eventos disparados por otros microservicios de la arquitectura.
    *   **SendGrid:** Proveedor de infraestructura de correo electrónico (SaaS) utilizado para el envío fiable de emails transaccionales basados en plantillas HTML dinámicas.
    *   **PostgreSQL:** Sistema de gestión de base de datos relacional donde se almacena el historial de notificaciones, el estado de lectura y la información de usuarios necesaria para el mapeo de roles.

### Diagrama de despliegue
![alt text](doc/imgs/DiagramaDespliegue.png)

**Descripción:**
Este diagrama modela la arquitectura física y la distribución de los artefactos de software en la infraestructura de nube (Azure).

*   **Nodo de Computación (App Service / Container Instance):** El microservicio `wise_alertas` (NestJS) se ejecuta dentro de un entorno contenerizado o un servicio de aplicaciones en Azure. Este nodo es responsable de mantener los listeners de mensajería activos y exponer la API REST.
*   **Nodo de Datos (Azure Database for PostgreSQL):** Instancia gestionada de PostgreSQL que garantiza la persistencia, integridad y alta disponibilidad de los datos de notificaciones y usuarios. La conexión se realiza mediante TCP en el puerto estándar 5432.
*   **Nodo de Mensajería (Azure Service Bus):** Infraestructura de mensajería empresarial que desacopla los productores de eventos del microservicio de alertas. Se detallan las tres colas principales que alimentan el sistema.
*   **Servicio Externo (SendGrid):** Nube de terceros conectada vía HTTPS para la entrega final de correos electrónicos a los usuarios.

### Diagrama de Componentes Especificos
![alt text](doc/imgs/DiagramaComponentes.png)

**Descripción:**
Este diagrama desglosa la estructura interna del microservicio, mostrando cómo se organizan y comunican los módulos de NestJS.

*   **Módulo de Bus (`BusModule`):** Contiene los servicios especializados (`MailEnvioIndividual`, `MailEnvioMasivo`, `MailEnvioRol`) que heredan de una clase base (`BaseBusService`). Estos componentes actúan como *consumers* o *listeners* que transforman los mensajes AMQP entrantes en llamadas a la lógica de negocio.
*   **Módulo de Alerta (`AlertaModule`):**
    *   **AlertaController:** Expone la interfaz REST para el frontend, manejando peticiones HTTP para lectura y actualización de estado de notificaciones.
    *   **AlertaService:** Centraliza la lógica de negocio. Orquesta la creación de registros en la base de datos (vía `PrismaService`) y el envío de correos (vía cliente de SendGrid).
*   **Capa de Datos (`PrismaService`):** Abstracción ORM que facilita la comunicación con PostgreSQL, permitiendo operaciones tipadas y seguras sobre las entidades.

### Diagrama de Casos de Uso
![alt text](doc/imgs/DiagramaCasosUso.png)

**Descripción:**
Este diagrama captura la funcionalidad del sistema desde la perspectiva de sus actores, definiendo el alcance funcional del microservicio.

*   **Actor Usuario:**
    *   **Gestión de Notificaciones:** Los usuarios pueden visualizar su historial de notificaciones, ver un contador en tiempo real de alertas no leídas (útil para indicadores de UI como "campanitas"), marcar notificaciones específicas o todas como leídas, y eliminar alertas que ya no son relevantes.
*   **Actor Sistema Externo (Service Bus):**
    *   **Procesamiento de Eventos:** El sistema reacciona automáticamente ante la llegada de mensajes a las colas. Se identifican tres casos de uso principales según el tipo de destinatario: envío a un usuario específico, envío masivo a una lista de correos, y envío dinámico basado en el rol del usuario (ej. "enviar a todos los tutores").
    *   **Acciones Automáticas:** Cada evento procesado desencadena dos acciones implícitas: el envío del correo electrónico correspondiente y, opcionalmente, el registro de la notificación en la base de datos para su visualización en la plataforma.

### Diagrama de Clases
![alt text](doc/imgs/DiagramaClases.png)

**Descripción:**
Este diagrama representa la estructura estática del código fuente, detallando las clases clave, sus atributos, métodos y relaciones de dependencia o herencia.

*   **Patrón Controller-Service:** Se evidencia la separación de responsabilidades donde `AlertaController` maneja la capa de transporte HTTP y delega en `AlertaService` la lógica pura.
*   **Jerarquía de Listeners:** Muestra cómo `MailEnvioIndividual`, `MailEnvioMasivo` y `MailEnvioRol` extienden de la clase abstracta `BaseBusService`, promoviendo la reutilización de código para la conexión y gestión de errores con Azure Service Bus.
*   **DTOs (Data Transfer Objects):** Aunque simplificados en el diagrama, representan las estructuras de datos (`UnicoMailDto`, `MasivoMailDto`) que aseguran el tipado estricto de los mensajes recibidos.
*   **Modelos de Dominio:** Representación de las entidades `Notification` y `Usuario` tal como son manipuladas por el ORM y el servicio.

### Diagrama de Base de Datos
![alt text](doc/imgs/DiagramaBaseDatos.png)

**Descripción:**
Este diagrama Entidad-Relación describe el esquema de datos implementado en PostgreSQL y gestionado por Prisma.

*   **Entidad `usuarios`:** Tabla central que almacena la información de perfil, autenticación (Google ID) y relaciones jerárquicas con `roles` y `estados_usuario`.
*   **Entidad `Notification`:** Tabla transaccional diseñada para almacenar las alertas generadas.
    *   **Relación:** Existe una relación de **uno a muchos** entre `usuarios` y `Notification` (un usuario puede tener muchas notificaciones, pero una notificación pertenece a un único usuario).
    *   **Clave Compuesta/Índices:** El diseño optimiza las consultas por `userId` para recuperar rápidamente el historial de un usuario específico.
*   **Tablas Catálogo (`roles`, `estados_usuario`):** Tablas maestras que normalizan la información de tipos de usuario y estados de cuenta, asegurando la integridad referencial.