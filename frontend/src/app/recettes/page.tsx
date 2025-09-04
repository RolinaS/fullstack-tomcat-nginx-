"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Types ---
type Page<T> = { content: T[]; totalElements?: number };
type Recette = {
  id: number;
  nom: string;
  utilisateurNomComplet?: string | null;
  typeRepasNom?: string | null;
};
type RecetteCreate = {
  nom: string;
  utilisateurId?: number | null;
  typeRepasId?: number | null;
};
type Repas = { id: number; nom: string };

// Fallback local au cas où l’endpoint /api/repas n’existe pas.
// (Les IDs supposent l’ordre d’insertion par défaut de ta base.)
const REPAS_FALLBACK: Repas[] = [
  { id: 1, nom: "Petit-déjeuner" },
  { id: 2, nom: "Déjeuner" },
  { id: 3, nom: "Dîner" },
  { id: 4, nom: "Collation" },
];

export default function RecettesPage() {
  const [loading, setLoading] = useState(false);
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [repasOptions, setRepasOptions] = useState<Repas[]>([]);
  const [nom, setNom] = useState("");
  const [utilisateurId, setUtilisateurId] = useState<string>("");
  const [repasNom, setRepasNom] = useState<string>(""); // on stocke le NOM sélectionné

  // Map nom -> id (pour envoyer l'id attendu par le backend)
  const repasIdFromNom = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of repasOptions) map.set(r.nom, r.id);
    return map;
  }, [repasOptions]);

  useEffect(() => {
    void loadRecettes();
    void loadRepas();
  }, []);

  async function loadRecettes() {
    try {
      const res = await fetch("/api/recettes?page=0&size=50", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch recettes");
      const data: Page<Recette> = await res.json();
      setRecettes(data.content ?? []);
    } catch {
      setRecettes([]);
    }
  }

  // Essaie /api/repas puis retombe sur la constante si 404
  async function loadRepas() {
    try {
      const res = await fetch("/api/repas?page=0&size=50", { cache: "no-store" });
      if (res.ok) {
        const data: Page<Repas> = await res.json();
        setRepasOptions((data.content ?? []).sort((a, b) => a.nom.localeCompare(b.nom)));
        return;
      }
      setRepasOptions(REPAS_FALLBACK);
    } catch {
      setRepasOptions(REPAS_FALLBACK);
    }
  }

  async function handleCreate() {
    const payload: RecetteCreate = {
      nom: nom.trim(),
      utilisateurId: utilisateurId ? Number(utilisateurId) : null,
      typeRepasId: repasNom ? repasIdFromNom.get(repasNom) ?? null : null,
    };
    if (!payload.nom) return;

    setLoading(true);
    try {
      const res = await fetch("/api/recettes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("create recette");
      setNom("");
      setUtilisateurId("");
      setRepasNom("");
      await loadRecettes();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Recettes</h1>
        <p className="text-muted-foreground">Créez vos recettes et gérez leurs ingrédients.</p>
      </div>

      {/* Formulaire */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Nouvelle recette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Poulet riz brocoli"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Utilisateur ID (optionnel)</label>
              <input
                type="number"
                inputMode="numeric"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={utilisateurId}
                onChange={(e) => setUtilisateurId(e.target.value)}
                placeholder="Ex: 1"
                min={1}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Type de repas (optionnel)</label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={repasNom}
                onChange={(e) => setRepasNom(e.target.value)}
              >
                <option value="">— Choisir —</option>
                {repasOptions.map((r) => (
                  <option key={r.id} value={r.nom}>
                    {r.nom}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                L’API attend un identifiant : on convertit automatiquement le nom choisi vers l’ID correspondant.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleCreate} disabled={loading || !nom.trim()} className="gap-2">
              {loading ? "Création..." : "Créer"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Recettes existantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-md text-sm">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground">
                  <th className="px-3 py-2 text-left font-medium">ID</th>
                  <th className="px-3 py-2 text-left font-medium">Nom</th>
                  <th className="px-3 py-2 text-left font-medium">Utilisateur</th>
                  <th className="px-3 py-2 text-left font-medium">Repas</th>
                  <th className="px-3 py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:not(:last-child)]:border-b [&_tr]:border-border/60">
                {recettes.map((r) => (
                  <tr key={r.id} className="hover:bg-accent/30">
                    <td className="px-3 py-2">{r.id}</td>
                    <td className="px-3 py-2 font-medium">{r.nom}</td>
                    <td className="px-3 py-2">{r.utilisateurNomComplet ?? "—"}</td>
                    <td className="px-3 py-2">
                      {r.typeRepasNom ? (
                        <span className="inline-flex items-center rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-xs">
                          {r.typeRepasNom}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Link href={`/recettes/${r.id}`} className="inline-flex">
                        <Button variant="ghost" className="hover:bg-accent">Gérer ingrédients</Button>
                      </Link>
                    </td>
                  </tr>
                ))}

                {recettes.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-muted-foreground" colSpan={5}>
                      Aucune recette pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
