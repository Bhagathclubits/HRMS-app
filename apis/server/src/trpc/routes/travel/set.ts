import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { employeeOnlyProcedure } from "../../trpc";

export const insertTravelSchema = z.object({
  fromDate: z.string(),
  toDate: z.string(),
  place: z.string(),
});

export type InsertTravel = z.infer<typeof insertTravelSchema>;

export const set = employeeOnlyProcedure
  .input(insertTravelSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const status = await prisma.travelStatus.findUniqueOrThrow({
        select: {
          id: true,
        },
        where: {
          name: "pending",
        },
      });
      const travel = await prisma.travel.create({
        data: {
          userId: ctx.userId,
          place: input.place,
          fromDate: new Date(input.fromDate),
          toDate: new Date(input.toDate),
          remarks: "",
          statusId: status.id,
          createdById: ctx.userId,
          updatedById: ctx.userId,
        },
        select: {
          userId: true,
          id: true,
          place: true,
          fromDate: true,
          toDate: true,

          status: {
            select: {
              name: true,
            },
          },
        },
      });
      return travel;
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
