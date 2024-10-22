import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

interface CustomTabsProps {
  tabs: { label: string, value: unknown }[];
  tabValue: number;
  onChangeTab: (event: React.SyntheticEvent, newValue: number) => void;
}

const CustomTabs = ({ tabs, tabValue, onChangeTab }: CustomTabsProps) => {
  return (
    <Tabs
      value={tabValue}
      onChange={onChangeTab}
      indicatorColor="secondary"
      textColor="inherit"
      variant="scrollable"
      scrollButtons={false}
      className="min-h-40"
      classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
      TabIndicatorProps={{
        children: (
          <Box
            sx={{ bgcolor: 'primary.light' }}
            className="w-full h-full rounded-full opacity-10"
          />
        )
      }}
    >
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          className="text-lg font-semibold min-h-40 min-w-64 mx-4 px-16"
          disableRipple
          label={tab.label}
        />
      ))}
    </Tabs>
  );
};

export default CustomTabs;