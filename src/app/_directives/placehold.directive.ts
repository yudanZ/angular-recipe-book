import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPlacehold]'
})
export class PlaceholdDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
