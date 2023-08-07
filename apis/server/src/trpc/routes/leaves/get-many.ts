import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { RouterOutput } from "../../router";
import { baseGetManyInputParameters } from "../../shared/base-get-many-input-parameters";
import { protectedProcedure } from "../../trpc";

const sortBys = [
  "fromDate",
  "toDate",
  "remarks",
  "noOfDays",
  "createdAt",
] as const;

const inputParameters = baseGetManyInputParameters.merge(
  z.object({ sortBy: z.enum(sortBys).optional() })
);

export type Leave = RouterOutput["leave"]["getMany"]["items"][0];
export type InputParameters = z.infer<typeof inputParameters>;

export const getMany = protectedProcedure
  .input(inputParameters.optional())
  .mutation(async ({ ctx, input }) => {
    try {
      const where =
        ctx.role === "admin"
          ? {
              user: {
                role: {
                  name: "employee",
                },
              },
            }
          : {
              userId: ctx.userId,
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
        take: input?.limit ?? 5,
        skip: (input?.page ?? 0) * (input?.limit ?? 5),
        orderBy:
          input?.sortBy && input?.sortOrder
            ? { [input.sortBy]: input.sortOrder }
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
