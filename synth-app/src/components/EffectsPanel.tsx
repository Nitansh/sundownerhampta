import React, { useState } from 'react';
import { AudioEngine } from '../audioEngine';
import { Compass, ToggleLeft, ToggleRight } from 'lucide-react';

interface EffectsPanelProps {
  engine: AudioEngine;
}

export const EffectsPanel: React.FC<EffectsPanelProps> = ({ engine }) => {
  // Echo Delay States
  const [delayEnabled, setDelayEnabled] = useState(engine.delayEnabled);
  const [delayTime, setDelayTime] = useState(engine.delayTime);
  const [delayFeedback, setDelayFeedback] = useState(engine.delayFeedbackAmt);

  // Distortion States
  const [distEnabled, setDistEnabled] = useState(engine.distortionEnabled);
  const [distAmt, setDistAmt] = useState(engine.distortionAmt);

  // Reverb States
  const [reverbEnabled, setReverbEnabled] = useState(engine.reverbEnabled);
  const [reverbSize, setReverbSize] = useState(engine.reverbRoomSize);

  // FX Handlers
  const handleToggleDelay = () => {
    const next = !delayEnabled;
    setDelayEnabled(next);
    engine.delayEnabled = next;
    engine.updateDelay();
  };

  const handleDelayTimeChange = (val: number) => {
    setDelayTime(val);
    engine.delayTime = val;
    engine.updateDelay();
  };

  const handleDelayFeedbackChange = (val: number) => {
    setDelayFeedback(val);
    engine.delayFeedbackAmt = val;
    engine.updateDelay();
  };

  const handleToggleDist = () => {
    const next = !distEnabled;
    setDistEnabled(next);
    engine.distortionEnabled = next;
    engine.updateDistortion();
  };

  const handleDistAmtChange = (val: number) => {
    setDistAmt(val);
    engine.distortionAmt = val;
    engine.updateDistortion();
  };

  const handleToggleReverb = () => {
    const next = !reverbEnabled;
    setReverbEnabled(next);
    engine.reverbEnabled = next;
    engine.updateReverb();
  };

  const handleReverbSizeChange = (val: number) => {
    setReverbSize(val);
    engine.reverbRoomSize = val;
    engine.updateReverb();
  };

  return (
    <div className="fx-panel-wrapper">
      <div className="fx-panel-header">
        <Compass size={14} className="fx-title-icon" />
        <span className="fx-title">Studio Sound FX Rack</span>
      </div>

      <div className="fx-rack-grid">
        
        {/* Unit 1: OVERDRIVE */}
        <div className={`fx-unit glass-panel ${distEnabled ? 'active' : ''}`}>
          <div className="fx-unit-hdr">
            <span className="fx-unit-name">1. Analog Overdrive</span>
            <button 
              type="button" 
              className={`fx-bypass-btn ${distEnabled ? 'enabled' : ''}`}
              onClick={handleToggleDist}
            >
              {distEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </div>

          <div className="fx-unit-controls">
            <div className="slider-group">
              <div className="slider-info">
                <span className="slider-label">Drive Amount</span>
                <span className="slider-val">{Math.round(distAmt * 100)}%</span>
              </div>
              <input 
                type="range" 
                min={0.0} 
                max={1.0} 
                step={0.02}
                value={distAmt} 
                disabled={!distEnabled}
                onChange={(e) => handleDistAmtChange(Number(e.target.value))}
                className="fx-slider"
              />
            </div>
            <div className="fx-status-led">
              <span className={`led ${distEnabled ? 'glow-red' : ''}`} />
              <span className="led-label">SATURATION ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Unit 2: FEEDBACK DELAY */}
        <div className={`fx-unit glass-panel ${delayEnabled ? 'active' : ''}`}>
          <div className="fx-unit-hdr">
            <span className="fx-unit-name">2. Echo Delay</span>
            <button 
              type="button" 
              className={`fx-bypass-btn ${delayEnabled ? 'enabled' : ''}`}
              onClick={handleToggleDelay}
            >
              {delayEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </div>

          <div className="fx-unit-controls">
            <div className="slider-group">
              <div className="slider-info">
                <span className="slider-label">Echo Time</span>
                <span className="slider-val">{Math.round(delayTime * 1000)} ms</span>
              </div>
              <input 
                type="range" 
                min={0.1} 
                max={0.8} 
                step={0.05}
                value={delayTime} 
                disabled={!delayEnabled}
                onChange={(e) => handleDelayTimeChange(Number(e.target.value))}
                className="fx-slider"
              />
            </div>

            <div className="slider-group">
              <div className="slider-info">
                <span className="slider-label">Feedback decay</span>
                <span className="slider-val">{Math.round(delayFeedback * 100)}%</span>
              </div>
              <input 
                type="range" 
                min={0.0} 
                max={0.85} 
                step={0.05}
                value={delayFeedback} 
                disabled={!delayEnabled}
                onChange={(e) => handleDelayFeedbackChange(Number(e.target.value))}
                className="fx-slider"
              />
            </div>
          </div>
        </div>

        {/* Unit 3: SPACE REVERB */}
        <div className={`fx-unit glass-panel ${reverbEnabled ? 'active' : ''}`}>
          <div className="fx-unit-hdr">
            <span className="fx-unit-name">3. Space Reverb</span>
            <button 
              type="button" 
              className={`fx-bypass-btn ${reverbEnabled ? 'enabled' : ''}`}
              onClick={handleToggleReverb}
            >
              {reverbEnabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </div>

          <div className="fx-unit-controls">
            <div className="slider-group">
              <div className="slider-info">
                <span className="slider-label">Decay Size</span>
                <span className="slider-val">{reverbSize.toFixed(1)} sec</span>
              </div>
              <input 
                type="range" 
                min={0.5} 
                max={3.5} 
                step={0.1}
                value={reverbSize} 
                disabled={!reverbEnabled}
                onChange={(e) => handleReverbSizeChange(Number(e.target.value))}
                className="fx-slider"
              />
            </div>
            <div className="fx-status-led">
              <span className={`led ${reverbEnabled ? 'glow-teal' : ''}`} />
              <span className="led-label">CONVOLUTION ACTIVE</span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .fx-panel-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .fx-panel-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
        }

        .fx-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fx-title-icon {
          color: var(--accent-teal);
        }

        .fx-rack-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .fx-rack-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        .fx-unit {
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.02);
          background: rgba(15, 23, 42, 0.25);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: var(--transition-smooth);
        }

        .fx-unit.active {
          border-color: rgba(45, 212, 191, 0.15);
          background: rgba(15, 23, 42, 0.5);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(45, 212, 191, 0.02);
        }

        .fx-unit-hdr {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .fx-unit-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: 0.02em;
        }

        .fx-bypass-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
        }

        .fx-bypass-btn.enabled {
          color: var(--accent-teal);
        }

        .fx-unit-controls {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .slider-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .slider-label {
          color: var(--text-muted);
          font-weight: 500;
        }

        .slider-val {
          color: var(--accent-teal-bright);
          font-weight: 700;
          font-family: monospace;
        }

        .fx-slider {
          height: 5px;
          background: #131924;
          border-radius: var(--radius-full);
          cursor: pointer;
          accent-color: var(--accent-teal);
        }

        .fx-slider:disabled {
          opacity: 0.2;
          cursor: not-allowed;
          accent-color: var(--text-muted);
        }

        .fx-status-led {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .led {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1e293b;
          transition: var(--transition-fast);
        }

        .led.glow-red {
          background: #f43f5e;
          box-shadow: 0 0 10px #f43f5e;
        }

        .led.glow-teal {
          background: #2dd4bf;
          box-shadow: 0 0 10px #2dd4bf;
        }

        .led-label {
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
};
