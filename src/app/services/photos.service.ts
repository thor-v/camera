import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Images } from "../models/images";
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  URL = 'http://192.168.0.4:4000';
  // URL = 'http://192.168.0.8:4000';

  constructor(private httpCLient: HttpClient) { }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  // create photo
  createPhoto(title: string, price: string , photo: File){
    const fd = new FormData();
    fd.append('title', title);
    fd.append('price', price);
    fd.append('imageUrl', photo);
    return this.httpCLient.post<Images>(this.URL+'/add', fd);
  }
  // Create a new item
  createItem(formData: FormData): Observable<Images> {
    return this.httpCLient
      .post<Images>(this.URL+'/add', formData);
  }
 
  // Get single student data by ID
  getItem(id): Observable<Images> {
    return this.httpCLient
      .get<Images>(this.URL + '/images/' + id);
  }
 
  // Get students data
  getList() {
    return this.httpCLient
      .get<Images[]>(this.URL)
      // .pipe(
      //   retry(2),
      //   catchError(this.handleError)
      // );
  }
 
  // Update item by id
  updateItem(id, title: string, price: string, photo: File): Observable<Images> {
    const fd = new FormData();
    fd.append('title', title);
    fd.append('price', price);
    fd.append('imageUrl', photo);
    return this.httpCLient
      .put<Images>(this.URL + '/add/' + id, fd);
  }

  // Delete item by id
  deleteItem(id){
    return this.httpCLient
    .delete<Images>(this.URL+'/delete/'+id);
  }

}
