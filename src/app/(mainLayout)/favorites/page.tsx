import React from "react";
import EmptyState from "@/components/general/EmptyState";
import JobCard from "@/components/general/JobCard";
import MainPagination from "@/components/general/MainPagination";
import { getFavoritesMutation } from "@/lib/Services";
import { userConected } from "@/utils/userConected";

type SearchParams = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const page = async ({ searchParams }: SearchParams) => {
  const user = await userConected();

  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  const { jobs, totalPages } = await getFavoritesMutation({
    userId: user?.id as string,
    page: currentPage,
    pageSize: 10,
  });

  return (
    <>
      {jobs.length === 0 ? (
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
          <EmptyState
            className="border-none"
            title="No Favorites found"
            description="You dont have any favorites yet."
            buttonText="Find a job"
            href="/"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pt-6 md:pt-8 pb-10">
          {jobs.map((favorite) => (
            <JobCard key={favorite.job.id} job={favorite.job} />
          ))}
          <div className="flex justify-center mt-4">
            <MainPagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        </div>
      )}
    </>
  );
};

export default page;
