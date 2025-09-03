CREATE TABLE utilisateur (
    id SERIAL PRIMARY KEY,
    prenom VARCHAR(50) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    genre VARCHAR(10) CHECK (genre IN ('Homme', 'Femme', 'Autre')) NOT NULL,
    taille INT CHECK (taille > 0),
    poids DECIMAL(5,2) CHECK (poids > 0)
);

CREATE TABLE famille (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO famille (nom) VALUES
('Poisson'), ('Viande'), ('Oeufs'), ('Produits laitiers'), ('Fruits'),
('Légumes'), ('Céréales'), ('Matières grasses'), ('Féculents');

CREATE TABLE aliment (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    proteine DECIMAL(5,2) CHECK (proteine >= 0),
    lipide DECIMAL(5,2) CHECK (lipide >= 0),
    glucide DECIMAL(5,2) CHECK (glucide >= 0),
    matiere_grasse DECIMAL(5,2) CHECK (matiere_grasse >= 0),
    kilocalorie INT CHECK (kilocalorie >= 0),
    famille_id INT REFERENCES famille(id) ON DELETE SET NULL
);

CREATE TABLE repas (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) UNIQUE NOT NULL CHECK (nom IN ('Petit-déjeuner', 'Déjeuner', 'Dîner', 'Collation'))
);

INSERT INTO repas (nom) VALUES ('Petit-déjeuner'), ('Déjeuner'), ('Dîner'), ('Collation');

CREATE TABLE recette (
    id SERIAL PRIMARY KEY,
    utilisateur_id INT REFERENCES utilisateur(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    type_repas_id INT REFERENCES repas(id) ON DELETE SET NULL
);

CREATE TABLE recette_aliment (
    id SERIAL PRIMARY KEY,
    recette_id INT REFERENCES recette(id) ON DELETE CASCADE,
    aliment_id INT REFERENCES aliment(id) ON DELETE CASCADE,
    poids DECIMAL(6,2) CHECK (poids > 0) NOT NULL
);

CREATE TABLE favori (
    id SERIAL PRIMARY KEY,
    utilisateur_id INT REFERENCES utilisateur(id) ON DELETE CASCADE,
    aliment_id INT REFERENCES aliment(id) ON DELETE CASCADE
);

CREATE TABLE administrateur (
    id SERIAL PRIMARY KEY,
    utilisateur_id INT REFERENCES utilisateur(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Super Admin', 'Gestionnaire'))
);