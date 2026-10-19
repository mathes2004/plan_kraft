'use client';
import { useEffect, useState } from 'react';
import { stages, nextStep, previousStep } from '@/data/process';
export default function ProcessExperience() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    function visibility() {
      setVisible(!document.hidden);
    }
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, []);
  useEffect(() => {
    if (!playing || !visible || step === 7) return;
    const timer = setTimeout(() => {
      setStep((s) => nextStep(s));
      if (step === 6) setPlaying(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [playing, visible, step]);
  function select(n: number) {
    setPlaying(false);
    setStep(n);
  }
  return (
    <div className="process">
      <div className="stage-list" aria-label="Choose workflow stage">
        {stages.map(([title], i) => (
          <button
            key={title}
            aria-current={step === i ? 'step' : undefined}
            onClick={() => select(i)}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            {title}
            <b aria-hidden="true">{step === i ? '↗' : '·'}</b>
          </button>
        ))}
      </div>
      <div>
        <div
          className={`process-scene stage-${step}`}
          data-hidden={!visible}
          role="img"
          aria-label={`Educational rooftop model: ${stages[step][2]}`}
        >
          <span className="scene-tag">
            INTERACTIVE PROCESS MODEL / {String(step + 1).padStart(2, '0')}
          </span>
          <div className="scene-grid" />
          <div className="building-model">
            <div className="building-front">
              <i />
              <i />
              <i />
            </div>
            <div className="building-side">
              <i />
              <i />
            </div>
            <div className="roof-slab" />
            <div className="roof-surface" />
            <div className="inspection-ring" />
            <div className="crack-lines" />
            <div className="measure-overlay" />
            <div className="surface-debris">· · · · ·</div>
            <div className="repair-mesh" />
            <div className="coating-layer" />
            <div className="test-water" />
            <div className="complete-check">✓</div>
          </div>
          <div className="scene-legend">
            <span className="legend-dot" />
            {stages[step][2]}
          </div>
        </div>
        <div className="process-description">
          <p className="eyebrow">STEP {step + 1} OF 8</p>
          <h2>{stages[step][0]}</h2>
          <p>{stages[step][1]}</p>
          <progress value={step + 1} max={8} aria-label="Workflow progress" />
          <div className="process-controls">
            <button onClick={() => select(previousStep(step))} disabled={step === 0}>
              ← Previous
            </button>
            <button
              className="play-button"
              onClick={() => setPlaying((p) => !p)}
              disabled={step === 7}
            >
              {playing ? 'Pause' : 'Play'} {playing ? 'Ⅱ' : '▷'}
            </button>
            <button onClick={() => select(nextStep(step))} disabled={step === 7}>
              Next →
            </button>
            <button onClick={() => select(0)}>Replay ↺</button>
          </div>
          <p className="small">
            This model illustrates a representative process. The exact coating system, treatment
            method, sequence and testing depend on actual site conditions and the selected service.
          </p>
        </div>
      </div>
    </div>
  );
}
