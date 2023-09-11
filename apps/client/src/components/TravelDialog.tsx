import React from "react";
import { toast } from "react-toastify";
import Button from "ui/Button";
import Dialog from "ui/Dialog";
import Grid from "ui/Grid";
import Stack from "ui/Stack";
import { AsyncListContextValue } from "ui/hooks/UseAsyncList";
import { useDialog } from "ui/hooks/UseDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";
export type TravelDialogProps = {
  asyncList: AsyncListContextValue;
};

export const TravelDialog = (props: TravelDialogProps) => {
  const auth = useAuthContext();
  const [fromDate, setFromDate] = React.useState(`${new Date()}`);
  const [toDate, setToDate] = React.useState(`${new Date()}`);
  const [place, setPlace] = React.useState("");

  const handleSubmit = async () => {
    try {
      await client.travel.set.mutate({
        place,
        fromDate,
        toDate,
      });

      props.asyncList.refresh();
      toast.success("Travel added successfully!");
    } catch (error) {
      toast.error("An error occurred!");
      handleTRPCError(error, auth);
    }
  };

  const value = useDialog();

  return (
    <>
      <Dialog.Trigger {...value} variant="primary">
        Add Travel
      </Dialog.Trigger>

      <Dialog {...value}>
        <Dialog.Header title="Add Travel" />

        <Dialog.Body style={{ minHeight: "70vh" }}>
          <Stack gap="3">
            <Grid.Row gutters="3">
              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={place}
                    onChange={(event) => setPlace(event.target.value)}
                  />
                  <label htmlFor="From Place">Place</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ): void => setFromDate(event.target.value)}
                  />
                  <label htmlFor="DateOfBirth">From Date</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ): void => setToDate(event.target.value)}
                  />
                  <label htmlFor="DateOfBirth">To Date</label>
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

export default TravelDialog;
