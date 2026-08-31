import Link from "next/link";
import Image from "next/image";

function TodayDate() {
  const date = new Date().toLocaleDateString("fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return <span>{date}</span>;
}

export default function Navbar() {
  const isLocal = process.env.NODE_ENV === "development";
  const hoverWhite = "hover:text-white transition-colors";
  const hoverYellow = "hover:text-yellow-400 transition-colors";

  return (
    <nav className="font-(family-name:--font-satisfy) text-lg  text-gray-300 tracking-widest flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-0 py-4 border-b border-gray-700 mb-8 sm:mb-16">
      <div className="flex items-center gap-4 sm:gap-8 transition-colors">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            priority
            style={{ width: "auto", height: "40px" }}
          />
        </Link>

        <Link href="/" className={hoverWhite}>
          Blog
        </Link>
        <Link href="/about" className={hoverWhite}>
          À propos
        </Link>
        <Link href="/legal" className={hoverWhite}>
          Légal
        </Link>

        {isLocal && (
          <a
            href={process.env.NEXT_PUBLIC_PROD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-yellow-600 ${hoverYellow}`}
          >
            ↗ prod
          </a>
        )}
      </div>

      <div className="hidden sm:block">
        <TodayDate />
      </div>
    </nav>
  );
}
