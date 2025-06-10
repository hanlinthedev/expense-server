import swagger from "@elysiajs/swagger";
import { logger } from "@rasla/logify";
import { Elysia } from 'elysia';
import { StatusCodes } from "http-status-codes";
import { PORT } from "./_constant";
import { category } from "./features/category";
import { expense } from "./features/expense";
import { income } from "./features/income";
import { user } from './features/user';
import { database } from './plugins/db';
import { APIError } from "./utils/error";

const app = new Elysia()
  .error({ APIError })
  .onError({ as: 'global' }, ({ error, request, set, code }) => {

    let message = 'Unknown error';
    set.status = StatusCodes.INTERNAL_SERVER_ERROR;
    console.log(code, error)

    switch (code) {
      case 'NOT_FOUND':
        set.status = StatusCodes.NOT_FOUND;
        message = `${request.method} ${request.url} is not a valid endpoint.`;
        break;
      case 'PARSE':
        set.status = error.status;
        message = error.message;
        break;
      case 'VALIDATION':
        set.status = StatusCodes.BAD_REQUEST;
        message = "Invalid Req Body";
        break;
      case 'APIError':
        set.status = error.httpCode
        message = error.message;
        break;
    }

    return Response.json(
      { message },
    );
  })
  .use(logger())
  .use(swagger({
    scalarConfig: {
      authentication: {
        http: {
          basic: {
            username: "admin",
            password: "admin"
          },
          bearer: {

            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzA4ZDcwNC02MDViLTQ2ZTctOWY4YS01YjVkZTYxOWM3NzciLCJpYXQiOjE3NDk1NjY3MzYsImV4cCI6MTc0OTY1MzEzNn0.JVe4NYs78fdD-MhQLfjem0MHpiZOBoVkDqcVUGF1mpU"
          },
        }
      },
    },
    documentation: {
      info: {
        title: 'Budget API',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'

          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ],
      tags: [
        {
          name: 'User',
          description: 'User related endpoints',
        },
        {
          name: 'Category',
          description: 'Category related endpoints',
        },
        {
          name: 'Income',
          description: 'Income related endpoints',
        },
        {
          name: 'Expense',
          description: 'Expense related endpoints',
        },
      ],
    },
  }))
  .use(database)
  .group('/api/auth', (authApp) => authApp.use(user))
  .group('/api/incomes', (budgetApp) => budgetApp.use(income))
  .group('/api/expenses', (expenseApp) => expenseApp.use(expense))
  .group('/api/categories', (categoryApp) => categoryApp.use(category))

app.listen(PORT || 3000)
console.log(`🦊 🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} 🦊 🦊 `)
console.log(`View documentation at "${app.server!.url}swagger" in your browser`)