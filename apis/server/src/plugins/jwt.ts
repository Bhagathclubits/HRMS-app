import cookie from "@fastify/cookie";
import jwt, { type FastifyJWTOptions } from "@fastify/jwt";
import { FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import env from "../environment/variables";

export type Payload = {
  role: {
    name: string;
  };
  id: number;
  name: string;
  username: string;
  mobile: string | null;
  email: string | null;
  password: string;
  personalInfo: {
    imageUrl: string | null;
  } | null;
};

export type User = {
  id: number;
  name: string;
  role: string;
  // NOTE: Remove if not used in the frontend in all pages
  username: string;
  mobile: string | null;
  email: string | null;
  imageUrl?: string | null;
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: Payload; // payload type is used for signing and verifying
    user: User; // user type is return type of `request.user` object
  }
}

export default fp<FastifyJWTOptions>(async (fastify, opts) => {
  fastify.register(cookie);

  fastify.register(jwt, {
    ...opts,
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "refreshToken",
      signed: false,
    },
    sign: {
      expiresIn: "10m",
    },
    formatUser: (payload) => {
      return {
        id: payload.id,
        name: payload.name,
        role: payload.role.name,
        username: payload.username,
        email: payload.email,
        mobile: payload.mobile,
        imageUrl: payload.personalInfo?.imageUrl,
      };
    },
  });

  fastify.decorateRequest("authenticate", async (req: FastifyRequest) => {
    await req.jwtVerify();
    await req.jwtVerify({ onlyCookie: true });
  });
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyRequest {
    authenticate: (req: FastifyRequest) => Promise<void>;
  }
}
