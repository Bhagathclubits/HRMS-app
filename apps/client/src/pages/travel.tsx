import { toast } from "react-toastify";
import {
  InputParameters,
  Travel,
} from "server/dist/trpc/routes/travel/get-many";
import { InputParameters as ImportTravelInputParameters } from "server/dist/trpc/routes/travel/import";
import Button from "ui/Button";
import Card from "ui/Card";
import DataGrid from "ui/DataGrid";
import Grid from "ui/Grid";
import Menu from "ui/Menu";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import { AsyncListContextValue, useAsyncList } from "ui/hooks/UseAsyncList";
import XLSX from "xlsx";
import PageHeader from "../components/PageHeader";
import PrintButton from "../components/PrintButton";
import ShowIf from "../components/ShowIf";
import TravelDialog from "../components/TravelDialog";
import TravelStatusDialog from "../components/TravelStatusDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

const TravelPage = () => {
  const auth = useAuthContext();

  const value = useAsyncList<Travel, InputParameters["sortBy"]>({
    load: async ({ states }) => {
      try {
        const inputParameters = {
          sortBy: states.sortState?.sortBy,
          sortOrder: states.sortState?.sortOrder,
          limit: states.paginationState.limit,
          page: states.paginationState.page,
        };

        const result = await client.travel.getMany.mutate(inputParameters);

        return {
          totalCount: result.totalCount,
          items: result.items as any,
        };
      } catch (error) {
        handleTRPCError(error, auth);

        return {
          error: Error("Something went wrong"),
        };
      }
    },
  });

  const handleExportFormatExport = async () => {
    try {
      const travelComponents = [
        {
          userId: 5,
          place: "Kerala",
          fromDate: new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            year: "numeric",
            day: "numeric",
          }).format(new Date(2023, 8, 6)),
          toDate: new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            year: "numeric",
            day: "numeric",
          }).format(new Date(2023, 8, 7)),
          remarks: "",
          status: "approved",
        },
      ];

      const worksheet = XLSX.utils.json_to_sheet(travelComponents);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "travel-components");
      XLSX.writeFile(workbook, "travel-components.xlsx", {
        compression: true,
      });

      toast.success("Export format successfully exported!");
    } catch (error) {
      toast.error("An error occurred!");
    }
  };

  const handleExport = async () => {
    try {
      const data = await client.travel.getMany.mutate({
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

      const travel = data.items.map((item) => ({
        "Emp Code": item.user.id,
        "Emp Name":
          item.user.personalInfo?.firstName && item.user.personalInfo.lastName
            ? `${item.user.personalInfo?.firstName} ${item.user.personalInfo?.lastName}`
            : item.user.name,
        Place: item.place,
        From: item.fromDate,
        To: item.toDate,
        Status: item.status.name,
      }));

      const worksheet = XLSX.utils.json_to_sheet(travel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "travel");
      XLSX.writeFile(workbook, "travel.xlsx", { compression: true });

      toast.success("Data successfully exported!");
    } catch (error) {
      console.log({ error });
      toast.error("An error occurred!");
    }
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files) return;

      const [file] = event.target.files;

      if (!file) return;

      await importTravel(file);

      toast.success("File imported successfully!");

      await value.refresh();
    } catch (error) {
      toast.error("An error occurred!");
    } finally {
      event.target.value = "";
    }
  };

  const importTravel = async (file: File) => {
    const fileContentsAsBuffer = await file.arrayBuffer();

    const workbook = XLSX.read(fileContentsAsBuffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    await client.travel.import.mutate(
      rawData.map((row: any) => ({
        ...row,
      })) as ImportTravelInputParameters
    );
  };

  const columns = [
    {
      id: "1",
      key: "empcode",
      label: "Emp Code",
      renderCell: (item: Travel) => <>{item.user.id}</>,
    },
    {
      id: "2",
      key: "",
      label: "Emp Name",
      renderCell: (item: Travel) => (
        <>
          {item.user.personalInfo?.firstName} {item.user.personalInfo?.lastName}
        </>
      ),
      ...value.sort("userId"),
    },
    {
      id: "3",
      key: "place",
      label: "Place",
      renderCell: (item: Travel) => (
        <Typography transform="capitalize">{item.place}</Typography>
      ),
      ...value.sort("place"),
    },
    {
      id: "4",
      key: "fromdate",
      label: "From",
      renderCell: (item: Travel) => (
        <>
          {new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            year: "numeric",
            day: "numeric",
          }).format(new Date(item.fromDate))}
        </>
      ),
      ...value.sort("fromDate"),
    },
    {
      id: "5",
      key: "todate",
      label: "To",
      renderCell: (item: Travel) => (
        <>
          {new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            year: "numeric",
            day: "numeric",
          }).format(new Date(item.toDate))}
        </>
      ),
      ...value.sort("toDate"),
    },
    {
      id: "6",
      key: "remarks",
      label: "Remarks",
      renderCell: (item: Travel) => (
        <Typography transform="capitalize">{item.remarks}</Typography>
      ),
      ...value.sort("remarks"),
    },
    {
      id: "7",
      key: "status",
      label: "Status",
      renderCell: (item: Travel) => (
        <Typography
          color={
            item.status.name === "approved"
              ? "success"
              : item.status.name === "declined"
              ? "danger"
              : "warning"
          }
          transform="capitalize"
        >
          {item.status.name}
        </Typography>
      ),
      ...value.sort("statusId"),
    },
    {
      id: "",
      key: "",
      label: "Action",
      renderCell: (item: Travel) => (
        <>
          <TravelStatusDialog
            variant={
              auth.state.user?.role.name === "admin" ? "admin" : "employee"
            }
            travelId={item.id}
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
              placeholder="Emp.Code"
            />
          </Grid.Col>
          <Grid.Col className="py-2" cols={["12", "md-2"]}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Travel ID"
            />
          </Grid.Col>
          <Grid.Col className="py-2" cols={["12", "md-2"]}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Details"
            />
          </Grid.Col>
          <Grid.Row>
            <Grid.Col className="py-2" cols={["12", "md-2"]}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="From"
              />
            </Grid.Col>
            <Grid.Col className="py-2" cols={["12", "md-2"]}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="To"
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
                <TravelDialog asyncList={value as AsyncListContextValue} />
              </ShowIf.Employee>
              <Button variant="primary" onClick={handleExport}>
                Export
              </Button>

              <ShowIf.Admin>
                <Menu
                  isSplitButton
                  trigger={
                    <>
                      <label className="btn btn-primary" htmlFor="customFile">
                        Import
                      </label>
                      <Menu.Trigger variant="primary">
                        <span className="visually-hidden">Toggle Dropdown</span>
                      </Menu.Trigger>
                    </>
                  }
                  dropdown={<Menu.Dropdown />}
                  options={[
                    {
                      label: "Export format",
                      onClick: handleExportFormatExport,
                    },
                  ]}
                />

                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  style={{
                    display: "none",
                  }}
                  id="customFile"
                  onChange={onFileChange}
                />
              </ShowIf.Admin>

              <PrintButton />
            </Stack>
          }
        />

        <Card id="section-to-print">
          <DataGrid<Travel>
            {...(value as AsyncListContextValue<Travel>)}
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

export default TravelPage;
