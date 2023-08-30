import { trpc } from "../../trpc";
import { getMany } from "./get-many";
import { importIdentification } from "./import";
import { set } from "./set";
import { setMany } from "./set-many";

export const identificationRoutes = trpc.router({
  getMany,
  import: importIdentification,
  set,
  setMany,
});
