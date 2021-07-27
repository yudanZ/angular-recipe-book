import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Recipe } from '../_modals/recipe.model';
import { AuthService } from './auth.service';
import { RecipesService } from './recipes.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  url: string = 'https://ng-course-recipe-book-cd711-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
  constructor(
    private http: HttpClient,
    private recipesService: RecipesService,
    private authService: AuthService
    ) { }

  fetchRecipes(){
    return this.http.get<Recipe[]>(this.url).pipe(
      map(  recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients? recipe.ingredients: []}
        });
      }),
      tap(recipes => {
        this.recipesService.setRecipes(recipes)
      })

    );
  }

  saveRecipes(){
    const recipes: Recipe[] = this.recipesService.getRecipes();
    this.http.put(this.url, recipes).subscribe(response => {
      console.log(response)
    });
  }
}
