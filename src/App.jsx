import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

/**
 * Composant App principal avec routing
 */
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark">
        {/* Routes avec Navbar et Footer */}
        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="grow">
                  <LandingPage />
                </main>
                <Footer />
              </>
            }
          />

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
          <Route
            path="/legal-notice"
            element={
              <>
                <Navbar />
                <main className="grow">
                  <LegalNotice />
                </main>
                <Footer />
              </>
            }
          />

          {/* Terms of Use */}
          <Route
            path="/terms-of-use"
            element={
              <>
                <Navbar />
                <main className="grow">
                  <TermsOfUse />
                </main>
                <Footer />
              </>
            }
          />

          {/* 404 - Page non trouvée */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="grow flex items-center justify-center">
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
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
