import React from "react";
import Button from "ui/Button";
import Dialog from "ui/Dialog";
import Grid from "ui/Grid";
import Stack from "ui/Stack";
// import { useDialog } from "ui/hooks/UseDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

// export type CreateDialogProps = { variant: "update" | "create" };
export const PayrollCreateDialog = () => {
  const auth = useAuthContext();
  const [role, setRole] = React.useState<"admin" | "employee">("employee");
  const [month, setMonth] = React.useState<string>("");
  const [salaryId, setSalaryId] = React.useState<number>(0);
  const [statusId, setStatusId] = React.useState<number>(1);
  const [amount, setAmount] = React.useState<number>(0);
  // const value = useDialog();

  const createUser = async () => {
    try {
      await client.payRoll.set.mutate({
        // name,
        month,
        salaryId,
        statusId,

        // email: email || undefined,
        // mobile: mobile || undefined,
      });
    } catch (error) {
      handleTRPCError(error, auth);
    }
  };

  const value = {
    id: "create-payroll",
    labelId: "create-payroll-label",
  };
  const handleStatus = (e: any) => {
    setStatusId(e.target.value);
  };
  const handleAmount = (e: any) => {
    setAmount(e.target.value);
  };
  return (
    <>
      <Dialog.Trigger {...value} variant="primary">
        Add Payroll
      </Dialog.Trigger>

      <Dialog {...value}>
        <Dialog.Header title="Add Payroll" />
        <Dialog.Body>
          <Stack gap="3">
            <Grid.Row gutters="3">
              {/* <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="John"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <label htmlFor="name">Name</label>
                </div>
              </Grid.Col> */}

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Doe"
                    value={month}
                    onChange={(event) => setMonth(event.target.value)}
                  />
                  <label htmlFor="Month">Month</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <select
                    className="form-control"
                    value={statusId}
                    onChange={(e) => handleStatus(e)}
                  >
                    <option value={1}>Success</option>
                    <option value={2}>Pending</option>
                    <option value={3}>Processing</option>
                    <option value={4}>Declined</option>
                  </select>
                  <label htmlFor="Status">Status</label>
                </div>

                {/* <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    id="password"
                    placeholder="********"
                    value={statusId}
                    onChange={(event) =>
                      setStatusId(event.target .value as number)
                    }
                  />
                  <label htmlFor="password">Password</label>
                </div> */}
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    value={amount}
                    onChange={handleAmount}
                  />
                  <label htmlFor="email">Salary</label>
                </div>
              </Grid.Col>
            </Grid.Row>

            <Grid.Row gutters="3">
              {/* <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="mobile"
                    placeholder="+919876543210"
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                  />
                  <label htmlFor="mobile">Mobile</label>
                </div>
              </Grid.Col> */}
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
            onClick={createUser}
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

export default PayrollCreateDialog;
