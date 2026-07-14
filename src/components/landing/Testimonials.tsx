import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const proofs = [
  {
    quote:
      "A simulação ajuda muito a decidir. Consigo visualizar o que estou buscando antes de fechar.",
    author: "Pacientes em clínicas que usam a Luni",
    role: "Feedback recorrente após a simulação",
    clinicLine: "Para a clínica: menos insegurança no “sim” e menos orçamento parado.",
    featured: true,
  },
  {
    quote:
      "Ver o antes e depois na consulta muda a conversa. O paciente para de imaginar e passa a decidir.",
    author: "Fluxo de atendimento",
    role: "Consulta → simulação → orçamento",
    clinicLine: "Para a clínica: mais clareza no fechamento, no mesmo tempo de atendimento.",
    featured: false,
  },
  {
    quote:
      "Não é só ‘tecnologia bonita’ — é ferramenta para reduzir o ‘vou pensar’ e avançar a proposta.",
    author: "Outcome da clínica",
    role: "O que a dona precisa medir",
    clinicLine: "Para a clínica: mesmo lead, maior chance de conversão.",
    featured: false,
  },
];

const Testimonials = () => {
  return (
    <section id="depoimentos" className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-4 block">
            Prova
          </span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-4">
            Pacientes decidem melhor.{" "}
            <span className="font-serif italic text-primary">Clínicas fecham mais.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            O valor que a paciente sente na simulação é o mesmo valor que a clínica captura no orçamento.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proofs.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                t.featured
                  ? "bg-gradient-to-b from-[#000000] to-[#3533cd] text-primary-foreground shadow-2xl shadow-primary/20"
                  : "glass-card gradient-border"
              }`}
            >
              <Quote
                className={`w-5 h-5 mb-4 ${t.featured ? "text-white/80" : "text-primary"}`}
                strokeWidth={1.5}
              />
              <p className={`text-lg font-medium leading-snug mb-4 ${t.featured ? "" : "text-foreground"}`}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className={`text-sm leading-relaxed mb-6 ${t.featured ? "text-white/80" : "text-muted-foreground"}`}>
                {t.clinicLine}
              </p>
              <div className={`pt-4 border-t ${t.featured ? "border-white/20" : "border-border"}`}>
                <div className={`text-sm font-semibold ${t.featured ? "" : "text-foreground"}`}>{t.author}</div>
                <div className={`text-xs mt-1 ${t.featured ? "text-white/70" : "text-muted-foreground"}`}>{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
