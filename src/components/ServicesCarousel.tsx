'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function ServicesCarousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setCanGoBack(track.scrollLeft > 1);
      setCanGoForward(track.scrollLeft < track.scrollWidth - track.clientWidth - 1);
    };
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      track.removeEventListener('scroll', update);
    };
  }, []);

  function move(direction: number, edge?: 'start' | 'end') {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.preview-card');
    const step =
      (card?.getBoundingClientRect().width || track.clientWidth) +
      Number.parseFloat(getComputedStyle(track).columnGap);
    track.scrollTo({
      left:
        edge === 'start'
          ? 0
          : edge === 'end'
            ? track.scrollWidth
            : track.scrollLeft + direction * step,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  return (
    <div
      className="services-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured services"
    >
      <div className="services-carousel-controls">
        <p id="services-scroll-help">Scroll to explore all six services</p>
        <div className="services-carousel-arrows">
          <button
            type="button"
            aria-label="Previous services"
            aria-controls="homepage-services-track"
            disabled={!canGoBack}
            onClick={() => move(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            aria-label="Next services"
            aria-controls="homepage-services-track"
            disabled={!canGoForward}
            onClick={() => move(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <div
        className="service-preview"
        id="homepage-services-track"
        ref={trackRef}
        role="group"
        tabIndex={0}
        aria-label="Service cards"
        aria-describedby="services-scroll-help"
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            move(event.key === 'ArrowRight' ? 1 : -1);
          } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            move(0, event.key === 'Home' ? 'start' : 'end');
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
