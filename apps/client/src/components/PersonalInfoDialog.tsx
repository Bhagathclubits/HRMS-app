import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-toastify";
import { Department } from "server/src/trpc/routes/department/get-many";
import { Designation } from "server/src/trpc/routes/designation/get-many";
import Button from "ui/Button";
import Dialog from "ui/Dialog";
import Divider from "ui/Divider";
import Grid from "ui/Grid";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import { AsyncListContextValue } from "ui/hooks/UseAsyncList";
import { useDialog } from "ui/hooks/UseDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { uploadFileToBlob } from "../utils/azure-blob-upload";
import { handleTRPCError } from "../utils/handle-trpc-error";

export type PersonalInfoDialogProps = {
  asyncList: AsyncListContextValue;
};

export const PersonalInfoDialog = (props: PersonalInfoDialogProps) => {
  const auth = useAuthContext();
  const [firstName, setFirstName] = React.useState("");
  const [middleName, setMiddleName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState(`${new Date()}`);
  const [dateOfJoining, setDateOfJoining] = React.useState(`${new Date()}`);
  const [department, setDepartment] = React.useState<Department[]>([]);
  const [departmentId, setDepartmentId] = React.useState<number>();
  const [designation, setDesignation] = React.useState<Designation[]>([]);
  const [designationId, setDesignationId] = React.useState<number>();
  const [reportingManagerId, setReportingManagerId] = React.useState<number>(2);
  const [fileSelected, setFileSelected] = React.useState<File>();
  const [fileSizeExceedError, setFileSizeExceedError] = React.useState("");
  const [extractionInProgress, setExtractionInProgress] = React.useState(false);
  const [uploadLabel, setUploadLabel] = React.useState(
    "Choose Passport to Upload"
  );
  const value = useDialog();

  const onProfileImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const [file] = event.target.files;

    const fileSize = file.size;
    const fileMb = fileSize / 1024 ** 2;

    if (fileMb >= 2) {
      setFileSizeExceedError("File size should not exceed 2MB.");
      return;
    }

    setFileSizeExceedError("");

    if (!file) return;

    setFileSelected(file);
  };

  const onOCRFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const [file] = event.target.files;

    if (!file) return;

    setExtractionInProgress(true);

    await OCR(file);
  };

  const OCR = async (file: File) => {
    try {
      const { sasToken } = await client.sasToken.get.mutate();

      const imageUrl = await uploadFileToBlob(file, sasToken);

      const ocrResult = await client.ocr.get.mutate(imageUrl);

      setFirstName(ocrResult.extractedDetails?.GivenName || "");
      setLastName(ocrResult.extractedDetails?.Surname || "");
      setUploadLabel("Extraction Completed");
    } catch (error) {
      toast.error("An error occurred.");
      handleTRPCError(error, auth);
    } finally {
      setExtractionInProgress(false);
    }
  };

  const AddPersonalInfo = async () => {
    try {
      if (!fileSelected) return;

      const { sasToken } = await client.sasToken.get.mutate();

      const imageUrl = await uploadFileToBlob(fileSelected, sasToken);

      setFileSelected(undefined);

      if (departmentId === undefined) return;

      if (designationId === undefined) return;

      await client.personalInfo.set.mutate({
        firstName,
        lastName,
        middleName,
        dateOfBirth,
        dateOfJoining,
        departmentId,
        designationId,
        reportingManagerId,
        imageUrl,
      });

      props.asyncList.refresh();

      toast.success("Personal information added successfully!");
    } catch (error) {
      toast.error("An error occurred.");
      handleTRPCError(error, auth);
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        const departments = await client.department.getMany.mutate();

        setDepartment(departments);

        const [firstDepartment] = departments;

        if (firstDepartment === undefined) return;

        setDepartmentId(firstDepartment.id);
      } catch (error) {
        handleTRPCError(error, auth);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const designations = await client.designation.getMany.mutate();

        setDesignation(designations);

        const [firstDesignation] = designations;

        if (firstDesignation === undefined) return;

        setDesignationId(firstDesignation.id);
      } catch (error) {
        handleTRPCError(error, auth);
      }
    })();
  }, []);

  const handleClose = () => {
    setUploadLabel("Choose Passport to Upload");
  };

  return (
    <>
      <Dialog.Trigger {...value} variant="primary">
        Add Personal Info
      </Dialog.Trigger>

      <Dialog {...value} onClose={handleClose}>
        <Dialog.Header title="Add Personal Info" />

        <Dialog.Body style={{ minHeight: "70vh" }}>
          <Stack gap="3">
            <Grid.Row gutters="3">
              <Grid.Col cols={["12", "lg-12"]}>
                <label htmlFor="Photo">
                  <Typography>Photo</Typography>
                </label>

                <label
                  style={{
                    height: 100,
                    width: 100,
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                  className="form-control"
                  htmlFor="personalInfoImageFile"
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ height: 30, width: 30 }}
                  />
                </label>

                <input
                  type="file"
                  style={{
                    display: "none",
                  }}
                  className="form-control"
                  id="personalInfoImageFile"
                  onChange={onProfileImageFileChange}
                />
              </Grid.Col>

              {fileSizeExceedError ? (
                <Typography as="p" color="danger" wrap="nowrap">
                  {fileSizeExceedError}
                </Typography>
              ) : null}

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                  <label htmlFor="First Name">First Name</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={middleName}
                    onChange={(event) => setMiddleName(event.target.value)}
                  />
                  <label htmlFor="Middle Name">Middle Name</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                  <label htmlFor="Last Name">Last Name</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    value={dateOfBirth}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ): void => setDateOfBirth(event.target.value)}
                  />
                  <label htmlFor="DateOfBirth">Date Of Birth</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    value={dateOfJoining}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ): void => setDateOfJoining(event.target.value)}
                  />
                  <label htmlFor="Date Of Joining">Date Of Joining</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <select
                    className="form-control"
                    value={departmentId}
                    onChange={(event) =>
                      setDepartmentId(parseInt(event.target.value))
                    }
                  >
                    <option value={undefined}>Select a Department</option>
                    {department.map((department) => {
                      return (
                        <option value={department.id}>{department.name}</option>
                      );
                    })}
                  </select>
                  <label htmlFor="Department">Department</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <select
                    className="form-control"
                    value={designationId}
                    onChange={(event) =>
                      setDesignationId(parseInt(event.target.value))
                    }
                  >
                    <option value={undefined}>Select a Designation</option>
                    {designation.map((designation) => {
                      return (
                        <option value={designation.id}>
                          {designation.name}
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor="Designation">Designation</label>
                </div>
              </Grid.Col>

              <Divider />

              <Grid.Col cols={["12", "lg-12"]}>
                <Stack gap="3">
                  <label
                    style={{
                      height: 100,
                      width: "auto",
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                    className="form-control"
                    htmlFor="ocrImageFile"
                  >
                    {extractionInProgress
                      ? "Extraction in Progress..."
                      : uploadLabel}
                  </label>
                  <input
                    type="file"
                    style={{
                      display: "none",
                    }}
                    className="form-control"
                    id="ocrImageFile"
                    onChange={onOCRFileChange}
                  />
                </Stack>
              </Grid.Col>
            </Grid.Row>
          </Stack>
        </Dialog.Body>

        <Dialog.Footer>
          <Button
            variant="outline-primary"
            data-bs-toggle="modal"
            data-bs-target={`#${value.id}`}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={AddPersonalInfo}
            data-bs-toggle="modal"
            data-bs-target={`#${value.id}`}
          >
            Submit
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
};

export default PersonalInfoDialog;
