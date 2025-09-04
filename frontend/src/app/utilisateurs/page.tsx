"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

type Page<T> = { content: T[]; totalElements?: number };

type Genre = "Homme" | "Femme" | "Autre";

type Utilisateur = {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  genre: Genre;
  taille?: number | null;
  poids?: number | null;
};

type UtilisateurCreate = {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  genre: Genre;
  taille?: number | null;
  poids?: number | null;
};

const GENRES: Genre[] = ["Homme", "Femme", "Autre"];

export default function UtilisateursPage() {
  const [list, setList] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(false);

  // form state (string pour gérer le vide proprement)
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [genre, setGenre] = useState<Genre>("Homme");
  const [taille, setTaille] = useState<string>("");
  const [poids, setPoids] = useState<string>("");

  useEffect(() => {
    void loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await fetch("/api/utilisateurs?page=0&size=50", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch utilisateurs");
      const data: Page<Utilisateur> = await res.json();
      setList(data.content ?? []);
    } catch {
      setList([]);
    }
  }

  const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit =
    prenom.trim().length > 0 &&
    nom.trim().length > 0 &&
    emailOK &&
    motDePasse.trim().length >= 4;

  async function handleCreate() {
    if (!canSubmit) return;

    const payload: UtilisateurCreate = {
      prenom: prenom.trim(),
      nom: nom.trim(),
      email: email.trim(),
      motDePasse: motDePasse,
      genre,
      taille: taille ? Number(taille) : null,
      poids: poids ? Number(poids) : null,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/utilisateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("create utilisateur");
      // reset
      setPrenom("");
      setNom("");
      setEmail("");
      setMotDePasse("");
      setGenre("Homme");
      setTaille("");
      setPoids("");
      await loadUsers();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
        <p className="text-muted-foreground">Créez des comptes et consultez la liste.</p>
      </div>

      {/* Form */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Nouveau</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prénom</label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Ex: Sami"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Rolina"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@domaine.fr"
              />
              {!emailOK && email.length > 0 && (
                <p className="text-xs text-destructive">Email invalide</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="••••"
                />
                <button
                  type="button"
                  aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
                  onClick={() => setShowPwd((s) => !s)}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {motDePasse.length > 0 && motDePasse.length < 4 && (
                <p className="text-xs text-destructive">Min. 4 caractères</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={genre}
                onChange={(e) => setGenre(e.target.value as Genre)}
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Taille (cm)</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={taille}
                onChange={(e) => setTaille(e.target.value)}
                placeholder="Ex: 180"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Poids (kg)</label>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="0.1"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                value={poids}
                onChange={(e) => setPoids(e.target.value)}
                placeholder="Ex: 75.5"
              />
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
                  <th className="px-3 py-2 text-left font-medium">Email</th>
                  <th className="px-3 py-2 text-left font-medium">Genre</th>
                  <th className="px-3 py-2 text-left font-medium">Taille</th>
                  <th className="px-3 py-2 text-left font-medium">Poids</th>
                </tr>
              </thead>
              <tbody className="[&_tr:not(:last-child)]:border-b [&_tr]:border-border/60">
                {list.map((u) => (
                  <tr key={u.id} className="hover:bg-accent/30">
                    <td className="px-3 py-2">{u.id}</td>
                    <td className="px-3 py-2 font-medium">{u.prenom} {u.nom}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.genre}</td>
                    <td className="px-3 py-2">{u.taille ?? "—"}</td>
                    <td className="px-3 py-2">{u.poids ?? "—"}</td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-muted-foreground" colSpan={6}>
                      Aucun utilisateur.
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
