
# Task Management System – Backend

REST API for a task management application with authentication, role-based access, and task CRUD operations.


## Tech Stack

- NestJS
- Node.js
- PostgreSQL
- TypeORM
- JWT Authentication
- Vercel (For deployment)


## Features

- User authentication (JWT)
- Role-based authorization
- Create, update, delete tasks
- Task status management
- Input validation and error handling


## Folder structure
```tree
src/
├─ auth/
    ├─ auth.controller.ts
    ├─ auth.module.ts
    ├─ auth.service.ts
    ├─ jwt.strategy.ts
    ├─ user.dto.ts
    ├─ user.entity.ts
├─ common/
    └─ decorators/
        ├─ getUser-decorator.ts
        ├─ index.ts
├─ tasks/
    ├─ task.controller.ts
    ├─ task.service.ts
    ├─ task.module.ts
    ├─ task.entity.ts
    ├─ task.dto.ts
├─ app.module.ts
└─ main.ts
```````

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`EXPIRES_IN`

`JWT_SECRET`

`DATABASE_URL` (Postgres db url)

`CLIENT_URL`

`PORT`
## Installation

Install my-project with npm

```bash
  git clone https://github.com/shahzaibalijamro/task-management-system.git
  cd task-management-system
  npm install
  npm run start:dev
```
    
## API Endpoints

POST /auth/signin  
POST /auth/signup  

GET /task  
GET /task/:id  
POST /task  
DELETE /task/:id  
PATCH /task/:id
## Related

Here is the frontend repo of the project

[Frontend](https://github.com/shahzaibalijamro/TaskWiz-frontend.git)

## Lessons Learned

This project was my first hands-on experience with NestJS, and it helped me understand how a scalable backend is structured in a real-world application.

I learned how NestJS enforces modular architecture using modules, controllers, and services, and how dependency injection simplifies code organization and testing. Implementing JWT-based authentication and role-based authorization improved my understanding of security patterns and request lifecycle handling.

One of the main challenges was structuring the project correctly from the beginning and understanding how different modules interact with each other. I also faced issues with environment configuration, database connections, and CORS during deployment. These were resolved by carefully reading NestJS documentation, debugging logs, and refining configuration files for different environments.

Overall, this project strengthened my backend fundamentals and gave me confidence in building structured, maintainable APIs using NestJS.
