import { trpc } from "../../trpc";
import { adminUpdate } from "./admin-update";
import { getMany } from "./get-many";
import { importExpense } from "./import";
import { set } from "./set";

export const expenseRoutes = trpc.router({
  adminUpdate,
  getMany,
  import: importExpense,
  set,
});
