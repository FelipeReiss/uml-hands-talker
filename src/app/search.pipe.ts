import { UserService } from './auth/services/user.service';
import { AuthService } from './core/services/auth.service';
import { Pipe, PipeTransform } from '@angular/core';
import { take } from 'rxjs/operators';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  items: any[];
  terms: string;
  whatPage: string;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  transform(items: any[], obj: any): any[] {
    this.items = items.slice();
    this.terms = obj.filter;
    this.whatPage = obj.whatPage;
    if (this.whatPage === 'Favorites' || this.whatPage === 'Words') {
      return this.filterWords();
    } else {
      if (this.whatPage === 'AdminSettings') {
        return this.filterAdminSettings();
      } else {
        return [];
      }
    }
 }

 filterAdminSettings(): any[] {
  this.authService.isAuthenticated.pipe(take(1)).subscribe( isAuth => {
    if (isAuth) {
      this.authService.updateUserFireClass(this.userService);
    }
  });

  let list = [];

  for (let i=0; i < this.items.length; i++) {
    if (this.authService.userFirestoreClass$.id != this.items[i].id){
      list.push(this.items[i]);
    }
  }

  if (!list) { return []; }

  if (!this.terms) { return list; }

  this.terms = this.terms.toLowerCase();

  return list.filter( it => {
    return it.name.toLowerCase().includes(this.terms);
  });
}

  filterWords(): any[]{
    let listFavorites = [];

    this.authService.isAuthenticated.pipe(take(1)).subscribe( isAuth => {
      if (isAuth) {
        this.authService.updateUserFireClass(this.userService);
      }
    });

    if (this.authService.userFirestoreClass$) {
      listFavorites = this.authService.userFirestoreClass$.favoritesWords.slice();
    }
    if (!this.items) { return []; }

    const list = this.items.slice();

    for (let i = 0; i < list.length; i++) {
      if (listFavorites.indexOf(list[i].id) > -1) {
        list[i].done = true;
      } else {
        list[i].done = false;
      }
    }
    if (this.whatPage === 'Favorites') {
      if (listFavorites.length === 0 || listFavorites[0] === '') {
        return [];
      }
      list.length = 0;
      for (let i = 0; i < listFavorites.length; i++){
        list.push(this.items.filter( it => {
          return it.id.includes(listFavorites[i]);
        })[0]);
      }
    }

    if (!this.terms) { return list; }

    this.terms = this.terms.toLowerCase();
    return list.filter( it => {
      return it.title.toLowerCase().includes(this.terms);
    });

  }
}