import React, { useEffect, useRef, useState } from 'react';
import { AudioEngine } from '../audioEngine';
import { Activity, BarChart2 } from 'lucide-react';

interface VisualizerProps {
  engine: AudioEngine;
}

export const Visualizer: React.FC<VisualizerProps> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visualMode, setVisualMode] = useState<'wave' | 'frequency'>('wave');
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 120;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const analyser = engine.getAnalyser();

      // Transparent clear to create smooth trailing motion lines
      ctx.fillStyle = 'rgba(3, 7, 20, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      
      // Horizontal centers
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Vertical dividers
      ctx.beginPath();
      for (let x = 0; x < width; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      if (!analyser) {
        // Draw flat line if context is uninitialized
        ctx.strokeStyle = '#2dd4bf';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Visual Gradient
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#2dd4bf'); // Teal
        gradient.addColorStop(0.5, '#c084fc'); // Purple
        gradient.addColorStop(1, '#fb7185'); // Rose

        if (visualMode === 'wave') {
          analyser.getByteTimeDomainData(dataArray);

          ctx.lineWidth = 2.5;
          ctx.strokeStyle = gradient;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(45, 212, 191, 0.4)';
          ctx.beginPath();

          const sliceWidth = width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0; // range 0 to 2
            const y = (v * height) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }

            x += sliceWidth;
          }

          ctx.lineTo(width, height / 2);
          ctx.stroke();
        } else {
          // Frequency Bars Mode
          analyser.getByteFrequencyData(dataArray);

          ctx.shadowBlur = 0;
          const barWidth = (width / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;

            if (barHeight > 0) {
              ctx.fillStyle = gradient;
              // Draw rounded vertical bars
              ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
            }

            x += barWidth + 1;
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [engine, visualMode]);

  return (
    <div className="visualizer-wrapper">
      <div className="vis-header">
        <span className="vis-title">Real-Time Wave Visualizer</span>
        <div className="vis-tabs">
          <button 
            type="button" 
            className={`vis-tab-btn ${visualMode === 'wave' ? 'active' : ''}`}
            onClick={() => setVisualMode('wave')}
          >
            <Activity size={12} />
            Waveform
          </button>
          <button 
            type="button" 
            className={`vis-tab-btn ${visualMode === 'frequency' ? 'active' : ''}`}
            onClick={() => setVisualMode('frequency')}
          >
            <BarChart2 size={12} />
            Spectrum
          </button>
        </div>
      </div>

      <div className="canvas-frame">
        <canvas ref={canvasRef} className="vis-canvas" />
      </div>

      <style>{`
        .visualizer-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
        }

        .vis-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .vis-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .vis-tabs {
          display: flex;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.02);
          padding: 0.15rem;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.03);
        }

        .vis-tab-btn {
          font-family: var(--font-body);
          font-size: 0.65rem;
          font-weight: 600;
          background: none;
          border: none;
          color: var(--text-muted);
          padding: 0.2rem 0.5rem;
          cursor: pointer;
          border-radius: 3px;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: var(--transition-fast);
        }

        .vis-tab-btn:hover {
          color: var(--text-main);
        }

        .vis-tab-btn.active {
          background: rgba(45, 212, 191, 0.12);
          color: var(--accent-teal-bright);
        }

        .canvas-frame {
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          background: #030714;
          overflow: hidden;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.6);
        }

        .vis-canvas {
          display: block;
          width: 100%;
        }
      `}</style>
    </div>
  );
};
