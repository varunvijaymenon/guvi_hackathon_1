
// Client ID and API key from the Developer Console
var CLIENT_ID = '601448403709-itvdohbkpqit3supn99shk7evvussok5.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDhE_H2KuoS-5FbmGDhnZDG2p5Ilt6Im9g';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/gmail.compose';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
}).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
}, function(error) {
    appendPre(JSON.stringify(error, null, 2));
});
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    // listLabels();
//   getInbox();
//   get_drafts();
    // try_messages();
//   send_message()
} else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
var pre = document.getElementById('content');
var textContent = document.createTextNode(message + '\n');
pre.appendChild(textContent);
}

/**
 * Print all Labels in the authorized user's inbox. If no labels
 * are found an appropriate message is printed.
 */
function listLabels() {
gapi.client.gmail.users.labels.list({
    'userId': 'me'
}).then(function(response) {
    var labels = response.result.labels;
//   console.log(labels);
    appendPre('Labels:');

    if (labels && labels.length > 0) {
    for (i = 0; i < labels.length; i++) {
        var label = labels[i];
        appendPre(label.name + " " +label.id)
    }
    } else {
    appendPre('No Labels found.');
    }
});
}


function getInbox(){

gapi.client.gmail.users.labels.get({
    'userId': 'me',
    'id': 'INBOX'
}).then(function(response) {
    var inbox = response.result;
//   console.log(inbox);
    var total_unread = inbox.messagesUnread;
    var total_messages = inbox.messagesTotal;
});

}

function message_list_caller() {
    return new Promise(resolve => {
        resolve(gapi.client.gmail.users.messages.list({
            "userId" : "me",
            'labelIds': 'INBOX',
            "maxResults" : 10
        }))
    });
}


function message_caller(message_id){
    return new Promise(resolve => {
        resolve(gapi.client.gmail.users.messages.get({
            "userId" : "me",
            "id" : message_id
        }))
    });
}

async function try_messages(){
    // console.log("executing")
    var inbox_content =[];
    var sent_content = [];
    const message_list = await message_list_caller();
    let message_ids = message_list.result.messages;


    for(let i = 0; i < message_ids.length; i++){
        const message = await message_caller(message_ids[i].id);
        let cleaned_message = message.result.snippet.replace(/\u200C/g, '').trim();
        if (cleaned_message.length < 1){
            cleaned_message = "Empty Message"
        }
        // inbox_content.push(cleaned_message)
        inbox_content += `<div class='row'>
                          <div class='message'>
                          <p> ${cleaned_message} </p>
                          </div>
                          </div>`;
    }

    // console.log(inbox_content);
    

    document.querySelector(".selection-box").innerHTML = inbox_content;

    document.querySelector(".selection-box").setAttribute("style", "background-color: 0.1em solid black;")

}
    

function draft_list_caller() {
    return new Promise(resolve => {
        resolve(gapi.client.gmail.users.drafts.list({
            "userId" : "me",
            'labelIds': 'DRAFT',
            "maxResults" : 10
        }))
    });
}

function draft_caller(draft_id){
    return new Promise(resolve => {
        resolve(gapi.client.gmail.users.drafts.get({
            "userId" : "me",
            "id" : draft_id
        }))
    });
}

async function get_drafts(){

    var draft_content = [];

    const draft_list = await draft_list_caller();
    let draft_ids = draft_list.result.drafts;

    for (let i=0; i<draft_ids.length; i++){

        const draft = await draft_caller(draft_ids[i].id);

        // console.log(draft);
        let cleaned_draft = draft.result.message.snippet.replace(/\u200C/g, '').trim();
        if (cleaned_draft.length < 1){
            cleaned_draft = "Empty Message"
        }

        draft_content += `<div class='row'>
                          <div class='message'>
                          <p> ${cleaned_draft} </p>
                          </div>
                          </div>`;
    }

    // console.log(draft_content);
    

    document.querySelector(".selection-box").innerHTML= draft_content;

    document.querySelector(".selection-box").setAttribute("style", "background-color: 0.1em solid black;")
}



function sent_list_caller() {
    return new Promise(resolve => {
        resolve(gapi.client.gmail.users.messages.list({
            "userId" : "me",
            'labelIds': 'SENT',
            "maxResults" : 10
        }))
    });
}

function sent_caller(sent_id){
    return new Promise(resolve => {
        resolve(gapi.client.gmail.users.messages.get({
            "userId" : "me",
            "id" : sent_id
        }))
    });
}

async function get_sent(){

    var sent_content = [];

    const sent_list = await sent_list_caller();

    // console.log(sent_list)
    let sent_ids = sent_list.result.messages;

    for (let i=0; i<sent_ids.length; i++){

        const sent = await sent_caller(sent_ids[i].id);

        // console.log(sent);
        let cleaned_sent = sent.result.snippet.replace(/\u200C/g, '').trim();

        if (cleaned_sent.length < 1){
            cleaned_sent = "Empty Message"
        }
        // inbox_content.push(cleaned_message)
        sent_content += `<div class='row'>
                          <div class='message'>
                          <p> ${cleaned_sent} </p>
                          </div>
                          </div>`;
    }

    // console.log(sent_content);
    

    document.querySelector(".selection-box").innerHTML= sent_content;
}





function send_message(){

    let message = composeEmail();

    const encodedMessage = btoa(message).replace(/\+/g, '-').replace(/\//g, '_')

    gapi.client.gmail.users.messages.send({
        userId : "me",
        resource : {
            raw : encodedMessage
        }
    }).then(function() {
        // console.log("done!!");
        document.querySelector(".index-buttons.sender").innerText = `Sent`;
    });
}
