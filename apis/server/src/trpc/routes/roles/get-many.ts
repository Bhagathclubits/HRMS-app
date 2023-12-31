import { TRPCError } from "@trpc/server";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { RouterOutput } from "../../router";
import { baseGetManyInputParameters } from "../../shared/base-get-many-input-parameters";
import { protectedProcedure } from "../../trpc";

export type Role = RouterOutput["role"]["getMany"][0];

export const getMany = protectedProcedure
  .input(baseGetManyInputParameters)
  .query(async ({ ctx, input }) => {
    try {
      const roles = await prisma.role.findMany({
        select: {
          id: true,
          name: true,
        },
        take: input?.limit ?? 5,
        skip: (input?.page ?? 0) * (input?.limit ?? 5),
        orderBy:
          input?.sortBy && input?.sortOrder
            ? { [input.sortBy]: input.sortOrder }
            : { createdAt: "desc" },
      });

      return roles;
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
