import React, { FC, SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  sizeClass?: string;
}

const Select: FC<SelectProps> = ({
  className = "",
  sizeClass = "h-11",
  children,
  ...args
}) => {
  return (
    <select
      className={`nc-Select ${sizeClass} ${className} block w-full text-sm rounded-2xl  focus:border-primary-300 focus:ring focus:ring-primary-200  border-neutral-700 focus:ring-primary-6000 focus:ring-opacity-25 bg-neutral-900`}
      {...args}
    >
      {children}
    </select>
  );
};

export default Select;
