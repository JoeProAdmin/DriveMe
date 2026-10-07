package com.driveme.service;

import com.driveme.dto.PassagerCreateDTO;
import com.driveme.dto.PassagerResponseDTO;

import java.util.List;

public interface PassagerService {

    PassagerResponseDTO createPassager(PassagerCreateDTO dto);

    List<PassagerResponseDTO> getAllPassagers();

    PassagerResponseDTO getPassagerById(Long id);

    PassagerResponseDTO getPassagerByEmail(String email);

    PassagerResponseDTO updatePassager(Long id, PassagerCreateDTO dto);

    void deletePassager(Long id);

    void deleteCurrentPassager(String email);

    long count();

}