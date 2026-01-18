
module.exports.estDansPeriode = (mois, debut, fin) => {
    if (debut <= fin) {
        return mois >= debut && mois <= fin;
    } else {
        return mois >= debut || mois <= fin;
    }
}