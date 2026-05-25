import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { extractData, isEmptyData } from './http-utils';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  private apiUrl = '/api/articulos';

  constructor(
    private http: HttpClient
  ) {}

  obtenerArticulos(): Observable<any> {
    return this.http.get(this.apiUrl, {
      withCredentials: true,
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map((resp: any) => {
        const data = extractData(resp);
        if (isEmptyData(data)) {
          // data vacía o nula
        }
        return data;
      }),
      catchError(err => throwError(() => err))
    );
  }

  obtenerMisArticulos(): Observable<any> {
    const url = `${this.apiUrl}/mis`;
    return this.http.get(url, {
      withCredentials: true,
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map((resp: any) => {
        const data = extractData(resp);
        if (isEmptyData(data)) {
          // data vacía o nula
        }
        return data;
      }),
      catchError(err => throwError(() => err))
    );
  }

  crearArticulo(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  editarArticulo(
    id: string,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    );

  }

  eliminarArticulo(id: string): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}