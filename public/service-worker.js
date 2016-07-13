(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('./js/sw-toolbox/sw-toolbox.js');

  // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = false;

  // We want to precache the following items
  toolbox.precache([ '/bookings.html',
                     '/index.html',
                     '/messages.html']);

  // The route for any requests from the googleapis origin
  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'googleapis',
      maxEntries: 30,
      maxAgeSeconds: 604800
    },
    origin: /\.googleapis\.com$/,
    // Set a timeout threshold of 2 seconds
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'mdl',
      maxEntries: 30,
      maxAgeSeconds: 604800
    },
    origin: /\.getmdl\.io$/,
    // Set a timeout threshold of 2 seconds
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/css/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'settled-stylesheets',
      maxEntries: 10,
      maxAgeSeconds: 604800
    },
    // Set a timeout threshold of 2 seconds
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/data/images/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'settled-images',
      maxEntries: 10,
      maxAgeSeconds: 604800
    },
    // Set a timeout threshold of 2 seconds
    networkTimeoutSeconds: 4
  });

  // toolbox.router.get('/js/(.*)', global.toolbox.cacheFirst, {
  //   cache: {
  //     name: 'settled-javascript',
  //     maxEntries: 10,
  //     maxAgeSeconds: 604800
  //   },
  //   // Set a timeout threshold of 2 seconds
  //   networkTimeoutSeconds: 4
  // });

  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
})(self);
