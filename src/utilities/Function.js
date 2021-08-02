import HAB from './permissions';

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

    case 'dispositif_1': return 'Sans';
    case 'dispositif_2': return 'Mission Locale';
    case 'dispositif_3': return 'PEC Excellence';

    case 's_formation': return 'Statut';
    case 's_formation_1': return 'En attente de validation';
    case 's_formation_2': return 'En attente de conventionnement';

    case 'niveau_form': return 'Niveau';
    case 'niveau_1': return 'Indéterminé';
    case 'niveau_2': return 'Niveau I et II Bac+3 ou 4';
    case 'niveau_3': return 'Niveau III Bac+2';
    case 'niveau_4': return 'Niveau IV Bac, BTN, BT, BP';
    case 'niveau_5': return 'Niveau V BEPC, BEP, CAP';
    case 'niveau_6': return 'Attestation de formation';

    case 'objectif_form': return 'Objectif';
    case 'objectif_1': return 'Certification';
    case 'objectif_2': return 'Professionnalisation';
    case 'objectif_3': return 'Préparation à la qualification';

    case 'lot_1': return 'LOT 1 TRANSPORT';
    case 'lot_2': return 'LOT 2 - LOGISTIQUE';
    case 'lot_4': return 'LOT 4 - BATIMENT GROS OEUVRE, BATIMENT SECOND OEUV...';
    case 'lot_5': return 'LOT 5 - PRODUCTION ALIMENTAIRE, PRODUCTION CULINAI...';
    case 'lot_6': return 'LOT 6 - PRODUCTION AGRICOLE, SYLVICOLE, ELEVAGE, P...';
    case 'lot_8': return 'LOT 8 - SECRETARIAT, BUREAUTIQUE, COMPTABILITE, RE...';
    case 'lot_9': return 'LOT 9 - COMMERCE';
    case 'lot_10': return 'LOT 10 - EDUCATION, AIDE A LA PERSONNE, TRAVAIL SO...';
    case 'lot_11': return 'LOT 11 - HOTELLERIE, RESTAURATION TOURISME';
    case 'lot_12': return 'LOT 12 - NETTOYAGE, ENVIRONNEMENT';
    case 'lot_13': return 'LOT 13 - SECURITE, GARDIENNAGE';
    case 'lot_14': return 'LOT 14 - COMPETENCES TRANSVERSALES';
    case 'lot_15': return 'LOT 15 - METIER DU NUMERIQUE';
    case 'lot_16': return 'LOT 16 - CREATION D ENTREPRISE';

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

export function dateFormat(date) {
  if(!date){return false;}
  let newDate = date;
  if (date.includes('T')) {
    newDate = date.split('T')[0];
    let newDate_tmp = newDate.split('-');
    newDate = newDate_tmp[2]+'/'+newDate_tmp[1]+'/'+newDate_tmp[0]
  }
  return newDate;
}