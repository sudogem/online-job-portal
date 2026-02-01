import React from "react";
import { CopyLinkMenuItem } from "@/components/general/CopyLinkMenuItem";
import DeleteJobDialog from "@/components/general/DeleteJobDialog";
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
import { getMyJobsMutation } from "@/lib/Services";
import { isCompany, userConected } from "@/utils/userConected";
import {
  MoreHorizontal,
  PenBoxIcon,
  Building2,
  Briefcase,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MainPagination from "@/components/general/MainPagination";

type SearchParams = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const page = async ({ searchParams }: SearchParams) => {
  const user = await userConected();
  await isCompany();

  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  const { jobs, totalPages } = await getMyJobsMutation({
    userId: user?.id as string,
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

  if (jobs.length === 0) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
        <EmptyState
          className="border-none"
          title="No job posts found"
          description="You dont have any job posts yet."
          buttonText="Create a Job Post Now!"
          href="/post-job"
          isCreate={true}
        />
      </div>
    );
  }

  return (
    <Card className="shadow-none mt-8 mb-10">
        <CardHeader>
          <CardTitle className="text-xl">My Jobs</CardTitle>
          <CardDescription>
            Manage your job listings and applications here.
          </CardDescription>
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
                  <TableHead>Created at</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <Image
                        src={listing.company.logo}
                        alt="logo of company"
                        width={40}
                        height={40}
                        className="rounded-md size-10"
                      />
                    </TableCell>
                    <TableCell>{listing.company.name}</TableCell>
                    <TableCell>{listing.jobTitle}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(listing.status)}>
                        {listing.status.charAt(0).toUpperCase() +
                          listing.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {listing.createdAt.toLocaleDateString("en-US", {
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
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/my-jobs/${listing.id}/edit`}
                              className="cursor-pointer"
                            >
                              <PenBoxIcon />
                              Edit Job
                            </Link>
                          </DropdownMenuItem>
                          <CopyLinkMenuItem
                            jobUrl={`https://online-job-portal-r422.vercel.app/job/${listing.id}`}
                          />
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <DeleteJobDialog jobId={listing.id} />
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
            {jobs.map((listing) => (
              <Card
                key={listing.id}
                className="shadow-none overflow-hidden p-0"
              >
                <CardContent className="p-0">
                  {/* Header Section */}
                  <div className="bg-muted/80 p-4 border-b border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Image
                          src={listing.company.logo}
                          alt="logo of company"
                          width={40}
                          height={40}
                          className="rounded-md size-10"
                        />
                        <div>
                          <h3 className="font-semibold text-base text-foreground">
                            {listing.jobTitle}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {listing.company.name}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`${getStatusBadgeColor(
                          listing.status
                        )} font-semibold px-3 py-1 text-xs`}
                      >
                        {listing.status.charAt(0).toUpperCase() +
                          listing.status.slice(1).toLowerCase()}
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
                          {listing.company.name}
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
                          {listing.jobTitle}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-border/60 px-2 -mx-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">
                            Created
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {listing.createdAt.toLocaleDateString("en-US", {
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
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1"
                        >
                          <Link href={`/my-jobs/${listing.id}/edit`}>
                            <PenBoxIcon className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <CopyLinkMenuItem
                              jobUrl={`https://online-job-portal-r422.vercel.app/job/${listing.id}`}
                            />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <DeleteJobDialog jobId={listing.id} />
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
