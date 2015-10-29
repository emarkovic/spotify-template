var nextUrl;
var baseUrl = 'https://api.spotify.com/v1/search';
var myApp = angular.module('myApp', []);

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.audioObject = {}
  // This is the song that is currently being played, triggered by clicking on the album art
  $scope.currentSong = null;
  // These are the tracks that persist between multiple queries, and appear in
  // the favorites section
  $scope.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  // If you want to get REALLY fancy, then you could use localStorage so that
  // favorites don't disapear on a page refresh!

  // These are the tracks that represent the current query
  $scope.tracks = [];

  $scope.songMap = JSON.parse(localStorage.getItem('songMap')) || {};

  // Adds a given song to our favorites, so we can play it whenever we want
  $scope.addToFavorites = function(favTrack) {
    $scope.favorites.push(favTrack);
    localStorage.setItem('favorites', JSON.stringify($scope.favorites));
    var index = $scope.favorites.length - 1;
    $scope.songMap[favTrack.song] = index;
    localStorage.setItem('songMap', JSON.stringify($scope.songMap));
  }

  // Removes a given track from our favorites list
  $scope.removeFromFavorites = function(removeTrack) {
    var index = $scope.songMap[removeTrack.song];
    
    $scope.favorites.splice(index, 1);
    // $scope.songMap[removeTrack.song] = null;

    // localStorage.setItem('songMap', JSON.stringify($scope.songMap));
    localStorage.setItem('favorites', JSON.stringify($scope.favorites));
  }

  // Uses the $http service to make a request to spotify and get our songs
  $scope.getSongs = function() {
    // This makes a request to the spotify API, and then searches for the
    // input track
    $http.get(baseUrl, {
      params: {
        'q': $scope.track,
        'type': 'track'
      }
    }).then(succ, fail);

    function succ(response) {
      // THEN if everything is successful, we add the results to our view
      // console.log('successful response!');
      //full result data is written to the log so you can see what comes back
      //use the console to inspect this data to find the properties described
      //in the next comment 
      // console.log(response.data);

      // Use the response and modify the $scope.tracks variable so that it
      // contains objects with the follwing properties
      // {title: "Name of the song",
      //  img: "URL to the album cover art image",
      //  artist: "Name of the artist",
      //  preview: "URL to Audio preview"}
      //
      // You can name those properties whatever you want BUT the play()
      // function expects the preview property.
      // Hint: lodash can make creating this object pretty easy :)
      $scope.tracks = [];
      var songs = response.data.tracks.items;
      
      songs.forEach(function (song) {
        console.log(song.album.images[0].url);
        $scope.tracks.push({
          albumImg : song.album.images[0].url,
          preview : song.preview_url,
          song : song.name,
          artist : song.artists[0].name
        });      
      });
    }

    function fail(response) {
      // But if it fails, we print a little error message to the console.
      console.error('Spotify returned an error: ' + response.data.error.message);
    }

  }

  // Plays the selected track
  $scope.play = function(track) {
    if($scope.currentSong === track) {
      $scope.audioObject.pause();
      $scope.currentSong = false;
      return;
    }
    else {
      if ($scope.audioObject.pause !== undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(track.preview);
      $scope.audioObject.play();
      $scope.currentSong = track;
    }
  }
});
