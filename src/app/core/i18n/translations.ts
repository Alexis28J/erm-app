export const translations = {

    /////////////////////// ITALIANO //////////////////////////
    it: {
        // HOME
        home: {
            navbar: { personalArea: 'Area personale' },
            dashboard: {
                title: 'Gestione Rimborso Spese',
                text1: 'Questa sezione consente ai dipendenti di gestire in modo efficiente le proprie richieste di rimborso spese.',
                text2: 'I dipendenti possono inoltrare richieste, mentre il dipartimento delle risorse umane può esaminarle e approvarle.',
                text3: 'Ci auguriamo che questo sistema sia vantaggioso sia per i dipendenti che per il dipartimento delle risorse umane.',
                text4: 'Grazie per utilizzare il nostro sistema e buona giornata!',
                login: 'Accedi'
            }
        },
        // EMPLOYEE
        employee: {
            navbar: { exit: 'Esci' },
            menu: {
                myRequests: 'Le mie richieste',
                newRequest: 'Nuova richiesta'
            },
            dashboard: {
                title: 'Area dipendenti',
                welcome: 'Benvenuto/a, caro/a',
                text1: 'Qui può gestire le sue richieste di rimborso.',
                text2: 'Clicchi in "Nuova richiesta" per crearne una nuova, oppure in "Le mie richieste" per visualizzare quelle già inviate.',
                text3: 'Inoltre, se preferisce, può navigare attraverso le diverse sezioni usando il menu in alto (▾).',
                text4: 'Grazie per utilizzare il nostro sistema e vi auguriamo una giornata produttiva!',
                newRequest: 'Nuova richiesta',
                myRequests: 'Le mie richieste'
            }
        },
        // HR
        hr: {
            navbar: { exit: 'Esci' },
            menu: {
                requestList: 'Elenco richieste',
                EmployeeList: 'Elenco dipendenti',
                settings: 'Impostazioni'
            },
            dashboard: {
                title: 'Area HR',
                welcome: 'Benvenuto/a, caro/a',
                text1: 'In quest\'area potrai esaminare e approvare le richieste di rimborso spese.',
                text2: 'Puoi gestire le richieste e i dipendenti tramite le azioni qui sotto.',
                text3: 'Inoltre, se preferisci, puoi navigare tra le diverse sezioni tramite il menu qui sopra (▾).',
                text4: 'Grazie per utilizzare il nostro sistema e vi auguriamo una giornata produttiva!',
                requestList: 'Elenco richieste',
                employeeList: 'Elenco dipendenti'
            }
        }
    },

    //////////////////////// INGLESE /////////////////////////////
    en: {
        // HOME
        home: {
            navbar: { personalArea: 'Personal Area' },
            dashboard: {
                title: 'Expense Reimbursement Management',
                text1: 'This section allows employees to manage their expense reimbursement requests efficiently.',
                text2: 'Employees can submit requests, while the HR department can review and approve them.',
                text3: 'We hope this system will be beneficial for both employees and the HR department.',
                text4: 'Thank you for using our system and have a great day!',
                login: 'Login'
            }
        },
        // EMPLOYEE
        employee: {
            navbar: { exit: 'Exit' },
            menu: {
                myRequests: 'My Requests',
                newRequest: 'New Request'
            },
            dashboard: {
                title: 'Employee Area',
                welcome: 'Welcome, dear',
                text1: 'Here you can manage your reimbursement requests.',
                text2: 'Click on "New Request" to create a new one, or on "My Requests" to view the ones already submitted.',
                text3: 'Also, if you prefer, you can navigate through the different sections using the top menu (▾).',
                text4: 'Thank you for using our system and we wish you a productive day!',
                newRequest: 'New Request',
                myRequests: 'My Requests'
            }
        },
        // HR
        hr: {
            navbar: { exit: 'Exit' },
            menu: {
                requestList: 'Request List',
                EmployeeList: 'Employee List',
                settings: 'Settings'
            },
            dashboard: {
                title: 'HR Area',
                welcome: 'Welcome, dear',
                text1: 'In this area you will be able to review and approve expense reimbursement requests. ',
                text2: 'You can manage requests and employees through the actions below.',
                text3: 'Also, if you prefer, you can navigate through the different sections using the top menu (▾).',
                text4: 'Thank you for using our system and we wish you a productive day!',
                requestList: 'Request List',
                employeeList: 'Employee List'
            }
        }
    }
} as const;



//  VS Code Counter: 98 code lines (13/11/2026)
