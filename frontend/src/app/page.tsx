// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Salad, BookOpen, Plus } from "lucide-react";

type Page<T> = { content: T[]; totalElements?: number };
type MinimalPage = { content: unknown[]; totalElements?: number };
type Recette = { id:number; nom:string; utilisateurNomComplet?:string|null; typeRepasNom?:string|null };

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch { return null; }
}

export default async function Home() {
  // Charge stats + dernières recettes (5)
  const [users, aliments, recettesPage] = await Promise.all([
    getJson<MinimalPage>("/api/utilisateurs?page=0&size=1"),
    getJson<MinimalPage>("/api/aliments?page=0&size=1"),
    getJson<Page<Recette>>("/api/recettes?page=0&size=5"),
  ]);

  const stats = {
    users: users?.totalElements ?? users?.content?.length ?? 0,
    aliments: aliments?.totalElements ?? aliments?.content?.length ?? 0,
    recettes: recettesPage?.totalElements ?? recettesPage?.content?.length ?? 0,
  };
  const recettes = recettesPage?.content ?? [];

  return (
    <section className="relative">
      {/* Magic background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/30 to-teal-300/30 blur-3xl" />
        <div className="absolute -bottom-28 -right-10 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-400/25 to-indigo-300/25 blur-3xl" />
      </div>

      {/* Hero */}
      <div className="text-center py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 via-emerald-400 to-violet-500 bg-clip-text text-transparent">
            Nutrition App
          </span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Gérez vos <strong>utilisateurs</strong>, <strong>aliments</strong> et <strong>recettes</strong>, puis composez des repas équilibrés.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/recettes">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Nouvelle recette</Button>
          </Link>
          <Link href="/aliments">
            <Button variant="outline">Ajouter un aliment</Button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="glass">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Utilisateurs</p>
              <p className="text-2xl font-semibold">{stats.users}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <Salad className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aliments</p>
              <p className="text-2xl font-semibold">{stats.aliments}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-lg bg-violet-500/10 p-3">
              <BookOpen className="h-6 w-6 text-violet-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recettes</p>
              <p className="text-2xl font-semibold">{stats.recettes}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Raccourcis */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card className="glass hover:shadow-md transition-shadow">
          <CardHeader><CardTitle>Utilisateurs</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Créez et consultez vos utilisateurs.</p>
            <Link href="/utilisateurs"><Button className="w-full">Gérer</Button></Link>
          </CardContent>
        </Card>

        <Card className="glass hover:shadow-md transition-shadow">
          <CardHeader><CardTitle>Aliments</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Ajoutez des aliments et leurs nutriments.</p>
            <Link href="/aliments"><Button className="w-full" variant="secondary">Gérer</Button></Link>
          </CardContent>
        </Card>

        <Card className="glass hover:shadow-md transition-shadow">
          <CardHeader><CardTitle>Recettes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Créez des recettes et ajoutez des ingrédients.</p>
            <Link href="/recettes"><Button className="w-full" variant="outline">Gérer</Button></Link>
          </CardContent>
        </Card>
      </div>

      {/* Dernières recettes */}
      <div className="mt-8">
        <Card className="glass">
          <CardHeader><CardTitle>Dernières recettes</CardTitle></CardHeader>
          <CardContent>
            {recettes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Pas encore de recettes. Commencez-en une !</p>
            ) : (
              <ul className="divide-y divide-border">
                {recettes.map((r) => (
                  <li key={r.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{r.nom}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.utilisateurNomComplet ?? "—"} • {r.typeRepasNom ?? "—"}
                      </p>
                    </div>
                    <Link href={`/recettes/${r.id}`}><Button variant="ghost" className="hover:bg-accent">Ouvrir</Button></Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
