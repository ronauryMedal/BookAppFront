import { Routes } from '@angular/router';
import { Books } from './pages/books/books';
import { Authors } from './pages/authors/authors';  
import { BookDetails } from './components/book-details/book-details';
import { AuthorDetails } from './components/author-details/author-details';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: Books },
  { path: 'books/:id', component: BookDetails },
  { path: 'authors', component: Authors },
  { path: 'authors/:id', component: AuthorDetails },
];
