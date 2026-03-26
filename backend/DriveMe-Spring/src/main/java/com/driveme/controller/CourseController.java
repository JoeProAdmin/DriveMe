package com.driveme.controller;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;
import com.driveme.service.CourseService;
import jakarta.validation.Valid;
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
    public CourseResponseDTO create(@Valid @RequestBody CourseCreateDTO dto) {
        return courseService.createCourse(dto);
    }

    @GetMapping
    public List<CourseResponseDTO> getAll() {
        return courseService.getAllCourses();
    }
}