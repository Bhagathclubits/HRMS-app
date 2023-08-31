import {
  faBullhorn,
  faBusinessTime,
  faCircleUser,
  faCircleXmark,
  faClipboard,
  faHome,
  faLandmark,
  faPersonWalkingArrowRight,
  faPlaneDeparture,
  faQuestionCircle,
  faReceipt,
  faRightFromBracket,
  faSliders,
  faTriangleExclamation,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties } from "react";
import { NavLink, NavLinkProps, useMatch } from "react-router-dom";
import Link from "ui/Link";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import ShowIf from "../components/ShowIf";
import { useAuthContext } from "../hooks/UseAuth";
import { client, resetToken } from "../main";
import { handleTRPCError } from "../utils/handle-trpc-error";

export const _baseStyles: CSSProperties = {
  color: "var(--bs-secondary)",
  margin: "0.5rem",
  borderRadius: "0.25rem",
  padding: "0.5rem",
  lineHeight: 1,
  textDecoration: "none",
};

export const _activeStyles: CSSProperties = {
  ..._baseStyles,
  backgroundColor: "var(--bs-primary)",
  color: "var(--bs-white)",
};

export const _inActiveStyles: CSSProperties = {
  ..._baseStyles,
};

export const getActiveStyles: NavLinkProps["style"] = ({ isActive }) =>
  isActive ? _activeStyles : _inActiveStyles;

export type SideNavbarProps = {
  width: string;
};

export const SideNavbar = ({ width }: SideNavbarProps) => {
  return (
    <Stack
      gap="5"
      justifyContent="between"
      className="border-end p-2 h-100"
      style={{ width }}
    >
      <Stack.Item cols="12">
        <Stack gap="3">
          <Stack alignItems="center">
            <Typography as="h3" color="primary" fontWeight="bolder">
              HRMS
            </Typography>
          </Stack>

          <SideNavbarLinks />
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

export type SideNavbarLinksProps = JSX.IntrinsicElements["div"] & {};

export const SideNavbarLinks = (props: SideNavbarLinksProps) => {
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

  return (
    <Stack>
      <ShowIf.Employee>
        <Link component={NavLink} to="home" style={getActiveStyles}>
          <Stack gap="2" orientation="horizontal" {...props}>
            <IconAlignment icon={<FontAwesomeIcon icon={faHome} />} />
            <Typography as="span">Home</Typography>
          </Stack>
        </Link>
      </ShowIf.Employee>

      <Link component={NavLink} to="account" style={getActiveStyles}>
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment icon={<FontAwesomeIcon icon={faCircleUser} />} />
          <Typography as="span">Profile</Typography>
        </Stack>
      </Link>

      <Link component={NavLink} to="leave" style={getActiveStyles}>
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment
            icon={<FontAwesomeIcon icon={faPersonWalkingArrowRight} />}
          />
          <Typography as="span">Leave</Typography>
        </Stack>
      </Link>

      <Link to="time-sheet" component={NavLink} style={getActiveStyles}>
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment icon={<FontAwesomeIcon icon={faBusinessTime} />} />
          <Typography as="span">Time management</Typography>
        </Stack>
      </Link>

      <Link to="pay-roll" component={NavLink} style={getActiveStyles}>
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment icon={<FontAwesomeIcon icon={faReceipt} />} />
          <Typography as="span">Payroll</Typography>
        </Stack>
      </Link>

      <Link to="help-desk" component={NavLink} style={getActiveStyles}>
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment icon={<FontAwesomeIcon icon={faQuestionCircle} />} />
          <Typography as="span">Help desk</Typography>
        </Stack>
      </Link>

      <Link to="visitor-pass" component={NavLink} style={getActiveStyles}>
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment icon={<FontAwesomeIcon icon={faCircleXmark} />} />
          <Typography as="span">Visitor pass</Typography>
        </Stack>
      </Link>

      <Link component={NavLink} to="travel" style={getActiveStyles}>
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment icon={<FontAwesomeIcon icon={faPlaneDeparture} />} />
          <Typography as="span">Travel</Typography>
        </Stack>
      </Link>

      <Link component={NavLink} to="expense" style={getActiveStyles}>
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment icon={<FontAwesomeIcon icon={faClipboard} />} />
          <Typography as="span">Expense</Typography>
        </Stack>
      </Link>

      <Link component={NavLink} to="loan" style={getActiveStyles}>
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment icon={<FontAwesomeIcon icon={faLandmark} />} />
          <Typography as="span">Loan</Typography>
        </Stack>
      </Link>

      <Link component={NavLink} to="announcement" style={getActiveStyles}>
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment icon={<FontAwesomeIcon icon={faBullhorn} />} />
          <Typography as="span">Announcement</Typography>
        </Stack>
      </Link>

      <Link to="alert" component={NavLink} style={getActiveStyles}>
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment
            icon={<FontAwesomeIcon icon={faTriangleExclamation} />}
          />
          <Typography as="span">Alert</Typography>
        </Stack>
      </Link>

      <Link to="admin" component={NavLink} style={getActiveStyles}>
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment icon={<FontAwesomeIcon icon={faUser} />} />
          <Typography as="span">Admin</Typography>
        </Stack>
      </Link>

      <Link
        to="login"
        component={NavLink}
        onClick={logout}
        style={getActiveStyles}
      >
        <Stack gap="2" orientation="horizontal" {...props}>
          <IconAlignment icon={<FontAwesomeIcon icon={faRightFromBracket} />} />
          <Typography as="span">Logout</Typography>
        </Stack>
      </Link>
    </Stack>
  );
};

export const iconAlignmentStyles = {
  minWidth: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export type IconAlignmentProps = {
  icon: React.ReactNode;
};

export const IconAlignment = (props: IconAlignmentProps) => {
  return (
    <div style={iconAlignmentStyles}>
      <div>{props.icon}</div>
    </div>
  );
};

export const LeadsDropdown = () => {
  const path = useMatch("settings/*");

  return (
    <div style={getActiveStyles({ isActive: Boolean(path), isPending: false })}>
      {/* TODO: Use Menu component for dropdowns */}
      <Link
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ color: "inherit", textDecoration: "inherit" }}
      >
        <Stack alignItems="center" justifyContent="center" gap="1">
          <FontAwesomeIcon icon={faSliders} fontSize="2rem" />

          <Typography as="small" className="m-0">
            Settings
          </Typography>
        </Stack>
      </Link>
    </div>
  );
};

export default SideNavbar;
