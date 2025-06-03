import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Bookservice, Book } from '../../services/books/bookservice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {
  book: Book | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: Bookservice
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadBook(id);
    }
  }

  loadBook(id: number): void {
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.book = book;
      },
      error: (error) => {
        console.error('Error loading book:', error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar el libro",
          icon: "error",
          draggable: true
        });
        this.goBack();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }

}
