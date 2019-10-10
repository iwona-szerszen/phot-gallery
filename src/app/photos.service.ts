import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, of } from 'rxjs';
import { scan, map, startWith, withLatestFrom } from 'rxjs/operators';
import propEq from 'ramda/es/propEq';
import flatten from 'ramda/es/flatten';
import filter from 'ramda/es/filter';
import assoc from 'ramda/es/assoc';
import { Photo } from './photo';
import { CategoriesService } from './categories.service';

const initialPhotos: Photo[] = [
  {
      url: 'https://66.media.tumblr.com/dff05f90167b5e50eab4df4f61a309aa/tumblr_o1ro152Q1m1rbkxlgo1_500.jpg',
      description: '',
      id: '6d3238a0-8e7b-4f58-b799-37ad6072097e',
      categoryID: 'b22a7c97-d7da-4fa7-af75-170055a9f825',
  },
  {
      url: 'https://66.media.tumblr.com/be45669e5825a1db9c22c730c00eb5db/tumblr_o6ckp64vBe1vnm7bio1_500.jpg',
      description: '',
      id: 'eec3632f-2364-47d5-8f87-504b98c8fc83',
      categoryID: '4cc5e97c-7572-481a-969d-e92b131a2e8d',
  },
  {
      url: 'https://66.media.tumblr.com/9251ed46399400b08d15993800972c08/tumblr_pw9iqdF4Qr1tfqi0so1_500.jpg',
      description: '',
      id: '02cc506c-a6f4-47f7-856b-cceec9e54190',
      categoryID: '4cc5e97c-7572-481a-969d-e92b131a2e8d',
  },
  {
      url: 'https://66.media.tumblr.com/24afdb14e85f6d48d482ae3a6af83c57/tumblr_pxx0abif9Q1qdsqp6o1_500.jpg',
      description: '',
      id: '279dd724-29c2-4b14-aedd-3c5f3f53ab9e',
      categoryID: '4cc5e97c-7572-481a-969d-e92b131a2e8d',
  },
  {
      url: 'https://66.media.tumblr.com/00cc8515932da313bba8335cc203f8ce/tumblr_pxyqayFKUm1qdsqp6o1_500.jpg',
      description: '',
      id: 'd5af369b-7723-4fc9-856c-e3c2b3cfb03b',
      categoryID: '46004df1-876a-443c-9126-4bee714bed9e',
  },
  {
      url: 'https://66.media.tumblr.com/c9a8653bf0afb576e18e6f4b4c65288b/tumblr_py46p7VQNi1qdqlnso1_500.jpg',
      description: '',
      id: '28daea7d-d615-45a0-ac0b-b0d0bfc9a046',
      categoryID: '46004df1-876a-443c-9126-4bee714bed9e',
  },
  {
      url: 'https://66.media.tumblr.com/fbf867c85348db723a08e1c29f6449fb/tumblr_pqkkz4dePA1wfvbkto1_500.jpg',
      description: '',
      id: 'd7bf8d6c-9358-4a51-b5a8-5decf7ad33cc',
      categoryID: '46004df1-876a-443c-9126-4bee714bed9e',
  }
];

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  constructor(private categoriesService: CategoriesService) { }

  private photos: Photo[] = initialPhotos;

  newPhotos$ = new Subject();

  setCategoryID = ([newPhotos, categoryID]): Photo[] =>
  newPhotos.map(photo => assoc('categoryID', categoryID, photo))

  // tslint:disable-next-line: member-ordering
  private allNewPhotos$ = this.newPhotos$.pipe(
    withLatestFrom(this.categoriesService.activeCategory$),
    map(this.setCategoryID),
    scan((allPhotos, newPhotos) => allPhotos.concat(newPhotos), []),
    startWith([])
  );

  // tslint:disable-next-line: member-ordering
  photos$ = combineLatest(
    of(this.photos),
    this.allNewPhotos$
  ).pipe(
    map(([photos, uploadedPhotos]) => flatten([photos, uploadedPhotos]))
  );

  // tslint:disable-next-line: member-ordering
  noPhotoID = '';
  // tslint:disable-next-line: member-ordering
  activePhotoID$ = new BehaviorSubject(this.noPhotoID);

  // tslint:disable-next-line: member-ordering
  activePhoto$: Observable<Photo> = this.activePhotoID$.pipe(
    withLatestFrom(this.photos$),
    map(([photoID, photos]) => this.findPhotoByID(photos, photoID))
  );

  // tslint:disable-next-line: member-ordering
  filterPhotosByCategory = map(([categoryID, photos]) => filter(
    propEq('categoryID', categoryID),
    photos
  ));

  // tslint:disable-next-line: member-ordering
  activeCategoryPhotos$ = combineLatest(
    this.categoriesService.activeCategory$,
    this.photos$
    ).pipe(this.filterPhotosByCategory);

  findPhotoByID = (photos: Photo[], photoID: string) => photos.find(propEq('id', photoID));
}
