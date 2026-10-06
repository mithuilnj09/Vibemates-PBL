import React from 'react';

const MatchBadge = ({ score = 85, size = 'md', showLabel = true, className = '' }) => {
  // Determine dimensions based on size
  const dim = size === 'lg' ? 76 : size === 'sm' ? 44 : 58;
  const strokeWidth = size === 'lg' ? 6 : size === 'sm' ? 4 : 5;
  const radius = (dim - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color scheme based on match score
  let strokeColor = '#7C3AED'; // brand purple
  let bgColor = 'text-purple-100';
  let textColor = 'text-purple-700';

  if (score >= 90) {
    strokeColor = '#10B981'; // emerald green
    bgColor = 'text-emerald-100';
    textColor = 'text-emerald-700';
  } else if (score >= 80) {
    strokeColor = '#6366F1'; // indigo
    bgColor = 'text-indigo-100';
    textColor = 'text-indigo-700';
  } else if (score >= 70) {
    strokeColor = '#8B5CF6'; // violet
    bgColor = 'text-violet-100';
    textColor = 'text-violet-700';
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={dim} height={dim} className="transform -rotate-90">
        {/* Background track circle */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={`${bgColor} fill-transparent`}
        />
        {/* Foreground animated value circle */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out fill-transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className={`font-bold font-display ${
            size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-xs' : 'text-sm'
          } ${textColor}`}
        >
          {score}%
        </span>
        {showLabel && size === 'lg' && (
          <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 -mt-1">
            Match
          </span>
        )}
      </div>
    </div>
  );
};

export default MatchBadge;
