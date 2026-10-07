package com.driveme.repository;

import com.driveme.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query(
            "select t from PasswordResetToken t where t.utilisateurId = :id"
    )
    Optional<PasswordResetToken> findByUtilisateurIdForUpdate(
            @org.springframework.data.repository.query.Param("id") Long id
    );
    @org.springframework.data.jpa.repository.Query(
            "select t.utilisateurId from PasswordResetToken t where t.tokenHash = :hash"
    )
    Optional<Long> findUtilisateurIdByTokenHash(
            @org.springframework.data.repository.query.Param("hash") String hash
    );
}
