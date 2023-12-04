import { suiClient } from "../config/sui";

export const getOwnedObjectIdFromType = async (
  address: string,
  objectType: string
) => {
  const data = await suiClient.getOwnedObjects({
    owner: address,
    filter: {
      MatchAll: [
        {
          StructType: `${objectType}`,
        },
        {
          AddressOwner: address,
        },
      ],
    },
    options: {
      showType: true,
      showOwner: true,
      showPreviousTransaction: true,
      showDisplay: false,
      showContent: false,
      showBcs: false,
      showStorageRebate: false,
    },
  });
  console.log({ data });
  return data && data.data && data.data[0] && data.data[0].data
    ? data.data[0].data.objectId
    : "";
};
