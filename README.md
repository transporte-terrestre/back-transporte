# Backend Transporte Terrestre

Backend para el sistema de transporte terrestre, construido con **NestJS** y **Drizzle ORM**.

## Requisitos Previos

- Node.js (>= 20.0.0)
- npm (>= 10.0.0)
- PostgreSQL

## Instalación

1.  Clonar el repositorio.
2.  Instalar dependencias:

```bash
npm install
```

3.  Configurar las variables de entorno:
    - Copia el archivo `.env.example` a `.env`.
    - Actualiza los valores en `.env` con tu configuración local (base de datos, puerto, etc.).

## Base de Datos

Comandos para gestionar la base de datos:

- **Crear base de datos**:

  ```bash
  npm run db:create
  ```

- **Sembrar datos iniciales (Seed)**:

  ```bash
  npm run db:seed
  ```

- **Resetear base de datos** (Borra y recrea):

  ```bash
  npm run db:reset
  ```

- **Ver Base de Datos (Drizzle Studio)**:
  ```bash
  npm run db:studio
  ```

## Ejecución

- **Modo Desarrollo** (con recarga automática):

  ```bash
  npm run start:dev
  ```

- **Modo Producción**:
  ```bash
  npm run build
  npm run start:prod
  ```
