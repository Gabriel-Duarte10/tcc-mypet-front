import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AnimalTypesService } from './animal-types.service';
import { AnimalTypeDTO } from './animal-types.service';

@Injectable({
    providedIn: 'root'
})
export class AnimalTypesResolver implements Resolve<AnimalTypeDTO> {

    constructor(private animalTypesService: AnimalTypesService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AnimalTypeDTO> {
        const idParam = route.paramMap.get('id');
        const id = idParam ? +idParam : 0;

        return this.animalTypesService.getById(id);
    }
}
