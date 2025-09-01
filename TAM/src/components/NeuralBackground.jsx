"use client";
import { useEffect, useMemo, useRef, useState } from "react";

export default function NeuralBackground({
  nodeDensity = 0.12,
  linkDistance = 160,
  speed = 0.35,
  scrollStrength = 0.35,
  nodeColor = "rgba(120, 220, 255, 0.9)",
  lineColor = "rgba(80, 200, 255, 0.35)",
  glow = 12,
  opacity = 1,
  interactive = true,
  gradient = ["#001018", "#000000"]
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const nodesRef = useRef([]);
  const velRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null });
  const [dpr, setDpr] = useState(1);
  const reduced = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const cfg = useRef({ w: 0, h: 0, link: linkDistance, speed, scroll: 0 });

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const setSize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      setDpr(ratio);
      const w = window.innerWidth;
      const h = window.innerHeight;
      c.width = Math.floor(w * ratio);
      c.height = Math.floor(h * ratio);
      c.style.width = w + "px";
      c.style.height = h + "px";
      cfg.current.w = c.width;
      cfg.current.h = c.height;
      const area = (w * h) / 10000;
      const count = Math.max(40, Math.floor(area * nodeDensity));
      nodesRef.current = new Array(count).fill(0).map(() => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        r: Math.random() * (2.2 * ratio) + (1.1 * ratio)
      }));
      velRef.current = nodesRef.current.map(() => ({
        x: (Math.random() - 0.5) * cfg.current.w * 0.0001,
        y: (Math.random() - 0.5) * cfg.current.h * 0.0001
      }));
    };
    setSize();
    const onResize = () => setSize();
    const onScroll = () => {
      cfg.current.scroll = window.scrollY;
    };
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    if (interactive) {
      const onMove = (e) => {
        const rect = c.getBoundingClientRect();
        mouseRef.current.x = (e.clientX - rect.left) * dpr;
        mouseRef.current.y = (e.clientY - rect.top) * dpr;
      };
      const onLeave = () => {
        mouseRef.current.x = null;
        mouseRef.current.y = null;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave, { passive: true });
    }

    const draw = (t) => {
      const { w, h } = cfg.current;
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, gradient[0]);
      grd.addColorStop(1, gradient[1]);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const vels = velRef.current;
      const baseSpeed = reduced ? 0 : cfg.current.w * 0.00003 * cfg.current.speed;
      const scrollInfluence = reduced ? 0 : (cfg.current.scroll % h) / h;
      const driftX = Math.sin(t * 0.0003) * 0.35 * dpr + scrollInfluence * scrollStrength * dpr;
      const driftY = Math.cos(t * 0.0004) * 0.35 * dpr + scrollInfluence * 0.5 * scrollStrength * dpr;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const v = vels[i];
        n.x += v.x * baseSpeed * dpr + driftX;
        n.y += v.y * baseSpeed * dpr + driftY;
        if (n.x < 0) n.x = w;
        if (n.x > w) n.x = 0;
        if (n.y < 0) n.y = h;
        if (n.y > h) n.y = 0;
      }

      const link = cfg.current.link * dpr;
      ctx.save();
      ctx.lineWidth = 1 * dpr;
      ctx.shadowColor = lineColor.replace("0.35", "0.7");
      ctx.shadowBlur = glow * dpr;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < link) {
            const a = 1 - dist / link;
            ctx.strokeStyle = lineColor.replace("0.35", (0.15 + a * 0.5).toFixed(3));
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      ctx.save();
      ctx.shadowColor = nodeColor;
      ctx.shadowBlur = glow * 1.2 * dpr;
      ctx.fillStyle = nodeColor;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        let r = n.r;
        if (interactive && mouseRef.current.x !== null) {
          const dx = n.x - mouseRef.current.x;
          const dy = n.y - mouseRef.current.y;
          const d = Math.hypot(dx, dy);
          if (d < 180 * dpr) r = n.r + (1 - d / (180 * dpr)) * 2 * dpr;
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (interactive) {
        window.removeEventListener("pointermove", () => {});
        window.removeEventListener("pointerleave", () => {});
      }
    };
  }, [nodeDensity, linkDistance, speed, scrollStrength, nodeColor, lineColor, glow, opacity, interactive, gradient, dpr, reduced]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
