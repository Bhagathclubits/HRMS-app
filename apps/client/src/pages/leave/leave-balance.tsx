import { toast } from "react-toastify";
import {
  InputParameters,
  Leave,
} from "server/dist/trpc/routes/leaves/get-many";
import Button from "ui/Button";
import Card from "ui/Card";
import DataGrid from "ui/DataGrid";
import Stack from "ui/Stack";
import { AsyncListContextValue, useAsyncList } from "ui/hooks/UseAsyncList";
import XLSX from "xlsx";
import PageHeader from "../../components/PageHeader";
import { useAuthContext } from "../../hooks/UseAuth";
import { client } from "../../main";
import { handleTRPCError } from "../../utils/handle-trpc-error";

export type LeaveItem = {
  uid: string;
  empcode: string;
  leavetype: string;
  availableunits: string;
  balanceunits: string;
  underapproval: string;
};

export const leaveBalance = {
  uid: "1",
  empcode: "1210",
  leavetype: "Sick Leave",
  availableunits: "50",
  balanceunits: "40",
  underapproval: "Pending",
};

export const leaveBalances = [
  leaveBalance,
  { ...leaveBalance, uid: "2" },
  { ...leaveBalance, uid: "3" },
  { ...leaveBalance, uid: "4" },
  { ...leaveBalance, uid: "5" },
  { ...leaveBalance, uid: "6" },
  { ...leaveBalance, uid: "7" },
  { ...leaveBalance, uid: "8" },
  { ...leaveBalance, uid: "9" },
  { ...leaveBalance, uid: "10" },
  { ...leaveBalance, uid: "11" },
  { ...leaveBalance, uid: "12" },
  { ...leaveBalance, uid: "13" },
];

export type LeaveBalancePageProps = {
  tabId: number;
  activeTabId: number;
};

export const LeaveBalancePage = ({
  tabId,
  activeTabId,
}: LeaveBalancePageProps) => {
  const auth = useAuthContext();

  const value = useAsyncList<Leave, InputParameters["sortBy"]>({
    load: async ({ states }) => {
      try {
        const inputParameters = {
          sortBy: states.sortState?.sortBy,
          sortOrder: states.sortState?.sortOrder,
          limit: states.paginationState.limit,
          page: states.paginationState.page,
        };

        const result = await client.leave.getMany.mutate(inputParameters);

        return {
          totalCount: result.totalCount,
          items: result.items as any,
        };
      } catch (error) {
        handleTRPCError(error, auth);

        return { error: new Error("Something went wrong") };
      }
    },
  });

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

      const leaveBalances = data.items.map((item) => ({
        "Emp Code": item.user.id,
        "Emp Name":
          item.user.personalInfo?.firstName && item.user.personalInfo.lastName
            ? `${item.user.personalInfo?.firstName} ${item.user.personalInfo?.lastName}`
            : item.user.name,
        "Leave Type": item.leaveType.name,
        "Available Units": item.leaveType.daysAlloted,
        "Balance Units":
          Number(item.leaveType.daysAlloted) - Number(item.noOfDays),
      }));

      const worksheet = XLSX.utils.json_to_sheet(leaveBalances);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "leave-balance");
      XLSX.writeFile(workbook, "leave-balance.xlsx", { compression: true });

      toast.success("Data successfully exported!");
    } catch (error) {
      toast.error("An error occurred!");
      console.log({ error });
    }
  };

  return (
    <Stack gap="3">
      <PageHeader
        title={<PageHeader.Title />}
        actions={
          <Stack orientation="horizontal" gap="3">
            <Button variant="primary" onClick={handleExport}>
              Export
            </Button>
          </Stack>
        }
      />
      <Card id={`section-to-print-${tabId}`}>
        <DataGrid<Leave>
          {...(value as AsyncListContextValue<Leave>)}
          columns={[
            {
              id: "1",
              key: "",
              label: "Emp Code",
              renderCell: (item) => <>{item.user.id}</>,
            },
            {
              id: "2",
              key: "",
              label: "Emp Name",
              renderCell: (item) => (
                <>
                  {item.user.personalInfo
                    ? `${item.user.personalInfo.firstName} ${item.user.personalInfo.lastName}`
                    : ""}
                </>
              ),
              ...value.sort("userId"),
            },
            {
              id: "3",
              key: "",
              label: "Leave Type",
              renderCell: (item) => <>{item.leaveType.name}</>,
              ...value.sort("leaveTypeId"),
            },
            {
              id: "4",
              key: "",
              label: "Available Units",
              renderCell: (item) => <>{item.leaveType.daysAlloted}</>,
              ...value.sort("daysAlloted"),
            },
            {
              id: "5",
              key: "",
              label: "Balance Units",
              renderCell: (item) => (
                <>
                  {Number(item.leaveType.daysAlloted) - Number(item.noOfDays)}
                </>
              ),
            },
          ]}
        />
      </Card>
    </Stack>
  );
};

export default LeaveBalancePage;
