import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Book } from 'src/app/model/book';
import { BookService } from '../../services/book.service';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from '../../model/review';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';
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
  reviewsList: Review[] = [];

  constructor(private route: ActivatedRoute,
    private bookService: BookService,
    private reviewsService: ReviewService,
    private navController: NavController,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
    this.bookService.getBooks().subscribe((books) => {
      this.books = books;
      this.lastBookId = (this.books[this.books.length - 1].id);
      if (this.lastBookId) {
        this.lastBookId += 1;
      }
      this.route.queryParams.subscribe(params => {
        if(!!params['book']) {
          this.book = params["book"];
          if(!!this.book.published) {
            this.book.published = (new Date(this.book.published)).toISOString();
            this.bookId = this.book.id;
          }
        }
        if (!!params['reviews']) {
          this.reviewsList = params["reviews"];
        }
      });
    })
  }

  saveChanges() {
    this.book.published = this.published;

    if (!!this.book.id) {
      this.bookService.updateBook(this.book).subscribe(
        resp => {
          this.editedToast().then(() => {
            this.navController.navigateForward('books');
          });
        }
      );
    } else {
      this.book.id = this.lastBookId;
      this.bookService.createBook(this.book).then(
        resp => {
          const navExtras: NavigationExtras = {
            queryParams: {
              newBook: this.book
            }
          };
          console.log(navExtras);
          this.createdToast().then(() => {
            this.navController.navigateForward('books');
          });
        }
      );
    }
  }

  delete() {
    this.deleteReviews().then(resp => {
      if (resp) {
        if (!!this.book.id) {
        this.bookService.deleteBook(this.book.id).then(resp => {
          this.deletedToast().then(() => {
            if (resp) {
              this.navController.navigateForward('books');
            }
          });
        });
      }
      }
    });
  }

  async deleteReviews() {
    this.reviewsList.forEach(review => {
      if (review.book?.id === this.book.id) {
        if (review.id) {
          this.reviewsService.deleteReview(review.id);
        }
      }
    });
    return true;
  }

  async presentDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Confirme la acción',
      message: '¿Está seguro de que desea eliminar el libro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.delete();
          }
        }
      ]
    });
    await alert.present();
  }

  async createdToast() {
    const toast = await this.toastController.create({
      message: 'Se ha creado correctamente el libro',
      duration: 1000,
      position: 'top',
      icon: 'checkmark-circle-outline',
      color: 'light'
    });
    await toast.present();
  }

  async deletedToast() {
    const toast = await this.toastController.create({
      message: 'Se ha eliminado correctamente el libro',
      duration: 1000,
      position: 'top',
      icon: 'trash-outline',
      color: 'light'
    });
    await toast.present();
  }

  async editedToast() {
    const toast = await this.toastController.create({
      message: 'Se ha editado correctamente el libro',
      duration: 1000,
      position: 'top',
      icon: 'create-outline',
      color: 'light'
    });
    await toast.present();
  }

}
