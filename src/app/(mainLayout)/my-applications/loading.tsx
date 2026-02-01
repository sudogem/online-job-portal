import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MyApplicationsSkeleton = () => {
  // Generate skeleton rows for desktop table
  const desktopSkeletonRows = Array.from({ length: 5 }, (_, i) => (
    <TableRow key={i}>
      <TableCell>
        <Skeleton className="size-10 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-40" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8 rounded-md ml-auto" />
      </TableCell>
    </TableRow>
  ));

  // Generate skeleton cards for mobile view
  const mobileSkeletonCards = Array.from({ length: 5 }, (_, i) => (
    <Card key={i} className="shadow-none overflow-hidden p-0">
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="bg-muted/80 p-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Skeleton className="size-10 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 pb-3 space-y-0">
          <div className="grid grid-cols-1">
            {/* Company Row */}
            <div className="flex items-center justify-between py-3 border-b border-border/60 px-2 -mx-2">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Job Title Row */}
            <div className="flex items-center justify-between py-3 border-b border-border/60 px-2 -mx-2">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Created Date Row */}
            <div className="flex items-center justify-between py-3 border-b border-border/60 px-2 -mx-2">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-4 w-14" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Action Section */}
          <div className="pt-3">
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ));

  return (
    <Card className="shadow-none mt-8 mb-10">
      <CardHeader>
        <Skeleton className="h-7 w-24" /> {/* Title */}
        <Skeleton className="h-4 w-64" /> {/* Description */}
      </CardHeader>
      <CardContent>
        {/* Desktop Table Skeleton */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-4 w-14 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{desktopSkeletonRows}</TableBody>
          </Table>
        </div>

        {/* Mobile Cards Skeleton */}
        <div className="md:hidden space-y-4">{mobileSkeletonCards}</div>
      </CardContent>
      <CardFooter className="mt-3">
        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center space-x-2 w-full">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-20" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default MyApplicationsSkeleton;