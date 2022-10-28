class RLFlashcards {
    constructor() {
        this.data = new modelJSON(this);
        this.view = new viewCardline(this);
        this.time = Date.now();
    }

    init() {
        this.data.loadData();
        this.view.buildSite(this.data.store.deck, this.data.store.settings);
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
            "settings":{
                "title":"Titel",
                "greeting":"Välkommen",
                "fail":"Tyvärr!",
                "done":"Grattis!",
                "restart_at":"section"
            },
            "user": {},
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

}

class viewCardline {
    constructor(controller) {
        this.controller = controller;
        this.site= {};
        this.site.body = document.querySelector("body");
        this.site.container = document.querySelector(".rl_flashcards");
        this.site.modals = {};
        this.site.timer = "";
        this.timer = "";
    }


/**************************
 * 
 *  Funtioner för att bygga HTML-element
 * 
 * ********************** */    

    buildSite(deck, settings) { //Meta som anropar de andra byggfunktionerna i ordning
        this.buildGreeting(settings);
        this.buildFail(settings);
        this.buildDone(settings);
        this.buildDeck(deck, settings);
        this.buildTimer();
    }

/*************
 *  Bygger Modals
 * ********* */   

    buildGreeting(settings) {  //Bygger första modal som öppnas när sidan öppnas
        let modal_id = "site_greeting";

        let modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.setAttribute("id", modal_id);

        let modal_dialog = document.createElement("div");
        modal_dialog.classList.add("modal-dialog","modal-dialog-centered");
        

        let modal_content = document.createElement("div");
        modal_content.classList.add("modal-content");
        
        
        let modal_header = document.createElement("div");
        modal_header.classList.add("modal-header");
        
        let modal_body= document.createElement("div");
        modal_body.classList.add("modal-body");
        modal_body.innerHTML=settings.greeting;

        let modal_footer = document.createElement("div");
        modal_footer.classList.add("modal-footer");
        
        let modal_btn_start = document.createElement("button");
        modal_btn_start.classList.add("btn", "btn-primary");
        modal_btn_start.onclick = event => { this.startTimer(); this.openQuestion("s0", modal_id)};
        modal_btn_start.innerHTML = "Start"
        modal_footer.append(modal_btn_start);


        modal_content.append(modal_header);
        modal_content.append(modal_body);
        modal_content.append(modal_footer);
        modal_dialog.append(modal_content);
        modal.append(modal_dialog);

        this.site.body.append(modal);
        this.site.modals[modal_id] = new bootstrap.Modal("#"+modal_id, {backdrop:false});

        return modal_id;

    }

    buildFail(settings) { //Bygger modal som visas vid fel svar
        let modal_id = "site_fail";

        let modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.setAttribute("id", modal_id);

        let modal_dialog = document.createElement("div");
        modal_dialog.classList.add("modal-dialog","modal-dialog-centered");
        

        let modal_content = document.createElement("div");
        modal_content.classList.add("modal-content","text-bg-danger");
        
        
        let modal_header = document.createElement("div");
        modal_header.classList.add("modal-header","text-bg-danger");
        
        let modal_body= document.createElement("div");
        modal_body.classList.add("modal-body","text-bg-danger");
        modal_body.innerHTML= settings.fail;

        let modal_footer = document.createElement("div");
        modal_footer.classList.add("modal-footer","text-bg-danger");

        let modal_btn_start = document.createElement("button");
        modal_btn_start.classList.add("btn", "btn-primary");
        modal_btn_start.onclick = event => this.openQuestion("s0", modal_id);
        modal_btn_start.innerHTML = "Start"
        modal_footer.append(modal_btn_start);
        
        

        modal_content.append(modal_header);
        modal_content.append(modal_body);
        modal_content.append(modal_footer);
        modal_dialog.append(modal_content);
        modal.append(modal_dialog);

        this.site.body.append(modal);
        this.site.modals[modal_id] = new bootstrap.Modal("#"+modal_id, {backdrop:false});

        return modal_id;
    }

    buildDone(settings) { //Bygger modal som visas vid alla rätt svar
        let modal_id = "site_done";

        let modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.setAttribute("id", modal_id);

        let modal_dialog = document.createElement("div");
        modal_dialog.classList.add("modal-dialog","modal-dialog-centered");
        

        let modal_content = document.createElement("div");
        modal_content.classList.add("modal-content");
        
        
        let modal_header = document.createElement("div");
        modal_header.classList.add("modal-header");
        
        let modal_body= document.createElement("div");
        modal_body.classList.add("modal-body");
        modal_body.innerHTML=settings.done;

        let modal_footer = document.createElement("div");
        modal_footer.classList.add("modal-footer");

        let modal_btn_start = document.createElement("button");
        modal_btn_start.classList.add("btn", "btn-primary");
        modal_btn_start.onclick = event => this.openQuestion("s0", modal_id);
        modal_btn_start.innerHTML = "Start"
        modal_footer.append(modal_btn_start);

        modal_content.append(modal_header);
        modal_content.append(modal_body);
        modal_content.append(modal_footer);
        modal_dialog.append(modal_content);
        modal.append(modal_dialog);

        this.site.body.append(modal);
        this.site.modals[modal_id] = new bootstrap.Modal("#"+modal_id, {backdrop:false});

        return modal_id;
    }

    buildDeck(deck, settings) { //Metafunktion som anropar byggfunktioner för alla sections
        for (let [index, section] of deck.entries()) {
            this.buildSection(section, index)
        }
    }

    buildSection(section, section_index, settings) { //Bygger första modal för varje section + anropar byggfunktionen för varje fråga
        
        let modal_id = "s" + section_index;

        let modal = document.createElement("div");
        modal.classList.add("modal", "fade","deck");
        modal.setAttribute("id", modal_id);

        let modal_dialog = document.createElement("div");
        modal_dialog.classList.add("modal-dialog","modal-dialog-centered");
        

        let modal_content = document.createElement("div");
        modal_content.classList.add("modal-content");
        
        
        let modal_header = document.createElement("div");
        modal_header.classList.add("modal-header");
        let modal_header_title = document.createElement("h5");
        modal_header_title.innerHTML = section.title || "";
        modal_header.append(modal_header_title);
        
        let modal_body= document.createElement("div");
        modal_body.classList.add("modal-body");
        modal_body.innerHTML= section.text || "";

        let modal_footer = document.createElement("div");
        modal_footer.classList.add("modal-footer");
        let modal_btn_start = document.createElement("button");
        modal_btn_start.classList.add("btn", "btn-primary");
        modal_btn_start.onclick = event => this.openQuestion("s"+ section_index +"q0", modal_id );
        modal_btn_start.innerHTML = "Start"
        modal_footer.append(modal_btn_start);

        modal_content.append(modal_header);
        modal_content.append(modal_body);
        modal_content.append(modal_footer);
        modal_dialog.append(modal_content);
        modal.append(modal_dialog);

        this.site.body.append(modal);
        this.site.modals[modal_id] = new bootstrap.Modal("#"+modal_id, {backdrop:false});
        
        for (let [index, question] of section.questions.entries()) {
            if (index == section.last_question) {
                if (section_index == section.last_section) {
                    this.buildQuestion(question, index, section_index,"site_done", settings);
                }
                else {
                    let next_section = section_index + 1;
                    this.buildQuestion(question, index, section_index,"s" + next_section, settings);
                }
            }
            else {
                let question_index = index + 1;
                this.buildQuestion(question, index, section_index,"s"+section_index+"q"+question_index, settings);
            }
            
        }

        return modal_id;
    } 

    buildQuestion(question, question_index, section_index, next_index, settings) { //Bygger modal för varje fråga
        let modal_id = "s" + section_index + "q" + question_index;

        let modal = document.createElement("div");
        modal.classList.add("modal", "fade","deck");
        modal.setAttribute("id", modal_id);

        let modal_dialog = document.createElement("div");
        modal_dialog.classList.add("modal-dialog","modal-dialog-centered");
        

        let modal_content = document.createElement("div");
        modal_content.classList.add("modal-content");
        
        
        let modal_header = document.createElement("div");
        modal_header.classList.add("modal-header");
        let modal_header_title = document.createElement("h5");
        modal_header_title.innerHTML = question.title || ""; 
        modal_header.append(modal_header_title);
        
        let modal_body= document.createElement("div");
        modal_body.classList.add("modal-body");
        modal_body.innerHTML = question.text || "";

        let modal_buttons= document.createElement("div");
        modal_buttons.classList.add("list-group", "list-group-flush");

        let button_array = [];

        for (let answer of question.correct_answer) {
            let button = document.createElement("button");
            button.classList.add("list-group-item");
            button.innerHTML = answer;
            if (next_index == "site_done") {
                button.onclick = event => this.openDone(modal_id);
            }
            else if (next_index.length < 4) {
                button.onclick = event => this.openSection(next_index,modal_id);
            }

            else {
                button.onclick = event => this.openQuestion(next_index,modal_id);
            }
            button_array.push(button); 
        }

        for (let answer of question.wrong_answer) {
            let button = document.createElement("button");
            button.classList.add("list-group-item");
            button.innerHTML = answer;
            button.onclick = event => this.openFail(modal_id);
            button_array.push(button); 
        }

        button_array = button_array.sort((a, b) => 0.5 - Math.random());
        for (let button of button_array) {
            modal_buttons.append(button);
        }
        
        let modal_footer = document.createElement("div");
        modal_footer.classList.add("modal-footer");

        modal_content.append(modal_header);
        modal_content.append(modal_body);
        modal_content.append(modal_buttons);
        modal_content.append(modal_footer);
        modal_dialog.append(modal_content);
        modal.append(modal_dialog);

        this.site.body.append(modal);
        this.site.modals[modal_id] = new bootstrap.Modal("#"+modal_id, {backdrop:false});

        return modal_id;

    }

/*************
 *  Bygger övriga element
 * ********* */   
    buildTimer() {
        let timer = document.createElement("div");
        timer.classList.add("text-bg-primary");
        timer.setAttribute("id", "timer");
        timer.innerHTML = 0;

        this.site.timer = timer;

        this.site.body.append(timer);
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
        this.site.modals[modal_id].show();
    }

    openQuestion(modal_id, close_id) { //Körs när en ny fråga öpnar
        if (close_id) {
            this.site.modals[close_id].hide();
        }
        this.site.modals[modal_id].show();
    }

    openFail(close_id) { //Körs när fel svar ges
        this.stopTimer();
        if (close_id) {
            this.site.modals[close_id].hide();
        }
        
        this.controller.data.shuffleQuestions();
        this.destroyDeck();
        this.buildDeck(this.controller.data.store.deck, this.controller.data.store.settings);
        this.site.modals["site_fail"].show();
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
        let time = scope.controller.getTime().getTime() / 1000;
        scope.site.timer.innerHTML = time;
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