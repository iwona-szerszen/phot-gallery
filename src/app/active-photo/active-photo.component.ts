import { Component, OnInit } from '@angular/core';
import { Photo } from '../photo';
import { Observable } from 'rxjs';
import { PhotosService } from '../photos.service';

@Component({
  selector: 'app-active-photo',
  templateUrl: './active-photo.component.html',
  styleUrls: ['./active-photo.component.scss']
})
export class ActivePhotoComponent implements OnInit {

  photo: Photo;
  activePhoto$: Observable<Photo> = this.photosService.activePhoto$;

  constructor(private photosService: PhotosService) { }

  ngOnInit() {
  }

  hidePhoto() {
    this.photosService.activePhotoID$.next(this.photosService.noPhotoID);
  }
}
