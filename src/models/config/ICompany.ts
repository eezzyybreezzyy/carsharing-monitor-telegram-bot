export interface ICompanyConfig {
    [company: string]: ICompany;
}

export interface ICompany {
    name: string;
    cities: string[];
    api: string;
}