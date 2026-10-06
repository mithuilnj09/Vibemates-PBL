import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ScheduleMatrix = ({ availableDays = [], availableTimeSlots = [], compact = false }) => {
  const normalizedDays = (availableDays || []).map((d) => d.toLowerCase());

  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-navy-600">
          <Calendar className="w-3.5 h-3.5 text-brand-600" />
          <span className="font-medium">Days:</span>
          <div className="flex items-center gap-1">
            {FULL_DAYS.map((fullDay, idx) => {
              const active = normalizedDays.includes(fullDay.toLowerCase());
              return (
                <span
                  key={fullDay}
                  className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-medium ${
                    active
                      ? 'bg-brand-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                  title={fullDay}
                >
                  {DAYS[idx][0]}
                </span>
              );
            })}
          </div>
        </div>

        {availableTimeSlots && availableTimeSlots.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-navy-600 truncate">
            <Clock className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span className="font-medium flex-shrink-0">Time:</span>
            <span className="truncate text-slate-600">
              {availableTimeSlots.slice(0, 2).join(', ')}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-600" />
          <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
            Weekly Study Availability
          </span>
        </div>
        <span className="text-xs text-brand-600 font-semibold">
          {availableDays.length} days active
        </span>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center mb-3">
        {FULL_DAYS.map((fullDay, idx) => {
          const isFree = normalizedDays.includes(fullDay.toLowerCase());
          return (
            <div
              key={fullDay}
              className={`py-2 px-1 rounded-xl text-center transition-all ${
                isFree
                  ? 'bg-brand-600 text-white shadow-sm shadow-purple-500/20 ring-1 ring-brand-700'
                  : 'bg-white text-slate-400 border border-slate-200/60'
              }`}
            >
              <div className="text-[11px] font-bold">{DAYS[idx]}</div>
              <div className="mt-1 flex justify-center">
                {isFree ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slots chips */}
      <div className="pt-2 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Clock className="w-3.5 h-3.5 text-brand-500" />
          <span>Preferred Study Windows:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {availableTimeSlots && availableTimeSlots.length > 0 ? (
            availableTimeSlots.map((slot) => (
              <span
                key={slot}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200/60"
              >
                <CheckCircle className="w-3 h-3 text-brand-600" />
                {slot}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">Flexible timing</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleMatrix;
