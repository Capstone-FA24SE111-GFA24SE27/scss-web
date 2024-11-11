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
    <Paper className="w-full flex flex-col gap-4 shadow max-w-xs p-16" elevation={3}>
      <Box className="flex justify-between items-center">
        <Typography className="font-semibold text-lg" color={color}>
          {title}
        </Typography>
        {React.cloneElement(icon, { color })}  {/* Clone the icon with the specified color */}
      </Box>
      <Box className="flex justify-between items-center">
        <Typography variant="h3" color={color} className="font-bold">
          {total}
        </Typography>
        <StatChange {...statChange} />
      </Box>
    </Paper>
  );
};

// Usage Example
import DescriptionIcon from '@mui/icons-material/Description';

const App: React.FC = () => {
  return (
    <StatsCard
      title="Total Appointments"
      total={113}
      statChange={{
        prefixText: 'Last month',
        current: 40,
        previous: 48,
      }}
      icon={<DescriptionIcon />}
      color="primary"  // You can set color to primary, secondary, success, error, etc.
    />
  );
};

export default StatsCard;
