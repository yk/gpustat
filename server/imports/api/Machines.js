import { Mongo } from 'meteor/mongo';

export default Machines = new Mongo.Collection('machines');

Machines.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Machines.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
