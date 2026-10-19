# Asset register

| Asset                              | Source                                           | Status                                             | Use                                                                            |
| ---------------------------------- | ------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| Original Plan Kraft logo | User-provided `C:\Users\ASUS\Pictures\logo.jpg` | Original 1080 x 608 JPEG copied byte-for-byte; SHA-256 verified. No redraw or re-encoding | `src/assets/brand/plan-kraft-logo.jpg`; shared `BrandLogo.tsx` in header and footer; CSS frames the artwork without stretching it |
| Browser tab icon | Original Plan Kraft JPEG above | Self-contained SVG wrapper embeds the original image bytes unchanged within a square viewport | `public/brand/plan-kraft-icon.svg`; base-path-aware icon metadata in the root layout |
| Interactive homepage house | https://plan-kraft-roof-protection.socialrook16.chatgpt.site/ | User-requested reference banner; house scene and renderer copied locally, controls and layout adapted | Home banner in `public/banner/`; Three.js r169 and font licenses included beside local dependencies |
| Rooftop architectural illustration | Repository-native SVG in `src/components/ui.tsx` | Illustration only | Fallback when no approved rooftop project photograph is available |
| Service images 01-16 | Sixteen numbered local image files supplied by the user, listed below | User-requested service images and promotional artwork, copied without modifying their contents | `src/assets/services/`; shared static imports in `src/data/services.ts` for the Services page and homepage previews |
| Genuine project photos | Thirty-two originals supplied by the user for twelve projects, listed below | Explicitly authorized for publication in the user's project-showcase requests | `src/assets/projects/<project-number>/`; twelve Projects page showcases; the original three featured records remain on the homepage; completed rooftop photograph also used on About |
| Exterior BEFORE photograph | User-provided `832835973_1068602759141192_771004835693052204_n.jpg` | User-approved for homepage comparison; original 2048 x 1153 photo copied without modification | `src/assets/before-after/exterior-before.jpg` |
| Exterior AFTER photograph | User-provided `830540272_1068600839141384_144411095039607790_n.jpg` | User-approved for homepage comparison; original 1672 x 941 photo copied without modification | `src/assets/before-after/exterior-after.jpg` |
| Homepage before/after pair | The two original exterior photographs supplied by the user | Same project viewed from different angles; caption explains the viewpoints. No locations, dates or product details inferred | `homepageComparison` in `src/data/projects.ts`; homepage comparison only |
| Facebook page                      | User-provided profile URL                        | Provided by business; content could not be fetched | Footer social link                                                             |
| Office entrance pin                | Business confirmation required                   | Pending                                            | Current map honestly uses an address search                                    |

For each photo added, record original filename/source, written business approval, service, truthful title, dimensions and any confirmed details. Do not infer locations, products, dates or results. Approve each image individually. Keep `published` false until the record is reviewed.

## Service image mapping

| Number | Service | User-supplied source filename | Local filename | Dimensions |
| --- | --- | --- | --- | --- |
| 01 | Rooftop Waterproofing | Roof top waterproofing new.jfif | rooftop-waterproofing-new.jpg | 1080 x 933 |
| 02 | Bathroom Waterproofing | Bathroom Waterproofing.jpeg | bathroom-waterproofing-stages.jpg | 1536 x 1024 |
| 03 | Terrace / Balcony Waterproofing | Balcony Waterproofing1.jpg | balcony-waterproofing.jpg | 1198 x 1600 |
| 04 | Basement Waterproofing | Basement Waterproofing.jpg | basement-waterproofing.jpg | 2048 x 1153 |
| 05 | Water Tank Waterproofing | Water Tank Waterproofing.jpg | water-tank-waterproofing.jpg | 1200 x 1600 |
| 06 | Swimming Pool Waterproofing | Swimming Pool Waterproofing.jfif | swimming-pool-waterproofing.jpg | 387 x 516 |
| 07 | Concrete Crack Repair | Concrete Crack Repair.jpg | concrete-crack-repair.jpg | 1198 x 1600 |
| 08 | Wall Leakage / Dampness Treatment | Wall Leakage.jpg | wall-leakage.jpg | 1280 x 576 |
| 09 | Commercial / Industrial Waterproofing | Industrial Waterproofing.jfif | industrial-waterproofing.jpg | 516 x 387 |
| 10 | External Wall Waterproofing | Exernal Wall Waterproofing.jpg | external-wall-waterproofing.jpg | 1600 x 1204 |
| 11 | Epoxy Grouting | Epoxy Grouting.jfif | epoxy-grouting.jpg | 1086 x 1448 |
| 12 | Fiber Paint Application | Faiber paint application.jfif | fiber-paint-application.jpg | 1600 x 1200 |
| 13 | Polyurethane Coating Application | Polyurethane coating application.jfif | polyurethane-coating-application.jpg | 576 x 1280 |
| 14 | Sand Epoxy Flooring | Sand Epoxy Flooring.jpeg | sand-epoxy-flooring.jpg | 1024 x 1536 |
| 15 | Rooftop Heat Proofing | Rooftop Heat Proofing.jpeg | rooftop-heat-proofing.jpg | 1312 x 1199 |
| 16 | Roof Waterproofing | Roof Waterproofing (2).jpeg | roof-waterproofing-membrane.jpg | 1054 x 1492 |

Sources are in `C:\Users\ASUS\Pictures`. All sixteen current originals were copied byte-for-byte into both the active project's `src/assets/services/` directory and the user-requested `C:\Users\ASUS\Documents\GitHub\plan_kraft\src\assets\services` directory; SHA-256 hashes were checked against the originals. The supplied JFIF and JPEG files use `.jpg` destination filenames without re-encoding. The homepage's three previews share images and links with Epoxy Grouting, Fiber Paint Application and Polyurethane Coating Application (services 11-13), selected explicitly through `homepageServices`. Service 01 was renamed to Rooftop Waterproofing and its photograph replaced at the user's request; its description and navigation ID are unchanged. All sixteen services are available in the enquiry form, with distinct Rooftop Waterproofing and Roof Waterproofing entries.

