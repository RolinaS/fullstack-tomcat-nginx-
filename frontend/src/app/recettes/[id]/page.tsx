"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

type Item = { id:number; recetteId:number; recetteNom:string; alimentId:number; alimentNom:string; poids:number; };
type Aliment = { id:number; nom:string; };

export default function RecetteDetail(){
  const params = useParams();
  const recetteId = Number(params?.id);
  const [items, setItems] = useState<Item[]>([]);
  const [aliments, setAliments] = useState<Aliment[]>([]);
  const [poids, setPoids] = useState<string>("");
  const [alimentId, setAlimentId] = useState<string>("");

  const load = async ()=>{
    const list = await api<Item[]>(`/api/recette-aliments?recetteId=${recetteId}`);
    setItems(list);
  };
  const loadAliments = async ()=>{
    const data = await api<{content: Aliment[]}>("/api/aliments");
    setAliments(data.content);
  };

  useEffect(()=>{ load(); loadAliments(); },[recetteId]);

  const add = async (e:React.FormEvent)=>{
    e.preventDefault();
    await api<Item>("/api/recette-aliments", {
      method:"POST",
      body: JSON.stringify({ recetteId, alimentId: Number(alimentId), poids: Number(poids) })
    });
    setPoids(""); setAlimentId("");
    await load();
    alert("Ingrédient ajouté ✅");
  };

  const del = async (id:number)=>{
    if (!confirm("Supprimer cet ingrédient ?")) return;
    await api<void>(`/api/recette-aliments/${id}`, { method:"DELETE" });
    await load();
  };

  return (
    <section>
      <p><Link href="/recettes">← Retour</Link></p>
      <h1>Recette #{recetteId} — Ingrédients</h1>

      <form onSubmit={add} className="card">
        <h3>Ajouter un ingrédient</h3>
        <div className="form">
          <div>
            <label>Aliment</label>
            <select value={alimentId} onChange={e=>setAlimentId(e.target.value)} required>
              <option value="" disabled>— choisir —</option>
              {aliments.map(a=><option key={a.id} value={a.id}>{a.nom}</option>)}
            </select>
          </div>
          <div>
            <label>Poids (g)</label>
            <input type="number" step="0.01" value={poids} onChange={e=>setPoids(e.target.value)} required/>
          </div>
        </div>
        <button type="submit">Ajouter</button>
      </form>

      <table>
        <thead><tr><th>ID</th><th>Aliment</th><th>Poids (g)</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(it=>(
            <tr key={it.id}>
              <td>{it.id}</td><td>{it.alimentNom}</td><td>{it.poids}</td>
              <td><button onClick={()=>del(it.id)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
