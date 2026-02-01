"use client";
import React, { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { XIcon, SlidersHorizontalIcon } from "lucide-react";
import { Label } from "../ui/label";
import { jobTypes } from "@/constants/PostJob";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { countryList } from "@/utils/countriesList";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "../ui/badge";

const JobFilterSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Get current filters from the URL
  const currentJobTypes = searchParams.get("jobTypes")?.split(",") || [];
  const currentLocation = searchParams.get("location") || "";

  // Count active filters
  const activeFiltersCount = currentJobTypes.length + (currentLocation ? 1 : 0);

  function clearAllFilter() {
    router.push("/");
    setIsSheetOpen(false);
    setIsDrawerOpen(false);
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );

  function handleJobTypeChange(jobType: string, checked: boolean) {
    const current = new Set(currentJobTypes);

    if (checked) {
      current.add(jobType);
    } else {
      current.delete(jobType);
    }

    const newValue = Array.from(current).join(",");
    router.push(`?${createQueryString("jobTypes", newValue)}`);
  }

  function handleLocationChange(location: string) {
    router.push(`?${createQueryString("location", location)}`);
  }

  // Filter content component to reuse across desktop/mobile
  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Job Type</Label>
        <div className="grid grid-cols-2 gap-4">
          {jobTypes.map((jobType) => (
            <div key={jobType.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${jobType.value}-mobile`}
                onCheckedChange={(checked) => {
                  handleJobTypeChange(jobType.value, checked as boolean);
                }}
                checked={currentJobTypes.includes(jobType.value)}
                className="cursor-pointer"
              />
              <Label
                className="text-sm font-medium cursor-pointer"
                htmlFor={`${jobType.value}-mobile`}
              >
                {jobType.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Location</Label>
        <Select
          onValueChange={(location) => {
            handleLocationChange(location);
          }}
          value={currentLocation}
        >
          <SelectTrigger className="!w-full cursor-pointer">
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Worldwide</SelectLabel>
              <SelectItem value="worldwide" className="cursor-pointer">
                <span>🌍</span>
                <span className="pl-1">Worldwide / Remote</span>
              </SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Location</SelectLabel>
              {countryList.map((country) => (
                <SelectItem
                  value={country.name}
                  key={country.name}
                  className="cursor-pointer"
                >
                  <span>{country.flagEmoji}</span>
                  <span className="pl-1">{country.name}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Card - Hidden on mobile */}
      <Card className="hidden lg:block col-span-1 shadow-none h-fit">
        <CardHeader className="space-y-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-semibold">Filters</CardTitle>
            <Button
              onClick={clearAllFilter}
              variant="outline"
              size="sm"
              className="shadow-none cursor-pointer py-1"
            >
              <span>Clear All</span>
              <XIcon className="size-4 ml-1" />
            </Button>
          </div>
          <Separator />
        </CardHeader>
        <CardContent className="mt-4">
          <FilterContent />
        </CardContent>
      </Card>

      {/* Mobile Filter Button & Active Filters - Visible on mobile/tablet */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center justify-between  gap-4">
          {/* Filter Trigger Buttons */}
          <div className="flex gap-2">
            {/* Sheet for tablets (md screens) */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden md:flex lg:hidden items-center gap-2 shadow-none"
                >
                  <SlidersHorizontalIcon className="size-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 px-2 py-0 text-xs"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-96 px-6">
                <SheetHeader className="text-left px-0">
                  <SheetTitle className="text-xl font-semibold">
                    Filters
                  </SheetTitle>
                  <SheetDescription>
                    Filter jobs by type and location to find your perfect match.
                  </SheetDescription>
                </SheetHeader>
                <Separator />
                <div>
                  <FilterContent />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <SheetClose asChild>
                    <Button
                      onClick={clearAllFilter}
                      variant="outline"
                      className="w-full cursor-pointer"
                      disabled={activeFiltersCount === 0}
                    >
                      Clear All Filters
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>

            {/* Drawer for mobile (sm screens and below) */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="md:hidden flex items-center gap-2 shadow-none"
                >
                  <SlidersHorizontalIcon className="size-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 px-2 py-0 text-xs"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[85vh]">
                <DrawerHeader className="text-left">
                  <DrawerTitle className="text-xl font-semibold">
                    Filters
                  </DrawerTitle>
                  <DrawerDescription>
                    Filter jobs by type and location to find your perfect match.
                  </DrawerDescription>
                </DrawerHeader>

                <div className="px-4 py-2 overflow-y-auto flex-1">
                  <FilterContent />
                </div>
                <DrawerFooter className="pt-4">
                  <DrawerClose asChild>
                    <Button
                      onClick={clearAllFilter}
                      variant="outline"
                      className="w-full cursor-pointer"
                      disabled={activeFiltersCount === 0}
                    >
                      Clear All Filters
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* clear all Filters button */}

          {activeFiltersCount > 0 && (
            <Button
              onClick={clearAllFilter}
              variant="outline"
              className="shadow-none cursor-pointer"
            >
              <span>Clear All</span>
              <XIcon className="size-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default JobFilterSection;
