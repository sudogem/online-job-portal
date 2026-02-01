import React from "react";
import EditJobForm from "@/components/forms/EditJobForm";
import { getMyJobMutation } from "@/lib/Services";
import { isCompany, userConected } from "@/utils/userConected";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { companies, stats, testimonials } from "@/constants/PostJob";
import Image from "next/image";
import { notFound } from "next/navigation";

type Params = Promise<{ jobId: string }>;
const page = async ({ params }: { params: Params }) => {
  const user = await userConected();
  await isCompany();
  const { jobId } = await params;
  const jobData = await getMyJobMutation(jobId, user.id as string);

  if (!jobData) {
    return notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-6 pb-8 lg:pb-12">
      <EditJobForm job={jobData} />

      {/* This card will contain company logos, testimonials, and stats */}
      <Card className=" hidden lg:block col-span-1 h-fit shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">Trusted by Industry Leaders</CardTitle>
          <CardDescription>
            Join thousands of companies hiring top talent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 mt-6">
          {/* Company logos */}
          <div className="grid grid-cols-3 gap-4">
            {companies.map((company) => (
              <Image
                key={company.id}
                src={company.logo}
                alt={company.name}
                width={80}
                height={80}
                className="rounded-lg border border-muted-foreground/15 hover:border-muted-foreground/40 transition-all duration-200 ease-in-out"
              />
            ))}
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <blockquote
                key={index}
                className="border-l-2 border-primary pl-4"
              >
                <p className="text-sm italic text-muted-foreground">
                  &quot;{testimonial.quote}&quot;
                </p>
                <footer className="mt-2 text-sm font-medium">
                  - {testimonial.author}, {testimonial.company}
                </footer>
              </blockquote>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-lg bg-muted p-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
