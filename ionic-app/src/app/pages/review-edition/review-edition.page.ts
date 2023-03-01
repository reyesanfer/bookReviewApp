import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { Book } from 'src/app/model/book';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from '../../model/review';
import { BookService } from '../../services/book.service';
import { NavController } from '@ionic/angular';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-review-edition',
  templateUrl: './review-edition.page.html',
  styleUrls: ['./review-edition.page.scss'],
})
export class ReviewEditionPage implements OnInit {

  review: Review = {
  };
  
  created = (new Date()).toISOString();
  bookId?: number;

  books: Book[] =  [];


  constructor(private route: ActivatedRoute,
    private bookService: BookService,
    private reviewService: ReviewService,
    private navController: NavController,
    private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
    // Obtenemos la lista de libros para cargar el atributo books que utilizará el componente ion-select 
    this.bookService.getBooks().subscribe((books) => {
      
      this.books = books;
      // Una vez obtenidos los libros, obtenemos la reseña que se envió al pulsar sobre ella en la lista de reseñas
      this.route.queryParams.subscribe(params => {
        if (!!params['review']) {
          this.review = params["review"];
          if(!!this.review.created) {
            // Almacenamos la fecha de creación en el atributo created
            this.created = (new Date(this.review.created)).toISOString(); 
            this.bookId = this.review.book?.id;
          }
        }
      });
      
    }); 
    
    
  }
  
  saveChanges() {
    this.review.book = this.books.filter(book => book.id == this.bookId)[0];
    this.review.created = this.created;

    if (!!this.review.id) {
      this.reviewService.updateReview(this.review).subscribe(
        resp =>{
          this.editedToast().then(() => {
            this.navController.navigateForward('reviews');
          });
        }
      );
    } else {
      this.reviewService.createReview(this.review).then(
        resp =>{
          const navExtras: NavigationExtras =  {
            queryParams:{
              newReview: this.review              
            }
          };
          console.log(navExtras);
          this.createdToast().then(() => {
            this.navController.navigateForward('reviews');
          });
        }
      );
    }
  }

  delete() {
    if (!!this.review.id) {
      this.reviewService.deleteReview(this.review.id)
        .then(resp => {
          this.deletedToast().then(() => {
            this.navController.navigateForward('reviews');
          });
        });
    }
  }

  async presentDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Confirme la acción',
      message: '¿Está seguro de que desea eliminar la reseña?',
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
      message: 'Se ha creado correctamente la reseña',
      duration: 1000,
      position: 'top',
      icon: 'checkmark-circle-outline',
      color: 'light'
    });
    await toast.present();
  }

  async deletedToast() {
    const toast = await this.toastController.create({
      message: 'Se ha eliminado correctamente la reseña',
      duration: 1000,
      position: 'top',
      icon: 'trash-outline',
      color: 'light'
    });
    await toast.present();
  }

  async editedToast() {
    const toast = await this.toastController.create({
      message: 'Se ha editado correctamente la reseña',
      duration: 1000,
      position: 'top',
      icon: 'create-outline',
      color: 'light'
    });
    toast.present();
  }

}
