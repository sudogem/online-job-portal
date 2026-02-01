// my-application page for the user type => jobseeker
import React from "react";
import { CopyLinkMenuItem } from "@/components/general/CopyLinkMenuItem";
import EmptyState from "@/components/general/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getMyApplicationsMutation } from "@/lib/Services";
import { isJobSeeker } from "@/utils/userConected";
import { MoreHorizontal, Building2, Briefcase, Calendar } from "lucide-react";
import Image from "next/image";
import MainPagination from "@/components/general/MainPagination";
import DeleteJobApplicationDialog from "@/components/general/DeleteJobApplicationDialog";

type SearchParams = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const page = async ({ searchParams }: SearchParams) => {
  const jobSeeker = await isJobSeeker();
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  const { applications, totalPages } = await getMyApplicationsMutation({
    jobSeekerId: jobSeeker?.id as string,
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
          title="No applications found"
          description="You haven't applied to any jobs yet."
          buttonText="Browse Jobs Now!"
          href="/"
          isCreate={true}
        />
      </div>
    );
  }

  return (
    <Card className="shadow-none mt-8 mb-10">
      <CardHeader>
        <CardTitle className="text-xl">My Applications</CardTitle>
        <CardDescription>Track and manage your job applications here.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied at</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <Image
                      src={application.job.company.logo}
                      alt="logo of company"
                      width={40}
                      height={40}
                      className="rounded-md size-10"
                    />
                  </TableCell>
                  <TableCell>{application.job.company.name}</TableCell>
                  <TableCell>{application.job.jobTitle}</TableCell>
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
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
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
                        <CopyLinkMenuItem
                          jobUrl={`https://online-job-portal-r422.vercel.app/job/${application.job.id}`}
                        />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <DeleteJobApplicationDialog applicationId={application.id} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
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
                      <Image
                        src={application.job.company.logo}
                        alt="logo of company"
                        width={40}
                        height={40}
                        className="rounded-md size-10"
                      />
                      <div>
                        <h3 className="font-semibold text-base text-foreground">
                          {application.job.jobTitle}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {application.job.company.name}
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
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Company
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-foreground text-right max-w-[50%] truncate">
                        {application.job.company.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border/60 px-2 -mx-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Job Title
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
                  </div>

                  {/* Action Section */}
                  <div className="pt-3">
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <CopyLinkMenuItem
                            jobUrl={`https://online-job-portal-r422.vercel.app/job/${application.job.id}`}
                          />
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <DeleteJobApplicationDialog applicationId={application.id} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default page;