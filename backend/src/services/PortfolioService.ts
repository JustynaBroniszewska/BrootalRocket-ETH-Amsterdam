import { create, IPFSHTTPClient } from "ipfs-http-client";
import axios from "axios";

export class PortfolioService {
  descriptions: Record<string, Record<string, string>> = {};
  client: IPFSHTTPClient;
  constructor() {
    this.client = create({ url: "https://ipfs.infura.io:5001/api/v0" });
  }
  async createPortfolio({
    description,
    account,
    portfolioName,
  }: {
    description: string;
    account: string;
    portfolioName: string;
  }) {
    const file = { account, description };
    const added = await this.client.add(JSON.stringify(file));
    this.descriptions[account] = { [portfolioName]: added.path };
    return portfolioName;
  }

  async getPortfolio(account: string, portfolioName: string) {
    const description = this.descriptions[account]?.[portfolioName] ?? "";
    console.log(description);

    const res = await axios.get("https://ipfs.io/ipfs/" + description);
    return res.data;
  }

  getPortfolios() {
    return this.descriptions;
  }
}
