import React, { ComponentProps, PropsWithChildren, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type PasswordInputProps = ComponentProps<"input"> & {
  control: Control<any>;
  name: string;
  label?: string;
  children?: PropsWithChildren;
};

export function PasswordField({
  control,
  name,
  label,
  children,
  ...inputProps
}: PasswordInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <PasswordInput {...inputProps} {...field} />
          </FormControl>
          {children}
          <FormMessage className="text-left" />
        </FormItem>
      )}
    />
  );
}

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <div className="relative">
      <Input
        type="password"
        className={cn("pe-10", className)}
        ref={ref}
        {...props}
      />
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
