import Header from "./components/Header";
import Hero from "./components/Hero";
import Propostas from "./components/Propostas";
import Sobre from "./components/Sobre";
import Participe from "./components/Participe";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Propostas />
        <Sobre />
        <Participe />
      </main>
      <Footer />
    </>
  );
}