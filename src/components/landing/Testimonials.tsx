import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "A taxa de conversão da minha clínica aumentou 65% no primeiro mês. Os pacientes adoram ver o resultado antes.",
    author: "Dra. Carolina Mendes",
    role: "Dermatologista • São Paulo",
    rating: 5,
    featured: true,
  },
  {
    quote: "Finalmente uma ferramenta que me ajuda a alinhar expectativas com os pacientes. Reduziu muito os retrabalhos.",
    author: "Dr. Rafael Torres",
    role: "Cirurgião Plástico • Rio de Janeiro",
    rating: 5,
    featured: false,
  },
  {
    quote: "Interface intuitiva e resultados incrivelmente realistas. Meus pacientes ficam impressionados toda consulta.",
    author: "Dra. Isabela Souza",
    role: "Harmonização Facial • Curitiba",
    rating: 5,
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
            Depoimentos
          </span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tighter text-foreground mb-4">
            O que dizem{" "}
            <span className="font-serif italic text-primary">nossos clientes</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
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
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${t.featured ? "text-white fill-white" : "text-primary fill-primary"}`}
                  />
                ))}
              </div>
              <p className={`text-lg font-medium leading-snug mb-6 ${t.featured ? "" : "text-foreground"}`}>
                "{t.quote}"
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
