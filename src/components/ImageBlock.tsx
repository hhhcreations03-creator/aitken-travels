import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  caption?: string;
}

export function ImageBlock({ src, alt, aspect = "aspect-[4/3]", sizes = "(min-width: 1024px) 50vw, 100vw", priority = false, className = "", caption }: Props) {
  return (
    <figure className={className}>
      <div className={`img-frame ${aspect}`}>
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
      {caption && <figcaption className="small mt-3 text-charcoal-mute">{caption}</figcaption>}
    </figure>
  );
}
