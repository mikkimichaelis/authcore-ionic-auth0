export interface ISearchSettings {
  showHelp: boolean,
  zipcode: string,
  gps: boolean,
  lat: number,
  lon: number,
  radius: number,

  byAnyDay: boolean,
  byDay: string,

  bySpecificTime: boolean,
  bySpecific: {
    start: string,     // null = past current time or Time string
    end: string
  },

  // or
  // (bySpecific & byRelative are mutually exclusive)

  // relative to current time
  // use current time window range
  byRelativeTime: boolean,
  byRelative: {
    early: number,
    late: number
  }
} 