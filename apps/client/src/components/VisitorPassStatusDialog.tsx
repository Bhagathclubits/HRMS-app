import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-toastify";
import { VisitorPassStatus } from "server/src/trpc/routes/visitor-pass-status/get-many";
import Button from "ui/Button";
import Dialog from "ui/Dialog";
import Stack from "ui/Stack";
import { AsyncListContextValue } from "ui/hooks/UseAsyncList";
import { useDialog } from "ui/hooks/UseDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

export type VisitorPassStatusProps = {
  visitorPassId: number;
  variant: "admin" | "employee";
  asyncList: AsyncListContextValue;
};

const VisitorPassStatusDialog = (props: VisitorPassStatusProps) => {
  const auth = useAuthContext();
  const [status, setStatus] = React.useState<VisitorPassStatus[]>([]);
  const [statusId, setStatusId] = React.useState<number>();
  const [remarks, setRemarks] = React.useState("");
  const value = useDialog();

  const handleSubmit = async () => {
    try {
      if (statusId === undefined) return;

      await client.visitorPass.adminUpdate.mutate({
        id: props.visitorPassId,
        remarks: remarks,
        statusId: statusId,
      });

      props.asyncList.refresh();

      toast.success("Visitor Pass status successfully changed!");
    } catch (error) {
      toast.error("An error occurred!");
      handleTRPCError(error, auth);
    }
  };

  React.useEffect(() => {
    (async () => {
      const status = await client.visitorPassStatus.getMany.mutate();

      setStatus(status);

      const [firstStatus] = status;

      if (firstStatus === undefined) return;

      setStatusId(firstStatus.id);
    })();
  }, []);

  return (
    <>
      <Stack orientation="horizontal" gap="3">
        <Dialog.Trigger {...value} variant="success">
          <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
        </Dialog.Trigger>
        <Dialog.Trigger {...value} variant="danger">
          <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
        </Dialog.Trigger>
      </Stack>

      <Dialog {...value}>
        <Dialog.Header title="Add Visitor Pass Status" />
        <Dialog.Body style={{ minHeight: "70vh" }}>
          <Stack gap="3">
            <Stack>
              <div className="form-floating">
                <select
                  className="form-control"
                  value={statusId}
                  onChange={(event) =>
                    setStatusId(parseInt(event.target.value))
                  }
                >
                  {status.map((status) => {
                    return <option value={status.id}>{status.name}</option>;
                  })}
                </select>
                <label htmlFor="Status">Status</label>
              </div>
            </Stack>
            <Stack>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Remarks"
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                  required
                />
                <label htmlFor="Remarks">Remarks</label>
              </div>
            </Stack>
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
              type="submit"
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

export default VisitorPassStatusDialog;
