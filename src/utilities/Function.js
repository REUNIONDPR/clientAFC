import HAB from './permissions';

export function codeToName(str) {
  switch (str) {
    case 'lot': return 'Lot';
    case 'n_Article': return 'N° Article';
    case 'intitule_form_marche': return 'Intitulé';
    case 'formacode': return 'Formacode';
    case 'niveau_form': return 'Niveau';
    case 'objectif_form': return 'Objectif';
    case 'nb_heure_socle': return 'Heure Socle';
    case 'nb_heure_ent': return 'Heure Entreprise';
    case 'nb_heure_appui': return 'Heure Appui à la recherche d\'emploi';
    case 'nb_heure_soutien': return 'Heure de soutien';
    case 'prixTrancheA': return 'Prix < 6 personnes';
    case 'prixTrancheB': return 'Prix > 6 personnes';
    default: return str;
  }
}

export function IsPermitted(user, target, action) {
  if (!user || user.fonction === 'undefined') { console.log('user UnKWONW'); return false; }
  const userFonction = user.fonction;
  try {
    return HAB[userFonction][target][action];
  } catch (error) {
    return false;
  }

}