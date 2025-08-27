import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AppMenu } from './app.menu';
import { SharedService } from '../../shared/services/shared.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` <div #sidebar class="layout-sidebar">
        <app-menu></app-menu>
    </div>`
})
export class AppSidebar implements AfterViewInit  {
    constructor(public el: ElementRef, private shared: SharedService) {}

    
    @ViewChild('sidebar') sidebar!: ElementRef // Get a reference to the sidebar div

        
    ngAfterViewInit(): void {
        this.shared.setSidebar(this.sidebar)
    }
}
