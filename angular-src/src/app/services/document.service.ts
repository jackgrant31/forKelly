import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class DocumentService {
  authToken: any;

  constructor(
    private http: Http
  ) { 
    this.loadToken();
  }

  getDocumentFromCourse(courseId, documentId){
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('courses/' + courseId + '/document/' + documentId, {headers: headers})
      .map(res => res.json());
  }

  updateReviewState(courseId, document, reported){
    console.log("Updating state for document with ID " + document._id);
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post('courses/' + courseId + '/document/' + document._id, {
      reported: reported
    }, {
      headers: headers
    }).map(res => res.json());
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
}
