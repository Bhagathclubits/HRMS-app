import { trpc } from "../../trpc";
import { get } from "./get";

export const ocrRoutes = trpc.router({
  get,
});
