import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, Route, UrlSegment, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuthState(state.url);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    let url = '/tabs/home';
    if (this.authService.getNextPacth() !== '') {
      url = this.authService.getNextPacth();
    }
    this.authService.setNextPath('');
    // console.log(window.location.pathname);
    return this.checkAuthState(url).pipe(take(1));
  }

  private checkAuthState(redirect: string): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      tap(is => {
        if (!is) {
          this.router.navigate(['/login'], {
            queryParams: { redirect }
          });
        }
      })
    );
  }
}
