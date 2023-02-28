import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Book } from 'src/app/model/book';
import { BookService } from '../../services/book.service';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
@Component({
  selector: 'app-book-edition',
  templateUrl: './book-edition.page.html',
  styleUrls: ['./book-edition.page.scss'],
})
export class BookEditionPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll?: IonInfiniteScroll;

  book: Book = {

  };

  lastBookId?: number;
  published = (new Date()).toISOString();
  bookId?: number;

  books: Book[] =  [];

  constructor(private route: ActivatedRoute,
    private bookService: BookService,
    private navController: NavController) { }

  ngOnInit() {
    this.bookService.getBooks().subscribe((books) => {
      this.books = books;
      this.lastBookId = this.books[this.books.length - 1].id;
      this.route.queryParams.subscribe(params => {
        if(!!params['book']) {
          this.book = params["book"];
          if(!!this.book.published) {
            this.book.published = (new Date(this.book.published)).toISOString();
            this.bookId = this.book.id;
          }
        }
      });
    })
  }

  saveChanges() {
    this.book.published = this.published;

    if (!!this.book.id) {
      this.bookService.updateBook(this.book).subscribe(
        resp => {
          this.navController.navigateForward('books');
        }
      );
    } else {
      this.book.id = this.lastBookId;
      const navExtras: NavigationExtras = {
        queryParams: {
          newBook: this.book
        }
      };
      console.log(navExtras);
      this.bookService.createBook(this.book).then(
        resp => {
          const navExtras: NavigationExtras = {
            queryParams: {
              newBook: this.book
            }
          };
          console.log(navExtras);
          this.navController.navigateForward('books');
        }
      );
    }
  }

  delete() {
    if (!!this.book.id) {
      this.bookService.deleteBook(this.book.id).then(resp => {
        this.navController.navigateForward('books');
      });
    }
  }

}
