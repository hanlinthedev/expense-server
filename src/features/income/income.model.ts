import Elysia, { t } from "elysia";

const incomeModel = t.Object({
   id: t.String(),
   amount: t.Number(),
   categoryId: t.String(),
   receivedAt: t.Date({
      format: 'date-time'
   }),
   userId: t.String(),
})

export type TIncomeModel = typeof incomeModel.static

const createIncomeModel = t.Object({
   amount: t.Number(),
   categoryId: t.Optional(t.String()),
   description: t.String(),
   receivedAt: t.Date({
      format: 'date-time'
   }),
})

export type TCreateIncomeModel = typeof createIncomeModel.static

export const IncomeModel = new Elysia().model({
   'income': incomeModel,
   'income.create': createIncomeModel
})