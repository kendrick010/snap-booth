"use client";

import { useEffect, useRef } from "react";
// import { Gradient } from '@/lib/gradient.js'

export default function StripeGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // useEffect(() => {
  //   if (!canvasRef.current) return;

  //   const gradient = new Gradient() as any;
  //   gradient.initGradient("#gradient-canvas");

  //   const handleResize = () => gradient.resize();
  //   window.addEventListener("resize", handleResize);

  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <canvas
      id="gradient-canvas"
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
      }}
    />
  );
}