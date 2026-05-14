import { motion } from "framer-motion";
import { TrendingUp, Heart, Clock, Shield, Users, Zap, Calculator, Wallet } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Aumente suas conversões",
    description: "Pacientes que visualizam o resultado têm muito mais propensão a realizar o procedimento.",
  },
  {
    icon: Calculator,
    title: "Precificação inteligente",
    description: "Simulador financeiro integrado para garantir a margem de lucro ideal em cada orçamento.",
  },
  {
    icon: Wallet,
    title: "Proteção da margem",
    description: "Evite prejuízos calculando custos diretos e indiretos antes de fechar qualquer pacote.",
  },
  {
    icon: Users,
    title: "Gestão de pacientes",
    description: "Centralize orçamentos, fotos e histórico de cada paciente em um único lugar.",
  },
  {
    icon: Clock,
    title: "Orçamento em segundos",
    description: "Crie orçamentos profissionais e simulações visuais em tempo real durante a consulta.",
  },
  {
    icon: Shield,
    title: "Segurança e privacidade",
    description: "Dados dos pacientes protegidos com criptografia de ponta. LGPD compliant.",
  },
];

const Benefits = () => {
  return (
    <section id="beneficios" className="relative py-24 bg-gradient-to-b from-accent/30 to-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-4 block">
            Benefícios
          </span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-4">
            Por que clínicas{" "}
            <span className="font-serif italic text-primary">escolhem a gente</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass-card rounded-xl p-8 hover:-translate-y-1 transition-all duration-300 group gradient-border"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
