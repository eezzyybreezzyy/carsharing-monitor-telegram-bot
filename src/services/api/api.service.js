const request = require('request');

class APIService {
    constructor() {}

    get(url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) {
                    reject(error);
                }

                resolve(body);
            });
        });
    }
}

module.exports = APIService;
