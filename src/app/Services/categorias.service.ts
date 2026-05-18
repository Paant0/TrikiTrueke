import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private readonly API = '/api/categorias';

  constructor(private http: HttpClient) {}

  obtenerCategorias(): Observable<any> {
    return this.http.get(this.API, {
      withCredentials: true,
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map((resp: any) => {
        const contentType = resp.headers?.get?.('content-type') || '';
        const bodyText = resp.body ?? '';

        const looksLikeJson = contentType.includes('application/json') || /^\s*(\{|\[)/.test(bodyText);

        if (looksLikeJson) {
          try {
            return JSON.parse(bodyText);
          } catch (err) {
            throw {
              status: resp.status,
              statusText: resp.statusText,
              url: resp.url,
              message: 'Respuesta JSON inválida',
              raw: bodyText
            };
          }
        }

        throw {
          status: resp.status,
          statusText: resp.statusText,
          url: resp.url,
          message: 'Respuesta inesperada (no JSON)',
          contentType,
          raw: bodyText
        };
      }),
      catchError(err => throwError(() => err))
    );
  }
}