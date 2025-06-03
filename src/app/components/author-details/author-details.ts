import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Authorservice } from '../../services/authors/authorservice';
import { Bookservice } from '../../services/books/bookservice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-author-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './author-details.html',

})
export class AuthorDetails implements OnInit {
  author: any;
  book: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authorService: Authorservice,
    private bookService: Bookservice
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAuthor(Number(id));
    }
  }

  loadAuthor(id: number) {
    this.authorService.getAuthorById(id).subscribe({
      next: (data) => {
        this.author = data;
        this.loadBook(this.author.idBook);
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Error al cargar el autor',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  loadBook(id: number) {
    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.book = data;
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Error al cargar el libro',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/authors']);
  }
} 