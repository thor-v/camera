import { Component, OnInit, OnDestroy } from '@angular/core';
import { Images } from 'src/app/models/images';
import { PhotosService } from 'src/app/services/photos.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit, OnDestroy {

  file: File;
  photoselected: string | ArrayBuffer;
  datos: Images;

  myValueSub: Subscription;

  constructor(private photoService: PhotosService, private router: Router, private toastController: ToastController) { 
    this.datos = new Images();
  }

  ngOnInit() {
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  onPhotoSelected(event: HtmlInputEvent): void{
    if(event.target.files && event.target.files[0]){
      this.file = <File>event.target.files[0];
      // image preview
      const reader = new FileReader();
      reader.onload = e => this.photoselected = reader.result;
      reader.readAsDataURL(this.file);
    }
  }

  submitForm(){
    this.myValueSub = this.photoService.createPhoto(this.datos.title, this.datos.price, this.file)
      .subscribe(res => {
        this.presentToast('Foto registrado.')
        this.router.navigate(['lista']);
        // console.log(res)
      }, err => console.log(err));
  }

  ngOnDestroy(){
    if(this.myValueSub){
      console.log('page destroy registrar');
      this.myValueSub.unsubscribe();
    }
  }

}
