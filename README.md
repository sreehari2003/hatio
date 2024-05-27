# Hatio FTE Assignment

## Todo App with Auth and Gist Support

### Tech Stack

- Frontend
  - Next Js + Typescript
- Backend
  - Nest Js + Typescript + PostgreSQL + Prisma 


## Run Locally


- Database
```bash

 docker compose up

```


- Frontend
```bash

 cd client
 pnpm install
 pnpm run dev

```

- Backend
```bash

 cd server
 pnpm install
 pnpm run start:dev

```

### Frontend

- Added zod for schema validation
- React hook form for form handling
- Radix ui for components


### Backend

- Added auth using passport js
- Added decorators to guard routes