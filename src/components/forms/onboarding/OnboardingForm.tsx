"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "@/assets/public/logo.png";
import { Card, CardContent } from "@/components/ui/card";
import UserTypeSelection from "./UserTypeSelection";
import CompanyForm from "./CompanyForm";
import JobSeekerForm from "./JobSeekerForm";

export type UserSelectionType = "jobSeeker" | "company" | null;

const OnboardingForm = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserSelectionType>(null);

  const handleUserTypeSelection = (type: UserSelectionType) => {
    setUserType(type);
    setStep(2);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <UserTypeSelection onUserTypeSelect={handleUserTypeSelection} />;
      case 2:
        return userType === "jobSeeker" ? (
          <JobSeekerForm/>
        ) : (
          <CompanyForm/>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <div className="flex items-center gap-4 mb-10">
        <Image src={logo} alt="logo" width={50} height={50} />
        <h1 className="text-4xl font-bold">
          Hire<span className="text-primary">ek</span>
        </h1>
      </div>

      <Card className="shadow-none sm:min-w-lg">
        <CardContent>{renderStep()}</CardContent>
      </Card>
    </>
  );
};

export default OnboardingForm;
