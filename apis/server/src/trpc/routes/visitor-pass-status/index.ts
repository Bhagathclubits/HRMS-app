import { trpc } from "../../trpc";
import { getMany } from "./get-many";

export const visitorPassStatusRoutes = trpc.router({ getMany });
