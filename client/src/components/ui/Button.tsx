import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0038FF] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

  const sizeStyles = {
    sm: "text-xs tracking-wider uppercase px-3 py-2 h-9 rounded-[4px] gap-1.5",
    md: "text-sm tracking-wide px-4 py-2.5 h-11 rounded-[4px] gap-2",
    lg: "text-sm tracking-wider uppercase px-6 py-3.5 h-12 rounded-[4px] gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#101010] text-[#F4F4F4] hover:bg-[#0038FF] hover:text-[#FFFFFF] active:bg-[#0028CC]",
    secondary:
      "bg-[#FFFFFF] text-[#101010] border border-[#E5E7EB] hover:bg-[#F4F4F4] hover:border-[#DBDCDD] active:bg-[#ECECEC]",
    text: "bg-transparent text-[#101010] hover:text-[#0038FF] underline underline-offset-4 px-0 h-auto rounded-none",
    outline:
      "bg-transparent text-[#101010] border border-[#101010] hover:bg-[#101010] hover:text-[#FFFFFF]",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={combinedClasses}>
          {children}
          {icon && <span aria-hidden="true">{icon}</span>}
        </Link>
      );
    }
    return (
      <a href={href} className={combinedClasses}>
        {children}
        {icon && <span aria-hidden="true">{icon}</span>}
      </a>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
      {icon && <span aria-hidden="true">{icon}</span>}
    </button>
  );
}
