export const metadata = { title: "Nutrition App", description: "CRUD Front" };
import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr"><body style={{fontFamily:"system-ui, sans-serif", margin:0}}>
      <header style={{padding:"12px 16px", borderBottom:"1px solid #e5e7eb", display:"flex", gap:16}}>
        <strong>Nutrition App</strong>
        <nav style={{display:"flex", gap:12}}>
          <Link href="/">Accueil</Link>
          <Link href="/utilisateurs">Utilisateurs</Link>
          <Link href="/aliments">Aliments</Link>
          <Link href="/recettes">Recettes</Link>
        </nav>
      </header>
      <main style={{padding:"16px 20px", maxWidth:960, margin:"0 auto"}}>{children}</main>
    </body></html>
  );
}
