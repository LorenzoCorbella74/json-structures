import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-stream-dialogue',
  templateUrl: './stream-dialogue.component.html',
  styleUrls: ['./stream-dialogue.component.scss']
})
export class StreamDialogueComponent implements OnInit {

  stream: any = {
    name: '',
    description: '',
    createdAt: new Date()
  };
  editMode: boolean = false;

  constructor(public thisDialogRef: MatDialogRef<StreamDialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: string) { }

  // si inizializza con ciò che si passa
  ngOnInit() {
    if (this.data) {
      this.editMode = true;
      this.stream = this.data;
    }
  }

  onCloseConfirm(form) {
    if (form.valid) {
      this.thisDialogRef.close(this.stream);
    }
  }

  onCloseCancel() {
    this.thisDialogRef.close();
  }

}
