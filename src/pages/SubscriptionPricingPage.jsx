import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "../utils/hooks";
import { useAuth } from "../context/AuthContext";
import subscriptionService from "../services/subscriptionService";
import LogoLanding from "../components/LogoLandingPage";

const SubscriptionPricingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [cardRef, cardVisible] = useInView();
  const [billingType, setBillingType] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await subscriptionService.getPlans();
        setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
        // Fallback to hardcoded plans if API fails
        setPlans(pricingPlans);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePlanClick = async (plan) => {
    console.log('🎯 [SUBSCRIPTION] Button clicked', {
      planId: plan.id,
      planName: plan.name,
      billingType,
      isAuthenticated
    });

    if (!isAuthenticated) {
      console.log('❌ [SUBSCRIPTION] User not authenticated, redirecting to login');
      navigate(`/login?plan=${plan.id}&interval=${billingType}`);
      return;
    }

    // User is logged in
    const currentPlanId = user?.current_subscription?.plan_id;
    console.log('👤 [SUBSCRIPTION] User info', {
      currentPlanId,
      requestedPlanId: plan.id,
      user: user
    });

    if (currentPlanId === plan.id) {
      console.log('⚠️ [SUBSCRIPTION] User already subscribed to this plan');
      alert('Vous êtes déjà abonné à ce plan');
      return;
    }

    try {
      setActionLoading(true);
      console.log('📤 [SUBSCRIPTION] Calling subscriptionService.changePlan', {
        planId: plan.id,
        interval: billingType
      });

      const result = await subscriptionService.changePlan(
        plan.id,
        billingType
      );

      console.log('📥 [SUBSCRIPTION] API Response received', result);

      // Check if we need to redirect to Stripe checkout
      if (result.checkout_url) {
        console.log('💳 [SUBSCRIPTION] Redirecting to Stripe checkout', result.checkout_url);
        window.location.href = result.checkout_url;
        return;
      }

      // Redirect to dashboard after successful plan change (Mock mode or Free plan)
      console.log('✅ [SUBSCRIPTION] Success! Redirecting to dashboard (no checkout_url)');
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ [SUBSCRIPTION] Error caught:', error);
      console.error('❌ [SUBSCRIPTION] Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      const errorMessage = error.response?.data?.detail || 'Erreur lors du changement de plan';
      alert(errorMessage);
    } finally {
      setActionLoading(false);
      console.log('🏁 [SUBSCRIPTION] Process completed');
    }
  };

 const pricingPlans =  [
      {
        id: 1,
        name: 'Free',
        description:'Idéale pour découvrir SkillsView et tester ses fonctionnalités.',
         monthlyPrice: 0,
         annualPrice: 0,
         period: 'par mois',
  
        features: [
          'Import jusqu\'à 1 match/mois',
          'Découpage automatique',
          'Statistiques globale',
          'Espace personnel.',
          'Support limité.',
        ],
        cta: 'Souscrire',
        free:true ,
        highlighted: false,

      },
      {
        id: 2,
        name: 'Professional',
        description:'Pour les clubs réguliers souhaitant un suivi plus complet et des analyses approfondies.',
         monthlyPrice: 19,
        annualPrice: 199,
        period: 'par mois',
        features: [
          'Import jusqu\'à 3 matchs/mois',
          'Classification des actions ',
          'Statistique individuel.',
          'Visualisation dynamique.',
          'Support prioritaire.',
        ],
        cta: 'Souscrire',
        highlighted: true,

        
      },
      {
        id: 3,
        name: 'Ultimate',
        description:"Pour les clubs réguliers souhaitant un suivi professionel et personnalisé.",
        period: 'par mois',
        annualPrice: 421,
         monthlyPrice: 39,
        features: [
          'Import ilimités',
          'Annotation des actions.',
          'Statistiques avancés.',
          'Mode collaboratif.',
          'Assistance téléphonique.',
        ],
        cta: 'Souscrire',
        highlighted:false,
      }
    ] 
  const getCurrentPrice = (plan) => {
    return billingType === "monthly" ? plan.monthlyPrice : plan.annualPrice;
  };

  const getSavings = (plan) => {
    if (billingType === "monthly") return null;
    const monthlyCost = plan.monthlyPrice * 12;
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
                ? "bg-primary text-white"
                : "text-gray-light hover:text-white cursor-pointer"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingType("yearly")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              billingType === "yearly"
                ? "bg-primary text-white"
                : "text-gray-light hover:text-white cursor-pointer"
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
            <h1 className="text-white text-5xl font-extrabold mb-2 text-center mx-auto traking-[-1.2px] mt-4">
              Chez <span className="text-primary">SkillsView </span>, nous vous proposons <br /> une  <span className="text-primary"> multitude d’offre </span>
            </h1>
          </div>
        </div>

        {/* Pricing Cards */}
        <div
          ref={cardRef}
          className={`w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 fade-in-up-scroll ${
            cardVisible ? "visible" : ""
          }`}
        >
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`rounded-xl p-8 transition-all ${
                plan.highlighted
                  ? "bg-linear-to-b from-[#00000066] to-[#00000033] border-2 border-primary scale-105"
                  : "bg-[#00000033] border border-[#FFFFFF1A]"
              }`}
            >
              {/* Plan Badge */}
              {plan.highlighted && (
                <div className="mb-4 inline-block">
                  <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    RECOMMANDÉ
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h2 className="text-white text-2xl font-bold mb-2">
                {plan.name}
              </h2>
              <p className="text-gray-light text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-white text-4xl font-bold">
                    {getCurrentPrice(plan).toFixed(2)}€
                  </span>
                  <span className="text-gray-light text-sm">
                    {billingType === "monthly" ? "/mois" : "/an"}
                  </span>
                </div>
                {!isNaN(getSavings(plan)) && getSavings(plan)  && (
                  <p className="text-primary text-sm font-semibold">
                    💰 Économisez {getSavings(plan)}% avec l'annuel
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanClick(plan)}
                disabled={actionLoading || loading}
                className={`w-full py-3 rounded-lg font-medium mb-8 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.highlighted
                    ? "bg-primary text-white hover:bg-green-600"
                    : "bg-[#FFFFFF1A] text-white hover:bg-[#FFFFFF33]"
                }`}
              >
                {actionLoading ? 'Chargement...' : plan.cta}
              </button>

              {/* Features List */}
              <div className="border-t border-[#FFFFFF1A] pt-6">
                <p className="text-white text-sm font-semibold mb-4">
                  Inclus dans ce plan:
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-primary shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-light text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="w-full max-w-4xl mt-20">
          <h3 className="text-white text-2xl font-bold mb-8 text-center">
            Questions Fréquentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Puis-je changer de plan à tout moment?",
                answer:
                  "Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements seront appliqués au prochain cycle de facturation.",
              },
              {
                question: "Y a-t-il une période d'essai gratuite?",
                answer:
                  "Oui! Tous les nouveaux utilisateurs bénéficient de 14 jours d'accès gratuit à la version Professional.",
              },
              {
                question: "Quels sont les modes de paiement acceptés?",
                answer:
                  "Nous acceptons les cartes de crédit (Visa, Mastercard), PayPal et les virements bancaires.",
              },
              {
                question: "Qu'en est-il de l'annulation?",
                answer:
                  "Vous pouvez annuler à tout moment. Votre accès continuera jusqu'à la fin de votre période de facturation actuelle.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#00000033] rounded-lg p-6 border border-[#FFFFFF1A]"
              >
                <h4 className="text-white font-semibold mb-3">
                  {item.question}
                </h4>
                <p className="text-gray-light text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPricingPage;
