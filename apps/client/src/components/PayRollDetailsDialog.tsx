import { PayRoll } from "server/src/trpc/routes/pay-rolls/get-many";
import Button from "ui/Button";
import Dialog from "ui/Dialog";
import Divider from "ui/Divider";
import Grid from "ui/Grid";
import Hidden from "ui/Hidden";
import Link from "ui/Link";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import { useDialog } from "ui/hooks/useDialog";

export type PayRollDetailsProps = {
  payRollDetails: PayRoll;
};

const handlePrint = () => {
  const tabContent = document.querySelector(`#section-to-print-payslip`);
  if (tabContent) {
    const printWindow = window.open("", "Print");
    printWindow?.document.open();
    printWindow?.document.write(`
      <html>
        <head>
          <title>Print</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
        </head>
        <body>
          ${tabContent.innerHTML}
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  }
};

const PayRollDetailsDialog = (props: PayRollDetailsProps) => {
  const value = useDialog();

  const earnings = props.payRollDetails.paySlipComponents.filter(
    (component) => Number(component.amount) > 0
  );
  const deductions = props.payRollDetails.paySlipComponents.filter(
    (component) => Number(component.amount) < 0
  );

  return (
    <>
      <Dialog.Trigger {...value} color="primary" className="border-0">
        <Link>Payslip</Link>
      </Dialog.Trigger>

      <Dialog {...value} modalDialogSize="lg">
        <Dialog.Header title="" className="border-0"></Dialog.Header>

        <Dialog.Body
          id="section-to-print-payslip"
          style={{ minHeight: "70vh" }}
        >
          <Grid.Row className="mb-2">
            <Grid.Col cols={["lg-4", "md-6", "12"]}>
              <Stack orientation="horizontal">
                <Typography color="secondary">Emp Code:&nbsp;</Typography>
                <Typography>{props.payRollDetails.user.id}</Typography>
              </Stack>
            </Grid.Col>

            <Grid.Col cols={["lg-4", "md-6", "12"]}>
              <Stack orientation="horizontal">
                <Typography color="secondary">Name:&nbsp;</Typography>
                <Typography>
                  {props.payRollDetails.user.personalInfo?.firstName}{" "}
                  {props.payRollDetails.user.personalInfo?.lastName}
                </Typography>
              </Stack>
            </Grid.Col>

            <Grid.Col cols={["lg-4", "md-6", "12"]}>
              <Stack orientation="horizontal">
                <Typography color="secondary">Period:&nbsp;</Typography>
                <Typography>
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    year: "2-digit",
                  }).format(
                    new Date().setFullYear(
                      props.payRollDetails.year,
                      props.payRollDetails.month,
                      1
                    )
                  )}
                </Typography>
              </Stack>
            </Grid.Col>

            <Grid.Col cols={["12", "lg-6"]}>
              <Stack orientation="horizontal">
                <Typography color="secondary">Department:&nbsp;</Typography>
                <Typography>
                  {props.payRollDetails.user.personalInfo?.department.name}
                </Typography>
              </Stack>
            </Grid.Col>

            <Grid.Col cols={["12", "lg-6"]}>
              <Stack orientation="horizontal">
                <Typography color="secondary">Designation:&nbsp;</Typography>
                <Typography>
                  {props.payRollDetails.user.personalInfo?.designation.name}
                </Typography>
              </Stack>
            </Grid.Col>
          </Grid.Row>
          <Divider />

          <Grid.Row className="m-2 my-4">
            <Grid.Col cols={["md-7", "12"]}>
              <Stack>
                <Typography color="primary" fontWeight="bold">
                  Earning
                </Typography>
                {earnings.map((earning) => (
                  <Stack justifyContent="between" orientation="horizontal">
                    <Typography fontWeight="bold">
                      {earning.componentType.name}
                    </Typography>
                    <Typography>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "INR",
                      }).format(Number(earning.amount))}
                    </Typography>
                  </Stack>
                ))}

                <Stack justifyContent="between" orientation="horizontal">
                  <Typography fontWeight="bold">Total</Typography>
                  <Typography>
                    {" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "INR",
                      signDisplay: "never",
                    }).format(
                      earnings.reduce(
                        (acc, curr) => acc + Number(curr.amount),
                        0
                      )
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Grid.Col>

            <Hidden shownFor={"auto"} hiddenFor={"md"}>
              <br />
            </Hidden>

            <Grid.Col cols={["md-5", "12"]}>
              <Stack>
                <Typography color="primary" fontWeight="bold">
                  Deductions
                </Typography>
                {deductions.map((deduction) => (
                  <Stack justifyContent="between" orientation="horizontal">
                    <Typography fontWeight="bold">
                      {deduction.componentType.name}
                    </Typography>
                    <Typography>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "INR",
                        signDisplay: "never",
                      }).format(Number(deduction.amount))}
                    </Typography>
                  </Stack>
                ))}

                <Stack justifyContent="between" orientation="horizontal">
                  <Typography fontWeight="bold">Total</Typography>
                  <Typography>
                    {" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "INR",
                      signDisplay: "never",
                    }).format(
                      deductions.reduce(
                        (acc, curr) => acc + Number(curr.amount),
                        0
                      )
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Grid.Col>
          </Grid.Row>

          <Divider className="mt-2 mb-4" />

          <Grid.Row>
            <Grid.Col cols="7">
              <Stack justifyContent="between" orientation="horizontal">
                <Typography fontWeight="bold" color="primary">
                  Net Pay
                </Typography>
                <Typography>
                  {" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "INR",
                  }).format(
                    Number(
                      props.payRollDetails.paySlipComponents.reduce(
                        (acc, curr) => acc + Number(curr.amount),
                        0
                      )
                    )
                  )}
                </Typography>
              </Stack>
            </Grid.Col>
          </Grid.Row>
        </Dialog.Body>

        <Dialog.Footer className="border-0">
          <Button variant="primary" onClick={handlePrint} className="m-auto">
            Print
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
};
export default PayRollDetailsDialog;
