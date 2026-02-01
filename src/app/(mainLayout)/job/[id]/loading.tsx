import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const JobPageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 pb-12">
      <div className="space-y-8 col-1 md:col-span-2">
        {/* Header skeleton */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-9 w-3/4 mb-3" />
            <div className="flex items-center gap-2 mt-3">
              <Skeleton className="h-5 w-32" />
              <span className="hidden md:inline text-muted-foreground">•</span>
              <Skeleton className="h-6 w-20 rounded-full" />
              <span className="hidden md:inline text-muted-foreground">•</span>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Job description skeleton */}
        <section className="space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </section>

        {/* Benefits skeleton */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-6 grid-cols-1">
        {/* Apply now card skeleton */}
        <Card className="p-6 shadow-none">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-24 mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>

        {/* Job details card skeleton */}
        <Card className="p-6 shadow-none">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </Card>

        {/* Company card skeleton */}
        <Card className="p-6 shadow-none">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Skeleton className="rounded-md size-12" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JobPageSkeleton;
