import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { adminOnlyProcedure } from "../../trpc";

export const insertLoanStatus = z.object({
  id: z.number(),
  remarks: z.string(),
  statusId: z.number(),
});

export type InsertLoanStatus = z.infer<typeof insertLoanStatus>;

export const adminUpdate = adminOnlyProcedure
  .input(insertLoanStatus)
  .mutation(async ({ ctx, input }) => {
    try {
      const loan = await prisma.loan.update({
        where: { id: input.id },
        data: {
          remarks: input.remarks,
          statusId: input.statusId,
        },
      });

      return loan;
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
