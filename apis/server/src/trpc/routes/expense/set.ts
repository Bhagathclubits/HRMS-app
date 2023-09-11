import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { employeeOnlyProcedure } from "../../trpc";

export const insertExpenseSchema = z.object({
  amount: z.number(),
  typeId: z.number(),
  date: z.string(),
});

export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export const set = employeeOnlyProcedure
  .input(insertExpenseSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const status = await prisma.expenseStatus.findUniqueOrThrow({
        select: {
          id: true,
        },
        where: {
          name: "pending",
        },
      });

      const expense = await prisma.expense.create({
        data: {
          userId: ctx.userId,
          typeId: input.typeId,
          amount: input.amount,
          date: new Date(input.date),
          statusId: status.id,
          createdById: ctx.userId,
          updatedById: ctx.userId,
        },
        select: {
          userId: true,
          id: true,
          date: true,
          amount: true,
          type: {
            select: {
              name: true,
            },
          },
          status: {
            select: {
              name: true,
            },
          },
        },
      });

      return expense;
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
