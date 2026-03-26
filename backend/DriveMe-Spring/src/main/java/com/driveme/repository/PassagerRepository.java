package com.driveme.repository;

import com.driveme.entity.Passager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PassagerRepository extends JpaRepository<Passager, Long> {

    Optional<Passager> findByEmail(String email);

    Optional<Passager> findByTelephone(String telephone);

    boolean existsByEmail(String email);

    boolean existsByTelephone(String telephone);
}