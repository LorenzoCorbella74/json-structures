import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { JsonEditorComponent, JsonEditorOptions } from "ang-jsoneditor";

@Component({
  selector: "app-structures",
  templateUrl: "./structures.component.html",
  styleUrls: ["./structures.component.scss"]
})
export class StructuresComponent implements OnInit {
  streamId: number;

  public editorOptions: JsonEditorOptions;
  public data: any;
  public data2: any;

  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  constructor(private location: Location, private route: ActivatedRoute) {
    this.route.params.subscribe(params => (this.streamId = params["id"]));

    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ["code", "text", "tree", "view"]; // set all allowed modes
    //this.options.mode = 'code'; //set only one mode

    this.data = {
      products: [
        {
          name: "car",
          product: [
            {
              name: "honda",
              model: [
                { id: "civic", name: "civic" },
                { id: "accord", name: "accord" },
                { id: "crv", name: "crv" },
                { id: "pilot", name: "pilot" },
                { id: "odyssey", name: "odyssey" }
              ]
            }
          ]
        }
      ]
    };
  }

  ngOnInit() {
    console.log("Id: ", this.streamId);
  }

  goBack() {
    this.location.back(); // <-- go back to previous location on cancel
  }

  addStructures() {
    //this.dataB.push(this.data2);
  }
}
