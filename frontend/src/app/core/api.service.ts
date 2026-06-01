import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  createCourse(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/courses`, data);
  }

  getCoursesByPassager(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses/passager/${id}`);
  }

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses`);
  }

  getChauffeurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/chauffeurs`);
  }

  getPassagers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/passagers`);
  }

  deleteChauffeur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/chauffeurs/${id}`);
  }

  deletePassager(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/passagers/${id}`);
  }

  updateCourseStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/courses/${id}/status`, { status });
  }

  getAdminStats(): Observable<any> {
    return forkJoin({
      chauffeurs: this.getChauffeurs(),
      passagers: this.getPassagers(),
      courses: this.getCourses()
    }).pipe(
      map(data => ({
        totalChauffeurs: data.chauffeurs.length,
        totalPassagers: data.passagers.length,
        totalCourses: data.courses.length,
        totalPaiements: 0,
        totalAvis: 0,
        chauffeurs: data.chauffeurs,
        passagers: data.passagers,
        courses: data.courses
      }))
    );
  }
}
