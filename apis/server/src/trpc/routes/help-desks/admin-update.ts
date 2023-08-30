import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { adminOnlyProcedure } from "../../trpc";
export const insertHelpDeskStatus = z.object({
  id: z.number(),

  remarks: z.string(),
  statusId: z.number(),
});

export type InsertHelpDesk = z.infer<typeof insertHelpDeskStatus>;

export const adminUpdate = adminOnlyProcedure
  .input(insertHelpDeskStatus)
  .mutation(async ({ ctx, input }) => {
    try {
      const helpdesk = await prisma.helpDesk.update({
        where: { id: input.id },
        data: {
          remarks: input.remarks,
          statusId: input.statusId,
        },
      });

      return helpdesk;
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
