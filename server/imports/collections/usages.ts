import { MongoObservable } from 'meteor-rxjs';
import { Usage, UsageView } from '../models';

export const Usages = new MongoObservable.Collection<UsageView>('usageview');
