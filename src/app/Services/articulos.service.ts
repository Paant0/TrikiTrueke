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
        if (Array.isArray(data)) {
          return data.map((a: any) => this.normalizeArticulo(a));
        }
        return this.normalizeArticulo(data);
      }),
      catchError(err => throwError(() => err))
    );
  }

  buscarArticulos(nombre: string): Observable<any> {
    const termino = (nombre || '').trim();
    if (!termino) {
      return new Observable((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }

    return this.http.get(`${this.apiUrl}/buscar?nombre=${encodeURIComponent(termino)}`, {
      withCredentials: true,
      responseType: 'text',
      observe: 'response'
    }).pipe(
      map((resp: any) => {
        const data = extractData(resp);
        if (Array.isArray(data)) {
          return data.map((a: any) => this.normalizeArticulo(a));
        }
        return this.normalizeArticulo(data);
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
        if (Array.isArray(data)) {
          return data.map((a: any) => this.normalizeArticulo(a));
        }
        return this.normalizeArticulo(data);
      }),
      catchError(err => throwError(() => err))
    );
  }

  crearArticulo(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  obtenerArticulo(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { withCredentials: true, responseType: 'text', observe: 'response' }).pipe(
      map((resp: any) => {
        const data = extractData(resp);
        return this.normalizeArticulo(data);
      }),
      catchError(err => throwError(() => err))
    );
  }

  private normalizeArticulo(a: any) {
    if (!a || typeof a !== 'object') return a;

    const nombre = a.usuarioNombre
      || a.nombreUsuario
      || a.autorNombre
      || a.ownerNombre
      || a.createdByNombre
      || a.usuario?.nombre
      || a.autor?.nombre
      || a.owner?.nombre
      || a.createdBy?.nombre
      || null;

    a.usuarioNombre = nombre;

    // debug: mostrar qué nombre e id se han normalizado
    try {
      console.debug('[ArticulosService] normalizeArticulo -> usuarioNombre:', a.usuarioNombre, 'usuarioId:', a.usuarioId);
    } catch (e) {
      // noop
    }

    // normalizar usuarioId común (asegurarse de que sea un string/primitive, no un objeto)
    let uid: any = a.usuarioId ?? a.usuario?._id ?? a.usuario?.id ?? a.usuario ?? null;
    if (uid && typeof uid === 'object') {
      uid = uid._id ?? uid.id ?? uid.oid ?? uid.uuid ?? null;
    }
    a.usuarioId = uid;

    return a;
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