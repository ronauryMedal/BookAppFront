import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Author {
  id: number;
  idBook: number;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class Authorservice {
  private apiUrl = 'http://localhost:5256/api/Author';

  constructor(private http: HttpClient) { }

  // Obtener todos los autores
  getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl);
  }

  // Obtener un autor por ID
  getAuthorById(id: number): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo autor
  createAuthor(author: Author): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, author);
  }

  // Actualizar un autor existente
  updateAuthor(id: number, author: Author): Observable<Author> {
    return this.http.put<Author>(`${this.apiUrl}/${id}`, author);
  }

  // Eliminar un autor
  deleteAuthor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 