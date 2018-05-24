import {IGrabberService} from './IGrabberService';

export interface IGrabberServiceFactory {
    create(name: string): IGrabberService;
}