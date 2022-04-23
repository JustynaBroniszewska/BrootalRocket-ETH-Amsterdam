import { create } from 'ipfs-http-client'

export class PortfolioService {
  descriptions: Record<string, Record<string, string>> = {}
  client: any
  constructor() {
    this.client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })
  }
  async createPortfolio({ description, account, portfolioName }: { description: string, account: string, portfolioName: string }) {
    const file = { account, description }
    const added = await this.client.add(JSON.stringify(file))
    this.descriptions[account] = { [portfolioName]: added.path }
    return portfolioName
  }

  getPortfolio(account:string, portfolioName:string):string {
    return this.descriptions[account]?.[portfolioName] ?? ''
  }
}