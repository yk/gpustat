import { MongoObservable } from 'meteor-rxjs';
import { Usage, UsageView } from '../models';

export const Usages = new MongoObservable.Collection<UsageView>('usageview');
export const Usages2w = new MongoObservable.Collection<UsageView>('usageview2w');
export const Usages1d = new MongoObservable.Collection<UsageView>('usageview1d');
