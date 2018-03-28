require("dotenv").config();

var keys = require("keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var request = require("request");

var command = process.argv[2];
var input = process.argv[3];

// The switch-case will direct which function gets run.
switch (command) {
    case "my-tweets":
        tweet();
        break;

    case "spotify-this-song":
        spotify();
        break;

    case "movie-this":
        omdb();
        break;

    case "do-what-it-says":
        doTheThing();

}