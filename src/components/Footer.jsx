import { contato } from "../data/site";

export default function Footer() {
  return (
    <footer className="bg-navy-950 py-10 text-white/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm md:flex-row">
        <p>
          © {new Date().getFullYear()} Gabriel Henriques Sales · Goiânia, GO
        </p>
        <a
          href={`https://instagram.com/${contato.instagram}`}
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-gold-400"
        >
          @{contato.instagram}
        </a>
      </div>
    </footer>
  );
}