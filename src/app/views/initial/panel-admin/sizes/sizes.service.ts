import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../core/environments/environment';
import { Observable } from 'rxjs';

export interface SizeDTO {
  id: number;
  name: string;
}

export interface SizeRequest {
  name: string;
  administratorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SizesService {
  private readonly api = `${environment.api}Sizes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SizeDTO[]> {
    return this.http.get<SizeDTO[]>(this.api);
  }

  getById(id: number): Observable<SizeDTO> {
    return this.http.get<SizeDTO>(`${this.api}/${id}`);
  }

  create(request: SizeRequest): Observable<SizeDTO> {
    return this.http.post<SizeDTO>(this.api, request);
  }

  update(id: number, request: SizeRequest): Observable<SizeDTO> {
    return this.http.put<SizeDTO>(`${this.api}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
