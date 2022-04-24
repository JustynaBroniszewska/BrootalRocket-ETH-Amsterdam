import { signInWithEthereum } from "fastify-siwe";
import { SiweApi } from "fastify-siwe/dist/src/SiweApi";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    siwe: SiweApi;
  }
}

const setupSiwe = fp(
  async (fastify, options) => {
    fastify.register(signInWithEthereum());
  },
  {
    name: "siwe",
  }
);

export default setupSiwe;
