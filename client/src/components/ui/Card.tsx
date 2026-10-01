import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "surface";
  padding?: "none" | "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md";
  hoverBorder?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Card({
  variant = "white",
  padding = "md",
  rounded = "md",
  hoverBorder = false,
  children,
  className = "",
  ...props
}: CardProps) {
  const baseStyles = "border border-[#E5E7EB] transition-colors duration-150";

  const variantStyles = {
    white: "bg-[#FFFFFF] text-[#101010]",
    surface: "bg-[#F4F4F4] text-[#101010]",
  };

  const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-[4px]",
    md: "rounded-[8px]",
  };

  const hoverStyles = hoverBorder ? "hover:border-[#DBDCDD]" : "";

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${roundedStyles[rounded]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
