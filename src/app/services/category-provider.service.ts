import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BoardsProviderService } from './boards-provider.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryProviderService {

  private categoryList: Array<Category>;

  private categoryListObs = new BehaviorSubject<Array<Category>>(this.categoryList);

  constructor(private boardsProviderService: BoardsProviderService) {   }

  setCategoryList(id: string): void {
    this.categoryList = this.boardsProviderService.getBoard(id).categories;
    this.categoryListObs.next(this.categoryList);
  }

  getCategoryListObs(): Observable<Array<Category>> {
    return this.categoryListObs.asObservable();
  }

  add(category: Category): void {
    this.categoryList.push(category);
    this.categoryListObs.next(this.categoryList);
  }

  remove(i: number): void {
    this.categoryList.splice(i, 1);
    this.categoryListObs.next(this.categoryList);
  }

}
