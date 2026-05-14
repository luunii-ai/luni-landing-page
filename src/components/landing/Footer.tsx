import logo from "@/assets/luni-logo-transparente (1).png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <img src={logo} alt="luni" className="h-6 w-auto max-w-[120px] object-contain object-left" />
          </div>

          <div className="flex items-center gap-8">
            <a href="#" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              Termos
            </a>
            <a href="#" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              Privacidade
            </a>
            <a href="#" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              Contato
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            © 2026 luni. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
