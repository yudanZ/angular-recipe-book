import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../_modals/ingredient.model';
import { Recipe } from '../_modals/recipe.model';
import { ShoppingListService } from './shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
  // private recipes: Recipe[] = [
  //   new Recipe('Taco Appetizer Recipes', 'Best recipes','https://img.thrfun.com/img/021/025/taco_appetizers_tx2.jpg',
  //   [
  //     new Ingredient('Meat', 2),
  //     new Ingredient('Apple', 2)
  //   ]),
  //   new Recipe('Ziti Pasta with Sweet Italian Sausage ', 'Best recipes','https://herviewfromhome.com/wp-content/uploads/2015/03/ziti-with-sausage-onions-3-600x429.jpg',
  //   [
  //     new Ingredient('Meat', 2),
  //     new Ingredient('Apple', 2)
  //   ]),
  // ];
  constructor(private shoppingListService: ShoppingListService) { }
  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
  getRecipes(){
    return this.recipes.slice();
  }

  getRecipe(id: number){
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.shoppingListService.addIngredients(ingredients);

  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }


}
