import { Meteor } from 'meteor/meteor';

export interface Usage {
  _id?: string;
  user?: string;
  machine?: string;
  meanperc?: number;
  timestamp?: number;
  totalused?: number;
}

export interface FreeBusy {
  _id?: string;
  machine?: string;
  totalfree?: number;
  timestamp?: number;
  whichfree?: number[];
  details?: any[];
}

export interface UsageView {
  _id?: string;
  meanperc?: number;
  count?: number;
}

export interface FreeBusyView {
  _id?: string;
  count?: number;
  entry?: FreeBusy;
}
