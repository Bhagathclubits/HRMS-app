import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { RouterOutput } from "../../router";
import { adminOnlyProcedure } from "../../trpc";

const inputParameters = z.array(
  z.object({
    userId: z.number(),
    fromDate: z.string(),
    toDate: z.string(),
    place: z.string(),
    remarks: z.string().optional(),
    status: z.string(),
  })
);

export type ImportTravel = RouterOutput["travel"]["import"];

export type InputParameters = z.infer<typeof inputParameters>;

export const importTravel = adminOnlyProcedure
  .input(inputParameters)
  .mutation(async ({ ctx, input }) => {
    try {
      return await prisma.$transaction(async (tx) => {
        await Promise.all(
          input.map(async (item) => {
            const { id: statusId } = await tx.travelStatus.findFirstOrThrow({
              select: {
                id: true,
              },
              where: {
                name: item.status,
              },
            });

            const { status, ...restOfItem } = item;

            const travel = {
              ...restOfItem,
              fromDate: new Date(item.fromDate),
              toDate: new Date(item.toDate),
              statusId,

              createdById: ctx.userId,
              updatedById: ctx.userId,
            };

            return tx.travel.upsert({
              create: travel,
              update: travel,
              where: {
                userId_fromDate_toDate: {
                  userId: travel.userId,
                  fromDate: travel.fromDate,
                  toDate: travel.toDate,
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
