import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { SvgIconProps } from '@mui/material';
import { StatChange } from '../symbols';
import { OverridableStringUnion } from '@mui/types';

interface StatChangeProps {
  prefixText: string;
  current: number;
  previous: number;
}

interface StatsCardProps {
  title: string;
  total: number;
  statChange: {
    prefixText: string;
    current: number;
    previous: number;
  };
  icon: React.ReactElement<SvgIconProps>;
  color?: OverridableStringUnion<"primary" | "info" | "disabled" | "action" | "inherit" | "secondary" | "error" | "success" | "warning", SvgIconProps['color']>;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, total, statChange, icon, color = 'inherit' }) => {
  return (
    <Paper className="w-full flex flex-col gap-4 shadow p-16" elevation={3}>
      <Box className="flex justify-between items-start">
        <Typography className="font-semibold text-lg">
          {title}
        </Typography>
        {React.cloneElement(icon, { color, fontSize: `large` })}  {/* Clone the icon with the specified color */}
      </Box>
      <Box className="flex justify-between items-end">
        <Typography color={color} className="font-bold text-6xl -mb-8">
          {total}
        </Typography>
        <StatChange {...statChange} />
      </Box>
    </Paper>
  );
};

export default StatsCard;
