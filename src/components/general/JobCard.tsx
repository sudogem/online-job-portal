"use client";
import React from "react";
import Link from "next/link";
import { Card, CardHeader } from "../ui/card";
import { MapPin, User2, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { jobTypes } from "@/constants/PostJob";

interface iAppProps {
  job: {
    id: string;
    jobTitle: string;
    salaryFrom: number;
    salaryTo: number;
    employmentType: string;
    location: string;
    createdAt: Date;
    company: {
      logo: string | null;
      name: string;
      about: string;
      location: string;
    };
  };
}

const JobCard = ({ job }: iAppProps) => {
  return (
    <Link href={`/job/${job.id}`}>
      <Card className="hover:bg-primary/10 hover:border-primary relative shadow-none transition-all duration-300 py-2">
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            {/* Company Logo */}
            <div className="flex gap-3 md:block">
              {job.company.logo ? (
                <Image
                  src={job.company.logo}
                  alt={job.company.name}
                  width={48}
                  height={48}
                  className="size-12 md:size-14 border border-border rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="bg-red-500 size-12 md:size-14 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User2 className="size-5 md:size-6 text-white" />
                </div>
              )}
              {/* Job Title and Company - Mobile Layout */}
              <div className="md:hidden">
                <h1 className="text-lg font-bold leading-tight line-clamp-1 mb-1">
                  {job.jobTitle}
                </h1>
                <p className="text-sm text-muted-foreground mb-2">
                  {job.company.name}
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-2 md:gap-[5px] flex-grow min-w-0">
              {/* Job Title - Desktop Layout */}
              <h1 className="hidden md:block text-xl md:text-2xl font-bold mt-[-3px]">
                {job.jobTitle}
              </h1>

              {/* Desktop Info Row */}
              <div className="hidden md:flex flex-wrap items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {job.company.name}
                </p>
                <span className="text-muted-foreground">•</span>
                <Badge className="rounded-full" variant="secondary">
                  {jobTypes.find(
                    (jobType) => jobType.value === job.employmentType
                  )?.label || job.employmentType}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <Badge className="rounded-full text-white">
                  {job.location}
                </Badge>
                <span className="text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(job.salaryFrom)} -{" "}
                  {formatCurrency(job.salaryTo)}
                </p>
              </div>

              {/* Mobile Info Grid */}
              <div className="md:hidden space-y-2">
                {/* Employment Type and Location */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className="rounded-md border-border text-xs"
                    variant="secondary"
                  >
                    {jobTypes.find(
                      (jobType) => jobType.value === job.employmentType
                    )?.label || job.employmentType}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3" />
                    <span>{job.location}</span>
                  </div>
                </div>

                {/* Salary and Time */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-sm font-medium text-green-600">
                    {formatCurrency(job.salaryFrom)} -{" "}
                    {formatCurrency(job.salaryTo)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{formatRelativeTime(job.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Right Side Info */}
            <div className="hidden md:block md:ml-auto">
              <div className="flex items-center gap-2 justify-end">
                <MapPin className="size-4" />
                <h1 className="text-base md:text-lg font-semibold whitespace-nowrap">
                  {job.location}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground md:text-right text-nowrap">
                {formatRelativeTime(job.createdAt)}
              </p>
            </div>
          </div>

          {/* Company Description */}
          <div className="!mt-3 md:!mt-5">
            <p className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed">
              {job.company.about}
            </p>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default JobCard;
