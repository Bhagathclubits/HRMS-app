import React from "react";

export type TabIdProps = {
  id: string;
  tabId: number;
  activeTabId: number;
};

export const useTab = () => {
  const [activeTabId, setActiveTabId] = React.useState(0);

  const onTabClick = (index: number) => () => setActiveTabId(index);

  const getTabIdProps = (tabId: number): TabIdProps => ({
    id: `${tabId}`,
    tabId,
    activeTabId,
  });

  return {
    activeTabId,
    setActiveTabId,
    onTabClick,
    getTabIdProps,
  };
};
