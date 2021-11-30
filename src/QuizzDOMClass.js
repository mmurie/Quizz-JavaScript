import { GREEN, RED, GRAY, addElement } from "./utils.js";
import Quizz from "./QuizzClass.js";
import {QuizzState} from "./QuizzClass.js";

/*
Classe permettant de décrire les comportements nécessaires concernant le DOM
quizz : une instance de QuizzClasse
scoreElement : l'élément du DOM permettant d'afficher le score
*/
export default class QuizzDOM { 
    constructor(quizz) {
        this.quizz = quizz;
        this.scoreElement = null;
    }

    /*
    Fonction permettant d'afficher la question courante.
    On ajoute notamment un timer et un event listener pour le bouton submit.
    */
    createQuestion() {
        const number = this.quizz.currentQuestion;
         if (number>this.quizz.questions.length) return;
        const question = this.quizz.questions[number-1];

        const titleTextElement = addElement("h2", {"innerText": "Question n°" + number}, this.scoreElement);
        titleTextElement.classList.add("questionTxt");
        const questionTextElement = addElement("div", {"innerHTML": question.question}, this.scoreElement);
        questionTextElement.classList.add("questionTxt");
        addElement("input", {"id": "question" + number, "type": "text"}, this.scoreElement);
        const btn = addElement("button", {"id": "submit", "innerText": "Submit"}, this.scoreElement);
    
        const timeForEachQuestion = 30;
        const timerElement = addElement("b", {"id": "timer", "innerHTML": this.timerText(timeForEachQuestion)}, this.scoreElement);
    
        if (!timerElement) return;
        let intervalId;
        
        //Lancement du timer (si l'on est bien dans l'état ANSWERING)
        if (this.quizz.state == QuizzState.ANSWERING) intervalId = this.timer(timeForEachQuestion, timerElement);
    
        if (!btn) return;
        
        const caller = this;
        /*
        Event listener en cas de clic sur le bouton submit
        */
        btn.addEventListener("click", (e) => {
            const inputText = document.getElementById("question" + caller.quizz.currentQuestion);
            if (!inputText) return;
            let answer = inputText.value;
            if (caller.quizz.checkAnswer(answer)) {
                caller.colorText(titleTextElement, GREEN);
                caller.colorText(questionTextElement, GREEN);
                caller.scoreElement.innerText = caller.updateScoreText();
                inputText.disabled = true;
                document.body.removeChild(btn);
                caller.createQuestion();
            }else{
                caller.colorText(titleTextElement, RED);
                caller.colorText(questionTextElement, RED);
                inputText.disabled = true;
                btn.disabled = true;
            }
            
            caller.saveQuizz(caller);
            caller.colorText(timerElement);
            if (intervalId) clearInterval(intervalId);
        });

        if (this.quizz.state == QuizzState.LOST) {
            this.disableInputs();
            this.colorText(timerElement);
        }
    }

    /*
    Fonction permettant de sauvegarder l'état courant du quizz en utilisant le local storage.
    On sauvegarde dans une chaîne de caractères décrivant un objet JSON toutes les questions du quizz, la question courante, et l'état du quizz
    */
    saveQuizz(caller = this) {
        const json = {
            "questions": caller.quizz.questions,
            "currentQuestion": caller.quizz.currentQuestion,
            "state": caller.quizz.state
        };
        localStorage.setItem("sauvegarde_quizz", JSON.stringify(json));
    }

    /*
    Fonction permettant de renvoyer la chaîne de caractères correspondant au score (afin de le mettre à jour)
    Le score est égal au numéro de la question courante - 1, soit le nombre de bonnes réponses.
    */
    updateScoreText() {
        return "Score: " + (this.quizz.currentQuestion-1);
    }
    
    /*
    Fonction permettant de renvoyer la chaîne de caractères pour le texte du timer de la question (afin de le mettre à jour)
    */
    timerText(time) {
        return " &#9201; Time: " + (time < 10 ? "0" : "") + time + "s";
    }

    /*
    Fonction permettant de colorer le texte d'un élément donné, gris par défaut.
    */
    colorText(element, color=GRAY) {
        element.style.color = color;
        element.classList.add("colored");
    }

    /*
    Fonction permettant de désactiver tous les inputs. On colore également en rouge le texte les questions qui sont maintenant désactivées
    */
    disableInputs() {
        const textInputs = document.querySelectorAll("input[type='text']");
        const btns = document.querySelectorAll("button");
        const questionTxts = document.querySelectorAll(".questionTxt:not(.colored)");
        textInputs.forEach(el => {
            el.disabled = true;
        });
        btns.forEach(el => {
            el.disabled = true;

        });

        questionTxts.forEach(el => {
            this.colorText(el, RED);
        });
    }

    /*
    Fonction permettant de gérer le timer de la question courante. Le quizz est perdu quand le temps tombe à 0.
    time: le nombre de secondes restantes
    timerElement: l'élément du DOM correspondant au texte du timer
    */
    timer(time, timerElement) {
        const caller = this;
        let intervalId = window.setInterval(function() {
            time--;
            timerElement.innerHTML = caller.timerText(time);
            if (time <= 0) {
                time = 0;
                caller.quizz.state = QuizzState.LOST;
                caller.colorText(timerElement);
                caller.disableInputs();
                caller.saveQuizz(caller);
                clearInterval(intervalId);
            }
        }, 1000);
        return intervalId;
    }

    /*
    Fonction permettant d'initialiser l'interface utilisateur pour charger une partie
    */
    loadSaveUi() {
        const titleTextElement = addElement("h2", {"innerText": "Continue from last save ?"});
        const btnY = addElement("button", {"id": "yesBtn", "innerText": "Yes"});
        btnY.style.marginRight = "16px";
        const btnN = addElement("button", {"id": "noBtn", "innerText": "No"});

        const caller = this;
        
        /*
        Fonction permettant d'enlever l'interface utilisateur pour charger une partie. On lance le quizz ensuite
        */
        const removeLoadSaveUi = function() {
            titleTextElement.remove();
            btnY.remove();
            btnN.remove();
            caller.loadQuizzUi();
        };

        /*
        Listener pour le bouton "Yes", si l'on souhaite charger la partie sauvegardée dans le localStorage.
        On vérifie que les valeurs requises de l'objet JSON sont bien présentes, et si oui on met à jour l'instance de QuizzClass.
        */
        btnY.addEventListener("click", (e) => {
            const savedQuizz = JSON.parse(localStorage.getItem("sauvegarde_quizz"));
            if (savedQuizz.questions && savedQuizz.currentQuestion && savedQuizz.state) {
                caller.quizz.questions = savedQuizz.questions;
                caller.quizz.currentQuestion = savedQuizz.currentQuestion;
                caller.quizz.state = savedQuizz.state;
            }
            removeLoadSaveUi();
        });

        /*
        Listener pour le bouton "No", si l'on ne veut pas charger la partie
        */
        btnN.addEventListener("click", (e) => {
            removeLoadSaveUi();
        });
    }

    /*
    Fonction permettant d'initialiser l'interface utilisateur pour une nouvelle partie
    */
    loadQuizzUi() {
        this.scoreElement = addElement("h3", {"id": "score", "innerText": this.updateScoreText()});
        this.createQuestion();
    }

    /*
    Fonction à exécuter pour initialiser le quizz.
    Soit on demande au joueur s'il veut charger une ancienne partie sauvegardée dans le localStorage, soit on en commence une nouvelle
    */
    init() {
        if (!localStorage.getItem("sauvegarde_quizz")) {
            this.loadQuizzUi();
        }else{
            this.loadSaveUi();
        }       
    }
}