// job-application/[id] - detailed view page for individual application
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getJobApplicationDetailsMutation } from "@/lib/Services";
import { isCompany } from "@/utils/userConected";
import {
  User,
  FileText,
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
  Download,
  ArrowLeft,
  Mail,
  Building2,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import JsonToHtml from "@/components/general/JsonToHtml";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const JobApplicationDetailsPage = async ({ params }: PageProps) => {
  const company = await isCompany();
  const { id } = await params;

  const application = await getJobApplicationDetailsMutation(
    id,
    company?.id as string
  );

  const getStatusBadgeColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === "active" || normalizedStatus === "published")
      return "bg-green-500/20 text-green-700 dark:text-green-400";
    if (normalizedStatus === "pending" || normalizedStatus === "draft")
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
    if (normalizedStatus === "closed" || normalizedStatus === "expired")
      return "bg-red-500/20 text-red-700 dark:text-red-400";
    return "bg-gray-500/20 text-gray-700 dark:text-gray-400";
  };

  const formatSalary = (from: number, to: number) => {
    return `$${from.toLocaleString()} - $${to.toLocaleString()}`;
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/my-job-applications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Application Details</h1>
            <p className="text-muted-foreground">
              Review candidate information and application details
            </p>
          </div>
          <Badge className={getStatusBadgeColor(application.job.status)}>
            {application.job.status.charAt(0).toUpperCase() +
              application.job.status.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Profile */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Candidate Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="relative">
                  {application.jobSeeker.user.image ? (
                    <Image
                      src={application.jobSeeker.user.image}
                      alt={`${application.jobSeeker.name} profile`}
                      width={80}
                      height={80}
                      className="rounded-full size-20"
                    />
                  ) : (
                    <div className="size-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {application.jobSeeker.name}
                  </h3>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <Mail className="h-4 w-4" />
                    {application.jobSeeker.user.email}
                  </p>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {application.jobSeeker.about}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Previous Experience */}
          {application.prevPosition && application.prevCompany && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Previous Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{application.prevPosition}</h4>
                    <p className="text-muted-foreground">
                      at {application.prevCompany}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cover Letter */}
          {application.coverLetter && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Cover Letter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <JsonToHtml json={JSON.parse(application.coverLetter)} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Job Information & Actions */}
        <div className="space-y-6">
          {/* Job Details */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{application.job.jobTitle}</h4>
                <p className="text-sm text-muted-foreground">
                  {application.job.company.name}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{application.job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{application.job.employmentType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatSalary(
                      application.job.salaryFrom,
                      application.job.salaryTo
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Info */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Application Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Applied on{" "}
                  {application.createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href={application.resume}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonVariants({
                  variant: "default",
                })} !shadow-none !text-white cursor-pointer w-full`}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </a>

              {application.jobSeeker.resume && (
                <a
                  href={application.jobSeeker.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttonVariants({
                    variant: "outline",
                  })} !shadow-none cursor-pointer w-full`}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Profile Resume
                </a>
              )}

              <a
                href={`mailto:${application.jobSeeker.user.email}?subject=Regarding your application for ${application.job.jobTitle}`}
                className={`${buttonVariants({
                  variant: "outline",
                })} !shadow-none cursor-pointer w-full`}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Candidate
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationDetailsPage;
