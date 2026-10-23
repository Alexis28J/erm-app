import { Component, signal, viewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {

  // TITOLO DELL'APPLICAZIONE
  protected readonly title = signal('erm-app');


  // CONTENITORE PRINCIPALE DELLA PAGINA
  private mainContent = viewChild<ElementRef<HTMLElement>>('mainContent');


  // METODO PER SALTARE AL CONTENUTO PRINCIPALE
  jumpToTheContent() {
    this.mainContent()?.nativeElement.focus();
  }

}



// VS Code Counter: 17 code lines (22/10/2026)