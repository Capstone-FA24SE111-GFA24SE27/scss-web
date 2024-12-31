import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import clsx from 'clsx'

interface CustomTabsProps {
  tabs: { label: string, value: unknown }[];
  tabValue: number;
  onChangeTab: (event: React.SyntheticEvent, newValue: number) => void;
  className?: string;
}

const CustomTabs = ({
  tabs,
  tabValue,
  onChangeTab,
  className = ''
}: CustomTabsProps) => {
  return (
    <div className={clsx(className)}>
      <Tabs
        value={tabValue}
        onChange={onChangeTab}
        textColor="inherit"
        variant="scrollable"
        scrollButtons={false}
        className="min-h-40"
        classes={{ indicator: 'flex justify-center opacity-15 rounded-full w-full h-full' }}
        TabIndicatorProps={{
          children: (
            <Box
              className="w-full h-full rounded-full bg-primary-light"
            />
          )
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            className="text-lg font-semibold min-h-40 min-w-64 px-16"
            disableRipple
            label={tab.label}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default CustomTabs;