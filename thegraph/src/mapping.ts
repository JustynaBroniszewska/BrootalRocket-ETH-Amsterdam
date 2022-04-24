import { VaultCreated } from "../generated/VaultFactory/VaultFactory";
import { Asset, Vault } from "../generated/schema";
import { ERC20 } from "../generated/VaultFactory/ERC20";
import { Address } from "@graphprotocol/graph-ts";

function getAsset(address: Address): Asset {
  let asset = Asset.load(address.toHexString());
  if (!asset) {
    asset = new Asset(address.toHexString());
    const ercContract = ERC20.bind(address);
    asset.name = ercContract.name();
    asset.symbol = ercContract.symbol();
    asset.decimals = ercContract.decimals();
    asset.save();
  }
  return asset;
}

export function handleVaultCreated(event: VaultCreated): void {
  const entity = new Vault(event.params.vault.toHexString());
  entity.asset = getAsset(event.params.asset).id;
  entity.owner = event.params.owner;
  entity.startDate = event.block.timestamp;

  const ercContract = ERC20.bind(event.params.vault);
  entity.name = ercContract.name();
  entity.symbol = ercContract.symbol();
  entity.decimals = ercContract.decimals();

  entity.save();
}
