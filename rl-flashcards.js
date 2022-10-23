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
            "deck": {}
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
        deck.forEach(this.loadSection);

    }

    loadSection(section, section_index) {
        section.questions.forEach(this.loadQuestion);
    } 

    loadQuestion(question, question_index, section_index) {

    }
}