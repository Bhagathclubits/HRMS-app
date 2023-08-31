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

export type QualificationProps = {
  asyncList: AsyncListContextValue;
};

export const QualificationDialog = (props: QualificationProps) => {
  const auth = useAuthContext();
  const [name, setName] = React.useState("");

  const handleSubmit = async () => {
    try {
      if (name === undefined) return;

      await client.qualification.set.mutate({
        name,
      });

      props.asyncList.refresh();

      toast.success("Qualification added successfully!");
    } catch (error) {
      toast.error("An error occurred!");
      handleTRPCError(error, auth);
    }
  };

  const value = useDialog();

  return (
    <>
      <Dialog.Trigger {...value} variant="primary">
        Add Qualification
      </Dialog.Trigger>
      <Dialog {...value}>
        <Dialog.Header color="primary" title={"Qualification"} />

        <Dialog.Body style={{ minHeight: "70vh" }}>
          <Stack>
            <Grid.Row>
              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <label htmlFor="First Name">Qualification</label>
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

export default QualificationDialog;
