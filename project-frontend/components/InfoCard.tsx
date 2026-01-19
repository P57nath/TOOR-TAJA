import Link from "next/link";

type InfoCardProps = {
  title: string;
  description: string;
  href?: string;
};

export default function InfoCard({ title, description, href }: InfoCardProps) {
  const content = (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-200">
      <h3 className="text-lg font-semibold text-emerald-950">{title}</h3>
      <p className="mt-2 text-sm text-emerald-900/70">{description}</p>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link className="block" href={href}>
      {content}
    </Link>
  );
}