Services 01, 02, 11, 14 and 16 use proportional framing through `ServicePhoto.tsx`. On Our Services, these five boxes fill the existing image-column width and derive their height from the visible image's aspect ratio, eliminating internal gaps without changing the grid, alignment or row spacing. The three homepage service previews use a shared 1086:1280 portrait ratio with full-width frames, removing internal letterboxing while keeping image edges and card text aligned. The complete Epoxy Grouting service-content region remains visible; the two photographic previews retain their natural proportions with cover framing. Service 01 shows the complete rooftop photo. Service 02 uses the complete 1536 x 1024 bathroom-waterproofing stages image, replaced at the user's request without editing its contents; all four panels and the full artwork are visible. The posters show their full width and the service-content region: 1086 x 1280 for Epoxy Grouting, 1024 x 1408 for Sand Epoxy Flooring, and 1054 x 850 for Roof Waterproofing. Only outdated contact footers and, in the roof poster, the lower project/client information are excluded. No zoom transform is used, and original files remain untouched. Service 16 now uses the supplied torch-on membrane artwork, replacing its earlier duplicate heat-proofing illustration. Promotional graphics and illustrations are not presented as genuine completed-project photographs. Older unused service assets remain unreferenced.

## Completed project photographs

The user supplied all thirty-two photographs from their Pictures folder and explicitly requested that they be added to the project showcase. Each was copied byte-for-byte; SHA-256 hashes were checked against the originals. All destinations below are relative to `src/assets/projects/` and are statically imported by `src/data/projects.ts`. All 32 project photographs are also saved under `C:\Users\ASUS\Documents\GitHub\plan_kraft\src\assets\projects`. Store every future project image in this shared project-assets folder, grouped by project number.

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
| 331 | 7-1.jpg | 331/external-wall-surface-treatment.jpg | 2048 x 1153 | External wall surface treatment |
| 331 | 7-2.jpg | 331/external-wall-application-overview.jpg | 2048 x 1153 | Exterior work in progress |
| 331 | 7-3.jpg | 331/external-wall-completed-finish.jpg | 1672 x 941 | Completed exterior finish; cover |
| 323 | 8-1.jpg | 323/bathroom-coated-wall-junctions.jpg | 900 x 1600 | Coated walls and junctions |
| 323 | 8-2.jpg | 323/bathroom-completed-waterproofing.jpg | 900 x 1600 | Completed bathroom waterproofing; cover |
| 313 | 9-1.jpg | 313/rooftop-coated-surface.jpg | 1280 x 576 | Coated rooftop surface; cover |
| 313 | 9-2.jpg | 313/rooftop-junction-reinforcement.jpg | 1204 x 1600 | Rooftop joint reinforcement |
| 313 | 9-3.jpg | 313/rooftop-coating-application.jpg | 720 x 1600 | Waterproof coating application |
| 306 | 10-2.jpg | 306/tank-waterproofed-interior.jpg | 1204 x 1600 | Coated tank interior; cover |
| 306 | 10-3.jpg | 306/tank-wall-junction-detail.jpg | 1204 x 1600 | Tank wall and base junctions |
| 302 | 11-1.jpg | 302/external-wall-scaffold-access.jpg | 1204 x 1600 | Exterior wall work and access |
| 302 | 11-2.jpg | 302/external-wall-coating-application.jpg | 1600 x 1204 | External wall coating application; cover |
| 302 | 11-3.jpg | 302/external-wall-surface-preparation.jpg | 720 x 1600 | External wall surface preparation |
| 299 | 12-1.jpg | 299/lift-well-wall-coating.jpg | 1600 x 720 | Concrete wall coating application; cover |
| 299 | 12-2.jpg | 299/lift-well-exterior-coating.jpg | 720 x 1600 | Exterior concrete wall treatment |

Descriptions were edited from the supplied posts, checked against the visible photographs, and limited to relevant project details. Client identities, street addresses and personal contact details are omitted. Only the city is retained. Generic rooftop/coating boilerplate was removed from the bathroom and waterbar records. The supplied project-specific 10-year warranty is displayed with a terms note. No project completion dates, tank dimensions, testing results or additional performance claims were inferred. These stage photographs are presented as galleries rather than matched before/after images.

Project 318 has no stated duration or warranty; both are omitted. Its category is Epoxy Grout Restoration and its enquiry uses the existing terrace service, matching the pictured tiled terrace. Project 314 is included in both Rooftop and Bathroom filters; its two supplied photographs show rooftop preparation and coating only. Project 310 describes sump-tank base preparation, reinforcement and coating rather than the post's copied rooftop boilerplate. The 318 and 310 cover photos show work in progress within projects reported completed by the user, and their captions describe the visible stages. Original brand/date watermarks remain unchanged. No EXIF metadata was present in the eight new files.

The six added projects (331, 323, 313, 306, 302 and 299) retain only the supplied city, material names, duration, coverage and project-specific warranty. Generic rooftop text was corrected for the external wall, tank and lift-well work. Project 331 covers 3,360 sq ft and has a five-year warranty; project 302 also has a five-year warranty. The other four supplied projects have ten-year warranties, displayed with the existing terms note. The 302 and 299 cover photographs show coating work in progress within projects the user reported completed. Project 299 uses the Basement Waterproofing enquiry option for its below-ground scope. None of the new photos are presented as paired before/after comparisons, and the original homepage featured projects are preserved.
