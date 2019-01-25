import { Meteor } from 'meteor/meteor';
import CpuStats from '/imports/api/CpuStats';
import '/imports/api/server/publications';

function insertLink(title, url) {
  CpuStats.insert({ title, url, createdAt: new Date() });
}

Meteor.startup(() => {
});
