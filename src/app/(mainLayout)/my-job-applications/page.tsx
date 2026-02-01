// my-job-applications page for company users
import React from "react";
import EmptyState from "@/components/general/EmptyState";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getCompanyJobApplicationsMutation } from "@/lib/Services";
import { isCompany } from "@/utils/userConected"; // Assuming you have this utility
import {
  User,
  FileText,
  Briefcase,
  Calendar,
  Eye,
  Download,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MainPagination from "@/components/general/MainPagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SearchParams = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const JobApplicationsPage = async ({ searchParams }: SearchParams) => {
  const company = await isCompany();
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  const { applications, totalPages } = await getCompanyJobApplicationsMutation({
    userId: company?.id as string,
    page: currentPage,
    pageSize: 10,
  });

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

  if (applications.length === 0) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
        <EmptyState
          className="border-none"
          title="No applications received"
          description="You haven't received any job applications yet. Make sure your jobs are published and active."
          buttonText="View My Jobs"
          href="/my-jobs"
          isCreate={true}
        />
      </div>
    );
  }

  return (
    <Card className="shadow-none mt-8 mb-10">
      <CardHeader>
        <CardTitle className="text-xl">Job Applications</CardTitle>
        <CardDescription>
          Manage and review applications for your job postings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Previous Experience</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {application.jobSeeker.user.image ? (
                          <Image
                            src={application.jobSeeker.user.image}
                            alt={`${application.jobSeeker.name} profile`}
                            width={40}
                            height={40}
                            className="rounded-full size-10"
                          />
                        ) : (
                          <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {application.jobSeeker.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {application.jobSeeker.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">
                        {application.job.jobTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Job ID: {application.job.id.slice(-8)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusBadgeColor(application.job.status)}
                    >
                      {application.job.status.charAt(0).toUpperCase() +
                        application.job.status.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {application.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {application.prevPosition && application.prevCompany ? (
                      <div className="text-sm">
                        <p className="font-medium">
                          {application.prevPosition}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          at {application.prevCompany}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Not specified
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Buttons */}
                    <div className="gap-2 justify-end hidden xl:flex">
                      <Link
                        href={`/my-job-applications/${application.id}`}
                        className={`${buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })} !shadow-none`}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Link>
                      <a
                        href={application.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${buttonVariants({
                          variant: "default",
                          size: "sm",
                        })} !shadow-none !text-white`}
                      >
                        <Download className="h-4 w-4" />
                        Resume
                      </a>
                    </div>

                    {/* Dropdown */}
                    <div className="xl:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                          >
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/my-job-applications/${application.id}`}
                              className="flex items-center gap-1 justify-start px-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <a
                              href={application.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 justify-start px-2 cursor-pointer"
                            >
                              <Download className="h-4 w-4" />
                              Resume
                            </a>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {applications.map((application) => (
            <Card
              key={application.id}
              className="shadow-none overflow-hidden p-0"
            >
              <CardContent className="p-0">
                {/* Header Section */}
                <div className="bg-muted/80 p-4 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        {application.jobSeeker.user.image ? (
                          <Image
                            src={application.jobSeeker.user.image}
                            alt={`${application.jobSeeker.name} profile`}
                            width={40}
                            height={40}
                            className="rounded-full size-10"
                          />
                        ) : (
                          <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-foreground">
                          {application.jobSeeker.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {application.jobSeeker.user.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`${getStatusBadgeColor(
                        application.job.status
                      )} font-semibold px-3 py-1 text-xs`}
                    >
                      {application.job.status.charAt(0).toUpperCase() +
                        application.job.status.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <div className="px-4 pb-3 space-y-0">
                  <div className="grid grid-cols-1">
                    <div className="flex items-center justify-between py-3 border-b border-border/60 px-2 -mx-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Position
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-foreground text-right max-w-[50%] truncate">
                        {application.job.jobTitle}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border/60 px-2 -mx-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Applied
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {application.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {application.prevPosition && application.prevCompany && (
                      <div className="flex items-center justify-between py-3 border-b border-border/60 px-2 -mx-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">
                            Previous Role
                          </span>
                        </div>
                        <div className="text-right max-w-[50%]">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {application.prevPosition}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            at {application.prevCompany}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Section */}
                  <div className="pt-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/my-job-applications/${application.id}`}
                        className={`${buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })} !shadow-none !flex-1`}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Link>
                      <a
                        href={application.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${buttonVariants({
                          variant: "default",
                          size: "sm",
                        })} !shadow-none !text-white`}
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-3">
        <MainPagination totalPages={totalPages} currentPage={currentPage} />
      </CardFooter>
    </Card>
  );
};

export default JobApplicationsPage;
