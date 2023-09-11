import { TRPCError } from "@trpc/server";
import { prisma } from "../../../db/prisma";
import { getErrorMessage } from "../../../utils/get-error-message";
import { RouterOutput } from "../../router";
import { protectedProcedure } from "../../trpc";

export type TravelStatus = RouterOutput["travelStatus"]["getMany"][0];

export const getMany = protectedProcedure.mutation(async () => {
  try {
    const travelStatus = await prisma.travelStatus.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return travelStatus;
  } catch (error) {
    console.log(getErrorMessage(error));

    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }
});
