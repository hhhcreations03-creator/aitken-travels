import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  caption?: string;
  /** Which part of the photo to keep when the frame crops it, e.g. "object-bottom". */
  focus?: string;
}

export function ImageBlock({ src, alt, aspect = "aspect-[4/3]", sizes = "(min-width: 1024px) 50vw, 100vw", priority = false, className = "", caption, focus = "" }: Props) {
  return (
    <figure className={className}>
      <div className={`img-frame ${aspect}`}>
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={`object-cover ${focus}`} />
      </div>
      {caption && <figcaption className="small mt-3 text-charcoal-mute">{caption}</figcaption>}
    </figure>
  );
}
