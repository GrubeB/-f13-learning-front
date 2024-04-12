import { Directive, ElementRef, HostListener, Output, EventEmitter, Input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appOutsideClick]',
})
export class OutsideClickDirective {
  @Input()
  appOutsideClickActive: boolean = true;

  @Output() appOutsideClick = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) { }
  
  @HostListener('document:mousedown', ['$event.target'])
  onMouseDown(targetElement: any) {
    if (this.appOutsideClickActive) {
      const clickedInside = this.elementRef.nativeElement.contains(targetElement);
      if (!clickedInside) {
        this.appOutsideClick.emit();
      }
    }
  }
}