package com.driveme.service;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;

import java.util.List;

public interface CourseService {

    List<CourseResponseDTO> getAllCourses();

    CourseResponseDTO getCourseById(Long id);

    CourseResponseDTO createCourse(CourseCreateDTO dto);

    void deleteCourse(Long id);
}
