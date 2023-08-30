import React from "react";
import { toast } from "react-toastify";
import { LeaveType } from "server/src/trpc/routes/leaves/leave-types/get-many";
import Button from "ui/Button";
import Dialog from "ui/Dialog";
import Grid from "ui/Grid";
import Stack from "ui/Stack";
import { AsyncListContextValue } from "ui/hooks/UseAsyncList";
import { useDialog } from "ui/hooks/UseDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";
export type LeaveDialogProps = {
  asyncList: AsyncListContextValue;
};

export const LeaveDialog = (props: LeaveDialogProps) => {
  const auth = useAuthContext();
  const [fromDate, setFromDate] = React.useState(`${new Date()}`);
  const [toDate, setToDate] = React.useState(`${new Date()}`);
  const [leaveType, setLeaveType] = React.useState<LeaveType[]>([]);
  const [leaveTypeId, setLeaveTypeId] = React.useState<number>();
  const [noOfDays, setNoOfDays] = React.useState<number>(0);

  const handleSubmit = async () => {
    try {
      if (leaveTypeId === undefined) return;

      await client.leave.set.mutate({
        noOfDays,
        fromDate,
        toDate,
        leaveTypeId,
      });

      props.asyncList.refresh();
      toast.success("Leave added successfully!");
    } catch (error) {
      toast.error("An error occurred!");
      handleTRPCError(error, auth);
    }
  };

  const value = useDialog();

  React.useEffect(() => {
    (async () => {
      try {
        const leaveTypes = await client.leaveType.getMany.mutate();

        setLeaveType(leaveTypes);

        const [firstLeaveType] = leaveTypes;

        if (firstLeaveType === undefined) return;

        setLeaveTypeId(firstLeaveType.id);
      } catch (error) {
        handleTRPCError(error, auth);
      }
    })();
  }, []);

  return (
    <>
      <Dialog.Trigger {...value} variant="primary">
        Apply Leave
      </Dialog.Trigger>

      <Dialog {...value}>
        <Dialog.Header title="Add Leave" />
        <Dialog.Body>
          <Stack gap="3">
            <Grid.Row gutters="3">
              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    value={noOfDays}
                    onChange={(event) =>
                      setNoOfDays(parseInt(event.target.value))
                    }
                  />
                  <label htmlFor="NoOfDays">No Of Days</label>
                </div>
              </Grid.Col>
              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    min={new Date().toISOString().split("T")[0]}
                    max={
                      new Date(new Date().valueOf() + 45 * 12 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ): void => setFromDate(event.target.value)}
                  />
                  <label htmlFor="From Date">From Date</label>
                </div>
              </Grid.Col>
              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ): void => setToDate(event.target.value)}
                    min={fromDate}
                    max={
                      new Date(new Date().valueOf() + 45 * 12 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                  <label htmlFor="TO Date">To Date</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <select
                    className="form-control"
                    value={leaveTypeId}
                    onChange={(e) => setLeaveTypeId(parseInt(e.target.value))}
                  >
                    <option value={undefined}>Select Leave Type</option>
                    {leaveType.map((leaveType) => {
                      return (
                        <option value={leaveType.id}>{leaveType.name}</option>
                      );
                    })}
                  </select>
                  <label htmlFor="Leave Type">Leave Type</label>
                </div>
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
            onClick={handleSubmit}
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

export default LeaveDialog;
