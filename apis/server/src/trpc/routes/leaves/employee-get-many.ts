import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { RouterOutput } from "../../router";
import { baseGetManyInputParameters } from "../../shared/base-get-many-input-parameters";
import { protectedProcedure } from "../../trpc";

const sortBy = (sortBy: string, sortOrder: "asc" | "desc") => {
  const complexSortBysMap: Record<string, unknown> = {
    statusId: { status: { name: sortOrder } },
    userId: { user: { personalInfo: { firstName: sortOrder } } },
    leaveTypeId: { leaveType: { name: sortOrder } },
    daysAlloted: { leaveType: { daysAlloted: sortOrder } },
  };

  return complexSortBysMap[sortBy] ?? { [sortBy]: sortOrder };
};

const sortBys = [
  "fromDate",
  "toDate",
  "remarks",
  "noOfDays",
  "createdAt",
  "statusId",
  "userId",
  "leaveTypeId",
  "daysAlloted",
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

export type Leave = RouterOutput["leave"]["getMany"]["items"][0];
export type InputParameters = z.infer<typeof inputParameters>;

export const employeeGetMany = protectedProcedure
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
        user: {
          role: {
            name: "employee",
          },
        },
      };

      const leaves = await prisma.leave.findMany({
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              personalInfo: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  imageUrl: true,
                },
              },
            },
          },
          leaveType: {
            select: {
              id: true,
              name: true,
              daysAlloted: true,
            },
          },
          createdAt: true,
          fromDate: true,
          toDate: true,
          status: {
            select: {
              id: true,
              name: true,
            },
          },
          remarks: true,
          noOfDays: true,
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

      const count = await prisma.leave.count({ where });

      return { totalCount: count, items: leaves };
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
