import { dateTimeFormat } from "../../../../../../utilities/Function"

export default function CardHisto(props) {
    console.log(props.data)
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
                    {dateTimeFormat(v.date_etat).date} à {dateTimeFormat(v.date_etat).time} : {getText(v.etat, v.information)}
                </div>

            )

            )}
            <div></div>
        </>
    )
}