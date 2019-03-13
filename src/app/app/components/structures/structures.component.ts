import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { JsonEditorComponent, JsonEditorOptions } from "ang-jsoneditor";
import { FirebaseService } from '../../services/firebase.service';

// import * as firebase from 'firebase';
// import firestore from 'firebase/firestore'
// import { Observable } from 'rxjs';

// SOURCE: https://github.com/mariohmol/ang-jsoneditor

@Component({
  selector: "app-structures",
  templateUrl: "./structures.component.html",
  styleUrls: ['./structures.component.scss']
})
export class StructuresComponent implements OnInit {
  streamId: string;
  projectId: string;
  jsonObject: any = {};
  selectedIndex: number;
  pageName:string = '';
  project: any = {};

  public editorOptions: JsonEditorOptions;
  public editorOptions2: JsonEditorOptions;

  loading: boolean = false;


  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public firebase: FirebaseService) {

    // route params
    this.route.params.subscribe(params => {
      this.streamId = params['id'];
      this.projectId = params['id'].substring(0, 20);
      console.log(`StreamId: ${this.streamId} - ProjectId: ${this.projectId}`);
    });

    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.editorOptions.mode = 'code';                            // set only one mode
    this.editorOptions2 = new JsonEditorOptions();
    this.editorOptions2.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
    this.editorOptions2.mode = 'tree';                            // set only one mode
    // console.log(this.editorOptions);
  }

  ngOnInit() {
    this.getProject(this.projectId);
  }

  getData($event) {
    console.log('Updated json: ', $event);
    this.jsonObject = $event;
    this.updateJsonObject();
  }

  getProject(id: string): any {
    this.loading = true;
    this.firebase.getProject(id)
      .subscribe(
        doc => {
          this.loading = false;
          if (doc.exists) {
            this.project = doc.data();
            // console.log(this.project);
            this.selectedIndex = this.project.streams.findIndex(e => e.id === this.streamId);
            // se esiste si prende quello ritornato
            const index = this.project.streams[this.selectedIndex].refId;
            this.pageName = this.project.streams[this.selectedIndex].name;
            if (index) {
              this.loading = true;
              this.firebase.getJson(index)
                .subscribe(
                  doc => {
                    this.loading = false;
                    const d = doc.data();
                    console.log('json: ', d);
                    this.jsonObject = d.jsonData;
                  },
                  err => console.log(err)
                );
            // si aggiunge un riferimento ai progetti
            } else {
              this.addJsonObject();
            }
          } else {
            console.log('No such document!');
          }
        },
        error => console.log(error));
  }

  addJsonObject() {
    const newJsonObject = {
      projectId: this.projectId,
      streamId: this.streamId
    };
    this.firebase.createJson(newJsonObject)
      .then(data => {
        this.project.streams[this.selectedIndex].refId = data.id;
        // si aggiorna con il riferimento al'altra collection
        this.firebase.updateProject(this.project.id, this.project)
          .then(data => {
            this.updateJsonObject();
          })
          .catch(error => console.log('Impossibile aggiornare un progetto: ', error));
      })
      .catch(error => console.log('Impossibile creare un progetto: ', error));
  }

  updateJsonObject() {
    const newId = this.project.streams[this.selectedIndex].refId;
    const newJsonObject = {
      id: newId,
      projectId: this.projectId,
      streamId: this.streamId,
      jsonData: this.jsonObject
    };
    this.firebase.updateJson(newId, newJsonObject)
      .then(data => {
        console.log('Aggiornato con successo: ', data);
      })
      .catch(error => console.log('Impossibile aggiornare un progetto: ', error));
  }

  deleteJsonObject() {

  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
