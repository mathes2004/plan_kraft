# Asset register

| Asset                              | Source                                           | Status                                             | Use                                                                            |
| ---------------------------------- | ------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| User-selected reference logo | https://plan-kraft-roof-protection.socialrook16.chatgpt.site/ | Copied unchanged SVG paths and matching wordmark styling, as requested | Shared `BrandLogo.tsx` in header and footer |
| Interactive homepage house | https://plan-kraft-roof-protection.socialrook16.chatgpt.site/ | User-requested reference banner; house scene and renderer copied locally, controls and layout adapted | Home banner in `public/banner/`; Three.js r169 and font licenses included beside local dependencies |
| Rooftop architectural illustration | Repository-native SVG in `src/components/ui.tsx` | Illustration only | Fallback when no approved rooftop project photograph is available |
| Service images 01-09 | Nine numbered local image files supplied by the user, listed below | User-selected images copied without modifying their contents; not automatically published as portfolio projects | `src/assets/services/`; static imports and shared `image` mapping in `src/data/services.ts` for the Services page and homepage previews |
| Genuine project photos | Seventeen originals supplied by the user for projects 335, 333, 318, 316, 314 and 310 | Explicitly authorized for publication in the user's project-showcase requests | `src/assets/projects/`; six Projects page showcases; the original three featured records remain on the homepage; completed rooftop photograph also used on About |
| Exterior BEFORE photograph | User-provided `832835973_1068602759141192_771004835693052204_n.jpg` | User-approved for homepage comparison; original 2048 x 1153 photo copied without modification | `src/assets/before-after/exterior-before.jpg` |
| Exterior AFTER photograph | User-provided `830540272_1068600839141384_144411095039607790_n.jpg` | User-approved for homepage comparison; original 1672 x 941 photo copied without modification | `src/assets/before-after/exterior-after.jpg` |
| Homepage before/after pair | The two original exterior photographs supplied by the user | Same project viewed from different angles; caption explains the viewpoints. No locations, dates or product details inferred | `homepageComparison` in `src/data/projects.ts`; homepage comparison only |
| Facebook page                      | User-provided profile URL                        | Provided by business; content could not be fetched | Footer social link                                                             |
| Office entrance pin                | Business confirmation required                   | Pending                                            | Current map honestly uses an address search                                    |

For each photo added, record original filename/source, written business approval, service, truthful title, dimensions and any confirmed details. Do not infer locations, products, dates or results. Approve each image individually. Keep `published` false until the record is reviewed.

## Service image mapping

| Number | Service | User-supplied source filename | Local filename | Dimensions |
| --- | --- | --- | --- | --- |
| 01 | Roof / Rooftop Waterproofing | Rooftop waterproofing.webp | rooftop-waterproofing.webp | 1024 x 768 |
| 02 | Bathroom Waterproofing | Bathroom Waterproofing.webp | bathroom-waterproofing.webp | 720 x 960 |
| 03 | Terrace / Balcony Waterproofing | Balcony Waterproofing.jpg | balcony-waterproofing.jpg | 1024 x 768 |
| 04 | Basement Waterproofing | Basement Waterproofing.jpg | basement-waterproofing.jpg | 2048 x 1153 |
| 05 | Water Tank Waterproofing | Water Tank Waterproofing.jfif | water-tank-waterproofing.jpg | 499 x 375 |
| 06 | Swimming Pool Waterproofing | Swimming Pool Waterproofing.jfif | swimming-pool-waterproofing.jpg | 447 x 447 |
| 07 | Concrete Crack Repair | Concrete Crack Repair.jfif | concrete-crack-repair.jpg | 405 x 389 |
| 08 | Wall Leakage / Dampness Treatment | Dampness Treatment.jfif | dampness-treatment.jpg | 547 x 365 |
| 09 | Commercial / Industrial Waterproofing | Industrial Waterproofing.jfif | industrial-waterproofing.jpg | 516 x 387 |

