var nextUrl;
var baseUrl = 'https://api.spotify.com/v1/search';
var myApp = angular.module('myApp', []);

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
	$scope.audioObject = {}

	// This is the song that is currently being played, triggered by clicking on the album art
	$scope.currentSong = null;

	// These are the tracks that persist between multiple queries, and appear in
	// the favorites section
	$scope.favorites = JSON.parse(localStorage.getItem('favorites')) || {};

	// These are the tracks that represent the current query
	$scope.tracks = [];

	$scope.nameMap = JSON.parse(localStorage.getItem('songMap')) || {};

	// Adds a given song to our favorites, so we can play it whenever we want
	$scope.addToFavorites = function(track) {
		$scope.favorites[track.name] = track;
		localStorage.setItem('favorites', JSON.stringify($scope.favorites));
	}

	// Removes a given track from our favorites list
	$scope.removeFromFavorites = function(track) {
		delete $scope.favorites[track.name];
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
			$scope.tracks = [];
			var songs = response.data.tracks.items;
			
			songs.forEach(function (song) {				
				$scope.tracks.push({
					albumImg : song.album.images[0].url,
					preview : song.preview_url,
					name : song.name,
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
