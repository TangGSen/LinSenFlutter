'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "509835d0947d70e9e411f4581769561e",
"index.html": "9c586d09e2a9ce8e0489c5450491ded6",
"/": "9c586d09e2a9ce8e0489c5450491ded6",
"main.dart.js": "d37de891711995ab8f100939275a19c3",
"flutter.js": "a85fcf6324d3c4d3ae3be1ae4931e9c5",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "67ed645364ba7adde2383f6b8525f71c",
"assets/AssetManifest.json": "99d9b35f323cb027001834f91eb01f6d",
"assets/NOTICES": "fdf4d645722c011fedf04510ed1fd62f",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/popular_destinations/destination_3.png": "1ab5f9965a979dfb1146418437d7c453",
"assets/assets/popular_destinations/destination_2.png": "aa92b9f541ad5ebd7ab3b120cc026423",
"assets/assets/popular_destinations/destination_1.png": "91c8e234bedec6d22b2d228612eed7a8",
"assets/assets/salty_logo.png": "c87a98ddcf835f8e9b87dc9c4468f5b2",
"assets/assets/guy_taking_selfie.png": "6dd47102ac2eee91dc175d09d7390e6f",
"assets/assets/social/instagram.png": "cf17ec08942708292b9cc68f9c60bcec",
"assets/assets/social/twitter.png": "42d7f0653256393c98ed9f236f2d4839",
"assets/assets/social/facebook.png": "74d8388ebe02b0667492efe8a37cd1f4",
"assets/assets/header_image.png": "09fbf4d6ae8ef8b2cd67479e4b6f28be",
"assets/assets/icons/location_pin.png": "922e766cbee23acb87bebc06737a4e09",
"assets/assets/icons/substract_icon.png": "7a692d96d9743bb4fa4ff287a3a304c8",
"assets/assets/icons/search_icon.png": "3bfcc23d8863546da5bea07ac5be232c",
"assets/assets/icons/send_icon.png": "6e6978ae0e3e7d1bb02253c6b5130652",
"assets/assets/icons/cellular_signal.png": "31e60c70b01d432873903dfa48694e19",
"assets/assets/icons/calendar.png": "f6ddc7ea1dd35228ce6a6c0f76d23c85",
"assets/assets/icons/star_inside_circle.png": "107f54a3532e9b684a17a786d745d8e5",
"assets/assets/Intersect.png": "5e9389ae5508909254f64f4f92ab048c",
"assets/assets/categories/desert.png": "bfd02ffaf35a157aff55cb9c1d677615",
"assets/assets/categories/temple.png": "13348cb1ebbbe986387b52a08e8d07fa",
"assets/assets/categories/tower.png": "2bf17dee9c3a1a3805a9a2208e6899d1",
"assets/assets/categories/beach.png": "4aa31ca712e413cd96336b3aec17359c",
"assets/assets/categories/mountain.png": "751ecccd0714a8d03258e4013c553188",
"assets/assets/categories/pyramid.png": "f5d2eb516192e208dee70293b9fa4c36",
"assets/assets/boy.png": "08344c0c6a1143422e3caf425c8f6a00",
"assets/assets/top_destinations/top_destination_6.png": "5d1f4ab17b3451fe246c2833adfb3ff9",
"assets/assets/top_destinations/top_destination_5.png": "592b7a37626dc5efcf9bc28543269bf0",
"assets/assets/top_destinations/top_destination_4.png": "368ba8f32b6ddf0d7b51d1572db387c6",
"assets/assets/top_destinations/top_destination_1.png": "b95c6caf091051a330d4457891685eae",
"assets/assets/top_destinations/top_destination_3.png": "f1414d28aec49656215330d92f8afedb",
"assets/assets/top_destinations/top_destination_2.png": "2a9dbdb58dc95ae79c3c64c3581f5b9e",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
