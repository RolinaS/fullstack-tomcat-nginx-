import ClientIngredients from "./ClientIngredients";
import { api } from "@/lib/api";

type Item = { id:number; recetteId:number; recetteNom:string; alimentId:number; alimentNom:string; poids:number; };
type AlimentOption = { id:number; nom:string };
type Page<T> = { content: T[]; totalElements?: number };

export const dynamic = "force-dynamic";

export default async function RecetteIngredientsPage({ params }: { params: { id: string } }) {
  const recetteId = Number(params.id);

  let initialItems: Item[] = [];
  let initialAliments: AlimentOption[] = [];

  try {
    initialItems = await api.get<Item[]>(`/recette-aliments?recetteId=${recetteId}`);
  } catch {}
  try {
    const page = await api.get<Page<AlimentOption>>(`/aliments?page=0&size=200`);
    initialAliments = (page.content ?? []).sort((a,b)=>a.nom.localeCompare(b.nom));
  } catch {}

  return (
    <ClientIngredients
      recetteId={recetteId}
      initialItems={initialItems}
      initialAliments={initialAliments}
    />
  );
}
