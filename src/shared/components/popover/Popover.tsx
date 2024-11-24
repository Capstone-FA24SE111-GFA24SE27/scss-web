import React, { useState } from "react";
import { Popover as MUIPopover } from "@mui/material";

interface PopoverProps {
  trigger: React.ReactNode; // Element that triggers the popover
  content: React.ReactNode; // Content inside the popover
  className?: string; // Optional custom class for the popover
  anchorOrigin?: {
    vertical: "top" | "center" | "bottom";
    horizontal: "left" | "center" | "right";
  }; // Anchor position
  transformOrigin?: {
    vertical: "top" | "center" | "bottom";
    horizontal: "left" | "center" | "right";
  }; // Transform position
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  className = "",
  anchorOrigin = { vertical: "bottom", horizontal: "center" },
  transformOrigin = { vertical: "top", horizontal: "center" },
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  return (
    <div className="inline-block">
      {/* Trigger Element */}
      <div onClick={handleOpen} className="cursor-pointer">
        {trigger}
      </div>

      {/* MUI Popover */}
      <MUIPopover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        className={className}
      >
        <div className="p-4">{content}</div>
      </MUIPopover>
    </div>
  );
};

export default Popover;
