/*
Fichier comportant diverses constantes et fonctions utiles
*/

//constantes pour les couleurs en hexadécimal
export const GREEN = "#00AA00";
export const RED = "#CC0000";
export const GRAY = "#CCC";

/*
fonction pour ajouter rapidement un élément dans le DOM, l'élément ajouté est ensuite renvoyé
type : le type de l'élément
options : un objet JSON contenant les propriétés souhaitées de l'élément à ajouter
beforeElement : si spécifié, le nouvel éléménet sera ajouté avant cet élément
*/
export function addElement(type, options, beforeElement = null) {
    const element = document.createElement(type);
    
    Object.keys(options).forEach(opt => {
        element[opt] = options[opt];
    });

    if (beforeElement != null) {
        document.body.insertBefore(element, beforeElement);
    }else{
        document.body.appendChild(element);
    }

    return element;    
}