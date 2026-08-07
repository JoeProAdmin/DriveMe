CREATE TABLE IF NOT EXISTS transaction_portefeuille (
    id BIGINT NOT NULL AUTO_INCREMENT,
    chauffeur_id BIGINT NOT NULL,
    course_id BIGINT NULL,
    type_transaction ENUM('BONUS_BIENVENUE','RECHARGE','COMMISSION_COURSE') NOT NULL,
    statut ENUM('EN_ATTENTE','VALIDEE','REFUSEE') NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    solde_avant DECIMAL(10,2) NULL,
    solde_apres DECIMAL(10,2) NULL,
    methode ENUM('PROMOTION','CARTE','ONLINE','VIREMENT','WAFACASH','WESTERN_UNION','AGENCE_PARTENAIRE') NOT NULL,
    reference_externe VARCHAR(120) NULL,
    description VARCHAR(255) NOT NULL,
    date_creation DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    date_validation DATETIME(6) NULL,
    validee_par BIGINT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_transaction_portefeuille_chauffeur FOREIGN KEY (chauffeur_id) REFERENCES chauffeur(id),
    CONSTRAINT fk_transaction_portefeuille_course FOREIGN KEY (course_id) REFERENCES course(id),
    CONSTRAINT fk_transaction_portefeuille_admin FOREIGN KEY (validee_par) REFERENCES utilisateur(id),
    CONSTRAINT chk_transaction_portefeuille_montant CHECK (montant > 0),
    UNIQUE KEY uk_transaction_commission_course (course_id, type_transaction),
    INDEX idx_transaction_portefeuille_chauffeur_date (chauffeur_id, date_creation),
    INDEX idx_transaction_portefeuille_statut (statut)
);

UPDATE chauffeur SET solde_credit = COALESCE(solde_credit, 0) + 100.00;

INSERT INTO transaction_portefeuille
    (chauffeur_id, type_transaction, statut, montant, solde_avant, solde_apres, methode, description, date_validation)
SELECT id, 'BONUS_BIENVENUE', 'VALIDEE', 100.00,
       COALESCE(solde_credit, 100.00) - 100.00, COALESCE(solde_credit, 100.00),
       'PROMOTION', 'Crédit promotionnel offert au lancement de DriveMe', CURRENT_TIMESTAMP(6)
FROM chauffeur;

INSERT INTO transaction_portefeuille
    (chauffeur_id, course_id, type_transaction, statut, montant, methode, description, date_creation, date_validation)
SELECT c.chauffeur_id, c.id, 'COMMISSION_COURSE', 'VALIDEE',
       ROUND(COALESCE(c.prix_final, c.prix) * 0.10, 2), 'ONLINE',
       CONCAT('Commission DriveMe de 10 % sur la course #', c.id),
       COALESCE(c.date_creation, CURRENT_TIMESTAMP(6)), CURRENT_TIMESTAMP(6)
FROM course c
WHERE c.statut = 'TERMINEE' AND c.chauffeur_id IS NOT NULL
  AND COALESCE(c.prix_final, c.prix) > 0;

UPDATE chauffeur ch
LEFT JOIN (
    SELECT chauffeur_id, SUM(montant) AS total_commissions
    FROM transaction_portefeuille
    WHERE type_transaction = 'COMMISSION_COURSE' AND statut = 'VALIDEE'
    GROUP BY chauffeur_id
) commissions ON commissions.chauffeur_id = ch.id
SET ch.solde_credit = GREATEST(0, ch.solde_credit - COALESCE(commissions.total_commissions, 0));
