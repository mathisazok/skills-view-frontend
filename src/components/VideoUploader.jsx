import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import videoAnalysisService from "../services/videoAnalysisService";
import ProcessingModal from "./ProcessingModal";

import { useAuth } from "../context/AuthContext";

const VideoUploader = ({ quotaRemaining, planQuota }) => {
  const { refreshUser } = useAuth();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const pollIntervalRef = useRef(null);

  // State for modal
  const [modalStatus, setModalStatus] = useState(null); // pending, uploading, processing, completed, failed
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [analysisId, setAnalysisId] = useState(null);
  const [videoSizeBytes, setVideoSizeBytes] = useState(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, []);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      await handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    // 1. Check Quota
    // If planQuota is 0, it means unlimited 
    // but usually 0 means unlimited in some systems, or we check if quotaRemaining > 0).
    // Assuming planQuota > 0 means limited plan.
    if (planQuota > 0 && quotaRemaining <= 0) {
      alert("Quota épuisé ! Veuillez mettre à jour votre abonnement pour analyser plus de vidéos.");
      return;
    }

    // 2. Start Upload
    setModalStatus('uploading');
    setProgress(10);
    setMessage("Upload de la vidéo en cours...");
    setVideoSizeBytes(file.size);

    try {
      // Upload video
      const response = await videoAnalysisService.uploadVideo(file);
      setAnalysisId(response.id);
      
      // 3. Start Polling
      setModalStatus('processing');
      setProgress(30);
      setMessage("Analyse intelligente en cours...");
      
      startPolling(response.id);

    } catch (error) {
      console.error("Upload error:", error);
      setModalStatus('failed');
      setMessage(error.response?.data?.error || "Erreur lors de l'upload.");
    }
  };

  const startPolling = (id) => {
    // Clear any existing interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    pollIntervalRef.current = setInterval(async () => {
      try {
        const statusData = await videoAnalysisService.getAnalysisStatus(id);

        if (statusData.status === 'completed') {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          setModalStatus('completed');
          setProgress(100);
          setMessage("Analyse terminée avec succès !");

          // Refresh user data (quota) immediately
          await refreshUser();

          // Redirect after short delay
          setTimeout(() => {
            navigate('/analysis-results', { state: { analysisId: id } });
          }, 1500);

        } else if (statusData.status === 'failed') {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          setModalStatus('failed');
          setMessage(statusData.error_message || "L'analyse a échoué.");
        } else {
          // Still processing
          // Increment progress artificially to show activity
          setProgress(prev => Math.min(prev + 5, 90));
        }
      } catch (error) {
        console.error("Polling error:", error);
        // Don't stop polling immediately on network error, might be temporary
      }
    }, 5000); // Poll every 5 seconds
  };

  const handleCloseModal = () => {
    setModalStatus(null);
    setProgress(0);
    setMessage("");
  };

  return (
    <>
      <div
        className="scale-90 w-full h-60 border-2 border-dashed rounded-xl px-6 py-11 transition-colors hover:border-primary/50"
        style={{
          borderColor: "#4B5563",
          backgroundColor: "#1F2937CC",
          borderDasharray: "6,4",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-2">
          {/* Main Title */}
          <h2 className="text-gray-text font-spline font-normal leading-[22.5px] tracking-[-0.27px]">
            Importer une vidéo
          </h2>

          {/* Secondary Description */}
          <p className="text-sm text-gray-light max-w-[405px] font-spline font-normal text-center leading-[21px] ">
            Glissez-déposez un fichier ici ou parcourez vos fichiers. Formats
            supportés: MP4, MOV.
          </p>

          {/* Upload Button */}
          <button
            onClick={handleBrowseClick}
            className="cursor-pointer w-44 h-10 bg-primary text-dark rounded-lg px-3.5 font-spline text-sm leading-[21px] mt-3 hover:bg-primary/90 transition-colors"
          >
            Parcourir les fichiers
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/x-matroska,video/avi"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Processing Modal */}
      {modalStatus && (
        <ProcessingModal
          status={modalStatus}
          progress={progress}
          message={message}
          onClose={handleCloseModal}
          videoSizeBytes={videoSizeBytes}
        />
      )}
    </>
  );
};

export default VideoUploader;
