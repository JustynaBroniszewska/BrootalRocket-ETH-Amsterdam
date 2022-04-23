import { FastifyPluginAsync } from 'fastify'
import { PortfolioService } from '../services/PortfolioService'

const portfolio: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const service = new PortfolioService()

  fastify.post('/portfolio', async function (request, reply) {

    const body = request.body as any
    return service.createPortfolio({
      account: body.account,
      description: body.description,
      portfolioName: body.portfolioName,
    })
  })

  fastify.get('/portfolio/:account/:name', async function (request, reply) {
    const req = request as any
    return service.getPortfolio(req.params.account, req.params.name)

  })
}

export default portfolio;
