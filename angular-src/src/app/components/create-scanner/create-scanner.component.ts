import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'create-scanner',
  templateUrl: './create-scanner.component.html',
  styleUrls: ['./create-scanner.component.css']
})
export class CreateScannerComponent implements OnInit {
  courseName: String;
  courseUrl: String;
  username: any;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private authService: AuthService) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      console.log(profile.user.username);
    },
     err => {
       this.flashMessage.show(err, {cssClass: 'alert-danger', timeout: 3000});
    });
  }

  onCreateSubmit(){
    
    const course = {
      name: this.courseName,
      url: this.courseUrl,
      creator: this.username,
      frequency: "12",
    }

    console.log("Creating course with the following details", course);
    
    this.courseService.createCourse(course).subscribe(
      res => {
        this.flashMessage.show(res.msg, {cssClass: 'alert alert-success', timeout: 5000});
        this.router.navigate(['dashboard']);
      }, err => {
        err=err.json();
        this.flashMessage.show(err.msg, {cssClass: 'alert alert-danger', timeout: 5000});
      }
    )
  }
}
