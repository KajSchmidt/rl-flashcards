class RLFlashcards {
    constructor() {
        this.data = new modelJSON(this);
        this.view = new viewCardline(this);
    }

    init() {
        this.view.loadDeck(this.data.store.deck);
    }
}

class modelJSON {
    constructor(controller) {
        this.controller = controller;
        this.store = {
            "settings":{},
            "user": {},
            "deck": []
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
    }

    loadDeck(deck) {
        //console.log("deck");
        for (let [index, section] of deck.entries()) {
            this.loadSection(section, index)
        }
    }

    loadSection(section, section_index) {
        //console.log("s"+ section_index);
        for (let [index, question] of section.questions.entries()) {
            this.loadQuestion(question, index, section_index)
        }
    } 

    loadQuestion(question, question_index, section_index) {
        let modal_id = "s" + section_index + "q" + question_index;

        let modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.setAttribute("id", modal_id);

        let modal_dialog = document.createElement("div");
        modal_dialog.classList.add("modal-dialog");
        

        let modal_content = document.createElement("div");
        modal_content.classList.add("modal-content");
        
        
        let modal_header = document.createElement("div");
        modal_header.classList.add("modal-header");
        
        let modal_body= document.createElement("div");
        modal_body.classList.add("modal-body");

        let modal_buttons= document.createElement("div");
        modal_buttons.classList.add("modal-body","list-group");

        for (let answer of question.correct_answer) {
            let button = document.createElement("button");
            button.classList.add("btn", "btn-primary", "list-group-item");
            button.innerHTML = answer;
            modal_buttons.append(button);
        }

        for (let answer of question.wrong_answer) {
            let button = document.createElement("button");
            button.classList.add("btn", "btn-primary");
            button.innerHTML = answer;
            modal_body.append(button);
        }
        
        let modal_footer = document.createElement("div");
        modal_footer.classList.add("modal-footer");

        modal_content.append(modal_header);
        modal_content.append(modal_body);
        modal_content.append(modal_footer);
        modal_dialog.append(modal_content);
        modal.append(modal_dialog);

        this.site.body.append(modal);


        return modal_id;

    }

    openQuestion(id) {
        let modal = new bootstrap.Modal("#"+id);
        modal.show();
    }
}