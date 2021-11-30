import Quizz from "./QuizzClass.js";
import QuizzDOM from "./QuizzDOMClass.js";

window.addEventListener("DOMContentLoaded", () => {
    //Tableau d'objets JSON permettant de décrire les questions du quizz
    const questions = [
        {
            "question": "Eighteen thousandths, written as a decimal, is:",
            "correct_answer": "0.0018"
        },
        {
            "question": "The next number in the sequence <b>1, 3, 6, 10, </b> is:",
            "correct_answer": "15"
        },
        {
            "question": "Is this quizz interesting ?",
            "correct_answer": "yes"
        }
    ];

    const quizz = new Quizz(questions);
    const quizzDOM = new QuizzDOM(quizz);
    quizzDOM.init();
});
