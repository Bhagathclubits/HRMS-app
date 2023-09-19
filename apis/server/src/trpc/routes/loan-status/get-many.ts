import { TRPCError } from "@trpc/server";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { RouterOutput } from "../../router";
import { protectedProcedure } from "../../trpc";

export type LoanStatus = RouterOutput["loanStatus"]["getMany"][0];

export const getMany = protectedProcedure.mutation(async () => {
  try {
    const loanStatus = await prisma.loanStatus.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return loanStatus;
  } catch (error) {
    console.log(getErrorMessage(error));

    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }
});
