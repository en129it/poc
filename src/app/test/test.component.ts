import { Component, Directive, ViewContainerRef, ViewChild, AfterContentInit } from '@angular/core';

@Directive({
    selector: '[myElem]'
})
export class MyDirective {
    constructor(public viewContainerRef : ViewContainerRef) {}
}

@Component({
    selector: 'my-other-comp',
    template: `
                <div>This is the other component</div>
              `
})
export class MyOtherComponent {

}

@Component({
    selector: 'my-comp',
    template: `
                <div>Hello</div>
                <ng-template myElem>
                    <div>Hello too</div>
                    <ng-content></ng-content>
                </ng-template>
              `
})
export class MyComponent {
    @ViewChild(MyDirective) public myDirective : MyDirective;
    public myElem: ViewContainerRef;

    ngAfterContentInit() {
        this.myElem = this.myDirective.viewContainerRef;
    }
}

@Component({
    selector: 'my-root',
    template: `
                <my-comp>
                    <div>This is the content</div>
                    <my-other-comp></my-other-comp>
                </my-comp>
              `
})
export class MyRootComponent {

}