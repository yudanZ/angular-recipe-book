import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from 'src/app/_modals/recipe.model';
import { RecipesService } from 'src/app/_services/recipes.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipesService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe( (params: Params) => {
      this.id = + params['id'];
      this.editMode = params['id'] != null ? true: false;
      this.initForm();
    });

  }

  onSubmit(){
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients'],
    );
    if(this.editMode){
      this.recipeService.updateRecipe(this.id, newRecipe);
    }else{
      this.recipeService.addRecipe(newRecipe);
    }
    this.router.navigate(['../'], {relativeTo: this.route})

  }

  onAddIngredient(){
    const controlGroup = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    });
    (<FormArray>this.recipeForm.get('ingredients')).push(controlGroup);

  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  get controls(){
    // console.log((<FormArray>this.recipeForm.get('ingredients')).controls)
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  private initForm() {

    let recipeName: string = '';
    let imagePath: string = '';
    let recipeDescription: string = '';
    let recipeIngredients = new FormArray([]);
    if(this.editMode){
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      imagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      // console.log(recipe.ingredients)
      if(recipe['ingredients']){
        // console.log('here')
        for(let ingredient of recipe.ingredients){
          // console.log(ingredient)
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(
                ingredient.amount,
                [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          )
        }
        // console.log(ingredients)
      }

    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(imagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    })

  }



}
