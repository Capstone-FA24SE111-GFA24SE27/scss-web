import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Button } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface ExpandableContentProps {
  children: React.ReactNode;
  collapsedHeight?: number; // Height (in px) of the pruned content
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({
  children,
  collapsedHeight = 200,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Check if content height exceeds collapsedHeight
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setIsCollapsible(contentHeight > collapsedHeight);
    }
  }, [children, collapsedHeight]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      {/* Content wrapper */}
      <div
        ref={contentRef}
        className={`overflow-hidden transition-all duration-300`}
        style={{
          height: isExpanded || !isCollapsible ? "auto" : undefined,
          maxHeight: isExpanded || !isCollapsible ? undefined : collapsedHeight,
        }}
      >
        {children}
      </div>

      {/* Blur overlay when collapsed */}
      {!isExpanded && isCollapsible && (
        <div
          className="absolute bottom-0 left-0 w-full h-60 bg-gradient-to-t from-white to-transparent pointer-events-none"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Adjust for blur effect
            // backdropFilter: "blur(2px)",
          }}
        ></div>
      )}

      {/* Expand/Collapse Button */}
      {isCollapsible && (
        <div className="flex justify-center">
          <Button
            className="w-120"
            variant="outlined"
            color="secondary"
            size="small"
            onClick={toggleExpand}
            endIcon={isExpanded ? <ExpandLess fontSize="large"/> : <ExpandMore fontSize="large"/>}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExpandableContent;
