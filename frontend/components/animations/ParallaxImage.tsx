"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  speed?: number;
}

export default function ParallaxImage({ src, alt, priority, className, speed = 0.5 }: ParallaxImageProps) {
  const container = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!container.current || !image.current) return;

    const yVal = speed * 100;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        scrub: true,
        start: "top bottom",
        end: "bottom top",
      },
    });

    tl.fromTo(
      image.current,
      { y: -yVal },
      { y: yVal, ease: "none" }
    );

    return () => {
      tl.kill();
    };
  }, [speed]);

  return (
    <div ref={container} className={`relative overflow-hidden ${className || ""}`}>
      <div className="absolute inset-[-20%]">
        <Image
          ref={image}
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
        />
      </div>
    </div>
  );
}
