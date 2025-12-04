import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import VideoUploader from "../components/VideoUploader";
import { useInView } from "../utils/hooks";

import matchService from "../services/matchService";
import Logo from "../components/Logo";
import match from "../assets/match.png";
import SubscriptionManagement from "../components/SubscriptionManagement";
import { useAuth } from "../context/AuthContext";

import videoAnalysisService from "../services/videoAnalysisService";

/** Composant OverviewSection - Matches */
const OverviewSection = () => {
  const [latestMatch, setLatestMatch] = React.useState(null);
  const [analyses, setAnalyses] = React.useState([]);
  const [titleRef, titleVisible] = useInView();
  const [cardsRef, cardsVisible] = useInView();
  const [videosRef, videosVisible] = useInView();
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch matches (keep mock for now if backend not ready for matches)
        const matchResponse = await matchService.getLatestMatch();
        setLatestMatch(matchResponse.data);

        // Fetch real video analyses
        const analysesResponse = await videoAnalysisService.getAnalyses({ page_size: 5 });
        setAnalyses(analysesResponse.results || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    return <StatusBadge status={status} />;
  };

  return (
    <div className="space-y-3 scale-90">
      {/* Video Uploader */}

      {/* <h2
        ref={titleRef}
        className={`sm:text-lg font-alt text-white tracking-[-0.33px] leading-6 mb-4 fade-in-up-scroll ${
          titleVisible ? "visible" : ""
        }`}
      >
        Derniers Matchs
      </h2> */}

      {/* Matches Cards (Keep existing mocks or update if needed) */}
      {/* <div
        ref={cardsRef}
        className={`grid grid-cols-1 md:grid-cols-3 gap-3 fade-in-up-scroll ${
          cardsVisible ? "visible" : ""
        }`}
      >
        <div className="bg-dark-dashboard rounded-xl p-4 w-full sm:max-w-80">
          <img src={match} alt="match capture d'ecran" className="w-full" />
          <div className="mt-3">
            <p className="text-gray-text font-alt leading-5">
              PSG vs Marseille
            </p>
            <p className="text-sm text-gray-light font-alt leading-5">
              16Oct2023 - Victoire 3-1
            </p>
          </div>
        </div>
      </div> */}

      <div className="space-y-3 mt-10">
        <h2
          ref={videosRef}
          className={`sm:text-lg font-alt text-white tracking-[-0.33px] leading-6  mb-4 fade-in-up-scroll ${
            videosVisible ? "visible" : ""
          }`}
        >
          Derniers Analyses ({analyses.length})
        </h2>

        {analyses.length > 0 ? (
          analyses.map((analysis, index) => (
            <div
              key={analysis.id}
              className={`flex items-center sm:items-start bg-dark-dashboard rounded-xl p-4 w-full gap-4 sm:max-h-32 fade-in-up-scroll visible`}
            >
              <div className="h-full">
                <img
                  src={match} // Placeholder image
                  alt="match capture"
                  className="object-contain max-h-[90px]"
                />
              </div>
              <div className="flex flex-col sm:flex-row w-full">
                <div className="flex flex-col gap-0.5 flex-1 py-2">
                  <p className="text-gray-text font-alt leading-5">
                    {analysis.original_filename}
                  </p>
                  <p className="text-sm text-gray-light font-alt leading-5">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </p>
                  {getStatusBadge(analysis.status)}
                </div>
                <div className="flex gap-1.5 text-xs sm:text-sm sm:self-center">
                  <button 
                    onClick={() => navigate('/analysis-results', { state: { analysisId: analysis.id } })}
                    className="rounded-lg bg-[#FFFFFF1A] px-3 py-2 sm:p-2.5 cursor-pointer hover:bg-[#FFFFFF33] transition-colors"
                  >
                    Voir détails
                  </button>
                  {analysis.status === 'completed' && (
                    <button className="rounded-lg bg-[#FFFFFF1A] px-3 py-2 sm:p-2.5 cursor-pointer hover:bg-[#FFFFFF33] transition-colors">
                      Télécharger
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Aucune vidéo analysée pour le moment.</p>
        )}
      </div>
    </div>
  );
};

/** Dashboard Page principale */
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [uploaderRef, uploaderVisible] = useInView();
  const [subscriptionRef, subscriptionVisible] = useInView();

  // Redirection si pas authentifié
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-dark text-white">Chargement...</div>;
  }
  return (
    <div className="flex h-full bg-dark overflow-hidden">
      {/* Main Content */}
      <main className="background-color-login w-full min-h-screen">
        <Logo />

        {/* Page Content - 2 Column Grid Layout */}
        <div className=" sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 sm:gap-6 ">
            {/* Left Column - Overview Section (1/3 width on desktop) */}

            <div className="flex flex-col gap-6 mt-20">
              <div
                ref={uploaderRef}
                className={`fade-in-left-scroll ${uploaderVisible ? "visible" : ""}`}
              >
                <VideoUploader 
                  quotaRemaining={user?.current_subscription?.quota_remaining}
                  planQuota={user?.current_subscription?.plan_quota}
                />
              </div>
              <div
                ref={subscriptionRef}
                className={`fade-in-left-scroll ${
                  subscriptionVisible ? "visible" : ""
                }`}
              >
                <SubscriptionManagement planTitle={user?.current_subscription?.plan_name}  videosLimit={user?.current_subscription?.plan_quota} videoRemaining={user?.current_subscription?.quota_remaining} />
              </div>
            </div>
            {/* Right Column - Stacked Components (2/3 width on desktop) */}
            <div className="lg:col-span-2">
              <OverviewSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
