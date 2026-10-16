import { MotionConfig } from "framer-motion";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Propostas from "./components/Propostas";
import Atuacao from "./components/Atuacao";
import Sobre from "./components/Sobre";
import Faq from "./components/Faq";
import Participe from "./components/Participe";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main>
        <Hero />
        <Propostas />
        <Atuacao />
        <Sobre />
        <Faq />
        <Participe />
      </main>
      <Footer />
      <WhatsAppFloat />
    </MotionConfig>
  );
}