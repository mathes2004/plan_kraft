# Website image assets

Store all user-provided images here, including future uploads. Keep originals in descriptive subfolders:

- `brand/`: the original `plan-kraft-logo.jpg`, copied unchanged from the user's `logo.jpg` and shared by the header and footer.
- `services/`: sixteen primary service images, mapped in `src/data/services.ts`. The five homepage carousel cards start with Rooftop Waterproofing, followed by Epoxy Grouting, Fiber Paint Application, Polyurethane Coating Application and Terrace / Balcony Waterproofing. Bathroom Waterproofing remains on the Services page with its complete `bathroom-waterproofing-stages.jpg` artwork; it is excluded only from the homepage carousel. Other homepage photos reuse the matching service images. `ServicePhoto.tsx` frames promotional content without displaying outdated contact banners or unrelated client details. Rooftop Waterproofing and Roof Waterproofing have separate images and entries. Supplied files remain unchanged; older unused images remain unreferenced.
- `before-after/`: the original exterior comparison pair used on the homepage.
- `projects/`: all 32 original site photographs for the twelve published projects, grouped by project number. Store every future portfolio photo in `projects/<project-number>/`; see `projects/README.md`.

Reference images through static imports, never a local computer path or a `/src/assets/` URL:

```tsx
import Image from 'next/image';
import rooftopImage from '@/assets/services/rooftop-waterproofing-new.jpg';

<Image src={rooftopImage} alt="Worker coating a rooftop" />;
```

Next.js includes imported images in its production assets under `/_next/static/media/`, generates their public URLs, and reads their dimensions automatically. Missing imports fail the build. Images are served without access to the original computer's Pictures folder.

Preserve original image contents. The supplied `.jfif` files contain JPEG data and were copied as `.jpg` without re-encoding. Source details and approval records are documented in `ASSETS.md`.
