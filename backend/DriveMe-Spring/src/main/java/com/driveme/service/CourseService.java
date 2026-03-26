package com.driveme.service;

import com.driveme.dto.CourseCreateDTO;
import com.driveme.dto.CourseResponseDTO;

import java.util.List;

public interface CourseService {

    CourseResponseDTO createCourse(CourseCreateDTO dto);

    List<CourseResponseDTO> getAllCourses();
}