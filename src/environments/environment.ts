// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  design: "ios",      // "md"
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
  apiAuthTokenExchange: "https://meetingmakerapp.uc.r.appspot.com/",
  auth: {
    clientId: '7YxQMN7qkcuemrbrYa1nR3RK8DBAQnIW',
    clientDomain: 'meetingmaker.us.auth0.com', // e.g., you.auth0.com
    audience: 'https://meetingmakerapp.uc.r.appspot.com', // e.g., http://localhost:1337/
    redirect: 'http://localhost:8100/callback',
    scope: 'openid profile email'
  },
  googleCloudConfig: {
    agmKey: 'AIzaSyA4K1sIU-SOJkrOHTc3BzHurvTkg9N4Uf8'
  },
  logRocketConfig: {
    appID: 'tdzfnj/anonymous-meetings',
    options: {}
  },
  getUserRetry: 10,
  getUserDelay: 500,
  busyTimeoutDuration: 10000,
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
