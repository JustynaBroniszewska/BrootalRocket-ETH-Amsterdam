import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify";

const siwe: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post(
    "/siwe/init",
    {},
    async function handler(this: FastifyInstance, req: FastifyRequest, reply) {
      reply.send({
        nonce: await req.siwe.generateNonce(),
      });
    }
  );

  fastify.get(
    "/siwe/me",
    {},
    async function handler(this: FastifyInstance, req: FastifyRequest, reply) {
      if (!req.siwe.session) {
        reply.status(401).send();
        return;
      }

      reply.code(200).send({
        loggedIn: true,
        message: req.siwe.session,
      });
    }
  );
};

export default siwe;
