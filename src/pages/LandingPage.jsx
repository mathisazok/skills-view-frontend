import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import ServiceCard from '../components/ServiceCard';
import ReviewCard from '../components/ReviewCard';
import PricingCard from '../components/PricingCard';
import { landingPageData } from '../utils/mockData';
import { useInView } from '../utils/hooks';
import subscriptionService from '../services/subscriptionService';
import database from '../assets/icon_database.png';
import notification from '../assets/icon_notification.png';
import underline from '../assets/underline_hero_title.png';
import BarChart from '../assets/bar-chart.png';
const LandingPage = () => {
  const { hero, services, features, reviews, pricing, cta,  } = landingPageData;
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);

    // Handle subscription button click (same logic as SubscriptionPricingPage)
  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      // Redirect to login with plan selection
      navigate(`/login?plan=${planId}&interval=monthly`);
      return;
    }

    // User is logged in
    const currentPlanId = user?.current_subscription?.plan_id;
    
    if (currentPlanId === planId) {
      // Same plan, show message
      alert('Vous êtes déjà abonné à ce plan');
      return;
    }

    try {
      setActionLoading(true);
      const result = await subscriptionService.changePlan(
        planId,
        'monthly'
      );
      
      // Check if we need to redirect to Stripe checkout
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
        return;
      }
      
      // Redirect to dashboard after successful plan change (Mock mode or Free plan)
      navigate('/dashboard');
    } catch (error) {
      console.error('Error changing plan:', error);
      const errorMessage = error.response?.data?.detail || 'Erreur lors du changement de plan';
      alert(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Références pour les sections avec animations
  const [heroTitleRef, heroTitleVisible] = useInView();
  const [heroButtonsRef, heroButtonsVisible] = useInView();
  const [servicesRef, servicesVisible] = useInView();
  const [featuresTitleRef, featuresTitleVisible] = useInView();
  const [featuresImageRef, featuresImageVisible] = useInView();
  const [pricingRef, pricingVisible] = useInView();
  const [reviewsRef, reviewsVisible] = useInView();
  const [ctaRef, ctaVisible] = useInView();
  const [ctaButtonsRef, ctaButtonsVisible] = useInView();

  return (
    <div className="bg-dark">
      {/* ===== HERO SECTION ===== */}
      <section className="py-12 sm:py-16 md:py-20 bg-dark px-4 sm:px-6 lg:px-10">
        <div className="lg:container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <h1 ref={heroTitleRef} className={`text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold  leading-tight sm:leading-tight md:leading-14 tracking-tighter fade-in-up-scroll  text-center ${heroTitleVisible ? 'visible' : ''}`}>
              L'analyse vidéo et les  données enfin <span className='text-primary'>accessibles</span> à <span className='text-primary'>tous les clubs</span> 
            </h1>
            <img src={underline} alt="underline hero title" className='mx-auto w-48 animate-fade-in-up animation-delay-100' />
            <p className="max-w-[750px] text-gray-300 text-base sm:text-lg text-center  mx-auto font-bold leading-6 sm:leading-7 md:leading-[22px] animate-fade-in-up animation-delay-200">
              {/* {hero.subtitle} */}
               Une plateforme tout-en-un pour analyser vos matchs,  &nbsp;
              <br className="hidden lg:block" /> 
               suivre vos joueurs et booster vos performances.
            </p>
            <div ref={heroButtonsRef} className={`w-full flex gap-2 sm:gap-4 flex-wrap justify-center     fade-in-up-scroll ${heroButtonsVisible ? 'visible' : ''}`}>
              {hero.buttons.map((btn, idx) => (
                <Button key={idx} primary={btn.primary} href={btn.link} >
                  {btn.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Content - Images */}
          <div className="relative h-64 sm:h-80 md:h-96 ">
            {/* Main Image */}
            <img
              src={hero.MainImage}
              alt="Hero"
              className="w-full h-full object-contain rounded-hero "
            />

            {/* Floating Card - Bottom Left */}
            <div className="absolute bottom-14 -left-16 bg-white rounded-[10px] p-3 shadow-xl hidden md:flex w-32 h-16  flex-col justify-center ">
              <p className=" text-xs font-alt text-gray-light mb-1">{hero.floatingCard.title}</p>
              <div className='flex justify-between items-center'>
               <p className="text-dark text-[16px] font-500 font-alt">{hero.floatingCard.value}</p>
               <img src={BarChart} alt="" />
              </div>
            </div>

            {/* Floating Images - Right */}
            <div className="absolute top-22 right-0 w-12 h-12  rounded-lg shadow-lg hidden lg:block hover-zoom animate-slide-in-right animation-delay-300">
              <img
                src={notification}
                alt="Floating"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="absolute -bottom-7 right-20 w-14 h-14  rounded-lg shadow-lg hidden lg:block hover-zoom animate-slide-in-right animation-delay-500">
              <img
                src={database}
                alt="Floating"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="services" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-dark">
        <div className="lg:container mx-auto md:px-30">
          <div className="text-center mb-8 sm:mb-12 ">
            <h2 ref={servicesRef} className={`section-title max-w-2xl mx-auto fade-in-up-scroll text-2xl sm:text-3xl md:text-4xl lg:text-[45px] ${servicesVisible ? 'visible' : ''}`}>
                Jusqu'ici, l'analyse pro était <br /> réservée à l'élite. <span className='text-primary'>Plus maintenant.</span>

            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3   gap-4  lg:gap-7 justify-items-center items-stretch">
            {services.items.map((service, idx) => (
              <ServiceCardWithAnimation key={service.id} service={service} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-dark">
        <div className="lg:container mx-auto lg:px-30 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 ref={featuresTitleRef} className={`section-title mb-4 sm:mb-6 text-center md:text-left fade-in-left-scroll text-2xl sm:text-3xl md:text-4xl lg:text-[45px] ${featuresTitleVisible ? 'visible' : ''}`}>
              Importez, analysez, <br />
              progressez.<span className="text-primary"> En 3 clics.</span> </h2>
            <p ref={featuresTitleRef} className={`text-gray-text text-sm sm:text-base md:text-[16px] leading-6 sm:leading-7 max-w-2xl text-center md:text-left fade-in-left-scroll ${featuresTitleVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>Notre technologie IA analyse vos vidéos de match automatiquement. Fini les
            heures de montage, bonjour les stats et les clips prêts à l'emploi.</p>
         
          </div>

            <img
              ref={featuresImageRef}
              src={features.image}
              alt="Features"
              className={`w-full h-auto fade-in-right-scroll ${featuresImageVisible ? 'visible' : ''}`}
            />
        </div>
      </section>
   {/* ===== PRICING SECTION ===== */}
      <section id="pricing" className="py-12 sm:py-16 md:py-20  sm:px-6 bg-dark">
        <div className="lg:container mx-auto lg:px-30">

          <div ref={pricingRef} className="grid grid-cols-1 md:grid-cols-3 justify-items-center gap-4 sm:gap-6 items-stretch">
            {pricing.items.map((plan, idx) => (
              <PricingCardWithAnimation
                key={plan.id}
                plan={plan}
                index={idx}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS SECTION =====
      <section id="reviews" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-dark">
        <div className="lg:container mx-auto lg:px-30">
          <div ref={reviewsRef} className="text-center mb-8 sm:mb-12">
            <h2 className={`section-title mb-3 fade-in-up-scroll text-2xl sm:text-3xl md:text-4xl lg:text-[45px] ${reviewsVisible ? 'visible' : ''}`}>Validé sur le terrain par des <br /> clubs comme le vôtre.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {reviews.items.map((review, idx) => (
              <ReviewCardWithAnimation key={review.id} review={review} isMiddle={idx === 1} index={idx} />
            ))}
          </div>
        </div>
      </section> */}

   
      {/* ===== CTA SECTION ===== */}
      <section ref={ctaRef} className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-dark">
        <div className="container mx-auto text-center">
          <h2 className={`section-title mb-3 sm:mb-4 fade-in-up-scroll text-2xl sm:text-3xl md:text-4xl lg:text-[45px] ${ctaVisible ? 'visible' : ''}`}>Rejoignez la nouvelle <br /> génération d'analyse sportive.</h2>
          <p className={`text-gray-text text-sm sm:text-base md:text-[16px] leading-6 sm:leading-7 max-w-2xl  mx-auto fade-in-up-scroll ${ctaVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.1s' }}>Passez au niveau supérieur. Sans effort, sans vous ruiner.</p>
          <div ref={ctaButtonsRef} className={`mt-8 sm:mt-10 md:mt-12 flex gap-2 sm:gap-4 flex-wrap justify-center fade-in-up-scroll ${ctaButtonsVisible ? 'visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
            {cta.buttons.map((btn, idx) => (
              <Button key={idx} primary={btn.primary} href={btn.link}>
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Composant wrapper pour les cartes de service avec animation
const ServiceCardWithAnimation = ({ service, index }) => {
  const [ref, isVisible] = useInView();
  return (
    <div
      ref={ref}
      className={`scale-in-scroll ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <ServiceCard
        title={service.title}
        description={service.description}
        icon={service.icon}
      />
    </div>
  );
};

// Composant wrapper pour les cartes de review avec animation
const ReviewCardWithAnimation = ({ review, isMiddle, index }) => {
  const [ref, isVisible] = useInView();
  return (
    <div
      ref={ref}
      className={`fade-in-up-scroll ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <ReviewCard
        text={review.text}
        author={review.author}
        team={review.team}
        image={review.image}
        isMiddle={isMiddle}
      />
    </div>
  );
};

// Composant wrapper pour les cartes de pricing avec animation
const PricingCardWithAnimation = ({ plan, index, onSubscribe }) => {
  const [ref, isVisible] = useInView();
  return (
    <div
      ref={ref}
      className={`scale-in-scroll ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <PricingCard
        name={plan.name}
        price={plan.price}
        period={plan.period}
        features={plan.features}
        cta={plan.cta}
        isPopular={plan.popular}
        isFree={plan.free}
        description={plan.description}
        planId={plan.id}
        onSubscribe={onSubscribe}
      />
    </div>
  );
};

export default LandingPage;