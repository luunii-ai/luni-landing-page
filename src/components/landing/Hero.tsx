import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Check } from "lucide-react";
import MiniSimulator from "@/components/landing/MiniSimulator";
import heroVideo from "@/assets/video-hero.mp4";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => {
      /* autoplay pode falhar até interação; muted costuma permitir */
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Vídeo em tela cheia (hero = viewport) */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full min-h-full object-cover"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        {/* Evitar várias camadas de branco (from-background) em cima do vídeo — isso “lavava” o lado direito */}
        <div className="absolute inset-0 bg-gradient-to-r from-background from-0% via-background/75 via-100% to-transparent to-[100%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-primary/[0.04]" />
      </div>

      {/* Decorative beams inspired by design system */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-[20%] w-[1px] h-64 bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-beam-1" />
        <div className="absolute top-0 left-[50%] w-[1px] h-96 bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-beam-2" />
        <div className="absolute top-0 left-[80%] w-[1px] h-48 bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-beam-3" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary">
            Da consulta ao fechamento — em estética
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tighter font-medium text-foreground mb-6"
          >
            Orçamentos, gestão e{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#000000] via-[#3533cd] to-[#3533cd]">
              simulação com IA.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            Aumente a confiança dos seus pacientes e a taxa de conversão da sua clínica ou consultório com nossa plataforma all-in-one de precificação inteligente, gestão de pacientes e simulações estéticas — para harmonização facial e cirurgias eletivas com IA.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-5 items-center"
          >
            {/* Glass button inspired by design system */}
            <a
              href="#planos"
              className="group relative isolate inline-flex cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_10px_rgba(17,17,68,0.4)] rounded-full shadow-[0_0_25px_rgba(17,17,68,0.22),0_8px_40px_rgba(17,17,68,0.12)]"
            >
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div
                  className="absolute inset-[-100%] w-[300%] h-[300%] animate-[spin-border_3s_linear_infinite]"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, transparent 80deg, rgba(17,17,68,0.85) 180deg, transparent 280deg, transparent 360deg)",
                    animation: "spin-border 3s linear infinite",
                  }}
                />
              </div>
              <div className="absolute inset-[1px] rounded-full backdrop-blur-xl z-0 bg-background/95" />
              <div className="z-10 flex gap-3 text-sm font-medium w-full rounded-full py-3 px-5 relative items-center">
                <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#000000] to-[#111144] flex items-center justify-center shadow-lg shadow-primary/30 ring-1 ring-primary/20 group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 text-primary-foreground fill-primary-foreground" />
                </div>
                <span className="whitespace-nowrap font-medium tracking-tight text-base text-foreground group-hover:text-foreground transition-colors">
                  Testar Gratuitamente
                </span>
                <span className="inline-flex items-center justify-center bg-primary/10 w-6 h-6 rounded-full ml-1 group-hover:translate-x-0.5 transition-transform text-primary">
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </a>

            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Check className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
              <span>Grátis por 5 dias</span>
            </div>
          </motion.div>
        </div>

        {/* Right side: Before/After Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.6 }}
          className="lg:col-span-5 hidden lg:flex justify-center items-center h-full"
        >
          <div className="relative w-full max-w-lg min-h-[460px]">
            <div className="absolute -inset-10 bg-primary/15 blur-3xl rounded-full -z-10" />
            <div className="h-full min-h-[460px] w-full rounded-2xl overflow-hidden border-4 border-white/30 bg-background/85 shadow-2xl shadow-primary/20">
              <MiniSimulator />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
