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
  loadingStreams = false;

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
      console.log(data)
      this.projects = data
    });
  }

  loadStreams(id: number) {
    this.loadingStreams = true;
    this.streams = [];
    // MOCK DATA
    setTimeout(() => {
      this.loadingStreams = false;
      this.streams = [
        {
          id: 1, name: 'customerManagement', structures: [
            { id: 1, name: 'read' },
            { id: 2, name: 'ibans' },
            { id: 3, name: 'yourdesire' },
            { id: 4, name: 'myfortune' }
          ], createdAt: ''
        },
        {
          id: 2, name: 'customerProducts', structures: [
            { id: 6, name: 'readMe' },
            { id: 7, name: 'profiles' }
          ], createdAt: ''
        },
        {
          id: 3, name: 'FiscalCode', structures: [
            { id: 8, name: 'YoyrProfile' },
            { id: 9, name: 'myProfiles' }
          ], createdAt: ''
        },
        { id: 4, name: 'nationalities', structures: [], createdAt: '' }
      ];
    }, 500);
  }

  onSelect(project: any): void {
    this.selectedProject = project;
    this.mem.set('selectedProject', project);
    this.loadStreams(project.id); // si caricano gli stream del progetto
  }

  openEditProject(obj: any) {
    const dialogRef = this.dialog.open(AddDialogueComponent, {
      height: '450px',
      width: '600px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      obj = result;
    });
  }

  deleteProject(proj: any) {
    this.firebase.delateProject(proj.id).then(data => {
      this.projects = this.projects.filter(e => e.id !== proj.id);
    })
    .catch(error => console.log(error))

  }

  openAddProject() {
    const dialogRef = this.dialog.open(AddDialogueComponent, {
      height: '480px',
      width: '640px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        delete result.createdAt;
        console.log('Dialog result: ', result);
        this.firebase.createProject(result)
          .then(data => {
            this.projects.push(data);
          })
          .catch(error => console.log(error))
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
        console.log('Dialog result: ', result);
        this.streams.push(result);
        this.table.renderRows();
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
      console.log(`Dialog result: ${result}`);
      stream = result;
    });
  }

  deleteStream(stream: any) {
    this.streams = this.streams.filter(e => e.id !== stream.id);
  }

  goToStream(stream: any) {
    this.router.navigate(['/structures', stream.id]);
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

}
