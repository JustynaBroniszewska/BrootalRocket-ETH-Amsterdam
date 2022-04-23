import { FastifyPluginAsync } from 'fastify'

const portfolio: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/portfolio', async function (request, reply) {
    console.log((request.body as any).description)
    return { portfolio: true }
  })
}

export default portfolio;
