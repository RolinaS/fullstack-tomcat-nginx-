"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type Recette = { id:number; nom:string; utilisateurId?:number; utilisateurNomComplet?:string|null; typeRepasId?:number; typeRepasNom?:string|null; };
type Page<T> = { content: T[] };

export default function RecettesPage(){
  const [list,setList]=useState<Recette[]>([]);
  const [form,setForm]=useState<any>({ nom:"", utilisateurId:"", typeRepasId:"" });

  const load = async ()=>{
    const data = await api<Page<Recette>>("/api/recettes");
    setList(data.content);
  };
  useEffect(()=>{ load(); },[]);

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault();
    await api<Recette>("/api/recettes", {
      method:"POST",
      body: JSON.stringify({
        nom: form.nom,
        utilisateurId: form.utilisateurId ? Number(form.utilisateurId) : null,
        typeRepasId: form.typeRepasId ? Number(form.typeRepasId) : null
      })
    });
    setForm({ nom:"", utilisateurId:"", typeRepasId:"" });
    await load();
    alert("Recette créée ✅");
  };

  return (
    <section>
      <h1>Recettes</h1>
      <form onSubmit={submit} className="card">
        <h3>Nouvelle recette</h3>
        <div className="form">
          <div><label>Nom</label><input value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})} required/></div>
          <div><label>Utilisateur ID (optionnel)</label><input type="number" value={form.utilisateurId} onChange={e=>setForm({...form, utilisateurId:e.target.value})}/></div>
          <div><label>Type Repas ID (optionnel)</label><input type="number" value={form.typeRepasId} onChange={e=>setForm({...form, typeRepasId:e.target.value})}/></div>
        </div>
        <button type="submit">Créer</button>
      </form>

      <table>
        <thead><tr><th>ID</th><th>Nom</th><th>Utilisateur</th><th>Repas</th><th>Actions</th></tr></thead>
        <tbody>
          {list.map(r=>(
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.nom}</td>
              <td>{r.utilisateurNomComplet ?? "—"}</td>
              <td>{r.typeRepasNom ?? "—"}</td>
              <td><Link href={`/recettes/${r.id}`}>Gérer ingrédients</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
