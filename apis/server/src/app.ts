import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { FastifyPluginAsync } from "fastify";
import { join } from "path";
import { appRouter } from "./trpc/router";
import { getTRPCContext } from "./trpc/trpc";

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
  void fastify.register(cors, {
    // origin: (origin, cb) => {
    //   console.log({ origin });
    //   if (!origin) {
    //     cb(new Error("Not allowed"), false);
    //     return;
    //   }

    //   const hostname = new URL(origin).hostname;
    //   console.log({ hostname });
    //   if (hostname === "localhost" || hostname === "127.0.0.1") {
    //     //  Request from localhost will pass
    //     cb(null, true);
    //     return;
    //   }
    //   // Generate an error on other origins, disabling access
    //   cb(new Error("Not allowed"), false);
    // },
    origin: "*",
    credentials: true,
  });

  void fastify.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      batching: { enabled: true },
      router: appRouter,
      createContext: getTRPCContext,
    },
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });
};

export default app;
export { app, options };
