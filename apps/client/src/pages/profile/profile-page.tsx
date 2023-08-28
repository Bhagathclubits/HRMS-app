import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Address } from "server/dist/trpc/routes/addresses/get";
import { FamilyDetail } from "server/dist/trpc/routes/family-details/get";
import { PersonalInfo } from "server/dist/trpc/routes/personal-infos/get";
import { Qualification } from "server/dist/trpc/routes/qualification/get-recently-created";
import Container from "ui/Container";
import Dialog from "ui/Dialog";
import Divider from "ui/Divider";
import Grid from "ui/Grid";
import Image from "ui/Image";
import Stack from "ui/Stack";
import Typography from "ui/Typography";
import PageHeader from "../../components/PageHeader";
import PrintButton from "../../components/PrintButton";
import { client } from "../../main";

export const ProfilePage = () => {
  const [fatherName, setFatherName] = React.useState("");
  const [motherName, setMotherName] = React.useState("");
  const [personalEmail, setPersonalEmail] = React.useState("");
  const [matrialStatus, setMatrialStatus] = React.useState("");
  const [bloodGroup, setBloodGroup] = React.useState("");
  const [nationality, setNationality] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [dateOfBirth, setDateOfBirth] = React.useState(`${new Date()}`);
  const [noticeDays, setNoticeDays] = React.useState("");
  const [dateOfJoining, setDateOfJoining] = React.useState(`${new Date()}`);
  const [employeeType, setEmployeeType] = React.useState("");
  const [pfUan, setPfUan] = React.useState("");
  const [biometricId, setBiometricId] = React.useState("");
  const [reportingManager, setReportingManager] = React.useState("");
  const [employeeCode, setEmployeeCode] = React.useState("");
  const [employeeStatus, setEmployeeStatus] = React.useState("");
  const [city, setCity] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [designation, setDesignation] = React.useState("");
  const [workExprience, setWorkExprience] = React.useState("");
  const [shift, setShift] = React.useState("");
  const [officeEmailId, setOfficeEmailId] = React.useState("");
  const [currentAddress, setCurrentAddress] = React.useState("");
  const [permanentAddress, setPermanentAddress] = React.useState("");
  const [paymentType, setPaymentType] = React.useState("");
  const [bankName, setBankName] = React.useState("");
  const [accountNo, SetAccountNo] = React.useState("");
  const [accountHolderName, setAccountHolderName] = React.useState("");
  const [degreeDiploma, setDegreeDiploma] = React.useState("");
  const [instutionName, setInstutionName] = React.useState("");
  const [passingYear, SetPassingYear] = React.useState("");
  const [percentage, setPercentage] = React.useState("");
  const [state, setState] = React.useState("");
  const [personalInfo, setPersonalInfo] = React.useState<PersonalInfo | null>(
    null
  );
  const [fatherDetails, setFatherDetails] = React.useState<FamilyDetail | null>(
    null
  );
  const [motherDetails, setMotherDetails] = React.useState<FamilyDetail | null>(
    null
  );
  const [qualificationDetail, setQualificationDetail] =
    React.useState<Qualification | null>(null);

  const [addressDetail, setAddressDetail] = React.useState<Address | null>(
    null
  );

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    (async () => {
      const personalInfo = await client.personalInfo.get.mutate(
        location.state.user.id
      );
      console.log(personalInfo);

      setPersonalInfo(personalInfo);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const fatherDetails = await client.familyDetail.get.mutate({
        userId: location.state.user.id,
        relationshipType: "father",
      });

      setFatherDetails(fatherDetails);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const motherDetails = await client.familyDetail.get.mutate({
        userId: location.state.user.id,
        relationshipType: "mother",
      });

      setMotherDetails(motherDetails);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const qualificationDetail =
        await client.qualification.getRecentlyCreated.mutate(
          location.state.user.id
        );

      setQualificationDetail(qualificationDetail);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const addressDetail = await client.address.get.mutate({
        userId: location.state.user.id,
        addressType: "residential",
      });
      console.log(addressDetail);
      setAddressDetail(addressDetail);
    })();
  }, []);

  return (
    <>
      <NavLink to="/account">
        <Typography
          color="primary"
          fontWeight="semibold"
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </Typography>
      </NavLink>
      <PageHeader
        title={<PageHeader.Title></PageHeader.Title>}
        actions={<PrintButton />}
      />

      <Grid.Col cols="12">
        <Stack gap="3">
          <Grid.Row>
            <Grid.Col>
              <Image src="/images/profile.png" className=" h-75" />
            </Grid.Col>
            <Grid.Col>
              <Typography as="h4">
                {location.state.firstName}
                {location.state.lastName}
              </Typography>
              <Stack orientation="horizontal">
                <Typography color="secondary">Designation:&nbsp;</Typography>
                <Typography>{location.state.designation.name}</Typography>
              </Stack>
              <Stack orientation="horizontal">
                <Typography color="secondary">Phone number:&nbsp;</Typography>
                <Typography>{location.state.user.mobile}</Typography>
              </Stack>
              <Stack orientation="horizontal">
                <Typography color="secondary">Email address:&nbsp;</Typography>
                <Typography>{location.state.user.email}</Typography>
              </Stack>
              <Stack orientation="horizontal">
                <Typography color="secondary">Department:&nbsp;</Typography>
                <Typography>{location.state.department.name}</Typography>
              </Stack>
            </Grid.Col>
            <Grid.Col>
              <Stack orientation="horizontal">
                <Typography color="secondary">Age:&nbsp;</Typography>
                <Typography>27</Typography>
              </Stack>
              <Stack orientation="horizontal">
                <Typography color="secondary">
                  Reporting manager:&nbsp;
                </Typography>
                <Typography>{location.state.reportingManager.name}</Typography>
              </Stack>
              <Stack orientation="horizontal">
                <Typography color="secondary">Employee code:&nbsp;</Typography>
                <Typography>{location.state.user.id}</Typography>
              </Stack>
            </Grid.Col>
          </Grid.Row>
          <Divider />
          <Grid.Row className="w-100 h-100" gutters="5">
            <Grid.Col cols="lg-6" className="h-10">
              <Container className="h-100" style={{ maxWidth: "30rem" }}>
                <Stack gap="5">
                  <Stack gap="3">
                    <Typography as="h6" className="alert alert-primary">
                      Personal details
                    </Typography>
                    <Dialog.Body>
                      <Grid.Row gutters="3">
                        <Grid.Col cols={["12", "lg-6"]}>
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              value={fatherDetails?.name}
                              onChange={(event) =>
                                setFatherName(event.target.value)
                              }
                            />
                            <label htmlFor="City">Father name</label>
                          </div>
                        </Grid.Col>
                        <Grid.Col cols={["12", "lg-6"]}>
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              value={motherDetails?.name}
                              onChange={(event) =>
                                setMotherName(event.target.value)
                              }
                            />
                            <label htmlFor="State">Mother name</label>
                          </div>
                        </Grid.Col>
                        {/* <Grid.Col cols={["12", "lg-6"]}>
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              value={personalInfo?.user.email ?? ""}
                              onChange={(event) =>
                                setPersonalEmail(event.target.value)
                              }
                            />
                            <label htmlFor="City">personal Email</label>
                          </div>
                        </Grid.Col> */}
                        {/* <Grid.Col cols={["12", "lg-6"]}>
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              value={personalInfo.}
                              onChange={(event) =>
                                setMatrialStatus(event.target.value)
                              }
                            />
                            <label htmlFor="State">Matrial status</label>
                          </div>
                        </Grid.Col> */}
                        {/* <Grid.Col cols={["12", "lg-6"]}>
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              value={bloodGroup}
                              onChange={(event) =>
                                setBloodGroup(event.target.value)
                              }
                            />
                            <label htmlFor="City">Blood group</label>
                          </div>
                        </Grid.Col> */}
                        {/* <Grid.Col cols={["12", "lg-6"]}>
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              value={nationality}
                              onChange={(event) =>
                                setNationality(event.target.value)
                              }
                            />
                            <label htmlFor="State">Nationality</label>
                          </div>
                        </Grid.Col> */}
                        {/* <Grid.Col cols={["12", "lg-6"]}>
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              value={gender}
                              onChange={(event) =>
                                setGender(event.target.value)
                              }
                            />
                            <label htmlFor="City">Gender</label>
                          </div>
                        </Grid.Col> */}

                        <Grid.Col cols={["12", "lg-6"]}>
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              value={
                                personalInfo
                                  ? new Date(
                                      personalInfo.dateOfBirth
                                    ).toLocaleDateString("en-US")
                                  : ""
                              }
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ): void => setDateOfBirth(event.target.value)}
                            />
                            <label htmlFor="DateOfBirth">Date Of Birth</label>
                          </div>
                        </Grid.Col>
                      </Grid.Row>
                    </Dialog.Body>
                  </Stack>

                  <Stack.Item cols="12">
                    <Stack gap="2">
                      <Typography as="h6" className="alert alert-primary">
                        Employee details
                      </Typography>
                      <Dialog.Body>
                        <Grid.Row gutters="3">
                          {/* <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={noticeDays}
                                onChange={(event) =>
                                  setNoticeDays(event.target.value)
                                }
                              />
                              <label htmlFor="City">Notice days</label>
                            </div>
                          </Grid.Col> */}

                          <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                value={
                                  personalInfo
                                    ? new Date(
                                        personalInfo.dateOfJoining
                                      ).toLocaleDateString("en-US")
                                    : ""
                                }
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ): void => setDateOfJoining(event.target.value)}
                              />
                              <label htmlFor="Date Of Joining">
                                Date Of Joining
                              </label>
                            </div>
                          </Grid.Col>
                          {/* <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={employeeType}
                                onChange={(event) =>
                                  setEmployeeType(event.target.value)
                                }
                              />
                              <label htmlFor="City">Employee type</label>
                            </div>
                          </Grid.Col> */}
                          {/* <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={pfUan}
                                onChange={(event) =>
                                  setPfUan(event.target.value)
                                }
                              />
                              <label htmlFor="State">PF UAN</label>
                            </div>
                          </Grid.Col> */}
                          {/* <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={biometricId}
                                onChange={(event) =>
                                  setBiometricId(event.target.value)
                                }
                              />
                              <label htmlFor="City">Biometric ID</label>
                            </div>
                          </Grid.Col> */}
                          <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={personalInfo?.reportingManager.name}
                                onChange={(event) =>
                                  setReportingManager(event.target.value)
                                }
                              />
                              <label htmlFor="State">Reporting manager</label>
                            </div>
                          </Grid.Col>
                          <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={personalInfo?.userId}
                                onChange={(event) =>
                                  setEmployeeCode(event.target.value)
                                }
                              />
                              <label htmlFor="City">Employee code</label>
                            </div>
                          </Grid.Col>
                          {/* <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={
                                  personalInfo?.user.status === undefined
                                    ? personalInfo?.user.status
                                    : ""
                                }
                                onChange={(event) =>
                                  setEmployeeStatus(event.target.value)
                                }
                              />
                              <label htmlFor="State">Employee status</label>
                            </div>
                          </Grid.Col> */}
                          <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={personalInfo?.department.name}
                                onChange={(event) =>
                                  setDepartment(event.target.value)
                                }
                              />
                              <label htmlFor="City">Department</label>
                            </div>
                          </Grid.Col>
                          <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={personalInfo?.designation.name}
                                onChange={(event) =>
                                  setDepartment(event.target.value)
                                }
                              />
                              <label htmlFor="City">Designation</label>
                            </div>
                          </Grid.Col>
                          {/* <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={workExprience}
                                onChange={(event) =>
                                  setWorkExprience(event.target.value)
                                }
                              />
                              <label htmlFor="State">Work exprience</label>
                            </div>
                          </Grid.Col> */}
                          {/* <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={shift}
                                onChange={(event) =>
                                  setShift(event.target.value)
                                }
                              />
                              <label htmlFor="City">Shift</label>
                            </div>
                          </Grid.Col> */}
                          <Grid.Col cols={["12", "lg-6"]}>
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={personalInfo?.user.email ?? ""}
                                onChange={(event) =>
                                  setOfficeEmailId(event.target.value)
                                }
                              />
                              <label htmlFor="State">Office email ID</label>
                            </div>
                          </Grid.Col>
                        </Grid.Row>
                      </Dialog.Body>
                    </Stack>
                  </Stack.Item>
                </Stack>
              </Container>
            </Grid.Col>
            <Grid.Col cols={["12", "lg-6"]} className="h-100 ">
              <Container className="h-100" style={{ maxWidth: "30rem" }}>
                <Stack
                  gap="5"
                  className="h-100"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Stack.Item cols="12">
                    <Stack gap="1">
                      <Typography as="h6" className="alert alert-primary">
                        Address
                      </Typography>

                      <Dialog.Body>
                        <Stack gap="3">
                          <Grid.Row gutters="3">
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={addressDetail?.street}
                                  onChange={(event) =>
                                    setCurrentAddress(event.target.value)
                                  }
                                />
                                <label htmlFor="City">Current address</label>
                              </div>
                            </Grid.Col>
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={addressDetail?.street}
                                  onChange={(event) =>
                                    setPermanentAddress(event.target.value)
                                  }
                                />
                                <label htmlFor="State">Permanent address</label>
                              </div>
                            </Grid.Col>
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={addressDetail?.city}
                                  onChange={(event) =>
                                    setCity(event.target.value)
                                  }
                                />
                                <label htmlFor="City">City</label>
                              </div>
                            </Grid.Col>
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={addressDetail?.country}
                                  onChange={(event) =>
                                    setCountry(event.target.value)
                                  }
                                />
                                <label htmlFor="State">Country</label>
                              </div>
                            </Grid.Col>
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={addressDetail?.pincode}
                                  onChange={(event) =>
                                    setZip(event.target.value)
                                  }
                                />
                                <label htmlFor="City">Zip</label>
                              </div>
                            </Grid.Col>
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={addressDetail?.state}
                                  onChange={(event) =>
                                    setState(event.target.value)
                                  }
                                />
                                <label htmlFor="State">State</label>
                              </div>
                            </Grid.Col>
                          </Grid.Row>
                        </Stack>
                      </Dialog.Body>
                    </Stack>
                  </Stack.Item>

                  {/* <Stack.Item cols="12">
                    <Stack gap="2">
                      <Typography as="h6" className="alert alert-primary">
                        Bank details
                      </Typography>

                      <Dialog.Body>
                        <Stack gap="3">
                          <Grid.Row gutters="3">
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={paymentType}
                                  onChange={(event) =>
                                    setPaymentType(event.target.value)
                                  }
                                />
                                <label htmlFor="State">Payment type</label>
                              </div>
                            </Grid.Col>
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={bankName}
                                  onChange={(event) =>
                                    setBankName(event.target.value)
                                  }
                                />
                                <label htmlFor="City">Bank name</label>
                              </div>
                            </Grid.Col>
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={accountNo}
                                  onChange={(event) =>
                                    SetAccountNo(event.target.value)
                                  }
                                />
                                <label htmlFor="State">Account no.</label>
                              </div>
                            </Grid.Col>
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={accountHolderName}
                                  onChange={(event) =>
                                    setAccountHolderName(event.target.value)
                                  }
                                />
                                <label htmlFor="City">
                                  Account holder name
                                </label>
                              </div>
                            </Grid.Col>
                          </Grid.Row>
                        </Stack>
                      </Dialog.Body>
                    </Stack>
                  </Stack.Item> */}

                  <Stack.Item cols="12">
                    <Stack gap="2">
                      <Typography as="h6" className="alert alert-primary">
                        Qualification details
                      </Typography>

                      <Dialog.Body>
                        <Stack gap="3">
                          <Grid.Row gutters="3">
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={qualificationDetail?.name}
                                  onChange={(event) =>
                                    setDegreeDiploma(event.target.value)
                                  }
                                />
                                <label htmlFor="State">Degree/Diploma</label>
                              </div>
                            </Grid.Col>
                            {/* <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={instutionName}
                                  onChange={(event) =>
                                    setInstutionName(event.target.value)
                                  }
                                />
                                <label htmlFor="City">Instution name</label>
                              </div>
                            </Grid.Col>
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={passingYear}
                                  onChange={(event) =>
                                    SetPassingYear(event.target.value)
                                  }
                                />
                                <label htmlFor="State">Passing year</label>
                              </div>
                            </Grid.Col>
                            <Grid.Col cols={["12", "lg-6"]}>
                              <div className="form-floating">
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  value={percentage}
                                  onChange={(event) =>
                                    setPercentage(event.target.value)
                                  }
                                />
                                <label htmlFor="City">Percentage</label>
                              </div>
                            </Grid.Col> */}
                          </Grid.Row>
                        </Stack>
                      </Dialog.Body>
                    </Stack>
                  </Stack.Item>
                </Stack>
              </Container>
            </Grid.Col>
          </Grid.Row>
        </Stack>
      </Grid.Col>
      <Stack> </Stack>
    </>
  );
};
export default ProfilePage;
