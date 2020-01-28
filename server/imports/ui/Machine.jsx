import React, { Component } from 'react';
import CpuStats from '/imports/api/CpuStats';
import GpuStats from '/imports/api/GpuStats';
import { withTracker } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import Moment from 'react-moment';

class Machine extends Component {
  constructor(props) {
    super(props);

    this.state = { };
  }

  memInGB = (mem) => Math.round(mem / 1024 / 1024);

  render() {
    const { loading, machine, cpuStats, gpuStats } = this.props;

    let m = {
      name: machine,
      cpu: cpuStats,
      gpu: gpuStats,
    };

    if (loading || !cpuStats || !gpuStats) return <div>Loading...</div>;

    const timestamp = Math.round(Math.min(m.cpu.timestamp, m.gpu.timestamp));
    const outdated = Date.now() / 1000 - timestamp > 120;
    const timeStyle = {};

    if(outdated){
      timeStyle.color = 'red';
      timeStyle.fontWeight = 'bolder';
    }

    return (
      <MachineDiv>
        <h2>{m.name}: {m.gpu.totalfree} GPUs free</h2>
        <table>
          <tbody>
            <tr style={timeStyle}>
              <td>Last update</td>
              <td><Moment unix fromNow>{timestamp}</Moment></td>
            </tr>
            <tr>
              <td>Load</td>
              <td> {m.cpu.load_avg} / {m.cpu.nproc}</td>
            </tr>
            <tr>
              <td>Memory used</td>
              <td> {this.memInGB(m.cpu.mem_used)} GB / {this.memInGB(m.cpu.mem_total)} GB</td>
            </tr>
            <tr>
              <td>HDD used</td>
              <td> {this.memInGB(m.cpu.hdd_used)} GB / {this.memInGB(m.cpu.hdd_used + m.cpu.hdd_avail)} GB</td>
            </tr>
          </tbody>
        </table>
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
          </MachineDiv>
    );
  }
}

export default withTracker(({machine}) => {
  const handleCpuStats = Meteor.subscribe('cpu.view', machine);
  const handleGpuStats = Meteor.subscribe('gpu.view', machine);

  return {
    loading: !handleCpuStats.ready() || !handleGpuStats.ready(),
    cpuStats: CpuStats.findOne({machine}),
    gpuStats: GpuStats.findOne({machine}),
  };
})(Machine);

const MachineDiv = styled.div`
`
