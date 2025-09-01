"use client";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function useDockItemSize(mouseX, baseItemSize, magnification, distance, ref, spring) {
  const mouseDistance = useTransform(mouseX, v => {
    if (typeof v !== "number" || isNaN(v)) return 0;
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return v - rect.x - baseItemSize / 2;
  });
  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  return useSpring(targetSize, spring);
}

function DockItem({ icon, label, onClick, mouseX, baseItemSize, magnification, distance, spring, badgeCount }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);
  const size = useDockItemSize(mouseX, baseItemSize, magnification, distance, ref, spring);
  const [showLabel, setShowLabel] = useState(false);
  useEffect(() => {
    const u = isHovered.on("change", v => setShowLabel(v === 1));
    return () => u();
  }, [isHovered]);
  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className="relative inline-flex items-center justify-center rounded-full bg-[#0b1220]/70 backdrop-blur-md shadow-md ring-1 ring-white/10"
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      <div className="flex items-center justify-center">{icon}</div>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
      <AnimatePresence>
        {showLabel && !!label && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-white/10 bg-[#060a12] px-2 py-0.5 text-xs text-white/90"
            style={{ x: "-50%" }}
            role="tooltip"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 72,
  dockHeight = 240,
  baseItemSize = 56,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const maxHeight = useMemo(() => Math.max(dockHeight, magnification + magnification / 2 + 4), [magnification, dockHeight]);
  const animatedHeight = useSpring(useTransform(isHovered, [0, 1], [panelHeight, maxHeight]), spring);

  return (
    <motion.div style={{ height: animatedHeight }} className="pointer-events-none">
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 transform flex items-end gap-4 w-fit rounded-2xl border border-white/10 bg-[#09111b]/70 backdrop-blur-xl px-4 pb-3 pt-2 shadow-2xl pointer-events-auto ${className}`}
        style={{ height: panelHeight, zIndex: 50 }}
        role="toolbar"
        aria-label="Quick access dock"
      >
        {items.map((item, i) => (
          <DockItem
            key={i}
            icon={item.icon}
            label={item.label}
            onClick={item.onClick}
            mouseX={mouseX}
            baseItemSize={baseItemSize}
            magnification={magnification}
            distance={distance}
            spring={spring}
            badgeCount={item.badgeCount}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
