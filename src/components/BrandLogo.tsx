import Image from 'next/image';
import logo from '@/assets/brand/plan-kraft-logo.jpg';

export default function BrandLogo() {
  return (
    <span className="brand-logo" aria-hidden="true">
      <Image src={logo} alt="" sizes="200px" />
    </span>
  );
}
