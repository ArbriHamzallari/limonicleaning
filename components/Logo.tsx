import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt=""
        width={46}
        height={62}
        priority
        className="h-8 w-auto shrink-0"
      />
      <span className="text-lg font-extrabold tracking-tight text-text">Limoni Cleaning</span>
    </span>
  );
}
