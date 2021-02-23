export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: "AIzaSyDMbs0uwJ_NcUdFdi6JASm-gzqOPz4vXqE",
    authDomain: "meeting-maker-app.firebaseapp.com",
    projectId: "meeting-maker-app",
    storageBucket: "meeting-maker-app.appspot.com",
    messagingSenderId: "22169526402",
    appId: "1:22169526402:web:96e57dee3e273b918b949b",
    measurementId: "G-BDSQFED9QG",
    databaseURL: "https://meeting-maker-app.firebaseio.com",
    useEmulators: false
  },
  apiAuthTokenExchange: "https://meetingmakerapp.uc.r.appspot.com",
  googleCloudConfig: {
    agmKey: 'AIzaSyA4K1sIU-SOJkrOHTc3BzHurvTkg9N4Uf8'
  },
  logRocketConfig: {
    appID: 'tdzfnj/anonymous-meetings',
    options: {}
  },
  getUserRetry: 10,
  getUserDelay: 500,
  defaultSettings: {
    darkTheme: true,
    toastTimeout: 2000,
    searchSettings: {
      showHelp: true,
      zipcode: null,    // zip -> gps
      gps: true,
      lat: null,
      lon: null,
      radius: 16,       // 16km (10 miles)
  
      byAnyDay: true,
      byDay: 'Monday',      // today or dow
      
      // specify specific time
      bySpecificTime: false,
      bySpecific: {
        start: null,
        end: null,
      },

      // or
      // (bySpecific & byRelative are mutually exclusive)
  
      // relative to current time
      // use current time window range
      byRelativeTime: false,
      byRelative: { 
        early: 2, 
        late: 10 
      }   
    }
  }
};
