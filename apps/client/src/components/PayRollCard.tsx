import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ResponsiveBar } from "@nivo/bar";
import React from "react";
import Card from "ui/Card";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

export const PayRollCard = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Header
          title={
            <Typography color="primary" fontSize="6">
              <FontAwesomeIcon icon={faReceipt} /> Payroll
            </Typography>
          }
        />

        <Stack gap="3" style={{ height: 400 }}>
          <BarChart />
        </Stack>
      </Card.Body>
    </Card>
  );
};

export const BarChart = () => {
  const [data, setData] = React.useState<any[]>([]);

  const auth = useAuthContext();

  React.useEffect(() => {
    (async () => {
      try {
        const { items: payslips } = await client.payRoll.getMany.mutate();

        const data = payslips.map((payslip) =>
          payslip.paySlipComponents.reduce((acc, curr) => {
            return {
              ...acc,
              month: new Intl.DateTimeFormat("en-US", {
                month: "short",
              }).format(
                new Date(new Date().setFullYear(payslip.year, payslip.month, 1))
              ),
              [curr.componentType.name]: Number(curr.amount),
            };
          }, {})
        );

        setData(data);
      } catch (error) {
        handleTRPCError(error, auth);
      }
    })();
  }, []);

  return (
    <ResponsiveBar
      data={data}
      keys={["Basic", "HRA", "Deduction"]}
      indexBy="month"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "fries",
          },
          id: "dots",
        },
        {
          match: {
            id: "sandwich",
          },
          id: "lines",
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Month",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "salary",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in country: " + e.indexValue
      }
    />
  );
};

export default PayRollCard;
