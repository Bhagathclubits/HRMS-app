import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";
import Card from "ui/Card";
import { Link } from "ui/Link";
import { List } from "ui/List";

import { Leave } from "server/dist/trpc/routes/leaves/employee-get-many";
import Avatar from "ui/Avatar";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

export const LeaveCard = () => {
  const [leaves, setLeaves] = React.useState<Leave[]>([]);

  const auth = useAuthContext();

  React.useEffect(() => {
    (async () => {
      try {
        const result = await client.leave.employeeGetMany.mutate({
          limit: 5,
          page: 0,
        });

        const { items } = result;

        setLeaves(items);
      } catch (error) {
        handleTRPCError(error, auth);
      }
    })();
  }, []);

  return (
    <Card>
      <Card.Body>
        <Stack gap="3">
          <Card.Header
            title={
              <Typography color="primary" fontSize="6">
                <FontAwesomeIcon icon={faPersonWalkingArrowRight} /> Leave
              </Typography>
            }
            action={
              <Link
                color="secondary"
                component={NavLink}
                to="/leave"
                style={{ border: "none" }}
              >
                View all
              </Link>
            }
          ></Card.Header>

          <List.UnBordered>
            {leaves.map((leave, index) => (
              <LeaveCardItem leave={leave} key={leave.id} />
            ))}
          </List.UnBordered>
        </Stack>
      </Card.Body>
    </Card>
  );
};

export type LeaveCardItemProps = {
  leave: Leave;
};

export const LeaveCardItem = ({ leave }: LeaveCardItemProps) => {
  return (
    <List.Item>
      <Stack orientation="horizontal" gap="3">
        <Avatar
          src={leave?.user.personalInfo?.imageUrl as string}
          style={{ height: "40px" }}
        />{" "}
        <Stack
          orientation="horizontal"
          gap="3"
          justifyContent="between"
          alignItems="center"
          className="w-100"
        >
          <Stack gap="1">
            <Typography as="span">
              {leave.user.personalInfo?.firstName}{" "}
              {leave?.user.personalInfo?.lastName}
            </Typography>
            <Typography as="span">{leave?.leaveType.name}</Typography>
          </Stack>

          <Typography as="span" color="danger">
            {leave?.fromDate ? leave.fromDate.toDateString() : ""} -{" "}
            {leave?.fromDate ? leave.toDate.toDateString() : ""}{" "}
          </Typography>
        </Stack>
      </Stack>
    </List.Item>
  );
};

export default LeaveCard;
