class RLFlashcards {
    constructor() {
        this.data = new modelJSON(this);
        this.view = new viewCardline(this);
        this.time = Date.now();
    }

    init() {
        this.data.loadData();
        this.view.buildSite(this.data.getDeck(), this.data.getSettings());
        this.view.openGreeting();
    }

    getTime() {
        let to_time = Date.now();

        let since_time = new Date (to_time - this.time);

        return since_time;
    }

    setTime() {
        this.time = Date.now();
    }
}

class modelJSON {
    constructor(controller) {
        this.controller = controller;
        this.store = {
            "settings":{},
            "user":{"active_section":""},
            "deck": []
        }
    }

    loadData() {
        for (let section of this.store.deck) {
            section.questions = section.questions.sort((a, b) => 0.5 - Math.random());
            section.last_question = section.questions.length-1;
            section.last_section = this.store.deck.length-1;
        }

    }

    shuffleQuestions() {
        for (let section of this.store.deck) {
            section.questions = section.questions.sort((a, b) => 0.5 - Math.random());
        }
    }

    addSection(section) {
        this.store.deck.push(section);
    }
    
    addSettings(new_settings) {
        this.store.settings = new_settings;
    }

    getUser(target) {
        if (target) {
            return this.store.user[target];
        }
        else {
            return this.store.user;
        }
    }

    getDeck() {
        return this.store.deck;
    }

    getSettings(target) {
        if (target) {
            return this.store.settings[target];
        }
        else {
            return this.store.settings;
        }
    }

    setUser(target, value) {
        this.store.user[target] = value;
    }

    setSetting(target, value) {
        this.store.settings[target] = value;
    }

}

class viewCardline {
    constructor(controller) {
        this.controller = controller;
        this.data = controller.data;
        this.site= {};
        this.site.body = document.querySelector("body");
        this.site.container = document.querySelector(".rl_flashcards");
        this.site.modals = {};
        this.site.toast;
        this.site.toasts = {}
    }


/**************************
 * 
 *  Funtioner för att bygga HTML-element
 * 
 * ********************** */    

    buildSite(deck, settings) { //Meta som anropar de andra byggfunktionerna i ordning

        let setup = {
            "id":"site_greeting",
            "text":settings.greeting,
            "buttons":[
                {
                    "text":"Starta testet!",
                    "type":"success",
                    "action": () => { this.startTimer(); this.site.toasts.timer.show(); this.openSection("s0", "site_greeting")}
                }
            ]
        };
        if (settings.title) { setup.title = settings.title; }
        if (settings.image) { setup.image = settings.image; }
        this.buildModal(setup);
        setup = undefined;

        setup = {
            "id":"site_fail",
            "text":settings.fail,
            "type":"danger",
            "buttons":[
                {
                    "text":"Försök igen",
                    "type":"danger",
                    "action": () => { this.restartSection() }
                }
            ]
        };
        if (settings.title) { setup.title = settings.title; }
        this.buildModal(setup);
        setup = undefined;


        setup = {
            "id":"site_done",
            "text":settings.done,
            "type":"success"
        };
        if (settings.title) { setup.title = settings.title; }
        this.buildModal(setup);
        setup = undefined;

        this.buildDeck(deck);

        this.buildToastContainer();

        setup = {
            "id":"timer",
            "title":"TID",
            "options":{autohide:false}
        };
        this.buildToast(setup);
    }

/*************
 *  Bygger Modals
 * ********* */   

    buildModal(setup) {
        let modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.setAttribute("id", setup.id);

        let modal_dialog = document.createElement("div");
        modal_dialog.classList.add("modal-dialog","modal-dialog-centered");
        

        let modal_content = document.createElement("div");
        modal_content.classList.add("modal-content","shadow");
        if (setup.type) {
            modal_content.classList.add("text-bg-"+ setup.type);
        }
        
        if (setup.title) {
            let modal_header = document.createElement("div");
            modal_header.classList.add("modal-header");
            modal_header.innerHTML=setup.title;
            modal_content.append(modal_header);
        }

        if (setup.image) {
            let modal_image  = document.createElement("img");
            modal_image.classList.add("card-img");
            modal_image.setAttribute("src",setup.image);
            
            modal_content.append(modal_image);
        }

        
        let modal_body= document.createElement("div");
        modal_body.classList.add("modal-body");
        modal_body.innerHTML=setup.text || "";
        modal_content.append(modal_body);

        if (setup.buttons) {
            let modal_buttons= document.createElement("div");
            modal_buttons.classList.add("list-group", "list-group-flush");

            for (let button of setup.buttons) {
                let modal_button = document.createElement("button");
                modal_button.classList.add("list-group-item","list-group-item-action","list-group-item-"+ button.type,"text-center");
                modal_button.innerHTML = button.text;
                modal_button.onclick = event => button.action();
                modal_buttons.append(modal_button);
            }
            modal_content.append(modal_buttons);
        }

      
        modal_dialog.append(modal_content);
        modal.append(modal_dialog);

        this.site.body.append(modal);
        this.site.modals[setup.id] = new bootstrap.Modal("#"+ setup.id, {backdrop:false});
    }


    buildDeck(deck) { //Metafunktion som anropar byggfunktioner för alla sections
        for (let [index, section] of deck.entries()) {
            this.buildSection(section, index)
        }
    }

