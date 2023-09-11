import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../core/environments/environment';
import { Observable } from 'rxjs';

export interface AnimalTypeDTO {
  id: number;
  name: string;
}

export interface AnimalTypeRequest {
  name: string;
  administratorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnimalTypesService {
  private readonly api = `${environment.api}AnimalTypes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AnimalTypeDTO[]> {
    return this.http.get<AnimalTypeDTO[]>(this.api);
  }

  getById(id: number): Observable<AnimalTypeDTO> {
    return this.http.get<AnimalTypeDTO>(`${this.api}/${id}`);
  }

  create(request: AnimalTypeRequest): Observable<AnimalTypeDTO> {
    return this.http.post<AnimalTypeDTO>(this.api, request);
  }

  update(id: number, request: AnimalTypeRequest): Observable<AnimalTypeDTO> {
    return this.http.put<AnimalTypeDTO>(`${this.api}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
