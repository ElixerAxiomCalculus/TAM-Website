import { cn } from "../lib/utils";

export default function AuroraTextEffect({
  text,
  className,
  textClassName,
  fontSize = "clamp(3rem, 8vw, 7rem)",
  colors = {
    first: "#22d3ee",
    second: "#60a5fa",
    third: "#a78bfa",
    fourth: "#0ea5e9",
  },
  animationSpeed = {
    first: 8,
    second: 10,
    third: 12,
    fourth: 14,
  },
}) {
  const keyframes = `
    @keyframes aurora-move-1 { 0%{background-position:0% 0%} 50%{background-position:80% 50%} 100%{background-position:0% 0%} }
    @keyframes aurora-move-2 { 0%{background-position:100% 20%} 50%{background-position:20% 80%} 100%{background-position:100% 20%} }
    @keyframes aurora-move-3 { 0%{background-position:20% 100%} 50%{background-position:70% 10%} 100%{background-position:20% 100%} }
    @keyframes aurora-move-4 { 0%{background-position:60% 60%} 50%{background-position:0% 0%} 100%{background-position:60% 60%} }
  `;

  const bg =
    `radial-gradient(35% 60% at 10% 20%, ${colors.first}55 0%, transparent 60%),` +
    `radial-gradient(40% 55% at 80% 30%, ${colors.second}55 0%, transparent 60%),` +
    `radial-gradient(45% 70% at 30% 90%, ${colors.third}55 0%, transparent 65%),` +
    `radial-gradient(50% 65% at 70% 70%, ${colors.fourth}55 0%, transparent 65%)`;

  return (
    <div className={cn("bg-transparent dark:bg-transparent flex items-center justify-center overflow-visible", className)}>
      <style>{keyframes}</style>
      <h1
        className={cn("relative font-extrabold tracking-tight text-transparent select-none", textClassName)}
        style={{
          fontSize,
          WebkitTextFillColor: "transparent",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          backgroundImage: bg,
          backgroundSize: "200% 200%, 220% 220%, 240% 240%, 200% 200%",
          animation: `
            aurora-move-1 ${animationSpeed.first}s ease-in-out infinite alternate,
            aurora-move-2 ${animationSpeed.second}s ease-in-out infinite alternate,
            aurora-move-3 ${animationSpeed.third}s ease-in-out infinite alternate,
            aurora-move-4 ${animationSpeed.fourth}s ease-in-out infinite alternate
          `,
        }}
      >
        {text}
      </h1>
    </div>
  );
}
