import { MongoObservable } from 'meteor-rxjs';
import { FreeBusy, FreeBusyView } from '../models';

export const FreeBusys = new MongoObservable.Collection<FreeBusyView>('freebusyview');
