package com.driveme.repository;

import com.driveme.entity.Passager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassagerRepository extends JpaRepository<Passager, Long> {
}
