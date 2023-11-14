import {
  TransactionBlock,
  TransactionArgument,
} from "@mysten/sui.js/transactions";

export const PACKAGE_ID =
  "0x0e0131a7ce2b0d4090652f1a666ddec8ed17b933af9f7f03d8d2b2ae642f6ff7";

export const NFT_INDEX_ID =
  "0x461eedd2255074df76b4a0cd92ed7d1702ddd023f6c1e1b8c871c06bae20c6ae";

export const CLOCK_ID = "0x6";

export function callMint(txb: TransactionBlock, args: any) {
  return txb.moveCall({
    target: `${PACKAGE_ID}::issuer::mint`,
    arguments: [
      txb.pure(NFT_INDEX_ID),
      txb.pure(CLOCK_ID),
      txb.pure(args.name),
      txb.pure(args.description),
      txb.pure(args.url),
    ],
  });
}

export const moveCallMintNft = (
  txb: TransactionBlock,
  props: {
    name: string;
    description: string;
    url: string;
  }
) => {
  callMint(txb, {
    name: props.name,
    description: props.description,
    url: props.url,
  });
};
