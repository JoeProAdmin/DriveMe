-- DriveMe - Bloc Admin 2 : dossier chauffeur, vehicule et documents

ALTER TABLE chauffeur
    ADD COLUMN marque_vehicule VARCHAR(80) NULL,
    ADD COLUMN modele_vehicule VARCHAR(80) NULL,
    ADD COLUMN annee_vehicule INT NULL,
    ADD COLUMN immatriculation VARCHAR(40) NULL;

CREATE TABLE chauffeur_document (
    id BIGINT NOT NULL AUTO_INCREMENT,
    chauffeur_id BIGINT NOT NULL,
    type_document VARCHAR(30) NOT NULL,
    nom_original VARCHAR(255) NOT NULL,
    nom_stockage VARCHAR(255) NOT NULL,
    type_contenu VARCHAR(100) NOT NULL,
    taille_octets BIGINT NOT NULL,
    statut_validation VARCHAR(20) NOT NULL DEFAULT 'EN_ATTENTE',
    date_depot DATETIME NOT NULL,
    date_validation DATETIME NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_chauffeur_document_chauffeur
        FOREIGN KEY (chauffeur_id) REFERENCES chauffeur(id) ON DELETE CASCADE,
    CONSTRAINT uk_chauffeur_document_type UNIQUE (chauffeur_id, type_document),
    INDEX idx_chauffeur_document_chauffeur (chauffeur_id),
    INDEX idx_chauffeur_document_statut (statut_validation)
);
