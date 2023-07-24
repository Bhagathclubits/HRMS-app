import { TRPCClientError } from "@trpc/client";
import { AuthContextValue } from "../hooks/UseAuth";

export const handleTRPCError = (error: unknown, auth: AuthContextValue) => {
  if (
    error &&
    error instanceof TRPCClientError &&
    "message" in error &&
    error.message === "UNAUTHORIZED"
  ) {
    auth.dispatcher({ type: "reset-user" });
  }
};
