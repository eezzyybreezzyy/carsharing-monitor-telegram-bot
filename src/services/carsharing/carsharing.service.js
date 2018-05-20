const APIService = require('../api/api.service');

const prepareCarsToOutput = require('./utils/prepareCarsToOutput');

// TODO в конфиг
const url = 'https://api.cars-sharing.ru/v3/cars?city=msk';

class CarsharingService {
    constructor() {
        this.apiService = new APIService();
    }

    getCars() {
        return new Promise((resolve, reject) => {
            return this.apiService.get(url)
                       .then(response => JSON.parse(response))
                       .then(data => prepareCarsToOutput(data.cars))
                       .then(cars => resolve(cars))
                       .catch(error => reject(error));
        });
    }
}

module.exports = CarsharingService;