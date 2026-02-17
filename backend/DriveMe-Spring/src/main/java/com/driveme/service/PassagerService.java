package com.driveme.service;

import com.driveme.dto.PassagerCreateDTO;
import com.driveme.dto.PassagerResponseDTO;

import java.util.List;

public interface PassagerService {

    List<PassagerResponseDTO> getAllPassagers();

    PassagerResponseDTO createPassager(PassagerCreateDTO dto);
}
