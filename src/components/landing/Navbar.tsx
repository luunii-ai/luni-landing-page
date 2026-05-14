import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/luni-logo-transparente (1).png";

const links = [
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Planos", href: "#planos" },
  { label: "Depoimentos", href: "#depoimentos" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="group">
          <img
            src={logo}
            alt="luni"
            className="h-10 w-auto max-w-[140px] object-contain object-left group-hover:scale-105 transition-transform"
          />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* <div className="hidden md:flex items-center gap-4">
          <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Entrar
          </a>
          <a
            href="#planos"
            className="button-glow button-glow--cta inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-primary-foreground relative z-10"
          >
            <span className="relative z-10">Começar Agora</span>
          </a>
        </div> */}

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#planos"
                onClick={() => setOpen(false)}
                className="button-glow button-glow--cta inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-primary-foreground mt-2"
              >
                <span className="relative z-10">Começar Agora</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
