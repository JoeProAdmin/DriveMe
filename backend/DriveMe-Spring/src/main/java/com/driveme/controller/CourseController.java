package com.driveme.controller;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;
import com.driveme.service.CourseService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PreAuthorize("hasRole('PASSAGER')")
    @PostMapping
    public CourseResponseDTO create(@RequestBody CourseCreateDTO dto) {
        return courseService.createCourse(dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<CourseResponseDTO> getAll() {
        return courseService.getAllCourses();
    }

    @PreAuthorize("hasAnyRole('CHAUFFEUR','ADMIN')")
    @GetMapping("/chauffeur/{id}")
    public List<CourseResponseDTO> getByChauffeur(@PathVariable Long id) {
        return courseService.getCoursesByChauffeur(id);
    }

    @PreAuthorize("hasAnyRole('PASSAGER','ADMIN')")
    @GetMapping("/passager/{id}")
    public List<CourseResponseDTO> getByPassager(@PathVariable Long id) {
        return courseService.getCoursesByPassager(id);
    }

    @PreAuthorize("hasAnyRole('CHAUFFEUR','ADMIN')")
    @PutMapping("/{id}/status")
    public CourseResponseDTO updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return courseService.updateStatus(id, status);
    }
}