import { Component, inject } from '@angular/core'; 
import { LanguageService } from '../../core/services/language.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '../../shared/pipes/translate-pipe';

@Component({
  imports: [
    RouterLink, MatButtonModule, MatToolbarModule,
    MatMenuModule, MatIconModule, MatCardModule,
    MatTooltipModule, TranslatePipe
],
  selector: 'app-home',
  styleUrls: ['./home.scss'],
  templateUrl: './home.html',
})
export class Home {
  
  protected languageService = inject(LanguageService);

}



// VS Code Counter: 23 code lines (13/11/2026)