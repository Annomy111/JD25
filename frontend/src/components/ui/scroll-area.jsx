import React from "react";

const ScrollArea = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      className={`relative overflow-auto ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };