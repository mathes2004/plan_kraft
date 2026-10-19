import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="section container">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>
        Let’s get you back
        <br />
        on solid ground.
      </h1>
      <p>The page you’re looking for could not be found.</p>
      <Link className="button" href="/">
        Back to Home ↗
      </Link>
    </section>
  );
}
