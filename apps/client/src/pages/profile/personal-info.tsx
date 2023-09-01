import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  InputParameters,
  PersonalInfo,
} from "server/dist/trpc/routes/personal-infos/get-many";
import { InputParameters as ImportPersonalInfoInputParameters } from "server/dist/trpc/routes/personal-infos/import";
import Avatar from "ui/Avatar";
import Button from "ui/Button";
import Card from "ui/Card";
import DataGrid from "ui/DataGrid";
import { Menu } from "ui/Menu";
import Stack from "ui/Stack";
import { AsyncListContextValue, useAsyncList } from "ui/hooks/UseAsyncList";
import XLSX from "xlsx";
import PageHeader from "../../components/PageHeader";
import PersonalInfoDialog from "../../components/PersonalInfoDialog";
import ShowIf from "../../components/ShowIf";
import { useAuthContext } from "../../hooks/UseAuth";
import { client } from "../../main";
import { handleTRPCError } from "../../utils/handle-trpc-error";

export const personalInfo = {
  uid: "1",
  userId: "1210",
  firstName: "Vignesh",
  lastName: "S",
  fullName: "Vignesh S",
  middleName: "",
  dateOfJoining: "02/02/2021",
  dateOfBirth: "03/03/1997",
  designation: "Web Devloper",
  department: "IT",
  reportingManager: "Selva",
  status: "Active",
};

export type PersonalInfoType = typeof personalInfo;

export const personalInfos = [
  personalInfo,
  { ...personalInfo, uid: "2" },
  { ...personalInfo, uid: "3" },
  { ...personalInfo, uid: "4" },
  { ...personalInfo, uid: "5" },
  { ...personalInfo, uid: "6" },
  { ...personalInfo, uid: "7" },
  { ...personalInfo, uid: "8" },
  { ...personalInfo, uid: "9" },
  { ...personalInfo, uid: "10" },
  { ...personalInfo, uid: "11" },
  { ...personalInfo, uid: "12" },
  { ...personalInfo, uid: "13" },
];

export type PersonalInfoPageProps = {
  tabId: number;
  activeTabId: number;
};

