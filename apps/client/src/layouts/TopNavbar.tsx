import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Container from "ui/Container";
import Drawer from "ui/Drawer";
import Hidden from "ui/Hidden";
import IconButton from "ui/IconButton";
import Link from "ui/Link";
import Navbar from "ui/Navbar";
import PillButton from "ui/PillButton";
import { Typography } from "ui/Typography";
import { useDrawer } from "ui/hooks/UseDrawer";
import { useNavbar } from "ui/hooks/UseNavbar";
import { useAuthContext } from "../hooks/UseAuth";
import { client, resetToken } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";
import { SideNavbarLinks } from "./SideNavbar";

export const TopNavbar = () => {
  const value = useNavbar();

  const auth = useAuthContext();

  const logout = async () => {
    try {
      await client.user.signOut.mutate();
      resetToken();
      auth.dispatcher({ type: "reset-user" });
    } catch (error) {
      handleTRPCError(error, auth);
    }
  };

  const drawer = useDrawer();

  return (
    <>
      <Navbar {...value} expanded="lg" className="border-bottom">
        <Container maxWidth="fluid">
          <Navbar.Brand color="primary"></Navbar.Brand>

          <Navbar.Collapse>
            <Navbar.Links className="gap-3 ms-auto align-items-center">
              <Navbar.LinkItem>
                <Navbar.Link color="primary" component={IconButton}>
                  <FontAwesomeIcon icon={faBell} />
                </Navbar.Link>
              </Navbar.LinkItem>

              <Navbar.LinkItem className="dropdown">
                <Navbar.Link
                  component={PillButton}
                  avatar={<Avatar />}
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />

                {/* TODO: Use menu component from the ui library */}
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link onClick={logout} className="dropdown-item">
                      Logout
                    </Link>
                  </li>
                </ul>
              </Navbar.LinkItem>
            </Navbar.Links>
          </Navbar.Collapse>

          <Hidden hiddenFor="lg" shownFor="auto">
            <Drawer.ToggleButton {...drawer}>
              <FontAwesomeIcon icon={faBars} />
            </Drawer.ToggleButton>

            <Drawer {...drawer} position="start">
              <Drawer.Header>
                <Drawer.Title>
                  <Typography display="6" color="primary" fontWeight="bolder">
                    HRMS
                  </Typography>
                </Drawer.Title>

                <Drawer.Close />
              </Drawer.Header>
              <Drawer.Body>
                <SideNavbarLinks
                  data-bs-dismiss="offcanvas"
                  data-bs-target={`#${drawer.id}`}
                />
              </Drawer.Body>
            </Drawer>
          </Hidden>
        </Container>
      </Navbar>
    </>
  );
};

const Avatar = () => {
  const auth = useAuthContext();

  return (
    <PillButton.Avatar
      src={auth.state.user?.personalInfo?.imageUrl as string}
    />
  );
};

export default TopNavbar;
