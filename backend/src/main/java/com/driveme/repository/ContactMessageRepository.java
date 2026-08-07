package com.driveme.repository;
import com.driveme.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ContactMessageRepository extends JpaRepository<ContactMessage,Long> {}
