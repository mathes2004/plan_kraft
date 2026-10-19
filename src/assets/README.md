# Website image assets

Store all user-provided images here, including future uploads. Keep originals in descriptive subfolders:

- `services/`: the nine numbered service images, shared by the Services page and homepage previews.
- `before-after/`: the original exterior comparison pair used on the homepage.
- `projects/`: original site photographs for projects 335 (bathroom), 333 (rooftop), 318 (epoxy grout restoration), 316 (sump-tank waterbar), 314 (rooftop and bathroom) and 310 (sump-tank waterproofing), grouped by project number. Add future portfolio images here too.

Reference images through static imports, never a local computer path or a `/src/assets/` URL:

```tsx
import Image from 'next/image';
import rooftopImage from '@/assets/services/rooftop-waterproofing.webp';

<Image src={rooftopImage} alt="Worker coating a rooftop" />;
```

Next.js includes imported images in its production assets under `/_next/static/media/`, generates their public URLs, and reads their dimensions automatically. Missing imports fail the build. Images are served without access to the original computer's Pictures folder.

Preserve original image contents. The supplied `.jfif` files contain JPEG data and were copied as `.jpg` without re-encoding. Source details and approval records are documented in `ASSETS.md`.
