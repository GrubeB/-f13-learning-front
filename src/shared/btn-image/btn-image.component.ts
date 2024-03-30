import { Component, Input } from '@angular/core';

@Component({
  selector: 'btn-image',
  standalone: true,
  imports: [],
  templateUrl: './btn-image.component.html',
  styleUrl: './btn-image.component.scss'
})
export class BtnImageComponent {
  @Input() imageUrl: string = "https://i.pinimg.com/originals/40/00/b7/4000b7b7caf046215794ccdef4a78630.png";
}
