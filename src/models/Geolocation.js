const EARTH_RADIUS = 6378.137;
const DEG_IN_RAD = Math.PI / 180;

class Geolocation {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    static fromLocation(location) {
        return new Geolocation(location.latitude, location.longitude);
    }

    static getDistance(A, B) {
        const dLat = (B.latitude - A.latitude) * DEG_IN_RAD;
        const dLon = (B.longitude - A.longitude) * DEG_IN_RAD;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(A.latitude * DEG_IN_RAD) * Math.cos(B.latitude * DEG_IN_RAD) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return 2 * EARTH_RADIUS * c;
    }
}

module.exports = Geolocation;
