import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  constructor(private http: HttpClient) {}

  obtenerUsuario(id: string) {
    return this.http.get<any>(`/api/usuarios/${id}`, { withCredentials: true }).pipe(
      map((res: any) => res?.data ?? res)
    );
  }
}
