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

export type ContactDialogProps = {
  asyncList: AsyncListContextValue;
};

export const ContactDialog = (props: ContactDialogProps) => {
  const auth = useAuthContext();
  const [userId, setUserId] = React.useState<number>(0);
  const [addressTypeId, setAddressTypeId] = React.useState<number>(1);
  const [street, setStreet] = React.useState("");
  const [city, setCity] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [pincode, setPincode] = React.useState("");
  const [state, setState] = React.useState("");

  const addContactDetails = async () => {
    try {
      await client.address.set.mutate({
        userId,
        addressTypeId,
        city,
        country,
        pincode,
        street,
        state,
      });

      props.asyncList.refresh();

      toast.success("Contact added successfully!");
    } catch (error) {
      toast.error("An error occurred!");

      handleTRPCError(error, auth);
    }
  };

  const value = useDialog();

  return (
    <>
      <Dialog.Trigger {...value} variant="primary">
        Add Contact
      </Dialog.Trigger>

      <Dialog {...value}>
        <Dialog.Header title="Add Address" />
        <Dialog.Body style={{ minHeight: "70vh" }}>
          <Stack gap="3">
            <Grid.Row gutters="3">
              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <select
                    className="form-control"
                    value={addressTypeId}
                    onChange={(e: any) =>
                      setAddressTypeId(parseInt(e.target.value))
                    }
                  >
                    <option value={1}>Residential</option>
                    <option value={2}>Others</option>
                  </select>
                  <label htmlFor="AddressType">Address Type</label>
                </div>
              </Grid.Col>
              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={street}
                    onChange={(event) => setStreet(event.target.value)}
                  />
                  <label htmlFor="street">Street</label>
                </div>
              </Grid.Col>
              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  />
                  <label htmlFor="City">City</label>
                </div>
              </Grid.Col>
              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                  />
                  <label htmlFor="State">State</label>
                </div>
              </Grid.Col>
              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                  />
                  <label htmlFor="Country">Country</label>
                </div>
              </Grid.Col>
              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={pincode}
                    onChange={(event) => setPincode(event.target.value)}
                  />
                  <label htmlFor="Pincode">Pincode</label>
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
            onClick={addContactDetails}
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

export default ContactDialog;
