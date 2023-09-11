import { trpc } from "../../trpc";

import { getMany } from "./get-many";

export const expenseStatusRoutes = trpc.router({
  getMany,
});
