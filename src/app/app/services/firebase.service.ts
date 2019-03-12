/*
import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';


@Injectable()
export class FirebaseService {

  private basePath: string = '/projects';

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

import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore) {}

  createProject(project) {
    return this.firestore.collection('projects').add(project);
  }

  getprojectsList() {
    return this.firestore.collection('projects').snapshotChanges();
  }

  updateProject(projectId, project): any {
    return this.firestore.doc('projects/' + projectId).update(project);
  }

  delateProject(projectId): any {
    return this.firestore.doc('projects/' + projectId).delete();
  }
}
