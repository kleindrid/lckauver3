import React, { useRef } from 'react';
import { PhoneCall, Plane, Wifi } from 'lucide-react';
import { ActiveCall } from '../types/phone';

interface StatusBarProps {
  timeStr: string;
  airplaneMode: boolean;
  wifiEnabled: boolean;
  activeCall: ActiveCall | null;
  lightSurface?: boolean;
  onOpenControlCenter: () => void;
  onTapDynamicIsland: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  timeStr,
  airplaneMode,
  wifiEnabled,
  activeCall,
  lightSurface = false,
  onOpenControlCenter,
  onTapDynamicIsland,
}) => {
  const expanded = Boolean(activeCall);
  const dragStartY = useRef<number | null>(null);

  return (
    <div
      onPointerDown={(e) => {
        dragStartY.current = e.clientY;
      }}
      onPointerMove={(e) => {
        if (dragStartY.current !== null && e.clientY - dragStartY.current > 24) {
          dragStartY.current = null;
          onOpenControlCenter();
        }
      }}
      onPointerUp={() => {
        dragStartY.current = null;
      }}
      onPointerCancel={() => {
        dragStartY.current = null;
      }}
      className={`relative z-40 flex h-[48px] w-full shrink-0 touch-none items-center justify-between px-6 pt-1.5 text-[14px] font-semibold tracking-tight select-none transition-colors ${
        lightSurface ? 'text-zinc-950' : 'text-white'
      }`}
    >
      {/* Left: Time */}
      <button
        type="button"
        onClick={onOpenControlCenter}
        aria-label="Open Control Center and Help"
        className="w-[62px] text-left tabular-nums transition-opacity hover:opacity-80"
      >
        {timeStr}
      </button>

      {/* Center: Dynamic Island */}
      <button
        type="button"
        onClick={onTapDynamicIsland}
        aria-label="Dynamic Island"
        className={`flex h-[29px] items-center justify-center rounded-full bg-black transition-all duration-300 ${
          expanded ? 'min-w-[144px] gap-2 px-3' : 'w-[104px]'
        }`}
      >
        {activeCall ? (
          <>
            <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
            <span className="truncate text-[11px] font-medium text-emerald-300">
              {activeCall.name}
            </span>
          </>
        ) : null}
      </button>

      {/* Right: Signal / Airplane, Wifi, Battery */}
      <button
        type="button"
        onClick={onOpenControlCenter}
        aria-label="Open Control Center"
        className="flex min-h-[36px] min-w-[68px] items-center justify-end gap-1.5 rounded-full px-1 transition-opacity hover:opacity-80"
      >
        {airplaneMode ? (
          <Plane className={`h-3.5 w-3.5 ${lightSurface ? 'text-zinc-950' : 'text-white'}`} />
        ) : (
          <svg viewBox="0 0 18 12" className="h-[11px] w-[16px]" fill="currentColor">
            <rect x="1" y="8" width="2.5" height="4" rx="0.8" />
            <rect x="5" y="6" width="2.5" height="6" rx="0.8" />
            <rect x="9" y="3.5" width="2.5" height="8.5" rx="0.8" />
            <rect x="13" y="1" width="2.5" height="11" rx="0.8" opacity="0.35" />
          </svg>
        )}

        {!airplaneMode && wifiEnabled && <Wifi className="h-3.5 w-3.5 stroke-[2.4]" />}

        {/* Battery icon */}
        <div className="flex items-center gap-[1.5px]">
          <div
            className={`flex h-[11.5px] w-[22px] items-center rounded-[3.5px] border-[1.25px] p-[1.5px] ${
              lightSurface ? 'border-zinc-950/60' : 'border-white/65'
            }`}
          >
            <div
              className={`h-full w-[78%] rounded-[1.5px] ${
                lightSurface ? 'bg-zinc-950' : 'bg-white'
              }`}
            />
          </div>
          <div
            className={`h-[4px] w-[1.5px] rounded-r-full ${
              lightSurface ? 'bg-zinc-950/60' : 'bg-white/65'
            }`}
          />
        </div>
      </button>
    </div>
  );
};
