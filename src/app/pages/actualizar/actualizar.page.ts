import { Component, OnInit, ɵSWITCH_COMPILE_INJECTABLE__POST_R3__ } from '@angular/core';
import { PhotosService } from 'src/app/services/photos.service';
import { Images } from 'src/app/models/images';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

interface HtmlInputEvent extends Event { 
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.page.html',
  styleUrls: ['./actualizar.page.scss'],
})
export class ActualizarPage implements OnInit {

  datos: Images;
  file: File;
  photoselected: string | ArrayBuffer;
  // url2 = 'http://192.168.0.8:4000';
  url2 = 'http://192.168.0.4:4000';
  img = null;

  constructor(private photosService: PhotosService, public router: Router,public activatedRoute: ActivatedRoute, private toastController: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.params["id"];
    //get item details using id
    this.photosService.getItem(id).subscribe(response => {
      // console.log(response);
      this.datos = response;
      this.img = this.url2+this.datos.imageUrl;
    })
  }

  // ionViewWillEnter() {
  //   let id = this.activatedRoute.snapshot.params["id"];
  //   //get item details using id
  //   this.photosService.getItem(id).subscribe(response => {
  //     console.log(response);
  //     this.datos = response;
  //   })
  // }

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

  msg = null;
  update(ides){
    this.photosService.updateItem(ides, this.datos.title, this.datos.price, this.file)
      .subscribe(res => {
        this.msg = res;
        this.presentToast(this.msg.msg);
        this.router.navigate(['/lista']);
        // console.log(res)
      }, err => console.log(err));
  }

  mssg = null;
  async delete(id){
    const alertElement = await this.alertCtrl.create({
      header: 'Seguro que quieres eliminar la imagen.',
      buttons: [
        {
          text: 'Eliminar',
          handler: () => {
            this.photosService.deleteItem(id).subscribe(res => {
              this.mssg = res;
              this.presentToast(this.mssg.msg);
              this.router.navigate(['/lista']);;
            }, err => console.log(err));
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await alertElement.present();
  }
  
}
