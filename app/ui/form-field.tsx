import React from "react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export default function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
