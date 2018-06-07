import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private courseService: CourseService) { }

  courses: any = [];

  ngOnInit() {
    this.courseService.getCourses().subscribe(courses => {
      this.courses = courses.data;
      console.log(this.courses);
    },
     err => {
       //somethin went wrong
       console.log(err);
    });
  }

  alert(){
    console.log("It worked!");
    alert("Hi!");
  }

}
