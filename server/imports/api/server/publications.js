import CpuStats from '../CpuStats';
import GpuStats from '../GpuStats';
import Machines from '../Machines';

Meteor.publish('cpu.view', function(machine){
  return CpuStats.find({machine}, {sort: {timestamp: -1}, limit: 1 });
});

Meteor.publish('gpu.view', function(machine){
  return GpuStats.find({machine}, {sort: {timestamp: -1}, limit: 1 });
});

Meteor.publish('machines.list', function(){
  return Machines.find();
});
