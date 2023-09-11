import { TRPCError } from "@trpc/server";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { RouterOutput } from "../../router";
import { protectedProcedure } from "../../trpc";

export type ExpenseStatus = RouterOutput["expenseStatus"]["getMany"][0];

export const getMany = protectedProcedure.mutation(async () => {
  try {
    const expenseStatus = await prisma.expenseStatus.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return expenseStatus;
  } catch (error) {
    console.log(getErrorMessage(error));

    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }
});
