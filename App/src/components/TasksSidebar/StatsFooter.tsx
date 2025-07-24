import { formatDuration } from '../../utils/timeUtils';
import { BreakStats } from '../../types';

interface StatsFooterProps {
  focusTimeToday: number;
  breaksToday: BreakStats;
}

export const StatsFooter: React.FC<StatsFooterProps> = ({
  focusTimeToday,
  breaksToday
}) => {
  return (
    <div className="p-6 border-t border-slate-700/50 bg-slate-800/20">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-2xl font-semibold text-teal-400">
            {formatDuration(focusTimeToday)}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wide">
            Focused Today
          </div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-blue-400">
            {breaksToday.taken}/{breaksToday.taken + breaksToday.missed}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wide">
            Breaks Taken
          </div>
        </div>
      </div>
    </div>
  );
};