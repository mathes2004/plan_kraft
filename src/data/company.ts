import { quoteConfig } from './quote-config';

export const company = {
  name: 'PLAN KRAFT WATERPROOFING SOLUTIONS',
  address: 'Senkunthar Street, Arayampathy 02, Batticaloa, Sri Lanka',
  phone: '074 038 8334',
  secondaryPhone: '075 518 3966',
  tel: 'tel:+94740388334',
  secondaryTel: 'tel:+94755183966',
  whatsapp: 'https://wa.me/94755183966',
  email: quoteConfig.recipient,
  experience: 10,
  projects: 335,
  coverage: 'Islandwide — all Sri Lanka',
  warranty: '5- or 10-year warranty, depending on service and applicable terms.',
  facebook: 'https://web.facebook.com/profile.php?id=100079744326955',
};
export const navigation = [
  ['/', 'Home'],
  ['/services', 'Our Services'],
  ['/about', 'About Us'],
  ['/projects', 'Our Projects'],
  ['/work-process', 'Work Process'],
  ['/contact', 'Contact Us'],
  ['/request-quote', 'Request a Quote'],
] as const;
export const mapQuery = encodeURIComponent(company.address);
