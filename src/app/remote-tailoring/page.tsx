import RemoteTailoringForm from "@/components/RemoteTailoringForm";
import Link from "next/link";

export default function RemoteTailoringPage() {
  return (
    <main>
      <section className="remote-page-header">
        <Link href="/" className="remote-back-link">
          ← Back to Maxnick Couture
        </Link>

        <p className="eyebrow">
          MADE FOR YOU, WHEREVER YOU ARE
        </p>

        <h1>Remote Tailoring & Delivery</h1>

        <p>
          Share your measurements, tell us your preferred design,
          and let us create an outfit for you wherever you live.
        </p>
      </section>

      <RemoteTailoringForm />
    </main>
  );
}