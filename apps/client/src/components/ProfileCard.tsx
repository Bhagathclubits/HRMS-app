import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";
import { PersonalInfo } from "server/src/trpc/routes/personal-infos/get-many";
import Avatar from "ui/Avatar";
import Card from "ui/Card";
import { Link } from "ui/Link";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import { useAuthContext } from "../hooks/UseAuth";
import { client } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

export const ProfileCard = () => {
  const [personalInfo, setPersonalInfo] = React.useState<PersonalInfo | null>(
    null
  );

  const auth = useAuthContext();

  React.useEffect(() => {
    (async () => {
      try {
        const result = await client.personalInfo.getMany.mutate();

        const {
          items: [personalInfo],
        } = result;

        setPersonalInfo(personalInfo);
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
              <Stack orientation="horizontal">
                <Typography color="primary" fontSize="6">
                  <FontAwesomeIcon icon={faCircleUser} /> Profile
                </Typography>
              </Stack>
            }
            action={
              <Link
                color="secondary"
                component={NavLink}
                to="/profile-page"
                state={personalInfo}
              >
                View full details
              </Link>
            }
          ></Card.Header>

          <Stack alignItems="center" gap="5">
            <Avatar
              src={personalInfo?.imageUrl as string}
              style={{ height: "100px" }}
            />

            <Stack alignItems="center" gap="1">
              <Typography>{personalInfo?.firstName}</Typography>
              <Typography>{personalInfo?.id}</Typography>
              <Typography color="body-tertiary">
                {personalInfo?.designation.name}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;
