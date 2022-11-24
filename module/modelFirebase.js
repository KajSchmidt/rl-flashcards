class modelFirebase {
    constructor(controller) {
        if (controller) { this.controller = controller; }
        this.store = {
            "settings":{},
            "user":{},
            "deck": []
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

    }

    register(controller) {
        this.controller = controller;
    }

    async loadData() {

        let {initializeApp} = await import("https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js");
        let { getDatabase, ref, get, child } = await import("https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js");

        const firebaseApp = initializeApp({ databaseURL: this.url });

        const db = ref(getDatabase(firebaseApp));
        const dbDeck = await get(child(db,'deck/')); 
        this.store.deck = dbDeck.val();

        const dbSettings = await get(child(db,'settings/')); 
        this.store.settings = dbSettings.val();

        return Promise.resolve();

    }

    shuffleSections() {
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