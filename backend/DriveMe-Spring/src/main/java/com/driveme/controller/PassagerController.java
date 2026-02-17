package com.driveme.controller;

import com.driveme.dto.PassagerCreateDTO;
import com.driveme.dto.PassagerResponseDTO;
import com.driveme.service.PassagerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passagers")
public class PassagerController {

    private final PassagerService passagerService;

    public PassagerController(PassagerService passagerService) {
        this.passagerService = passagerService;
    }

    @GetMapping
    public List<PassagerResponseDTO> getAll() {
        return passagerService.getAllPassagers();
    }

    @PostMapping
    public PassagerResponseDTO create(@RequestBody PassagerCreateDTO dto) {
        return passagerService.createPassager(dto);
    }
}
