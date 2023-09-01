import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-toastify";
import { Company } from "server/dist/trpc/routes/company/get-many";
import { Hr } from "server/dist/trpc/routes/hr/get-many";
import Button from "ui/Button";
import Dialog, { DialogHeader } from "ui/Dialog";
import Grid from "ui/Grid";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import { AsyncListContextValue } from "ui/hooks/UseAsyncList";
import { useDialog } from "ui/hooks/UseDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { uploadFileToBlob } from "../utils/azure-blob-upload";
import { handleTRPCError } from "../utils/handle-trpc-error";

export type VisitorPassDialogProps = {
  asyncList: AsyncListContextValue;
};

export const VisitorPass = (props: VisitorPassDialogProps) => {
  const auth = useAuthContext();
  const [photo, setPhoto] = React.useState("");
  const [name, setName] = React.useState("");
  const [fromPlace, setFromPlace] = React.useState("");
  const [hrId, setHrId] = React.useState<number>();
  const [companyId, setCompanyId] = React.useState<number>();
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [date, setDate] = React.useState(`${new Date()}`);
  const [inTime, setInTime] = React.useState<string>(`${new Date()}`);
  const [outTime, setOutTime] = React.useState<string>(`${new Date()}`);
  const [company, setCompany] = React.useState<Company[]>([]);
  const [hr, setHr] = React.useState<Hr[]>([]);
  const [reason, setReason] = React.useState<string>("");
  const [fileSelected, setFileSelected] = React.useState<File>();
  const [uploading, setUploading] = React.useState(false);
  const [fileSizeExceedError, setFileSizeExceedError] = React.useState("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async () => {
    try {
      setUploading(true);

      let imageUrl;

      if (fileSelected) {
        const { sasToken } = await client.sasToken.get.mutate();

        imageUrl = await uploadFileToBlob(fileSelected, sasToken);
      }

      setFileSelected(undefined);
      setUploading(false);

      if (hrId === undefined) return;

      if (companyId === undefined) return;

      await client.visitorPass.set.mutate({
        imageUrl,
        name,
        fromPlace,
        mobileNumber,
        hrId,
        companyId,
        date,
        inTime,
        outTime,
        reason,
      });

      props.asyncList.refresh();
      toast.success("Visitor pass added successfully!");
    } catch (error) {
      toast.error("An error occurred!");
      handleTRPCError(error, auth);
    }
  };

  const value = useDialog();

  React.useEffect(() => {
    (async () => {
      try {
        const companies = await client.company.getMany.mutate();

        setCompany(companies);

        const [firstCompany] = companies;

        if (firstCompany === undefined) return;

        setCompanyId(firstCompany.id);
      } catch (error) {
        handleTRPCError(error, auth);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        if (companyId === undefined) return;

        const hr = await client.hr.getMany.mutate({ companyId });

        setHr(hr);
      } catch (error) {
        handleTRPCError(error, auth);
      }
    })();
  }, [companyId]);

  return (
    <>
      <Dialog.Trigger {...value} variant="primary">
        Apply Visitor Pass
      </Dialog.Trigger>

      <Dialog {...value}>
        <DialogHeader title="Add Visitor Pass" />
        <Dialog.Body style={{ minHeight: "70vh" }}>
          <Stack gap="3">
            <Grid.Row gutters="3">
              <Grid.Col cols={["12", "xl-12"]}>
                <label htmlFor="Photo">
                  <Typography>Photo</Typography>
                </label>
                <Stack gap="5" orientation="vertical">
                  <label
                    style={{
                      height: 100,
                      width: 100,
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                    className="form-control"
                    htmlFor="visitorPassImageFile"
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
                    id="visitorPassImageFile"
                    onChange={onFileChange}
                  />
                  {fileSizeExceedError ? (
                    <Typography as="p" color="danger" wrap="nowrap">
                      {fileSizeExceedError}
                    </Typography>
                  ) : null}
                </Stack>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <label htmlFor="Visitor Name">Visitor Name</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={fromPlace}
                    onChange={(event) => setFromPlace(event.target.value)}
                  />
                  <label htmlFor="From Place">From Place</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <select
                    className="form-control"
                    value={companyId}
                    onChange={(e) => setCompanyId(parseInt(e.target.value))}
                  >
                    <option value={undefined}>Select Company</option>
                    {company.map((company, index) => {
                      return <option value={company.id}>{company.name}</option>;
                    })}
                  </select>
                  <label htmlFor="Company">Company</label>
                </div>
              </Grid.Col>
              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <select
                    className="form-control"
                    value={hrId}
                    onChange={(e) => setHrId(parseInt(e.target.value))}
                  >
                    <option value={undefined}>Select HR</option>
                    {hr.map((hr, index) => {
                      return <option value={hr.id}>{hr.user.name}</option>;
                    })}
                  </select>
                  <label htmlFor="Hr">Hr</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ): void => setDate(event.target.value)}
                  />
                  <label htmlFor="From Date">From Date</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={mobileNumber}
                    onChange={(event) => setMobileNumber(event.target.value)}
                  />
                  <label htmlFor="Mobile Number">Mobile Number</label>
                </div>
              </Grid.Col>
              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="date-time"
                    className="form-control"
                    value={inTime}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setInTime(event.target.value)
                    }
                  />
                  <label htmlFor="InTime">In-Time</label>
                </div>
              </Grid.Col>
              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="date-time"
                    className="form-control"
                    value={outTime}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setOutTime(event.target.value)
                    }
                  />
                  <label htmlFor="OutTime">Out-Time</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "xl-12"]}>
                <div className="form-floating">
                  <textarea
                    className="form-control"
                    id="floatingTextarea2"
                    style={{ height: "100px" }}
                    value={reason}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setReason(event.target.value)
                    }
                  />
                  <label htmlFor="Reason">Reason</label>
                </div>
              </Grid.Col>
            </Grid.Row>
          </Stack>
        </Dialog.Body>
        <Dialog.Footer>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Button
              variant="primary"
              className="center"
              onClick={handleSubmit}
              data-bs-toggle="modal"
              data-bs-target={`#${value.id}`}
            >
              Confirm
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog>
    </>
  );
};

export default VisitorPass;
