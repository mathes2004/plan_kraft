import Image, { type StaticImageData } from 'next/image';
import type { CSSProperties } from 'react';

type ServiceImage = {
  src: StaticImageData;
  alt: string;
  contentHeight?: number;
};

export function ServicePhoto({ image, sizes }: { image: ServiceImage; sizes: string }) {
  if (image.contentHeight) {
    const framing = {
      '--service-image-ratio': image.src.width / image.contentHeight,
    } as CSSProperties;

    return (
      <div className="service-graphic service-photo service-photo-contained" style={framing}>
        <div className="service-image-frame">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            style={{
              height: `${(image.src.height / image.contentHeight) * 100}%`,
              objectFit: 'fill',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="service-graphic service-photo">
      <Image src={image.src} alt={image.alt} fill sizes={sizes} />
    </div>
  );
}
