import React, { useState } from "react";
import { useInView } from "../utils/hooks";
import Logo from "../components/Logo";
import PricingCard from "../components/PricingCard";
import { landingPageData } from "../utils/mockData";
import LogoLanding from "../components/LogoLandingPage";

const SubscriptionPricingPageTwo = () => {
  const [cardRef, cardVisible] = useInView();
  const [billingType, setBillingType] = useState("monthly");
  const {pricing} = landingPageData;
  const pricingPlans = pricing.items;

  const getCurrentPrice = (plan) => {
    return billingType === "monthly" ? plan.price : plan.annualPrice;
  };


  const getSavings = (plan) => {
    if (billingType === "monthly") return null;
    const monthlyCost = plan.price * 12;
    const savings = (
      ((monthlyCost - plan.annualPrice) / monthlyCost) *
      100
    ).toFixed(0);
    return savings;
  };

  return (
    <div className="min-h-screen bg-dark overflow-hidden">
      <div className="fixed w-full flex justify-between">
        <LogoLanding />
        {/* Toggle Buttons */}
         <div className="flex gap-3 bg-[#FFFFFF1A] rounded-lg p-1 m-3">
          <button
            onClick={() => setBillingType("monthly")}
            className={` px-6 py-2 rounded-md text-sm font-medium transition-all ${
              billingType === "monthly"
                ? "text-gray-light hover:text-white "
                : " bg-[#2C2C2C] text-white cursor-pointer"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingType("yearly")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              billingType === "yearly"
                ? "text-gray-light hover:text-white"
                : "bg-[#2C2C2C] text-white cursor-pointer"
            }`}
          >
            Annuel
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="background-color-login w-full min-h-screen flex justify-center items-center flex-col px-4 pt-16">
        {/* Header Section */}
        <div className="w-full max-w-6xl mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <h1 className="text-white text-5xl font-extrabold  text-center mx-auto traking-[-1.2px] mt-4">
              Chez <span className="text-primary">SkillsView </span>, nous vous proposons <br /> une  <span className="text-primary"> multitude d’offre </span>
            </h1>
          </div>
        </div>

        {/* Pricing Cards */}
        <div
          ref={cardRef}
          className={`w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 fade-in-up-scroll mb-10 ${
            cardVisible ? "visible" : ""
          }`}
        >
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              price={getCurrentPrice(plan)}
              period={billingType === "monthly" ? "mois" : "an"}
              description={plan.description}
              features={plan.features}
              cta={plan.cta}
              isPopular={plan.popular}
              savings={getSavings(plan)}
            />
          ))}
        </div>

      </main>
    </div>
  );
};

export default SubscriptionPricingPageTwo;
