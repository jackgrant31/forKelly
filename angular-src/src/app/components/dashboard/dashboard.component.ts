import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private courseService: CourseService, private authService: AuthService) { }

  courses: any = [];
  username:any;

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      console.log(this.username);
      //this has to go inside so authservice can finish first
      this.courseService.getCoursesFromUsername(this.username).subscribe(courses => {
        console.log(this.username);
        this.courses = courses.data;
        console.log(this.courses);
      },
       err => {
         //somethin went wrong
         console.log(err);
      });
    },
     err => {
       console.log("profile error");
    });

  }
  // var i;
      // var j=0;
      // console.log(courses.data[0]);
      // for(i=0;i<courses.data.length;i++)
      // {
      //   if(courses.data[i].creator==this.username)
      //   {
      //     this.courses[j] = courses.data[i];
      //     j++;
      //   }
      // }

  alert(){
    console.log("It worked!");
    alert("Hi!");
  }

}
