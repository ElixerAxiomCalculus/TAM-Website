// src/components/ScrollStack.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";

export default function ScrollStack({
  cards,
  cardHeight = "60vh",
  animationDuration = "0.5s",
  sectionHeightMultiplier = 3,
  intersectionThreshold = 0.1,
  className = "",
}) {
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ticking = useRef(false);
  const cardCount = Math.min(cards.length, 5);

  const gradients = [
    "linear-gradient(135deg, #0ea5e9 0%, #22d3ee 50%, #60a5fa 100%)",
    "radial-gradient(120% 120% at 10% 10%, #38bdf8 0%, rgba(56,189,248,0) 60%), linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 60%)",
    "linear-gradient(120deg, #67e8f9 0%, #22d3ee 40%, #1e40af 100%)",
    "linear-gradient(135deg, #06b6d4 0%, #22d3ee 40%, #60a5fa 100%)",
    "radial-gradient(120% 120% at 80% 20%, #4f46e5 0%, rgba(79,70,229,0) 60%), linear-gradient(135deg, #22d3ee 0%, #38bdf8 60%)",
  ];

  const cardStyle = {
    height: cardHeight,
    maxHeight: "520px",
    borderRadius: "22px",
    transition: `transform ${animationDuration} cubic-bezier(0.19, 1, 0.22, 1), opacity ${animationDuration} cubic-bezier(0.19, 1, 0.22, 1)`,
    willChange: "transform, opacity",
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: intersectionThreshold }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          if (!sectionRef.current || !cardsContainerRef.current) return;

          const sectionRect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const sectionTop = sectionRect.top;
          const sectionHeight = sectionRef.current.offsetHeight;
          const scrollableDistance = sectionHeight - viewportHeight;

          let progress = 0;
          if (sectionTop <= 0 && Math.abs(sectionTop) <= scrollableDistance) {
            progress = Math.abs(sectionTop) / scrollableDistance;
          } else if (sectionTop <= 0) {
            progress = 1;
          }

          let newActiveIndex = 0;
          const per = 1 / cardCount;
          for (let i = 0; i < cardCount; i++) if (progress >= per * (i + 1)) newActiveIndex = i + 1;

          setActiveCardIndex(Math.min(newActiveIndex, cardCount - 1));
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [cardCount, sectionHeightMultiplier, intersectionThreshold]);

  const getCardTransform = (index) => {
    const isVisible = isIntersecting && activeCardIndex >= index;
    const scale = 0.9 + index * 0.05;
    let translateY = "100px";
    if (isVisible) translateY = `${90 - index * 30}px`;
    return {
      transform: `translateY(${translateY}) scale(${scale})`,
      opacity: isVisible ? (index === 0 ? 0.9 : 1) : 0,
    };
  };

  return (
    <section className={`relative w-full overflow-visible ${className}`}>
      <div ref={sectionRef} className="relative" style={{ height: `${sectionHeightMultiplier * 85}vh` }}>
        <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-visible bg-transparent">
          <div className="w-full h-full flex flex-col justify-center">
            <div ref={cardsContainerRef} className="relative w-full max-w-[1200px] mx-auto" style={{ height: cardHeight }}>
              {cards.slice(0, 5).map((card, index) => {
                const t = getCardTransform(index);
                const bg = gradients[index % gradients.length];
                return (
                  <div
                    key={index}
                    className="absolute shadow-2xl"
                    style={{
                      ...cardStyle,
                      top: 0,
                      left: "50%",
                      transform: `translateX(-50%) ${t.transform}`,
                      width: "100%",
                      opacity: t.opacity,
                      background: bg,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "radial-gradient(100% 100% at 0% 0%, rgba(255,255,255,.18), rgba(0,0,0,0)), rgba(255,255,255,.05)",
                        mixBlendMode: "overlay",
                      }}
                    />
                    {card.badge && (
                      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 20 }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "8px 14px",
                            borderRadius: 999,
                            background: "rgba(255,255,255,.25)",
                            backdropFilter: "blur(6px)",
                            color: "#001018",
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {card.badge}
                        </div>
                      </div>
                    )}
                    <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex items-center">
                      {card.content ? (
                        card.content
                      ) : (
                        <div className="max-w-xl">
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                            {card.title}
                          </h3>
                          {card.subtitle && <p className="text-base sm:text-lg text-white/90">{card.subtitle}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
