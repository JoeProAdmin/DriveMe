-- DriveMe V9.3 - Choix du service passager et informations de prise en charge
-- La période JOUR/NUIT est calculée par le backend à partir de date_heure_depart.

ALTER TABLE course
    ADD COLUMN categorie_service VARCHAR(40) NOT NULL DEFAULT 'TOUS_SERVICES',
    ADD COLUMN nombre_passagers INT NOT NULL DEFAULT 1,
    ADD COLUMN date_heure_depart DATETIME(6) NULL,
    ADD COLUMN periode_course VARCHAR(10) NULL,
    ADD COLUMN bagages_importants BIT(1) NOT NULL DEFAULT b'0',
    ADD COLUMN vehicule_adapte BIT(1) NOT NULL DEFAULT b'0';

UPDATE course
SET date_heure_depart = date_creation,
    periode_course = CASE
        WHEN TIME(date_creation) >= '20:00:00'
          OR TIME(date_creation) < '06:00:00' THEN 'NUIT'
        ELSE 'JOUR'
    END
WHERE date_heure_depart IS NULL
   OR periode_course IS NULL;

ALTER TABLE course
    MODIFY date_heure_depart DATETIME(6) NOT NULL,
    MODIFY periode_course VARCHAR(10) NOT NULL;

CREATE INDEX idx_course_categorie_statut
    ON course (categorie_service, statut);
