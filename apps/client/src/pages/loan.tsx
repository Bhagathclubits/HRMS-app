import { toast } from "react-toastify";
import { InputParameters as ImportLoanInputParameters } from "server/dist/trpc/routes/loan/import";
import { InputParameters, Loan } from "server/src/trpc/routes/loan/get-many";
import Button from "ui/Button";
import Card from "ui/Card";
import DataGrid from "ui/DataGrid";
import Grid from "ui/Grid";
import Menu from "ui/Menu";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import { AsyncListContextValue, useAsyncList } from "ui/hooks/UseAsyncList";
import XLSX from "xlsx";
import LoanDialog from "../components/LoanDialog";
import LoanStatusDialog from "../components/LoanStatusDialog";
import PageHeader from "../components/PageHeader";
import PrintButton from "../components/PrintButton";
import ShowIf from "../components/ShowIf";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

const LoanPage = () => {
  const auth = useAuthContext();

  const value = useAsyncList<Loan, InputParameters["sortBy"]>({
    load: async ({ states }) => {
      try {
        const inputParameters = {
          sortBy: states.sortState?.sortBy,
          sortOrder: states.sortState?.sortOrder,
          limit: states.paginationState.limit,
          page: states.paginationState.page,
        };

        const result = await client.loan.getMany.mutate(inputParameters);

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

  const columns = [
    {
      id: "1",
      key: "userId",
      label: "Emp Code",
      renderCell: (item: Loan) => <>{item.user.id}</>,
    },
    {
      id: "2",
      key: "",
      label: "Emp Name",
      renderCell: (item: Loan) => (
        <>
          {item.user.personalInfo?.firstName} {item.user.personalInfo?.lastName}
        </>
      ),
      ...value.sort("userId"),
    },
    { id: "3", key: "id", label: "Loan Id", ...value.sort("id") },
    {
      id: "4",
      key: "",
      label: "Loan Type",
      renderCell: (item: Loan) => (
        <>
          <Typography transform="capitalize">{item.type.name}</Typography>
        </>
      ),
      ...value.sort("typeId"),
    },
    {
      id: "5",
      key: "",
      label: "Date",
      renderCell: (item: Loan) => (
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
      id: "6",
      key: "amount",
      label: "Amount",
      renderCell: (item: Loan) => (
        <>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "INR",
          }).format(Number(item.amount))}
        </>
      ),
      ...value.sort("amount"),
    },
    {
      id: "7",
      key: "remarks",
      label: "remarks",
      ...value.sort("remarks"),
    },
    {
      id: "7",
      key: "status",
      label: "Status",
      renderCell: (item: Loan) => (
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
      id: "8",
      key: "",
      label: "Action",
      renderCell: (item: Loan) => (
        <>
          <LoanStatusDialog
            variant={
              auth.state.user?.role.name === "admin" ? "admin" : "employee"
            }
            loanId={item.id}
            asyncList={value as AsyncListContextValue}
          />
        </>
      ),
    },
  ];

  const handleExportFormatExport = async () => {
    try {
      const loanComponents = [
        {
          userId: 5,
          type: "personal loan",
          date: new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            year: "numeric",
            day: "numeric",
          }).format(new Date(2023, 7, 22)),
          amount: 200000,
          remarks: "loan settled",
          status: "pending",
        },
      ];

      const worksheet = XLSX.utils.json_to_sheet(loanComponents);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "loan-components");
      XLSX.writeFile(workbook, "loan.xlsx", {
        compression: true,
      });

      toast.success("Export format successfully exported!");
    } catch (error) {
      toast.error("An error occurred!");
    }
  };

  const handleExport = async () => {
    try {
      const data = await client.loan.getMany.mutate();

      const loan = data.items.map((item) => ({
        "Emp Code": item.user.id,
        "Emp Name":
          item.user.personalInfo?.firstName && item.user.personalInfo.lastName
            ? `${item.user.personalInfo?.firstName} ${item.user.personalInfo?.lastName}`
            : item.user.name,
        Date: item.date
          ? new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            }).format(new Date(item.date))
          : "",
        "Loan Id": item.id,
        "Loan Type": item.type.name,
        Amount: item.amount,
        Status: item.status.name,
      }));

      const worksheet = XLSX.utils.json_to_sheet(loan);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "loan");
      XLSX.writeFile(workbook, "loan.xlsx", { compression: true });

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

      await importLoan(file);

      toast.success("File imported successfully!");

      await value.refresh();
    } catch (error) {
      toast.error("An error occurred!");
    } finally {
      event.target.value = "";
    }
  };

  const importLoan = async (file: File) => {
    const fileContentsAsBuffer = await file.arrayBuffer();

    const workbook = XLSX.read(fileContentsAsBuffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    await client.loan.import.mutate(
      rawData.map((row: any) => ({
        ...row,
      })) as ImportLoanInputParameters
    );
  };

  return (
    <>
      <Stack gap="3">
        <Grid.Row>
          <Grid.Col className="py-2" cols={["12", "md-2"]}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Emp Code"
            />
          </Grid.Col>
          <Grid.Col className="py-2" cols={["12", "md-2"]}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Loan Type"
            />
          </Grid.Col>
          <Grid.Col className="py-2" cols={["12", "md-2"]}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Date"
            />
          </Grid.Col>
          <Grid.Row>
            <Grid.Col className="py-2" cols={["12", "md-2"]}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Emp Name"
              />
            </Grid.Col>
            <Grid.Col className="py-2" cols={["12", "md-2"]}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Amount"
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
                <LoanDialog asyncList={value as AsyncListContextValue} />
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
                      label: "Import format",
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
          <DataGrid<Loan>
            {...(value as AsyncListContextValue<Loan>)}
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

export default LoanPage;
