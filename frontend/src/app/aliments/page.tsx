"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Aliment = {
  id:number; nom:string; proteine?:number; lipide?:number; glucide?:number;
  matiereGrasse?:number; kilocalorie?:number; familleId?:number; familleNom?:string;
};
type Page<T> = { content: T[] };

export default function AlimentsPage(){
  const [list,setList]=useState<Aliment[]>([]);
  const [form,setForm]=useState<any>({ nom:"", proteine:"", lipide:"", glucide:"", matiereGrasse:"", kilocalorie:"", familleId:"" });
  const [loading, setLoading] = useState(true);

  const load = async ()=>{
    setLoading(true);
    try{
      const data = await api<Page<Aliment>>("/api/aliments");
      setList(data.content);
    } finally { setLoading(false); }
  };
  useEffect(()=>{ load(); },[]);

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault();
    try{
      await api<Aliment>("/api/aliments", {
        method:"POST",
        body: JSON.stringify({
          nom: form.nom,
          proteine: form.proteine ? Number(form.proteine) : 0,
          lipide: form.lipide ? Number(form.lipide) : 0,
          glucide: form.glucide ? Number(form.glucide) : 0,
          matiereGrasse: form.matiereGrasse ? Number(form.matiereGrasse) : 0,
          kilocalorie: form.kilocalorie ? Number(form.kilocalorie) : 0,
          familleId: form.familleId ? Number(form.familleId) : null
        })
      });
      setForm({ nom:"", proteine:"", lipide:"", glucide:"", matiereGrasse:"", kilocalorie:"", familleId:"" });
      await load();
      alert("Aliment créé ✅");
    } catch(err:any){ alert(err.message); }
  };

  return (
    <section>
      <h1>Aliments</h1>
      <form onSubmit={submit} className="card">
        <h3>Nouveau</h3>
        <div className="form">
          <div><label>Nom</label><input value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})} required/></div>
          <div><label>Protéine (g/100g)</label><input type="number" step="0.01" value={form.proteine} onChange={e=>setForm({...form, proteine:e.target.value})}/></div>
          <div><label>Lipide (g/100g)</label><input type="number" step="0.01" value={form.lipide} onChange={e=>setForm({...form, lipide:e.target.value})}/></div>
          <div><label>Glucide (g/100g)</label><input type="number" step="0.01" value={form.glucide} onChange={e=>setForm({...form, glucide:e.target.value})}/></div>
          <div><label>Matière grasse (g/100g)</label><input type="number" step="0.01" value={form.matiereGrasse} onChange={e=>setForm({...form, matiereGrasse:e.target.value})}/></div>
          <div><label>Kcal</label><input type="number" value={form.kilocalorie} onChange={e=>setForm({...form, kilocalorie:e.target.value})}/></div>
          <div><label>Famille ID (optionnel)</label><input type="number" value={form.familleId} onChange={e=>setForm({...form, familleId:e.target.value})}/></div>
        </div>
        <button type="submit">Créer</button>
      </form>

      {loading ? <p>Chargement…</p> : (
        <table>
          <thead><tr><th>ID</th><th>Nom</th><th>Famille</th><th>Kcal</th><th>P/L/G</th></tr></thead>
          <tbody>
            {list.map(a=>(
              <tr key={a.id}>
                <td>{a.id}</td><td>{a.nom}</td>
                <td>{a.familleNom??"—"}</td>
                <td>{a.kilocalorie??"—"}</td>
                <td>{a.proteine??0}/{a.lipide??0}/{a.glucide??0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
