// Home Page
import React from "react";
import JobFilterSection from "@/components/general/JobFilterSection";
import JobListing from "@/components/general/JobListing";
import { Suspense } from "react";
import JobListingLoading from "@/components/general/JobListingLoading";

type SearchParams = {
  searchParams: Promise<{
    page?: string;
    jobTypes?: string;
    location?: string;
  }>;
};

export default async function Home({ searchParams }: SearchParams) {
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  const jobTypes = params.jobTypes?.split(",") || [];
  const location = params.location || "";

  const filterKey = `page=${currentPage};types=${jobTypes.join(
    ","
  )};location=${location}`;

  return (
    <div className="pt-8 pb-12">
      {/* Container with responsive grid */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Filter Section - Desktop: sidebar, Mobile: inline component */}
        <JobFilterSection />

        {/* Job Listings - Responsive column span */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Suspense fallback={<JobListingLoading />} key={filterKey}>
            <JobListing
              location={location}
              currentPage={currentPage}
              jobTypes={jobTypes}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}