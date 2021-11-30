/*
Fichier contenant les tests. Ces tests ne se préoccupent pas du DOM.
*/

import {QuizzState} from "../src/QuizzClass.js";
import Quizz from "../src/QuizzClass.js";

let questions, quizz;

//Avant chaque test, on réinitialise le quizz
beforeEach(() => {
    //Tableau d'objets JSON permettant de décrire les questions du quizz
    questions = [
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
    
    quizz = new Quizz(questions);
});


//Test permettant de s'assurer que par défaut on commence par la question 1 et que l'on peut répondre à la question courante
describe('initial-state', () => {
    test('simple', () => {
        expect(quizz.currentQuestion).toBe(1);
        expect(quizz.state).toBe(QuizzState.ANSWERING);
    });
});

//Test permettant de s'assurer qu'on puisse répondre correctement aux questions, que l'on passe bien à la question suivante en cas de bonne réponse, et que lorsque toutes les questions sont correctement répondues le quizz est gagné
describe('correct-answers', () => {
    test('simple', () => {
        expect(quizz.checkAnswer("0.0018")).toBe(true);
        expect(quizz.checkAnswer("15")).toBe(true);
        expect(quizz.checkAnswer("yes")).toBe(true);
        expect(quizz.state).toBe(QuizzState.WIN);
    });
});

//Test permettant de s'assurer qu'on ne puisse pas répondre à une question si l'on a déjà gagné
describe('too-many-answers', () => {
    test('simple', () => {
        quizz.checkAnswer("0.0018");
        quizz.checkAnswer("15");
        quizz.checkAnswer("yes");
        expect(quizz.checkAnswer("one more question please !!!")).toBe(false);
        expect(quizz.state).toBe(QuizzState.WIN);
    });
});

//Test permettant de s'assurer qu'on a bien perdu si la réponse est incorrecte, et qu'on ne puisse pas répondre à une question si l'on a perdu
describe('wrong-answer', () => {
    test('simple', () => {
        expect(quizz.checkAnswer("???")).toBe(false);
        expect(quizz.state).toBe(QuizzState.LOST);
        expect(quizz.checkAnswer("0.0018")).toBe(false);
    });
});
