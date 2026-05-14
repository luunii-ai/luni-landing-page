import { motion } from "framer-motion";
import { Upload, Cpu, Eye, Send } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Adicione os dados do paciente",
    description: "Faça o cadastro rápido do paciente e faça o upload de uma foto frontal.",
    active: true,
  },
  {
    num: "02",
    icon: Cpu,
    title: "IA processa a simulação",
    description: "Nossa inteligência artificial analisa a foto e gera o antes e depois do procedimento.",
    active: false,
  },
  {
    num: "03",
    icon: Eye,
    title: "Crie o orçamento perfeito",
    description: "Use o simulador financeiro para definir o preço ideal com margem de lucro garantida.",
    active: false,
  },
  {
    num: "04",
    icon: Send,
    title: "Converta o paciente",
    description: "Apresente o resultado visual aliado ao orçamento estruturado e feche o procedimento com confiança.",
    active: false,
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="relative py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-primary mb-4 block">
            Passo a passo
          </span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-4">
            Simples como{" "}
            <span className="font-serif italic text-primary">1, 2, 3, 4</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Da foto ao resultado em poucos segundos. Sem complexidade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative group"
            >
              {/* Step card inspired by design system step items */}
              <div className="glass-card rounded-xl p-6 h-full hover:-translate-y-1 transition-all duration-300 gradient-border">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                      i === 0
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    }`}
                  >
                    {step.num}
                  </div>
                  <step.icon
                    className={`w-4 h-4 ml-auto transition-all duration-300 ${
                      i === 0 ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    }`}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[1px] bg-gradient-to-r from-primary/30 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
