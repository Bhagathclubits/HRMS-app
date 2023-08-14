import { useNavigate } from "react-router-dom";
import {
  InputParameters,
  PersonalInfo,
} from "server/dist/trpc/routes/personal-infos/get-many";
import Avatar from "ui/Avatar";
import Button from "ui/Button";
import Card from "ui/Card";
import DataGrid from "ui/DataGrid";
import Stack from "ui/Stack";
import { AsyncListContextValue, useAsyncList } from "ui/hooks/UseAsyncList";
import XLSX from "xlsx";
import PageHeader from "../../components/PageHeader";
import PersonalInfoDialog from "../../components/PersonalInfoDialog";
import PrintButton from "../../components/PrintButton";
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

export type PersonalInfoPageProps = {};

export const PersonalInfoPage = () => {
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
    } catch (error) {
      console.log({ error });
    }
  };
  const navigate = useNavigate();

  return (
    <Stack gap="3">
      <ShowIf.Employee>
        <PageHeader
          title={<PageHeader.Title></PageHeader.Title>}
          actions={
            <Stack orientation="horizontal" gap="3">
              <PersonalInfoDialog asyncList={value as AsyncListContextValue} />
              <Button variant="primary" onClick={handleExport}>
                Export
              </Button>
              <PrintButton />
            </Stack>
          }
        />
      </ShowIf.Employee>
      <ShowIf.Admin>
        <PageHeader
          title={<PageHeader.Title />}
          actions={
            <Stack orientation="horizontal" gap="3">
              <Button variant="primary" onClick={handleExport}>
                Export
              </Button>
              <PrintButton />
            </Stack>
          }
        />
      </ShowIf.Admin>
      <Card id="section-to-print">
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
              label: "Emp name",
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
              label: "First name",
              ...value.sort("firstName"),
            },

            {
              id: "5",
              key: "lastName",
              label: "Last name",
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
