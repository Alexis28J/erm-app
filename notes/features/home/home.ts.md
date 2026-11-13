# COMMENTI

```TYPESCRIPT
export class Home {
  
  protected languageService = inject(LanguageService);
  // protected è un modificatore di accesso che permette alla proprietà di essere accessibile all'interno della classe e delle classi derivate, ma non dall'esterno.
  // A differenza di private, protected permette l'accesso anche alle classi derivate. Ad esempio, se un componente estende questa classe, potrà accedere a languageService.

}
```