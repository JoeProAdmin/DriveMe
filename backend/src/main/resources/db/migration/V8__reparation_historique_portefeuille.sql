-- V8__reparation_historique_portefeuille.sql
-- Réparation des colonnes solde_avant et solde_apres dans l'historique du portefeuille chauffeur.
-- Suite à la migration V7, certaines commissions ont été insérées avec des snapshots de solde à NULL.

DELIMITER //

DROP PROCEDURE IF EXISTS ReparerHistoriquePortefeuille //

CREATE PROCEDURE ReparerHistoriquePortefeuille()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE current_chauffeur_id BIGINT;

    -- Curseur sur tous les chauffeurs qui ont au moins une transaction avec des snapshots NULL
    DECLARE cur_chauffeurs CURSOR FOR
        SELECT DISTINCT chauffeur_id
        FROM transaction_portefeuille
        WHERE solde_avant IS NULL OR solde_apres IS NULL;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur_chauffeurs;

    chauffeur_loop: LOOP
        FETCH cur_chauffeurs INTO current_chauffeur_id;
        IF done THEN
            LEAVE chauffeur_loop;
        END IF;

        -- Pour chaque chauffeur, on recalcule toute sa chaîne chronologique
        BEGIN
            DECLARE tx_done INT DEFAULT FALSE;
            DECLARE current_tx_id BIGINT;
            DECLARE current_tx_type VARCHAR(50);
            DECLARE current_tx_montant DECIMAL(10,2);
            DECLARE var_solde_courant DECIMAL(10,2) DEFAULT 0.00;
            DECLARE var_solde_apres DECIMAL(10,2);

            -- Ordre déterministe imposé : date_creation puis id
            DECLARE cur_tx CURSOR FOR
                SELECT id, type_transaction, montant
                FROM transaction_portefeuille
                WHERE chauffeur_id = current_chauffeur_id
                ORDER BY date_creation ASC, id ASC;

            DECLARE CONTINUE HANDLER FOR NOT FOUND SET tx_done = TRUE;

            OPEN cur_tx;

            tx_loop: LOOP
                FETCH cur_tx INTO current_tx_id, current_tx_type, current_tx_montant;
                IF tx_done THEN
                    LEAVE tx_loop;
                END IF;

                -- Calcul du nouveau solde après transaction
                SET var_solde_apres = CASE
                    WHEN current_tx_type IN ('BONUS_BIENVENUE', 'RECHARGE') THEN var_solde_courant + current_tx_montant
                    WHEN current_tx_type = 'COMMISSION_COURSE' THEN var_solde_courant - current_tx_montant
                    ELSE var_solde_courant
                END;

                -- Mise à jour de la transaction (réparation ou écrasement pour cohérence)
                UPDATE transaction_portefeuille
                SET solde_avant = var_solde_courant,
                    solde_apres = var_solde_apres
                WHERE id = current_tx_id;

                -- Passage au solde suivant
                SET var_solde_courant = var_solde_apres;

            END LOOP tx_loop;
            CLOSE cur_tx;
        END;

    END LOOP chauffeur_loop;
    CLOSE cur_chauffeurs;
END //

DELIMITER ;

-- Exécution de la procédure
CALL ReparerHistoriquePortefeuille();

-- Nettoyage final
DROP PROCEDURE IF EXISTS ReparerHistoriquePortefeuille;
