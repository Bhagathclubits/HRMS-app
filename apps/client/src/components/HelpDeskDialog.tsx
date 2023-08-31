import React from "react";
import { toast } from "react-toastify";
import { HelpdeskCategories } from "server/src/trpc/routes/category/get-many";
import Button from "ui/Button";
import Dialog from "ui/Dialog";
import Grid from "ui/Grid";
import Stack from "ui/Stack";
import { AsyncListContextValue } from "ui/hooks/UseAsyncList";
import { useDialog } from "ui/hooks/UseDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

export type HelpDeskDialogProps = {
  asyncList: AsyncListContextValue;
};

export const HelpDeskDialog = (props: HelpDeskDialogProps) => {
  const auth = useAuthContext();
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<HelpdeskCategories[]>([]);
  const [categoryId, setCategoryId] = React.useState<number>();
  const [description, setDescription] = React.useState("");

  const create = async () => {
    try {
      if (categoryId === undefined) return;

      await client.helpDesk.set.mutate({
        title,
        categoryId,
        description,
      });

      props.asyncList.refresh();
      toast.success("Help Desk added successfully!");
    } catch (error) {
      toast.error("An error occurred!");
      handleTRPCError(error, auth);
    }
  };

  const value = useDialog();

  React.useEffect(() => {
    (async () => {
      try {
        const helpDeskCategories =
          await client.helpDeskCategories.getMany.mutate();

        setCategory(helpDeskCategories);

        const [firstCategory] = helpDeskCategories;

        if (firstCategory === undefined) return;

        setCategoryId(firstCategory.id);
      } catch (error) {
        handleTRPCError(error, auth);
      }
    })();
  }, []);

  return (
    <>
      <Dialog.Trigger {...value} variant="primary">
        Add Help Desk
      </Dialog.Trigger>
      <Dialog {...value}>
        <Dialog.Header title={"Help Desk"} />

        <Dialog.Body style={{ minHeight: "70vh" }}>
          <Stack gap="5">
            <Grid.Row gutters="3">
              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                  <label htmlFor="First Name">Title</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <select
                    className="form-control"
                    value={categoryId}
                    onChange={(e) => setCategoryId(parseInt(e.target.value))}
                  >
                    <option value={undefined}>Select Category</option>
                    {category.map((category) => {
                      return (
                        <option value={category.id}>{category.name}</option>
                      );
                    })}
                  </select>
                  <label htmlFor="Category">Category</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                  <label htmlFor="First Name">Description</label>
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
              onClick={create}
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

export default HelpDeskDialog;
