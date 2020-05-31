import { Component, OnInit, OnDestroy } from '@angular/core';
import { PhotosService } from 'src/app/services/photos.service';
import { Observable, Subscription } from 'rxjs';
import { Images } from 'src/app/models/images';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit, OnDestroy {

  resultados: Images[] = [];
  // Server = 'http://192.168.0.8:4000';
  Server = 'http://192.168.0.4:4000';
  myValueSub: Subscription;

  constructor(private photosService: PhotosService, private router: Router) { 
    // this.resultados = [];
  }

  ngOnInit() {
    this.getAllStudents();
  }

  ionViewWillEnter() {
    this.getAllStudents();
  }
 
  getAllStudents() {
    this.myValueSub = this.photosService.getList().subscribe(response => {
      this.resultados = response;
    })
  }

  resetForm(){
    console.log('atras')
    this.router.navigate(['registrar']);
  }

  ngOnDestroy(){
    if(this.myValueSub){
      console.log('destroy');
      this.myValueSub.unsubscribe();
    }
  }

}
