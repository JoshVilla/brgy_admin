"use client";

import React, { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search } from "lucide-react";

export interface SearchOption {
  label: string;
  value: string | number;
}

export interface SearchProp {
  label?: string;
  type: "input" | "select";
  name: string;
  placeholder?: string;
  options?: SearchOption[];
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => string | number | boolean;
}

interface SearchFormWithParamsProps {
  searchProps: SearchProp[];
  onSearch: (params: Record<string, any>) => void;
  onReset?: () => void;
}

const SearchForm = ({
  searchProps,
  onSearch,
  onReset,
}: SearchFormWithParamsProps) => {
  const [params, setParams] = useState<Record<string, any>>({});

  const handleInputChange = useCallback(
    (name: string, value: string | number) => {
      setParams((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSearch = useCallback(() => {
    const validParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    onSearch(validParams);
  }, [onSearch, params]);

  const handleReset = useCallback(() => {
    const emptyParams = searchProps.reduce((acc, prop) => {
      acc[prop.name] = "";
      return acc;
    }, {} as Record<string, string>);

    setParams(emptyParams);
    onSearch(emptyParams);
    onReset?.();
  }, [searchProps, onSearch, onReset]);

  return (
    <div className="flex gap-4 items-end my-4 flex-wrap">
      {searchProps.map((prop, index) => {
        if (prop.type === "input") {
          return (
            <div key={index} className="flex flex-col gap-2">
              {/* <span className="text-sm">{prop.label}</span> */}
              <Input
                value={params[prop.name] || ""}
                onChange={(e) => {
                  const value = prop.onChange
                    ? prop.onChange(e)
                    : e.target.value;
                  //@ts-ignore
                  handleInputChange(prop.name, value);
                }}
                placeholder={prop.placeholder}
                className="w-[200px]"
              />
            </div>
          );
        }

        if (prop.type === "select") {
          return (
            <div key={index} className="flex flex-col gap-2">
              {/* <span className="text-sm">{prop.label}</span> */}
              <Select
                value={params[prop.name]?.toString() || ""}
                onValueChange={(value) => handleInputChange(prop.name, value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={prop.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {prop.options?.map((option, idx) => (
                    <SelectItem key={idx} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
      })}

      <div className="flex gap-2">
        <Button
          variant="default"
          onClick={handleSearch}
          className="cursor-pointer"
          size="sm"
        >
          <Search />
          Search
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="cursor-pointer"
          size="sm"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default SearchForm;
