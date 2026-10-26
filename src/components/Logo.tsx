import Image from "next/image";
import Link from "next/link";
import brand from "@/lib/brand-assets.json";

interface LogoProps {
  /** Cream artwork for dark or photographic backgrounds. */
  light?: boolean;
  /** Full stacked logo (palms above the name) instead of the horizontal header lockup. */
  stacked?: boolean;
  className?: string;
  priority?: boolean;
}

const v = (light: boolean) => (light ? "-light" : "");

/**
 * The Lavish Haven logo, built from the official artwork in assets/brand/.
 * Run `npm run brand` after replacing the source files.
 */
export function Logo({ light = false, stacked = false, className = "", priority = false }: LogoProps) {
  if (stacked) {
    const h = 150;
    return (
      <Link href="/" aria-label="The Lavish Haven, home" className={`inline-block ${className}`}>
        <Image
          src={`/brand/logo${v(light)}.png`}
          alt=""
          width={Math.round((brand.logo.width / brand.logo.height) * h)}
          height={h}
          priority={priority}
          className="h-[150px] w-auto"
        />
      </Link>
    );
  }

  const h = 46;
  return (
    <Link href="/" aria-label="The Lavish Haven, home" className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src={`/brand/symbol${v(light)}.png`}
        alt=""
        width={Math.round((brand.symbol.width / brand.symbol.height) * h)}
        height={h}
        priority={priority}
        className="h-[40px] w-auto lg:h-[46px]"
      />
      <Image
        src={`/brand/wordmark${v(light)}.png`}
        alt=""
        width={Math.round((brand.wordmark.width / brand.wordmark.height) * h)}
        height={h}
        priority={priority}
        className="h-[40px] w-auto lg:h-[46px]"
      />
    </Link>
  );
}
