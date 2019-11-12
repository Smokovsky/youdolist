import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoardsProviderService } from './boards-provider.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryProviderService {

  categoryList: Array<Category>;

  categoryListObs = new BehaviorSubject<Array<Category>>(this.categoryList);

  constructor(private boardsProviderService: BoardsProviderService) {  }

  setCategoryList(id: string) {
    this.categoryList = this.boardsProviderService.getBoard(id).categories;
    this.categoryListObs.next(this.categoryList);
  }

  getCategoryListObs(): Observable<Array<Category>> {
    return this.categoryListObs.asObservable();
  }

  add(category: Category) {
    this.categoryList.push(category);
    this.categoryListObs.next(this.categoryList);
  }

  remove(i: number) {
    this.categoryList.splice(i, 1);
    this.categoryListObs.next(this.categoryList);
  }

}
