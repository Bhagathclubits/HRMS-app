import { toast } from "react-toastify";
import { Leave } from "server/dist/trpc/routes/leaves/get-many";
import { InputParameters as ImportLeaveInputParameters } from "server/dist/trpc/routes/leaves/import";
import Button from "ui/Button";
import Card from "ui/Card";
import DataGrid from "ui/DataGrid";
import Menu from "ui/Menu";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import { AsyncListContextValue } from "ui/hooks/UseAsyncList";
import XLSX from "xlsx";
import LeaveStatusDialog from "../../components/LeaveStatusDialog";
import PageHeader from "../../components/PageHeader";
import ShowIf from "../../components/ShowIf";
import { useAuthContext } from "../../hooks/UseAuth";
import { client } from "../../main";

export type LeaveList = {
  uid: string;
  empcode: string;
  empname: string;
  leavetype: string;
  fromdate: string;
  todate: string;
  status: string;
  remarks: string;
};

export const leave = {
  uid: "1",
  empcode: "1210",
  empname: "Vishnupriya",
  fromdate: "18/04/2023",
  todate: "20/04/2023",
  leavetype: "Sick Leave",
  Status: "Pending",
  remarks: "Kindly consider",
};

export const leaves = [
  leave,
  { ...leave, uid: "2" },
  { ...leave, uid: "3" },
  { ...leave, uid: "4" },
  { ...leave, uid: "5" },
  { ...leave, uid: "6" },
  { ...leave, uid: "7" },
  { ...leave, uid: "8" },
  { ...leave, uid: "9" },
  { ...leave, uid: "10" },
  { ...leave, uid: "11" },
  { ...leave, uid: "12" },
  { ...leave, uid: "13" },
];
export type LeaveViewPageProps = {
  value: AsyncListContextValue;
  tabId: number;
  activeTabId: number;
};

export const LeaveViewPage = ({
  value,
  tabId,
  activeTabId,
}: LeaveViewPageProps) => {
  const auth = useAuthContext();

  const columns = [
    {
      id: "1",
      key: "",
      label: "Emp Code",
      renderCell: (item: Leave) => <>{item.user.id}</>,
    },
    {
      id: "2",
      key: "",
      label: "Emp Name",
      renderCell: (item: Leave) => (
        <>
          {item.user.personalInfo?.firstName} {item.user.personalInfo?.lastName}
        </>
      ),
      ...value.sort("userId"),
    },
    {
      id: "3",
      key: "",
      label: "Requested On",
      renderCell: (item: Leave) => (
        <>
          {" "}
          {new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            year: "numeric",
            day: "numeric",
          }).format(new Date(item.createdAt))}
        </>
      ),
      ...value.sort("createdAt"),
    },
    {
      id: "4",
      key: "",
      label: "Leave Type",
      renderCell: (item: Leave) => <>{item.leaveType.name}</>,
      ...value.sort("leaveTypeId"),
    },

    {
      id: "5",
      key: "",
      label: "From",
      renderCell: (item: Leave) => (
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
      id: "6",
      key: "",
      label: "To",
      renderCell: (item: Leave) => (
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
      id: "7",
      key: "noOfDays",
      label: "Days",
      renderCell: (item: Leave) => <>{item.noOfDays}</>,
      ...value.sort("noOfDays"),
    },
    {
      id: "8",
      key: "remarks",
      label: "Remarks",
      ...value.sort("remarks"),
    },
    {
      id: "8",
      key: "",
      label: "Status",
      renderCell: (item: Leave) => (
        <Typography
          transform="capitalize"
          color={
            item.status.name === "accepted"
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
      id: "9",
      key: "",
      label: "Action",
      renderCell: (item: Leave) => (
        <>
          <LeaveStatusDialog
            variant={
              auth.state.user?.role.name === "admin" ? "admin" : "employee"
            }
            leaveId={item.id}
            asyncList={value as AsyncListContextValue}
          />
        </>
      ),
    },
  ];

  const handleExport = async () => {
    try {
      const data = await client.leave.getMany.mutate({
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

      const leaves = data.items.map((item) => ({
        "Emp Code": item.user.id,
        "Emp Name":
          item.user.personalInfo?.firstName && item.user.personalInfo.lastName
            ? `${item.user.personalInfo?.firstName} ${item.user.personalInfo?.lastName}`
            : item.user.name,
        "Requested On": item.createdAt,
        "Leave Type": item.leaveType.name,
        From: item.fromDate,
        To: item.toDate,
        Days: item.noOfDays,
        Remarks: item.remarks,
        Status: item.status.name,
      }));

      const worksheet = XLSX.utils.json_to_sheet(leaves);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "leaves");
      XLSX.writeFile(workbook, "leaves.xlsx", { compression: true });

      toast.success("Data successfully exported!");
    } catch (error) {
      toast.error("An error occurred!");
      console.log({ error });
    }
  };

  const handleExportFormatExport = async () => {
    try {
      const leave = [
        {
          userId: 6,
          leaveType: "sick leave",
          fromDate: new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            year: "numeric",
            day: "numeric",
          }).format(new Date(2023, 7, 22)),
          toDate: new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            year: "numeric",
            day: "numeric",
          }).format(new Date(2023, 7, 25)),
          noOfDays: 4,
          remarks: "Your leave is permitted",
          status: "accepted",
        },
      ];

      const worksheet = XLSX.utils.json_to_sheet(leave);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "leaves");
      XLSX.writeFile(workbook, "leaves.xlsx", {
        compression: true,
      });

      toast.success("Export format successfully exported!");
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

      await importLeave(file);

      toast.success("File imported successfully!");

      await value.refresh();
    } catch (error) {
      toast.error("An error occurred!");
    } finally {
      event.target.value = "";
    }
  };

  const importLeave = async (file: File) => {
    const fileContentsAsBuffer = await file.arrayBuffer();

    const workbook = XLSX.read(fileContentsAsBuffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    await client.leave.import.mutate(
      rawData.map((row: any) => ({
        ...row,
      })) as ImportLeaveInputParameters
    );
  };

  return (
    <Stack gap="3">
      <PageHeader
        title={<PageHeader.Title></PageHeader.Title>}
        actions={
          <Stack orientation="horizontal" gap="3">
            <Button variant="primary" onClick={handleExport}>
              Export
            </Button>

            <ShowIf.Admin>
              <Menu
                isSplitButton
                trigger={
                  <>
                    <label
                      className="btn btn-primary"
                      htmlFor="leaveImportFile"
                    >
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
                id="leaveImportFile"
                onChange={onFileChange}
              />
            </ShowIf.Admin>
          </Stack>
        }
      />
      <Card id={`section-to-print-${tabId}`}>
        <DataGrid<Leave>
          {...(value as AsyncListContextValue<Leave>)}
          columns={columns.filter((column) => {
            if (column.label !== "Action") return true;
            if (auth.state.user?.role.name === "admin") return true;

            return false;
          })}
        />
      </Card>
    </Stack>
  );
};
export default LeaveViewPage;
