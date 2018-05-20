const companyMap = require('./companyMap');
const modelMap = require('./modelMap');

function prepareCarsToOutput(cars) {
    return cars.map(car => ({
        company: companyMap[car.company_id].name,
        model: modelMap[car.model_id],
        fuel: car.fuel,
        latitude: car.lat,
        longitude: car.lng,
        urlSchema: companyMap[car.company_id].urlSchema
    }));
}

module.exports = prepareCarsToOutput;
