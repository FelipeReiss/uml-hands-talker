import { UserService } from './auth/services/user.service';
import { AuthService } from './core/services/auth.service';
import { Pipe, PipeTransform } from '@angular/core';
import { take } from 'rxjs/operators';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  transform(items: any[], terms: string, isFavorites?: boolean): any[] {
    console.log(this.authService.userFirestoreClass$);
    let listFavorites = [];
    if (this.authService.userFirestoreClass$) {
      listFavorites = this.authService.userFirestoreClass$.favoritesWords.slice();
    }

    this.authService.isAuthenticated.pipe(take(1)).subscribe( isAuth => {
      if (isAuth) {
        this.authService.updateUserFireClass(this.userService);
      }
    });
    if (!items) { return []; }
    
    const list = items.slice();
    console.log(listFavorites.length);
    if (listFavorites.length > 0){
      console.log('estou if lenght')
      for (let i = 0; i < list.length; i++) {
      console.log('estou no for')
        if (listFavorites.indexOf(list[i].id) > -1) {
          list[i].done = true;
        } else {
          list[i].done = false;
        }
      } 
    }
    console.log('saiu do if')
    if (isFavorites) {
      if (listFavorites.length === 0) {
        return null;
      }
      list.length = 0;
      listFavorites.forEach(function filterFav(favorite): void {
        list.push(items.filter( it => {
          return it.id.includes(favorite);
        })[0]);
      });
    }

    if (!terms) { return list; }

    terms = terms.toLowerCase();
    return list.filter( it => {
      return it.title.toLowerCase().includes(terms);
    });
  }
}
