# Rogue Lite Flashcards

## Dokumentation

### Datastrukturer

#### Data Store

{
    "settings": {
        "title":"",
        "image":"",
        "greeting":"",
        "fail":"",
        "done":""
    },
    "user": {
        "name":"",
        "image":"",
        "best_time":[],
        "active_deck":"",
        "active_section":""
    },
    "decks": [
        {
            "title":"",
            "image":"",
            "greeting":"",
            "fail":"",
            "done":"",
            "sections": [
                {
                    "title": "",
                    "text": "",
                    "image":"",
                    "questions": [
                        {
                            "title":"",
                            "text":"",
                            "image":"",
                            "correct_answers":["",""],
                            "wrong_answers":["",""]
                        }
                    ]
                }
            ]
        }
    ]
}

#### Modal Setup

{
    "id":"",
    "title":"",
    "image":"",
    "text":"",
    "type":"",
    "size":""
    "buttons":[
        {
            "text":"",
            "type":"",
            "action":""
        }
    ],
    options:{}
}

#### Toast Setup
{
    "id":"",
    "title":"",
    "text":"",
    "type":""
    "options":{}
}
