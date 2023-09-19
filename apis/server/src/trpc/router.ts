import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { addressRoutes } from "./routes/addresses";
import { companyRoutes } from "./routes/company";
import { departmentRoutes } from "./routes/department";
import { designationRoutes } from "./routes/designation";
import { expenseRoutes } from "./routes/expense";
import { expenseStatusRoutes } from "./routes/expense-status";
import { expenseTypeRoutes } from "./routes/expense-type";
import { familyDetailRoutes } from "./routes/family-details";
import { helpDeskRoutes } from "./routes/help-desks";
import { helpDeskCategoryRoutes } from "./routes/helpdesk-category";
import { helpDeskStatusRoutes } from "./routes/helpdesk-status";
import { hrRoutes } from "./routes/hr";
import { identificationRoutes } from "./routes/identification";
import { identificationTypeRoutes } from "./routes/identification/identificationType";
import { leaveStatusRoutes } from "./routes/leave-status";
import { leaveRoutes } from "./routes/leaves";
import { leaveTypeRoutes } from "./routes/leaves/leave-types";
import { loanRoutes } from "./routes/loan";
import { loanStatusRoutes } from "./routes/loan-status";
import { loanTypeRoutes } from "./routes/loan-type";
import { ocrRoutes } from "./routes/ocr";
import { payRollRoutes } from "./routes/pay-rolls";
import { personalInfoRoutes } from "./routes/personal-infos";
import { qualificationRoutes } from "./routes/qualification";
import { relationShipRoutes } from "./routes/relationship";
import { roleRoutes } from "./routes/roles";
import { sasTokenRoutes } from "./routes/sas-token";
import { timeSheetRoutes } from "./routes/time-sheets";
import { timeSheetStatusRoutes } from "./routes/timesheet-status";
import { travelRoutes } from "./routes/travel";
import { travelStatusRoutes } from "./routes/travel-status";
import { userRoutes } from "./routes/users";
import { visitorPassRoutes } from "./routes/visitor-pass";
import { visitorPassStatusRoutes } from "./routes/visitor-pass-status";
import { trpc } from "./trpc";

export const appRouter = trpc.router({
  address: addressRoutes,
  familyDetail: familyDetailRoutes,
  relationShip: relationShipRoutes,
  payRoll: payRollRoutes,
  personalInfo: personalInfoRoutes,
  timeSheet: timeSheetRoutes,
  timeSheetStatus: timeSheetStatusRoutes,
  helpDeskCategories: helpDeskCategoryRoutes,
  helpDeskStatus: helpDeskStatusRoutes,
  helpDesk: helpDeskRoutes,
  visitorPass: visitorPassRoutes,
  visitorPassStatus: visitorPassStatusRoutes,
  user: userRoutes,
  role: roleRoutes,
  leave: leaveRoutes,
  leaveType: leaveTypeRoutes,
  leaveStatus: leaveStatusRoutes,
  department: departmentRoutes,
  designation: designationRoutes,
  hr: hrRoutes,
  company: companyRoutes,
  qualification: qualificationRoutes,
  identification: identificationRoutes,
  identificationTypes: identificationTypeRoutes,
  sasToken: sasTokenRoutes,
  travel: travelRoutes,
  travelStatus: travelStatusRoutes,
  expense: expenseRoutes,
  expenseStatus: expenseStatusRoutes,
  expenseType: expenseTypeRoutes,
  loan: loanRoutes,
  loanStatus: loanStatusRoutes,
  loanType: loanTypeRoutes,
  ocr: ocrRoutes,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
