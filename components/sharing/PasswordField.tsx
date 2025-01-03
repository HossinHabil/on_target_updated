import React, { ComponentProps, PropsWithChildren, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pe-10", className)}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        title={showPassword ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-muted-foreground"
      >
        {showPassword ? (
          <EyeOff className="size-5" />
        ) : (
          <Eye className="size-5" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
