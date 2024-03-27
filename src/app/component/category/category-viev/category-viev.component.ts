import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../../service/category.service';
import { Category } from '../../../model/category.model';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'category-viev',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './category-viev.component.html',
  styleUrl: './category-viev.component.css'
})
export class CategoryVievComponent implements OnInit {
  categories?: Category[];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    console.log("CategoryVievComponent");
    this.categoryService.getAll().pipe(take(1)).subscribe({
      next: data => {
        console.log(data);
        this.categories = data.content;
      },
      error: e => {
        console.log("e" + e);

      }
    });
  }
}
