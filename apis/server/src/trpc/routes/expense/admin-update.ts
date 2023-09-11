import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { adminOnlyProcedure } from "../../trpc";

export const insertExpenseStatus = z.object({
  id: z.number(),
  remarks: z.string(),
  statusId: z.number(),
});

export type InsertExpenseStatus = z.infer<typeof insertExpenseStatus>;

export const adminUpdate = adminOnlyProcedure
  .input(insertExpenseStatus)
  .mutation(async ({ ctx, input }) => {
    try {
      const expense = await prisma.expense.update({
        where: { id: input.id },
        data: {
          remarks: input.remarks,
          statusId: input.statusId,
        },
      });

      return expense;
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
