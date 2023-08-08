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
  };

  return complexSortBysMap[sortBy] ?? { [sortBy]: sortOrder };
};

const sortBys = ["year", "month", "statusId", "userId"] as const;

const inputParameters = baseGetManyInputParameters.merge(
  z.object({ sortBy: z.enum(sortBys).optional() })
);
export type PayRoll = RouterOutput["payRoll"]["getMany"]["items"][0];

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

      const payRolls = await prisma.payRoll.findMany({
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
                  designation: {
                    select: {
                      name: true,
                    },
                  },
                  department: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          paySlipComponents: {
            select: {
              componentType: {
                select: {
                  name: true,
                },
              },
              amount: true,
            },
          },
          year: true,
          month: true,
          status: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        take: input?.limit ?? 5,
        skip: (input?.page ?? 0) * (input?.limit ?? 5),
        orderBy:
          input?.sortBy && input?.sortOrder
            ? sortBy(input.sortBy, input.sortOrder)
            : { createdAt: "desc" },
        where,
      });

      const count = await prisma.payRoll.count({ where });

      return { totalCount: count, items: payRolls };
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
