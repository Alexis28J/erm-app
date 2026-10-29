import { Component, signal, viewChild, ElementRef, inject, effect } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FocusService } from './shared/focus-service/focus.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {

  constructor() {

    const navEnd = toSignal(this.router.events.pipe(filter(e => e instanceof NavigationEnd)));

    effect(() => {
      if (navEnd()) {
        this.focusService.resetTarget();
      }
    });

  }

  // TITOLO DELL'APPLICAZIONE
  protected readonly title = signal('erm-app');


  // RIFERIMENTO AL CONTENITORE PRINCIPALE DELLA PAGINA
  private defaultMainContent = viewChild<ElementRef<HTMLElement>>('defaultMainContent');


  // SERVIZI INIETTATI 
  private focusService = inject(FocusService);
  private router = inject(Router);


  // METODO PER SALTARE AL CONTENUTO PRINCIPALE (DEFAULT O CUSTOM)
  jumpToTheContent() {

    const customTarget = this.focusService.getTarget();

    if (customTarget) {
      customTarget.nativeElement.focus();
    } else {
      this.defaultMainContent()?.nativeElement.focus();
    }
  }

}



// VS Code Counter: 35 code lines (29/10/2026)