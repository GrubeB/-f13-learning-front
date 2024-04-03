import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { OutsideClickDirective } from '../directive/outside-click.directive';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [
    CommonModule,
    OutsideClickDirective
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss'
})
export class MultiSelectComponent implements ControlValueAccessor {
  logger = inject(NGXLogger);

  @Input() options!: any[];
  @Input() optionLabel?: string;
  selectedValues: any[] = [];
  isDisabled: boolean = false;
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(obj: any): void {
    this.selectedValues = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  addOption(newOption: any) {
    this.selectedValues = this.selectedValues.filter(o => o != newOption);
    this.selectedValues.push(newOption);
    this.onChange(this.selectedValues);
  }
  removeOption(option: any) {
    this.selectedValues = this.selectedValues.filter(o => o != option);
    this.onChange(this.selectedValues);
  }

  menuVisable: boolean = false;
  openMenu() {
    this.menuVisable = true;
  }
  hideMenu() {
    this.menuVisable = false;
  }
}