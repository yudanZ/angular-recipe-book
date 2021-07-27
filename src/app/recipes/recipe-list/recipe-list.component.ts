import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipesService } from 'src/app/_services/recipes.service';
import { Recipe } from '../../_modals/recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipesSub = new Subscription();
  recipes: Recipe[] = [];

  constructor(private recipesService: RecipesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.recipesSub = this.recipesService.recipesChanged.subscribe( (recipes: Recipe[]) => {
      this.recipes = recipes;
    })
    this.recipes = this.recipesService.getRecipes();
  }

  onNewRecipeClicked(){
    this.router.navigate(['new'], {relativeTo: this.route})
  }



  ngOnDestroy(){
    this.recipesSub.unsubscribe();
  }



}
