import { getJobsDataMutation } from "@/lib/Services";
import React from "react";
import EmptyState from "./EmptyState";
import JobCard from "./JobCard";
import MainPagination from "./MainPagination";

const JobListing = async ({
  currentPage,
  jobTypes,
  location,
}: {
  currentPage: number;
  jobTypes: string[];
  location: string;
}) => {
  const { jobs, totalPages } = await getJobsDataMutation({
    page: currentPage,
    pageSize: 10,
    jobTypes: jobTypes,
    location: location,
  });
  return (
    <>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-4 sm:gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          <div className="flex justify-center mt-4">
            <MainPagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        </div>
      ) : (
        <EmptyState
          title="No jobs found"
          description="Try searching for a different job title or location."
          buttonText="Clear all filters"
          href="/"
        />
      )}
    </>
  );
};

export default JobListing;
