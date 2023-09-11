import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { adminOnlyProcedure } from "../../trpc";

export const insertTravelStatus = z.object({
  id: z.number(),
  remarks: z.string(),
  statusId: z.number(),
});

export type InsertTravelStatus = z.infer<typeof insertTravelStatus>;

export const adminUpdate = adminOnlyProcedure
  .input(insertTravelStatus)
  .mutation(async ({ ctx, input }) => {
    try {
      const travel = await prisma.travel.update({
        where: { id: input.id },
        data: {
          remarks: input.remarks,
          statusId: input.statusId,
        },
      });

      return travel;
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
