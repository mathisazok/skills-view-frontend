import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "../utils/hooks";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import subscriptionService from "../services/subscriptionService";
const ManageSubscriptionPage = () => {
  const { user, isAuthenticated, loading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [cardRef, cardVisible] = useInView();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  const handleUpgrade = () => {
   navigate('/pricing')
  };

  const handleCancel = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler votre abonnement ? Il restera actif jusqu'à la fin de la période en cours.")) {
      try {
        await subscriptionService.cancelSubscription(false);
        await refreshUser(); // Refresh user data to show updated status
        alert("Votre abonnement a été annulé avec succès.");
      } catch (error) {
        console.error("Cancellation error:", error);
        alert("Erreur lors de l'annulation. Veuillez réessayer.");
      }
    }
  };
  
  // Check if plan is unlimited
  const isUnlimited = user?.current_subscription?.plan_name === "Ultimate" || user?.current_subscription?.plan_quota === 0;
  const usedQuota = user?.current_subscription?.quota_used || 0;
  const progressPercentage = isUnlimited ? 100 : ((usedQuota / user?.current_subscription?.plan_quota) * 100);
  
function formatDateFrench(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}



  // Check if subscription is canceled (auto_renew is false)
  const isCanceled = !user?.current_subscription?.auto_renew;
  
  return (
    <div className="min-h-screen bg-dark overflow-hidden">
      <div className="fixed">
        <Logo />
      </div>

      {/* Main Content */}
      <main className="background-color-login w-full min-h-screen flex justify-center items-center flex-col  sm:px-4 ">
       <div
            ref={cardRef}
            className={`w-full max-w-4xl rounded-xl backdrop-blur scale-90 fade-in-up-scroll ${
              cardVisible ? "visible" : ""
            }`}
            style={{
              backgroundColor: "#FFFFFF1A",
              border: "1px solid #FFFFFF1A",
              boxShadow: "0px 0px 20px 0px #0000001A",
              backdropFilter: "blur(4px)",
            }}
          >
            {/* Top Section - Subscription Info */}
            <div
              className="w-full p-4 border-b"
              style={{ borderColor: "#FFFFFF1A" }}
            >
              <div className="flex justify-between items-start font-spline">
                {/* Left Part */}
                <div className="flex flex-col ">
                  <h2 className="text-gray-light text-xs leading-5  ">
                    Votre Abonnement Actuel
                  </h2>
                  <p className="text-gray-300 text-xl leading-6 tracking-[-0.36px] ">
                    {user?.current_subscription?.plan_name}
                  </p>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${isCanceled ? 'bg-orange-500' : 'bg-[#34C759]'}`}></div>
                    <span className={`text-xs leading-5 mt-1 ${isCanceled ? 'text-orange-500' : 'text-[#33C758]'}`}>
                      {isCanceled ? 'Annulé (Expire bientôt)' : 'Actif'}
                    </span>
                  </div>
                </div>

                {/* Right Part */}
                <div className="flex flex-col gap-3 text-right">
                  <p className="text-gray-light text-sm leading-5 max-w-44 text-left">
                    {isCanceled ? 'Expire le' : 'Prochain renouvellement le'} {formatDateFrench(user?.current_subscription?.end_date)}

                  </p>
                  <p className="text-white text-lg leading-[27px] ">
                    {user?.current_subscription?.plan_price }€  <span className="text-gray-light text-base"> {user?.current_subscription?.interval === "monthly"?'/ mois' :'/ an'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar Section */}
            <div className="w-full py-5 px-4 border-b font-spline"  style={{ borderColor: "#FFFFFF1A" }}>
              <div className="flex justify-between items-center ">
                <p className="text-gray-text text-sm leading-6">
                  Nombre de matchs restants
                </p>
                <p className="text-gray-light text-sm leading-[21px]">
                  {isUnlimited 
                    ? "Illimités" 
                    : `${usedQuota}/${user?.current_subscription?.plan_quota} restants`
                  }
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#FFFFFF33] rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3  justify-between items-center text-spline p-4">
                <div className="flex items-center gap-3">

                <p className="text-sm text-gray-text cursor-pointer"> <span className="ml-1">Voir les moyens de paiement</span></p>
                <p  className="text-sm text-gray-text cursor-pointer" > <span className="ml-1">Historique de facturation</span> </p>
                </div>
                 <div className="flex flex-wrap justify-center sm:justify-start sm:flex-nowrap items-center gap-3">
              <button
                onClick={handleCancel}
                disabled={isCanceled}
                className={`w-full sm:w-50 h-12 px-5 text-white text-sm rounded-lg leading-6 traking-[0.24px] ${isCanceled ?'cursor-not-allowed' : 'cursor-pointer'} transition-all ${
                  isCanceled 
                    ? "bg-[#FFFFFF1A] opacity-50 cursor-not-allowed" 
                    : "bg-[#FFFFFF33] hover:bg-[#FFFFFF4D]"
                }`}
              >
                {isCanceled ? "Annulation demandée" : "Annuler l'Abonnement"}
              </button>
              
              <button
                onClick={handleUpgrade}
                className="w-full  sm:w-50 h-12 px-5 bg-primary text-dark  text-sm rounded-lg leading-6 traking-[0.24px] cursor-pointer"
              >
                Changer d'Abonnem…
              </button>
            </div>
            </div>
          </div>
      </main>
    </div>
  );
};

export default ManageSubscriptionPage;
