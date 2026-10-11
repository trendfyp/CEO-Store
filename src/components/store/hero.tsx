import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { getProductBySlug } from "@/data/catalog";

const FEATURED = "halo-arc";
const DUST = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export function Hero() {
  const product = getProductBySlug(FEATURED);
  const rig = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const node = rig.current;
    const stage = node?.parentElement;
    if (!node || !stage) return;

    let raf = 0;
    let pointerX = 0;
    let pointerY = 0;
    let usingPointer = false;
    let tiltX = 0;
    let tiltY = 0;
    let usingTilt = false;
    let running = true;

    const paint = (time: number) => {
      if (!running) return;
      const drift = reduce ? 0 : Math.sin(time / 1800) * 12;
      const ry = usingPointer ? pointerX * 18 : usingTilt ? tiltY : drift;
      const rx = usingPointer ? pointerY * -12 : usingTilt ? tiltX : 7;
      const bob = reduce ? 0 : Math.sin(time / 1400) * 8;
      node.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(${bob}px)`;
      raf = requestAnimationFrame(paint);
    };

    const onPointer = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
      usingPointer = true;
    };
    const onLeave = () => {
      usingPointer = false;
    };
    const onOrient = (event: DeviceOrientationEvent) => {
      if (usingPointer) return;
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 45;
      if (gamma === 0 && beta === 0) return;
      usingTilt = true;
      tiltY = Math.max(-18, Math.min(18, gamma / 4));
      tiltX = Math.max(-12, Math.min(12, (beta - 45) / 5));
    };

    stage.addEventListener("pointermove", onPointer);
    stage.addEventListener("pointerleave", onLeave);
    window.addEventListener("deviceorientation", onOrient);
    raf = requestAnimationFrame(paint);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onPointer);
      stage.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, []);

  if (!product) return null;

  return (
    <section className="hero wrap grid items-center gap-8 py-8 md:grid-cols-2 md:py-10">
      <div>
        <p className="eyebrow rise">Sample showroom</p>
        <h1 className="rise rise-2 mt-4 font-display text-5xl text-fg md:text-7xl">
          Objects,
          <span className="mt-1 block text-gold-2 italic">considered.</span>
        </h1>
        <p className="rise rise-3 mt-6 max-w-md text-base text-muted md:text-lg">
          A quiet catalogue of lamps, sound, and small instruments. Prices are samples in US dollars.
          Nothing here is a live supplier listing, and nothing can be paid for yet.
        </p>
        <div className="rise rise-4 mt-8 flex flex-wrap gap-3">
          <Link to="/shop" search={{ category: "all", q: "" }} className="btn btn-gold">
            Enter the showroom
          </Link>
          <Link to="/product/$slug" params={{ slug: product.slug }} className="btn btn-line">
            View the {product.name}
          </Link>
        </div>
      </div>

      <div className="stage stage-box relative mx-auto w-full max-w-lg">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {DUST.map((index) => (
            <span key={index} className={`dust dust-${index}`} />
          ))}
        </div>
        <div className="orbit" aria-hidden />
        <div ref={rig} className="rig absolute inset-x-8 top-6">
          <img
            src={product.image}
            alt={`${product.name}, the featured sample`}
            width={1200}
            height={1600}
            className="hero-photo mx-auto w-auto object-contain"
          />
          <img
            src={product.image}
            alt=""
            aria-hidden
            className="reflection hero-reflect mx-auto object-contain"
          />
        </div>
        <div className="pedestal absolute right-0 bottom-8 left-0" aria-hidden />
        <p className="absolute right-0 bottom-0 left-0 text-center text-xs tracking-widest text-faint uppercase">
          Move or tilt · {product.name}
        </p>
      </div>
    </section>
  );
}
