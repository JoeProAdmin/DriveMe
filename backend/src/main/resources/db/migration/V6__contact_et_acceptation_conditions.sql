ALTER TABLE utilisateur ADD COLUMN conditions_acceptees_at DATETIME NULL, ADD COLUMN version_conditions VARCHAR(30) NULL;
CREATE TABLE contact_message (
 id BIGINT NOT NULL AUTO_INCREMENT, nom VARCHAR(100) NOT NULL, email VARCHAR(150) NOT NULL, telephone VARCHAR(20) NULL,
 sujet VARCHAR(150) NOT NULL, message TEXT NOT NULL, consentement_at DATETIME NOT NULL,
 date_creation DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, statut VARCHAR(20) NOT NULL DEFAULT 'NOUVEAU', PRIMARY KEY(id),
 KEY idx_contact_date(date_creation), KEY idx_contact_statut(statut)
);
