import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInView } from '../utils/hooks';
import Logo from '../components/Logo';
import videoAnalysisService from '../services/videoAnalysisService';

const AnalysisResultsPage = () => {
  const [containerRef, containerVisible] = useInView();
  const [selectedTeam, setSelectedTeam] = useState('Équipe A');
  const [selectedGroup, setSelectedGroup] = useState('Collectif');
  
  const location = useLocation();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const analysisId = location.state?.analysisId;
      
      if (!analysisId) {
        // If no ID provided, maybe fetch latest or show empty state
        // For now, we'll just stop loading
        setLoading(false);
        return;
      }

      try {
        const data = await videoAnalysisService.getAnalysisDetails(analysisId);
        setAnalysis(data);
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setError("Impossible de charger l'analyse.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [location.state]);

  // Polling for status updates if processing
  useEffect(() => {
    let interval = null;
    let isMounted = true;

    const pollStatus = async () => {
      if (!isMounted || !analysis?.id) return;

      try {
        const data = await videoAnalysisService.getAnalysisDetails(analysis.id);
        if (isMounted) {
          setAnalysis(data);

          // Stop polling if completed or failed
          if (data.status === 'completed' || data.status === 'failed') {
            if (interval) {
              clearInterval(interval);
              interval = null;
            }
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    if (analysis?.status === 'processing' || analysis?.status === 'uploading' || analysis?.status === 'pending') {
      interval = setInterval(pollStatus, 5000);
    }

    return () => {
      isMounted = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [analysis?.status, analysis?.id]);

  const handleDownloadPDF = async () => {
    if (!analysis?.id || !analysis?.metadata?.reports) return;
    
    // Map selection to report filename pattern
    let targetFilename = 'Home_COMPREHENSIVE_REPORT.pdf';
    if (selectedTeam === 'Équipe B') {
      targetFilename = 'Away_COMPREHENSIVE_REPORT.pdf';
    }
    
    // Find the PDF in metadata.reports
    const reports = analysis.metadata.reports || [];
    const targetReport = reports.find(report => 
      report.filename && report.filename.toLowerCase() === targetFilename.toLowerCase()
    );
    
    if (!targetReport || !targetReport.url) {
      // Fallback: try other filename formats
      const alternativeNames = [
        `${selectedTeam === 'Équipe B' ? 'Away' : 'Home'}_report.pdf`,
        `${selectedTeam === 'Équipe B' ? 'Team' : 'Team'}_report.pdf`
      ];
      
      const fallbackReport = reports.find(report =>
        alternativeNames.some(name => report.filename?.toLowerCase() === name.toLowerCase())
      );
      
      if (!fallbackReport) {
        alert(`PDF non trouvé. Rapports disponibles: ${reports.map(r => r.filename).join(', ')}`);
        return;
      }
      
      // Download fallback
      const link = document.createElement('a');
      link.href = fallbackReport.url;
      link.download = fallbackReport.filename || 'report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    // Download directly from Cloudinary
    const link = document.createElement('a');
    link.href = targetReport.url;
    link.download = targetReport.filename || targetFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`Downloaded PDF: ${targetReport.filename}`);
  };

  const handleDownloadZIP = async () => {
    if (!analysis?.id) return;
    
    try {
      const response = await videoAnalysisService.downloadZIP(analysis.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analysis_${analysis.id}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading ZIP:', error);
      alert('Erreur lors du téléchargement du ZIP');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center text-white">
        Chargement de l'analyse...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // Removed video clips section as per user request

  return (
      <div className="min-h-screen bg-dark overflow-hidden ">
      <div className="fixed">
        <Logo />
      </div>

      {/* Main Content */}
      <main className="background-color-login w-full min-h-screen flex justify-center items-center flex-col  px-4 pt-16 ">

            <h1 className="text-white  text-2xl leading-6 sm:leading-7 sm:text-4xl font-extrabold  text-center mx-auto traking-[-1.2px] mt-4  sm:mb-10">
              Merci d’avoir utilisé SkillsView, <br />voici <span className="text-primary">votre analyse </span>
            </h1>
        {/* Main Container */}
        <div
          ref={containerRef}
          className={`max-w-4xl mx-auto w-full space-y-6 fade-in-up-scroll scale-95 ${
            containerVisible ? 'visible' : ''
          }`}
        >
          {/* Detailed Analysis Section */}
          <div className="rounded-lg p-6 border border-[#FFFFFF1A]" style={{ backgroundColor: '#00000033' }}>
            <h3 className="text-gray-text text-lg tracking-[-0.36px]">Votre Analyse Détaillée</h3>
            <p className="text-gray-light text-sm mb-4 leading-6">
              {analysis ? `Fichier: ${analysis.original_filename}` : "Sélectionnez une équipe pour télécharger l'analyse PDF correspondante."}
            </p>
        <div className="flex w-full flex-col sm:flex-row  justify-between sm:items-end gap-4">
            <div className=" flex flex-col flex-1 items-start gap-1.5">
              <label className="text-white text-sm leading-6 ">Équipe</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full  h-10 px-4 rounded-lg text-white text-sm"
                style={{
                   backgroundColor: '#FFFFFF1A',
                   borderTop: '1px solid #FFFFFF33',
                   border: '1px solid #FFFFFF33',
                }}
              >
                <option value="Équipe A">Équipe A</option>
                <option value="Équipe B">Équipe B</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleDownloadPDF}
                disabled={!analysis || analysis.status !== 'completed'}
                className="px-6 py-2 rounded-lg font-medium text-sm transition-all bg-primary text-white h-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Télécharger le PDF
              </button>
              <button 
                onClick={handleDownloadZIP}
                disabled={!analysis?.clips_zip_url}
                className="px-6 py-2 rounded-lg font-medium text-sm transition-all bg-primary text-white h-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Télécharger le ZIP
              </button>
            </div>
                </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalysisResultsPage;
