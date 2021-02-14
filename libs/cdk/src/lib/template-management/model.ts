import {
  ChangeDetectorRef,
  ElementRef,
  EmbeddedViewRef,
  NgIterable,
  NgZone,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { StrategyCredentialsMap } from '../model';

export type rxBaseTemplateNames = 'errorTpl' | 'completeTpl' | 'suspenseTpl';

export enum RxBaseTemplateNames {
  error = 'errorTpl',
  complete = 'completeTpl',
  suspense = 'suspenseTpl',
}

export const enum RxListTemplateChange {
  insert,
  remove,
  move,
  update,
  context,
}

export type RxListTemplateChanges = [[RxListTemplateChange, any][], boolean];

export interface RxViewContext<T> {
  // to enable `let` syntax we have to use $implicit (var; let v = var)
  $implicit: T;
  // set context var complete to true (var$; let e = $error)
  $error: false | Error;
  // set context var complete to true (var$; let c = $complete)
  $complete: boolean;
  // set context var suspense to true (var$; let s = $suspense)
  $suspense: any;
}

export interface RxListViewComputedContext {
  index: number;
  count: number;
}

export interface RxListViewContext<T, U = RxListViewComputedContext>
  extends RxListViewComputedContext {
  $implicit: T;
  item$: Observable<T>;
  updateContext(newProps: Partial<U>): void;
}

export interface RxListManager<T> {
  nextStrategy: (config: string | Observable<string>) => void;
  render(changes$: Observable<NgIterable<T>>): Observable<void>;
}

export interface RenderAware<T> {
  nextStrategy: (nextConfig: string | Observable<string>) => void;
  render: (values$: Observable<T>) => Observable<void>;
}

export interface RxRenderSettings<T, C> {
  cdRef: ChangeDetectorRef;
  eRef: ElementRef;
  parent: boolean;
  patchZone: NgZone | false;
  strategies: StrategyCredentialsMap;
  defaultStrategyName: string;
}

export type CreateEmbeddedView<C> = (
  viewContainerRef: ViewContainerRef,
  patchZone: NgZone | false
) => (
  templateRef: TemplateRef<C>,
  context?: C,
  index?: number
) => EmbeddedViewRef<C>;
export type DistinctByFunction<T> = (oldItem: T, newItem: T) => any;
export type CreateViewContext<T, C, U = unknown> = (
  value: T,
  computedContext: U
) => C;
export type UpdateViewContext<T, C, U = unknown> = (
  value: T,
  view: EmbeddedViewRef<C>,
  computedContext?: U
) => void;

export interface TemplateSettings<T, C, U = unknown> {
  patchZone: NgZone | false;
  viewContainerRef: ViewContainerRef;
  createViewContext: CreateViewContext<T, C, U>;
  updateViewContext: UpdateViewContext<T, C, U>;
  initialTemplateRef?: TemplateRef<C>;
  customContext?: (value: T) => any;
  createViewFactory?: CreateEmbeddedView<C>;
}
