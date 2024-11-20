import { LoadingService } from './../../../services/loading.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CottagesService } from 'src/app/services/cottages.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent {
  filesToUpload: FileList | null = null;
  addForm!:FormGroup;

  constructor(private message:NzMessageService, private loadingService:LoadingService, private uploadService: CottagesService, private fb: FormBuilder) {
    this.loadingService.hideLoading();
    this.addForm = this.fb.group({
      name: ['',Validators.required],
      price: ['',Validators.required],
      rooms: ['',Validators.required],
      maxGuests: ['',Validators.required],
      beds: ['',Validators.required],
      type: ['',Validators.required],
      desc: ['',Validators.required],
      desc_long: ['',Validators.required],
      imageUrl: [null],
      imageUrls:[null],
      tag:['',Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = (event.target.files as FileList)[0];
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    this.addForm.patchValue({ imageUrl: file });
    this.addForm.get('image')?.updateValueAndValidity();

    if (file && fileNameDisplay) {
      fileNameDisplay.innerText = ` ${file.name}`;
    } else if (fileNameDisplay) {
      fileNameDisplay.innerText = '';
    }
  }

  onAdditionalImagesSelect(event: any) {
    if (event.target.files.length > 0) {
      const additionalImages = event.target.files;
      this.addForm.patchValue({
        imageUrls : additionalImages
      });
    }
  }

  get fc() {
    return this.addForm.controls;
  }

  sumbit(): void {
    const name = this.fc.name.value;
    const price = this.fc.price.value;
    const rooms = this.fc.rooms.value;
    const maxGuests = this.fc.maxGuests.value;
    const beds = this.fc.beds.value;
    const type = this.fc.type.value;
    const desc = this.fc.desc.value;
    const desc_long = this.fc.desc_long.value;
    const image = this.fc.imageUrl.value;
    const tag = this.fc.tag.value;
    const images = this.fc.imageUrls.value;
    this.uploadService.uploadForm(name,price,rooms,maxGuests,beds,type,desc,desc_long,image,images,tag).subscribe({
      next:(response) => {
        this.message.success("Dodano lokal")
      },
      error:(error) => this.message.error("Błąd przy dodawaniu lokalu.")
    })

  }

  handleFileInput(files: FileList) {
    this.filesToUpload = files;
}
}
