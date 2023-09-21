import Grid from "ui/Grid";
import LeaveCard from "../../components/LeaveCard";
import PayRollCard from "../../components/PayRollCard";
import ProfileCard from "../../components/ProfileCard";
// import { TimeSheetCard } from "../../components/TimeSheetCard";

export const EmployeeDashboard = () => {
  return (
    <Grid.Row gutters="3">
      <Grid.Col cols={["12", "md-6"]}>
        <ProfileCard />
      </Grid.Col>
      <Grid.Col cols={["12", "md-6"]}>
        <LeaveCard />
      </Grid.Col>
      <Grid.Col cols="12">
        <PayRollCard />
        {/* <TimeSheetCard /> */}
      </Grid.Col>
    </Grid.Row>
  );
};

export default EmployeeDashboard;
