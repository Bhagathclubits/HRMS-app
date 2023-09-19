import { faCheck, faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-toastify";
import { LoanStatus } from "server/src/trpc/routes/loan-status/get-many";
import Button from "ui/Button";
import Dialog from "ui/Dialog";
import Stack from "ui/Stack";
import { AsyncListContextValue } from "ui/hooks/UseAsyncList";
import { useDialog } from "ui/hooks/UseDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

export type loanStatusProps = {
  loanId: number;
  variant: "admin" | "employee";
  asyncList: AsyncListContextValue;
};

const LoanStatusDialog = (props: loanStatusProps) => {
  const auth = useAuthContext();
  const [status, setStatus] = React.useState<LoanStatus[]>([]);
  const [statusId, setStatusId] = React.useState<number>();
  const [remarks, setRemarks] = React.useState("");
  const value = useDialog();

  const handleSubmit = async () => {
    try {
      if (statusId === undefined) return;
      toast.success("Loan status changed successfully!");

      await client.loan.adminUpdate.mutate({
        id: props.loanId,
        remarks: remarks,
        statusId: statusId,
      });

      props.asyncList.refresh();
    } catch (error) {
      toast.error("An error occurred!");
      handleTRPCError(error, auth);
    }
  };

  React.useEffect(() => {
    (async () => {
      const status = await client.loanStatus.getMany.mutate();

      setStatus(status);

      const [firstStatus] = status;

      if (firstStatus === undefined) return;

      setStatusId(firstStatus.id);
    })();
  }, []);

  const handleAccept = () => {
    const acceptedStatus = status.find((s) => s.name === "accepted");

    if (acceptedStatus) {
      setStatusId(acceptedStatus.id);
    }
  };

  const handleReject = () => {
    const rejectedStatus = status.find((s) => s.name === "rejected");

    if (rejectedStatus) {
      setStatusId(rejectedStatus.id);
    }
  };

  return (
    <>
      <Stack orientation="horizontal" gap="2">
        <Dialog.Trigger {...value} variant="success">
          {props.variant === "admin" ? (
            <FontAwesomeIcon icon={faCheck} onClick={handleAccept} />
          ) : (
            <FontAwesomeIcon icon={faPencil} />
          )}
        </Dialog.Trigger>

        <Dialog.Trigger {...value} variant="danger">
          {props.variant === "admin" ? (
            <FontAwesomeIcon icon={faXmark} onClick={handleReject} />
          ) : (
            <FontAwesomeIcon icon={faPencil} />
          )}
        </Dialog.Trigger>
      </Stack>

      <Dialog {...value}>
        <Dialog.Header title="Add Expense Status" />

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
                    return (
                      <option value={status.id}>
                        {status.name.at(0)?.toUpperCase()}
                        {status.name.slice(1)}
                      </option>
                    );
                  })}
                </select>
                <label htmlFor="status">Status</label>
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
                <label>Remarks</label>
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
              data-bs-toggle="modal"
              data-bs-target={`#${value.id}`}
              onClick={handleSubmit}
            >
              Confirm
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog>
    </>
  );
};

export default LoanStatusDialog;
