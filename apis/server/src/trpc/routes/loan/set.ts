import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { employeeOnlyProcedure } from "../../trpc";

export const insertLoanSchema = z.object({
  amount: z.number(),
  typeId: z.number(),
  date: z.string(),
});

export type InsertLoan = z.infer<typeof insertLoanSchema>;

export const set = employeeOnlyProcedure
  .input(insertLoanSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const status = await prisma.loanStatus.findUniqueOrThrow({
        select: {
          id: true,
        },
        where: {
          name: "pending",
        },
      });

      const loan = await prisma.loan.create({
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

      return loan;
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
