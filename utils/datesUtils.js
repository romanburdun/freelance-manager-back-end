let TAX_YEAR_STARTS_DATE = 6;
let TAX_YEAR_STARTS_MONTH = 3
let TAX_YEAR_END_DATE = 5;

exports.getCurrentTaxYearDates = () => {

    let currentYear = new Date().getFullYear();

    let today = new Date();


    let taxYearStart;
    let taxYearEnd;

    if( today.getMonth() >= TAX_YEAR_STARTS_MONTH && today.getDate() >= TAX_YEAR_STARTS_DATE) {
        taxYearStart = new Date(currentYear, TAX_YEAR_STARTS_MONTH, TAX_YEAR_STARTS_DATE);
        taxYearEnd = new Date(currentYear + 1, TAX_YEAR_STARTS_MONTH, TAX_YEAR_END_DATE);
    } else {
        taxYearStart = new Date(currentYear -1, TAX_YEAR_STARTS_MONTH, TAX_YEAR_STARTS_DATE);
        taxYearEnd = new Date(currentYear, TAX_YEAR_STARTS_MONTH, TAX_YEAR_END_DATE);
    }

    taxYearStart = new Date(taxYearStart.setTime(taxYearStart.getTime() - taxYearStart.getTimezoneOffset() * 60 * 1000));
    taxYearEnd = new Date(taxYearEnd.setTime(taxYearEnd.getTime() - taxYearEnd.getTimezoneOffset() * 60 * 1000))

    return setTaxYearOffset(taxYearStart, taxYearEnd)
}

exports.getPreviousTaxYearDates = () => {


    const {taxYearStart, taxYearEnd} = this.getCurrentTaxYearDates();

    let pastYear = {};

    pastYear.taxYearStart = new Date(taxYearStart.setFullYear(taxYearStart.getFullYear() -1));
    pastYear.taxYearEnd = new Date(taxYearEnd.setFullYear(taxYearEnd.getFullYear() - 1));

    return pastYear;
}

exports.getSpecifiedTaxYearDates = (year) => {
    let taxYearStart = new Date(year, TAX_YEAR_STARTS_MONTH, TAX_YEAR_STARTS_DATE);
    let taxYearEnd = new Date(+year +1, TAX_YEAR_STARTS_MONTH, TAX_YEAR_END_DATE);

    return setTaxYearOffset(taxYearStart, taxYearEnd)
}

const setTaxYearOffset = (taxYearStart, taxYearEnd) => {
    taxYearStart = new Date(taxYearStart.setTime(taxYearStart.getTime() - taxYearStart.getTimezoneOffset() * 60 * 1000));
    taxYearEnd = new Date(taxYearEnd.setTime(taxYearEnd.getTime() - taxYearEnd.getTimezoneOffset() * 60 * 1000))
    return {taxYearStart, taxYearEnd}
}

exports.setDateOffset = (date) => {
    return new Date(date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000))
}
