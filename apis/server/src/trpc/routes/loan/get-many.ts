import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { RouterOutput } from "../../router";
import { baseGetManyInputParameters } from "../../shared/base-get-many-input-parameters";
import { protectedProcedure } from "../../trpc";

const sortBy = (sortBy: string, sortOrder: "asc" | "desc") => {
  const complexSortBysMap: Record<string, unknown> = {
    typeId: { type: { name: sortOrder } },
    userId: { user: { personalInfo: { firstName: sortOrder } } },
    statusId: { status: { name: sortOrder } },
  };

  return complexSortBysMap[sortBy] ?? { [sortBy]: sortOrder };
};

const sortBys = [
  "amount",
  "typeId",
  "id",
  "remarks",
  "date",
  "userId",
  "statusId",
] as const;

const inputParameters = baseGetManyInputParameters.merge(
  z.object({
    limit: z.number().optional(),
    page: z.number().optional(),
    sortBy: z.enum(sortBys).optional(),
  })
);

export type Loan = RouterOutput["loan"]["getMany"]["items"][0];

export type InputParameters = z.infer<typeof inputParameters>;

export const getMany = protectedProcedure
  .input(inputParameters.optional())
  .mutation(async ({ ctx, input }) => {
    try {
      const where = {
        ...(ctx.role === "admin"
          ? {
              user: {
                role: {
                  name: "employee",
                },
              },
            }
          : {
              userId: ctx.userId,
            }),
      };

      const loan = await prisma.loan.findMany({
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
          date: true,
          amount: true,
          remarks: true,
          type: {
            select: {
              id: true,
              name: true,
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

      const count = await prisma.loan.count({ where });

      return { totalCount: count, items: loan };
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
