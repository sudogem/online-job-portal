import { prisma } from "@/utils/prisma";
import { notFound, redirect } from "next/navigation";

export const getCompany = async (userId: string) => {
  const data = await prisma.company.findUnique({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      name: true,
      logo: true,
      location: true,
      about: true,
      xAccount: true,
      website: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!data) {
    return redirect("/");
  }

  return data;
};

// Get all active jobs
export const getJobsDataMutation = async ({
  page = 1,
  pageSize = 10,
  jobTypes = [],
  location = "",
}: {
  page: number;
  pageSize: number;
  jobTypes: string[];
  location: string;
}) => {
  const skip = (page - 1) * pageSize;

  const [data, totalCount] = await Promise.all([
    prisma.job.findMany({
      where: {
        status: "ACTIVE",
        employmentType:
          jobTypes.length > 0
            ? {
                in: jobTypes,
              }
            : undefined,
        location: location && location !== "worldwide" ? location : undefined,
      },
      take: pageSize,
      skip: skip,
      select: {
        jobTitle: true,
        id: true,
        salaryFrom: true,
        salaryTo: true,
        employmentType: true,
        location: true,
        createdAt: true,
        company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.job.count({
      where: {
        status: "ACTIVE",
        employmentType:
          jobTypes.length > 0
            ? {
                in: jobTypes,
              }
            : undefined,
        location: location && location !== "worldwide" ? location : undefined,
      },
    }),
  ]);

  return {
    jobs: data,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};

// Get Job Details
export const getJobMutation = async (jobId: string, userId?: string) => {
  const [jobData, savedJob] = await Promise.all([
    await prisma.job.findUnique({
      where: {
        status: "ACTIVE",
        id: jobId,
      },
      select: {
        jobTitle: true,
        jobDescription: true,
        location: true,
        employmentType: true,
        benefits: true,
        createdAt: true,
        listingDuration: true,
        company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
    }),

    userId
      ? prisma.savedJob.findUnique({
          where: {
            jobId_userId: {
              userId: userId,
              jobId: jobId,
            },
          },
          select: {
            id: true,
          },
        })
      : null,
  ]);

  if (!jobData) {
    return notFound();
  }

  return {
    jobData,
    savedJob,
  };
};

// Get Favorites Jobs
export const getFavoritesMutation = async ({
  userId,
  page = 1,
  pageSize = 10,
}: {
  userId: string;
  page: number;
  pageSize: number;
}) => {
  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.savedJob.findMany({
      where: {
        userId: userId,
      },
      take: pageSize,
      skip: skip,
      select: {
        job: {
          select: {
            id: true,
            jobTitle: true,
            salaryFrom: true,
            salaryTo: true,
            employmentType: true,
            location: true,
            createdAt: true,
            company: {
              select: {
                name: true,
                logo: true,
                location: true,
                about: true,
              },
            },
          },
        },
      },
    }),

    prisma.savedJob.count({
      where: {
        userId: userId,
        job: {
          status: "ACTIVE",
        },
      },
    }),
  ]);

  return {
    jobs: data,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};

// Get my jobs
export const getMyJobsMutation = async ({
  userId,
  page = 1,
  pageSize = 10,
}: {
  userId: string;
  page: number;
  pageSize: number;
}) => {
  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.job.findMany({
      where: {
        company: {
          userId: userId,
        },
      },
      skip: skip,
      take: pageSize,
      select: {
        id: true,
        jobTitle: true,
        status: true,
        createdAt: true,
        company: {
          select: {
            name: true,
            logo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.job.count({
      where: {
        company: {
          userId: userId,
        },
      },
    }),
  ]);

  return {
    jobs: data,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};

// Get my job
export const getMyJobMutation = async (jobId: string, userId: string) => {
  const data = await prisma.job.findUnique({
    where: {
      id: jobId,
      company: {
        userId: userId,
      },
    },
    select: {
      benefits: true,
      id: true,
      jobTitle: true,
      jobDescription: true,
      salaryFrom: true,
      salaryTo: true,
      location: true,
      employmentType: true,
      listingDuration: true,
      company: {
        select: {
          about: true,
          name: true,
          location: true,
          website: true,
          xAccount: true,
          logo: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
};

// Get Job Seeker Info
export const getJobSeekerInfo = async (jobSeekerId: string) => {
  const data = await prisma.jobSeeker.findUnique({
    where: {
      id: jobSeekerId,
    },
    select: {
      id: true,
      resume: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
};

// Check is job Applied
export const isJobApplied = async (jobId: string, jobSeekerId?: string) => {
  if (!jobSeekerId) {
    return false;
  }
  const jobApplied = await prisma.jobApplication.findUnique({
    where: {
      jobId_jobSeekerId: {
        jobId: jobId,
        jobSeekerId: jobSeekerId as string,
      },
    },
    select: {
      id: true,
    },
  });

  if (!jobApplied) {
    return false;
  }

  return true;
};

// Get My Applications
export const getMyApplicationsMutation = async ({
  jobSeekerId,
  page = 1,
  pageSize = 10,
}: {
  jobSeekerId: string;
  page: number;
  pageSize: number;
}) => {
  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.jobApplication.findMany({
      where: {
        jobSeekerId: jobSeekerId,
      },
      skip: skip,
      take: pageSize,
      select: {
        id: true,
        createdAt: true,
        job: {
          select: {
            id: true,
            jobTitle: true,
            status: true,
            company: {
              select: {
                name: true,
                logo: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.jobApplication.count({
      where: {
        jobSeekerId: jobSeekerId,
      },
    }),
  ]);

  return {
    applications: data,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};

// Get Job Applications for Company Jobs
export const getCompanyJobApplicationsMutation = async ({
  userId,
  page = 1,
  pageSize = 10,
}: {
  userId: string;
  page: number;
  pageSize: number;
}) => {
  const skip = (page - 1) * pageSize;

  const [data, totalCount] = await Promise.all([
    prisma.jobApplication.findMany({
      where: {
        job: {
          company: {
            id: userId,
          },
        },
      },
      skip: skip,
      take: pageSize,
      select: {
        id: true,
        resume: true,
        coverLetter: true,
        prevPosition: true,
        prevCompany: true,
        createdAt: true,
        job: {
          select: {
            id: true,
            jobTitle: true,
            status: true,
          },
        },
        jobSeeker: {
          select: {
            id: true,
            name: true,
            about: true,
            user: {
              select: {
                email: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.jobApplication.count({
      where: {
        job: {
          company: {
            id: userId,
          },
        },
      },
    }),
  ]);

  return {
    applications: data,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};

// Get Single Job Application Details
export const getJobApplicationDetailsMutation = async (
  applicationId: string,
  userId: string
) => {
  const data = await prisma.jobApplication.findUnique({
    where: {
      id: applicationId,
      job: {
        company: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      resume: true,
      coverLetter: true,
      prevPosition: true,
      prevCompany: true,
      createdAt: true,
      job: {
        select: {
          id: true,
          jobTitle: true,
          jobDescription: true,
          location: true,
          employmentType: true,
          salaryFrom: true,
          salaryTo: true,
          status: true,
          company: {
            select: {
              name: true,
              logo: true,
            },
          },
        },
      },
      jobSeeker: {
        select: {
          id: true,
          name: true,
          about: true,
          resume: true,
          user: {
            select: {
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
};
