import { ElementRef, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FocusService {

    // SIGNAL CHE MEMORIZZA IL RIFERIMENTO ALL'ELEMENTO TARGET CORRENTE
    private customTarget = signal<ElementRef<HTMLElement> | null>(null);


    // METODO PER IMPOSTARE IL TARGET PERSONALIZZATO
    setCustomTarget(elementRef: ElementRef<HTMLElement>) {
        this.customTarget.set(elementRef);
    }


    // METODO PER REIMPOSTARE IL TARGET PERSONALIZZATO AL COMPORTAMENTO DI DEFAULT
    resetTarget() {
        this.customTarget.set(null);
    }


    // METODO PER OTTENERE IL TARGET CORRENTE
    getTarget() {
        return this.customTarget();
    }

}



// VS Code Counter: 16 code lines (29/10/2026)
