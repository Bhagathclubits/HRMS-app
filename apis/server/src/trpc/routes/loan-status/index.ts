import { trpc } from "../../trpc";

import { getMany } from "./get-many";

export const loanStatusRoutes = trpc.router({
  getMany,
});
