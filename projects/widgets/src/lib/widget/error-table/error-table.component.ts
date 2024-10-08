import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DataChannel, DataPacketFilter, Logger, LoggerService, PacketData, DateFormatterService } from 'core';
import { Subject, Subscription } from 'rxjs';
import { BaseTableComponent } from '../../base/base-table/base-table.component';
import { WidgetAction } from '../../base/base-widget/model/widget.model';

@Component({
  selector: 'hyperiot-error-table',
  templateUrl: './error-table.component.html',
  styleUrls: ['../../../../../../src/assets/widgets/styles/widget-commons.css', './error-table.component.css']
})
export class ErrorTableComponent extends BaseTableComponent implements AfterViewInit, OnInit {

  @ViewChild('tableChild', { static: false }) tableChild;

  readonly TABLE_LIMIT = 400;
  readonly ERROR_PACKET_ID = -2;
  errorMessageFieldName = 'error';
  errorPacketFieldName = 'packet';
  errorPacketTimestampFieldName = 'timestamp';

  tableHeaders = [];
  tableSource: Subject<any[]> = new Subject<any[]>();

  allData: PacketData[] = [];

  pRequest: Subscription;
  dataSubscription: Subscription;
  offControllerSubscription: Subscription;

  protected dataChannel: DataChannel;

  protected logger: Logger;

  constructor(
    private dateFormatterService: DateFormatterService,
    injector: Injector,
    protected loggerService: LoggerService
  ) {
    super(injector, loggerService);
    this.logger = new Logger(this.loggerService);
    this.logger.registerClass(ErrorTableComponent.name);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    // TODO 500 ms?
    setTimeout(() => this.configure(), 500);
  }

  configure(): void {
    super.removeSubscriptionsAndDataChannels();
    // this.dataLoader.initConfig(this.widget);

    if (!this.serviceType) {
      this.logger.error('TYPE SERVICE UNDEFINED');
      return;
    }

    super.configure();
    this.isConfigured = true;

    // Set header
    this.tableHeaders = [];
    this.tableHeaders.push({ value: this.errorMessageFieldName });
    this.tableHeaders.push({ value: this.errorPacketFieldName });
    this.tableHeaders.push({ value: this.errorPacketTimestampFieldName });

    // TODO problema che dati che arrivano prima del render 
    setTimeout(() => {
      this.subscribeDataChannel();
      this.computePacketData(this.initData);
    }, 0);

  }

  subscribeDataChannel() {
    const dataPacketFilter = new DataPacketFilter(this.ERROR_PACKET_ID, [this.errorMessageFieldName], true);
    this.dataChannel = this.dataService.addDataChannel(+this.widget.id, [dataPacketFilter]);

    this.dataSubscription = this.dataChannel.subject.subscribe((eventData) => this.computePacketData(eventData.data));

    this.offControllerSubscription = this.dataChannel.controller.$totalCount.subscribe(res => {
      this.allData = [];
      this.tableChild.resetTable(res, true);
    });

  }

  // TODO move in BaseTableComponent ?
  computePacketData(packetData: PacketData[]) {
    if (packetData.length === 0) {
      return;
    }
    this.allData = this.allData.concat(packetData);
    packetData.forEach(ed => {
      // TODO
      //   if (this.widget.config.packetUnitsConversion) {
      //     this.applyUnitConvertion(this.widget.config.packetUnitsConversion, element);
      //   }
      ed[this.errorPacketTimestampFieldName] = this.dateFormatterService.formatDate(ed[this.errorPacketTimestampFieldName]);
    });
    this.tableSource.next(packetData);
  }

  dataRequest(lowerBound) {
    if (this.pRequest) {
      this.pRequest.unsubscribe();
    }
    this.dataService.loadNextData(+this.widget.id);
  }

  onToolbarAction(action: string) {
    const widgetAction: WidgetAction = { widget: this.widget, action };
    switch (action) {
      case 'toolbar:fullscreen':
        widgetAction.value = this.allData;
        break;
    }
    this.widgetAction.emit(widgetAction);
  }

}
