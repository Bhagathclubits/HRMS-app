import React from "react";
import Button from "ui/Button";
import Grid from "ui/Grid";
import Stack from "ui/Stack";
import CreateUserDialog from "../../components/CreateUserDialog";
import PageHeader from "../../components/PageHeader";
import ShowIf from "../../components/ShowIf";
import ContactDataPage from "./contact";
import FamilyPage from "./family";
import Identifications from "./identification";
import Payslip from "./payslip";
import PersonalInfoPage from "./personal-info";
import Qualifications from "./qualification";

export const Layout = () => {
  const [activeTabId, setActiveTabId] = React.useState(0);

  const handlePrint = () => {
    const tabContent = document.querySelector(
      `#section-to-print-${activeTabId}`
    );
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

  return (
    <>
      <Stack gap="3">
        <PageHeader
          title={<PageHeader.Title></PageHeader.Title>}
          actions={
            <Stack orientation="horizontal" gap="3">
              <ShowIf.Admin>
                <CreateUserDialog />
              </ShowIf.Admin>

              <Button variant="primary" onClick={handlePrint}>
                Print
              </Button>
            </Stack>
          }
        />

        <Grid.Row>
          <Grid.Col className="py-2" cols={["12", "md-2"]}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Emp Code"
            />
          </Grid.Col>
          <Grid.Col className="py-2" cols={["12", "md-2"]}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="From"
            />
          </Grid.Col>
          <Grid.Col className="py-2" cols={["12", "md-2"]}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="DOJ"
            />
          </Grid.Col>
          <Grid.Row>
            <Grid.Col className="py-2" cols={["12", "md-2"]}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Emp Name"
              />
            </Grid.Col>
            <Grid.Col className="py-2" cols={["12", "md-2"]}>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="To"
              />
            </Grid.Col>
            <Grid.Col className="py-2" cols={["12", "md-2"]}>
              <Button variant="primary" className="w-100">
                Search
              </Button>
            </Grid.Col>
          </Grid.Row>
        </Grid.Row>

        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTabId === 0 ? "active" : ""}`}
              id="personal-information-tab"
              data-bs-toggle="tab"
              data-bs-target="#personal-information"
              type="button"
              role="tab"
              aria-controls="personal-information"
              aria-selected="true"
              onClick={() => setActiveTabId(0)}
            >
              Personal Info
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTabId === 1 ? "active" : ""}`}
              id="contact-tab"
              data-bs-toggle="tab"
              data-bs-target="#contact"
              type="button"
              role="tab"
              aria-controls="contact"
              aria-selected="false"
              onClick={() => setActiveTabId(1)}
            >
              Contact
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTabId === 2 ? "active" : ""}`}
              id="family-tab"
              data-bs-toggle="tab"
              data-bs-target="#family"
              type="button"
              role="tab"
              aria-controls="family"
              aria-selected="false"
              onClick={() => setActiveTabId(2)}
            >
              Family
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTabId === 3 ? "active" : ""}`}
              id="qualification-tab"
              data-bs-toggle="tab"
              data-bs-target="#qualification"
              type="button"
              role="tab"
              aria-controls="qualification"
              aria-selected="false"
              onClick={() => setActiveTabId(3)}
            >
              Qualification
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTabId === 4 ? "active" : ""}`}
              id="identification-tab"
              data-bs-toggle="tab"
              data-bs-target="#identification"
              type="button"
              role="tab"
              aria-controls="identification"
              aria-selected="false"
              onClick={() => setActiveTabId(4)}
            >
              Identification
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTabId === 5 ? "active" : ""}`}
              id="payslip-tab"
              data-bs-toggle="tab"
              data-bs-target="#payslip"
              type="button"
              role="tab"
              aria-controls="payslip"
              aria-selected="false"
              onClick={() => setActiveTabId(5)}
            >
              Payslip
            </button>
          </li>
        </ul>

        <div className="tab-content" id="myTabContent">
          <div
            className={`tab-pane fade ${
              activeTabId === 0 ? "show active" : ""
            }`}
            id="personal-information"
            role="tabpanel"
            aria-labelledby="personal-information-tab"
          >
            <PersonalInfoPage tabId={0} activeTabId={activeTabId} />
          </div>

          <div
            className={`tab-pane fade ${
              activeTabId === 1 ? "show active" : ""
            }`}
            id="contact"
            role="tabpanel"
            aria-labelledby="contact-tab"
          >
            <ContactDataPage tabId={1} activeTabId={activeTabId} />
          </div>

          <div
            className={`tab-pane fade ${
              activeTabId === 2 ? "show active" : ""
            }`}
            id="family"
            role="tabpanel"
            aria-labelledby="family-tab"
          >
            <FamilyPage tabId={2} activeTabId={activeTabId} />
          </div>

          <div
            className={`tab-pane fade ${
              activeTabId === 3 ? "show active" : ""
            }`}
            id="qualification"
            role="tabpanel"
            aria-labelledby="qualification-tab"
          >
            <Qualifications tabId={3} activeTabId={activeTabId} />
          </div>

          <div
            className={`tab-pane fade ${
              activeTabId === 4 ? "show active" : ""
            }`}
            id="identification"
            role="tabpanel"
            aria-labelledby="identification-tab"
          >
            <Identifications tabId={4} activeTabId={activeTabId} />
          </div>

          <div
            className={`tab-pane fade ${
              activeTabId === 5 ? "show active" : ""
            }`}
            id="payslip"
            role="tabpanel"
            aria-labelledby="payslip-tab"
          >
            <Payslip tabId={5} activeTabId={activeTabId} />
          </div>
        </div>
      </Stack>
    </>
  );
};

export default Layout;
