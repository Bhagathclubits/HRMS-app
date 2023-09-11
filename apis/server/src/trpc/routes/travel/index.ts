import { trpc } from "../../trpc";
import { adminUpdate } from "./admin-update";
import { getMany } from "./get-many";
import { importTravel } from "./import";
import { set } from "./set";

export const travelRoutes = trpc.router({
  adminUpdate,
  getMany,
  import: importTravel,
  set,
});
