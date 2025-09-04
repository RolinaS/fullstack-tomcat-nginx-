import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Salad, BookOpen, Plus } from "lucide-react";
import { apiGet } from "@/lib/api";

export const dynamic = "force-dynamic"; // pas de cache SSR

type Page<T> = { content: T[]; totalElements?: number };
type Recette = { id:number; nom:string; utilisateurNomComplet?:string|null; typeRepasNom?:string|null };

function safeCount<T>(p?: Page<T> | null): number {
  if (!p) return 0;
  if (typeof p.totalElements === "number") return p.totalElements;
  return Array.isArray(p.content) ? p.content.length : 0;
}

async function loadData() {
  try {
    const [users, aliments, recettesPage] = await Promise.all([
      apiGet<Page<unknown>>("/utilisateurs?page=0&size=1"),
      apiGet<Page<unknown>>("/aliments?page=0&size=1"),
      apiGet<Page<Recette>>("/recettes?page=0&size=5"),
    ]);
    return {
      stats: {
        users: safeCount(users),
        aliments: safeCount(aliments),
        recettes: safeCount(recettesPage),
      },
      recettes: recettesPage?.content ?? [],
    };
  } catch {
    return { stats: { users: 0, aliments: 0, recettes: 0 }, recettes: [] as Recette[] };
  }
}

export default async function Home() {
  const { stats, recettes } = await loadData();

  return (
    <main className="min-h-[calc(100vh-56px)]"> {/* occupe quasi toute la page (moins la navbar) */}
      {/* Hero plein largeur */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-50 via-violet-50 to-emerald-50" />
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 via-emerald-500 to-violet-500 bg-clip-text text-transparent">
              Nutrition App
            </span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Gérez vos <strong>utilisateurs</strong>, <strong>aliments</strong> et <strong>recettes</strong>,
            puis composez des repas équilibrés.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/recettes"><Button className="gap-2"><Plus className="h-4 w-4" /> Nouvelle recette</Button></Link>
            <Link href="/aliments"><Button variant="outline">Ajouter un aliment</Button></Link>
          </div>
        </div>
      </section>

      {/* KPIs + raccourcis */}
      <section className="max-w-screen-2xl mx-auto px-4 md:px-8 py-6">
        {/* KPIs */}
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3"><Users className="h-6 w-6 text-blue-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Utilisateurs</p>
                <p className="text-2xl font-semibold">{stats.users}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-lg bg-emerald-500/10 p-3"><Salad className="h-6 w-6 text-emerald-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Aliments</p>
                <p className="text-2xl font-semibold">{stats.aliments}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-lg bg-violet-500/10 p-3"><BookOpen className="h-6 w-6 text-violet-600" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Recettes</p>
                <p className="text-2xl font-semibold">{stats.recettes}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Raccourcis */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader><CardTitle>Utilisateurs</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Créez et consultez vos utilisateurs.</p>
              <Link href="/utilisateurs"><Button className="w-full">Gérer</Button></Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader><CardTitle>Aliments</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Ajoutez des aliments et leurs nutriments.</p>
              <Link href="/aliments"><Button className="w-full" variant="secondary">Gérer</Button></Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-sm transition-shadow">
            <CardHeader><CardTitle>Recettes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Créez des recettes et ajoutez des ingrédients.</p>
              <Link href="/recettes"><Button className="w-full" variant="outline">Gérer</Button></Link>
            </CardContent>
          </Card>
        </div>

        {/* Dernières recettes */}
        <div className="mt-8">
          <Card>
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
    </main>
  );
}
