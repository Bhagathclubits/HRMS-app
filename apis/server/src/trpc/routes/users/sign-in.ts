import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "../../../db/prisma";
import env from "../../../environment/variables";
import { RouterOutput } from "../../router";
import { publicProcedure } from "../../trpc";

export type User = RouterOutput["user"]["signIn"]["user"];

export const signIn = publicProcedure
  .input(
    z.object({
      username: z.string().min(3),
      password: z.string().min(3).max(20),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const user = await prisma.user.findFirstOrThrow({
        select: {
          id: true,
          name: true,
          password: true,
          username: true,
          role: {
            select: {
              name: true,
            },
          },
          personalInfo: {
            select: {
              imageUrl: true,
            },
          },
          email: true,
          mobile: true,
        },
        where: { username: input.username },
      });

      const isPasswordAMatch = bcrypt.compareSync(
        input.password,
        user.password
      );

      if (!isPasswordAMatch) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (user) {
        delete (user as Partial<typeof user>).password;

        const token = await ctx.res.jwtSign(user);

        const refreshToken = await ctx.res.jwtSign(user, { expiresIn: "1d" });

        ctx.res.setCookie("refreshToken", refreshToken, {
          path: "/",
          secure: env.COOKIE_SECURE, // send cookie over HTTPS only
          httpOnly: env.COOKIE_HTTP_ONLY,
          sameSite: env.COOKIE_SAME_SITE, // alternative CSRF protection
        });

        return { token, user };
      }

      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    } catch (error) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  });
