ALTER TABLE incident_sos
    MODIFY COLUMN statut ENUM(
        'NOUVEAU',
        'PRIS_EN_CHARGE',
        'RESOLU',
        'CLOTURE'
    ) NOT NULL DEFAULT 'NOUVEAU';
