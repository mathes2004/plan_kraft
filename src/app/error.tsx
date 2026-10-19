'use client';
import { company } from '@/data/company';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="section container">
      <h1>Something went wrong.</h1>
      <p>Please try again, or call {company.phone} for assistance.</p>
      <button className="button" onClick={reset}>
        Try Again
      </button>
    </section>
  );
}
