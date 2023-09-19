import { trpc } from "../../trpc";
import { adminUpdate } from "./admin-update";
import { getMany } from "./get-many";
import { importLoan } from "./import";
import { set } from "./set";

export const loanRoutes = trpc.router({
  adminUpdate,
  getMany,
  import: importLoan,
  set,
});
