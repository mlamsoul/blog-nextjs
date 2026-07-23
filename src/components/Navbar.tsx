import Link from "next/link";

function TodayDate() {
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return <span className="text-md font-light">{date}</span>;
}

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-0 py-4 border-b border-gray-700 mb-16">
      <div className="flex gap-8">
        <Link
          href="/"
          className="font-(family-name:--font-satisfy) text-lg  tracking-widest hover:text-white text-gray-300 transition-colors"
        >
          Blog
        </Link>
        <Link
          href="/about"
          className="font-(family-name:--font-satisfy) text-lg  tracking-widest hover:text-white text-gray-300 transition-colors"
        >
          About
        </Link>
      </div>
      <TodayDate />
    </nav>
  );
}
