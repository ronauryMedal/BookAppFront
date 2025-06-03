import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Authorservice, Author } from '../../services/authors/authorservice';
import { Bookservice, Book } from '../../services/books/bookservice';
import { ModalService } from '../../services/modal/modal.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './authors.html',
  styleUrl: './authors.css'
})
export class Authors implements OnInit {
  authors: Author[] = [];
  displayedAuthors: Author[] = [];
  books: Book[] = [];
  limit: number = 5;
  isModalOpen = false;

  newAuthor: Author = {
    id: 0,
    idBook: 0,
    firstName: '',
    lastName: ''
  };

  constructor(
    private authorService: Authorservice,
    private bookService: Bookservice,
    private modalService: ModalService
  ) {
    this.modalService.isOpen$.subscribe(isOpen => {
      this.isModalOpen = isOpen;
    });
  }

  ngOnInit(): void {
    this.loadAuthors();
    this.loadBooks();
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data;
        this.displayedAuthors = this.authors.slice(0, this.limit);
      },
      error: (error) => {
        console.error('Error loading authors:', error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los autores",
          icon: "error",
          draggable: true
        });
      }
    });
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
  }

  loadMore(): void {
    const currentLength = this.displayedAuthors.length;
    const newLimit = currentLength + this.limit;
    this.displayedAuthors = this.authors.slice(0, newLimit);
  }

  openModal(): void {
    this.modalService.open();
  }

  closeModal(): void {
    this.modalService.close();
    this.resetForm();
  }

  saveAuthor(): void {
    this.authorService.createAuthor(this.newAuthor).subscribe({
      next: (author) => {
        this.authors.push(author);
        this.closeModal();
        this.resetForm();
        Swal.fire({
          title: "¡Autor creado!",
          text: "El autor se ha creado exitosamente",
          icon: "success",
          draggable: true
        });
      },
      error: (error) => {
        console.error('Error creating author:', error);
        Swal.fire({
          title: "Error",
          text: "Hubo un error al crear el autor",
          icon: "error",
          draggable: true
        });
      }
    });
  }

  deleteAuthor(id: number): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      draggable: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.authorService.deleteAuthor(id).subscribe({
          next: () => {
            this.authors = this.authors.filter(author => author.id !== id);
            this.displayedAuthors = this.displayedAuthors.filter(author => author.id !== id);
            Swal.fire({
              title: "¡Eliminado!",
              text: "El autor ha sido eliminado",
              icon: "success",
              draggable: true
            });
          },
          error: (error) => {
            console.error('Error deleting author:', error);
            Swal.fire({
              title: "Error",
              text: "Hubo un error al eliminar el autor",
              icon: "error",
              draggable: true
            });
          }
        });
      }
    });
  }

  editAuthor(author: Author): void {
    this.newAuthor = { ...author };
    this.openModal();
  }

  private resetForm(): void {
    this.newAuthor = {
      id: 0,
      idBook: 0,
      firstName: '',
      lastName: ''
    };
  }
}


