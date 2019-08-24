import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IFruit } from 'app/shared/model/fruit.model';
import { FruitService } from './fruit.service';

@Component({
  selector: 'jhi-fruit-update',
  templateUrl: './fruit-update.component.html'
})
export class FruitUpdateComponent implements OnInit {
  fruit: IFruit;
  isSaving: boolean;

  constructor(private fruitService: FruitService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ fruit }) => {
      this.fruit = fruit;
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    if (this.fruit.id !== undefined) {
      this.subscribeToSaveResponse(this.fruitService.update(this.fruit));
    } else {
      this.subscribeToSaveResponse(this.fruitService.create(this.fruit));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IFruit>>) {
    result.subscribe((res: HttpResponse<IFruit>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError() {
    this.isSaving = false;
  }
}
