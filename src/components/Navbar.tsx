import Link from "next/link";
import Image from "next/image";

function TodayDate() {
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <span className="font-(family-name:--font-satisfy) text-lg tracking-widest text-gray-300">
      {date}
    </span>
  );
}

export default function Navbar() {
  return (
    <nav className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-0 py-4 border-b border-gray-700 mb-8 sm:mb-16">
      <div className="flex items-center gap-4 sm:gap-8">
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

        <Link
          href="/"
          className="font-(family-name:--font-satisfy) text-lg tracking-widest hover:text-white text-gray-300 transition-colors"
        >
          Blog
        </Link>

        <Link
          href="/about"
          className="font-(family-name:--font-satisfy) text-lg tracking-widest hover:text-white text-gray-300 transition-colors"
        >
          About
        </Link>
      </div>

      <div className="hidden sm:block">
        <TodayDate />
      </div>
    </nav>
  );
}
