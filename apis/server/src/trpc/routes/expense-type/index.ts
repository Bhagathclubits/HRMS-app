import { trpc } from "../../trpc";

import { getMany } from "./get-many";

export const expenseTypeRoutes = trpc.router({
  getMany,
});
