import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Usages, Usages2w, Usages1d, FreeBusys } from '../imports/collections';
import { Usage, FreeBusy } from '../imports/models';

Meteor.publish('usage', function(){
    //return Usages.collection.find({}, {sort: {timestamp: -1}});
    return Usages.collection.find({});
});

Meteor.publish('usage2w', function(){
    //return Usages.collection.find({}, {sort: {timestamp: -1}});
    return Usages2w.collection.find({});
});

Meteor.publish('usage1d', function(){
    //return Usages.collection.find({}, {sort: {timestamp: -1}});
    return Usages1d.collection.find({});
});

Meteor.publish('freebusy', function(){
    //return FreeBusys.collection.find({}, {sort: {timestamp: -1}});
    return FreeBusys.collection.find({});
});
