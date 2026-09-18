# COMMENTI

```HTML

<body>

  <!-- CONTENITORE DELLO SFONDO ANIMATO -->
  <!-- <div class="background-container">
    <div class="sphere sphere-1"></div>
    <div class="sphere sphere-2"></div>
    <div class="sphere sphere-3"></div>
    <div class="sphere sphere-4"></div>
  </div> -->
  
  <div class="background-container">
  <!-- Nuovo contenitore intermedio che isola il blur -->
  <div class="blur-wrapper">
    <div class="sphere sphere-1"></div>
    <div class="sphere sphere-2"></div>
    <div class="sphere sphere-3"></div>
    <div class="sphere sphere-4"></div>
  </div>
</div>

<!-- Se voglio che lo sfondo animato sia visibile dietro il contenuto principale devo posizionarlo prima del componente radice (<app-root>)-->
  
  <app-root></app-root>
  
</body>

<!-- app-root è il componente radice dell'applicazione Angular. 
 Ciò significa che è il punto di ingresso principale dell'applicazione, e tutti gli altri componenti saranno figli di questo componente. -->

```