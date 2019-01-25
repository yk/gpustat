import CpuStats from '../CpuStats';
import GpuStats from '../GpuStats';

Meteor.publish('cpu.list', function(){
  return CpuStats.find();
});

Meteor.publish('gpu.list', function(){
  return GpuStats.find();
});
