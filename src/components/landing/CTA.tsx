import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="relative py-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden bg-[linear-gradient(135deg,#000000,#3533cd)] p-12 md:p-16 text-center shadow-2xl shadow-primary/20"
        >
          {/* Decorative particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-[15%] w-[1px] h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-beam-1" />
            <div className="absolute top-0 left-[50%] w-[1px] h-48 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-beam-2" />
            <div className="absolute top-0 left-[85%] w-[1px] h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-beam-3" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-white fill-white" />
              <span className="text-xs font-bold tracking-widest uppercase text-white">
                Oferta limitada
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-white mb-4">
              Comece a simular{" "}
              <span className="font-serif italic">resultados hoje</span>
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              5 dias de teste grátis. Sem compromisso. Veja na prática como a IA
              pode transformar o atendimento da sua clínica ou consultório.
            </p>

            <a
              href="#planos"
              className="inline-flex items-center gap-3 bg-white text-primary rounded-full px-8 py-4 text-base font-medium hover:scale-105 transition-all duration-300 hover:shadow-lg group"
            >
              Testar Gratuitamente
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
