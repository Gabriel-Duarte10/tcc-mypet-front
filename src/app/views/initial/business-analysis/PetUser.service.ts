import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/core/environments/environment';

export interface PetDto {
  id: number;
  name: string;
  birthMonth: number;
  birthYear: number;
  gender: boolean;
  description: string;
  isNeutered: boolean;
  isVaccinated: boolean;
  adoptionStatus: boolean;
  characteristicId: number;
  breedId: number;
  sizeId: number;
  animalTypeId: number;
  createdAt: string;
  user: UserDto;
}
export interface UserDto {
  id: number;
  name: string;
  cellphone: string;
  zipCode: string;
  street: string;
  number: number;
  state: string;
  city: string;
  longitude: string;
  latitude: string;
}

@Injectable({
  providedIn: 'root'
})
export class PetsUsersService {
  private readonly apiPet = `${environment.api}Pets`;
  private readonly apiUser = `${environment.api}Users`;

  constructor(private http: HttpClient) {}

  getAllPets(): Observable<PetDto[]> {
    return this.http.get<PetDto[]>(this.apiPet);
  }
  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(this.apiUser);
  }
}
