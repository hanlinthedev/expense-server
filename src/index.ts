import swagger from "@elysiajs/swagger";
import { logger } from "@rasla/logify";
import { Elysia } from 'elysia';
import { StatusCodes } from "http-status-codes";
import { budget } from "./features/budget";
import { expense } from "./features/expense";
import { user } from './features/user';
import { database } from './plugins/db';
import { APIError } from "./utils/error";

const app = new Elysia({ prefix: '/api' })
  .error({  APIError })
  .onError({ as: 'global' }, ({ error, request, set, code }) => {
  

    let message = 'Unknown error';
    set.status = StatusCodes.INTERNAL_SERVER_ERROR;
    console.log(code,error)

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
  .use(swagger())
  .use(database)
  .group('/auth', (authApp) => authApp.use(user))
  .group('/budget', (budgetApp) => budgetApp.use(budget))
  .group('/expense', (expenseApp) => expenseApp.use(expense))

const port = process.env.PORT || 3000
app.listen(port)
console.log(`🦊 🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} 🦊 🦊 `)
console.log(`View documentation at "${app.server!.url}api/swagger" in your browser`)