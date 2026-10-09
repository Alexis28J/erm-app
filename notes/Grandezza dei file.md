# BEST PRACTICE

Limite di grandezza di un file:

# TS
Parametri di riferimento:

• Ottimale / Piccolo: Sotto le 200 righe.
• Normale / Accettabile: Tra le 200 e le 300-400 righe.
• Grande / Da dividere: Sopra le 400–500 righe (segno che il componente dovrebbe essere spezzato in sotto-componenti o che la logica di business va spostata in un servizio dedicato).


# 1. File dei Componenti (.component.ts)

• Soglia critica: 400 righe
• Perché: È il limite più rigido. Se un componente supera le 400 righe, quasi sicuramente sta violando il principio di responsabilità singola (Single Responsibility Principle). Significa che sta gestendo troppe azioni dell'utente, troppe chiamate API o troppi cambi di stato.


# 2. File dei Servizi (.service.ts)

• Soglia consigliata: 300–400 righe (ma con eccezioni)
• La regola reale: Più che il numero di righe, nei servizi conta la coesione. Un servizio deve fare una sola cosa ben definita (es. UserService gestisce solo gli utenti, AuthService gestisce solo il login).
• Eccezione: Se hai un servizio API che mappa molte richieste verso il server (es. un DataService centrale con 30 metodi HTTP diversi), il file potrebbe superare le 400 righe solo perché contiene molte funzioni ripetitive. È accettabile, ma se diventa gigantesco è meglio dividerlo per aree tematiche (es. OrderApiService, ProductApiService).


# 3. File delle Rotte e di Configurazione (-routing.module.ts o app.routes.ts)

• Soglia consigliata: Dipende dall'architettura (Teoricamente illimitato, ma... )
• La regola reale: In un'applicazione Angular moderna (specialmente da Angular 15+ con i componenti standalone), le rotte sono semplici array di configurazione. Se l'applicazione è enorme, un unico file di rotte potrebbe diventare lunghissimo.
• Come gestirlo: Non si riduce il codice tagliando le righe, ma usando il Lazy Loading (loadChildren o loadComponent). In questo modo spezzi il file delle rotte principale in tanti piccoli file di rotte secondari (uno per ogni macro-modulo o funzionalità), mantenendo ogni file sotto le 50-100 righe.


///////////////////////////////////////////////////////////////////////////////////////////////////////////

# HTML
Un file HTML in Angular viene considerato grande già quando supera le 100–150 righe di codice.

• Ottimale: Sotto le 50 righe. Un template pulito si legge a colpo d'occhio.
• Grande (sopra le 150 righe): Significa che l'interfaccia utente è troppo complessa. In Angular, l'HTML dovrebbe essere solo lo "scheletro". Se diventa troppo lungo, è il segnale chiaro che devi creare dei sotto-componenti (child components) riutilizzabili o semplicemente più piccoli.


///////////////////////////////////////////////////////////////////////////////////////////////////////////

# SCSS

Un file SCSS viene considerato grande quando supera le 100 righe di codice.

• Ottimale: Sotto le 50 righe.
• Grande (sopra le 100 righe): Spesso indica che stai scrivendo troppi stili personalizzati o che non stai sfruttando le funzionalità di Angular (come l'incapsulamento degli stili) o un framework CSS globale (es. Tailwind, Bootstrap o Angular Material). Se usi metodologie come BEM o le utility class, i file SCSS del singolo componente dovrebbero essere quasi vuoti o contenere pochissime regole specifiche.


• File styles.scss (Indice centrale): Massimo 50-100 righe. Deve contenere solo @use o @import ed eventualmente pochissimi stili applicati direttamente a body o html.

• Singoli file parziali (es. _variables.scss, _typography.scss): Massimo 150–200 righe ciascuno. Se noti che un file parziale (come quello delle utility) diventa troppo grande, spezzalo ulteriormente (es. _buttons.scss, _cards.scss).