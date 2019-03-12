import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-add-dialogue',
  templateUrl: './add-dialogue.component.html',
  styleUrls: ['./add-dialogue.component.scss']
})
export class AddDialogueComponent implements OnInit {

  project: any = {
    name: '',
    description: '',
    category: '',
    createdAt: new Date()
  };
  editMode:boolean = false;

  constructor(public thisDialogRef: MatDialogRef<AddDialogueComponent>, @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    if (this.data) {
      this.editMode = true;
      this.project = this.data;
    }
  }

  onCloseConfirm(form) {
    if (form.valid) {
      this.thisDialogRef.close(this.project);
    }
  }

  onCloseCancel() {
    this.thisDialogRef.close();
  }

}
