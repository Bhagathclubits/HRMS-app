import { TRPCError } from "@trpc/server";
// import axios from "axios";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { adminOnlyProcedure } from "../../trpc";

export const getTemporaryAccessToken = adminOnlyProcedure.mutation(
  async ({ ctx, input }) => {
    try {
      const [first] = await prisma.powerBI.findMany({
        select: {
          accessToken: true,
        },
      });

      if (!first) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      return { token: first.accessToken };
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }
);
