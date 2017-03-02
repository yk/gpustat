import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Usages, FreeBusys } from '../imports/collections';
import { Usage, FreeBusy } from '../imports/models';

Meteor.publish('usage', function(){
    //return Usages.collection.find({}, {sort: {timestamp: -1}});
    return Usages.collection.find({});
});

Meteor.publish('freebusy', function(){
    //return FreeBusys.collection.find({}, {sort: {timestamp: -1}});
    return FreeBusys.collection.find({});
});
