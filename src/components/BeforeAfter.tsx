'use client';
import Image from 'next/image';
import { useId, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import type { Comparison } from '@/data/projects';
export default function BeforeAfter({ pair }: { pair?: Comparison }) {
  const [value, setValue] = useState(50);
  const [dragging, setDragging] = useState(false);
  const pointer = useRef<number | null>(null);
  const slider = useRef<HTMLInputElement>(null);
  const hintId = useId();
  function reveal(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setValue(
      Math.max(
        0,
        Math.min(100, Math.round(((event.clientX - bounds.left) / bounds.width) * 1000) / 10),
      ),
    );
  }
  function stopDragging() {
    pointer.current = null;
    setDragging(false);
  }
  const genuine =
    pair &&
    pair.before.approved &&
    pair.after.approved &&
    pair.before.kind === 'genuine-project' &&
    pair.after.kind === 'genuine-project';
  if (!genuine)
    return (
      <div className="comparison-pending">
        <div className="comparison-lines" aria-hidden="true" />
        <span className="eyebrow">BEFORE & AFTER</span>
        <h3>
          The real difference.
          <br />
          Coming into view.
        </h3>
        <p>
          Approved paired project photos are pending.
          <br />
          No simulated customer results are shown.
        </p>
      </div>
    );
  return (
    <div className="comparison-block">
      <div
        className="comparison"
        data-dragging={dragging}
        style={{ '--comparison-position': `${value}%` } as CSSProperties}
        role="group"
        aria-label="Project image comparison"
        onPointerDown={(event) => {
          if (event.button !== 0 || pointer.current !== null) return;
          event.preventDefault();
          pointer.current = event.pointerId;
          setDragging(true);
          slider.current?.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          reveal(event);
        }}
        onPointerMove={(event) => {
          if (pointer.current === event.pointerId) reveal(event);
        }}
        onPointerUp={(event) => {
          if (pointer.current !== event.pointerId) return;
          stopDragging();
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={stopDragging}
        onLostPointerCapture={stopDragging}
      >
        <Image
          src={pair.after.src}
          alt={pair.after.alt}
          fill
          sizes="(max-width: 700px) 88vw, 50vw"
          draggable={false}
        />
        <div className="before-image">
          <Image
            src={pair.before.src}
            alt={pair.before.alt}
            fill
            sizes="(max-width: 700px) 88vw, 50vw"
            draggable={false}
          />
        </div>
        <span className="before-label">BEFORE</span>
        <span className="after-label">AFTER</span>
        <div className="comparison-handle" aria-hidden="true">
          <span className="comparison-thumb">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="m8 7-5 5 5 5m8-10 5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <input
          ref={slider}
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label="Compare before and after project photos"
          aria-describedby={hintId}
          aria-valuetext={`${value}% before image and ${Math.round((100 - value) * 10) / 10}% after image visible`}
        />
      </div>
      <p className="comparison-hint" id={hintId}>
        Drag the divider or use the arrow keys to compare.
      </p>
      {pair.note && <p className="comparison-note">{pair.note}</p>}
    </div>
  );
}
