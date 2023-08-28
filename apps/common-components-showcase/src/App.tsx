import Alert from "ui/Alert";
import Button from "ui/Button";
import Drawer from "ui/Drawer";
import List from "ui/List";
import Radio from "ui/Radio";
import Select from "ui/Select";
import Skeleton from "ui/Skeleton";
import Switch from "ui/Switch";
import Tab from "ui/Tab";
import TextField from "ui/TextField";
import Tooltip from "ui/Tooltip";
import { useDrawer } from "ui/hooks/UseDrawer";
import { useTab } from "ui/hooks/UseTab";
import { TestDialog } from "./dialog";

const App = () => {
  const props = useDrawer();
  const { getTabIdProps, onTabClick } = useTab();

  return (
    <Tooltip.Provider>
      {/* Toggle button */}
      <Button.ToggleButton>This is a toggle button</Button.ToggleButton>

      {/* Alert */}
      <Alert variant="danger">
        <Alert.Heading>This is a heading</Alert.Heading>
        This is an <Alert.Link href="#">alert</Alert.Link> example
        <Alert.Close />
      </Alert>

      {/* Switch */}
      <Switch label="Turn ON?" />

      {/* Radio */}
      <Radio label="hey world" name="world" id="hey" />
      <Radio label="hello world" name="world" id="hello" />

      {/* Select */}
      <Select label="Select one">
        <Select.Option>Hello</Select.Option>
        <Select.Option selected>Hey</Select.Option>
      </Select>

      {/* TextField */}
      <TextField label="Password" type="password" />

      {/* Drawer */}
      <Drawer.ToggleButton {...props}>
        This is a drawer toggle button
      </Drawer.ToggleButton>
      <Drawer {...props} position="bottom">
        <Drawer.Header>
          <Drawer.Title>This is a drawer</Drawer.Title>

          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body>This is a drawer body</Drawer.Body>
      </Drawer>

      {/* List */}
      <List.Horizontal>
        <List.Item variant="primary">ListItem1</List.Item>
        <List.Item.Link variant="danger" href="#">
          ListItem2
        </List.Item.Link>
        <List.Item.Button variant="success">ListItem 3</List.Item.Button>
      </List.Horizontal>
      <List.UnBordered>
        <List.Item>Un-Bordered Example 1</List.Item>
        <List.Item>Un-Bordered Example 2</List.Item>
      </List.UnBordered>

      {/* Tab */}
      <Tab id="myTab">
        <Tab.Item>
          <Tab.Button {...getTabIdProps(0)} onClick={onTabClick(0)}>
            Home
          </Tab.Button>
        </Tab.Item>
        <Tab.Item>
          <Tab.Button {...getTabIdProps(1)} onClick={onTabClick(1)}>
            Profile
          </Tab.Button>
        </Tab.Item>
        <Tab.Item>
          <Tab.Button {...getTabIdProps(2)} onClick={onTabClick(2)}>
            Contact
          </Tab.Button>
        </Tab.Item>
        <Tab.Item>
          <Tab.Button {...getTabIdProps(3)} onClick={onTabClick(3)}>
            Disabled
          </Tab.Button>
        </Tab.Item>
      </Tab>
      <Tab.Content id="myTabContent">
        <Tab.Pane {...getTabIdProps(0)}>
          This is some placeholder content the Home tab's associated content.
          Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling. You can use it with tabs, pills, and any other
          .nav-powered navigation.
        </Tab.Pane>
        <Tab.Pane {...getTabIdProps(1)}>
          This is some placeholder content the Home tab's associated content.
          Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling. You can use it with tabs, pills, and any other
          .nav-powered navigation.
        </Tab.Pane>
        <Tab.Pane {...getTabIdProps(2)}>
          This is some placeholder content the Home tab's associated content.
          Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling. You can use it with tabs, pills, and any other
          .nav-powered navigation.
        </Tab.Pane>
        <Tab.Pane {...getTabIdProps(3)}>
          This is some placeholder content the Home tab's associated content.
          Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling. You can use it with tabs, pills, and any other
          .nav-powered navigation.
        </Tab.Pane>
      </Tab.Content>

      {/* Tooltip */}
      <Tooltip
        title="<em>Tooltip</em> <u>with</u> <b>HTML</b>"
        placement="bottom"
        dangerouslySetInnerHTML={true}
      >
        <Button>This button has a tooltip</Button>
      </Tooltip>

      {/* Skeleton */}
      <div className="card" aria-hidden="true" style={{ width: 300 }}>
        <svg
          className="bd-placeholder-img card-img-top"
          width="100%"
          height="180"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Placeholder"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <title>Placeholder</title>
          <rect width="100%" height="100%" fill="#868e96"></rect>
        </svg>
        <div className="card-body">
          <Skeleton as="h5" animate="glow" className="card-title">
            <Skeleton cols="6" />
          </Skeleton>
          <Skeleton as="p" animate="glow" className="card-text ">
            <Skeleton background="danger" cols="7" size="small" />
            <Skeleton className="w-75" />
            <Skeleton cols="4" />
            <Skeleton cols="6" />
            <Skeleton cols="8" />
          </Skeleton>
          <Skeleton
            as="a"
            className="btn btn-primary disabled col-6"
            aria-disabled
          />
        </div>
      </div>

      <TestDialog />

      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
      >
        Launch static backdrop modal
      </button>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Understood
              </button>
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};

export default App;
