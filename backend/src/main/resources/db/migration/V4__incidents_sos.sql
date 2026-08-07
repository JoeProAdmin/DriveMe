CREATE TABLE incident_sos (
    id BIGINT NOT NULL AUTO_INCREMENT,
    utilisateur_id BIGINT NOT NULL,
    type_incident VARCHAR(50) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    latitude DECIMAL(10,7) NULL,
    longitude DECIMAL(10,7) NULL,
    precision_metres DECIMAL(10,2) NULL,
    statut VARCHAR(30) NOT NULL DEFAULT 'NOUVEAU',
    date_creation DATETIME(6) NOT NULL,
    date_mise_a_jour DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_incident_sos_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id),
    INDEX idx_incident_sos_statut_date (statut, date_creation),
    INDEX idx_incident_sos_utilisateur_date (utilisateur_id, date_creation)
);
