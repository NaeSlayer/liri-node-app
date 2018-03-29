require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");


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
        spotifyThis(input);
        break;

    case "movie-this":
        omdb(input);
        break;

    case "do-what-it-says":
        doTheThing();

}

function tweet() {
    var params = {
        screen_name: 'LanaeSlayer'
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {


                console.log("");
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                console.log("");
                console.log("<-------------------------------------------->");
            }
        }
    });

}


function spotifyThis(input) {
    console.log("hello");


    spotify.search({
        type: 'track',
        query: input,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("<-------------------------------------------->");
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Album Name: " + data.tracks.items[0].album.name);
        console.log("Preview Link: " + data.tracks.items[0].preview_url);
        console.log("< -------------------------------------------->");;
    });
}

function omdb(input) {
    input = input.replace(' ', '+');
    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {
        var data = JSON.parse(body)
        // If the request is successful
        if (!error && response.statusCode === 200) {

            console.log("Title: " + data.Title)
            console.log("Release Year: " + data.Year);
            console.log("IMDB Rating: " + data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
            console.log("Country: " + data.Country);
            console.log("Language: " + data.Language);
            console.log("Plot: " + data.Plot);
            console.log("Actors: " + data.Actors);

        }

    })
}