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
              private router:Router) {
      // this.isDev = true;  // Change to false before deployment
      }

  getCourses() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('courses/all', {headers: headers })
      .map(res => res.json());
  }

  getCourse(courseId){
    let headers = new Headers();
    this.loadToken();
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

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    this.router.navigate(['']);
  }
}
