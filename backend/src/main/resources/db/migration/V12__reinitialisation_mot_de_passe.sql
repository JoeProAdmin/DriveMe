ALTER TABLE utilisateur
    ADD COLUMN auth_version BIGINT NOT NULL DEFAULT 0;

CREATE TABLE password_reset_token (
    utilisateur_id BIGINT NOT NULL,
    token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    date_creation DATETIME(6) NOT NULL,
    date_expiration DATETIME(6) NOT NULL,
    PRIMARY KEY (utilisateur_id),
    UNIQUE KEY uk_password_reset_token_hash (token_hash),
    CONSTRAINT fk_password_reset_utilisateur
        FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id)
        ON DELETE CASCADE
);
