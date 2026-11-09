import React from 'react';

interface InfoCardProps {
  title: string;
  description: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
      <strong className="text-blue-300 block mb-1">{title}</strong>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
};
