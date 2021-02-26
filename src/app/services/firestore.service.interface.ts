import { AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

export interface IFirestoreService {
  col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T>;
  doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T>;
  doc$<T>(ref: DocPredicate<T>): Observable<T>;
  col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]>;
}