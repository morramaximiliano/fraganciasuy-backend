# Backend Perfumería

API REST profesional para gestión de una perfumería, construida con Node.js y Express, pensada para administrar catálogo, usuarios, pedidos, carrito y pagos con Mercado Pago. El proyecto combina una arquitectura modular por capas, autenticación segura con JWT y persistencia relacional con PostgreSQL y Sequelize.

## Lo que resuelve

Este backend centraliza la operación de un e-commerce de perfumería con foco en:

- Autenticación y autorización por roles.
- Gestión de usuarios y perfiles.
- Administración de marcas, categorías, productos y SKUs.
- Carrito de compra y sincronización de items.
- Órdenes de compra y confirmación de pago.
- Integración con Mercado Pago para generar preferencias de pago.
- Validación robusta de datos de entrada.

## Tecnologías utilizadas

- Node.js
- Express 5
- PostgreSQL
- Sequelize ORM
- JWT para autenticación
- bcrypt para hash de contraseñas
- Joi para validación de schemas
- dotenv para variables de entorno
- CORS para control de origen
- Mercado Pago SDK
- UUID
- ESLint y Prettier para calidad de código
- Sequelize CLI para migraciones

## Características destacadas

- Autenticación basada en token con expiración.
- Roles de usuario para proteger endpoints administrativos.
- Arquitectura separada por responsabilidades: rutas, servicios, middlewares, modelos y schemas.
- Validaciones por capa antes de llegar a la lógica de negocio.
- Integración de pagos lista para producción con token por entorno.
- Diseño preparado para escalar con nuevas entidades y endpoints.

## Estructura del proyecto

- `index.js`: punto de entrada del servidor.
- `routes/`: definición de endpoints HTTP.
- `service/`: lógica de negocio.
- `middlewares/`: autenticación, autorización, validación y manejo de errores.
- `schema/`: validaciones con Joi.
- `db/models/`: modelos Sequelize y asociaciones.
- `db/migrations/`: migraciones de base de datos.
- `env-config/`: lectura centralizada de variables de entorno.
- `libs/`: configuración de Sequelize y conexión a PostgreSQL.

## Principales módulos

### Autenticación

- Registro de usuarios.
- Login con generación de JWT.
- Perfil autenticado con `/auth/me`.

### Usuarios

- Listado de usuarios.
- Consulta de un usuario por ID.
- Alta, edición y eliminación con control de rol.

### Catálogo

- Marcas.
- Categorías.
- Productos.
- SKUs.

### Carrito y pedidos

- Carrito por usuario autenticado.
- Sincronización de carrito.
- Creación y seguimiento de órdenes.
- Confirmación de pago.

### Pagos

- Generación de preferencias de Mercado Pago.
- Respuesta segura si falta la credencial por entorno.

## Requisitos previos

- Node.js 18 o superior.
- PostgreSQL 14 o superior.
- Una cuenta de Mercado Pago para obtener el access token.

## Instalación

1. Clona el repositorio.
2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz con estas variables:

```env
NODE_ENV=dev
PORT=3000
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_NAME=perfumeria_db
DB_PORT=5432
JWT_SECRET=tu_secreto_jwt
MERCADO_PAGO_ACCESS_TOKEN=tu_access_token_de_mercado_pago
```

4. Ejecuta las migraciones de Sequelize según tu flujo local.
5. Levanta el servidor:

```bash
npm start
```

## Scripts

- `npm start`: inicia el servidor.
- `npm run lint`: ejecuta ESLint.

## Variables de entorno

- `NODE_ENV`: entorno de ejecución.
- `PORT`: puerto del servidor.
- `DB_USER`: usuario de PostgreSQL.
- `DB_PASSWORD`: contraseña de PostgreSQL.
- `DB_HOST`: host de la base de datos.
- `DB_NAME`: nombre de la base de datos.
- `DB_PORT`: puerto de PostgreSQL.
- `JWT_SECRET`: clave para firmar y verificar tokens.
- `MERCADO_PAGO_ACCESS_TOKEN`: credencial privada para crear preferencias de pago.

## Base de API

La API expone sus endpoints bajo:

```text
/api/v1
```

### Módulos disponibles

- `/auth`
- `/users`
- `/cart`
- `/payments`
- `/orders`
- `/brands`
- `/products`
- `/skus`
- `/categories`

## Seguridad y buenas prácticas

- Contraseñas almacenadas con hash bcrypt.
- Tokens JWT firmados con secreto por entorno.
- Protección de rutas administrativas con middleware de rol.
- Validación de payloads con Joi antes de persistir datos.
- Integración con pagos sin credenciales hardcodeadas.

## Valor del proyecto

Este backend no es solo una API funcional: está preparado para sostener un flujo real de e-commerce con separación de responsabilidades, seguridad, escalabilidad y una integración de pagos lista para conectar con frontend. Es una buena base para presentar como proyecto profesional, portafolio o producto inicial para una tienda online.

## Notas

- La variable `MERCADO_PAGO_ACCESS_TOKEN` es obligatoria para usar el módulo de pagos.
- Si falta la configuración de Mercado Pago, el endpoint responderá con un error explícito para evitar fallos silenciosos.

## Próximos pasos sugeridos

- Agregar documentación de endpoints con ejemplos de request y response.
- Incluir colección de Postman o Insomnia.
- Crear un `.env.example` para facilitar el setup.
- Publicar una demo con despliegue en producción.
