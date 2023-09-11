import { BlobServiceClient } from "@azure/storage-blob";
import { getUrlWithoutSearchParams } from "./get-url-without-search-params";

const containerName = `upload`;

const storageAccountName = "clubitsstoragepoc";

export const uploadFileToBlob = async (file: File, sasToken: string) => {
  const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`;

  const blobService = new BlobServiceClient(uploadUrl);

  const containerClient = blobService.getContainerClient(containerName);

  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file, options);

  return getUrlWithoutSearchParams(blobClient.url);
};
