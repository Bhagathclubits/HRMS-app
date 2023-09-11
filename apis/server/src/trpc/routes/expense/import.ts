import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { RouterOutput } from "../../router";
import { adminOnlyProcedure } from "../../trpc";

const inputParameters = z.array(
  z.object({
    userId: z.number(),
    type: z.string(),
    date: z.string(),
    amount: z.number(),
    remarks: z.string().optional(),
    status: z.string(),
  })
);

export type ImportExpense = RouterOutput["expense"]["import"];

export type InputParameters = z.infer<typeof inputParameters>;

export const importExpense = adminOnlyProcedure
  .input(inputParameters)
  .mutation(async ({ ctx, input }) => {
    try {
      return await prisma.$transaction(async (tx) => {
        await Promise.all(
          input.map(async (item) => {
            const { id: typeId } = await tx.expenseType.findFirstOrThrow({
              select: {
                id: true,
              },
              where: {
                name: item.type,
              },
            });

            const { id: statusId } = await tx.expenseStatus.findFirstOrThrow({
              select: {
                id: true,
              },
              where: {
                name: item.status,
              },
            });

            const { type, status, ...restOfItem } = item;

            const expense = {
              ...restOfItem,
              typeId,
              statusId,
              date: new Date(item.date),
              createdById: ctx.userId,
              updatedById: ctx.userId,
            };

            return tx.expense.upsert({
              create: expense,
              update: expense,
              where: {
                userId_typeId_date: {
                  userId: expense.userId,
                  typeId,
                  date: expense.date,
                },
              },
            });
          })
        );
      });
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
