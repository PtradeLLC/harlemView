/**
 * World Model: Harlem
 * Core type definitions for Street View navigation, autonomous fleet,
 * smart infrastructure, and sub-tropical environmental telemetry.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Hotspot {
  id: string;
  type: 'waste_hub' | 'sweeper_rover' | 'mist_nozzle' | 'stoop_polisher' | 'apollo_marquee' | 'solar_dock';
  title: string;
  subtitle: string;
  yaw: number; // horizontal angle in panorama (0-360)
  pitch: number; // vertical angle (-40 to +60)
  distance: string;
  interactive: boolean;
}

export interface WaypointConnection {
  targetId: string;
  label: string;
  direction: 'north' | 'south' | 'east' | 'west' | 'turn_left' | 'turn_right';
  yaw: number; // compass heading to show pavement chevron
  distanceMeters: number;
}

export type PovMode = 'pedestrian' | 'rover_lidar' | 'stoop_balcony' | 'canopy_drone';
export type TimeOfDay = 'midday' | 'golden_hour' | 'twilight';

export interface StreetViewNode {
  id: string;
  title: string;
  corridor: string;
  address: string;
  coordinates: Coordinates;
  defaultHeading: number;
  defaultPitch: number;
  defaultFov: number;
  imageSrc: string;
  description: string;
  connections: WaypointConnection[];
  hotspots: Hotspot[];
  telemetry: {
    canopyDensity: string;
    permeablePaverArea: string;
    cisternCapacityPercent: number;
    airQualityIndex: number; // AQI
    ambientTempF: number;
    fragranceNotes: string[];
    activeRoversInSector: number;
  };
}

export interface AutonomousRover {
  id: string;
  name: string;
  callsign: string;
  type: 'sweeper' | 'stoop_polisher';
  sector: string;
  batteryPercent: number;
  status: 'patrolling' | 'sweeping' | 'washing' | 'docked' | 'chime_active';
  brushesRpm: number;
  hopperCapacityPercent: number;
  deionizedWaterReservePercent?: number;
  lidarActive: boolean;
  position: { x: number; y: number }; // Relative position on Harlem minimap grid (0-100)
  distanceCoveredTodayKm: number;
  strayDebrisCleared: number;
}

export interface SmartWasteHub {
  id: string;
  location: string;
  status: 'operational' | 'compaction_active' | 'vacuuming' | 'full';
  ringColor: 'teal' | 'amber';
  inletOpen: 'none' | 'compost' | 'recyclable' | 'non_recyclable';
  compostLevelPercent: number;
  recycleLevelPercent: number;
  landfillLevelPercent: number;
  totalCompactedKg: number;
  subStreetVacuumPressurePsi: number;
}
