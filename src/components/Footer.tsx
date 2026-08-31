import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
      <Link href="/legal" className="transition-colors hover:text-gray-300">
        Mentions légales et vie privée
      </Link>
    </footer>
  );
}
