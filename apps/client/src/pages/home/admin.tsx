import { models } from "powerbi-client";
import { PowerBIEmbed } from "powerbi-client-react";
import React from "react";
import { useAuthContext } from "../../hooks/UseAuth";
import { client } from "../../main";
import { handleTRPCError } from "../../utils/handle-trpc-error";

export const AdminDashboard = () => {
  const auth = useAuthContext();

  const [accessToken, setAccessToken] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      try {
        const { token } = await client.powerbi.getTemporaryAccessToken.mutate();

        setAccessToken(token);
      } catch (error) {
        handleTRPCError(error, auth);
      }
    })();
  }, []);

  return (
    <>
      <PowerBIEmbed
        embedConfig={{
          type: "report", // Supported types: report, dashboard, tile, visual, qna, paginated report and create
          id: "cfad4658-e04d-4246-a531-6e078b8b026a",
          embedUrl:
            "https://app.powerbi.com/reportEmbed?reportId=cfad4658-e04d-4246-a531-6e078b8b026a&groupId=07538f3f-8ff4-47f0-9d32-aaaa6931210b&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUlORElBLUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6dHJ1ZSwidXNhZ2VNZXRyaWNzVk5leHQiOnRydWUsImRpc2FibGVBbmd1bGFySlNCb290c3RyYXBSZGxFbWJlZCI6dHJ1ZX19",
          accessToken,
          tokenType: models.TokenType.Aad, // Use models.TokenType.Aad for SaaS embed
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false,
              },
            },
            background: models.BackgroundType.Transparent,
          },
        }}
        eventHandlers={
          new Map([
            [
              "loaded",
              function () {
                console.log("Report loaded");
              },
            ],
            [
              "rendered",
              function () {
                console.log("Report rendered");
              },
            ],
            [
              "error",
              function (event) {
                console.log(event?.detail);
              },
            ],
            ["visualClicked", () => console.log("visual clicked")],
            ["pageChanged", (event) => console.log(event)],
          ])
        }
        cssClassName={"reportClass"}
        getEmbeddedComponent={(embeddedReport) => {
          (window as any).report = embeddedReport as unknown as Report;
        }}
      />
    </>
  );
};

export default AdminDashboard;
