// characteristics.resolver.ts

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CharacteristicsService } from './characteristics.service';
import { CharacteristicDTO } from './characteristics.service';

@Injectable({
    providedIn: 'root'
})
export class CharacteristicsResolver implements Resolve<CharacteristicDTO> {

    constructor(private characteristicsService: CharacteristicsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CharacteristicDTO> {
        const idParam = route.paramMap.get('id');
        const id = idParam ? +idParam : 0;

        return this.characteristicsService.getById(id);
    }
}
