import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ComponentProps, PropsWithChildren } from "react";

type InputFieldProps = ComponentProps<"input"> & {
  control: Control<any>;
  name: string;
  label?: string;
  children?: PropsWithChildren;
};

export const InputField = ({
  control,
  name,
  label,
  children,
  ...inputProps
}: InputFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input {...inputProps} {...field} />
          </FormControl>
          {children}
          <FormMessage className="text-left" />
        </FormItem>
      )}
    />
  );
};
