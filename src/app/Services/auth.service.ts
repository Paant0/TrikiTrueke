import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';

export interface UsuarioDTO {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
}

export interface LoginRequest {
  email: string;
  clave: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  telefono: string;
  clave: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Ruta relativa — el proxy redirige a http://localhost:8080
  private readonly API = '/api/auth';

  // Estado reactivo del usuario actual
  private currentUserSubject = new BehaviorSubject<UsuarioDTO | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): UsuarioDTO | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  login(data: LoginRequest): Observable<UsuarioDTO> {
    // Sin withCredentials en el POST: evitamos enviar las cookies masivas del navegador.
    // Spring Boot igualmente setea la cookie JSESSIONID en la respuesta.
    return this.http.post<UsuarioDTO>(`${this.API}/login`, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true   // necesario para RECIBIR y guardar la cookie JSESSIONID
    }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  register(data: RegisterRequest): Observable<UsuarioDTO> {
    // Sin withCredentials: el navegador no envía cookies (no hacen falta para el registro)
    return this.http.post<UsuarioDTO>('/api/auth/register', data, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(err => {
        console.group('❌ Error en registro');
        console.log('Status:', err.status);
        console.log('Body:', err.error);
        console.groupEnd();
        return throwError(() => err);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }

  getMe(): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.API}/me`, {
      withCredentials: true
    }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }
}