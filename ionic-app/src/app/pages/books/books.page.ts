import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController, RefresherCustomEvent } from '@ionic/angular';

import { DataService, Message } from '../../services/data.service';
import { BookService } from '../../services/book.service';
import { Book } from 'src/app/model/book';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Review } from 'src/app/model/review';


@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
})
export class BooksPage implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll?: IonInfiniteScroll;

  page = 0;
  size = 7;

  books: Book[] = [];
  reviewsList: Review[] = [];
  avatarClasses = ['avatar-rojo', 'avatar-verde', 'avatar-azul-claro', 'avatar-azul-oscuro', 'avatar-violeta', 
  'avatar-amarillo', 'avatar-rosa', 'avatar-naranja', 'avatar-turquesa', 'avatar-verde-limon'];

  constructor(private data: DataService,
              private bookService: BookService,
              private navCtrl: NavController,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.loadBooks(false);

    this.bookService.newBook.subscribe( book => {
      this.books.unshift(book);
    });

    this.bookService.deletedBook.subscribe( bookId => {
      const booksResult = this.books.filter( book => book.id != bookId);
      this.books = [...booksResult];
    })

    this.route.queryParams.subscribe(params => {
      if (!!params['reviews']) {
        this.reviewsList = params["reviews"];
      }
    });
  }

  loadBooks (more = false) {

    if (!more) {
      this.page = 0
    }

    this.bookService.getBooks(this.size).subscribe(
      (bookList: Book[]) => {
        this.books = [...this.books, ...bookList];
        if (!!this.infiniteScroll && (!bookList || bookList.length <= this.size)) {
          console.log('fin');
            this.infiniteScroll.disabled = true;
            return;
        }
        this.page++;
        if (!!this.infiniteScroll) {
          this.infiniteScroll?.complete();
        }
      }
    );
  }

  addNewBook(): void {
    this.navCtrl.navigateForward('book-edition');
  }

  editBook(book: Book): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        book,
        reviews: this.reviewsList
      }
    };
    this.navCtrl.navigateForward('book-edition', navigationExtras)
  }

  viewReviews(): void {
    this.navCtrl.navigateForward('reviews');
  }

}