The supplied JFIF files contain JPEG images and are copied byte-for-byte with `.jpg` filenames. The homepage's three previews use the same Rooftop, Bathroom and Balcony images as services 01-03.

## Completed project photographs

The user supplied all seventeen photographs from their Pictures folder and explicitly requested that they be added to the project showcase. Each was copied byte-for-byte; SHA-256 hashes were checked against the originals. All destinations below are relative to `src/assets/projects/` and are statically imported by `src/data/projects.ts`.

| Project | Original filename | Destination | Dimensions | Use / caption |
| --- | --- | --- | --- | --- |
| 335 | img1-1.jpg | 335/bathroom-coating-application.jpg | 590 x 442 | Waterproof coating application |
| 335 | img1-2.jpg | 335/bathroom-pipe-reinforcement.jpg | 1198 x 1600 | Pipe penetration reinforcement |
| 335 | 1-3.jpg | 335/bathroom-completed-waterproofing.jpg | 1198 x 1600 | Completed bathroom waterproofing; cover |
| 333 | img2-1.jpg | 333/rooftop-surface-preparation.jpg | 1198 x 1600 | Surface preparation |
| 333 | img2-2.jpg | 333/rooftop-coating-application.jpg | 1600 x 1198 | Waterproof coating application |
| 333 | 2-3.jpg | 333/rooftop-completed-waterproofing.jpg | 1600 x 1198 | Completed rooftop protection; cover |
| 316 | img3-1.jpg | 316/sump-tank-waterbar-overview.jpg | 963 x 1280 | Waterbar and reinforcement overview |
| 316 | 3-2.jpg | 316/sump-tank-waterbar-installation.jpg | 2048 x 1153 | Waterbar installation |
| 316 | 3-3.jpg | 316/sump-tank-waterbar-detail.jpg | 2048 x 1153 | Construction joint and corner detail; cover |
| 318 | img4-1.jpg | 318/tile-grout-removal.jpg | 2048 x 1153 | Existing grout removal |
| 318 | img4-2.jpg | 318/epoxy-grout-application.jpg | 1153 x 2048 | Epoxy grout application |
| 318 | img4-3.jpg | 318/epoxy-grout-finishing.jpg | 2048 x 1153 | Epoxy grout finishing; cover |
| 314 | img5-1.jpg | 314/rooftop-surface-preparation.jpg | 1600 x 720 | Rooftop surface preparation |
| 314 | img5-2.jpg | 314/rooftop-completed-coating.jpg | 1600 x 720 | Completed rooftop coating; cover |
| 310 | 6-3.jpg | 310/sump-base-surface-preparation.jpg | 2048 x 1153 | Concrete base preparation |
| 310 | img6-1.jpg | 310/sump-base-reinforcement.jpg | 1280 x 963 | Base reinforcement and coating |
| 310 | img6-2.jpg | 310/sump-base-coating-application.jpg | 1204 x 1600 | Waterproof coating application; cover |

Descriptions were edited from the supplied posts, checked against the visible photographs, and limited to relevant project details. Client identities, street addresses and personal contact details are omitted. Only the city is retained. Generic rooftop/coating boilerplate was removed from the bathroom and waterbar records. The supplied project-specific 10-year warranty is displayed with a terms note. No project completion dates, tank dimensions, testing results or additional performance claims were inferred. These stage photographs are presented as galleries rather than matched before/after images.

Project 318 has no stated duration or warranty; both are omitted. Its category is Epoxy Grout Restoration and its enquiry uses the existing terrace service, matching the pictured tiled terrace. Project 314 is included in both Rooftop and Bathroom filters; its two supplied photographs show rooftop preparation and coating only. Project 310 describes sump-tank base preparation, reinforcement and coating rather than the post's copied rooftop boilerplate. The 318 and 310 cover photos show work in progress within projects reported completed by the user, and their captions describe the visible stages. Original brand/date watermarks remain unchanged. No EXIF metadata was present in the eight new files.
