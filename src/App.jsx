
import { MotionConfig } from "framer-motion";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  ScrollRestoration,
} from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Propostas from "./components/Propostas";
import Atuacao from "./components/Atuacao";
import Sobre from "./components/Sobre";
import Faq from "./components/Faq";
import Participe from "./components/Participe";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import Bairros from "./components/Bairros";

function PaginaInicial() {
  return (
    <main>
      <Hero />
      <Propostas />
      <Atuacao />
      <Sobre />
      <Faq />
      <Participe />
    </main>
  );
}

function PaginaBairros() {
  return (
    <main className="min-h-screen bg-paper pt-12">
      <Bairros />
    </main>
  );
}

function Conteudo() {
  const location = useLocation();

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<PaginaInicial />} />
        <Route path="/bairros" element={<PaginaBairros />} />
        <Route
          path="*"
          element={
            <main className="flex min-h-screen flex-col items-center justify-center px-5 pt-24 text-center">
              <h1 className="font-display text-4xl font-extrabold text-navy-900">
                Página não encontrada
              </h1>
              <p className="mt-4 text-navy-900/70">
                O endereço acessado não existe.
              </p>
              <a
                href="/"
                className="mt-6 rounded-full bg-gold-400 px-6 py-3 font-semibold text-navy-950"
              >
                Voltar ao início
              </a>
            </main>
          }
        />
      </Routes>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Conteudo />
      </BrowserRouter>
    </MotionConfig>
  );
}
