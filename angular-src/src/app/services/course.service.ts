import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';

@Injectable()
export class CourseService {
  authToken: any;
  user: any;

  constructor(private http: Http,
              private router:Router,
              ) {
                this.loadToken();
      }

  getCourses() {
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('courses/all', {headers: headers })
      .map(res => res.json());
  }

  getCourse(courseId){
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('courses/' + courseId, {headers: headers})
      .map(res => res.json());
  }

  createCourse(scanner) {
    console.log("Creating course with this info", scanner);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('courses/create', scanner, {headers: headers}).map(res=> res.json());
  }

  getDocuments(courseId){
    console.log("Got documents request from component, calling API to return docs to caller");
    let headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('courses/' + courseId + '/documents/', {headers: headers})
      .map(res => res.json());
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

}
