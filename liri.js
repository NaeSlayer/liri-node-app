// setting up require functions for node.js packages

require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");

// keys required for spotify and twitter
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// these variables store in user inputs
var command = process.argv[2];
var input = process.argv[3];

// this message displays if <node liri.js> is entered into the command line
if (!command) {
    console.log("Welcome to LIRI! \nLIRI is a Language Interpretation and Recognition Interface. \nLIRI will display tweets or search for movies or songs. \nEnter <node liri.js my-tweets> to display Tweets \nEnter <node liri.js spotify-this-song song-name> to display songs \nEnter <node liri.js movie-this movie-title> to display movies")

}


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
// This function displays the last 20 tweets for the screen_name entered
function tweet() {
    var params = {
        screen_name: 'LanaeSlayer'
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            // This array will hold the data that will be appended to log.txt
            data = [];

            for (var i = 0; i < tweets.length; i++) {


                console.log("");
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                console.log("");
                console.log("<-------------------------------------------->");
                data.push({
                    time: tweets[i].created_at,
                    text: tweets[i].text
                })

            }
            logData(data)

        }
    });

}

// This function searches for the song name entered
function spotifyThis(input) {
    if (!input) {
        input = "All that she wants";
    }

    spotify.search({
        type: 'track',
        query: input,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // This array will hold the data that will be appended to log.txt
        var songs = [];
        for (var i = 0; i < 4; i++) {
            var song = data.tracks.items[i]
            // this pushes the song information to the songs array
            songs.push({
                "Artist": song.artists[0].name,
                "Song Name": song.name,
                "Album Name": song.album.name,
                "Preview Link": song.preview_url
            })
            console.log("Artist: " + song.artists[0].name);
            console.log("Song Name: " + song.name);
            console.log("Album Name: " + song.album.name);
            console.log("Preview Link: " + song.preview_url);
            console.log("< -------------------------------------------->");
        }
        logData(songs);
    });
}
// This function sends a request to the OMDB API and returnd movie information. If not movie title is entered it will return information for Mr.Nobody
function omdb(input) {
    if (!input) {
        input = "Mr. Nobody";
    }
    input = input.replace(' ', '+');
    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {
        var data = JSON.parse(body)
        var movie = [];
        // If the request is successful
        if (!error && response.statusCode === 200) {

            movie.push({
                "Title": data.Title,
                "Release Year": data.Year,
                "IMDB Rating": data.imdbRating,
                "Rotten Tomatoes Rating": data.Ratings[1].Value,
                "Country": data.Country,
                "Language": data.Language,
                "Plot": data.Plot,
                "Actors": data.Actors

            })

            console.log("Title: " + data.Title)
            console.log("Release Year: " + data.Year);
            console.log("IMDB Rating: " + data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
            console.log("Country: " + data.Country);
            console.log("Language: " + data.Language);
            console.log("Plot: " + data.Plot);
            console.log("Actors: " + data.Actors);

            logData(movie);

        }

    })
}
// This function uses the 'fs' node package to take text from inside random.text and then use it to call one of LIRI's commands
function doTheThing() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        spotifyThis(dataArr[1])



    });
}
// This function appends everything that is logged in the console to log.txt
function logData(data) {
    fs.appendFile('log.txt', "\n" + JSON.stringify(data), function (error) {
        if (error) {
            throw error;
        }
        console.log('The "data" was appended to file!');
    });

}