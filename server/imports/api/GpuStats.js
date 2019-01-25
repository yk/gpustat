import { Mongo } from 'meteor/mongo';

export default GpuStats = new Mongo.Collection('gpu');

GpuStats.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

GpuStats.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
