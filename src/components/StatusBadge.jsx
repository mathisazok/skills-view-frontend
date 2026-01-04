import React from 'react';

const StatusBadge = ({ status = 'completed' }) => {
  // Define status configurations
  const statusConfig = {
    completed: {
      label: 'Prêt',
      backgroundColor: 'bg-[#22C55E33]',
      textColor: 'text-[#86EFAC]',
      dotColor: 'bg-[#4ADE80]',
    },
    failed: {
      label: 'Échoué',
      backgroundColor: 'bg-[#EF443333]',
      textColor: 'text-[#FCA5A5]',
      dotColor: 'bg-[#F87171]',
    },
    processing: {
      label: 'Analyse en cours',
      backgroundColor: 'bg-[#FBBF2433]',
      textColor: 'text-[#FDE047]',
      dotColor: 'bg-[#FFCD34]',
    },
     
  };

  // Get config for the current status, default to 'completed'
  const config = statusConfig[status] || statusConfig.completed;

  return (
    <div className={`py-0.5 px-2 gap-1.5 ${config.backgroundColor} w-fit rounded-full flex justify-center items-center text-xs ${config.textColor}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></div>
      {config.label}
    </div>
  );
};

export default StatusBadge;