export const PersonalInfoPage = ({
  tabId,
  activeTabId,
}: PersonalInfoPageProps) => {
  const auth = useAuthContext();

  const value = useAsyncList<PersonalInfo, InputParameters["sortBy"]>({
    load: async ({ states }) => {
      try {
        const inputParameters = {
          sortBy: states.sortState?.sortBy,
          sortOrder: states.sortState?.sortOrder,
          limit: states.paginationState.limit,
          page: states.paginationState.page,
        };

        const result = await client.personalInfo.getMany.mutate(
          inputParameters
        );

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
      const data = await client.personalInfo.getMany.mutate({
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

      const personalInfos = data.items.map((item) => ({
        "Emp Code": item.user.id,
        "Emp Name": `${item.firstName} ${item.lastName}`,
        "Profile Image": item.imageUrl,
        "First Name": item.firstName,
        "Last Name": item.lastName,
        DOJ: new Intl.DateTimeFormat("en-US", {
          month: "numeric",
          year: "numeric",
          day: "numeric",
        }).format(new Date(item.dateOfJoining)),
        DOB: new Intl.DateTimeFormat("en-US", {
          month: "numeric",
          year: "numeric",
          day: "numeric",
        }).format(new Date(item.dateOfBirth)),
        "Job Title": item.designation.name,
        Department: item.department.name,
        ReportingManager: item.reportingManager.name,
      }));

      const worksheet = XLSX.utils.json_to_sheet(personalInfos);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "personal-infos");
      XLSX.writeFile(workbook, "personal-infos.xlsx", { compression: true });

      toast.success("Data successfully exported!");
    } catch (error) {
      toast.error("An error occurred!");
      console.log({ error });
    }
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files) return;

      const [file] = event.target.files;

      if (!file) return;

      await importProfileInfo(file);

      toast.success("File imported successfully!");

      await value.refresh();
    } catch (error) {
      toast.error("An error occurred!");
    } finally {
      event.target.value = "";
    }
  };

  const importProfileInfo = async (file: File) => {
    const fileContentsAsBuffer = await file.arrayBuffer();

    const workbook = XLSX.read(fileContentsAsBuffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    await client.personalInfo.import.mutate(
      rawData.map((row: any) => ({
        ...row,
      })) as ImportPersonalInfoInputParameters
    );
  };

  const handleExportFormatExport = async () => {
    try {
      const personalInfo = [
        {
          userId: 9,
          firstName: "Ram",
          middleName: "Charan",
          lastName: "Kumar",
          dateOfBirth: new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            year: "numeric",
            day: "numeric",
          }).format(new Date(1998, 6, 22)),
          dateOfJoining: new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            year: "numeric",
            day: "numeric",
          }).format(new Date(2023, 6, 13)),
          designation: "Junior Fullstack Developer",
          department: "Development",
          reportingManagerUserId: 2,
        },
      ];

      const worksheet = XLSX.utils.json_to_sheet(personalInfo);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "personal-info");
      XLSX.writeFile(workbook, "personal-info.xlsx", {
        compression: true,
      });

      toast.success("Export format successfully exported!");
    } catch (error) {
      console.log({ error });
      toast.error("An error occurred!");
    }
  };
  const navigate = useNavigate();

  return (
    <Stack gap="3">
      <PageHeader
        title={<PageHeader.Title />}
        actions={
          <Stack orientation="horizontal" gap="3">
            <ShowIf.Employee>
              <PersonalInfoDialog asyncList={value as AsyncListContextValue} />
            </ShowIf.Employee>
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
                      htmlFor="importPersonalInfoFile"
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
                id="importPersonalInfoFile"
                onChange={onFileChange}
              />
            </ShowIf.Admin>
          </Stack>
        }
      />

      <Card id={`section-to-print-${tabId}`}>
        <DataGrid<PersonalInfo>
          {...(value as AsyncListContextValue<PersonalInfo>)}
          onRowClick={(item) =>
            navigate("../profile-page", {
              state: item,
              replace: true,
            })
          }
          columns={[
            {
              id: "1",
              key: "userId",
              label: "Emp Code",
              renderCell: (item) => <>{item.user.id}</>,
            },
            {
              id: "2",
              key: "",
              label: "Emp Name",
              renderCell: (item) => (
                <>
                  {item.firstName}
                  {item.middleName ? ` ${item.middleName} ` : " "}
                  {item.lastName}
                </>
              ),
              ...value.sort("firstName"),
            },
            {
              id: "3",
              key: "",
              label: "Profile Image",
              renderCell: (item) => (
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
              id: "4",
              key: "firstName",
              label: "First Name",
              ...value.sort("firstName"),
            },

            {
              id: "5",
              key: "lastName",
              label: "Last Name",
              ...value.sort("lastName"),
            },
            {
              id: "6",
              key: "",
              label: "DOJ",
              renderCell: (item) => (
                <>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "numeric",
                    year: "numeric",
                    day: "numeric",
                  }).format(new Date(item.dateOfJoining))}
                </>
              ),
              ...value.sort("dateOfJoining"),
            },
            {
              id: "7",
              key: "",
              label: "DOB",
              renderCell: (item) => (
                <>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "numeric",
                    year: "numeric",
                    day: "numeric",
                  }).format(new Date(item.dateOfBirth))}
                </>
              ),
              ...value.sort("dateOfBirth"),
            },
            {
              id: "8",
              key: "",
              label: "Job Title",
              renderCell: (item) => <>{item.designation.name}</>,
              ...value.sort("designationId"),
            },
            {
              id: "9",
              key: "",
              label: "Department",
              renderCell: (item) => <>{item.department.name}</>,
              ...value.sort("departmentId"),
            },
            {
              id: "10",
              key: "",
              label: "Reporting Manager",
              renderCell: (item) => <>{item.reportingManager.name}</>,
            },
          ]}
        />
      </Card>
    </Stack>
  );
};
export default PersonalInfoPage;
