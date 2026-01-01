import React, { useState } from "react";
import { Input } from "./ui/input";

interface InputPasswordProps {
  register: any;
  errors: any;
  name: string; // The name of the input field
  placeholder?: string; // Optional placeholder
  disabled?: boolean;
}

const InputPassword = ({
  register,
  errors,
  name,
  placeholder = "Enter Password",
  disabled,
}: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      <Input
        className="h-8"
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        {...register(name)}
        disabled={disabled}
      />
      <div
        className="absolute right-2 top-4 transform -translate-y-1/2 text-sm cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? "Hide" : "Show"}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default InputPassword;
