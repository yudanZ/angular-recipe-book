import { Directive, HostBinding, HostListener, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective{
  @HostBinding('class.open') isOpen = false;
  @HostListener('click') toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }
  constructor() { }


}
