import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Bookservice, Book } from '../../services/books/bookservice';
import { ModalService } from '../../services/modal/modal.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './books.html',
  styleUrl: './books.css'
})
export class Books implements OnInit {
  books: Book[] = [];
  displayedBooks: Book[] = [];
  limit: number = 5; // Número de registros a mostrar
  isModalOpen = false;

  
  newBook: Book = {
    id: 0,
    title: '',
    description: '',
    pageCount: 0,
    excerpt: '',
    publishDate: new Date().toISOString()
  };

  constructor(
    private bookService: Bookservice,
    private modalService: ModalService
  ) {
    this.modalService.isOpen$.subscribe(isOpen => {
      this.isModalOpen = isOpen;
    });
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.displayedBooks = this.books.slice(0, this.limit);
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
  }

  // Método para cargar más registros
  loadMore(): void {
    const currentLength = this.displayedBooks.length;
    const newLimit = currentLength + this.limit;
    this.displayedBooks = this.books.slice(0, newLimit);
  }

  openModal(): void {
    this.modalService.open();
  }

  closeModal(): void {
    this.modalService.close();
  } 

  saveBook(): void {
    this.bookService.createBook(this.newBook).subscribe({
      next: (book) => {
        this.books.push(book);
        this.closeModal();
        this.resetForm();
        Swal.fire({
          title: "¡Libro creado!",
          text: "El libro se ha creado exitosamente",
          icon: "success",
          draggable: true
        });
      },
      error: (error) => {
        console.error('Error creating book:', error);
        Swal.fire({
          title: "Error",
          text: "Hubo un error al crear el libro",
          icon: "error",
          draggable: true
        });
      }
    });
  }

  private resetForm(): void {
    this.newBook = {
      id: 0,
      title: '',
      description: '',
      pageCount: 0,
      excerpt: '',
      publishDate: new Date().toISOString()
    };
  }

  deleteBook(id: number): void {
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
        this.bookService.deleteBook(id).subscribe({
          next: () => {
            this.books = this.books.filter(book => book.id !== id);
            this.displayedBooks = this.displayedBooks.filter(book => book.id !== id);
            Swal.fire({
              title: "¡Eliminado!",
              text: "El libro ha sido eliminado",
              icon: "success",
              draggable: true
            });
          },
          error: (error) => {
            console.error('Error deleting book:', error);
            Swal.fire({
              title: "Error",
              text: "Hubo un error al eliminar el libro",
              icon: "error",
              draggable: true
            });
          }
        });
      }
    });
  }

  editBook(book: Book): void {
    this.newBook = { ...book };
    this.openModal();
  }

  updateBook(): void {
    this.bookService.updateBook(this.newBook.id, this.newBook).subscribe({
      next: (updatedBook) => {
        const index = this.books.findIndex(book => book.id === updatedBook.id);
        if (index !== -1) {
          this.books[index] = updatedBook;
          this.displayedBooks = this.books.slice(0, this.displayedBooks.length);
        }
        this.closeModal();
        this.resetForm();
        Swal.fire({
          title: "¡Actualizado!",
          text: "El libro ha sido actualizado exitosamente",
          icon: "success",
          draggable: true
        });
      },
      error: (error) => {
        console.error('Error updating book:', error);
        Swal.fire({
          title: "Error",
          text: "Hubo un error al actualizar el libro",
          icon: "error",
          draggable: true
        });
      }
    });
  }
}
