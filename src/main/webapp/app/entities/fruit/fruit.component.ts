import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IFruit } from 'app/shared/model/fruit.model';
import { Principal } from 'app/core';
import { FruitService } from './fruit.service';

@Component({
  selector: 'jhi-fruit',
  templateUrl: './fruit.component.html'
})
export class FruitComponent implements OnInit, OnDestroy {
  fruits: IFruit[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    private fruitService: FruitService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private principal: Principal
  ) {}

  loadAll() {
    this.fruitService.query().subscribe(
      (res: HttpResponse<IFruit[]>) => {
        this.fruits = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnInit() {
    this.loadAll();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInFruits();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IFruit) {
    return item.id;
  }

  registerChangeInFruits() {
    this.eventSubscriber = this.eventManager.subscribe('fruitListModification', response => this.loadAll());
  }

  private onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
