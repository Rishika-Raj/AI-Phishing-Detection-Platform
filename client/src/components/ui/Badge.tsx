import React from "react";

interface BadgeProps {
  variant?: "safe" | "suspicious" | "critical" | "neutral" | "primary";
  size?: "sm" | "md";
  rounded?: "full" | "sm";
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "neutral",
  size = "md",
  rounded = "full",
  icon,
  children,
  className = "",
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-bold uppercase tracking-[0.06em] select-none border";

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-[11px] px-2.5 py-1 gap-1.5",
  };

  const roundedStyles = {
    full: "rounded-full",
    sm: "rounded-[4px]",
  };

  const variantStyles = {
    safe: "text-[#0F766E] bg-[#F0FDF4] border-[#BBF7D0]",
    suspicious: "text-[#B45309] bg-[#FFFBEB] border-[#FDE68A]",
    critical: "text-[#D92D20] bg-[#FEF2F2] border-[#FECACA]",
    neutral: "text-[#101010] bg-[#FFFFFF] border-[#E5E7EB]",
    primary: "text-[#0038FF] bg-[#FFFFFF] border-[#C7D2FE]",
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${roundedStyles[rounded]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}
