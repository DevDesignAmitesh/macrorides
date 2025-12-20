import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <img
        src="/logo-2.png"
        className="rounded-full"
        alt="Macro Rides Logo"
        width={56}
        height={36}
      />
      <span className="text-xl font-bold text-green-600">Macro Rides</span>
    </Link>
  );
};
