-- DriveMe RC3.1B - Chauffeurs disponibles et propositions tarifaires
-- Compatible MySQL 8 / MariaDB 10.4+
-- Prerequis : effectuer une sauvegarde de la base driveme avant execution.
-- Le script ne supprime aucune ligne et peut etre rejoue.

USE driveme;

DELIMITER $$

DROP PROCEDURE IF EXISTS rc31b_add_column_if_missing$$
CREATE PROCEDURE rc31b_add_column_if_missing(
    IN p_table VARCHAR(64),
    IN p_column VARCHAR(64),
    IN p_definition TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = p_table
          AND column_name = p_column
    ) THEN
        SET @ddl = CONCAT('ALTER TABLE `', p_table, '` ADD COLUMN `', p_column, '` ', p_definition);
        PREPARE stmt FROM @ddl;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DROP PROCEDURE IF EXISTS rc31b_add_index_if_missing$$
CREATE PROCEDURE rc31b_add_index_if_missing(
    IN p_table VARCHAR(64),
    IN p_index VARCHAR(64),
    IN p_definition TEXT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.statistics
        WHERE table_schema = DATABASE()
          AND table_name = p_table
          AND index_name = p_index
    ) THEN
        SET @ddl = CONCAT('ALTER TABLE `', p_table, '` ADD ', p_definition);
        PREPARE stmt FROM @ddl;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DELIMITER ;

-- 1. Disponibilite et geolocalisation du chauffeur.
CALL rc31b_add_column_if_missing('chauffeur', 'disponible', 'BOOLEAN NOT NULL DEFAULT FALSE');
CALL rc31b_add_column_if_missing('chauffeur', 'latitude_actuelle', 'DOUBLE NULL');
CALL rc31b_add_column_if_missing('chauffeur', 'longitude_actuelle', 'DOUBLE NULL');
CALL rc31b_add_column_if_missing('chauffeur', 'derniere_position_at', 'DATETIME(6) NULL');
CALL rc31b_add_column_if_missing('chauffeur', 'version', 'BIGINT NOT NULL DEFAULT 0');

-- 2. Verrou optimiste et montants decimaux de la course.
CALL rc31b_add_column_if_missing('course', 'version', 'BIGINT NOT NULL DEFAULT 0');
ALTER TABLE course
    MODIFY COLUMN prix DECIMAL(10,2) NOT NULL,
    MODIFY COLUMN prix_estime DECIMAL(10,2) NULL,
    MODIFY COLUMN prix_initial DECIMAL(10,2) NULL,
    MODIFY COLUMN prix_final DECIMAL(10,2) NULL,
    MODIFY COLUMN statut VARCHAR(30) NOT NULL;

-- La conversion explicite en VARCHAR garantit que PROPOSITION_RECUE est accepte,
-- meme si une ancienne creation Hibernate avait produit un ENUM MySQL ferme.

-- 3. Table des propositions. CREATE IF NOT EXISTS preserve une table existante.
CREATE TABLE IF NOT EXISTS proposition_chauffeur (
    id BIGINT NOT NULL AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    chauffeur_id BIGINT NOT NULL,
    prix_propose DECIMAL(10,2) NOT NULL,
    distance_chauffeur_depart DOUBLE NULL,
    temps_estime_minutes INT NULL,
    message VARCHAR(300) NULL,
    statut_proposition VARCHAR(30) NOT NULL DEFAULT 'EN_ATTENTE',
    date_creation DATETIME(6) NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_proposition_course FOREIGN KEY (course_id) REFERENCES course(id),
    CONSTRAINT fk_proposition_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES chauffeur(id),
    CONSTRAINT uk_course_chauffeur UNIQUE (course_id, chauffeur_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Alignement non destructif si Hibernate avait deja cree la table.
CALL rc31b_add_column_if_missing('proposition_chauffeur', 'version', 'BIGINT NOT NULL DEFAULT 0');
ALTER TABLE proposition_chauffeur
    MODIFY COLUMN prix_propose DECIMAL(10,2) NOT NULL,
    MODIFY COLUMN message VARCHAR(300) NULL,
    MODIFY COLUMN statut_proposition VARCHAR(30) NOT NULL DEFAULT 'EN_ATTENTE';

CALL rc31b_add_index_if_missing(
    'proposition_chauffeur',
    'uk_course_chauffeur',
    'UNIQUE INDEX `uk_course_chauffeur` (`course_id`, `chauffeur_id`)'
);
CALL rc31b_add_index_if_missing(
    'proposition_chauffeur',
    'idx_proposition_course_statut',
    'INDEX `idx_proposition_course_statut` (`course_id`, `statut_proposition`)'
);
CALL rc31b_add_index_if_missing(
    'proposition_chauffeur',
    'idx_proposition_chauffeur_date',
    'INDEX `idx_proposition_chauffeur_date` (`chauffeur_id`, `date_creation`)'
);

-- 4. Paiements alignes sur les montants securises BigDecimal.
ALTER TABLE paiement MODIFY COLUMN montant DECIMAL(10,2) NOT NULL;

-- 5. Nettoyage des procedures temporaires.
DROP PROCEDURE IF EXISTS rc31b_add_column_if_missing;
DROP PROCEDURE IF EXISTS rc31b_add_index_if_missing;

-- Controles attendus apres execution.
SELECT column_name, column_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name IN ('chauffeur', 'course', 'proposition_chauffeur', 'paiement')
ORDER BY table_name, ordinal_position;

SHOW CREATE TABLE chauffeur;
SHOW CREATE TABLE course;
SHOW CREATE TABLE proposition_chauffeur;