    buildSection(section, section_index) { //Bygger första modal för varje section + anropar byggfunktionen för varje fråga

        let modal_id = "s" + section_index;
        
        let setup = {
            "id":modal_id,
            "text":section.text,
            "buttons":[
                {
                    "text":"Starta frågorna",
                    "type":"success",
                    "action": () => { this.openQuestion("s"+ section_index +"q0", modal_id )}
                }
            ]
        };
        if (section.title) { setup.title = section.title; }
        if (section.image) { setup.image = section.image; }
        this.buildModal(setup);

        
        for (let [index, question] of section.questions.entries()) {
            if (index == section.last_question) {
                if (section_index == section.last_section) {
                    this.buildQuestion(question, index, section_index,"site_done");
                }
                else {
                    let next_section = section_index + 1;
                    this.buildQuestion(question, index, section_index,"s" + next_section);
                }
            }
            else {
                let question_index = index + 1;
                this.buildQuestion(question, index, section_index,"s"+section_index+"q"+question_index);
            }
            
        }

        return modal_id;
    } 

    buildQuestion(question, question_index, section_index, next_index) { //Bygger modal för varje fråga
        let modal_id = "s" + section_index + "q" + question_index;

        let setup = {
            "id":modal_id,
            "text":question.text,
            "buttons":[
                {
                    "text":"Starta frågorna",
                    "type":"success",
                    "action": () => { this.openQuestion("s"+ section_index +"q0", modal_id )}
                }
            ]
        };
        if (question.title) { setup.title = question.title; }
        if (question.image) { setup.image = question.image; }
        


        let button_array = [];

        for (let answer of question.correct_answer) {
            let button = {"type":"primary"};
            button.text = answer;
            if (next_index == "site_done") {
                button.action = () => this.openDone(modal_id);
            }
            else if (next_index.length < 4) {
                button.action = () =>  this.openSection(next_index,modal_id);
            }

            else {
                button.action = () => this.openQuestion(next_index,modal_id);
            }
            button_array.push(button); 
        }

        for (let answer of question.wrong_answer) {
            let button = {"type":"primary"};
            button.text = answer;
            button.action = () => this.openFail(modal_id);
            button_array.push(button); 
        }

        button_array = button_array.sort((a, b) => 0.5 - Math.random());
        setup.buttons = button_array;
        
        this.buildModal(setup);

    }

/*************
 *  Bygger övriga element
 * ********* */   

    buildToastContainer() { //Bygger en container för toasts
        let toasts = document.createElement("div");
        toasts.classList.add("toast-container","position-fixed", "bottom-0", "end-0","p-3");
        toasts.setAttribute("id", "toasts")

        this.site.body.append(toasts);
        this.site.toast = toasts;

    }

    buildToast(setup) {
        let toast = document.createElement("div");
        toast.classList.add("toast","shadow");
        if (setup.type) {
            toast.classList.add("text-bg-"+ setup.type);
        }

        if (!setup.id) { 
            let adhoc_id = "toast" + Math.floor(Math.random() * 100) + 100;
            setup.id = adhoc_id;
        }
        toast.setAttribute("id", setup.id);

        if (setup.title) {
            let toast_header = document.createElement("div");
            toast_header.classList.add("toast-header");
            toast_header.innerHTML = setup.title;
            toast.append(toast_header);
        }


        let toast_body = document.createElement("div");
        toast_body.classList.add("toast-body");
        toast_body.innerHTML = setup.text;
        toast.append(toast_body);

        this.site.toast.append(toast);
        this.site.toasts[setup.id] = new bootstrap.Toast("#"+ setup.id, setup.options);

        return this.site.toasts[setup.id];
    }

    

/**************************
 * 
 *  Funtioner för att öppna Modals
 * 
 * ********************** */ 

    openGreeting(close_id) { //Körs när sidan laddas
        if (close_id) {
            this.site.modals[close_id].hide();
        }
        this.site.modals["site_greeting"].show();
    }

    openSection(modal_id, close_id) { //Körs när en ny section börjar
        if (close_id) {
            this.site.modals[close_id].hide();
        }

        this.data.setUser("active_section", modal_id);

        this.site.modals[modal_id].show();
    }

    openQuestion(modal_id, close_id) { //Körs när en ny fråga öpnar
        if (close_id) {
            this.site.modals[close_id].hide();
        }



        this.site.modals[modal_id].show();
    }

    openFail(close_id) { //Körs när fel svar ges
        if (close_id) {
            this.site.modals[close_id].hide();
        }
        
        this.controller.data.shuffleQuestions();
        this.destroyDeck();
        this.buildDeck(this.controller.data.store.deck, this.controller.data.store.settings);
        this.site.modals["site_fail"].show();
    }

    restartSection() {
        this.openSection(this.data.getUser("active_section"), "site_fail");
    }

    openDone(close_id) { //Körs vid alla rätta svar
        this.stopTimer();
        if (close_id) {
            this.site.modals[close_id].hide();
        }
        this.site.modals["site_done"].show();
    }


/**************************
 * 
 *  Funktioner för att styra tidsräknaren
 * 
 * ********************** */ 

    startTimer() {
        this.controller.setTime();
        this.timer = setInterval(this.updateTimer, 100,this);
    }

    updateTimer(scope) {
        let time = scope.controller.getTime().getSeconds();
        document.querySelector("#timer > .toast-body").innerHTML = time;
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    resumeTimer() {
        this.timer = setInterval(this.updateTimer, 100,this);
    }

/**************************
 * 
 *  Övriga funktioner
 * 
 * ********************** */ 

    destroyDeck() { //Raderar alla element med klassen deck
        for (let card of document.querySelectorAll(".deck")) {
            card.remove();
        }
    }

}