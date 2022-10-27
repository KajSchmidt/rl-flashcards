class RLFlashcards {
    constructor() {
        this.data = new modelJSON(this);
        this.view = new viewCardline(this);
    }

    init() {
        this.data.loadData();
        this.view.buildSite(this.data.store.deck, this.data.store.settings);
        this.view.openGreeting();
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
            section.last_question = section.questions.length-1;
            section.last_section = this.store.deck.length-1;
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
    }


    buildSite(deck, settings) {
        this.buildGreeting(settings);
        this.buildFail(settings);
        this.buildDone(settings);
        this.buildDeck(deck, settings);
    }

    buildGreeting(settings) {
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

    buildFail(settings) {
        let modal_id = "site_fail";

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
        modal_body.innerHTML= settings.fail;

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

    buildDone(settings) {
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

    buildDeck(deck, settings) {
        //console.log("deck");
        for (let [index, section] of deck.entries()) {
            this.buildSection(section, index)
        }
    }

    buildSection(section, section_index, settings) {
        
        let modal_id = "s" + section_index;

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
        modal_body.innerHTML= "Sektion " + section_index;

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

    buildQuestion(question, question_index, section_index, next_index, settings) {
        let modal_id = "s" + section_index + "q" + question_index;

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

        let modal_buttons= document.createElement("div");
        modal_buttons.classList.add("list-group", "list-group-flush");

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
            modal_buttons.append(button);
        }

        for (let answer of question.wrong_answer) {
            let button = document.createElement("button");
            button.classList.add("list-group-item");
            button.innerHTML = answer;
            button.onclick = event => this.openFail(modal_id);
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

    openGreeting(close_id) {
        if (close_id) {
            this.site.modals[close_id].hide();
        }
        this.site.modals["site_greeting"].show();
    }
m
    openSection(modal_id, close_id) {
        if (close_id) {
            this.site.modals[close_id].hide();
        }
        this.site.modals[modal_id].show();
    }

    openQuestion(modal_id, close_id) {
        if (close_id) {
            this.site.modals[close_id].hide();
        }
        this.site.modals[modal_id].show();
    }

    openFail(close_id) {
        if (close_id) {
            this.site.modals[close_id].hide();
        }
        this.site.modals["site_fail"].show();
    }

    openDone(close_id) {
        if (close_id) {
            this.site.modals[close_id].hide();
        }
        this.site.modals["site_done"].show();
    }
}