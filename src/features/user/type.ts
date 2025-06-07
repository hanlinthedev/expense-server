import { User } from "../../../prisma/generated/prisma";

export type SignInUser = Pick<User , "id" | "name" | "email">