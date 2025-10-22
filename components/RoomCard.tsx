import React, { useState, useMemo } from 'react';
import { KTVRoom, RoomStatus, SessionType } from '../types';
import { useTimer } from '../hooks/useTimer';
import { PlayIcon, PauseIcon, StopIcon, BroomIcon, CheckIcon } from './Icons';

interface RoomCardProps {
  room: KTVRoom;
  onUpdateRoom: (updatedRoom: KTVRoom) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onUpdateRoom }) => {
  const { formattedTime, elapsedTime, isActive, start, pause, stop } = useTimer(room.session.elapsedTime);
  const [sessionType, setSessionType] = useState<SessionType>(room.session.type);
  const [rate, setRate] = useState(room.session.rate);
  const isCleaning = room.status === RoomStatus.Cleaning;
  
  const billingAmount = useMemo(() => {
    if (sessionType === SessionType.Hourly) {
      const hours = elapsedTime / 3600;
      return (hours * rate).toFixed(2);
    }
    return rate.toFixed(2);
  }, [elapsedTime, rate, sessionType]);

  const handleStart = () => {
    start();
    onUpdateRoom({ ...room, status: RoomStatus.InUse, session: { ...room.session, isActive: true, elapsedTime } });
  };
  
  const handlePause = () => {
    pause();
    onUpdateRoom({ ...room, session: { ...room.session, isActive: false, elapsedTime } });
  };
  
  const handleStop = () => {
    stop();
    onUpdateRoom({ ...room, status: RoomStatus.Available, session: { ...room.session, isActive: false, elapsedTime: 0 } });
  };

  const handleSetCleaning = () => {
    if (isActive) stop();
    onUpdateRoom({ ...room, status: RoomStatus.Cleaning, session: { ...room.session, isActive: false, elapsedTime: 0 } });
  };
  
  const handleSetAvailable = () => {
    onUpdateRoom({ ...room, status: RoomStatus.Available });
  };

  const statusStyles = {
    [RoomStatus.Available]: {
      border: 'border-green-500',
      textBg: 'bg-green-500/20 text-green-400',
      shadow: 'hover:shadow-neon-green'
    },
    [RoomStatus.InUse]: {
      border: 'border-brand-secondary',
      textBg: 'bg-brand-secondary/20 text-brand-secondary',
      shadow: 'hover:shadow-neon-secondary'
    },
    [RoomStatus.Cleaning]: {
      border: 'border-yellow-500',
      textBg: 'bg-yellow-500/20 text-yellow-400',
      shadow: 'hover:shadow-neon-yellow'
    },
  };

  return (
    <div className={`bg-brand-surface rounded-lg p-6 border-t-4 ${statusStyles[room.status].border} ${statusStyles[room.status].shadow} flex flex-col justify-between transition-all duration-300 hover:-translate-y-1`}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-brand-text">{room.name}</h3>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[room.status].textBg}`}>
            {room.status}
          </span>
        </div>

        {isCleaning ? (
            <div className="text-center my-6 flex flex-col items-center justify-center min-h-[260px]">
                <BroomIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4"/>
                <p className="text-yellow-400 font-semibold">Room Cleaning</p>
                <p className="text-sm text-brand-text-secondary">Not available for booking</p>
            </div>
        ) : (
            <>
                <div className="text-center my-6">
                <p className="text-5xl font-mono tracking-widest text-brand-accent">{formattedTime}</p>
                <p className="text-sm text-brand-text-secondary">Session Time</p>
                </div>
                
                <div className="flex justify-center items-center space-x-4 mb-6">
                <button onClick={handleStart} disabled={isActive} className="p-3 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <PlayIcon className="w-6 h-6" />
                </button>
                <button onClick={handlePause} disabled={!isActive} className="p-3 rounded-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <PauseIcon className="w-6 h-6" />
                </button>
                <button onClick={handleStop} disabled={!isActive && elapsedTime === 0} className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <StopIcon className="w-6 h-6" />
                </button>
                </div>

                <div className="space-y-4">
                <div>
                    <label className="text-xs text-brand-text-secondary block mb-1">Session Type</label>
                    <select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value as SessionType)}
                    disabled={isActive}
                    className="w-full bg-brand-bg border border-brand-primary/30 rounded-md px-3 py-2 text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
                    >
                    <option value={SessionType.Hourly}>Hourly</option>
                    <option value={SessionType.FlatRate}>Flat Rate</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs text-brand-text-secondary block mb-1">{sessionType === SessionType.Hourly ? 'Rate per Hour ($)' : 'Flat Rate ($)'}</label>
                    <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    disabled={isActive}
                    className="w-full bg-brand-bg border border-brand-primary/30 rounded-md px-3 py-2 text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
                    />
                </div>
                </div>
            </>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/10">
        {room.status === RoomStatus.InUse && (
            <div className="text-center">
                <p className="text-lg text-brand-text-secondary">Real-time Billing</p>
                <p className="text-3xl font-bold text-brand-primary">${billingAmount}</p>
            </div>
        )}
        {room.status === RoomStatus.Available && (
             <button
                onClick={handleSetCleaning}
                className="w-full flex items-center justify-center space-x-2 bg-yellow-500/20 text-yellow-400 font-semibold py-2 px-4 rounded-md hover:bg-yellow-500/40 transition-colors"
            >
                <BroomIcon className="w-5 h-5" />
                <span>Mark for Cleaning</span>
            </button>
        )}
        {isCleaning && (
            <button
                onClick={handleSetAvailable}
                className="w-full flex items-center justify-center space-x-2 bg-green-500/20 text-green-400 font-semibold py-2 px-4 rounded-md hover:bg-green-500/40 transition-colors"
            >
                <CheckIcon className="w-5 h-5" />
                <span>Mark as Available</span>
            </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;