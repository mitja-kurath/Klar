import React from 'react';
import { Shield, Clock, Coffee } from 'lucide-react';
import { formatDuration } from '../utils/timeUtils';
import { BreakStats } from '../types';

interface StatusBarProps {
  isBlocking: boolean;
  focusTimeToday: number;
  breaksToday: BreakStats;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  isBlocking,
  focusTimeToday,
  breaksToday
}) => {
  return (
    <div className="absolute top-6 right-6 flex items-center gap-6 text-sm text-slate-400">
      <div className="flex items-center gap-2">
        <Shield className={`w-4 h-4 ${isBlocking ? 'text-emerald-400' : 'text-slate-500'}`} />
        <span>Blocking {isBlocking ? 'Active' : 'Inactive'}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-teal-400" />
        <span>{formatDuration(focusTimeToday)} focused today</span>
      </div>
      <div className="flex items-center gap-2">
        <Coffee className="w-4 h-4 text-blue-400" />
        <span>{breaksToday.taken} breaks taken</span>
      </div>
    </div>
  );
};