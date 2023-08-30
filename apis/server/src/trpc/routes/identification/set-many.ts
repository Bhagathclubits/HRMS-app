import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { employeeOnlyProcedure } from "../../trpc";

export const insertIdentificationSchema = z.array(
  z.object({
    number: z.string(),
    typeId: z.number(),
    imageUrl: z.string().optional(),
  })
);

export type insertIdentification = z.infer<typeof insertIdentificationSchema>;

export const setMany = employeeOnlyProcedure
  .input(insertIdentificationSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const identifications = await prisma.identification.createMany({
        data: input.map((identification) => ({
          ...identification,
          userId: ctx.userId,
          createdById: ctx.userId,
          updatedById: ctx.userId,
        })),
      });

      return identifications;
    } catch (error) {
      console.log(getErrorMessage(error));

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
