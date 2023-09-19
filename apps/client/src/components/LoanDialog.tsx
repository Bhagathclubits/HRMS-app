import React from "react";
import { toast } from "react-toastify";
import { LoanType } from "server/src/trpc/routes/loan-type/get-many";
import Button from "ui/Button";
import Dialog from "ui/Dialog";
import Grid from "ui/Grid";
import Stack from "ui/Stack";
import { AsyncListContextValue } from "ui/hooks/UseAsyncList";
import { useDialog } from "ui/hooks/UseDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

export type LoanDialogProps = {
  asyncList: AsyncListContextValue;
};

export const LoanDialog = (props: LoanDialogProps) => {
  const auth = useAuthContext();
  const [type, setType] = React.useState<LoanType[]>([]);
  const [typeId, setTypeId] = React.useState<number>();
  const [amount, setAmount] = React.useState<number>();
  const [date, setDate] = React.useState(`${new Date()}`);

  const create = async () => {
    try {
      if (typeId === undefined) return;
      if (amount === undefined) return;
      await client.loan.set.mutate({
        typeId,
        date,
        amount,
      });

      props.asyncList.refresh();

      toast.success("Loan added successfully!");
    } catch (error) {
      toast.error("An error occurred!");

      handleTRPCError(error, auth);
    }
  };

  const value = useDialog();

  React.useEffect(() => {
    (async () => {
      try {
        const loanType = await client.loanType.getMany.mutate();

        setType(loanType);

        const [firstLoan] = loanType;

        if (firstLoan === undefined) return;

        setTypeId(firstLoan.id);
      } catch (error) {
        handleTRPCError(error, auth);
      }
    })();
  }, []);

  return (
    <>
      <Dialog.Trigger {...value} variant="primary">
        Add Loan
      </Dialog.Trigger>

      <Dialog {...value}>
        <Dialog.Header title={"Add Loan"} />

        <Dialog.Body style={{ minHeight: "70vh" }}>
          <Stack gap="5">
            <Grid.Row gutters="3">
              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <select
                    className="form-control"
                    value={typeId}
                    onChange={(e) => setTypeId(parseInt(e.target.value))}
                  >
                    <option value={undefined}>Select Type</option>
                    {type.map((type) => {
                      return (
                        <option value={type.id}>
                          {type.name.at(0)?.toUpperCase()}
                          {type.name.slice(1)}
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor="Loan Type">Loan Type</label>
                </div>
              </Grid.Col>

              <Grid.Col>
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    id="Date"
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ): void => setDate(event.target.value)}
                  />
                  <label htmlFor="Date">From Date</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-12"]}>
                <div className="form-floating">
                  <input
                    className="form-control"
                    id="Amount"
                    type="text"
                    value={amount}
                    onChange={(event) =>
                      setAmount(parseInt(event.target.value))
                    }
                  />
                  <label htmlFor="Amount">Amount</label>
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

export default LoanDialog;
