import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ourFileRouter } from "./api/uploadthing/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online Job Portal | SaaS Recruitment Platform (Next.js)",
  description:
    "Online Job Portal is a modern SaaS recruitment platform that connects companies with job seekers. It features secure authentication, dashboards, payments, background jobs, and enterprise-grade security.",

  metadataBase: new URL("https://online-job-portal-r422.vercel.app"),

  keywords: [
    "SaaS Recruitment Platform",
    "Job Board SaaS",
    "Hiring Platform",
    "Next.js SaaS",
    "Stripe Payments",
    "Admin Dashboard",
    "Enterprise Web Application",
    "PostgreSQL",
    "Prisma",
  ],

  openGraph: {
    title: "Online Job Portal | Modern SaaS Recruitment Platform",
    description:
      "A production-ready SaaS platform for hiring, job postings, candidate management, and subscriptions.",
    url: "https://online-job-portal-r422.vercel.app",
    siteName: "Online Job Portal",
    images: [
      {
        url: "https://online-job-portal-r422.vercel.app/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Online Job Portal SaaS Recruitment Platform – Hiring Made Simple",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Online Job Portal | SaaS Recruitment Platform",
    description:
      "SaaS recruitment platform with dashboards, payments, background jobs, and enterprise security.",
    images: ["https://online-job-portal-r422.vercel.app/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
