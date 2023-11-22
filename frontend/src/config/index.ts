import { OpenIdProvider } from "@/types";

export const ZKLOGIN_ACCONTS = `zklogin-demo.accounts`;

export const openIdProviders: OpenIdProvider[] = [
  "Google",
  // "Twitch",
  // "Facebook",
];

export const PACKAGE_ID =
  "0xc42f1faab7526151e1f51e47b02fdd6ffbb2ee83bf5450037733d5955c58fdad";

export const NFT_INDEX_ID =
  "0x89ba4a352f8aee8c353988258c20130b5ac4513f6c8f8f7df73a1b746af01fda";

export const NFT_TYPE = `${PACKAGE_ID}::issuer::DriveNFTId`;

export const CLOCK_ID = "0x6";

export const driveObjectType = `${PACKAGE_ID}::nft::DriveNFT`;
