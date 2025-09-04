"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Page<T> = { content: T[]; totalElements?: number };

type Aliment = {
  id: number;
  nom: string;
  proteine?: number | null;
  lipide?: number | null;
  glucide?: number | null;
  matiereGrasse?: number | null;
  kilocalorie?: number | null;
  familleId?: number | null;
  familleNom?: string | null;
};

type AlimentCreate = {
  nom: string;
  proteine?: number | null;
  lipide?: number | null;
  glucide?: number | null;
  matiereGrasse?: number | null;
  kilocalorie?: number | null;
  familleId?: number | null;
};

type Famille = { id: number; nom: string };

// Fallback si pas d’endpoint /api/familles
const FAMILLES_FALLBACK: Famille[] = [
  { id: 1, nom: "Poisson" },
  { id: 2, nom: "Viande" },
  { id: 3, nom: "Oeufs" },
  { id: 4, nom: "Produits laitiers" },
  { id: 5, nom: "Fruits" },
  { id: 6, nom: "Légumes" },
  { id: 7, nom: "Céréales" },
  { id: 8, nom: "Matières grasses" },
  { id: 9, nom: "Féculents" },
];

export default function AlimentsPage() {
  // list
  const [aliments, setAliments] = useState<Aliment[]>([]);
  const [familles, setFamilles] = useState<Famille[]>([]);
  const familleIdByNom = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of familles) m.set(f.nom, f.id);
    return m;
  }, [familles]);

  // form
  const [nom, setNom] = useState("");
  const [proteine, setProteine] = useState<string>("");
  const [lipide, setLipide] = useState<string>("");
  const [glucide, setGlucide] = useState<string>("");
  const [matiereGrasse, setMatiereGrasse] = useState<string>("");
  const [kilocalorie, setKilocalorie] = useState<string>("");
  const [familleNom, setFamilleNom] = useState<string>("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void loadAliments();
    void loadFamilles();
  }, []);

  async function loadAliments() {
    try {
      const res = await fetch("/api/aliments?page=0&size=200", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data: Page<Aliment> = await res.json();
      setAliments((data.content ?? []).sort((a, b) => a.nom.localeCompare(b.nom)));
    } catch {
      setAliments([]);
    }
  }

  async function loadFamilles() {
    try {
      const res = await fetch("/api/familles?page=0&size=200", { cache: "no-store" });
      if (res.ok) {
        const data: Page<Famille> = await res.json();
        setFamilles((data.content ?? []).sort((a, b) => a.nom.localeCompare(b.nom)));
        return;
      }
      setFamilles(FAMILLES_FALLBACK);
    } catch {
      setFamilles(FAMILLES_FALLBACK);
    }
  }

  const canSubmit = nom.trim().length > 0;

  function toNumOrNull(v: string): number | null {
    if (v === "" || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  async function handleCreate() {
    if (!canSubmit) return;
    const payload: AlimentCreate = {
      nom: nom.trim(),
      proteine: toNumOrNull(proteine),
      lipide: toNumOrNull(lipide),
      glucide: toNumOrNull(glucide),
      matiereGrasse: toNumOrNull(matiereGrasse),
      kilocalorie: toNumOrNull(kilocalorie),
      familleId: familleNom ? familleIdByNom.get(familleNom) ?? null : null,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/aliments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("create aliment");
      // reset
      setNom("");
      setProteine("");
      setLipide("");
      setGlucide("");
      setMatiereGrasse("");
      setKilocalorie("");
      setFamilleNom("");
      await loadAliments();
    } finally {
      setLoading(false);
    }
  }

  const fmt = (n?: number | null, unit?: string) =>
    n === null || n === undefined ? "—" : `${n}${unit ?? ""}`;

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Aliments</h1>
        <p className="text-muted-foreground">Ajoutez des aliments et leurs nutriments (pour 100g).</p>
      </div>

      {/* Form */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Nouveau</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Poulet rôti"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Protéine (g/100g)</label>
              <input
                type="number" inputMode="decimal" step="0.1" min={0}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={proteine} onChange={(e) => setProteine(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Lipide (g/100g)</label>
              <input
                type="number" inputMode="decimal" step="0.1" min={0}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={lipide} onChange={(e) => setLipide(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Glucide (g/100g)</label>
              <input
                type="number" inputMode="decimal" step="0.1" min={0}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={glucide} onChange={(e) => setGlucide(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Matière grasse (g/100g)</label>
              <input
                type="number" inputMode="decimal" step="0.1" min={0}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={matiereGrasse} onChange={(e) => setMatiereGrasse(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kcal</label>
              <input
                type="number" inputMode="numeric" step="1" min={0}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={kilocalorie} onChange={(e) => setKilocalorie(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Famille (optionnel)</label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={familleNom}
                onChange={(e) => setFamilleNom(e.target.value)}
              >
                <option value="">— Choisir —</option>
                {familles.map((f) => (
                  <option key={f.id} value={f.nom}>{f.nom}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                On convertit automatiquement le <em>nom</em> choisi vers l’ID attendu par l’API.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleCreate} disabled={loading || !canSubmit} className="gap-2">
              {loading ? "Création..." : "Créer"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Liste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-md text-sm">
              <thead>
                <tr className="bg-muted/40 text-muted-foreground">
                  <th className="px-3 py-2 text-left font-medium">ID</th>
                  <th className="px-3 py-2 text-left font-medium">Nom</th>
                  <th className="px-3 py-2 text-left font-medium">Famille</th>
                  <th className="px-3 py-2 text-left font-medium">Kcal</th>
                  <th className="px-3 py-2 text-left font-medium">P/L/G (g)</th>
                </tr>
              </thead>
              <tbody className="[&_tr:not(:last-child)]:border-b [&_tr]:border-border/60">
                {aliments.map((a) => (
                  <tr key={a.id} className="hover:bg-accent/30">
                    <td className="px-3 py-2">{a.id}</td>
                    <td className="px-3 py-2 font-medium">{a.nom}</td>
                    <td className="px-3 py-2">{a.familleNom ?? "—"}</td>
                    <td className="px-3 py-2">{fmt(a.kilocalorie)}</td>
                    <td className="px-3 py-2">
                      {fmt(a.proteine)} / {fmt(a.lipide)} / {fmt(a.glucide)}
                    </td>
                  </tr>
                ))}
                {aliments.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-muted-foreground" colSpan={5}>
                      Aucun aliment.
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
