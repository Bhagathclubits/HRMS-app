import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { employeeOnlyProcedure } from "../../trpc";

export const insertVisitorPassSchema = z.object({
  imageUrl: z.string().optional(),
  name: z.string(),
  fromPlace: z.string(),
  companyId: z.number(),
  hrId: z.number(),
  mobileNumber: z.string(),
  date: z.string(),
  inTime: z.string(),
  outTime: z.string(),
  reason: z.string(),
});

export type insertVisitorPass = z.infer<typeof insertVisitorPassSchema>;

export const set = employeeOnlyProcedure
  .input(insertVisitorPassSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const { id: pendingStatusId } =
        await prisma.visitorPassStatus.findFirstOrThrow({
          select: {
            id: true,
          },
          where: {
            name: "pending",
          },
        });

      const visitorPass = await prisma.visitorPass.create({
        data: {
          imageUrl: input.imageUrl,
          name: input.name,
          fromPlace: input.fromPlace,
          companyId: input.companyId,
          hrId: input.hrId,
          mobileNumber: input.mobileNumber,
          date: new Date(input.date),
          inTime: new Date(input.inTime),
          outTime: new Date(input.outTime),
          statusId: pendingStatusId,
          reason: input.reason,
          createdById: ctx.userId,
          updatedById: ctx.userId,
        },
        select: {
          id: true,
          name: true,
          fromPlace: true,
          mobileNumber: true,
          date: true,
          inTime: true,
          outTime: true,
          reason: true,
          company: {
            select: {
              name: true,
            },
          },
          hr: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
              companyId: true,
            },
          },
        },
      });

      return visitorPass;
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
