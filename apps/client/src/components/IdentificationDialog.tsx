import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-toastify";
import { IdentificationTypes } from "server/src/trpc/routes/identification/identificationType/get-many";
import Button from "ui/Button";
import Dialog, { DialogHeader } from "ui/Dialog";
import Grid from "ui/Grid";
import List from "ui/List";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import { AsyncListContextValue } from "ui/hooks/UseAsyncList";
import { useDialog } from "ui/hooks/UseDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

export type ACTION =
  | {
      type: "ADD_IDENTIFICATION";
    }
  | {
      type: "REMOVE_IDENTIFICATION";
      payload: string;
    }
  | {
      type: "CHANGE_ACTIVE_IDENTIFICATION";
      payload: Identification;
    };

export type Identification = {
  identificationType: string;
  identificationNumber: string;
};

export type State = {
  identifications: Map<string, Identification>;
  activeIdentification: Identification;
};

const reducer = (previousState: State, action: ACTION): State => {
  switch (action.type) {
    case "ADD_IDENTIFICATION": {
      if (
        !previousState.activeIdentification.identificationNumber ||
        !previousState.activeIdentification.identificationType
      )
        return { ...previousState };

      const identifications = new Map(previousState.identifications);
      identifications.set(
        previousState.activeIdentification.identificationType,
        previousState.activeIdentification
      );

      return {
        ...previousState,
        identifications,
        activeIdentification: {
          identificationNumber: "",
          identificationType: "",
        },
      };
    }

    case "REMOVE_IDENTIFICATION": {
      const identifications = new Map(previousState.identifications);
      identifications.delete(action.payload);

      return { ...previousState, identifications };
    }

    case "CHANGE_ACTIVE_IDENTIFICATION": {
      return { ...previousState, activeIdentification: action.payload };
    }

    default: {
      return { ...previousState };
    }
  }
};

export type IdentificationDialogProps = {
  asyncList: AsyncListContextValue;
};

export const IdentificationDialog = (props: IdentificationDialogProps) => {
  const auth = useAuthContext();
  // const [number, setNumber] = React.useState("");
  const [identificationTypes, setIdentificationTypes] = React.useState<
    IdentificationTypes[]
  >([]);

  const [state, dispatch] = React.useReducer(reducer, {
    identifications: new Map(),
    activeIdentification: {
      identificationType: "",
      identificationNumber: "",
    },
  });

  const handleSubmit = async () => {
    try {
      dispatch({
        type: "ADD_IDENTIFICATION",
      });

      await client.identification.setMany.mutate(
        Array.from(state.identifications.values()).map((identification) => ({
          typeId: parseInt(identification.identificationType),
          number: identification.identificationNumber,
        }))
      );

      props.asyncList.refresh();

      toast.success("Identification added successfully!");
    } catch (error) {
      toast.error("An error occurred!");

      handleTRPCError(error, auth);
    }
  };

  const value = useDialog();

  React.useEffect(() => {
    (async () => {
      try {
        const identificationTypes =
          await client.identificationTypes.getMany.mutate();

        setIdentificationTypes(identificationTypes);

        const [firstIdentificationType] = identificationTypes;

        if (firstIdentificationType === undefined) return;

        dispatch({
          type: "CHANGE_ACTIVE_IDENTIFICATION",
          payload: {
            identificationType: `${firstIdentificationType.id}`,
            identificationNumber: "",
          },
        });
      } catch (error) {
        handleTRPCError(error, auth);
      }
    })();
  }, []);

  return (
    <>
      <Dialog.Trigger {...value} variant="primary">
        Add Identification
      </Dialog.Trigger>

      <Dialog {...value}>
        <DialogHeader title="Add Identification" />
        <Dialog.Body style={{ minHeight: "70vh" }}>
          <Grid.Row gutters="3">
            {state.identifications.size > 0 ? (
              <Grid.Col cols="12">
                <List>
                  {Array.from(state.identifications).map((identification) => (
                    <List.Item key={identification[0]}>
                      <Stack orientation="horizontal" gap="1">
                        <Stack gap="1">
                          <Typography as="span" color="body-tertiary">
                            {
                              identificationTypes.find(
                                (type) =>
                                  type.id ===
                                  parseInt(identification[1].identificationType)
                              )?.name
                            }
                          </Typography>

                          <Typography as="span">
                            {identification[1].identificationNumber}
                          </Typography>
                        </Stack>

                        <Button
                          onClick={() =>
                            dispatch({
                              type: "REMOVE_IDENTIFICATION",
                              payload: identification[1].identificationType,
                            })
                          }
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </Stack>
                    </List.Item>
                  ))}
                </List>
              </Grid.Col>
            ) : null}

            <Grid.Col cols={["12", "lg-12"]}>
              <div className="form-floating">
                <select
                  className="form-control"
                  value={state.activeIdentification.identificationType}
                  onChange={(event) =>
                    dispatch({
                      type: "CHANGE_ACTIVE_IDENTIFICATION",
                      payload: {
                        identificationType: event.target.value,
                        identificationNumber:
                          state.activeIdentification.identificationNumber,
                      },
                    })
                  }
                >
                  <option value={undefined}>Select IdentificationType</option>
                  {identificationTypes.map((identification, index) => {
                    return (
                      <option
                        value={identification.id}
                        disabled={state.identifications.has(
                          `${identification.id}`
                        )}
                      >
                        {identification.name}
                      </option>
                    );
                  })}
                </select>
                <label htmlFor="Identification Types">
                  Identification Types
                </label>
              </div>
            </Grid.Col>

            <Grid.Col cols={["12", "lg-12"]}>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="number"
                  value={state.activeIdentification.identificationNumber}
                  onChange={(event) =>
                    dispatch({
                      type: "CHANGE_ACTIVE_IDENTIFICATION",
                      payload: {
                        identificationNumber: event.target.value,
                        identificationType:
                          state.activeIdentification.identificationType,
                      },
                    })
                  }
                />
                <label htmlFor="Identification Number">
                  Identification Number
                </label>
              </div>
            </Grid.Col>

            <Grid.Col cols="12">
              <Button
                variant="primary"
                onClick={() =>
                  dispatch({
                    type: "ADD_IDENTIFICATION",
                  })
                }
              >
                Add
              </Button>
            </Grid.Col>
          </Grid.Row>
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

export default IdentificationDialog;
