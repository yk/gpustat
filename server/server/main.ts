import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Usages } from 'imports/collections';

Meteor.startup(() => {
    //console.log(Usages.collection.find().count());
});
