class RLFlashcards {
    constructor() {
        this.data = new modelJSON(this);
        this.view = new viewCardline(this);
    }

    init() {

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
    }

    loadDeck(deck) {
        console.log("deck");
        for (let [index, section] of deck.entries()) {
            this.loadSection(section, index)
        }
    }

    loadSection(section, section_index) {
        console.log("s"+ section_index);
        for (let [index, question] of section.questions.entries()) {
            this.loadQuestion(question, index, section_index)
        }
    } 

    loadQuestion(question, question_index, section_index) {
        console.log("q"+ question_index);

    }
}