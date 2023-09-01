import React from "react";
import { toast } from "react-toastify";
import { RelationShip } from "server/src/trpc/routes/relationship/get-many";
import Button from "ui/Button";
import Dialog from "ui/Dialog";
import Grid from "ui/Grid";
import Stack from "ui/Stack";
import { AsyncListContextValue } from "ui/hooks/UseAsyncList";
import { useDialog } from "ui/hooks/UseDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

export type FamilyDialogProps = {
  asyncList: AsyncListContextValue;
};

export const FamilyDialog = (props: FamilyDialogProps) => {
  const auth = useAuthContext();
  const [name, setName] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState(`${new Date()}`);
  const [relationShip, setRelation] = React.useState<RelationShip[]>([]);
  const [relationshipTypeId, setRelationShipTypeId] = React.useState<number>();

  const addFamilyDetails = async () => {
    try {
      if (relationshipTypeId === undefined) return;

      await client.familyDetail.set.mutate({
        name,
        dateOfBirth,
        relationshipTypeId,
      });

      props.asyncList.refresh();

      toast.success("Family details added successfully!");
    } catch (error) {
      toast.error("An error occurred!");
      handleTRPCError(error, auth);
    }
  };

  const value = useDialog();

  React.useEffect(() => {
    (async () => {
      try {
        const relationShipTypes = await client.relationShip.getMany.mutate();

        setRelation(relationShipTypes);

        const [firstRelationShipType] = relationShipTypes;

        if (firstRelationShipType === undefined) return;

        setRelationShipTypeId(firstRelationShipType.id);
      } catch (error) {
        handleTRPCError(error, auth);
      }
    })();
  }, []);

  return (
    <>
      <Dialog.Trigger {...value} variant="primary">
        Add Family
      </Dialog.Trigger>

      <Dialog {...value}>
        <Dialog.Header title="Add Family" />
        <Dialog.Body style={{ minHeight: "70vh" }}>
          <Stack gap="3">
            <Grid.Row gutters="3">
              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <label htmlFor="Name">Name</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-12"]}>
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

              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <select
                    className="form-control"
                    value={relationshipTypeId}
                    onChange={(event) =>
                      setRelationShipTypeId(parseInt(event.target.value))
                    }
                  >
                    <option value={undefined}>Select a Relation</option>
                    {relationShip.map((relation) => {
                      return (
                        <option value={relation.id}>
                          {relation.name.at(0)?.toUpperCase()}
                          {relation.name.slice(1)}
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor="Relation">Relation</label>
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
            onClick={addFamilyDetails}
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

export default FamilyDialog;
