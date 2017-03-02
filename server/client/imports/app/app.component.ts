import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Meteor } from 'meteor/meteor';
import { ChatsPage } from '../pages/chats/chats';
import template from "./app.html";

@Component({
  template
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform) {
    this.rootPage = ChatsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('cordova')) {
        StatusBar.styleDefault();
        Splashscreen.hide();
      }
    });
  }
}
