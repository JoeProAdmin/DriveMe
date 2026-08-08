-- DriveMe V9.1 - Typologie juridique et commerciale des chauffeurs
-- Les chauffeurs existants restent volontairement non classés jusqu'à vérification.

ALTER TABLE chauffeur
    ADD COLUMN type_chauffeur VARCHAR(30) NULL;
