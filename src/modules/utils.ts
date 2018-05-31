import {config} from '../config';
import {concatArrays} from '../utils/concatArrays';
import {removeDuplicates} from '../utils/removeDuplicates';

const companyArray = Object.keys(config).map(company => config[company]);

// для вывода в help и start, а также для работы команды set_companies
export const companies = companyArray.map(company => company.name);

// для работы команды set_city
export const cities = removeDuplicates(concatArrays(companyArray.map(company => company.cities)));

export function getCompaniesFromCity(city: string): string[] {
    return companyArray
        .filter(company => company.cities.some(item => item === city))
        .map(company => company.name);
}