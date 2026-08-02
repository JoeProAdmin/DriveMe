-- RC3.4 - Garantir un seul avis par course
-- Ne pas réexécuter si la contrainte uk_avis_course existe déjà.

SELECT course_id, COUNT(*) AS nombre_avis
FROM avis
GROUP BY course_id
HAVING COUNT(*) > 1;

ALTER TABLE avis
    ADD CONSTRAINT uk_avis_course UNIQUE (course_id);