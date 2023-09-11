import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs'; // Adicione o import para 'of'
import { BreedsService, BreedDTO } from './breeds.service';
import { AnimalTypesService, AnimalTypeDTO } from '../animal-types/animal-types.service';

@Injectable({
    providedIn: 'root'
})
export class BreedsResolver implements Resolve<{ breed: BreedDTO | null, animalTypes: AnimalTypeDTO[] }> {

    constructor(
      private breedsService: BreedsService,
      private animalTypesService: AnimalTypesService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ breed: BreedDTO | null, animalTypes: AnimalTypeDTO[] }> {
      const idParam = route.paramMap.get('id');
      const id = idParam ? +idParam : null;

      let breedObservable: Observable<BreedDTO | null>;

      if (id) {
          breedObservable = this.breedsService.getById(id);
      } else {
          breedObservable = of(null); // Retorna um observable com valor nulo
      }

      return forkJoin({
          breed: breedObservable,
          animalTypes: this.animalTypesService.getAll()
      });
  }
}
