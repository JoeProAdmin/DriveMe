package com.driveme.controller;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;
import com.driveme.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // ===============================
    // GET ALL
    // ===============================
    @GetMapping
    public List<CourseResponseDTO> getAllCourses() {
        return courseService.getAllCourses();
    }

    // ===============================
    // GET BY ID
    // ===============================
    @GetMapping("/{id}")
    public CourseResponseDTO getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    // ===============================
    // CREATE
    // ===============================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponseDTO createCourse(@Valid @RequestBody CourseCreateDTO dto) {
        return courseService.createCourse(dto);
    }

    // ===============================
    // DELETE
    // ===============================
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }
}
