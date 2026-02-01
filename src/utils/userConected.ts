import { notFound, redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "./prisma";

export async function userConected() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  return session.user;
}

export async function isCompany() {
  const session = await userConected();

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      userType: true,
      onboardingComplete: true,
      company:{
        select:{
          id: true
        }
      }
    },
  });

  if (user?.onboardingComplete === false) {
    return redirect("/onboarding");
  }

  if (user?.userType === "JOB_SEEKER") {
    return notFound();
  }

  return user?.company;
}

export async function isJobSeeker() {
  const session = await userConected();

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      id: true,
      userType: true,
      onboardingComplete: true,
      JobSeeker:{
        select:{
          id: true
        }
      }
    },
  });

  if (user?.onboardingComplete === false) {
    return redirect("/onboarding");
  }

  if (user?.userType === "COMPANY") {
    return notFound();
  }

  return user?.JobSeeker;
}

export async function isJobSeekerStatus() {
  const session = await userConected();

  const user = await prisma.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      id: true,
      userType: true,
      onboardingComplete: true,
      JobSeeker:{
        select:{
          id: true
        }
      }
    },
  });

  if (user?.userType === "COMPANY") {
    return null;
  }

  return user?.JobSeeker;
}



