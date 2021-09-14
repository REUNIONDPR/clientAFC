// import { exit } from 'process';
import HAB from './permissions';

export function codeToName(str) {
  switch (str) {

    case 'lot': return 'Lot';
    case 'of': return 'Attributaire';
    case 'n_Article': return 'N° Article';
    case 'intitule_form_marche': return 'Intitulé';
    case 'intitule_form_base_article': return 'Intitulé Base Article';
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
    case 'commune': return 'Commune';

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
    case 'dispositif_4': return '1J1S';

    case 'formation_etat': return 'Statut';
    case 'formation_etat_1': return 'En attente de validation';
    case 'formation_etat_2': return 'En attente de conventionnement';

    case 'niveau_form': return 'Niveau';
    case 'niveau_form_1': return 'Indéterminé';
    case 'niveau_form_2': return 'Niveau I et II Bac+3 ou 4';
    case 'niveau_form_3': return 'Niveau III Bac+2';
    case 'niveau_form_4': return 'Niveau IV Bac, BTN, BT, BP';
    case 'niveau_form_5': return 'Niveau V BEPC, BEP, CAP';
    case 'niveau_form_6': return 'Attestation de formation';

    case 'objectif_form': return 'Objectif';
    case 'objectif_form_1': return 'Certification';
    case 'objectif_form_2': return 'Professionnalisation';
    case 'objectif_form_3': return 'Préparation à la qualification';

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

    case 'fonction_1': return 'DT Nord-Est';
    case 'fonction_2': return 'DT Sud-Ouest';
    case 'fonction_3': return 'DPSR';
    case 'fonction_4': return 'AMAJ';
    case 'fonction_5': return 'DDO';
    case 'fonction_6': return 'DPR';
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

export function getDateToday() {
  let currentDate = new Date();
  let datetime = currentDate.getFullYear().toString().padStart(2, '0') + '-' +
  (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
  currentDate.getDate().toString().padStart(2, '0') + ' ' +
  currentDate.getHours().toString().padStart(2, '0') + ":" +
  currentDate.getMinutes().toString().padStart(2, '0') + ":" +
  currentDate.getSeconds().toString().padStart(2, '0');
  return datetime;
}

export function dateFormat(date, format = 'FR') {
  if (!date || date === '0000-00-00') { return ''; }
  let newDate = date;
  if (date.includes('T')) { // DateFormat yyyy-mm-ddThh:mm:ss.ssssZ de la bdd
    newDate = date.split('T')[0];
    if (format === 'FR') {
      let newDate_tmp = newDate.split('-');
      newDate = newDate_tmp[2] + '/' + newDate_tmp[1] + '/' + newDate_tmp[0]
    }
  } else if (date.includes('-')) {
    if (format === 'FR') {
      let newDate_tmp = date.split('-');
      newDate = newDate_tmp[2] + '/' + newDate_tmp[1] + '/' + newDate_tmp[0]
    } else if (format === 'ANG') newDate = date
  }
  return newDate;
}
export function dateTimeFormat(date, format = 'FR'){
  // 'Indian/Reunion'
  if (!date || date === '0000-00-00' || !date.includes('T')) { return {data:'', time:''}; }
  
  let currentDate = new Date(date);
  let newDate = currentDate.getDate().toString().padStart(2, '0') + '/' +
  (currentDate.getMonth() + 1).toString().padStart(2, '0') + '/' +
  currentDate.getFullYear().toString();
  let newTime = currentDate.getHours().toString().padStart(2, '0') + ":" +
  currentDate.getMinutes().toString().padStart(2, '0') + ":" +
  currentDate.getSeconds().toString().padStart(2, '0');
  
  return {date:newDate, time:newTime};
}
// ---------------------- CALCUL DATE FIN FORMATION 
export function calculDateFin(formation) {

  // Calcul des heures se fait dans l'objet formation directement

  let interruption_1 = 0;
  let interruption_2 = 0;
  if (formation.date_DDINT1 !== '' && formation.date_DFINT1 !== '') {
    interruption_1 = dateCount(new Date(formation.date_DDINT1), new Date(formation.date_DFINT1))
    if (formation.date_DDINT2 !== '' && formation.date_DFINT2 !== '') {
      interruption_2 = dateCount(new Date(formation.date_DDINT2), new Date(formation.date_DFINT2))
    }
  }

  let nb_jour_formation = Math.ceil(formation.heure_max_session / 7) + interruption_1 + interruption_2;
  let date_fin_calcule = calculDate(formation.date_entree_demandee, nb_jour_formation);
  let regexDate = /^\d{4}-\d{2}-\d{2}$/;
  let date_fin = regexDate.test(date_fin_calcule) ? date_fin_calcule : '';

  return {
    date_fin: formation.date_entree_demandee !== '' ? date_fin : '',
    interruption_1: interruption_1,
    interruption_2: interruption_2
  }
}

export function dateCount(startDate, endDate, jrsOuvre = true) {
  // Nombre de jours ouvrés
  // <param 1 = startDate> Date à partir de laquelle il faut compter
  // <param 2 = endDate> Date jusqu'à laquelle il faut compter
  // <param 3 = jrsOuvre> Bool pour savoir si on compte sur les jours ouvré
  // Appel de la fonction JOURSFERIES qui listes les jours fériés selon l'année
  // Retourn le nombre de jours ouvrés entre les deux dates

  let count = 0;
  let curDate = startDate;

  let tab_1 = JoursFeries(startDate.getFullYear());
  let tab_2 = JoursFeries(startDate.getFullYear() + 1);

  while (curDate <= endDate) {
    var dayofWeek = curDate.getDay();
    if (!((dayofWeek === 6) || (dayofWeek === 0))) {
      count++;
      // On compte les jours fériés entre les dates d'interruption
      if (jrsOuvre) {
        for (let cpt_k = 0; cpt_k < 13; cpt_k++) {
          if (curDate.getMonth() === tab_1[cpt_k].getMonth() && curDate.getFullYear() === tab_1[cpt_k].getFullYear() && curDate.getDate() === tab_1[cpt_k].getDate()) {
            count--;
            break;
          }
          if (curDate.getMonth() === tab_2[cpt_k].getMonth() && curDate.getFullYear() === tab_2[cpt_k].getFullYear() && curDate.getDate() === tab_2[cpt_k].getDate()) {
            count--;
            break;
          }
        }
      }
    }
    curDate.setDate(curDate.getDate() + 1);

  }
  return count;
}

function JoursFeries(an) {
  // JOURS FERIES
  // <param 1 = an> Année concerné pour le tableau des jours fériés
  // Retorune un tableau contenant tout les jours férié de l'année an

  var JourAn = new Date(an, "00", "01");
  var FeteTravail = new Date(an, "04", "01");
  var Victoire1945 = new Date(an, "04", "08");
  var FeteNationale = new Date(an, "06", "14");
  var Assomption = new Date(an, "07", "15");
  var Toussaint = new Date(an, "10", "01");
  var Armistice = new Date(an, "10", "11");
  var FeteCaf = new Date(an, "11", "20");
  var Noel = new Date(an, "11", "25");

  var G = an % 19;
  var C = Math.floor(an / 100);
  var H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30;
  var I = H - Math.floor(H / 28) * (1 - Math.floor(H / 28) * Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11));
  var J = (an * 1 + Math.floor(an / 4) + I + 2 - C + Math.floor(C / 4)) % 7;
  var L = I - J;

  var MoisPaques = 3 + Math.floor((L + 40) / 44);
  var JourPaques = L + 28 - 31 * Math.floor(MoisPaques / 4);
  var Paques = new Date(an, MoisPaques - 1, JourPaques);
  var LundiPaques = new Date(an, MoisPaques - 1, JourPaques + 1);
  var Ascension = new Date(an, MoisPaques - 1, JourPaques + 39);
  var Pentecote = new Date(an, MoisPaques - 1, JourPaques + 49);
  var LundiPentecote = new Date(an, MoisPaques - 1, JourPaques + 50);

  return [JourAn, Paques, LundiPaques, FeteTravail, Victoire1945, Ascension, Pentecote, LundiPentecote, FeteNationale, Assomption, Toussaint, Armistice, FeteCaf, Noel];
}



// ---------------------- FONCTION CALCULER DATE 
function calculDate(dateDebut, nbjrs) {
  // Calcul une date par rapport à une autre : Date début + nombre de jours = ...
  // <param 1 = dateDebut> Date où il faut commencer le calcul
  // <param 2 = nbjrs> Nombre de jours à ajouter à cette date
  // Les weekend et jours férié en sont pas compté ! Ex : 13/07 + 2 = 16/07 (14/07 pas compté)
  // Retorune la date résultant au format YYYY-MM-DD
  if (dateDebut.includes('/')) {
    let tmpDate = dateDebut.split('/')
    dateDebut = tmpDate[2] + '-' + tmpDate[1] + '-' + tmpDate[0]
  }
  var madate = new Date(dateDebut)
  // test = typeof(madate)
  // // var date_now = new Date();
  var date_now_annee = madate.getFullYear();
  var date_now_mois = madate.getMonth();
  var date_now_jour = madate.getDate();

  //**init. des compteurs**//
  var cpt_i = 0;
  var cpt_j = 0;
  var cpt_k = 0;

  //**init. des tableaux récupérant les jours feries de l'annee en cours et de l'annee suivante.**//
  var tab_1 = [];
  var tab_2 = [];
  tab_1 = JoursFeries(madate.getFullYear());
  tab_2 = JoursFeries(madate.getFullYear() + 1);

  for (cpt_i = 0; cpt_j < nbjrs; cpt_i++) {
    var date_eval = new Date(date_now_annee, date_now_mois, date_now_jour + cpt_i);
    var day_date_eval = date_eval.getDay();
    if ((day_date_eval !== 6) && (day_date_eval !== 0)) {
      cpt_j++;
      for (cpt_k = 0; cpt_k < 13; cpt_k++) {
        if (date_eval.getMonth() === tab_1[cpt_k].getMonth() && date_eval.getFullYear() === tab_1[cpt_k].getFullYear() && date_eval.getDate() === tab_1[cpt_k].getDate()) {
          cpt_j--;
          break;
        }
        if (date_eval.getMonth() === tab_2[cpt_k].getMonth() && date_eval.getFullYear() === tab_2[cpt_k].getFullYear() && date_eval.getDate() === tab_2[cpt_k].getDate()) {
          cpt_j--;
          break;
        }
      }
    }
  }
  if (!nbjrs) {
    nbjrs = 0
    date_eval = new Date(dateDebut)
  }
  let year = date_eval.getFullYear();
  let month = date_eval.getMonth() + 1;
  let dt = date_eval.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return (year + '-' + month + '-' + dt);
}