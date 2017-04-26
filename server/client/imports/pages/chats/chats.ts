import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ModalController, AlertController } from 'ionic-angular';
import { MeteorObservable } from 'meteor-rxjs';
import * as Moment from 'moment';
import { Observable, Subscriber } from 'rxjs';
import { Usages, Usages2w, Usages1d, FreeBusys } from '../../../../imports/collections';
import { Usage, FreeBusy } from '../../../../imports/models';
import template from './chats.html';
//import { NewChatComponent } from './new-chat';
import * as _ from 'underscore';

@Component({
  template
})
export class ChatsPage implements OnInit {
  usages;
    usages2w;
    usages1d;
  freebusys;

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController) {
  }

  ngOnInit() {
    MeteorObservable.subscribe('usage').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        //this.usages = this.findUsages();
        this.usages = Usages.find({}, {sort: {'_id': 1}});
        this.usages2w = Usages2w.find({}, {sort: {'_id': 1}});
        this.usages1d = Usages1d.find({}, {sort: {'_id': 1}});
      });
    });
    MeteorObservable.subscribe('freebusy').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        //this.freebusys = this.findFreeBusys();
        this.freebusys = FreeBusys.find({}, {sort: {'entry.machine': 1}});
      });
    });
  }

  //findUsages(): Observable<Usage[]> {
    //return Usages.find().map(usages => {
        //usages = _.map(_.groupBy(usages, 'user'), usg => {
            //let used = 0;
            //let perc = 0;
            //if(_.size(usg) > 0){
                //used = _.reduce(_.pluck(usg, 'totalused'), (a, b) => a + b, 0);
                //used = used / 60;
                //perc = _.reduce(_.pluck(usg, 'meanperc'), (a, b) => a + b, 0) / _.size(usg);
                //perc = perc / 100.;
            //}
            //return {user: usg[0].user, used: used, perc: perc};
        //});
      //return usages;
    //});
  //}


  //findFreeBusys(): Observable<FreeBusy[]> {
    //return FreeBusys.find({}, {sort: {timestamp: -1}}).map(freebusys => {
        //let groups = _.groupBy(freebusys, 'machine');
        //let firsts = _.map(groups, group => group[0]);
      //return firsts;
    //});
  //}



  //findLastChatMessage(chatId: string): Observable<Message> {
    //return Observable.create((observer: Subscriber<Message>) => {
      //const chatExists = () => !!Chats.findOne(chatId);

      //// Re-compute until chat is removed
      //MeteorObservable.autorun().takeWhile(chatExists).subscribe(() => {
        //Messages.find({ chatId }, {
          //sort: { createdAt: -1 }
        //}).subscribe({
          //next: (messages) => {
            //// Invoke subscription with the last message found
            //if (!messages.length) {
              //return;
            //}

            //const lastMessage = messages[0];
            //observer.next(lastMessage);
          //},
          //error: (e) => {
            //observer.error(e);
          //},
          //complete: () => {
            //observer.complete();
          //}
        //});
      //});
    //});
  //}

  //showMessages(chat): void {
    //this.navCtrl.push(MessagesPage, {chat});
  //}

  //removeChat(chat: Chat): void {
    //MeteorObservable.call('removeChat', chat._id).subscribe({
      //error: (e: Error) => {
        //if (e) {
          //this.handleError(e);
        //}
      //}
    //});
  //}

  handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      buttons: ['OK'],
      message: e.message,
      title: 'Oops!'
    });

    alert.present();
  }

}
