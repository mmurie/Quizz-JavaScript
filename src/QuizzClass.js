/*
Énumération (sous la forme d'un objet JSON) des différents états du quizz :
WIN lorsqu'on a gagné
LOST lorsqu'on a perdu
ANSWERING lorsqu'on peut répondre à la question courante
*/
export const QuizzState = {
    WIN : 'WIN',
    LOST: 'LOST',
    ANSWERING: 'ANSWERING'
};

/*
Class permettant de décrire un quizz
questions : les questions du quizz
current : le numéro de la question courante (1 par défaut)
state : l'état courant du quizz (cf. la constante QuizzState précédente, ANSWERING par défaut)
*/
export default class Quizz { 
    constructor(questions, currentQuestion = 1, state = QuizzState.ANSWERING) {
        this.questions = questions;
        this.currentQuestion = currentQuestion;
        this.state = state;
    }

    /*
    Méthode permettant de vérifier la réponse à la question courante. On passe à la question suivante en cas de bonne réponse, et on modifie l'état du quizz en testant les différents cas
    On renvoie true en cas de bonne réponse, false sinon
    */
    checkAnswer(answer) {
        if (this.state !== QuizzState.ANSWERING) return false;

        if (answer === this.questions[this.currentQuestion-1].correct_answer) {
            this.currentQuestion++;

            if (this.currentQuestion > this.questions.length) {
                this.state = QuizzState.WIN;
            }

            return true;
        }else{
            this.state = QuizzState.LOST;
            return false;
        }
    }
}