import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {

  constructor(
    public sanitizer: DomSanitizer,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {}

  document: any;
  courseId: any;

  ngOnInit() {
    this.route.params.subscribe(params=>{
      console.log("Got params", params);
      let documentId = params.documentId;
      this.courseId = params.courseId;

      this.documentService.getDocumentFromCourse(this.courseId, documentId).subscribe(document => {
        console.log(document);
        this.document = document.data;
        this.document.link = "https://www.coursehero.com/file/" + this.document._id + "/";
        console.log(this.document.link);
      },
       err => {
         //somethin went wrong
         console.log(err);
      });
    });
  }

  ignoreDocument(){
    this.documentService.updateReviewState(this.courseId, this.document, false).subscribe(
      res => {
        this.flashMessage.show(res.msg, {
          cssClass: 'alert alert-success',
          timeout: 5000
        });
        this.router.navigate(['course/', this.courseId]);
      }, err => {
        err = err.json();
        this.flashMessage.show(err.msg, {
          cssClass: 'alert alert-danger',
          timeout: 5000
        });
      }
    );
  }

  submitRequest(){
    this.documentService.updateReviewState(this.courseId, this.document, true).subscribe(
      res => {
        this.flashMessage.show(res.msg, {
          cssClass: 'alert alert-success',
          timeout: 5000
        });
        console.log("status of thing"+res.complete);
        this.router.navigate(['course/', this.courseId]);
      }, err => {
        err = err.json();
        this.flashMessage.show(err.msg, {
          cssClass: 'alert alert-danger',
          timeout: 5000
        });
      }
    );
  }
}
