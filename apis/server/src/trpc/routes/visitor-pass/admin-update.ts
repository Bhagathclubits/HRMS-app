import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { adminOnlyProcedure } from "../../trpc";

export const insertVisitorPassStatus = z.object({
  id: z.number(),
  remarks: z.string(),
  statusId: z.number(),
});

export type InsertVisitorPassStatus = z.infer<typeof insertVisitorPassStatus>;

export const adminUpdate = adminOnlyProcedure
  .input(insertVisitorPassStatus)
  .mutation(async ({ ctx, input }) => {
    try {
      const visitorPass = await prisma.visitorPass.update({
        where: { id: input.id },
        data: {
          remarks: input.remarks,
          statusId: input.statusId,
        },
      });

      return visitorPass;
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
