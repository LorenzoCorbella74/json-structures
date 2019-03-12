import { LocalStorageService } from './../../services/locastorage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable, MatTableDataSource } from '@angular/material';
import { AddDialogueComponent } from '../add-dialogue/add-dialogue.component';
import { Router } from '@angular/router';
import { StreamDialogueComponent } from '../stream-dialogue/stream-dialogue.component';
import { AuthenticateService } from '../../services/authenticate.service';
import { FirebaseService } from '../../services/firebase.service';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  user: any;
  projects: any;
  selectedProject: any = {};
  streams: any;
  displayedColumns = ['name', 'structures', 'actions'];
  @ViewChild('table') table: MatTable<any>;

  loadingProjects = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private mem: LocalStorageService,
    public auth: AuthenticateService,
    public firebase: FirebaseService
  ) {

    this.streams = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.user = this.mem.get("user");
    if (this.user) {
      this.loadProjects(this.user.uid);         // carica i progetti dell'utente
    }
  }

  loadProjects(userId: string) {
    this.firebase.getprojectsList().subscribe(data => {
      this.projects = data.map(e => {
        if (e.payload.doc.data()['userId'] === this.user.uid) {
          return {
            id: e.payload.doc.id,
            userId: e.payload.doc.data()['userId'],
            name: e.payload.doc.data()['name'],
            description: e.payload.doc.data()['description'],
            category: e.payload.doc.data()['category'],
            streams: e.payload.doc.data()['streams']
          };
        }
      });
    });
  }

  loadStreams(id: number) {
    this.streams = this.selectedProject.streams;
  }

  onSelect(project: any): void {
    this.selectedProject = project;
    if (!this.selectedProject.streams) {
      this.selectedProject.streams = [];
    }
    this.loadStreams(project.id); // si caricano gli stream del progetto
  }

  openEditProject(obj: any) {
    const dialogRef = this.dialog.open(AddDialogueComponent, {
      height: '450px',
      width: '600px',
      data: obj
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Modale edita: ', { result });     // `Modale edita: ${result}`
        this.firebase.updateProject(obj.id, result)
          .then(data => {
            obj = result;
          })
          .catch(error => console.log('Impossibile aggiornare un progetto: ', error));
      }
    });
  }

  deleteProject(proj: any) {
    this.firebase.delateProject(proj.id)
      .then(data => {
        this.projects = this.projects.filter(e => e.id !== proj.id);
      })
      .catch(error => console.log('Impossibile cancellare un progetto: ', error));
  }

  openAddProject() {
    const dialogRef = this.dialog.open(AddDialogueComponent, {
      height: '480px',
      width: '640px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        delete result.createdAt;
        result = Object.assign(result, { userId: this.user.uid, streams: [] });
        console.log('Modale aggiungi: ', result);
        this.firebase.createProject(result)
          .then(data => {
            this.projects.push(data);
          })
          .catch(error => console.log('Impossibile creare un progetto: ', error));
      }
    });
  }

  openAddStream() {
    const dialogRef = this.dialog.open(StreamDialogueComponent, {
      height: '480px',
      width: '640px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        delete result.createdAt;
        console.log('Dialog add stream: ', result);
        this.selectedProject.streams.push(result);
        this.firebase.updateProject(this.selectedProject.id, this.selectedProject)
          .then(data => {
            this.table.renderRows();
          })
          .catch(error => console.log('Impossibile aggiornare un progetto: ', error));
      }
    });
  }

  editStream(stream: any) {
    const dialogRef = this.dialog.open(StreamDialogueComponent, {
      height: '480px',
      width: '640px',
      data: stream
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog add stream: ', result);
        const theOne = this.selectedProject.streams.find(e => result.name === e.name);
        this.selectedProject.streams[theOne] = result;
        this.firebase.updateProject(this.selectedProject.id, this.selectedProject)
          .then(data => {
            this.table.renderRows();
          })
          .catch(error => console.log('Impossibile aggiornare un progetto: ', error));
      }
    });
  }

  deleteStream(stream: any) {
    const theOne = this.selectedProject.streams.find(e => stream.name === e.name);
    this.selectedProject.streams.splice(theOne, 1);
    this.firebase.updateProject(this.selectedProject.id, this.selectedProject)
      .then(data => {
        this.table.renderRows();
      })
      .catch(error => console.log('Impossibile aggiornare un progetto: ', error));
  }

  goToStream(stream: any) {
    if (!stream.data) {
      stream.data = '';
    }
    this.router.navigate(['/structures', stream.name]);
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

}
