// components/ResidentCombobox.tsx
"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getResident } from "@/services/api";
import { IResResident } from "@/utils/types";

interface ResidentComboboxProps {
  value: string;
  onSelect: (resident: IResResident) => void;
}

export default function ResidentCombobox({
  value,
  onSelect,
}: ResidentComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch ALL residents once
  const { data, isLoading } = useQuery({
    queryKey: ["all-residents"],
    queryFn: () =>
      getResident({
        page: 1,
        limit: 5000,
        searchTerm: "",
      }),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 30 * 60 * 1000, // Changed from cacheTime to gcTime
  });

  // Type the data properly
  const allResidents: IResResident[] = (data?.data as IResResident[]) || [];

  // Filter client-side
  const filteredResidents = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const searchLower = searchTerm.toLowerCase();
    return allResidents
      .filter((resident: IResResident) => {
        const fullName =
          `${resident.firstname} ${resident.middlename || ""} ${resident.lastname}`.toLowerCase();
        return fullName.includes(searchLower);
      })
      .slice(0, 10);
  }, [allResidents, searchTerm]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Search resident..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search by name..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm">
                Loading residents...
              </div>
            ) : searchTerm.length < 2 ? (
              <CommandEmpty>Type to search</CommandEmpty>
            ) : filteredResidents.length === 0 ? (
              <CommandEmpty>No resident found</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredResidents.map((resident: IResResident) => {
                  const fullName =
                    `${resident.firstname} ${resident.middlename || ""} ${resident.lastname}`.trim();
                  return (
                    <CommandItem
                      key={resident._id}
                      value={fullName}
                      onSelect={() => {
                        onSelect(resident);
                        setOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === fullName ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{fullName}</span>
                        {resident.contactNumber && (
                          <span className="text-xs text-muted-foreground">
                            {resident.contactNumber}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
