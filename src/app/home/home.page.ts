import { Component, OnInit } from '@angular/core';
import { Images } from '../models/images';
import { PhotosService } from "../services/photos.service";
import { Router } from "@angular/router";

import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from "@ionic/storage";
// import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  images = [];
  datos: Images;

  constructor(public photosService: PhotosService, public router: Router, private camera: Camera, private file: File, private webview: WebView, private actionSheetController: ActionSheetController, private toastController: ToastController, private loadingController: LoadingController) {
      this.datos = new Images();
  }
  // constructor(public photoService: PhotosService, public router: Router, private camera: Camera, private actionSheetController: ActionSheetController, ) {}

  ngOnInit(){}

  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
        header: "Select Image source",
        buttons: [{
                text: 'Load from Library',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
            {
                text: 'Use Camera',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.CAMERA);
                }
            },
            {
                text: 'Cancel',
                role: 'cancel'
            }
        ]
    });
    await actionSheet.present();
}
 
takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
    };
 
    this.camera.getPicture(options).then(imagePath => {
        // this.images = this.webview.convertFileSrc(imagePath);
        let filePath = this.file.dataDirectory + imagePath;
        let resPath = this.pathForImage(imagePath);
        this.images.push({ path: resPath, filePath: filePath });
        // if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        //     this.filePath.resolveNativePath(imagePath)
        //         .then(filePath => {
        //             let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
        //             let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
        //             this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        //         });
        // } else {
        //     var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        //     var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        //     this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        // }
    }, (err) => {
      console.log(err);
    });
 }

 pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
        .then(entry => {
            ( < FileEntry > entry).file(file => this.readFile(file))
        })
        .catch(err => {
            this.presentToast('Error while reading file.');
        });
  }
  
  readFile(file: any) {
      const reader = new FileReader();
      reader.onload = () => {
          const formData = new FormData();
          const imgBlob = new Blob([reader.result], {
              type: file.type
          });
          formData.append('imageUrl', imgBlob, file.name);
          formData.append('title', this.datos.title);
          // this.uploadImageData(formData);
          this.photosService.createItem(formData);
      };
      reader.readAsArrayBuffer(file);
  }

}
