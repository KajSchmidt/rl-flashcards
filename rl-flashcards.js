class RLFlashcards {
    constructor() {
        this.data = new modelJSON(this);
        this.view = new viewCardline(this);
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

}

class viewCardline {
    constructor(controller) {
        this.controller = controller;
    }

    loadDeck() {

    }

    loadSection() {

    } 

    loadQuestion() {
        
    }
}