import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ManageSubscriptionPage from './pages/ManageSubscriptionPage';
import RecordedClipsPage from './pages/RecordedClipsPage';
import SubscriptionPricingPage from './pages/SubscriptionPricingPage';
import AnalysisResultsPage from './pages/AnalysisResultsPage';
import LegalNotice from './pages/LegalNotice';
import TermsOfUse from './pages/TermsOfUse';
import './index.css';
import SubscriptionPricingPageTwo from './pages/SubscriptionPricingPageTwo';
import ComingSoon from './pages/ComingSoon';

/**
 * Composant App principal avec routing
 */
function App() {
  
  const launchDate = new Date("2025-12-05T00:00:00"); // Date prévue du lancement
  const now = new Date();

  // if (now < launchDate) {
  //   return <ComingSoon />;
  // }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark">
        {/* Routes avec Layout component pour réduire la duplication */}
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Layout><LandingPage /></Layout>} />

          {/* Login/Signup Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Manage Subscription */}
          <Route path="/manage-subscription" element={<ManageSubscriptionPage />} />

          {/* Recorded Clips */}
          <Route path="/recorded-clips" element={<RecordedClipsPage />} />

          {/* Subscription Pricing */}
          <Route path="/pricing" element={<SubscriptionPricingPage />} />
          {/* <Route path="/pricing-2" element={<SubscriptionPricingPageTwo />} /> */}

          {/* Analysis Results */}
          <Route path="/analysis-results" element={<AnalysisResultsPage />} />

          {/* Legal Notice */}
          <Route path="/legal-notice" element={<Layout><LegalNotice /></Layout>} />

          {/* Terms of Use */}
          <Route path="/terms-of-use" element={<Layout><TermsOfUse /></Layout>} />

          {/* 404 - Page non trouvée */}
          <Route
            path="*"
            element={
              <Layout>
                <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                    <p className="text-gray-300 mb-6">Page non trouvée</p>
                    <a
                      href="/"
                      className="text-primary hover:underline font-semibold"
                    >
                      Retour à l'accueil
                    </a>
                  </div>
                </div>
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
