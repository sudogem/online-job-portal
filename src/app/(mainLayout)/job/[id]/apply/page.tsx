// job Apply page
import React from "react";
import JobApplyForm from "@/components/forms/JobApplyForm";
import { getJobMutation, getJobSeekerInfo } from "@/lib/Services";
import { isJobSeeker } from "@/utils/userConected";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { jobTypes } from "@/constants/PostJob";
import { getFlagEmoji } from "@/utils/countriesList";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Calendar, Clock } from "lucide-react";

type Params = Promise<{ id: string }>;

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const jobSeeker = await isJobSeeker();
  const jobSeekerInfo = await getJobSeekerInfo(jobSeeker?.id as string);
  
  const { jobData } = await getJobMutation(id);

  if (!jobData) {
    return <div>Job not found</div>;
  }

  const locationFlag = getFlagEmoji(jobData?.location as string);

  return (
    <div className="py-8">
      {/* Back navigation */}
      <Link
        href={`/job/${id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Job Details
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Form Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">
                Apply for this position
              </CardTitle>
              <CardDescription>
                Fill out the form below to submit your application for{" "}
                <span className="font-medium">{jobData.jobTitle}</span> at{" "}
                {jobData.company.name}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobApplyForm
                resume={jobSeekerInfo?.resume as string}
                jobSeekerId={jobSeekerInfo?.id as string}
                jobId={id}
              />
            </CardContent>
          </Card>
        </div>

        {/* Job and Company Info Section */}
        <div className="space-y-6">
          {/* Job Summary Card */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">{jobData.jobTitle}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="rounded-full" variant="secondary">
                  {jobTypes.find(
                    (jobType) => jobType.value === jobData.employmentType
                  )?.label || jobData.employmentType}
                </Badge>
                <Badge className="rounded-full text-white">
                  {locationFlag && <span className="mr-1">{locationFlag}</span>}
                  {jobData.location}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Company:</span>
                  <span className="font-medium">{jobData.company.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span>{jobData.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Type:</span>
                  <span>{jobData.employmentType}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Apply before:</span>
                  <span>
                    {new Date(
                      jobData.createdAt.getTime() +
                        jobData.listingDuration * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information Card */}
          <Card className="shadow-none gap-3">
            <CardHeader>
              <CardTitle className="text-lg">About the Company</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Image
                  src={jobData.company.logo}
                  alt={`${jobData.company.name} logo`}
                  width={48}
                  height={48}
                  className="rounded-md size-12 flex-shrink-0"
                />
                <div className="space-y-2">
                  <h3 className="font-semibold">{jobData.company.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {jobData.company.about}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Tips Card */}
          <Card className="shadow-none bg-primary/10 border-primary">
            <CardHeader>
              <CardTitle className="text-lg">Application Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 py-0 text-sm">
              <p>• Ensure your resume is current and relevant</p>
              <p>• Customize your cover letter for this role</p>
              <p>• Emphasize matching experience and skills</p>
              <p>• Review everything before submitting</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
