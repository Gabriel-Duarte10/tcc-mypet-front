import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../core/environments/environment';
import { Observable } from 'rxjs';

export interface CharacteristicDTO {
  id: number;
  name: string;
}

export interface CharacteristicRequest {
  name: string;
  administratorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CharacteristicsService {
  private readonly api = `${environment.api}Characteristics`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CharacteristicDTO[]> {
    return this.http.get<CharacteristicDTO[]>(this.api);
  }

  getById(id: number): Observable<CharacteristicDTO> {
    return this.http.get<CharacteristicDTO>(`${this.api}/${id}`);
  }

  create(request: CharacteristicRequest): Observable<CharacteristicDTO> {
    return this.http.post<CharacteristicDTO>(this.api, request);
  }

  update(id: number, request: CharacteristicRequest): Observable<CharacteristicDTO> {
    return this.http.put<CharacteristicDTO>(`${this.api}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
