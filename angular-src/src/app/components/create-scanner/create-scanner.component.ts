import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'create-scanner',
  templateUrl: './create-scanner.component.html',
  styleUrls: ['./create-scanner.component.css']
})
export class CreateScannerComponent implements OnInit {
  courseName: String;
  courseUrl: String;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  onCreateSubmit(){
    const course = {
      name: this.courseName,
      url: this.courseUrl,
      creator: "aUser",
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
