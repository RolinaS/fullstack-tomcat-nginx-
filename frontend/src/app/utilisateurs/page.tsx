"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Page, Utilisateur, Genre } from "@/lib/types";

type UtilisateurForm = {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  genre: Genre;
  taille: string; // champs de saisie -> string
  poids: string;
};

export default function UtilisateursPage() {
  const [list, setList] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<UtilisateurForm>({
    prenom: "", nom: "", email: "", motDePasse: "", genre: "Homme", taille: "", poids: ""
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await api<Page<Utilisateur>>("/api/utilisateurs");
      setList(data.content);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api<Utilisateur>("/api/utilisateurs", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          taille: form.taille ? Number(form.taille) : null,
          poids: form.poids ? Number(form.poids) : null
        })
      });
      setForm({ prenom: "", nom: "", email: "", motDePasse: "", genre: "Homme", taille: "", poids: "" });
      await load();
      alert("Utilisateur créé ✅");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  return (
    <section>
      <h1>Utilisateurs</h1>
      <form onSubmit={submit} className="card">
        <h3>Nouveau</h3>
        <div className="form">
          <div><label>Prénom</label><input value={form.prenom} onChange={e=>setForm({...form, prenom:e.target.value})} required/></div>
          <div><label>Nom</label><input value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})} required/></div>
          <div><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/></div>
          <div><label>Mot de passe</label><input type="password" value={form.motDePasse} onChange={e=>setForm({...form, motDePasse:e.target.value})} required/></div>
          <div><label>Genre</label>
            <select value={form.genre} onChange={e=>setForm({...form, genre:e.target.value as Genre})}>
              <option>Homme</option><option>Femme</option><option>Autre</option>
            </select>
          </div>
          <div><label>Taille (cm)</label><input type="number" value={form.taille} onChange={e=>setForm({...form, taille:e.target.value})}/></div>
          <div><label>Poids (kg)</label><input type="number" step="0.01" value={form.poids} onChange={e=>setForm({...form, poids:e.target.value})}/></div>
        </div>
        <button type="submit">Créer</button>
      </form>

      {loading ? <p>Chargement…</p> : (
        <div>
          <h3>Liste</h3>
          <table>
            <thead><tr><th>ID</th><th>Nom</th><th>Email</th><th>Genre</th></tr></thead>
            <tbody>
              {list.map(u=>(
                <tr key={u.id}><td>{u.id}</td><td>{u.prenom} {u.nom}</td><td>{u.email}</td><td>{u.genre}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
