import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { extractData, isEmptyData } from './http-utils';

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
        const data = extractData(resp);
        if (isEmptyData(data)) {
          console.warn('[CategoriasService] obtenerCategorias: data vacía o nula', { data });
        }
        return data;
      }),
      catchError(err => throwError(() => err))
    );
  }
}