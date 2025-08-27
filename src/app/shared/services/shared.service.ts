import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
    constructor() { }
    
    private sidebarElement: ElementRef | null = null;

    setSidebar(element: ElementRef): void {
        this.sidebarElement = element;
    }

    getSidebar(): ElementRef | null {
        return this.sidebarElement;
    }

}

