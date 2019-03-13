/*
import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';


@Injectable()
export class FirebaseService {

  private basePath: string = '/jsons';

  projects: AngularFireList<any> = null; //  list of objects
  project: any = null;                  //   single object

  constructor(private db: AngularFireDatabase) { }

  // ritorna la lista dei progetti del singolo utente
  getprojectsList(userId:string): any {
    this.projects = this.db.list(this.basePath, ref => ref.orderByChild("userId").equalTo(userId));
    return this.projects;
  }

  getproject(key: string): any {
    const projectPath = `${this.basePath}/${key}`;
    this.project = this.db.object(projectPath)
    return this.project
  }

  createproject(project: any): void {
    this.projects.push(project)
      .catch(error => this.handleError(error))
  }


  // Update an existing project
  updateproject(key: string, value: any): void {
    this.projects.update(key, value)
      .catch(error => this.handleError(error))
  }

  // Deletes a single project
  deleteproject(key: string): void {
    this.projects.remove(key)
      .catch(error => this.handleError(error))
  }

  // Deletes the entire list of projects
  deleteAll(): void {
    this.projects.remove()
      .catch(error => this.handleError(error))
  }

  // Default error handling for all actions
  private handleError(error) {
    console.log(error)
  } */

import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { }

  /* -------------------------- Projects -------------------------- */
  createProject(project) {
    return this.firestore.collection('projects').add(project);
  }

  getprojectsList() {
    return this.firestore.collection('projects').snapshotChanges();
  }

  getProject(projectId):any {
    return this.firestore.doc('projects/' + projectId).get()
  }

  updateProject(projectId, project): any {
    return this.firestore.doc('projects/' + projectId).update(project);
  }

  delateProject(projectId): any {
    return this.firestore.doc('projects/' + projectId).delete();
  }

  /* -------------------------- Streams -------------------------- */

  getJsonObjectsList() {
    return this.firestore.collection('jsons').snapshotChanges();
  }

  createJson(json) {
    return this.firestore.collection('jsons').add(json);
  }

  getJsons() {
    return this.firestore.collection('jsons').snapshotChanges();
  }

  updateJson(json): any {
    return this.firestore.doc('jsons/' + json.id).update(json);
  }

  delateJson(json): any {
    return this.firestore.doc('jsons/' + json.id).delete();
  }

}
