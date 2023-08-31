import React from "react";
import { toast } from "react-toastify";
import Button from "ui/Button";
import Dialog from "ui/Dialog";
import Grid from "ui/Grid";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import { useDialog } from "ui/hooks/UseDialog";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";
export const CreateUserDialog = () => {
  const auth = useAuthContext();
  const [role, setRole] = React.useState<"admin" | "employee">("employee");
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const createUser = async () => {
    try {
      await client.user.set.mutate({
        name,
        username,
        password,
        role,
        email,
      });
      toast.success("User created successfully!");
    } catch (error) {
      toast.error("An error occurred!");
      handleTRPCError(error, auth);
    }
  };

  const value = useDialog();

  return (
    <>
      <Dialog.Trigger {...value} variant="primary">
        Create User
      </Dialog.Trigger>
      <Dialog {...value}>
        <Dialog.Header title={"Add User"} />

        <Dialog.Body style={{ minHeight: "70vh" }}>
          <Stack gap="3">
            <div>
              <Typography as="h6" color="secondary">
                Role
              </Typography>

              <div className="btn-group" role="group" data-toggle="buttons">
                <input
                  type="radio"
                  className="btn-check"
                  name="role"
                  id="employee"
                  autoComplete="off"
                  checked={role === "employee"}
                  onChange={() => setRole("employee")}
                />
                <label className="btn btn-outline-primary" htmlFor="employee">
                  Employee
                </label>

                <input
                  type="radio"
                  className="btn-check"
                  name="role"
                  id="admin"
                  autoComplete="off"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                />
                <label className="btn btn-outline-primary" htmlFor="admin">
                  Admin
                </label>
              </div>
            </div>

            <Grid.Row gutters="3">
              <Grid.Col cols={["12", "lg-6"]}>
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
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Doe"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                  <label htmlFor="username">Username</label>
                </div>
              </Grid.Col>

              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="********"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <label htmlFor="password">Password</label>
                </div>
              </Grid.Col>
              <Grid.Col cols={["12", "lg-6"]}>
                <div className="form-floating">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="john@gmail.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <label htmlFor="email">Email</label>
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

export default CreateUserDialog;
