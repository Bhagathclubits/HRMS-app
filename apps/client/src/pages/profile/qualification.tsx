import { toast } from "react-toastify";
import { InputParameters as ImportQualificationInputParameters } from "server/dist/trpc/routes/qualification/import";
import {
  InputParameters,
  Qualification,
} from "server/src/trpc/routes/qualification/get-many";
import Button from "ui/Button";
import Card from "ui/Card";
import DataGrid from "ui/DataGrid";
import Menu from "ui/Menu";
import Stack from "ui/Stack";
import { AsyncListContextValue, useAsyncList } from "ui/hooks/UseAsyncList";
import XLSX from "xlsx";
import PageHeader from "../../components/PageHeader";
import QualificationDialog from "../../components/QualificationDialog";
import ShowIf from "../../components/ShowIf";
import { useAuthContext } from "../../hooks/UseAuth";
import { client } from "../../main";
import { handleTRPCError } from "../../utils/handle-trpc-error";

export type QualificationPageProps = {
  tabId: number;
  activeTabId: number;
};
const Qualifications = ({ tabId, activeTabId }: QualificationPageProps) => {
  const auth = useAuthContext();

  const value = useAsyncList<Qualification, InputParameters["sortBy"]>({
    load: async ({ states }) => {
      try {
        const inputParameters = {
          sortBy: states.sortState?.sortBy,
          sortOrder: states.sortState?.sortOrder,
          limit: states.paginationState.limit,
          page: states.paginationState.page,
        };

        const qualification = await client.qualification.getMany.mutate(
          inputParameters
        );

        return {
          items: qualification.items as any,
          totalCount: qualification.totalCount,
        };
      } catch (error) {
        handleTRPCError(error, auth);

        return {
          error: Error("Something went wrong"),
        };
      }
    },
  });

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files) return;

      const [file] = event.target.files;

      if (!file) return;

      await importQualification(file);

      toast.success("File imported successfully!");

      await value.refresh();
    } catch (error) {
      toast.error("An error occurred!");
    } finally {
      event.target.value = "";
    }
  };

  const importQualification = async (file: File) => {
    const fileContentsAsBuffer = await file.arrayBuffer();

    const workbook = XLSX.read(fileContentsAsBuffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    await client.qualification.import.mutate(
      rawData.map((row: any) => ({
        ...row,
      })) as ImportQualificationInputParameters
    );
  };

  const handleExport = async () => {
    try {
      const data = await client.qualification.getMany.mutate({
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

      const qualifications = data.items.map((item) => ({
        "Emp Code": item.user.id,
        "Emp Name":
          item.user.personalInfo?.firstName && item.user.personalInfo.lastName
            ? `${item.user.personalInfo?.firstName} ${item.user.personalInfo?.lastName}`
            : item.user.name,
        Qualification: item.name,
      }));

      const worksheet = XLSX.utils.json_to_sheet(qualifications);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "qualifications");
      XLSX.writeFile(workbook, "qualifications.xlsx", {
        compression: true,
      });

      toast.success("Data successfully exported!");
    } catch (error) {
      toast.error("An error occurred!");
      console.log({ error });
    }
  };

  const handleExportFormatExport = async () => {
    try {
      const qualification = [
        {
          userId: 1,
          name: "X",
        },
      ];

      const worksheet = XLSX.utils.json_to_sheet(qualification);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "qualification");
      XLSX.writeFile(workbook, "qualifications.xlsx", {
        compression: true,
      });

      toast.success("Export format successfully exported!");
    } catch (error) {
      console.log({ error });
      toast.error("An error occurred!");
    }
  };
  return (
    <Stack gap="3">
      <ShowIf.Employee>
        <PageHeader
          title={<PageHeader.Title></PageHeader.Title>}
          actions={
            <Stack orientation="horizontal" gap="3">
              <QualificationDialog asyncList={value as AsyncListContextValue} />
              <Button variant="primary" onClick={handleExport}>
                Export
              </Button>
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
              <Menu
                isSplitButton
                trigger={
                  <>
                    <label
                      className="btn btn-primary"
                      htmlFor="qualificationImportFile"
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
                id="qualificationImportFile"
                onChange={onFileChange}
              />
            </Stack>
          }
        />
      </ShowIf.Admin>
      <Card id={`section-to-print-${tabId}`}>
        <DataGrid<Qualification>
          {...(value as AsyncListContextValue<Qualification>)}
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
              label: "Qualification",
              renderCell: (item) => <>{item.name}</>,
              ...value.sort("name"),
            },
          ]}
        />
      </Card>
    </Stack>
  );
};

export default Qualifications;
