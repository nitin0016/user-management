import { Component,ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { CommonModule } from '@angular/common';
import { CrudService } from './crud.service';
import { FilterPipe } from './filter-pipe.pipe';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[FilterPipe]
})
export class AppComponent implements OnInit {
  studentForm: FormGroup;
  studentData: any = [];

  constructor(public crudService:CrudService,
      public filter:FilterPipe
  ) {
    this.studentForm = new FormGroup({
      'id': new FormControl(null),
      'name': new FormControl(null, Validators.required),
      'age': new FormControl(null),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'address': new FormControl(null),
      'phone': new FormControl(null)
    });
  }

  ngOnInit() {
    const localData = localStorage.getItem('Record');
    if (localData) {
      this.studentData = JSON.parse(localData);
    }
  }

  onSearch(data:any){
    console.log(data.value)
    this.studentData = data.value.length ? this.filter.transform(data.value,this.studentData): JSON.parse(localStorage.getItem('Record')|| '')
  }

  editStudent(data: any) {
    this.studentForm.setValue(data);
    this.studentForm.get('email')?.disable()
    }

  onUpdate() {
    const recordIndex = this.studentData.findIndex((dt: any) => dt.id === this.studentForm.value.id);
    if (recordIndex !== -1) {
      this.studentData[recordIndex] = this.studentForm.getRawValue();
      console.log(this.studentData[recordIndex]);
      localStorage.setItem('Record', JSON.stringify(this.studentData));
    this.studentForm.get('email')?.enable()
      this.studentForm.reset();
    } else {
      console.error('Record not found for update.');
    }
  }

  deleteStudent(data: any) {
    const index = this.studentData.findIndex((i: any) => i.id === data.id);
    if (index !== -1) {
      this.studentData.splice(index, 1);
      localStorage.setItem('Record', JSON.stringify(this.studentData));
    }
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const localData = localStorage.getItem('Record');
      if (localData) {
        this.studentData = JSON.parse(localData);
      }

      if (this.studentForm.value.id) {
        const existingRecordIndex = this.studentData.findIndex((dt: any) => dt.id === this.studentForm.value.id);
        if (existingRecordIndex !== -1) {
          this.studentData[existingRecordIndex] = this.studentForm.value;
        }
      } else {
        this.studentForm.value.id = Math.floor(Math.random() * 100) + 1;
        this.studentData.push(this.studentForm.value);
      }

      localStorage.setItem('Record', JSON.stringify(this.studentData));
      this.studentForm.reset();
    }
  }
}
