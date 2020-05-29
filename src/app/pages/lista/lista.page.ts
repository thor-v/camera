import { Component, OnInit } from '@angular/core';
import { PhotosService } from 'src/app/services/photos.service';
import { Observable } from 'rxjs';
import { Images } from 'src/app/models/images';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {

  resultados: Images[] = [];
  Server = 'http://192.168.0.4:4000';

  constructor(private photosService: PhotosService, private router: Router) { 
    // this.resultados = [];
  }

  ngOnInit() {
    this.getAllStudents();
    // this.resultados = this.photosService.getList();
  }

  ionViewWillEnter() {
    this.getAllStudents();
    // this.resultados = this.photosService.getList();
  }
 
  getAllStudents() {
    //Get saved list of students
    this.photosService.getList().subscribe(response => {
      // console.log(response);
      this.resultados = response;
    })
  }

  resetForm(){
    console.log('atras')
    this.router.navigate(['registrar']);
  }

}
