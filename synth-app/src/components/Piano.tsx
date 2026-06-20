import React, { useEffect, useState, useRef } from 'react';
import { AudioEngine } from '../audioEngine';

interface PianoProps {
  engine: AudioEngine;
}

interface PianoKey {
  note: string;
  key: string;
  isBlack: boolean;
  freq: number;
}

const PIANO_KEYS: PianoKey[] = [
  { note: 'C4', key: 'a', isBlack: false, freq: 261.63 },
  { note: 'C#4', key: 'w', isBlack: true, freq: 277.18 },
  { note: 'D4', key: 's', isBlack: false, freq: 293.66 },
  { note: 'D#4', key: 'e', isBlack: true, freq: 311.13 },
  { note: 'E4', key: 'd', isBlack: false, freq: 329.63 },
  { note: 'F4', key: 'f', isBlack: false, freq: 349.23 },
  { note: 'F#4', key: 't', isBlack: true, freq: 369.99 },
  { note: 'G4', key: 'g', isBlack: false, freq: 392.00 },
  { note: 'G#4', key: 'y', isBlack: true, freq: 415.30 },
  { note: 'A4', key: 'h', isBlack: false, freq: 440.00 },
  { note: 'A#4', key: 'u', isBlack: true, freq: 466.16 },
  { note: 'B4', key: 'j', isBlack: false, freq: 493.88 },
  { note: 'C5', key: 'k', isBlack: false, freq: 523.25 },
  { note: 'C#5', key: 'o', isBlack: true, freq: 554.37 },
  { note: 'D5', key: 'l', isBlack: false, freq: 587.33 },
  { note: 'D#5', key: 'p', isBlack: true, freq: 622.25 },
  { note: 'E5', key: ';', isBlack: false, freq: 659.25 },
];

export const Piano: React.FC<PianoProps> = ({ engine }) => {
  const [pressedNotes, setPressedNotes] = useState<string[]>([]);
  const isMouseDown = useRef(false);

  // Note triggers
  const startNote = (note: string, freq: number) => {
    setPressedNotes(prev => {
      if (prev.includes(note)) return prev;
      return [...prev, note];
    });
    engine.triggerAttack(note, freq);
  };

  const stopNote = (note: string) => {
    setPressedNotes(prev => prev.filter(n => n !== note));
    engine.triggerRelease(note);
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      // Ignore playing if user is typing in forms/BPM box
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const match = PIANO_KEYS.find(k => k.key === e.key.toLowerCase());
      if (match) {
        startNote(match.note, match.freq);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const match = PIANO_KEYS.find(k => k.key === e.key.toLowerCase());
      if (match) {
        stopNote(match.note);
      }
    };

    const handleGlobalMouseUp = () => {
      isMouseDown.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [engine]);

  return (
    <div className="piano-wrapper">
      <div className="piano-header">
        <span className="synth-glow-title">Interactive Key Synthesizer</span>
        <div className="piano-help-tag">
          Play with mouse clicks or use keys: <strong>A W S E D F T G Y H U J K O L P ;</strong>
        </div>
      </div>

      <div className="piano-keyboard-bed">
        {PIANO_KEYS.map((k) => {
          const isPressed = pressedNotes.includes(k.note);
          return (
            <div
              key={k.note}
              className={`piano-key ${k.isBlack ? 'black-key' : 'white-key'} ${isPressed ? 'pressed' : ''}`}
              onMouseDown={() => {
                isMouseDown.current = true;
                startNote(k.note, k.freq);
              }}
              onMouseEnter={() => {
                if (isMouseDown.current) {
                  startNote(k.note, k.freq);
                }
              }}
              onMouseUp={() => {
                isMouseDown.current = false;
                stopNote(k.note);
              }}
              onMouseLeave={() => {
                stopNote(k.note);
              }}
            >
              <div className="key-binding-indicator">{k.key.toUpperCase()}</div>
              {!k.isBlack && <div className="key-note-label">{k.note}</div>}
            </div>
          );
        })}
      </div>

      <style>{`
        .piano-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .piano-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .synth-glow-title {
          font-family: var(--font-serif);
          font-weight: 700;
          color: var(--accent-teal);
          font-size: 1.15rem;
          text-shadow: 0 0 10px rgba(45, 212, 191, 0.15);
        }

        .piano-help-tag {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .piano-help-tag strong {
          color: var(--accent-rose);
          letter-spacing: 0.1em;
          background: rgba(251, 113, 133, 0.08);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          border: 1px solid rgba(251, 113, 133, 0.2);
        }

        .piano-keyboard-bed {
          display: flex;
          height: 220px;
          background: #030712;
          padding: 0.25rem 0.5rem 0.5rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.8);
          position: relative;
          user-select: none;
          overflow-x: auto;
        }

        .piano-key {
          position: relative;
          cursor: pointer;
          transition: background-color 0.05s, transform 0.05s, box-shadow 0.05s;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding-bottom: 1rem;
        }

        .white-key {
          width: 52px;
          height: 100%;
          background: linear-gradient(to bottom, #ffffff 0%, #e2e8f0 100%);
          border: 1px solid #1e293b;
          border-radius: 0 0 6px 6px;
          z-index: 1;
          margin-right: 1px;
        }

        .white-key.pressed {
          background: linear-gradient(to bottom, #e2e8f0 0%, var(--accent-teal) 100%);
          box-shadow: inset 0 4px 10px rgba(0,0,0,0.3), 0 0 15px rgba(45, 212, 191, 0.4);
          transform: translateY(2px);
          border-color: var(--accent-teal);
        }

        .black-key {
          width: 32px;
          height: 125px;
          background: linear-gradient(to bottom, #1e293b 0%, #030712 100%);
          border: 1px solid #000;
          border-radius: 0 0 4px 4px;
          z-index: 5;
          margin-left: -16px;
          margin-right: -16px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.4);
        }

        .black-key.pressed {
          background: linear-gradient(to bottom, #030712 0%, var(--accent-rose) 100%);
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.4), 0 0 15px rgba(251, 113, 133, 0.4);
          transform: translateY(2px);
          border-color: var(--accent-rose);
        }

        .key-binding-indicator {
          font-size: 0.75rem;
          font-weight: 700;
          opacity: 0.4;
          margin-bottom: 0.5rem;
        }

        .white-key .key-binding-indicator {
          color: #0f172a;
        }

        .black-key .key-binding-indicator {
          color: #f8fafc;
        }

        .key-note-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
        }

        .white-key.pressed .key-binding-indicator,
        .white-key.pressed .key-note-label {
          color: #0f172a;
          opacity: 0.8;
        }

        .black-key.pressed .key-binding-indicator {
          color: #ffffff;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};
