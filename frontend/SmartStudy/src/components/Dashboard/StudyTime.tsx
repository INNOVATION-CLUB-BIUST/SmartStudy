
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw, BookOpen, Target, Plus, ChevronDown } from 'lucide-react';

const StudyTime = () => {
  const [timer, setTimer] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  const [sessionCount, setSessionCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (timer === 0) {
      setIsActive(false);
      // Handle session completion logic here
      if (sessionType === 'pomodoro') {
        setSessionCount(prev => prev + 1);
        if ((sessionCount + 1) % 4 === 0) {
          setSessionType('longBreak');
          setTimer(15 * 60);
        } else {
          setSessionType('shortBreak');
          setTimer(5 * 60);
        }
      } else {
        setSessionType('pomodoro');
        setTimer(25 * 60);
      }
    }
  }, [timer, sessionType, sessionCount]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (sessionType === 'pomodoro') setTimer(25 * 60);
    else if (sessionType === 'shortBreak') setTimer(5 * 60);
    else setTimer(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionTypeName = () => {
    if (sessionType === 'pomodoro') return 'Pomodoro';
    if (sessionType === 'shortBreak') return 'Short Break';
    return 'Long Break';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Study Timer</h1>
          <p className="text-slate-300 mt-2">Focus on your tasks with the Pomodoro technique</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timer Column */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-orange-500/20 rounded-xl p-8 flex flex-col items-center justify-center">
            <div className='flex items-center space-x-4 mb-6'>
                <button onClick={() => { setSessionType('pomodoro'); setTimer(25*60); setIsActive(false); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${sessionType === 'pomodoro' ? 'bg-orange-500 text-black' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Pomodoro</button>
                <button onClick={() => { setSessionType('shortBreak'); setTimer(5*60); setIsActive(false);}} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${sessionType === 'shortBreak' ? 'bg-orange-500 text-black' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Short Break</button>
                <button onClick={() => { setSessionType('longBreak'); setTimer(15*60); setIsActive(false);}} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${sessionType === 'longBreak' ? 'bg-orange-500 text-black' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>Long Break</button>
            </div>

          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-slate-900"></div>
            <div className="absolute inset-2 rounded-full bg-slate-800"></div>
            <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle className="stroke-current text-slate-700" strokeWidth="4" cx="50" cy="50" r="46" fill="transparent"></circle>
                <circle
                    className="stroke-current text-orange-500 transition-all duration-1000"
                    strokeWidth="4"
                    strokeDasharray={`${(timer / (sessionType === 'pomodoro' ? 25 * 60 : sessionType === 'shortBreak' ? 5*60 : 15*60)) * 289.027} 289.027`}
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="46"
                    fill="transparent"
                    transform="rotate(-90 50 50)"
                ></circle>
            </svg>
            <div className="relative z-10 text-center">
              <h2 className="text-6xl font-bold text-white">{formatTime(timer)}</h2>
              <p className="text-slate-400">{getSessionTypeName()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-8">
            <button onClick={toggleTimer} className="w-24 h-24 flex items-center justify-center bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold rounded-full text-2xl hover:from-orange-400 hover:to-yellow-400 transition-all duration-300">
              {isActive ? <Pause size={40} /> : <Play size={40} />}
            </button>
            <button onClick={resetTimer} className="p-4 text-slate-400 hover:text-white transition-colors duration-300">
              <RotateCw size={24} />
            </button>
          </div>
        </div>

        {/* Controls & Stats Column */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Session Settings</h3>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Task / Subject</label>
                    <div className="relative">
                        <select className="w-full pl-3 pr-10 py-2 bg-slate-700 border border-orange-500/30 rounded-lg text-white text-sm focus:border-orange-500 appearance-none">
                            <option>Select a task...</option>
                            <option>Quantum Physics</option>
                            <option>Calculus Practice</option>
                            <option>Final Project</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                </div>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-orange-500 hover:text-orange-500 transition-all duration-300">
                    <Plus className="h-4 w-4" />
                    <span>Add New Task</span>
                </button>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Today's Goal</h3>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Pomodoros Completed</span>
                <span className="text-sm text-orange-400 font-bold">{sessionCount} / 8</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full">
                <div
                className="h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-300"
                style={{ width: `${(sessionCount / 8) * 100}%` }}
                ></div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Session Log</h3>
            <div className="space-y-3 h-40 overflow-y-auto">
                {sessionCount === 0 && <p className='text-slate-400 text-sm'>No sessions completed yet.</p>}
                {[...Array(sessionCount)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-orange-400" />
                            <span className="text-slate-300">Session {i+1}</span>
                        </div>
                        <span className="text-slate-400">25:00</span>
                    </div>
                )).reverse()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTime;
