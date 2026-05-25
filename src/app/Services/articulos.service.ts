import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  private apiUrl =
    'http://localhost:8080/api/articulos';

  constructor(
    private http: HttpClient
  ) {}

  obtenerArticulos(): Observable<any> {
    return this.http.get(this.apiUrl);
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