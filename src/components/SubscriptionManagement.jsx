import React from "react";
import { useNavigate } from "react-router-dom";
const SubscriptionManagement = ({
  planTitle = "Free",
  videoRemaining = 1,
  videosLimit = 1,
  onManageClick = () => {},
}) => {
  const navigate = useNavigate();
  
  const isUnlimited = planTitle === "Ultimate" || videosLimit === 0;
  const usedVideos = isUnlimited ? '?' : videosLimit - videoRemaining;
  const progressPercentage = isUnlimited ? 100 : ((videosLimit - videoRemaining) / videosLimit) * 100;

  const handleManageClick = () => {
    onManageClick();
    navigate("/manage-subscription");
  };
  return (
    <div className="bg-dark-dashboard rounded-xl p-6 max-h-[210px] scale-90 font-spline">
      {/* Header Badge */}
      <div className=" text-chateau text-sm font-normal leading-[21px]">
        Gestion Abonnement
      </div>

      {/* Plan Title */}
      <h3 className="text-xl mt-2  leading-[22.5px] text-[#F9FAFB] ">
        {planTitle}
      </h3>

      {/* Usage Info */}
      <div className="flex items-center gap-2">
        <p className="text-sm text-chateau  font-normal leading-6">
          {isUnlimited 
            ? "Vidéos illimitées" 
            : `${videosLimit - videoRemaining}/${videosLimit} vidéos analysées ce mois-ci`
          }
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full h-2 bg-[#374151] rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Management Button */}
      <button
        onClick={handleManageClick}
        className="w-full mt-4 px-4 py-2.5 bg-primary text-dark text-sm leading-[21px] text-center rounded-lg cursor-pointer "
      >
        Gérer l'Abonnement
      </button>
    </div>
  );
};

export default SubscriptionManagement;
