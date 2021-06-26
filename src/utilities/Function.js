export function codeToName(str){
    switch(str){
        case 'n_Article' :                  return 'N° Article';
        case 'intitule_form_marche' :       return 'Intitulé';
        case 'nb_heure_ent' :               return 'Heure Entreprise';
        case 'nb_heure_appui' :             return 'Heure Appui à la recherche d\'emploi';
        case 'nb_heure_soutien' :           return 'Heure de soutien';
        case 'prixTrancheA' :                return 'Prix < 6 personnes';
        case 'prixTrancheB' :               return 'Prix > 6 personnes';
        default: return str;
    }
}