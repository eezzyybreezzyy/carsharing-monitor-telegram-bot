import request from 'request';
import {Observable, Subject, Observer} from 'rxjs/Rx';

export interface IAPIService {
    get<T>(url: string): Observable<T>;
}

export class APIService implements IAPIService {
    private static apiServiceInstance: APIService = null;

    get<T>(url: string): Observable<T> {
        return Observable.create((observer: Observer<T>) => {
            request.get(url, (err, resp) => {
                if (err) {
                    observer.error(err);
                }

                if (resp.statusCode !== 200) {
                    observer.error(`Error: ${resp.statusCode}`);
                }

                let body: T;

                try {
                    body = JSON.parse(resp.body);
                } catch (err) {
                    body = resp.body;
                }

                observer.next(body);
                observer.complete();
            });
        });
    }

    static instance(): APIService {
        if (this.apiServiceInstance == null) {
            this.apiServiceInstance = new APIService();
        }
        
        return this.apiServiceInstance
    }
}
