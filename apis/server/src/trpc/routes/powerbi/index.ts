import { trpc } from "../../trpc";
import { getAccessToken } from "./get-access-token";
import { getTemporaryAccessToken } from "./get-temporary-access-token";

export const powerbiRoutes = trpc.router({
  getTemporaryAccessToken,
});
