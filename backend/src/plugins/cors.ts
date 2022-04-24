import cors, { FastifyCorsOptions } from "fastify-cors";
import fp from "fastify-plugin";

const setupCors = fp<FastifyCorsOptions>(
  async (fastify, options) => {
    fastify.register(cors, {
      origin: ["http://localhost:3000", "https://degenheaven.vercel.app/"],
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    });
  },
  {
    name: "cors",
  }
);

export default setupCors;
