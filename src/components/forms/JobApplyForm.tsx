// job apply form
"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { jobApplicationSchema } from "@/utils/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PDFImage from "@/assets/public/pdf.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { UploadDropzone } from "@/app/utils/uploadthing";
import JobDescriptionEditor from "../richTextEditor/JobDescriptionEditor";
import { newJobApplication } from "@/lib/actions";

interface JobApplyFormProps {
  resume: string;
  jobId: string;
  jobSeekerId: string;
}

const JobApplyForm = ({ resume, jobId, jobSeekerId }: JobApplyFormProps) => {
  const [pending, setPending] = useState(false);
  const form = useForm<z.infer<typeof jobApplicationSchema>>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      jobId: jobId,
      jobSeekerId: jobSeekerId,
      resume: resume,
      prevPosition: "",
      prevCompany: "",
      coverLetter: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof jobApplicationSchema>) => {
    try {
      setPending(true);
      await newJobApplication(data);
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.error("Error creating job seeker:", error);
      }
    } finally {
      setPending(false);
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Resume field */}
        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem className="space-y-0.5">
              <FormLabel>Resume (PDF)</FormLabel>
              <FormControl>
                {field.value ? (
                  <div className="relative w-fit mt-1.5">
                    <Image
                      src={PDFImage}
                      alt="Resume"
                      width={100}
                      height={100}
                      className="rounded-lg "
                    />
                    <Button
                      variant="destructive"
                      type="button"
                      size="icon"
                      className="absolute -top-2 -right-2 rounded-full cursor-pointer !bg-red-600/80 hover:!bg-red-600/95 transition-all duration-200 ease-in-out !size-8"
                      onClick={() => {
                        field.onChange("");
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint={"pdfUploader"}
                    onClientUploadComplete={(files) => {
                      field.onChange(files[0].ufsUrl);
                    }}
                    onUploadError={() => {
                      console.log("Error uploading file");
                    }}
                    className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-button:cursor-pointer ut-allowed-content:text-muted-foreground border-primary"
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Previous position */}
        <FormField
          control={form.control}
          name="prevPosition"
          render={({ field }) => (
            <FormItem className="space-y-0.5">
              <FormLabel>Previous Position</FormLabel>
              <FormControl>
                <Input placeholder="Job title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Previous company */}
        <FormField
          control={form.control}
          name="prevCompany"
          render={({ field }) => (
            <FormItem className="space-y-0.5">
              <FormLabel>Previous Company</FormLabel>
              <FormControl>
                <Input placeholder="Company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Motivational letter */}
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem className="space-y-0.5">
              <FormLabel>Motivational letter</FormLabel>
              <FormControl>
                <JobDescriptionEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submi button */}
        <Button
          type="submit"
          disabled={pending}
          className="w-full cursor-pointer text-white"
        >
          {pending ? "Submitting..." : "Apply Now"}
        </Button>
      </form>
    </Form>
  );
};

export default JobApplyForm;
