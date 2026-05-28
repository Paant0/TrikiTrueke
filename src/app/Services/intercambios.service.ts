import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { extractData, isEmptyData } from './http-utils';

@Injectable({ providedIn: 'root' })
export class IntercambiosService {
  private apiUrl = '/api/intercambios';

  constructor(private http: HttpClient) {}

  // Crear intercambio - payload requerido por backend
  crearIntercambio(payload: { articuloOfrecido: string; articuloRecibido: string; usuarioOfrece: string; usuarioRecibe: string }): Observable<any> {
    return this.http.post(this.apiUrl, payload, { withCredentials: true }).pipe(
      map((resp: any) => resp),
      catchError(err => throwError(() => err))
    );
  }

  // Alias para compatibilidad con llamadas previas
  solicitar(payload: { articuloOfrecido: string; articuloRecibido: string; usuarioOfrece: string; usuarioRecibe: string }) {
    return this.crearIntercambio(payload);
  }

  listar(): Observable<any> {
    return this.http.get(this.apiUrl, { withCredentials: true }).pipe(
      map((r: any) => r),
      catchError(err => throwError(() => err))
    );
  }

  obtenerMisIntercambios(): Observable<any> {
    const url = `${this.apiUrl}/mis`;
    return this.http.get(url, { withCredentials: true, responseType: 'text', observe: 'response' }).pipe(
      map((resp: any) => {
        const data = extractData(resp);
        if (isEmptyData(data)) console.warn('[IntercambiosService] obtenerMisIntercambios: data vacía', { data });
        return data;
      }),
      catchError(err => throwError(() => err))
    );
  }

  aceptarIntercambio(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/aceptar`, {}, { withCredentials: true }).pipe(
      map((r: any) => r),
      catchError(err => throwError(() => err))
    );
  }

  rechazarIntercambio(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/rechazar`, {}, { withCredentials: true }).pipe(
      map((r: any) => r),
      catchError(err => throwError(() => err))
    );
  }

  cancelarIntercambio(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      map((r: any) => r),
      catchError(err => throwError(() => err))
    );
  }

}
