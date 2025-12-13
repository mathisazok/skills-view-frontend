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
    let interval;
    if (analysis?.status === 'processing' || analysis?.status === 'uploading' || analysis?.status === 'pending') {
      interval = setInterval(async () => {
        try {
          if (analysis?.id) {
            const data = await videoAnalysisService.getAnalysisDetails(analysis.id);
            setAnalysis(data);
            
            // Stop polling if completed or failed
            if (data.status === 'completed' || data.status === 'failed') {
              clearInterval(interval);
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
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

  // Use real data if available, otherwise fallback to empty or mocks if preferred
  // For this implementation, we'll try to map real data
  const events = analysis?.metadata?.events || [];
  
  // Transform events to clips format if needed
  const  videoClips = events.map((event, index) => ({
    id: index,
    name: event.filename || `${event.type} - Clip ${index + 1}`,
    type: event.type,
    players: event.meta_tid ? [`#${event.meta_tid}`] : [],
    url: event.url // Use individual clip URL if available
  }));

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

          {/* Video Clips Section */}
          <div className="rounded-lg p-6 mb-10 border border-[#FFFFFF1A]" style={{ backgroundColor: '#00000033' }}>
            <h3 className="text-white text-xl leading-8 traking-[-0.36px]">Clips Vidéos ({videoClips.length})</h3>
            <p className="text-gray-light text-sm mb-4 leading-6">
              Filtrez et visionnez les clips par équipe.
            </p>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
{/*            
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
            </div> */}
           
            </div>

            {/* Video Clips List - Scrollable container showing ~4 clips */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
              {videoClips.length > 0 ? (
                videoClips.map((clip) => (
                  <div
                    key={clip.id}
                    className="rounded-lg p-4 flex items-center justify-between"
                     style={{
                     backgroundColor: '#FFFFFF1A',
   
                  }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-white text-sm">{clip.name}</span>
                      {clip.players.length > 0 && (
                        <span className="text-gray-400 text-xs">({clip.players.join(', ')})</span>
                      )}
                    </div>
                    
                    {clip.url && (
                      <div className="w-48 flex flex-col gap-2">
                        {/* <video 
                          controls 
                          src={clip.url} 
                          className="w-full rounded bg-black"
                          preload="metadata"
                        /> */}
                        <a 
                          href={clip.url}
                          download={`clip_${clip.id}.mp4`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-center py-1.5 px-3 rounded bg-[#FFFFFF1A] text-white hover:bg-primary hover:text-white transition-colors"
                        >
                          Télécharger le clip
                        </a>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Aucun clip détecté ou analyse en cours.</p>
              )}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {analysis?.video_url && (
                <a 
                  href={analysis.video_url} 
                  download 
                  className="flex items-center justify-center px-6 py-2 rounded-lg font-medium text-sm transition-all bg-primary text-white h-10 cursor-pointer"
                >
                  Télécharger la vidéo
                </a>
              )}
              {analysis?.clips_zip_url && (
                <a 
                  href={analysis.clips_zip_url} 
                  download 
                  className="flex items-center justify-center px-6 py-2 rounded-lg font-medium text-sm transition-all bg-primary text-white h-10 cursor-pointer"
                >
                  Tout télécharger (ZIP)
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalysisResultsPage;
