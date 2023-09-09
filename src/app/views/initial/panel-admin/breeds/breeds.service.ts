import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../core/environments/environment';
import { Observable } from 'rxjs';
import { AnimalTypeDTO } from '../animal-types/animal-types.service';

export interface BreedDTO {
  Id: number;
  Name: string;
  AnimalType: AnimalTypeDTO;
}

export interface BreedRequest {
  Name: string;
  AdministratorId: number;
  AnimalTypeId: number;
}

@Injectable({
  providedIn: 'root'
})
export class BreedsService {
  private readonly api = `${environment.api}Breeds`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BreedDTO[]> {
    return this.http.get<BreedDTO[]>(this.api);
  }

  getById(id: number): Observable<BreedDTO> {
    return this.http.get<BreedDTO>(`${this.api}/${id}`);
  }

  create(request: BreedRequest): Observable<BreedDTO> {
    return this.http.post<BreedDTO>(this.api, request);
  }

  update(id: number, request: BreedRequest): Observable<BreedDTO> {
    return this.http.put<BreedDTO>(`${this.api}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
