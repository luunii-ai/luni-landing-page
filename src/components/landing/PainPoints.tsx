import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, MessageSquareX, ShieldX, Calculator, CalendarClock } from "lucide-react";

const pains = [
  {
    icon: AlertTriangle,
    title: "Pacientes inseguros",
    description: "Sem conseguir visualizar o resultado, muitos pacientes desistem no último momento.",
  },
  {
    icon: Calculator,
    title: "Precificação incorreta",
    description:
      "Orçamentos feitos sem análise financeira podem gerar prejuízos ocultos para a clínica ou o consultório.",
  },
  {
    icon: CalendarClock,
    title: "Orçamentos lentos",
    description: "Processos de orçamento lentos e confusos atrasam o fechamento e frustram o paciente.",
  },
  {
    icon: MessageSquareX,
    title: "Expectativas desalinhadas",
    description: "Quando o resultado não bate com a expectativa, vêm as insatisfações e retrabalhos.",
  },
];

const PainPoints = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-background to-accent/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-4 block">
            O problema
          </span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-4">
            Você reconhece{" "}
            <span className="font-serif italic text-primary">essas dores?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Clínicas de estética e cirurgiões plásticos enfrentam esses desafios todos os dias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pains.map((pain, i) => (
            <motion.div
              key={pain.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card rounded-xl p-8 hover:-translate-y-1 transition-all duration-300 group gradient-border"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <pain.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{pain.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pain.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
