import { Injectable } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged, filter, map, mergeMap } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  breadcrumbs: BehaviorSubject<Array<{ label: string, url: string }>> = new BehaviorSubject<Array<{ label: string, url:string}>>([]);

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged()
    ).subscribe(() => {
      const breadcrumbs = this.createBreadcrumbs(this.router.url);
      this.breadcrumbs.next(breadcrumbs);
    });
  }

  private createBreadcrumbs(url: string): Array<{ label: string, url: string }> {
    const breadcrumbs: Array<{ label: string, url: string }> = [];
    const urlSegments = url.split('/').filter(segment => segment);

    let accumulatedPath = '';
    for (const segment of urlSegments) {
      accumulatedPath += `>${segment}`;
      breadcrumbs.push({ label: this.capitalize(segment), url: accumulatedPath });
    }

    return breadcrumbs;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
