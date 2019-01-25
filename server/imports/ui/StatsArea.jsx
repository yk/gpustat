import React, { Component } from 'react';
import CpuStats from '/imports/api/CpuStats';
import GpuStats from '/imports/api/GpuStats';
import { withTracker } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import moment from 'moment';

class StatsArea extends Component {
  constructor(props) {
    super(props);

    this.state = { };
  }

  memInGB = (mem) => Math.round(mem / 1024 / 1024);

  render() {
    const { loading, cpuStats, gpuStats } = this.props;

    if (loading) return <div>Loading...</div>;

    let machines = [...new Set([...cpuStats, ...gpuStats].map(s => s.machine))].sort();

    let stats = machines.map(m => ({
      name: m, 
      cpu: cpuStats.find(s => s.machine == m),
      gpu: gpuStats.find(s => s.machine == m)
    }));

    return (
      <div>
      <h1>GPU Stats</h1>
      <MachineContainerDiv>
      {stats.map(m =>
        <div key={m.name}>
        <h2>{m.name}: {m.gpu.totalfree} GPUs free</h2>
        <div>Last update: {moment(Math.min(m.cpu.timestamp, m.gpu.timestamp)*1000).fromNow()}</div>
        <div>Load: {m.cpu.load_avg} / {m.cpu.nproc}</div>
        <div>Memory used: {this.memInGB(m.cpu.mem_used)} GB / {this.memInGB(m.cpu.mem_total)} GB</div>
        <div>HDD used: {this.memInGB(m.cpu.hdd_used)} GB / {this.memInGB(m.cpu.hdd_used + m.cpu.hdd_avail)} GB</div>
        <h3>GPUs</h3>
        <table>
        <tbody>
        <tr>
          <td>GPU</td>
          <td>User</td>
          <td>Usage</td>
        </tr>
        {m.gpu.details.sort(d => d.gid).map(d => 
          <tr key={d.gid}>
          <td>{d.gid}</td>
          <td>{d.uid}</td>
          <td>{d.perc}%</td>
          </tr>
        )}
        </tbody>
        </table> 
        <h3>Processes</h3>
        <table>
        <tbody>
        <tr>
          <td>User</td>
          <td>CPU</td>
          <td>Mem</td>
          <td>Command</td>
        </tr>
        {m.cpu.procs.filter(p => p.cpu > 100 || p.mem > 5).sort(p => p.mem).map(p =>
          <tr key={p.pid}>
          <td>{p.uid}</td>
          <td>{p.cpu}</td>
          <td>{p.mem}</td>
          <td>{p.cmd}</td>
          </tr>
        )}
        </tbody>
        </table>
        </div>
      )}
      </MachineContainerDiv>
      </div>
    );
  }
}

export default withTracker(() => {
  const handleCpuStats = Meteor.subscribe('cpu.list');
  const handleGpuStats = Meteor.subscribe('gpu.list');

  return {
    loading: !handleCpuStats.ready() || !handleGpuStats.ready(),
    cpuStats: CpuStats.find({}, { sort: { timestamp: -1 }, limit: 100}).fetch(),
    gpuStats: GpuStats.find({}, { sort: { timestamp: -1 }, limit: 100}).fetch(),
  };
})(StatsArea);

const MachineContainerDiv = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`
