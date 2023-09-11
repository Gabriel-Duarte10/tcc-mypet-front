import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SizesService, SizeDTO } from './sizes.service';

@Injectable({
    providedIn: 'root'
})
export class SizesResolver implements Resolve<SizeDTO> {

    constructor(private sizesService: SizesService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SizeDTO> {
        const idParam = route.paramMap.get('id');
        const id = idParam ? +idParam : 0;

        return this.sizesService.getById(id);
    }
}
