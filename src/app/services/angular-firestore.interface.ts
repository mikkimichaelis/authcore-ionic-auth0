import { NgZone } from '@angular/core';
import firebase from 'firebase/app';
import { FirebaseAppConfig, FirebaseOptions, ɵAngularFireSchedulers } from '@angular/fire';
import { AngularFirestoreCollection, AngularFirestoreCollectionGroup, AngularFirestoreDocument, 
    CollectionReference, DocumentReference, PersistenceSettings, QueryFn, QueryGroupFn, Settings } from "@angular/fire/firestore";
import { Observable } from 'rxjs';

export interface IAngularFirestore {
    readonly firestore: firebase.firestore.Firestore;
    readonly persistenceEnabled$: Observable<boolean>;
    readonly schedulers: ɵAngularFireSchedulers;
    readonly keepUnstableUntilFirst: <T>(obs: Observable<T>) => Observable<T>;

    constructor(options: FirebaseOptions, nameOrConfig: string | FirebaseAppConfig | null | undefined, shouldEnablePersistence: boolean | null, 
        settings: Settings | null, platformId: Object, zone: NgZone, persistenceSettings: PersistenceSettings | null);

    collection<T>(path: string, queryFn?: QueryFn): AngularFirestoreCollection<T>;
    collection<T>(ref: CollectionReference, queryFn?: QueryFn): AngularFirestoreCollection<T>;

    collectionGroup<T>(collectionId: string, queryGroupFn?: QueryGroupFn): AngularFirestoreCollectionGroup<T>;

    doc<T>(path: string): AngularFirestoreDocument<T>;
    doc<T>(ref: DocumentReference): AngularFirestoreDocument<T>;
    createId(): string;
}