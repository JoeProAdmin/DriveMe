import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/auth`;

  public login(credentials: object): Observable<any> {
    return this.http.post(`${this.url}/login`, credentials);
  }

  public logout(): void {
    localStorage.clear();
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }
}
