import { LocalStorageService } from './../../services/locastorage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTable, MatTableDataSource } from '@angular/material';
import { AddDialogueComponent } from '../add-dialogue/add-dialogue.component';
import { Router } from '@angular/router';
import { StreamDialogueComponent } from '../stream-dialogue/stream-dialogue.component';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: any[];
  selectedProject: any = {};
  streams: any;
  displayedColumns = ['name', 'structures', 'actions'];
  @ViewChild('table') table: MatTable<any>;

  loadingProjects = false;
  loadingStreams = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private mem: LocalStorageService
  ) {

    this.streams = new MatTableDataSource<any>([]);

  }

  ngOnInit() {
    this.loadProjects(1); //carica i progetti dell'utente 1
  }


  loadProjects(userId: number) {
    this.loadingProjects = true;
    setTimeout(() => {
      this.loadingProjects = false;
      this.projects = [
        { id: '1', name: 'Esempio 1', description: 'bla bla...', category: 'Personale', createdAt: '', streams: [] },
        { id: '2', name: 'Esempio 2', description: 'bla bla...', category: 'Lavoro', createdAt: '', streams: [] },
        { id: '3', name: 'Esempio 3', description: 'bla bla...', category: 'Personale', createdAt: '', streams: [] },
        { id: '4', name: 'Esempio 4', description: 'bla bla...', category: 'Lavoro', createdAt: '', streams: [] },
      ];
      const sel = this.mem.get('selectedProject');
      if (sel) {
        this.selectedProject = sel;
        this.loadStreams(this.selectedProject.id);
      }
    }, 500);
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
    this.projects = this.projects.filter(e => e.id !== proj.id);
  }

  openAddProject() {
    const dialogRef = this.dialog.open(AddDialogueComponent, {
      height: '480px',
      width: '640px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result: ', result);
        this.projects.push(Object.assign({id:6}, result));
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
