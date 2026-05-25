import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudName = 'dsnlisgig';
  private uploadPreset = 'TrikiTrueke';
  private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post<any>(this.uploadUrl, formData).pipe(
      map((response) => response.secure_url as string)
    );
  }
}
