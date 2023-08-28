import { trpc } from "../../trpc";
import { adminUpdate } from "./admin-update";
import { getMany } from "./get-many";
import { set } from "./set";

export const visitorPassRoutes = trpc.router({
  getMany,
  set,
  adminUpdate,
});
