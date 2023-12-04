import { suiClient } from "../config/sui";
import { NFT_TYPE } from "../config";
import { getOwnedObjectIdFromType } from "../utils";

export const fetchMazdaNFTObjectIdFromAddress = async (address: string) => {
  const obj_id = await getOwnedObjectIdFromType(address, NFT_TYPE);
  const field: any = await suiClient.getObject({
    id: obj_id,
    options: {
      showContent: true,
      showType: true,
    },
  });
  const nft_id = field.data?.content.fields.nft;
  return nft_id;
};

export const fetchUserLikes = async (address: string) => {
  const nft_id = await fetchMazdaNFTObjectIdFromAddress(address);
  const object: any = await suiClient.getObject({
    id: nft_id,
    options: {
      showContent: true,
      showType: true,
    },
  });
  if (
    object.data &&
    object.data.content &&
    object.data.content.fields &&
    object.data.content.fields.value
  ) {
    return object.data.content.fields.value;
  } else {
    return 0;
  }
};
