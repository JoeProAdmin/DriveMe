-- DriveMe - Alignement du schema avec le modele Java de production

-- UTILISATEUR
ALTER TABLE utilisateur
    MODIFY nom VARCHAR(100) NOT NULL,
    MODIFY prenom VARCHAR(100) NOT NULL,
    MODIFY email VARCHAR(150) NOT NULL,
    MODIFY telephone VARCHAR(20) NOT NULL,
    MODIFY mot_de_passe VARCHAR(255) NOT NULL,
    MODIFY language ENUM('FR','EN','AR','ES') NOT NULL;

ALTER TABLE utilisateur
    ADD CONSTRAINT uk_utilisateur_telephone UNIQUE (telephone);


-- PASSAGER
ALTER TABLE passager
    MODIFY utilisateur_id BIGINT NOT NULL;


-- CHAUFFEUR
ALTER TABLE chauffeur
    MODIFY utilisateur_id BIGINT NOT NULL;


-- COURSE
-- chauffeur_id reste volontairement nullable :
-- une course EN_ATTENTE n'a pas encore de chauffeur affecte.
ALTER TABLE course
    MODIFY passager_id BIGINT NOT NULL,
    MODIFY adresse_depart VARCHAR(255) NOT NULL,
    MODIFY adresse_arrivee VARCHAR(255) NOT NULL;