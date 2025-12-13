import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ProcessingModal = ({ status, progress, message, onClose, videoSizeBytes }) => {
  const [show, setShow] = useState(false);

  // Calculate estimated time: 200MB = ~2 hours = 120 minutes
  const getEstimatedTime = () => {
    if (!videoSizeBytes) return null;
    const sizeInMB = videoSizeBytes / (1024 * 1024);
    const estimatedMinutes = Math.round((sizeInMB / 200) * 120);
    
    // Cap at 10 hours
    if (estimatedMinutes >= 600) {
      return "+10h";
    }
    
    if (estimatedMinutes < 60) {
      return `~${estimatedMinutes} min`;
    } else {
      const hours = Math.floor(estimatedMinutes / 60);
      const mins = estimatedMinutes % 60;
      return mins > 0 ? `~${hours}h ${mins}min` : `~${hours}h`;
    }
  };

  useEffect(() => {
    setShow(true);
    return () => setShow(false);
  }, []);

  if (!status) return null;

  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      default: return 'text-primary';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
          </div>
        );
    }
  };

  const estimatedTime = getEstimatedTime();

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-dark-dashboard border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon */}
          <div className="mb-2">
            {getStatusIcon()}
          </div>

          {/* Title */}
          <h3 className={`text-2xl font-bold ${getStatusColor()}`}>
            {status === 'pending' && 'En attente...'}
            {status === 'uploading' && 'Upload en cours...'}
            {status === 'processing' && 'Analyse en cours...'}
            {status === 'completed' && 'Analyse terminée !'}
            {status === 'failed' && 'Échec de l\'analyse'}
          </h3>

          {/* Message */}
          <p className="text-gray-300 text-lg">
            {message || 'Veuillez patienter pendant que nous traitons votre vidéo.'}
          </p>

          {/* Estimated Time (during processing) */}
          {status === 'processing' && estimatedTime && (
            <p className="text-gray-400 text-sm">
              ⏱️ Temps estimé : <span className="text-primary font-semibold">{estimatedTime}</span>
            </p>
          )}

          {/* Progress Bar (for processing) */}
          {(status === 'processing' || status === 'uploading') && (
            <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Close Button (only if failed or completed) */}
          {(status === 'completed' || status === 'failed') && (
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProcessingModal;
