import { FastifyPluginAsync } from "fastify";
import { PortfolioService } from "../services/PortfolioService";

const portfolio: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const service = new PortfolioService();

  fastify.post("/portfolio", async function (request, reply) {
    const body = request.body as any;
    return service.createPortfolio({
      account: body.account,
      description: body.description,
      portfolioName: body.portfolioName,
    });
  });

  fastify.get("/portfolio/:name", async function (request, reply) {
    if (!request.siwe.session) {
      reply.status(401).send();
      return;
    }

    const req = request as any;
    return service.getPortfolio(request.siwe.session?.address, req.params.name);
  });

  fastify.get("/portfolio", async function (request, reply) {
    return service.getPortfolios();
  });
};

export default portfolio;
