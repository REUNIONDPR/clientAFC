import HAB from './permissions';
import axios from 'axios';
import Cookie from 'js-cookie';

export function codeToName(str) {
  switch (str) {
    case 'lot': return 'Lot';
    case 'n_Article': return 'N° Article';
    case 'intitule_form_marche': return 'Intitulé';
    case 'formacode': return 'Formacode';
    case 'formation_niveau': return 'Niveau';
    case 'formation_objectif': return 'Objectif';
    case 'nb_heure_socle': return 'Heure Socle';
    case 'nb_heure_ent': return 'Heure Entreprise';
    case 'nb_heure_appui': return 'Heure Appui à la recherche d\'emploi';
    case 'nb_heure_soutien': return 'Heure de soutien';
    case 'prixTrancheA': return 'Prix < 6 personnes';
    case 'prixTrancheB': return 'Prix > 6 personnes';
    case 'adresse': return 'Adresse';

    case 'user': return 'Utilisateur';
    case 's_formation': return 'Statut';
    case 'agent_referent': return 'Agent référant';
    case 'agence_referente': return 'Agence référante';
    case 'dispositif': return 'Dispositif';
    case 'nb_place': return 'Nombre de place';
    case 'OF_dispensateur': return 'OF Dispensateur';
    case 'dateEntree': return 'Date d\'entrée';
    case 'dateIcop': return 'Date ICOP';
    case 'nConv': return 'N° Conventionnement';
    case 'dateConv': return 'Date Conventionnement';
    case 'dateFin': return 'Date de fin';
    case 'nbH_centre': return 'Nombre d\'heure en centre';
    case 'nbH_ent': return 'Nombre d\'heure en entreprise';
    case 'nbH_appui': return 'Nombre d\'heure appui à la recherche d\'emploi';
    case 'nbH_remise_a_niveau': return 'Nombre d\'heure de remise à niveau';
    case 'nbH_soutien': return 'Nombre d\'heure de soutien';
    case 'nbH_maxSession': return 'Nombre d\'heure max de la session';
    case 'nbJ': return 'Nombre de jour de la session';
    case 'nbJ_apresDateInt': return 'Nombre de jour après les date d\'interrupt';

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

export function displayName(variable, table) {
  // let response;
  // axios.get(`global/findName?v=2&t=dispositif`, {
  //       headers: { Authorization: 'Bearer ' + Cookie.get('authToken'), }
  //     }).then((r) => {console.log(r.data[0].libelle)});
  //     return response;
  // let result;
  // const initFetch = async () => {
  //   const req = await 
  //   result = req.data[0];
  //   console.log('azezaezaeaz', result)
  //   return result;
  // }
  // initFetch();
}