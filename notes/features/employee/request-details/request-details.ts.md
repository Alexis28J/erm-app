# COMMENTI

```TYPESCRIPT
export class RequestDetails {

  // INIEZIONE DEI SERVIZI E RECUPERO DELL'ID DELLA RICHIESTA DI RIMBORSO
  private route = inject(ActivatedRoute); // ActivatedRoute è un servizio che fornisce informazioni sulla route attiva, inclusi i parametri della route
  private refundRequestService = inject(RefundRequestService);  // Servizio per interagire con le richieste di rimborso

  private requestId = this.route.snapshot.paramMap.get('id');  // utilizza il parametro 'id' della route per ottenere l'ID della richiesta di rimborso
  // snapshot è una proprietà di ActivatedRoute che rappresenta lo stato della route al momento dell'accesso, inclusi i parametri della route


  // CONVERSIONE DELL'OBSERVABLE IN SIGNAL
  request = toSignal<RefundRequest | null>(  // Converte l'Observable restituito dal servizio in un Signal, che è una rappresentazione reattiva dello stato della richiesta di rimborso
    // <RefundRequest | null> indica il tipo di valore che il Signal conterrà, in questo caso una richiesta di rimborso o null se non esiste
    this.refundRequestService   // Chiama il servizio per ottenere la richiesta di rimborso per l'ID specificato
      .getRequestById(this.requestId!),
    {
      initialValue: null  // Valore iniziale del Signal, utilizzato prima che l'Observable restituisca un valore
    }
  );

}

```