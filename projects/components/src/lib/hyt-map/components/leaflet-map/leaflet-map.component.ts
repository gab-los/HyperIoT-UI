import { ApplicationRef, Component, ComponentFactoryResolver, EventEmitter, Injector, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import {Area, AreaDevice, Logger, LoggerService} from "core";
import { LeafletMapConfig } from "../../models/leaflet-map";
import { MapDefaultConfiguration } from '../../map-configuration';
import { MapDeviceEditComponent } from '../map-device-edit/map-device-edit.component';
import { MapDeviceInfoComponent } from '../map-device-info/map-device-info.component';
import { DeviceActions } from '../../models/device-actions';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'hyt-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit, OnDestroy {
  /**
   * Variable used to understand when we are in the "EDIT" mode of the map
   */
  @Input() editMode: boolean = false;

  _editCenter: boolean = false;

  @Input() areaConfiguration: string;

  private _mapMoveCB: (areaConfiguration: string) => void;

  itemOpen = new EventEmitter<any>();
  itemRemove = new EventEmitter<any>();
  itemUpdate = new EventEmitter<any>();

  centerMarker: L.Marker<any>;

  defaultLayer: L.TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  });

  /**
   * This variable is used to filter out
   */
  supportChange: string

  /**
   * Object that contain the init params for the map
   */
  mapOptions: L.MapOptions = {
    layers: [
      this.defaultLayer,
    ],
    zoom: MapDefaultConfiguration.zoom,
    zoomControl: MapDefaultConfiguration.zoomControls,
    minZoom: MapDefaultConfiguration.minZoom,
    maxZoom: MapDefaultConfiguration.maxZoom,
    zoomAnimation: true, // setting zoom in setView not always working if zoomAnimation true
    center: L.latLng({
      lat: MapDefaultConfiguration.latitude,
      lng: MapDefaultConfiguration.longitude,
    }),
  };

  /*
  * logger service
  */
  private logger: Logger;
  /**
   * Reference to map object
   * @private
   */
  private mapRef: L.Map;
  /**
   * Observer used to report changes in map container size
   * @private
   */
  private resizeMapObserver: ResizeObserver;

  constructor(
    private ngZone: NgZone,
    private loggerService: LoggerService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
  ) {
    // Init Logger
    this.logger = new Logger(this.loggerService);
    this.logger.registerClass('LeafletMapComponent');
  }

  ngOnInit(): void {
    this.mapOptions.zoomControl = !this.editMode;

    // setting default areaConfiguration if not provided
    if (!this.areaConfiguration) {
      this.areaConfiguration = JSON.stringify({
        latitude: MapDefaultConfiguration.latitude,
        longitude: MapDefaultConfiguration.longitude,
        zoom: MapDefaultConfiguration.zoom,
      });
    }

    // setting map initial zoom and center
    const parsedOption: LeafletMapConfig = JSON.parse(this.areaConfiguration);
    this.mapOptions.zoom = parsedOption.zoom;
    this.mapOptions.center = L.latLng({
      lat: parsedOption.latitude,
      lng: parsedOption.longitude,
    });
  }

  ngOnDestroy() {
    if (this.resizeMapObserver && this.mapRef) {
      this.resizeMapObserver.unobserve(this.mapRef.getContainer());
    }
  }

  /**
   * Reset area position based on areaConfiguration value
   * @param areaCfg ovserwrite areaconfiguration
   * @param cb optional callback to be executed after move end
   */
  resetDataMap(areaCfg?: string, cb?: Function) {
    if (this.mapRef) {
      if (areaCfg) {
        this.areaConfiguration = areaCfg;
      }
      const parsedOption: LeafletMapConfig = JSON.parse(this.areaConfiguration);

      if (cb) {
        if (this.mapRef.getCenter().equals(L.latLng(parsedOption.latitude, parsedOption.longitude ))) {
          cb();
        } else {
          this.mapRef.on('moveend', () => {
            cb();
            this.mapRef.off('moveend');
          });
        }
      }
      
      this.mapRef.setView(L.latLng({
        lat: parsedOption.latitude || MapDefaultConfiguration.latitude,
        lng: parsedOption.longitude || MapDefaultConfiguration.longitude,
      }), parsedOption.zoom || MapDefaultConfiguration.zoom);

    }
  }

  /**
   * Management of the map as soon as its data are available
   * @param map
   */
  onMapReady(map: L.Map): void {
    if (this.editMode) {
      this.centerMarker = L.marker(map.getCenter(), {
        icon: L.icon({
          iconUrl: 'assets/icons/map/marker-icon-red.png',
          shadowUrl: 'assets/icons/map/marker-shadow.png'
        }),
      }).addTo(map);
    }

    this.mapRef = map;

    // disable overlay input events
    var userOverlay = L.DomUtil.get('leaflet-user-overlay');
    L.DomEvent.disableClickPropagation(userOverlay);
    L.DomEvent.on(userOverlay, 'mousewheel', L.DomEvent.stopPropagation);
    L.DomEvent.on(userOverlay, 'click', L.DomEvent.stopPropagation);

    // Region resize map management
    this.resizeMapObserver = new ResizeObserver(() => {
      this.ngZone.runOutsideAngular(() => {
        //console.log('INVALIDATE SIZE');
        map.invalidateSize();
      });
    });

    this.resizeMapObserver.observe(map.getContainer());
    //#endregion

    L.control.scale().addTo(map);
  }
  
  mapMove(event) { // move and zoom events
    if (this._editCenter) {
      this.areaConfiguration = JSON.stringify({ latitude: this.mapRef.getCenter().lat, longitude: this.mapRef.getCenter().lng, zoom: this.mapRef.getZoom() });
      if (this.centerMarker) {
        this.centerMarker.setLatLng(this.mapRef.getCenter());
      }
    }
    if (this._mapMoveCB) {
      this._mapMoveCB(this.areaConfiguration);
    }
  }
  
  getAreaCenter() {
    return { x: this.mapRef.getCenter().lat, y: this.mapRef.getCenter().lng };
  }

  private _buildMarkerIcon(iconUrl: string): L.Icon {
    return L.icon({ 
      iconUrl:  'assets/icons/map/' + iconUrl,
      shadowUrl: 'assets/icons/map/shadow_icon.png',
      iconSize:     [51, 67],
      shadowSize:   [54, 33],
      iconAnchor:   [25.5, 67],
      shadowAnchor: [5, 31],
      popupAnchor:  [0, -70],
    });
  }

  areaItemsCount = 0;
  markers: L.Marker<any>[] = [];
  addAreaItem(areaItem: AreaDevice | Area) {
    this.areaItemsCount++;
    this.logger.debug('addAreaItem function', areaItem);
    const icon = this._buildMarkerIcon(areaItem.mapInfo.icon);
    const marker = L.marker(L.latLng(areaItem.mapInfo.x, areaItem.mapInfo.y), { icon: icon });
    this.markers.push(marker);

    if (this.editMode) {
      const deviceEditComponent = this.resolver.resolveComponentFactory(MapDeviceEditComponent).create(this.injector);
      this.appRef.attachView(deviceEditComponent.hostView);
      deviceEditComponent.instance.itemInfo = areaItem;
      deviceEditComponent.instance.itemRemoveCB = (itemInfo) => {
        this.itemRemove.emit(itemInfo);
        marker.remove();
        this.areaItemsCount--;
      };
      deviceEditComponent.instance.itemUpdateCB = (itemInfo) => {
        this.itemUpdate.emit(itemInfo);
        marker.setLatLng(L.latLng(itemInfo.mapInfo.x, itemInfo.mapInfo.y));
        const updatedIcon = this._buildMarkerIcon(itemInfo.mapInfo.icon);
        marker.setIcon(updatedIcon);
      }
      deviceEditComponent.instance.dragToggleCB = (dragEnable) => {
        if (dragEnable) {
          marker.getElement().style.cursor = 'move';
          marker.dragging.enable();
        } else {
          marker.getElement().style.cursor = 'pointer';
          marker.dragging.disable();
        }
      };
      deviceEditComponent.instance.subAreaOpenCB = (itemInfo) => {
        this.itemOpen.emit(itemInfo);
      }
      deviceEditComponent.changeDetectorRef.detectChanges();
  
      marker.bindPopup(deviceEditComponent.location.nativeElement);
      marker.on('dragend', event => {
        const latlng = marker.getLatLng();
        areaItem.mapInfo.x = latlng.lat;
        areaItem.mapInfo.y = latlng.lng;
        this.itemUpdate.emit(areaItem);
        deviceEditComponent.instance.resetItem(areaItem);
      });
      //L.DomEvent.disableClickPropagation(deviceEditComponent.location.nativeElement);
    } else {
      const deviceEditComponent = this.resolver.resolveComponentFactory(MapDeviceInfoComponent).create(this.injector);
      deviceEditComponent.instance.deviceInfo = areaItem;
      deviceEditComponent.instance.openClicked.subscribe((deviceAction: DeviceActions) => {
        if (deviceAction) this.itemOpen.emit({item: areaItem, deviceAction});
        else this.itemOpen.emit(areaItem);
      });
      deviceEditComponent.changeDetectorRef.detectChanges();
      marker.bindPopup(deviceEditComponent.location.nativeElement);
      //L.DomEvent.disableClickPropagation(deviceEditComponent.location.nativeElement);
    }

    marker.addTo(this.mapRef);
  }

  setAreaItems(items: (AreaDevice | Area)[]) {
    this.removeAreaItems();
    this.logger.debug('setAreaItems function');
    items.forEach((d) => {
      this.addAreaItem(d);
    });
  }
  removeAreaItems() {
    this.markers.forEach(marker => marker.remove());
  }

  refresh() { }

  toggleEditCenter(isEditCenterEnabled: boolean, moveCB: (areaConfiguration: string) => void, areaConfiguration?: string) {
    if (isEditCenterEnabled) {
      this.resetDataMap(areaConfiguration, () => {
        this._editCenter = isEditCenterEnabled;
        this._mapMoveCB = moveCB;
      });
    } else {
      this._mapMoveCB = moveCB;
      this.resetDataMap(areaConfiguration, () => {
        this._editCenter = isEditCenterEnabled;
      });
    }
  }

  setMapCenter(areaConfiguration: string) {
    const tempCB = this._mapMoveCB;
    this._mapMoveCB = null;
    this.resetDataMap(areaConfiguration, () => { this._mapMoveCB = tempCB });
  }

  recenter() {
    this.resetDataMap();
  }

  getImage() {
    var node = document.getElementById('container-leaflet-map');
    const filter = node => node.id !== 'leaflet-user-overlay' &&
      node.tagName !== 'BUTTON' &&
      !node.classList?.contains('leaflet-shadow-pane') &&
      !node.classList?.contains('leaflet-marker-pane');
    const scale = window.devicePixelRatio;
    return domtoimage.toBlob(node, {
      filter: filter,
      height: node.offsetHeight * scale,
      width: node.offsetWidth * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${node.offsetWidth}px`,
        height: `${node.offsetHeight}px`,
      },
    });
  }

}
