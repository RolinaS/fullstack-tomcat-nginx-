export type Page<T> = {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
};

export type Genre = "Homme" | "Femme" | "Autre";

export interface Utilisateur {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  genre: Genre;
  taille?: number | null;
  poids?: number | null;
}

export interface Aliment {
  id: number;
  nom: string;
  proteine?: number | null;
  lipide?: number | null;
  glucide?: number | null;
  matiereGrasse?: number | null;
  kilocalorie?: number | null;
  familleId?: number | null;
  familleNom?: string | null;
}

export interface Recette {
  id: number;
  nom: string;
  utilisateurId?: number | null;
  utilisateurNomComplet?: string | null;
  typeRepasId?: number | null;
  typeRepasNom?: string | null;
}
