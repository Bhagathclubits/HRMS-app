import { trpc } from "../../trpc";

import { getMany } from "./get-many";

export const travelStatusRoutes = trpc.router({
  getMany,
});
