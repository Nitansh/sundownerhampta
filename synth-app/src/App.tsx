import React, { useState, useRef, useEffect } from 'react';
import { AudioEngine } from './audioEngine';
import type { WaveformType } from './audioEngine';
import { Piano } from './components/Piano';
import { Sequencer } from './components/Sequencer';
import { Visualizer } from './components/Visualizer';
import { EffectsPanel } from './components/EffectsPanel';
import { Volume2, Power, Sliders, Music, DiscAlbum } from 'lucide-react';

export const App: React.FC = () => {
  // Persistence for Audio Engine
  const engineRef = useRef<AudioEngine>(new AudioEngine());
  const engine = engineRef.current;

  // DAW State
  const [audioReady, setAudioReady] = useState(false);
  const [waveform, setWaveform] = useState<WaveformType>('sawtooth');
  const [synthVol, setSynthVol] = useState(0.5);

  // ADSR states
  const [attack, setAttack] = useState(0.05);
  const [decay, setDecay] = useState(0.2);
  const [sustain, setSustain] = useState(0.6);
  const [release, setRelease] = useState(0.3);

  // Filter states
  const [filterFreq, setFilterFreq] = useState(2000);
  const [filterQ, setFilterQ] = useState(1.0);

  // Sequencer shared states
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initial Audio Activation handler
  const handleStartDAW = () => {
    engine.init();
    setAudioReady(true);
  };

  // Sync state changes with audioEngine
  useEffect(() => {
    engine.waveform = waveform;
  }, [waveform, engine]);

  useEffect(() => {
    engine.synthVolume = synthVol;
  }, [synthVol, engine]);

  useEffect(() => {
    engine.attack = attack;
    engine.decay = decay;
    engine.sustain = sustain;
    engine.release = release;
  }, [attack, decay, sustain, release, engine]);

  useEffect(() => {
    engine.filterFreq = filterFreq;
    engine.filterQ = filterQ;
  }, [filterFreq, filterQ, engine]);

  return (
    <div className="daw-container">
      
      {/* POWER ON BOOT OVERLAY */}
      {!audioReady && (
        <div className="daw-splash-overlay">
          <div className="splash-card glass-panel-dark">
            <div className="splash-logo">
              <DiscAlbum size={64} className="spin-logo-icon" />
              <h1>SYNTHLAB STUDIO</h1>
              <p>Professional Web Synthesizer & Drum Workstation</p>
            </div>
            
            <button 
              type="button" 
              onClick={handleStartDAW} 
              className="btn btn-primary btn-power-on"
            >
              <Power size={20} />
              Boot Engine & Power On
            </button>
            <span className="power-alert-txt">Ensure your speakers or headphones are connected.</span>
          </div>
        </div>
      )}

      {/* MAIN RACK INTERFACE */}
      <header className="daw-header glass-panel">
        <div className="header-logo-section">
          <div className="header-icon-badge">
            <Music size={18} />
          </div>
          <div className="header-title-block">
            <h2>SYNTHLAB</h2>
            <span className="logo-ver">PRO STUDIO V1.0</span>
          </div>
        </div>

        <div className="header-status-badge">
          <span className="status-dot green-pulse" />
          <span>AUDIO ENGINE ONLINE</span>
        </div>
      </header>

      <div className="daw-workspace-grid">
        
        {/* LEFT COLUMN: SYNTH RACK (Oscillators, ADSR, Filter) */}
        <div className="daw-rack-column glass-panel">
          <div className="rack-section-title">
            <Sliders size={16} className="rack-title-ico" />
            <h3>Polyphonic Synthesizer Parameters</h3>
          </div>

          <div className="rack-content-blocks">
            
            {/* Waveform Selector */}
            <div className="rack-group">
              <label>1. Oscillator Waveform</label>
              <div className="waveform-grid">
                {(['sine', 'square', 'sawtooth', 'triangle'] as WaveformType[]).map(wave => (
                  <button
                    key={wave}
                    type="button"
                    className={`waveform-card ${waveform === wave ? 'active' : ''}`}
                    onClick={() => setWaveform(wave)}
                  >
                    <span className={`wave-shape-icon ${wave}-shape`} />
                    <span className="wave-name">{wave}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ADSR Envelope Controls */}
            <div className="rack-group">
              <label>2. ADSR Volume Envelope</label>
              <div className="sliders-vertical-grid">
                
                <div className="vert-slider-wrapper">
                  <input 
                    type="range" 
                    min={0.005} 
                    max={1.5} 
                    step={0.05}
                    value={attack} 
                    onChange={(e) => setAttack(Number(e.target.value))}
                    className="slider-vertical"
                  />
                  <span className="slider-lbl">A<small>{attack.toFixed(2)}s</small></span>
                </div>

                <div className="vert-slider-wrapper">
                  <input 
                    type="range" 
                    min={0.01} 
                    max={1.5} 
                    step={0.05}
                    value={decay} 
                    onChange={(e) => setDecay(Number(e.target.value))}
                    className="slider-vertical"
                  />
                  <span className="slider-lbl">D<small>{decay.toFixed(2)}s</small></span>
                </div>

                <div className="vert-slider-wrapper">
                  <input 
                    type="range" 
                    min={0.0} 
                    max={1.0} 
                    step={0.05}
                    value={sustain} 
                    onChange={(e) => setSustain(Number(e.target.value))}
                    className="slider-vertical"
                  />
                  <span className="slider-lbl">S<small>{Math.round(sustain * 100)}%</small></span>
                </div>

                <div className="vert-slider-wrapper">
                  <input 
                    type="range" 
                    min={0.01} 
                    max={2.0} 
                    step={0.05}
                    value={release} 
                    onChange={(e) => setRelease(Number(e.target.value))}
                    className="slider-vertical"
                  />
                  <span className="slider-lbl">R<small>{release.toFixed(2)}s</small></span>
                </div>

              </div>
            </div>

            {/* Filter Section */}
            <div className="rack-group">
              <label>3. Lowpass Biquad Filter</label>
              <div className="sliders-horizontal-stack">
                <div className="slider-group">
                  <div className="slider-info">
                    <span className="slider-label">Cutoff Frequency</span>
                    <span className="slider-val">{filterFreq} Hz</span>
                  </div>
                  <input 
                    type="range" 
                    min={100} 
                    max={8000} 
                    step={50}
                    value={filterFreq} 
                    onChange={(e) => setFilterFreq(Number(e.target.value))}
                    className="fx-slider"
                  />
                </div>

                <div className="slider-group">
                  <div className="slider-info">
                    <span className="slider-label">Resonance (Q)</span>
                    <span className="slider-val">{filterQ.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" 
                    min={0.5} 
                    max={12.0} 
                    step={0.1}
                    value={filterQ} 
                    onChange={(e) => setFilterQ(Number(e.target.value))}
                    className="fx-slider"
                  />
                </div>
              </div>
            </div>

            {/* Synth Volume */}
            <div className="rack-group" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div className="slider-group">
                <div className="slider-info">
                  <span className="slider-label"><Volume2 size={14} /> Synthesizer Volume</span>
                  <span className="slider-val">{Math.round(synthVol * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min={0.0} 
                  max={1.0} 
                  step={0.05}
                  value={synthVol} 
                  onChange={(e) => setSynthVol(Number(e.target.value))}
                  className="fx-slider"
                />
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: VISUALIZER & SOUND FX */}
        <div className="daw-rack-column glass-panel">
          <div className="vis-section-block">
            <Visualizer engine={engine} />
          </div>
          
          <div className="effects-section-block" style={{ marginTop: 'auto' }}>
            <EffectsPanel engine={engine} />
          </div>
        </div>

      </div>

      {/* SEQUENCER RACK BLOCK (Center) */}
      <div className="daw-sequencer-block glass-panel">
        <Sequencer 
          engine={engine} 
          bpm={bpm} 
          setBpm={setBpm} 
          isPlaying={isPlaying} 
          setIsPlaying={setIsPlaying}
        />
      </div>

      {/* PIANO KEYBOARD BED (Bottom) */}
      <div className="daw-piano-block glass-panel">
        <Piano engine={engine} />
      </div>

    </div>
  );
};

export default App;
