import fs from 'fs';
import readline from 'readline';
import {
  google
} from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first time.
const TOKEN_PATH = './config/token.json';

// Load client secrets from a local file.
fs.readFile('./config/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);

  // authorize(JSON.parse(content), listFiles);
  // authorize(JSON.parse(content), uploadFile);
  authorize(JSON.parse(content), getFile);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = (credentials, callback) => {

  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));

    /* list files and upload file */
    // callback(oAuth2Client);

    /* get file */
    callback(oAuth2Client, '1LuMlaNIBX6IRIw6QhY1FF4CV4Nom072B'); 
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
const getAccessToken = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const listFiles = (auth) => {
  const drive = google.drive({
    version: 'v3',
    auth
  });

  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}

// Upload file to Google Drive
const uploadFile = (auth) => {
  const drive = google.drive({
    version: 'v3',
    auth
  });
  const folderId = '1S-uTMbVLUEEsjONWePdprpjz7K4ASLs2';
  const fileMetadata = {
    'name': 'me.jpg',
    parents: [folderId]
  };
  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream('./data/me.jpg')
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res.data);
    }
  });
}

// Find single file from Google Drive using file ID
const getFile = (auth, fileId) => {
  const drive = google.drive({
    version: 'v3',
    auth
  });
  drive.files.get({
    fileId: fileId,
    fields: '*'
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const fileData = {
      "id": res.data.id,
      "name": res.data.name,
      "mimeType": res.data.mimeType,
      "webViewLink": res.data.webViewLink,
      "size": res.data.size
    }
    console.log(fileData);
  });
}