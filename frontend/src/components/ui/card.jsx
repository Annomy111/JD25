import React from "react";

const Card = ({ className = "", children, ...props }) => {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Card };