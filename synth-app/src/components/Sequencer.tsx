import React, { useEffect, useState, useRef } from 'react';
import { AudioEngine } from '../audioEngine';
import { Play, Pause, Trash2, Sparkles, Volume2 } from 'lucide-react';

interface SequencerProps {
  engine: AudioEngine;
  bpm: number;
  setBpm: (val: number) => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
}

const DRUMS = [
  { id: 'kick', name: 'Kick', color: '#2dd4bf' },
  { id: 'snare', name: 'Snare', color: '#fb7185' },
  { id: 'hihat', name: 'Hihat', color: '#eab308' },
  { id: 'clap', name: 'Clap', color: '#c084fc' }
];

const PRESETS = [
  {
    name: 'House Groove',
    grid: [
      [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false], // Kick (four on floor)
      [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false], // Snare (2 and 4)
      [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false], // Hihat (off-beat)
      [false, false, false, false, false, false, false, true, false, false, false, false, false, false, true, false]  // Clap (accent)
    ],
    bpm: 124
  },
  {
    name: 'Hip Hop Beat',
    grid: [
      [true, false, false, false, false, false, false, true, false, true, true, false, false, false, false, false], // Kick
      [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false], // Snare
      [true, false, true, true, true, false, true, false, true, true, true, false, true, true, false, true], // Hihat
      [false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false]  // Clap
    ],
    bpm: 90
  },
  {
    name: 'Techno Break',
    grid: [
      [true, false, false, false, true, false, false, false, true, false, false, true, true, false, false, false], // Kick
      [false, false, false, false, true, false, false, true, false, false, false, false, true, false, true, false], // Snare
      [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true], // Hihat
      [false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, true]  // Clap
    ],
    bpm: 130
  }
];

