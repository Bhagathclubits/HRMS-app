import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";
import envVariables from "../../../environment/variables";
import { protectedProcedure } from "../../trpc";

const computerVisionApiKey = envVariables.AZURE_COMPUTER_VISION_API_KEY;

const computerVisionEndpoint = envVariables.AZURE_COMPUTER_VISION_ENDPOINT;

async function OCR(url: string) {
  const extractTextFromImage = async (url: string) => {
    const endpoint = `${computerVisionEndpoint}/vision/v3.1/ocr`;

    try {
      const response = await axios.post(
        endpoint,
        {
          url,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": computerVisionApiKey,
          },
        }
      );
      console.log(response);

      const regions = response.data.regions;
      console.log(regions);
      const extractedDetails = {
        Surname: "",
        GivenName: "",
      };

      if (regions) {
        regions.forEach((region: any) => {
          region.lines.forEach((line: any, index: number) => {
            const text = line.words.map((word: any) => word.text).join(" ");
            const value =
              region.lines[index + 1]?.words
                .map((word: any) => word.text)
                .join(" ") || "";
            if (text.includes("Surname")) {
              console.log({ Surname: value });
              extractedDetails.Surname = value.replace("Surname", "").trim();
            } else if (text.includes("Given Names")) {
              console.log({ GivenName: value });
              extractedDetails.GivenName = value
                .replace("GivenName", "")
                .trim();
            }
          });
        });
      }

      return extractedDetails;
    } catch (error) {
      console.error("Error extracting text from image:", error);
    }
  };

  return await extractTextFromImage(url);
}

export const get = protectedProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    try {
      const extractedDetails = await OCR(input);

      return { extractedDetails };
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  });
