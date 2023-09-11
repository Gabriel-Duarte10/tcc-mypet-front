import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { AnimalTypesService } from '../../panel-admin/animal-types/animal-types.service';
import { BreedsService } from '../../panel-admin/breeds/breeds.service';
import { CharacteristicsService } from '../../panel-admin/features/characteristics.service';
import { SizesService } from '../../panel-admin/sizes/sizes.service';
import { PetsUsersService } from '../PetUser.service';
// Importe os outros serviços conforme necessário

@Injectable({
    providedIn: 'root'
})
export class AnimalDashboardResolver implements Resolve<any> {

    constructor(
      private animalTypesService: AnimalTypesService,
      private breedsService: BreedsService,
      private characteristicsService: CharacteristicsService,
      private sizesService: SizesService,
      private petUserService: PetsUsersService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
      return forkJoin({
          animalTypes: this.animalTypesService.getAll(),
          breeds: this.breedsService.getAll(),
          characteristics: this.characteristicsService.getAll(),
          sizes: this.sizesService.getAll(),
          pets: this.petUserService.getAllPets()
      });
  }
}
