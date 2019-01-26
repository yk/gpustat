import React, { Component } from 'react';
import Machines from '/imports/api/Machines';
import { withTracker } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import moment from 'moment';
import Machine from './Machine';


class StatsArea extends Component {
  constructor(props) {
    super(props);

    this.state = { };
  }

  memInGB = (mem) => Math.round(mem / 1024 / 1024);

  render() {
    const { loading, machines } = this.props;

    if (loading) return <div>Loading...</div>;

    return (
      <div>
        <h1>GPU Stats</h1>
        <MachineContainerDiv>
          {machines.sort().map(m => 
            <Machine machine={m._id} key={m._id}/>
          )}
        </MachineContainerDiv>
      </div>
    );
  }
}

export default withTracker(() => {
  const handleMachines = Meteor.subscribe('machines.list');

  return {
    loading: !handleMachines.ready(),
    machines: Machines.find().fetch(),
  };
})(StatsArea);

const MachineContainerDiv = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`
