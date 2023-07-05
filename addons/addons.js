function saveProficiency(charClass) {
    let savingThrowsPro = {};

    switch (charClass.toLowerCase()) {
        case 'bárbaro':
        case 'barbarian':
        case 'guerreiro':
        case 'fighter':
            savingThrowsPro = { stStrPro: true, stDexPro: false, stConPro: true, stIntPro: false, stWisPro: false, stChaPro: false };
            break;

        case 'bardo':
        case 'bard':
            savingThrowsPro = { stStrPro: false, stDexPro: true, stConPro: false, stIntPro: false, stWisPro: false, stChaPro: true };
            break;

        case 'bruxo':
        case 'warlock':
        case 'clérigo':
        case 'cleric':
        case 'paladino':
        case 'paladin':
            savingThrowsPro = { stStrPro: false, stDexPro: false, stConPro: false, stIntPro: false, stWisPro: true, stChaPro: true };
            break;

        case 'druida':
        case 'druid':
        case 'mago':
        case 'wizard':
            savingThrowsPro = { stStrPro: false, stDexPro: false, stConPro: false, stIntPro: true, stWisPro: true, stChaPro: false };
            break;

        case 'feiticeiro':
        case 'sorcerer':
            savingThrowsPro = { stStrPro: false, stDexPro: false, stConPro: true, stIntPro: false, stWisPro: false, stChaPro: true };
            break;

        case 'ladino':
        case 'rogue':
            savingThrowsPro = { stStrPro: false, stDexPro: true, stConPro: false, stIntPro: true, stWisPro: false, stChaPro: false };
            break;

        case 'monge':
        case 'monk':
        case 'patrulheiro':
        case 'ranger':
            savingThrowsPro = { stStrPro: true, stDexPro: true, stConPro: false, stIntPro: false, stWisPro: false, stChaPro: false };
            break;

        default:
            break;
    }

    return savingThrowsPro;
}
function attributeModifier(value) {
    if (value === 1) {
        return -5;
    } else if (value >= 2 && value <= 3) {
        return -4;
    } else if (value >= 4 && value <= 5) {
        return -3;
    } else if (value >= 6 && value <= 7) {
        return -2;
    } else if (value >= 8 && value <= 9) {
        return -1;
    } else if (value >= 10 && value <= 11) {
        return 0;
    } else if (value >= 12 && value <= 13) {
        return 1;
    } else if (value >= 14 && value <= 15) {
        return 2;
    } else if (value >= 16 && value <= 17) {
        return 3;
    } else if (value >= 18 && value <= 19) {
        return 4;
    } else if (value >= 20 && value <= 21) {
        return 5;
    } else if (value >= 22 && value <= 23) {
        return 6;
    } else if (value >= 24 && value <= 25) {
        return 7;
    } else if (value >= 26 && value <= 27) {
        return 8;
    } else if (value >= 28 && value <= 29) {
        return 9;
    } else if (value === 30) {
        return 10;
    }
}

module.exports = {saveProficiency, attributeModifier}