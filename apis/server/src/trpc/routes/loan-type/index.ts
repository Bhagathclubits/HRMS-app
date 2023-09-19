import { trpc } from "../../trpc";

import { getMany } from "./get-many";

export const loanTypeRoutes = trpc.router({
  getMany,
});
