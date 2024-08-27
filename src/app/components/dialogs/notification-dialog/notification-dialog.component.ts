import { animate, animateChild, group, query, sequence, stagger, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import {  DialogRef } from 'components';
import { AlarmWrapperService, HytAlarm, Logger, LoggerService } from 'core';

@Component({
  selector: 'hyt-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss'],
  animations: [
    trigger('containerAnim', [
      transition('* => *', [
        group([
          query(':enter:not(#no-notification)', [
            style({ height: 0, opacity: 0, 'overflow-y': 'hidden' }),
            animate('200ms ease-out', style({ height: '*', opacity: 1 })),
            style({ 'overflow-y': 'auto' }),
          ], { optional: true }),
          query(':leave:not(#no-notification)', [
            animate('200ms ease-out', style({ opacity: 0, transform: 'translateX(-300px)', 'overflow-y': 'hidden' })),
            animate('200ms', style({ height: 0, padding: 0 })),
            style({ 'overflow-y': 'auto' }),
          ], { optional: true }),

          query('#no-notification:enter', [
            style({ opacity: 0, 'margin-top': '-223px'  }),
            animate('200ms', style({ opacity: 0, 'margin-top': '-223px' })),
            animate('200ms', style({ opacity: 1, 'margin-top': '0' })),
          ], { optional: true }),
          query('#no-notification:leave', [
            style({ opacity: 1, 'margin-top': '0' }),
            animate('400ms', style({ opacity: 0, 'margin-top': '-223px' })),
          ], { optional: true }),
        ])
      ]),
    ]),
  ],
})
export class NotificationDialogComponent {
  /** Notification active get from alarmWrapperService */
  eventNotificationIsOn : boolean;
  /** HYOT logger */
  private logger: Logger

  constructor(
    private dialogRef: DialogRef<any>,
    private alarmWrapper: AlarmWrapperService,
    loggerService: LoggerService
  ) {
    this.logger = new Logger(loggerService);
    this.logger.registerClass("NotificationDialogComponent");
    this.eventNotificationIsOn = alarmWrapper.eventNotificationState.getValue();
  }

  close() {
    this.dialogRef.close();
  }

  get alarmListArray() : HytAlarm.LiveAlarm[]{
    return this.alarmWrapper.alarmListArray;
  }

  /**
   * Set off the notification is active OR viceversa
   */
  changeEventNotificationState() {
    this.eventNotificationIsOn = !this.eventNotificationIsOn;
    this.logger.info("changeEventNotificationState - new status", this.eventNotificationIsOn);
    this.alarmWrapper.eventNotificationState.next(this.eventNotificationIsOn);
  }

}
