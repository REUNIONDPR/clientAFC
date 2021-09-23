import { getDateTime } from "../../../../../../../utilities/Function"

export default function CardHisto(props) {
    
    const getText = (i, info) => {
        let result = '';
        switch (i) {
            case 1:
                result = 'Contact de l\'OF';
                break;
            case 8:
                result = 'L\'OF à refusé la sollicitation.';
                break;
            default: result = i; break
        }
        result = info ? result + ' ( ' + info + ' )' : result;
        return result;
    }
    return (
        <>
            {props.data.map((v) => (

                <div key={'histoSol_' + v.id}>
                    {getDateTime(v.date_etat).date} à {getDateTime(v.date_etat).time} : {getText(v.etat, v.information)}
                </div>

            )

            )}
            <div></div>
        </>
    )
}