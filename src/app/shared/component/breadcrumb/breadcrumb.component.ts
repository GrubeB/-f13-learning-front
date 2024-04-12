import { Component, Input } from '@angular/core';

export class BreadcrumbItem{
  name!: string;
  link!: string;
}
@Component({
  selector: 'breadcrumb',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  @Input() items!:BreadcrumbItem[];
}
