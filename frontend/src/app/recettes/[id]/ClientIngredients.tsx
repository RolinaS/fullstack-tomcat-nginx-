"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type Item = { id:number; recetteId:number; recetteNom:string; alimentId:number; alimentNom:string; poids:number; };
type AlimentOption = { id:number; nom:string };
type Page<T> = { content: T[]; totalElements?: number };

export default function ClientIngredients({
  recetteId, initialItems, initialAliments
}: { recetteId:number; initialItems: Item[]; initialAliments: AlimentOption[]; }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [aliments, setAliments] = useState<AlimentOption[]>(initialAliments);
  const [alimentId, setAlimentId] = useState<string>("");
  const [poids, setPoids] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await api.get<Item[]>(`/recette-aliments?recetteId=${recetteId}`));
    } catch { setItems([]); }
    try {
      const page = await api.get<Page<AlimentOption>>(`/aliments?page=0&size=200`);
      setAliments((page.content ?? []).sort((a,b)=>a.nom.localeCompare(b.nom)));
    } catch { setAliments([]); }
  }, [recetteId]);

  useEffect(()=>{ void load(); },[load]);

  const canSubmit = alimentId !== "" && poids !== "" && Number(poids) > 0;

  const add = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      await api.post<Item>("/recette-aliments", {
        recetteId, alimentId: Number(alimentId), poids: Number(poids)
      });
      setAlimentId(""); setPoids("");
      await load();
    } finally { setLoading(false); }
  };

  const remove = async (id:number) => {
    setLoading(true);
    try { await api.delete(`/recette-aliments/${id}`); await load(); }
    finally { setLoading(false); }
  };

  return (
    <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-6 space-y-4">
      <div>
        <Link href="/recettes" className="text-sm text-blue-600 hover:underline">← Retour</Link>
        <h1 className="mt-1 text-xl font-semibold">Recette #{recetteId} — Ingrédients</h1>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader><CardTitle>Ajouter un ingrédient</CardTitle></CardHeader>
        <CardContent>
          {aliments.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              Aucun aliment disponible. Créez-en d’abord un.
              <div className="mt-3"><Link href="/aliments"><Button>Créer un aliment</Button></Link></div>
            </div>
          ) : (
            <form onSubmit={add} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Aliment</label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  value={alimentId} onChange={(e)=>setAlimentId(e.target.value)}
                >
                  <option value="">— choisir —</option>
                  {aliments.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Poids (g)</label>
                <input
                  type="number" inputMode="decimal" min={0} step="0.1"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  value={poids} onChange={(e)=>setPoids(e.target.value)}
                />
              </div>
              <div><Button type="submit" disabled={!canSubmit || loading}>{loading ? "Ajout..." : "Ajouter"}</Button></div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader><CardTitle>Ingrédients</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-md text-sm">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground">
                  <th className="px-3 py-2 text-left font-medium">ID</th>
                  <th className="px-3 py-2 text-left font-medium">Aliment</th>
                  <th className="px-3 py-2 text-left font-medium">Poids (g)</th>
                  <th className="px-3 py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:not(:last-child)]:border-b [&_tr]:border-border/60">
                {items.map(it=>(
                  <tr key={it.id} className="hover:bg-accent/30">
                    <td className="px-3 py-2">{it.id}</td>
                    <td className="px-3 py-2">{it.alimentNom}</td>
                    <td className="px-3 py-2">{it.poids}</td>
                    <td className="px-3 py-2">
                      <Button variant="ghost" onClick={()=>remove(it.id)} disabled={loading}
                              className="hover:bg-destructive/10 hover:text-destructive">
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
                {items.length===0 && (
                  <tr><td className="px-3 py-6 text-center text-muted-foreground" colSpan={4}>Aucun ingrédient.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
