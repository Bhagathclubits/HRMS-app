import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { RouterOutput } from "../../router";
import { baseGetManyInputParameters } from "../../shared/base-get-many-input-parameters";
import { protectedProcedure } from "../../trpc";

const sortBy = (sortBy: string, sortOrder: "asc" | "desc") => {
  const complexSortBysMap: Record<string, unknown> = {
    companyId: { company: { name: sortOrder } },
    hrId: { hr: { user: { name: sortOrder } } },
    statusId: { status: { name: sortOrder } },
  };

  return complexSortBysMap[sortBy] ?? { [sortBy]: sortOrder };
};

const sortBys = [
  "name",
  "date",
  "inTime",
  "outTime",
  "fromPlace",
  "mobileNumber",
  "reason",
  "remarks",
  "hrId",
  "companyId",
  "statusId",
] as const;

const inputParameters = baseGetManyInputParameters.merge(
  z.object({
    limit: z.number().optional(),
    page: z.number().optional(),
    sortBy: z.enum(sortBys).optional(),
    fromDate: z.date().optional(),
    toDate: z.date().optional(),
  })
);
export type VisitorPass = RouterOutput["visitorPass"]["getMany"]["items"][0];

export type InputParameters = z.infer<typeof inputParameters>;

export const getMany = protectedProcedure
  .input(inputParameters.optional())
  .mutation(async ({ ctx, input }) => {
    try {
      const where = {
        ...(input?.fromDate && input?.toDate
          ? {
              createdAt: {
                gte: input.fromDate,
                lt: input.toDate,
              },
            }
          : {}),
      };

      const visitorPasses = await prisma.visitorPass.findMany({
        select: {
          id: true,
          name: true,
          imageUrl: true,
          fromPlace: true,
          mobileNumber: true,
          date: true,
          inTime: true,
          outTime: true,
          reason: true,
          remarks: true,
          company: {
            select: {
              id: true,
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
          status: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        ...(input?.limit !== undefined && input?.page !== undefined
          ? {
              take: input.limit,
              skip: input.page * input.limit,
            }
          : {}),
        orderBy:
          input?.sortBy && input?.sortOrder
            ? sortBy(input.sortBy, input.sortOrder)
            : { createdAt: "desc" },
        where,
      });

      const count = await prisma.visitorPass.count();

      return { totalCount: count, items: visitorPasses };
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
