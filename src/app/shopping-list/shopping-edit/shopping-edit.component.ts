import { identifierModuleUrl } from '@angular/compiler';
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/_modals/ingredient.model';
import { ShoppingListService } from 'src/app/_services/shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy{
  @ViewChild('shoppingEditForm', {static: true}) form: NgForm;
  subscription: Subscription;
  editMode = false;
  editItemIndex: number;
  editItem: Ingredient;
  constructor(private shoppingListService:ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startingEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editItemIndex = index;
      this.editItem = this.shoppingListService.getIngredient(index);
      this.loadIngredient();
    })
  }

  loadIngredient(){
    this.form.setValue({
      name: this.editItem.name,
      amount: this.editItem.amount
    })
  }

  onAddIngredient(){
    const newIngredient: Ingredient = {
      name: this.form.value.name,
      amount: this.form.value.amount
    }
    if(this.editMode){
      this.shoppingListService.updateIngredient(this.editItemIndex, newIngredient)
    }else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode = false;
    this.form.reset();


  }

  onClear(){
    this.form.reset();
    this.editMode = false;
  }

  onDelete(){
    if(this.editMode === true){
      this.shoppingListService.deleteIngredient(this.editItemIndex);
      this.form.reset();
      this.editMode = false;
    }

  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }



}
