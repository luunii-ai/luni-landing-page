import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { LegalDocumentView } from '@/components/legal/LegalDocumentView';
import { patientConsentPt } from '@legal/patient-consent.pt';

const PatientConsentPage = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <main className="flex-1 pt-24">
      <LegalDocumentView document={patientConsentPt} backHref="/" backLabel="Voltar ao início" />
    </main>
    <Footer />
  </div>
);

export default PatientConsentPage;
