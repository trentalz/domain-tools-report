// This script will iterate over a list of URLs and check the expiry date of the SSL certificate. It will then create a html file with the results.
// The list of URLs is stored in a text file called domain-list.txt

// Load the required modules
const fs = require('fs');
const https = require('https');

const urlFile = 'domain-list.txt';
const outputFile = 'index.html';


// Create the initial html file
function createInitialHtml() {
    let initialHtml = '<html>\n<head>\n<title>SSL Certificate Expiry Dates</title>\n</head>\n<body>\n';
    fs.writeFile(outputFile, initialHtml, function(err) {
        if (err) {
            console.log(err);
        }
    });
}


// Append the expiry date to the html file
function appendHtml(url, expiryDate) {
    let expiryHtml = '\n <p>The SSL certificate for ' + url + ' expires on ' + expiryDate + '</p>';
    console.log('appendHtml: ' + expiryHtml + url + expiryDate);
    fs.appendFile(outputFile, expiryHtml, function(err) {
        if (err) {
            console.log(err);
        }
    });
}


// Loop through the list of URLs in the file and build the html file
function iterateOverURLs() {
    let urlList = fs.readFileSync(urlFile).toString().split('\n');
    for (var i = 0; i < urlList.length; i++) {
        let url = urlList[i];
        // Get expiry date of the SSL certificate
        console.log('Url is currently: ' + url);
        let expiryDateResult = checkExpiry(url);
        console.log('Expiry date is: ' + expiryDateResult);
        appendHtml(url, expiryDateResult);
    };
};


// Check expiry date of the given URL. Return the expiry date as a string.
function checkExpiry(url) {
    let expiryDate = '';
    https.get(url, function(res) {
        let cert = res.connection.getPeerCertificate();
        let expiryDate = cert.valid_to;
        console.log('https get url function ' + url + ': ' + expiryDate); // Looks good
        // Debug: Make expiryDate available to the outside function? This isn't working
        return expiryDate;
    }).on('error', function(e) {
        console.log('https get url error: ' + e.message);
    }).end();
    console.log('Outside expiry= ' + expiryDate); // expirydate variable is still empty here

    // TODO: Need to wait for the https.get to finish before returning the expiry date
    // How do we get the expiryDate variable from within the above https.get function?
    return expiryDate;
};


// Complete the html file
function completeHtml() {
    let finalHtml = '</body></html>';
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

