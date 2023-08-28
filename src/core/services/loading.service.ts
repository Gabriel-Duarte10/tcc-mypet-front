import { BehaviorSubject } from 'rxjs';

export class LoadingService {

  private static _loadingSubject = new BehaviorSubject<boolean>(false);

  public static loading$ = LoadingService._loadingSubject.asObservable();

  public static show(): void {
    LoadingService._loadingSubject.next(true);
  }

  public static hide(): void {
    LoadingService._loadingSubject.next(false);
  }
}
