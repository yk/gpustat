import { Mongo } from 'meteor/mongo';

export default CpuStats = new Mongo.Collection('cpu');

CpuStats.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

CpuStats.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
