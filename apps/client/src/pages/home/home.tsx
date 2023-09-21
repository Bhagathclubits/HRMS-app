import ShowIf from "../../components/ShowIf";
import AdminDashboard from "./admin";
import EmployeeDashboard from "./employee";

export const HomePage = () => {
  return (
    <>
      <ShowIf.Admin>
        <AdminDashboard />
      </ShowIf.Admin>
      <ShowIf.Employee>
        <EmployeeDashboard />
      </ShowIf.Employee>
    </>
  );
};

export default HomePage;