export const Sequencer: React.FC<SequencerProps> = ({ engine, bpm, setBpm, isPlaying, setIsPlaying }) => {
  const [grid, setGrid] = useState<boolean[][]>(() => 
    Array(4).fill(null).map(() => Array(16).fill(false))
  );
  
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [drumVol, setDrumVol] = useState<number>(0.6);
  
  const timerRef = useRef<any>(null);
  const currentStepRef = useRef<number>(-1);

  // Keep ref up-to-date for fast interval reading
  currentStepRef.current = currentStep;

  // Track volume updates
  useEffect(() => {
    engine.drumVolume = drumVol;
  }, [drumVol, engine]);

  // Handle Playback Interval
  useEffect(() => {
    if (isPlaying) {
      // sixteenth note interval in ms = 60000 / (bpm * 4)
      const intervalTime = 60000 / (bpm * 4);
      
      const tick = () => {
        const nextStep = (currentStepRef.current + 1) % 16;
        setCurrentStep(nextStep);

        // Trigger instruments scheduled on this step
        if (grid[0][nextStep]) engine.triggerKick();
        if (grid[1][nextStep]) engine.triggerSnare();
        if (grid[2][nextStep]) engine.triggerHiHat();
        if (grid[3][nextStep]) engine.triggerClap();
      };

      // Trigger first note immediately
      tick();

      timerRef.current = setInterval(tick, intervalTime);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setCurrentStep(-1);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, bpm, grid, engine]);

  const toggleCell = (row: number, col: number) => {
    setGrid(prev => {
      const newGrid = prev.map(r => [...r]);
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });
  };

  const clearGrid = () => {
    setGrid(Array(4).fill(null).map(() => Array(16).fill(false)));
    setIsPlaying(false);
  };

  const loadPreset = (presetIndex: number) => {
    const preset = PRESETS[presetIndex];
    setGrid(preset.grid.map(r => [...r]));
    setBpm(preset.bpm);
    setIsPlaying(false);
  };

  const playPadSound = (drumId: string) => {
    if (drumId === 'kick') engine.triggerKick();
    if (drumId === 'snare') engine.triggerSnare();
    if (drumId === 'hihat') engine.triggerHiHat();
    if (drumId === 'clap') engine.triggerClap();
  };

  return (
    <div className="sequencer-wrapper">
      
      {/* Sequencer Toolbar */}
      <div className="seq-toolbar">
        <div className="seq-main-actions">
          <button 
            type="button" 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`btn-control ${isPlaying ? 'active' : ''}`}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? 'Pause' : 'Play Beat'}
          </button>
          
          <button 
            type="button" 
            onClick={clearGrid}
            className="btn-control"
          >
            <Trash2 size={16} />
            Clear
          </button>
        </div>

        {/* Presets */}
        <div className="seq-presets">
          <span className="preset-lbl"><Sparkles size={12} /> Patterns:</span>
          {PRESETS.map((p, idx) => (
            <button 
              key={p.name} 
              type="button" 
              className="preset-btn"
              onClick={() => loadPreset(idx)}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* BPM & Volume Controls */}
        <div className="seq-numeric-controls">
          <div className="slider-group-small">
            <span className="control-lbl">BPM: <strong>{bpm}</strong></span>
            <input 
              type="range" 
              min={60} 
              max={200} 
              value={bpm} 
              onChange={(e) => setBpm(Number(e.target.value))}
              className="range-small"
            />
          </div>

          <div className="slider-group-small">
            <span className="control-lbl"><Volume2 size={14} /> Drum Vol: <strong>{Math.round(drumVol * 100)}%</strong></span>
            <input 
              type="range" 
              min={0.0} 
              max={1.0} 
              step={0.05}
              value={drumVol} 
              onChange={(e) => setDrumVol(Number(e.target.value))}
              className="range-small"
            />
          </div>
        </div>
      </div>

      {/* Grid Sequencer Area */}
      <div className="seq-grid-container">
        <div className="seq-grid-labels">
          {DRUMS.map(d => (
            <button 
              key={d.id} 
              type="button" 
              className="drum-audition-pad"
              style={{ '--pad-color': d.color } as React.CSSProperties}
              onClick={() => playPadSound(d.id)}
            >
              <span>{d.name}</span>
            </button>
          ))}
        </div>

        <div className="seq-grid-steps">
          {grid.map((row, rIdx) => {
            const drum = DRUMS[rIdx];
            return (
              <div key={drum.id} className="seq-grid-row">
                {row.map((cell, cIdx) => {
                  const isCurrent = currentStep === cIdx;
                  const isBeatIndex = cIdx % 4 === 0;
                  return (
                    <div
                      key={cIdx}
                      className={`seq-grid-cell ${cell ? 'active' : ''} ${isCurrent ? 'current' : ''} ${isBeatIndex ? 'beat-divider' : ''}`}
                      style={{ 
                        '--active-color': drum.color,
                        '--active-glow': `${drum.color}60`
                      } as React.CSSProperties}
                      onClick={() => toggleCell(rIdx, cIdx)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Beat index numbers bar */}
      <div className="step-numbers-row">
        <div className="numbers-spacer" />
        <div className="numbers-grid">
          {Array(16).fill(null).map((_, idx) => (
            <span key={idx} className={`step-num ${currentStep === idx ? 'current' : ''}`}>
              {idx + 1}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .sequencer-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .seq-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          background: rgba(15, 23, 42, 0.4);
          padding: 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.02);
        }

        .seq-main-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-control {
          background: var(--bg-deep);
          border: 1px solid var(--border-gold);
          color: var(--text-main);
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition-fast);
        }

        .btn-control:hover {
          border-color: var(--accent-teal);
          color: var(--accent-teal-bright);
        }

        .btn-control.active {
          background: var(--accent-teal-dark);
          border-color: var(--accent-teal);
          box-shadow: 0 0 10px rgba(45, 212, 191, 0.25);
        }

        .seq-presets {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .preset-lbl {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .preset-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.35rem 0.65rem;
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .preset-btn:hover {
          border-color: var(--accent-rose);
          color: var(--accent-rose-bright);
          background: rgba(255, 255, 255, 0.05);
        }

        .seq-numeric-controls {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .slider-group-small {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 120px;
        }

        .control-lbl {
          font-size: 0.7rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .control-lbl strong {
          color: var(--accent-teal-bright);
        }

        .range-small {
          height: 4px;
          background: #1e293b;
          border-radius: var(--radius-full);
          cursor: pointer;
          accent-color: var(--accent-teal);
        }

        /* Sequencer Grid Layout */
        .seq-grid-container {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 1rem;
          background: #030712;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.8);
          overflow-x: auto;
        }

        .seq-grid-labels {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          justify-content: center;
        }

        .drum-audition-pad {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.8rem 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          text-align: center;
          transition: var(--transition-fast);
        }

        .drum-audition-pad:hover {
          color: var(--text-main);
          border-color: var(--pad-color);
          box-shadow: 0 0 10px var(--pad-color);
          background: rgba(255, 255, 255, 0.05);
        }

        .seq-grid-steps {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          justify-content: center;
        }

        .seq-grid-row {
          display: flex;
          gap: 0.4rem;
        }

        .seq-grid-cell {
          flex: 1;
          height: 38px;
          min-width: 25px;
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.02);
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          transition: background-color 0.05s, transform 0.05s;
        }

        .seq-grid-cell:hover {
          background: #1e293b;
        }

        .seq-grid-cell.beat-divider {
          border-left: 2px solid rgba(255, 255, 255, 0.15);
        }

        .seq-grid-cell.active {
          background-color: var(--active-color);
          box-shadow: 0 0 12px var(--active-glow);
          border-color: var(--active-color);
        }

        .seq-grid-cell.current::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 4px;
          pointer-events: none;
        }

        .seq-grid-cell.current.active {
          background-color: #ffffff;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
        }

        /* Beat Index Numbers row */
        .step-numbers-row {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 1rem;
          padding: 0 1rem;
          margin-top: -0.75rem;
        }

        .numbers-spacer {
          width: 100px;
        }

        .numbers-grid {
          display: flex;
          gap: 0.4rem;
        }

        .step-num {
          flex: 1;
          min-width: 25px;
          text-align: center;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .step-num.current {
          color: var(--accent-teal);
        }
      `}</style>
    </div>
  );
};
