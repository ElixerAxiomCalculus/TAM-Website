// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { DynamicNavigation } from "./components/lightswind/dynamic-navigation";
import { Home, CalendarDays, Info, Phone, Settings, Mail, List, Users, Map, BookOpen, CalendarCheck } from "lucide-react";
import { ScrollReveal } from "./components/lightswind/scroll-reveal";
import Dock from "./components/lightswind/Dock";
import ScrollStack from "./components/ScrollStack";
import NeuralBackground from "./components/NeuralBackground";
const links = [
  { id: "home", label: "Home", href: "/", icon: <Home /> },
  { id: "events", label: "Events", href: "/Events", icon: <CalendarDays /> },
  { id: "about", label: "About", href: "/about", icon: <Info /> },
  { id: "contact", label: "Contact", href: "/contact", icon: <Phone /> },
];

const cards = [
  { title: "Our Mission", subtitle: "Build, learn and share AI/ML through real projects, research and open collaboration.", badge: "Start" },
  { title: "Project Pods", subtitle: "Small teams shipping demos every month with mentorship and reviews.", badge: "Pods" },
  { title: "Events & Hackathons", subtitle: "Hands-on workshops, paper clubs and showcase nights.", badge: "Events" },
];

function usePathname() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    const onClick = (e) => {
      const a = e.target.closest("a[href]");
      if (!a) return;
      const url = new URL(a.href);
      if (url.origin === window.location.origin) {
        e.preventDefault();
        window.history.pushState({}, "", url.pathname + url.search + url.hash);
        setPath(url.pathname);
        if (url.hash) {
          const el = document.querySelector(url.hash);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return path;
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useDockItems(pathname) {
  return useMemo(() => {
    if (pathname === "/" || pathname === "/home") {
      return [
        { icon: <Home size={28} />, label: "", onClick: () => scrollToId("hero") },
        { icon: <BookOpen size={26} />, label: "Mission", onClick: () => scrollToId("mission") },
        { icon: <CalendarDays size={26} />, label: "Events", onClick: () => scrollToId("home-events") },
      ];
    }
    if (pathname.toLowerCase() === "/events") {
      return [
        { icon: <List size={26} />, label: "Overview", onClick: () => scrollToId("events-overview") },
        { icon: <CalendarCheck size={26} />, label: "Schedule", onClick: () => scrollToId("events-schedule") },
        { icon: <Map size={26} />, label: "Venues", onClick: () => scrollToId("events-venues") },
      ];
    }
    if (pathname.toLowerCase() === "/about") {
      return [
        { icon: <Users size={26} />, label: "Team", onClick: () => scrollToId("about-team") },
        { icon: <BookOpen size={26} />, label: "Story", onClick: () => scrollToId("about-story") },
        { icon: <Settings size={26} />, label: "FAQ", onClick: () => scrollToId("about-faq") },
      ];
    }
    if (pathname.toLowerCase() === "/contact") {
      return [
        { icon: <Phone size={26} />, label: "Reach", onClick: () => scrollToId("contact-reach") },
        { icon: <Mail size={26} />, label: "Mail", onClick: () => scrollToId("contact-mail") },
        { icon: <Map size={26} />, label: "Location", onClick: () => scrollToId("contact-location") },
      ];
    }
    return [{ icon: <Home size={28} />, label: "", onClick: () => (window.location.href = "/") }];
  }, [pathname]);
}

export default function App() {
  const pathname = usePathname();
  const dockItems = useDockItems(pathname);

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <NeuralBackground
        nodeDensity={0.14}
        linkDistance={170}
        speed={0.45}
        scrollStrength={0.5}
        nodeColor="rgba(140, 240, 255, 0.95)"
        lineColor="rgba(80, 200, 255, 0.35)"
        glow={14}
        opacity={1}
        interactive
        gradient={["#00121a", "#000000"]}
      />

      <header
        style={{
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <DynamicNavigation
          links={links}
          backgroundColor="#87E9F5"
          textColor="Blue"
          highlightColor="#87E9F5"
          glowIntensity={6}
          onLinkClick={(id) => console.log("Clicked:", id)}
        />
      </header>

      <main className="content-layer ai-grid">
        <section id="hero" className="hero">
          <div className="hero-row">
            <div className="hero-text">
              <div className="line">
                <ScrollReveal enableBlur baseOpacity={0.05} baseRotation={5} size="2xl" align="left" blurStrength={6} staggerDelay={0.1} springConfig={{ damping: 15, stiffness: 200, mass: 0.5 }}>
                  Welcome to
                </ScrollReveal>
              </div>
              <div className="line">
                <ScrollReveal enableBlur baseOpacity={0.05} baseRotation={5} size="lg" align="left" blurStrength={6} staggerDelay={0.1} springConfig={{ damping: 15, stiffness: 200, mass: 0.5 }}>
                  The Official AI-ML Club of VIT Vellore
                </ScrollReveal>
              </div>
              <h1 className="tech-title">TAM VIT</h1>
            </div>

            <div className="logo-box">
              <img src="/logo.png" alt="Club Logo" className="logo-img" />
            </div>
          </div>

          <div className="section-divider" />
        </section>

        <section id="mission" className="stack-center">
          <h2 className="mission-label">Our Mission</h2>
          <ScrollStack cards={cards} />
        </section>


      </main>

      <Dock className="dock-mobile" items={dockItems} baseItemSize={64} magnification={96} panelHeight={88} dockHeight={300} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Doto:wght@600;700;800&display=swap');
        :root{ --navH:88px; }
        html, body, #root { height:100%; margin:0; background:#000; }
        body{ overflow-x:hidden; }
        .content-layer { position:relative; z-index:1; background:transparent; font-family:'Doto', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
        .ai-grid{ position:relative; padding:0 clamp(16px,6vw,80px); color:#fff; }
        .hero{ min-height: calc(100vh - var(--navH)); padding-top: calc(var(--navH) + 24px); display:flex; flex-direction:column; justify-content:center; gap: clamp(24px, 4vh, 48px); }
        .hero-row{ width:100%; display:grid; grid-template-columns: 1fr min(38vw, 460px); align-items:center; gap: clamp(24px, 5vw, 56px); position:relative; z-index:1; }
        .hero-text{ display:flex; flex-direction:column; gap:.75rem; }
        .line{ text-align:left; }
        .tech-title{ font-weight:800; font-size:clamp(3rem, 8vw, 7rem); background:linear-gradient(120deg, #6ECFFF, #1FB6FF, #00E5FF, #8FD3FE); background-size:200% 200%; -webkit-background-clip:text; background-clip:text; color:transparent; animation:gradientShift 8s ease-in-out infinite; filter: drop-shadow(0 8px 30px rgba(79, 209, 255, 0.35)); margin-top:.5rem; }
        @keyframes gradientShift{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .logo-box{ justify-self:end; margin-right: 2vw; width:clamp(240px, 34vw, 460px); aspect-ratio:1/1; border-radius:24px; position:relative; background: radial-gradient(120% 120% at 0% 0%, rgba(160, 240, 255, .12), rgba(0,0,0,0)), linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02)); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border:1px solid rgba(255,255,255,.14); display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .logo-img{ width:75%; height:auto; object-fit:contain; }
        .section-divider{ margin: clamp(56px, 9vh, 100px) auto clamp(24px, 4vh, 36px) auto; width: min(88%, 1200px); height: 2px; background: linear-gradient(90deg, transparent, #38bdf8, #0ea5e9, transparent); border-radius: 9999px; box-shadow: 0 0 20px rgba(56,189,248,0.6); padding-top: 50px; }
        .stack-center{ width:100%; display:flex; flex-direction:column; align-items:center; gap:20px; padding-bottom:6vh; }
        .mission-label{ font-weight:800; font-size:clamp(1.5rem, 3vw, 2.2rem); background: linear-gradient(90deg, #7dd3fc, #38bdf8, #0ea5e9); -webkit-background-clip:text; background-clip:text; color:transparent; text-transform:uppercase; text-shadow: 0 0 15px rgba(64, 201, 255, .25); margin-bottom: 10px; }
        .dock-mobile button { border-radius:9999px; }
        @media (max-width: 900px){ :root{ --navH:84px; } .hero-row{ grid-template-columns: 1fr; } .logo-box{ justify-self:center; margin-right:0; max-width: 360px; } }
      `}</style>
    </div>
  );
}
