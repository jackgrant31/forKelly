import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.css']
})
export class CourseViewComponent implements OnInit {

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  documents: any = [];
  courseId: String;
  course: any;

  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.courseId = params.courseId;
      console.log('Got a token: ', this.courseId);
      this.courseService.getCourse(this.courseId).subscribe(course => {
        console.log(course);
        this.course = course; 
      },
       err => {
         //somethin went wrong
         console.log(err);
      });

      this.courseService.getDocuments(this.courseId).subscribe(documents => {
        this.documents = documents.data;
        console.log("Got docs: ");
        console.log(documents);
      },
        err => {
          //somethin went wrong
          console.log(err);
        })
    });

    // this.courseService.getCourses().subscribe(courses => {
    //   this.courses = courses.data;
    //   console.log(this.courses);
    // },
    //  err => {
    //    //somethin went wrong
    //    console.log(err);
    // });

  }

  onReviewClick(document){
    alert("Worked");
  }

  alert(){
    console.log("It worked!");
    alert("Hi!");
  }

}
