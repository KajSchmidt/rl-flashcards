class modelFirebase {
    constructor(controller) {
        if (controller) { this.controller = controller; }
        this.store = {
            "settings":{},
            "user":{},
            "decks": {}
        }

        if (!localStorage.user) {
            this.store.user = {
                "name":"Anonym",
                "image": "https://www.womensfestival.eu/wp-content/uploads/2016/04/image-placeholder.jpg",
            }
        }
        else {
            this.store.user = JSON.parse(localStorage.user);
        } 

        if (!this.store.user.rlf_best_times) { this.store.user.rlf_best_times = {}; }

    }

    register(controller) {
        this.controller = controller;
    }

    async loadData() {

        let {initializeApp} = await import("https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js");
        let { getDatabase, ref, get, child } = await import("https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js");

        const firebaseApp = initializeApp({ databaseURL: this.url });

        const db = ref(getDatabase(firebaseApp));
        const dbDecks = await get(child(db,'decks/')); 
        this.store.decks = dbDecks.val();

        this.changeDeck(Object.keys(this.store.decks)[0]); //Startar automatiskt på första deck i listan
        
        const dbSettings = await get(child(db,'settings/')); 
        this.store.settings = dbSettings.val();

        return Promise.resolve();

    }

    changeDeck(deck_id) {
        this.setUser("rlf_active_deck", deck_id);
        this.store.deck = this.store.decks[deck_id];
    }

    shuffleQuestions(deck) {
        if (!deck) { deck = this.getUser("rlf_active_deck"); }
        for (let section of this.store.decks[deck].sections) {
            section.questions = section.questions.sort((a, b) => 0.5 - Math.random());
            section.last_question = section.questions.length-1;
            section.last_section = this.store.decks[deck].sections.length-1;
        }
    }
    
    getUser(target) { 
        if (target) {
            if (!this.store.user[target]) { return false; }
            else { return this.store.user[target]; }
        }
        else {
            return this.store.user;
        }
    }

    getDeck(deck_id) {
        if (!deck_id) { deck_id = this.getUser("rlf_active_deck"); }
        return this.store.decks[deck_id];
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
        localStorage.user = JSON.stringify(this.store.user);
    }

    setSetting(target, value) {
        this.store.settings[target] = value;
    }

    clearUser() {
        delete this.store.user;
        this.store.user = {
            "name":"Anonym",
            "image": "https://www.womensfestival.eu/wp-content/uploads/2016/04/image-placeholder.jpg"
        }
        localStorage.removeItem("user");
    }

}