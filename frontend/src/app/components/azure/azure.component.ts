import { ChangeDetectionStrategy } from "@angular/compiler/src/compiler_facade_interface";
import { ChangeDetectorRef, OnInit } from "@angular/core";
import { Component } from "@angular/core";

import {
  getContainers,
  createContainer,
  listBlob,
  BLOBItem,
  CONTENT,
  uploadFile, 
  deleteBlob,
  deleteContainerV
} from "./azure.storage";

@Component({
  selector: "app-root",
  templateUrl: "./azure.component.html",
})
export class AzureComponent implements OnInit {
  title = "azure demo-ng";
  containers: any = [];
  selectedContainer: string = "";
  listItems: any = [];
  constructor(private changeDetection: ChangeDetectorRef ) {}

 async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
 await this.getContainers();

  }

  async getContainers() {
    getContainers().then((res: Array<string>) => {
      debugger;
      this.containers = res;
      this.changeDetection.detectChanges();

    });
  }

  upload(file: any) {
    console.log(file.files.length);
    if (file.files.length > 0) {
      [...file.files].forEach((file: any) => {
        let content: CONTENT = {
          containerName: this.selectedContainer,
          file: file,
          filename: `${this.selectedContainer}-${Date.now()}.${
            file.name.split(".")[1]
          }`,
        };
        uploadFile(content).then((res: string) => {
          console.log(res);
        });
        console.log(file);
      });
    }
  }

  create(value: string) {
    debugger;
    createContainer(value).then(async (resp) => {
       await this.getContainers();
      console.log(resp);
    });
  }

  async listFiles(containerName: string) {
    this.selectedContainer = containerName;
    listBlob(containerName).then((res: Array<BLOBItem>) => {
      this.listItems = res;
      console.log(res);
    });
  }

  delete(value: string) {
    deleteBlob(this.selectedContainer, value).then((resp: string) => {
      console.log(resp);
    });
  }

  deleteContainer(value: string) {
    deleteContainerV(value).then((resp: string) => {
      console.log(resp);
    });
  }
}
