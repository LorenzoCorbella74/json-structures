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
  styleUrls: ["./structures.component.scss"]
})
export class StructuresComponent implements OnInit {
  streamId: string;
  projectId: string;
  jsonObjects: any[]=[];
  default={test:'Lorenzo'}

  public editorOptions: JsonEditorOptions;
  public data: any;
  project: any = {};


  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public firebase: FirebaseService) {

    // route params
    this.route.params.subscribe(params => {
      this.streamId = params["id"];
      this.projectId = params["id"].substring(0, 20);
    });

    // list of jsonData
/*     this.firebase.getJsonObjectsList().subscribe(data => {
      this.jsonObjects = data.map(e => {
        if (e.payload.doc.data()['projectId'] === this.project.id && e.payload.doc.data()['streamId']== this.streamId) {
          return {
            id: e.payload.doc.id,
            projectId: e.payload.doc.data()['projectId'],
            streamId: e.payload.doc.data()['streamId'],
            modes: e.payload.doc.data()['modes'],
            mode: e.payload.doc.data()['mode'],
            jsonData: e.payload.doc.data()['jsonData'],
            editorOptions: new JsonEditorOptions(),
          };
        }
      });
    }); */

    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ["code", "text", "tree", "view"]; // set all allowed modes
    this.editorOptions.mode = 'code'; //set only one mode
    console.log(this.editorOptions);
    this.data = {
      test: "lorenzo"
    };
  }

  ngOnInit() {
    this.getProject(this.projectId)
  }

  getData($event){
    console.log($event)
    this.data = this.editor.get();
  }

  getProject(id: string): any {
    this.firebase.getProject(id)
      .subscribe(
        doc => {
          if (doc.exists) {
            this.project =  doc.data();
            console.log(this.project);
          } else {
            console.log("No such document!");
          }
        },
        error => console.log(error));
  }

  addJsonObject(){
    let newJsonObject = {
      projectId: this.projectId,
      streamId : this.streamId,
      modes: ["code", "text", "tree", "view"],
      mode: "code",
      jsonData: {test:"Lorenzo"}
    }
    this.firebase.createJson(newJsonObject)
    .then(data => {
      newJsonObject['editorOptions'] = new JsonEditorOptions();
      newJsonObject['editorOptions'].modes = newJsonObject.modes;
      newJsonObject['editorOptions'].mode = newJsonObject.mode;
      this.jsonObjects.push(data);
    })
    .catch(error => console.log('Impossibile creare un progetto: ', error));
  }

  deleteJsonObject(){

  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

}
