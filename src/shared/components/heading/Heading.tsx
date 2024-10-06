import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface HeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export const MiniHeading = ({ title, description, className }: HeadingProps) => {
  return (
    <div className={className}>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-black/50">{description}</p>
    </div>
  );
};

export const Heading = ({ title, description = '', className }: HeadingProps) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <motion.span
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
      >
        <Typography className="text-20 md:text-24 font-extrabold tracking-tight leading-none">
          {title}
        </Typography>
      </motion.span>
      <motion.span
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      >
        <Typography
          component={motion.span}
          className="text-14 font-medium"
          color="text.secondary"
        >
          {description}
        </Typography>
      </motion.span>
    </div>
  );
};