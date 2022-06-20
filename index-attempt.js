// This script will iterate over a list of URLs and check the expiry date of the SSL certificate. It will then create a html file with the results.
// The list of URLs is stored in a text file called domain-list.txt

// Load the required modules
const fs = require('fs');
const https = require('https');

const urlFile = 'domain-list.txt';
const outputFile = 'index.html';


// Create the initial html file
function createInitialHtml() {
    var initialHtml = '<html>\n<head>\n<title>SSL Certificate Expiry Dates</title>\n</head>\n<body>\n';
    fs.writeFile(outputFile, initialHtml, function(err) {
        if (err) {
            console.log(err);
        }
    });
}


// Append the expiry date to the html file
function appendHtml(url, expiryDate) {
    var expiryHtml = '\n <p>The SSL certificate for ' + url + ' expires on ' + expiryDate + '</p>';
    console.log('appendHtml: ' + expiryHtml + url + expiryDate);
    fs.appendFile(outputFile, expiryHtml, function(err) {
        if (err) {
            console.log(err);
        }
    });
}


// Loop through the list of URLs in the file and build the html file
function iterateOverURLs() {
    var urlList = fs.readFileSync(urlFile).toString().split('\n');
    for (var i = 0; i < urlList.length; i++) {
        var url = urlList[i];
        // Get expiry date of the SSL certificate
        console.log('Url is currently: ' + url);
        var expiryDate = checkExpiry(url);
        console.log('Expiry date is: ' + expiryDate);
        appendHtml(url, expiryDate);
    };
};


// Check expiry date of the given URL. Return the expiry date as a string.
function checkExpiry(url) {
    var expiryDate = '';
    https.get(url, function(res) {
        var cert = res.connection.getPeerCertificate();
        expiryDate = cert.valid_to;
        console.log('https get url function ' + url + ': ' + expiryDate); // Looks good
        // Make expiryDate available to the main function?
        return expiryDate;
    }).on('error', function(e) {
        console.log('https get url error: ' + e.message);
    }).end();
    console.log('Outside expiry= ' + expiryDate);

    // TODO: Need to wait for the https.get to finish before returning the expiry date
    // How do we get the expiryDate variable from within the above https.get function?
    return expiryDate;
};


// Complete the html file
function completeHtml() {
    var finalHtml = '</body></html>';
    fs.appendFile(outputFile, finalHtml, function(err) {
        if (err) {
            console.log(err);
        }
    });
};


// Main function - creates the html file, loops through the list of URLs and appends the expiry date to the html file, then completes the html file. Needs to be async.
function main() {
    // Rename an existing output file to indexold.html if it exists
    if (fs.existsSync(outputFile)) {
        fs.rename(outputFile, 'indexold.html', function(err) {
            if (err) {
                console.log(err);
            }
        });
    }; 
    createInitialHtml();
    iterateOverURLs();
    completeHtml();
}


// This is the main function that will be called by the script.
main();

