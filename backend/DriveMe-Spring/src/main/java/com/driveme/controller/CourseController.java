package com.driveme.controller;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;
import com.driveme.service.CourseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public CourseResponseDTO create(@RequestBody CourseCreateDTO dto) {
        return courseService.createCourse(dto);
    }

    @GetMapping
    public List<CourseResponseDTO> getAll() {
        return courseService.getAllCourses();
    }

    @GetMapping("/chauffeur/{id}")
    public List<CourseResponseDTO> getByChauffeur(@PathVariable Long id) {
        return courseService.getCoursesByChauffeur(id);
    }

    @GetMapping("/passager/{id}")
    public List<CourseResponseDTO> getByPassager(@PathVariable Long id) {
        return courseService.getCoursesByPassager(id);
    }

    // ✅ AJOUT ROLE DANS API
    @PutMapping("/{id}/status")
    public CourseResponseDTO updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam String role
    ) {
        return courseService.updateStatus(id, status, role);
    }
}