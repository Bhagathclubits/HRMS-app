import { trpc } from "../../trpc";
import { adminUpdate } from "./admin-uppdate";
import { employeeGetMany } from "./employee-get-many";
import { get } from "./get";
import { getMany } from "./get-many";
import { importLeave } from "./import";
import { set } from "./set";

export const leaveRoutes = trpc.router({
  adminUpdate,
  employeeGetMany,
  get,
  getMany,
  import: importLeave,
  set,
});
