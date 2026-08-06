CREATE TABLE utilisateur (
                             id BIGINT NOT NULL AUTO_INCREMENT,
                             nom VARCHAR(50) DEFAULT NULL,
                             prenom VARCHAR(50) DEFAULT NULL,
                             email VARCHAR(100) DEFAULT NULL,
                             telephone VARCHAR(20) DEFAULT NULL,
                             mot_de_passe VARCHAR(255) DEFAULT NULL,
                             role ENUM('ADMIN','CHAUFFEUR','PASSAGER') NOT NULL,
                             language ENUM('FR','EN','AR') NOT NULL,
                             date_creation DATETIME(6) NOT NULL,
                             PRIMARY KEY (id),
                             UNIQUE KEY uk_utilisateur_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE passager (
                          id BIGINT NOT NULL AUTO_INCREMENT,
                          utilisateur_id BIGINT DEFAULT NULL,
                          photo_url VARCHAR(255) DEFAULT NULL,
                          date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          PRIMARY KEY (id),
                          UNIQUE KEY uk_passager_utilisateur (utilisateur_id),
                          CONSTRAINT fk_passager_utilisateur
                              FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE chauffeur (
                           id BIGINT NOT NULL AUTO_INCREMENT,
                           utilisateur_id BIGINT DEFAULT NULL,
                           statut_validation TINYINT DEFAULT 0,
                           note_moyenne DECIMAL(3,2) DEFAULT NULL,
                           solde_credit DECIMAL(10,2) DEFAULT NULL,
                           derniere_position_at DATETIME(6) DEFAULT NULL,
                           disponible BIT(1) NOT NULL DEFAULT b'0',
                           latitude_actuelle DOUBLE DEFAULT NULL,
                           longitude_actuelle DOUBLE DEFAULT NULL,
                           version BIGINT NOT NULL DEFAULT 0,
                           PRIMARY KEY (id),
                           UNIQUE KEY uk_chauffeur_utilisateur (utilisateur_id),
                           CONSTRAINT fk_chauffeur_utilisateur
                               FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE course (
                        id BIGINT NOT NULL AUTO_INCREMENT,
                        passager_id BIGINT DEFAULT NULL,
                        chauffeur_id BIGINT DEFAULT NULL,
                        adresse_depart VARCHAR(255) DEFAULT NULL,
                        adresse_arrivee VARCHAR(255) DEFAULT NULL,
                        prix DECIMAL(10,2) NOT NULL,
                        statut ENUM(
        'EN_ATTENTE',
        'PROPOSITION_RECUE',
        'ACCEPTEE',
        'CHAUFFEUR_EN_ROUTE',
        'CHAUFFEUR_ARRIVE',
        'EN_COURS',
        'TERMINEE',
        'ANNULEE'
    ) NOT NULL,
                        date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        prix_final DECIMAL(10,2) DEFAULT NULL,
                        prix_initial DECIMAL(10,2) DEFAULT NULL,
                        distance_km DOUBLE DEFAULT NULL,
                        duree_estimee_minutes INT DEFAULT NULL,
                        latitude_arrivee DOUBLE DEFAULT NULL,
                        latitude_depart DOUBLE DEFAULT NULL,
                        longitude_arrivee DOUBLE DEFAULT NULL,
                        longitude_depart DOUBLE DEFAULT NULL,
                        prix_estime DECIMAL(10,2) DEFAULT NULL,
                        version BIGINT NOT NULL DEFAULT 0,
                        PRIMARY KEY (id),
                        KEY idx_course_passager (passager_id),
                        KEY idx_course_chauffeur (chauffeur_id),
                        CONSTRAINT fk_course_passager
                            FOREIGN KEY (passager_id) REFERENCES passager(id),
                        CONSTRAINT fk_course_chauffeur
                            FOREIGN KEY (chauffeur_id) REFERENCES chauffeur(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE proposition_chauffeur (
                                       id BIGINT NOT NULL AUTO_INCREMENT,
                                       date_creation DATETIME(6) NOT NULL,
                                       distance_chauffeur_depart DOUBLE DEFAULT NULL,
                                       message VARCHAR(300) DEFAULT NULL,
                                       prix_propose DECIMAL(10,2) NOT NULL,
                                       statut_proposition ENUM(
        'EN_ATTENTE',
        'ACCEPTEE',
        'REFUSEE',
        'ANNULEE'
    ) NOT NULL,
                                       temps_estime_minutes INT DEFAULT NULL,
                                       chauffeur_id BIGINT NOT NULL,
                                       course_id BIGINT NOT NULL,
                                       version BIGINT NOT NULL DEFAULT 0,
                                       PRIMARY KEY (id),
                                       UNIQUE KEY uk_course_chauffeur (course_id, chauffeur_id),
                                       KEY idx_proposition_course_statut (course_id, statut_proposition),
                                       KEY idx_proposition_chauffeur_date (chauffeur_id, date_creation),
                                       CONSTRAINT fk_proposition_chauffeur
                                           FOREIGN KEY (chauffeur_id) REFERENCES chauffeur(id),
                                       CONSTRAINT fk_proposition_course
                                           FOREIGN KEY (course_id) REFERENCES course(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE paiement (
                          id BIGINT NOT NULL AUTO_INCREMENT,
                          course_id BIGINT DEFAULT NULL,
                          montant DECIMAL(10,2) NOT NULL,
                          methode ENUM('CASH','CARTE','ONLINE') NOT NULL,
                          statut ENUM('EN_ATTENTE','PAYE','REFUSE') NOT NULL,
                          date_paiement DATETIME(6) DEFAULT NULL,
                          PRIMARY KEY (id),
                          UNIQUE KEY uk_paiement_course (course_id),
                          CONSTRAINT fk_paiement_course
                              FOREIGN KEY (course_id) REFERENCES course(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE avis (
                      id BIGINT NOT NULL AUTO_INCREMENT,
                      commentaire VARCHAR(1000) DEFAULT NULL,
                      date_creation DATETIME(6) NOT NULL,
                      note INT NOT NULL,
                      chauffeur_id BIGINT NOT NULL,
                      course_id BIGINT NOT NULL,
                      PRIMARY KEY (id),
                      UNIQUE KEY uk_avis_course (course_id),
                      KEY idx_avis_chauffeur (chauffeur_id),
                      CONSTRAINT fk_avis_course
                          FOREIGN KEY (course_id) REFERENCES course(id),
                      CONSTRAINT fk_avis_chauffeur
                          FOREIGN KEY (chauffeur_id) REFERENCES chauffeur(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;