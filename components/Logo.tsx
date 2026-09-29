import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt=""
        width={46}
        height={62}
        loading="eager"
        className="h-7 w-auto shrink-0 sm:h-8"
      />
      <span className="text-base font-extrabold tracking-tight whitespace-nowrap text-text sm:text-lg">Limoni Cleaning</span>
    </span>
  );
}
