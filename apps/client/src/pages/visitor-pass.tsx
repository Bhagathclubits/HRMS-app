import { toast } from "react-toastify";
import {
  InputParameters,
  VisitorPass,
} from "server/dist/trpc/routes/visitor-pass/get-many";
import Avatar from "ui/Avatar";
import Button from "ui/Button";
import Card from "ui/Card";
import DataGrid from "ui/DataGrid";
import Grid from "ui/Grid";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import { AsyncListContextValue, useAsyncList } from "ui/hooks/UseAsyncList";
import XLSX from "xlsx";
import PageHeader from "../components/PageHeader";
import PrintButton from "../components/PrintButton";
import ShowIf from "../components/ShowIf";
import VisitorPassDialog from "../components/VisitorPassDialog";
import VisitorPassStatusDialog from "../components/VisitorPassStatusDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

export type VisitorPassPageProps = {};

const VisitorPasses = () => {
  const auth = useAuthContext();

  const value = useAsyncList<VisitorPass, InputParameters["sortBy"]>({
    load: async ({ states }) => {
      try {
        const inputParameters = {
          sortBy: states.sortState?.sortBy,
          sortOrder: states.sortState?.sortOrder,
          limit: states.paginationState.limit,
          page: states.paginationState.page,
        };

        const result = await client.visitorPass.getMany.mutate(inputParameters);

        return {
          items: result.items as any,
          totalCount: result.totalCount,
        };
      } catch (error) {
        handleTRPCError(error, auth);

        return {
          error: Error("Something went wrong"),
        };
      }
    },
  });

  const handleExport = async () => {
    try {
      const data = await client.visitorPass.getMany.mutate({
        fromDate: new Date(
          new Date(
            new Date().setFullYear(
              new Date().getFullYear(),
              new Date().getMonth(),
              1
            )
          ).setHours(0, 0, 0, 0)
        ),
        toDate: new Date(
          new Date(
            new Date().setFullYear(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              1
            )
          ).setHours(0, 0, 0, 0)
        ),
      });

      const visitorPasses = data.items.map((item) => ({
        "Visitor Image": item.imageUrl,
        Name: item.name,
        "From Place": item.fromPlace,
        "Company Name": item.company.name,
        "HR Name": item.hr.user.name,
        "Mobile Number": item.mobileNumber,
        Date: new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }).format(new Date(item.date)),
        "In-time": new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(item.inTime)),
        "Out-time":
          item.outTime !== null
            ? new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "numeric",
              }).format(new Date(item.outTime))
            : "",
        Reason: item.reason,
      }));

      const worksheet = XLSX.utils.json_to_sheet(visitorPasses);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "visitor-passes");
      XLSX.writeFile(workbook, "visitor-passes.xlsx", { compression: true });

      toast.success("Data successfully exported!");
    } catch (error) {
      toast.error("An error occurred!");
      console.log({ error });
    }
  };

  const columns = [
    {
      id: "1",
      key: "",
      label: "Visitor Image",
      renderCell: (item: VisitorPass) => (
        <Stack alignItems="center">
          <Avatar
            src={item.imageUrl as string}
            variant="circle"
            className="overflow-hidden"
          />
        </Stack>
      ),
    },
    {
      id: "2",
      key: "name",
      label: "Name",
      renderCell: (item: VisitorPass) => (
        <Typography transform="capitalize">{item.name}</Typography>
      ),
      ...value.sort("name"),
    },
    {
      id: "3",
      key: "fromPlace",
      label: "From Place",
      renderCell: (item: VisitorPass) => (
        <Typography transform="capitalize">{item.fromPlace}</Typography>
      ),
      ...value.sort("fromPlace"),
    },
    {
      id: "4",
      key: "",
      label: "Company Name",
      renderCell: (item: VisitorPass) => (
        <Typography transform="capitalize">{item.company.name}</Typography>
      ),
      ...value.sort("companyId"),
    },
    {
      id: "5",
      key: "",
      label: "HR Name",
      renderCell: (item: VisitorPass) => (
        <Typography transform="capitalize">{item.hr.user.name}</Typography>
      ),
      ...value.sort("hrId"),
    },
    {
      id: "6",
      key: "mobileNumber",
      label: "Mobile Number",
      ...value.sort("mobileNumber"),
    },
    {
      id: "7",
      key: "",
      label: "Date",
      renderCell: (item: VisitorPass) => (
        <>
          {item.date
            ? new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              }).format(new Date(item.date))
            : ""}
        </>
      ),
      ...value.sort("date"),
    },

    {
      id: "8",
      key: "",
      label: "In-time",
      renderCell: (item: VisitorPass) => (
        <>
          {new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
          }).format(new Date(item.inTime))}
        </>
      ),
      ...value.sort("inTime"),
    },
    {
      id: "9",
      key: "",
      label: "Out-time",
      renderCell: (item: VisitorPass) => (
        <>
          {item.outTime !== null
            ? new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "numeric",
              }).format(new Date(item.outTime))
            : ""}
        </>
      ),
      ...value.sort("outTime"),
    },
    {
      id: "10",
      key: "reason",
      label: "Reason",
      renderCell: (item: VisitorPass) => (
        <Typography transform="capitalize">{item.reason}</Typography>
      ),
      ...value.sort("reason"),
    },
    {
      id: "11",
      key: "remarks",
      label: "Remarks",
      renderCell: (item: VisitorPass) => (
        <Typography transform="capitalize">{item.remarks}</Typography>
      ),
      ...value.sort("remarks"),
    },
    {
      id: "12",
      key: "status",
      label: "Status",
      renderCell: (item: VisitorPass) => (
        <Typography
          transform="capitalize"
          color={
            item.status.name === "approved"
              ? "success"
              : item.status.name === "rejected"
              ? "danger"
              : "warning"
          }
        >
          {item.status.name}
        </Typography>
      ),
      ...value.sort("statusId"),
    },
    {
      id: "13",
      key: "",
      label: "Action",
      renderCell: (item: VisitorPass) => (
        <>
          <VisitorPassStatusDialog
            variant={
              auth.state.user?.role.name === "admin" ? "admin" : "employee"
            }
            visitorPassId={item.id}
            asyncList={value as AsyncListContextValue}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Stack gap="3">
        <Grid.Row>
          <Grid.Col className="py-2" cols={["12", "md-2"]}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Visitor Name"
            />
          </Grid.Col>
          <Grid.Col className="py-2" cols={["12", "md-2"]}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Visitor From"
            />
          </Grid.Col>
          <Grid.Col className="py-2" cols={["12", "md-2"]}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="From Date"
            />
          </Grid.Col>
          <Grid.Row>
            <Grid.Col className="py-2" cols={["12", "md-2"]}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="In Time"
              />
            </Grid.Col>
            <Grid.Col className="py-2" cols={["12", "md-2"]}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Out Time"
              />
            </Grid.Col>
            <Grid.Col className="py-2" cols={["12", "md-2"]}>
              <Button variant="primary" className="w-100">
                Search
              </Button>
            </Grid.Col>
          </Grid.Row>
        </Grid.Row>
        <PageHeader
          title={<PageHeader.Title />}
          actions={
            <Stack orientation="horizontal" gap="3">
              <ShowIf.Employee>
                <VisitorPassDialog asyncList={value as AsyncListContextValue} />
              </ShowIf.Employee>

              <Button variant="primary" onClick={handleExport}>
                Export
              </Button>

              <PrintButton />
            </Stack>
          }
        />
        <Card id="section-to-print">
          <DataGrid<VisitorPass>
            {...(value as AsyncListContextValue<VisitorPass>)}
            columns={columns.filter((column) => {
              if (column.label !== "Action") return true;
              if (auth.state.user?.role.name === "admin") return true;

              return false;
            })}
          />
        </Card>
      </Stack>
    </>
  );
};

export default VisitorPasses;
