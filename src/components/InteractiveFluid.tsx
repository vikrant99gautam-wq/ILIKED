"use client";
import { useEffect, useRef } from "react";

export default function InteractiveFluid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: width / 2, y: height / 2 };
    const target = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    let time = 0;
    let animationFrameId: number;

    const render = () => {
      time += 0.005;
      
      // Smooth follow physics
      mouse.x += (target.x - mouse.x) * 0.05;
      mouse.y += (target.y - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Mouse Blob (Electric Blue)
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, width * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#246BFD';
      ctx.fill();

      // Automated Blob 1 (Coral Red)
      const x2 = width / 2 + Math.cos(time) * (width * 0.3);
      const y2 = height / 2 + Math.sin(time * 0.8) * (height * 0.3);
      ctx.beginPath();
      ctx.arc(x2, y2, width * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#FF3F4F';
      ctx.fill();

      // Automated Blob 2 (Fresh Green/Gold)
      const x3 = width / 2 + Math.sin(time * 1.2) * (width * 0.2);
      const y3 = height / 2 + Math.cos(time * 0.9) * (height * 0.3);
      ctx.beginPath();
      ctx.arc(x3, y3, width * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#e5a93d';
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full filter blur-[100px] md:blur-[160px] opacity-30 mix-blend-multiply"
      />
    </div>
  );
}
