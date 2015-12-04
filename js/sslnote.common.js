// @codekit-prepend "jquery.js"
'use strict';

localStorage.debugging = 'false';

localStorage.checkStrongPassword = 'false';

localStorage.setItem('whatsnew',
    'V1.12.20 Aapnpassing inlog scherm, 3 foutive inlog pogingen App locked<BR>' +
 '');

// localStorage.setItem('whatsnew',
//     'V1.12.19 Doe een nieuwe SETUP en maak een herstel Pincode aan!<BR>' +
//     '-Login Noteer je UID! en doe SETUP, kies "i have a UID", je PINCODE is "0000" deze pas je aan aan het einde van de SETUP.<BR>' +
//     '-Pincode en UID voor herstellen op andere device.<BR>' +
//     '-app aangepast naar Engels voorbereiding voor meerdere talen.<BR>' +
//     '-icoons verwijderd bij settings.<BR>' +
//     '-Reminder Push meldingen ongelezen berichten om de 5 Minuten.<BR>' +
//     '-Paswoord sterkte controle.(nog niet actief)<BR>' +
//     '-PEM icoons aangepast nieuw letter type.<BR>' +
//     '-BUG in Shake verholpen.<BR>' + '');

var Appversion = '1.12.25';

var sslnoteversion = 'PEM V' + Appversion;

localStorage.setItem('sslnoteversion', sslnoteversion);
localStorage.setItem('App', 'PEM');


var $$ = Dom7;

// var demoversion = 'yes';

var loggedIn;

var cryptingStarted;

var loop;

var userLoggedIn = false;

var myContactList;

var myMessagesList;


if(!localStorage.getItem('loginfails')){
    localStorage.setItem('loginfails', '0');
}



var sslnote = new Framework7({

    // debug: true,
    // cache: true,
    // domCache: true,
    // cacheDuration: 1000,
    swipeBackPage: false,
    swipeBackPageAnimateShadow: false,
    swipeBackPageAnimateOpacity: false,
    allowSwipeout: true,
    modalTitle: unescape('PEM'),
    router: true,
    //reloadPages:true,
    onAjaxStart: function(xhr) {
        // sslnote.showIndicator();
    },
    onAjaxComplete: function(xhr) {
        sslnote.hideIndicator();
    },
    onAjaxError: function(xhr) {
        sslnote.hideIndicator();
        console.log('HIDE Indicator on AJAX Error');
        console.error(xhr + new Error().stack);
    },
    onPageInit: function(app, page) {
        console.log('----- Check userLoggedIn');
    },



});




if (!localStorage.getItem('sslnoteapp')) {
    var sslnoteapp = 'Lite';
    localStorage.setItem('sslnoteapp', sslnoteapp);
}

if (!localStorage.getItem('cLANGUAGE')) {
    localStorage.setItem('cLANGUAGE', 'en');
}

var myMessagesList;

var updateCounterTimer = '';

var supportUID = 'EX5L9271J1';
localStorage.setItem('supportUID', supportUID);

var supportserver = '1001';
localStorage.setItem('supportserver', supportserver);

var testUID = 'D3UE52U1MD';
localStorage.setItem('testUID', testUID);

var testNick = 'TEST (ROBOT)';
localStorage.setItem('testNick', testNick);


var testserver = '1001';
localStorage.setItem('testserver', testserver);


var pushserver = 'http://push.sslnoteserver.com/index.php?';
localStorage.setItem('pushserver', pushserver);

var VPN = 'http://1001.sslnoteserver.com';

localStorage.setItem('connection', VPN);



// bug fix als shake is nul komt in loop
        //localStorage.setItem('f7form-settings-shake', '{"shakeon":["on"],"shakesensitivity":"50"}');

// bij message schrijven logoff ver uit zetten


var onShake = function() {
    console.log('--- WE HAVE A SHAKE ---');

    updateCounter('0', 'stop');
    var shakesensitivity = '100';
    console.log('+++!!! COUNTER STOP Page loaded');

    sslnote.hideIndicator();
    sslnote.hidePreloader();
    sslnote.closeModal();
            

    sessionStorage.clear();

    clearTimeout(loop);

    $("#connection").addClass("connectionHidden");

    $(".statusbar-overlay").addClass("black");

    // sslnote.loginScreen();

    localStorage.setItem('reLoggin', '1');

    window.location.reload();



};


var ptrContent = $$('.pull-to-refresh-content');
var timeouts = [];

var contactsview = sslnote.addView('.view-main', {
    dynamicNavbar: true,
    // swipeoutOverswipe:false
});


var messagesview = sslnote.addView('.view-messages', {
    dynamicNavbar: true,
    animatePages: false,
    actionsCloseByOutside: false
});


var settingsview = sslnote.addView('.view-settings', {
    dynamicNavbar: true,
    //domCache: true
});


var setupview = sslnote.addView('.view-setup', {
    dynamicNavbar: true
});

var interval;






var createUID = "CREATE TABLE IF NOT EXISTS uid (id INTEGER PRIMARY KEY AUTOINCREMENT,uid TEXT,sslnoteapp TEXT,pass TEXT,account_id INTEGER,active INTEGER ,pass_reset INTEGER,inactive_time DATETIME,active_last DATETIME,my_nick TEXT,settpass INTEGER,logins INTEGER,reactivatecode TEXT,token TEXT,sound TEXT,volume TEXT,repeatpush INTEGER,device TEXT,maxlink INTEGER,language TEXT,server TEXT,running TEXT)";

var createUIDLinks = "CREATE TABLE IF NOT EXISTS uid_links (id INTEGER PRIMARY KEY AUTOINCREMENT,my_uid TEXT,his_uid TEXT UNIQUE, his_nick TEXT, his_server TEXT,autocrypt INTEGER,autocryptkey TEXT,online TEXT,badge TEXT,totalmessages TEXT,nuonline TEXT)";

var dropUIDLinks = "DROP TABLE uid_links";

var createUIDMessagesSend = "CREATE TABLE IF NOT EXISTS uid_messages_send (mid INTEGER PRIMARY KEY AUTOINCREMENT,my_uid TEXT,his_uid TEXT, his_server TEXT ,message BLOB,mdatum DATETIME DEFAULT CURRENT_TIMESTAMP UNIQUE,read INTEGER)";

var createUIDMessagesReceive = "CREATE TABLE IF NOT EXISTS uid_messages_receive (mid INTEGER PRIMARY KEY AUTOINCREMENT,my_uid TEXT,his_uid TEXT,message BLOB,mdatum DATETIME DEFAULT CURRENT_TIMESTAMP UNIQUE,read INTEGER)";

var insertUID = "INSERT INTO uid (uid, sslnoteapp, pass, account_id, active, pass_reset, my_nick, settpass, logins, reactivatecode, sound, volume, repeatpush, device, maxlink, language, server, running) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

var insertUIDLinks = "INSERT INTO uid_links (my_uid,his_uid,his_nick,his_server,autocrypt,online,badge,totalmessages) VALUES (?,?,?,?,?,?,?)";

var insertUIDMessagesReceive = "INSERT INTO uid_messages_receive (my_uid,his_uid,message,mdatum,read) VALUES (?,?,?,?,?)";

var insertUIDMessagesSend = "INSERT INTO uid_messages_send (my_uid,his_uid,his_server,message,mdatum,read) VALUES (?,?,?,?,?,?)";

var insertMessagesToReceive = "INSERT INTO uid_messages_receive (my_uid,his_uid,message,mdatum,read) VALUES (?,?,?,?,?)";

var selectUID = "SELECT * FROM uid WHERE uid = ?";

var selectTotalMessages = "SELECT COUNT(*) AS totalmessages FROM uid_messages_receive WHERE read < 10";

var selectTotalDataBaseMessagesReceived = "SELECT COUNT(*) AS totalDataBaseMessagesReceived FROM uid_messages_receive";
var selectTotalDataBaseMessagesSend = "SELECT COUNT(*) AS totalDataBaseMessagesSend FROM uid_messages_send";

var selectUIDLinks = "SELECT my_uid,his_uid,his_nick,his_server,autocrypt,autocryptkey,online,badge,totalmessages,nuonline FROM uid_links WHERE my_uid = ? ORDER BY online DESC";

var selectMessagesList = "SELECT my_uid,his_uid,his_nick,his_server,autocrypt,online,badge,totalmessages,nuonline FROM uid_links WHERE my_uid = ? AND totalmessages >= 1 ORDER BY totalmessages DESC, online DESC";

var selectUIDMessagesReceive = "SELECT mid,my_uid,his_uid,message,mdatum,sms_active,sms_id,read FROM uid_messages_receive WHERE his_uid = ? ORDER BY mdatum DESC";

var selectMID = "SELECT * FROM uid_messages_receive WHERE my_uid = ? AND his_uid = ? ORDER BY read ASC";

var selectAlleMessagesXX = "SELECT * FROM uid_messages_receive ORDER BY mdatum DESC";

var selectAlleMessages = "SELECT uid_messages_receive.mid,uid_messages_receive.my_uid, uid_messages_receive.his_uid,uid_messages_receive.message, uid_messages_receive.mdatum,uid_messages_receive.read, uid_links.his_nick, uid_links.autocrypt, uid_links.autocryptkey, uid_links.nuonline FROM uid_messages_receive, uid_links  WHERE uid_messages_receive.his_uid = uid_links.his_uid ORDER BY uid_messages_receive.mdatum DESC";

var selectMessages = "SELECT uid_messages_receive.mid,uid_messages_receive.my_uid, uid_messages_receive.his_uid,uid_messages_receive.message, uid_messages_receive.mdatum,uid_messages_receive.read, uid_links.his_nick, uid_links.autocrypt, uid_links.autocryptkey, uid_links.nuonline FROM uid_messages_receive, uid_links  WHERE uid_messages_receive.his_uid = uid_links.his_uid AND uid_messages_receive.mdatum = ? AND uid_messages_receive.his_uid = ?";

var selectMIDByMid = "SELECT uid_messages_receive.mid, uid_messages_receive.message, uid_messages_receive.mdatum, uid_links.his_server, uid_links.his_nick, uid_links.his_uid FROM uid_messages_receive, uid_links WHERE uid_messages_receive.his_uid = uid_links.his_uid AND uid_messages_receive.mid = ? ";

var JsonUIDMessagesToSend = "SELECT mid,my_uid,his_uid,his_server,message,mdatum FROM uid_messages_send WHERE my_uid = ? LIMIT 1";

var selectUIDLinksByHisUID = "SELECT his_uid FROM uid_links WHERE my_uid = ? ";

var syncUIDLinks = "SELECT my_uid,his_uid,his_nick,autocrypt FROM uid_links WHERE my_uid = ?";

var removeMessagesToSend = "DELETE FROM uid_messages_send WHERE mid = ?";

var removeMessagesToReceive = "DELETE FROM uid_messages_receive WHERE mid = ?";

var removeUIDlinks = "DELETE FROM uid_links WHERE his_uid = ?";

var removeMessagesByTmeDate = "DELETE FROM uid_messages_receive WHERE his_uid = ? AND mdatum = ?";

var updateTotalMessages = "UPDATE uid_links SET totalmessages = (SELECT COUNT(*) AS totalmessages FROM uid_messages_receive WHERE uid_messages_receive.his_uid = uid_links.his_uid)";

var updateBadgeToZero = "UPDATE uid_links SET badge = ?";

var updateBadgeTo = "UPDATE uid_links SET badge = (SELECT COUNT(*) AS badge FROM uid_messages_receive WHERE uid_messages_receive.his_uid = uid_links.his_uid AND uid_messages_receive.read = '0') ";

var updateMessageToRead = "UPDATE uid_messages_receive SET read = ? WHERE mid = ?";

var updateMessagesSendStatus = "UPDATE uid_messages_receive SET read = ? WHERE my_uid = ? AND his_uid = ? AND mdatum = ?";

var updateKey = "UPDATE uid_links SET autocrypt = ?, autocryptkey = ? WHERE his_uid = ? ";

var updateHisNick = "UPDATE uid_links SET his_nick = ? WHERE his_uid = ? ";

var updateHLastActive = "UPDATE uid_links SET online = ? WHERE his_uid = ? ";

var updateNuonline = "UPDATE uid_links SET nuonline = ? WHERE his_uid = ? ";

var updateUIDLinks = "INSERT OR IGNORE INTO uid_links (my_uid,his_uid,his_nick,his_server,online,totalmessages) VALUES (?,?,?,?,?,?)";

var updateHisServer = "UPDATE uid_links SET his_server = ? WHERE his_uid = ?";

var updateHisOnline = "UPDATE uid_links SET online = ? WHERE his_uid = ?";

//var updateUIDLinks = "INSERT OR IGNORE INTO uid_links (my_uid,his_uid,his_nick,his_server,autocrypt,autocryptkey,online) VALUES (?,?,?,?,?,?,?)";

var insertSupportUID = "INSERT OR IGNORE INTO uid_links (my_uid,his_uid,his_nick,his_server,autocrypt,autocryptkey,online) VALUES (?,?,?,?,?,?,?)";



document.addEventListener("deviceready", init, false);


var app = {};
app.db = null;

app.openDb = function() {

    console.log('!!!ProductionVersion');

    if (window.sqlitePlugin !== undefined) {
        //app.db = window.sqlitePlugin.openDatabase("master.db");
        //app.db = window.sqlitePlugin.openDatabase("master.db", "1.0", "SSLNote", -1);



       app.db = window.sqlitePlugin.openDatabase({name: "master.db", key: "your-password-here", location: 2}, function(db) {
          db.transaction(function(tx) {
            console.log('NEW database tx: ' + JSON.stringify(tx));
          }, function(err) {
            console.log('NEW database ERROR: ' + JSON.stringify(err));
          });
        });

    } 

    else 

    {
        // For debugging in simulator fallback to native SQL Lite
        //app.db = window.openDatabase("master.db", "1.0", "SSLNote", 200000);
        //app.db = window.openDatabase("master.db", "1.0", "SSLNote", 200000);

       app.db = window.sqlitePlugin.openDatabase({name: "master.db", key: "your-password-here", location: 2}, function(db) {
          db.transaction(function(tx) {
            console.log('Open database tx: ' + JSON.stringify(tx));
          }, function(err) {
            console.log('Open database ERROR: ' + JSON.stringify(err));
          });
        });



    }
};

app.createTable = function() {
    app.db.transaction(function(tx) {
        tx.executeSql(createUID, [], onCreateSuccess, onError);
        tx.executeSql(createUIDLinks, [], onCreateSuccess, onError);
        tx.executeSql(createUIDMessagesSend, [], onCreateSuccess, onError);
        tx.executeSql(createUIDMessagesReceive, [], onCreateSuccess, onError);
    });
};

function onCreateSuccess() // Function for Handling Error...
    {
        //console.log('!!! onCreateSuccess creating');
    }

function onInsertSuccess() // Function for Handling Error...
    {

        console.log("Your onInsertSuccess SQLite query was successful!");
        return true;
    }

function onSelectSuccess() // Function for Handling Error...
    {
        console.log("Your onSelectSuccess SQLite query was successful!");
        return true;
    }

function onRemovedSuccess() // Function for Handling Error...
    {
        console.log("Your onRemovedSuccess SQLite query was successful!");
        return true;
    }

function onUpdateSuccess() // Function for Handling Error...
    {
        console.log("Your onUpdateSuccess SQLite query was successful!");
        return true;
    }

function onError(tx, error) // Function for Handeling Error...
    {
        //console.error(JSON.stringify(error));
        console.error('function onError');
        console.error(JSON.stringify(error));
        // PushErrorToSupport(JSON.stringify(error));
    }

function init() {

        //console.log('--- START SHAKE ---');

        app.openDb();
        app.createTable();

        console.log('common.js init');

        if (!localStorage.getItem('f7form-settings-shake')) {
            console.log('No shake Settings');
            localStorage.setItem('f7form-settings-shake', '{"shakeon":"on","shakesensitivity":"20"}');
            var shakeon = 'on';
            var shakesensitivity = '30';
        } 
        else 
        {
            console.log('We have Shake Settings!');
            //var storedDataShake = sslnote.formGetData('settings-shake');

            var storedDataShake =  JSON.parse(localStorage.getItem('f7form-settings-shake'));
            console.log(storedDataShake);


            var shakeon = storedDataShake.shakeon;
            console.log('shakeon = ' + shakeon);

            var shakesensitivity = storedDataShake.shakesensitivity;
            //localStorage.removeItem('f7form-settings-shake');
        }


        if (shakeon == 'on') {
           // console.log('ShakeOn');

            // var storedDataShake = sslnote.formGetData('settings-shake');
            // var shakesensitivity = storedDataShake.shakesensitivity;
            shake.startWatch(onShake, shakesensitivity);
           // console.log('shakesensitivity Set 1 = ', shakesensitivity);
        } 

        else 

        {
          //  console.log('No Shake settings On StartUp');
            var shakesensitivity = '100';
            shake.startWatch(onShake, shakesensitivity);
         //   console.log('shakesensitivity Set 2 = ', shakesensitivity);
        }

        var cLANGUAGE = sslnote.formGetData('cLANGUAGE');
        console.log('cLANGUAGE: ');
        console.log(cLANGUAGE);


    } // end pageload ready


//*************************************************************************************************************
$(document).ready(function() {
    console.log('**** Document ready online *****');

    var supportkey = calcMD5('support');
    localStorage.setItem('EX5L9271J1encryptkey', supportkey);





if (!localStorage.getItem('doneSetup')) {

        console.log('UID not set ACTIVE it');

        if (!localStorage.getItem('cLANGUAGEset')) {




            // localStorage.setItem('cLANGUAGE', 'en');

            // console.log('Language not set ACTIVE it: ',localStorage.getItem('cLANGUAGE'));


                    sslnote.modal({
                        title: 'Select language',
                        text: 'Hello Bonjour Hallo здравствуйте Hola 您好',
                        verticalButtons: true,
                        buttons: [

                        {
                            text: 'English',
                            bold: true,
                            onClick: function() {
                                localStorage.setItem('cLANGUAGE', 'en');
                                localStorage.setItem('cLANGUAGEset', true);
                                sslnote.closeModal('.login-screen');
                                setupview.loadPage('frames/setup/setupintro.html');
                                    localStorage.setItem('f7form-cLANGUAGE', '{"cLANGUAGE":"en"}');
                            }
                        }, 
                        {
                            text: '<span class="grey">Dutch</span>',
                            bold: true,
                            close:false,
                            // onClick: function() {
                            //     localStorage.setItem('cLANGUAGE', 'nl');
                            //     localStorage.setItem('cLANGUAGEset', true);
                            //     sslnote.closeModal('.login-screen');
                            //     setupview.loadPage('frames/setup/setupintro.html');
                            // }
                        }, 
                        {
                            text: '<span class="grey">Russian</span>',
                            bold: true,
                            close:false,
                            // onClick: function() {
                            //     localStorage.setItem('cLANGUAGE', 'ru');
                            //     localStorage.setItem('cLANGUAGEset', true);
                            //     sslnote.closeModal('.login-screen');
                            //     setupview.loadPage('frames/setup/setupintro.html');
                            // }
                        }, 
                        {
                            text: '<span class="grey">French</span>',
                            bold: true,
                            close:false,
                            // onClick: function() {
                            //     localStorage.setItem('cLANGUAGE', 'fr');
                            //     localStorage.setItem('cLANGUAGEset', true);
                            //     sslnote.closeModal('.login-screen');
                            //     setupview.loadPage('frames/setup/setupintro.html');
                            // }
                        }, 
                        {
                            text: '<span class="grey">Spanish</span>',
                            bold: true,
                            close:false,
                            // onClick: function() {
                            //     localStorage.setItem('cLANGUAGE', 'es');
                            //     localStorage.setItem('cLANGUAGEset', true);
                            //     sslnote.closeModal('.login-screen');
                            //     setupview.loadPage('frames/setup/setupintro.html');
                            // }
                        }, 
                        {
                            text: '<span class="grey">German</span>',
                            bold: true,
                            close:false,
                            // onClick: function() {
                            //     localStorage.setItem('cLANGUAGE', 'du');
                            //     localStorage.setItem('cLANGUAGEset', true);
                            //     sslnote.closeModal('.login-screen');
                            //     setupview.loadPage('frames/setup/setupintro.html');
                            // }
                        }, 
                        {
                            text: '<span class="grey">Chinese</span>',
                            bold: true,
                            close:false,
                            // onClick: function() {
                            //     localStorage.setItem('cLANGUAGE', 'ch');
                            //     localStorage.setItem('cLANGUAGEset', true);
                            //     sslnote.closeModal('.login-screen');
                            //     setupview.loadPage('frames/setup/setupintro.html');
                            // }
                        }, 


                        ]

                    });

        } 

        // end if no localStorage.setItem('cLANGUAGE', 'en');
        else 

        {

            console.log('**** English is set *****');

            sslnote.closeModal('.login-screen');
            setTimeout(function() {
                setupview.loadPage('frames/setup/setupintro.html');
            }, 500);
        }

    }


    $$('.contactadd').on('click', function() {
        //console.log('frames/settings/mysettings/contactadd.html');
        settingsview.loadPage('frames/settings/mysettings/contactAdd.html');
    });


    $$('.support').on('click', function() {
        $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
            "/strings.json",
            function(languageSpecificObject) {
                //languageSpecificObject.languageSpecifications[0]['howtogetsupporttext'],  
                var buttons = [{
                    text: languageSpecificObject.languageSpecifications[0]['howtogetsupporttext'],
                    label: true
                }, {
                    text: languageSpecificObject.languageSpecifications[0]['howtogetsupportbutton'],
                    onClick: function() {
                        //console.log('Add Support contact');
                        app.db.transaction(
                            function(tx) {
                                //console.log('insertSupportUID ');
                                var testonline = "2015-06-01 17:05:47";
                                console.log(testonline);
                                tx.executeSql(
                                    insertSupportUID, [localStorage.getItem('UID'), supportUID, 'SUPPORT', supportserver, '1', supportkey, testonline],
                                    onInsertSuccess, onError);
                            });
                        var posturl =
                            localStorage.getItem('connection') + '/appie/php/include/JsonInsertUIDLinks.php?sslnoteapp=' +
                            localStorage.getItem('sslnoteapp') + '&my_server=' +
                            localStorage.getItem('server') + '&my_uid=' +
                            localStorage.getItem('UID') + '&my_nick=' +
                            localStorage.getItem('UID') + '&his_uid=' +
                            supportUID + '&his_server=' + supportserver + '&his_nick=' + supportUID;
                        console.log(posturl);


                        $$.post(posturl,
                            function(data) {
                                //console.log('**************************************');
                                //console.log('POST RESPONSE INSERT');
                                console.log(data);
                                //console.log('**************************************');
                            });
                        syncUILinks();
                        SQLiteUpdateMessagesTotal();
                        sslnote.alert(languageSpecificObject.languageSpecifications[0]['howtogetsupportalert']);
                    }
                }, {
                    //text: languageSpecificObject.languageSpecifications[0]['cancel'],
                    text: 'SHOW TOUR',
                    onClick: function() {
                        localStorage.removeItem("dotour");
                        localStorage.removeItem("dotourfirstmessagesend");
                        localStorage.removeItem("dotourfirstmessage");
                        localStorage.removeItem("dotourfirstmessagedecrypt");
                        //console.log('localStorage dotour removed');
                        JsonMessagesToSend();
                    }
                }, {
                    text: languageSpecificObject.languageSpecifications[0]['cancel'],
                    color: 'red'
                }, ];

                sslnote.actions(buttons);
            }); //end getJSON
    }); // end support


    if (localStorage.getItem('UID') && (localStorage.getItem('Appversion') !== Appversion) && localStorage.getItem('doneSetup')) {


        importNewUIDLinks();

        localStorage.setItem('Appversion', Appversion);
        sslnote.modal({
            title: 'Whats new in V' + Appversion,
            text: localStorage.getItem('whatsnew'),
            buttons: [{
                text: 'OKE',
                onClick: function() {
                    // updateUIDLinksTable();
                }
            }]
        });
    }




    $$(document).on('open', '.login-screen', function(e) {

        console.log('login-screen = open');

// navigator.splashscreen.hide();


        var modal = sslnote.modal({
            // title: 'PASSWORD',
            text: '<form id="uid">' +

                '  <div class="list-block">' +
                '        <div class="loginboxPopup">' +
                '               <div class="item-inner">' +
                '                <div class="item-input">' +


                '<div class="group">' +

                // '  <input id="password" oninput="checkPasswordInput(this.value)" class="" type="password" name="password" required>' +
                '  <input id="password" class="" type="password" name="password" required>' +

// '<img src="https://cdn1.iconfinder.com/data/icons/CornerStone/PNG/arrow%20right.png" id="input_img" onClick="changeShowPassword(this.value)">'+

'<span id="input_img" onClick="changeShowPassword(this.value)"> <i id="eye" class="icon-only showPassword"></i> </span>'+

                '  <span class="highlight"></span>' +

                '  <span class="bar"></span>' +

                '  <label>PASSWORD</label>' +

                // '<div class="loginfailsbadge"><i class="icon loginboxPopup-tick-ok"></i></div>' +
                // '</div>' +


                // '<div class="loginfailsbadge badge badge-green"></div>'+ 
                // '                             </center>'+


                '<div class="loginAttemptsTxt">attempts<span class="loginAttemptsCount">(<span class="loginAttemptsCountFailer">0</span>/3)</span></div>'+ 

// '<div><center><a href="#" onClick="changeShowPassword(this.value)" class="item-link"><i id="eye" class="icon-only showPassword"></i></a></center></div>'+




                '</div>' +

                '                           </div>' +
                '                         </div>' +
                '                 </div>' +
                '        </div>' +
                '</form>',
            buttons: [
            {
                text: 'CREATE NEW',
                onClick: function() {
                    console.log('Create NEW');

                    sslnote.closeModal();

                    setupview.loadPage('frames/setup/setupintro.html');

                    // <a href="#" class="firstsetup item-link list-button activate white languagespecificHTML" data-text="SETUP">SETUP</a>
                }
            }, 
            {
                text: 'LOGIN',
                close:false,
                onClick: function() {

                    var formData = sslnote.formToJSON('#uid');
                    // console.log('#uid');
                    // console.log(formData);
                    // console.log(formData.password);

                    checkPasswordInputLogin(formData.password);

                    // sslnote.closeModal();

                    // setupview.loadPage('frames/setup/setupintro.html');

                    // <a href="#" class="firstsetup item-link list-button activate white languagespecificHTML" data-text="SETUP">SETUP</a>
                }
            }, 
            ]
        });

        var loginAttemps = parseInt(localStorage.getItem('loginfails') );
        console.log('loginAttemps: ',loginAttemps);
        $$(".loginAttemptsCountFailer").text(loginAttemps);

            


    if (localStorage.getItem('loginfails') >= '2') {

        $$('.loginAttemptsTxt').addClass('lastAttempt');

                var buttons1 = [{
                    text: 'Your LAST attempt at illegal entry,<BR>the App will be erased!',
                    label: true,
                    color: 'red',
            
                }];

                var group = [
                    buttons1,
                    // buttons2
                ];
                sslnote.actions(group);
        }

    });

    $$(document).on('opened', '.login-screen', function(e) {

        console.log('login-screen = opened');

       // navigator.splashscreen.hide();




        console.log('+++ LOAD updateUIDOnline()');

        updateUIDOnline();



        console.log('+++ LOAD makeNewMessageList(noLoad)' );

        makeNewMessageList('noLoad');


        // console.log('+++ LOAD makeNewContactList()');

        // makeNewContactList();



    });


}); // end document ready


//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************


var server = localStorage.getItem('server');


// if (localStorage.getItem('loginfails') >= '1') {
//     $('.loginfailsbadge').removeClass('badge-green');
//     $('.loginfailsbadge').addClass('badge-red');
//     $('.loginfailsbadge').text(localStorage.getItem('loginfails'));
// }

// if (localStorage.getItem('loginfails') == '0') {
//     $('.loginfailsbadge').removeClass('badge-red');
//     $('.loginfailsbadge').addClass('badge-green');
//     $('.loginfailsbadge').text(localStorage.getItem('loginfails'));
// }

$$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') + "/strings.json",
    function(languageSpecificObject) {
        $$(".languagespecificHTML").each(function() {
            $(this).html(languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
        });
        $$(".languageSpecificPlaceholder").each(function() {
            $(this).attr("placeholder", languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
        });
        $$(".languageSpecificValue").each(function() {
            $(this).attr("value", languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
        });
    });




$('#contactsview').on('show', function() {
    console.log('contactsview TAB =  ');

    localStorage.setItem('activePage', 'contacts');

    if(sessionStorage.getItem('doReload') === '1'){

        console.log('reLoad page: contacts');
        // setTimeout(function(){ 
            contactsview.router.load({
                url: 'frames/contacts/contacts.html',
                animatePages: false,
                reload:true
            });
        // },300);
    }

    else

    {

    console.log('Load page: contacts');
        contactsview.router.load({
            url: 'frames/contacts/contacts.html',
            animatePages: false
        });

    }

    sessionStorage.removeItem('doReload');


});

$('#messagesview').on('show', function() {
    console.log('showmessages TAB =  ');
    localStorage.setItem('activePage', 'messages');

    clearTimeout(loop);
    iAmOnline();

    if(sessionStorage.getItem('doReload') === '1'){
        console.log('reLoad page: messages');

        // messagesCallback.trigger();

        makeNewMessageList('reFreshYes');

            setTimeout(function(){ 

                messagesview.router.load({
                    url: 'frames/messages/messages.html',
                    animatePages: false,
                    reload:true
                });
            },300);
    }

    else

    {

    console.log('Load page: messages');
        messagesview.router.load({
            url: 'frames/messages/messages.html',
            animatePages: false
        });


    }

    sessionStorage.removeItem('doReload');


});


$('#settingsview').on('show', function() {
    console.log('showsettings TAB =  ');
    localStorage.setItem('activePage', 'settings');

    clearTimeout(loop);
    iAmOnline();

    settingsview.router.load({
        url: 'frames/settings/index.html',
        animatePages: false
    });

});



$$("body").on("click", '.HelpRequest', function(e) {

// HELP
// $$('.HelpRequest').on('click', function() {

    

    var activePage = localStorage.getItem('activePage');

    console.log('HelpRequest clicked: ',activePage);
    console.log(activePage);


if(activePage ==='messages'){

           // 10 = pending
        // 20 = send
        // 30 = delivered
        // 40 = read
        // 50 = wiped
        // 60 = replied

    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {

            // sslnote.showPreloader(languageSpecificObject.languageSpecifications[0]['HIDE_SELECTED_STATUS']);



        var modal = sslnote.modal({
            title: languageSpecificObject.languageSpecifications[0]['HELP_MESSAGES'],

            afterText: ' <form id="settings-showMessageStatus" class="store-data">' +
                ' <div class="showmessagesstatus list-block contacts-block">' +
                '<ul>' +

                '<li>' +
                // '<label class="label-checkbox item-content">' +
                // ' <input type="checkbox" name="show" value="10" >' +
                // ' <div class="item-media">' +
                // '  <i class="icon icon-form-checkbox"></i>' +
                // ' </div>' +
                ' <div class="item-inner">' +
                ' <div class="item-title languagespecificHTML" data-text="pending">PENDING</div>' +
                '<div class="item-after"><i class="icons_sendstatus pending"></i></div>' +
                ' </div>' +
                // ' </label>' +
                '  </li>' +

                '<li>' +
                // '<label class="label-checkbox item-content">' +
                // ' <input type="checkbox" name="show" value="20" >' +

                // ' <div class="item-media">' +
                // '  <i class="icon icon-form-checkbox"></i>' +
                // ' </div>' +

                ' <div class="item-inner">' +
                ' <div class="item-title languagespecificHTML" data-text="send">SEND</div>' +
                '<div class="item-after"><i class="icons_sendstatus send"></i></div>' +
                ' </div>' +

                // ' </label>' +
                '  </li>' +

                '  <li>' +
                // ' <label class="label-checkbox item-content">' +
                // '  <input type="checkbox" name="show" value="30" >' +
                // ' <div class="item-media">' +
                // '   <i class="icon icon-form-checkbox"></i>' +
                // ' </div>' +
                ' <div class="item-inner">' +
                ' <div class="item-title languagespecificHTML" data-text="delivered">DELIVERED</div>' +
                '<div class="item-after"><i class="icons_sendstatus delivered"></i></div>' +
                ' </div>' +
                // '  </label>' +
                '  </li>' +

                '   <li>' +
                // ' <label class="label-checkbox item-content">' +
                // '  <input type="checkbox" name="show" value="40" >' +
                // ' <div class="item-media">' +
                // '   <i class="icon icon-form-checkbox"></i>' +
                // '  </div>' +

                '  <div class="item-inner">' +
                ' <div class="item-title languagespecificHTML" data-text="read">READ</div>' +
                '<div class="item-after"><i class="icons_sendstatus read"></i></div>' +
                '  </div>' +

                // ' </label>' +
                '  </li>' +





                '   <li>' +
                // ' <label class="label-checkbox item-content">' +
                // '  <input type="checkbox" name="show" value="40" >' +
                // ' <div class="item-media">' +
                // '   <i class="icon icon-form-checkbox"></i>' +
                // '  </div>' +

                '  <div class="item-inner">' +
                ' <div class="item-title languagespecificHTML" data-text="new_message">NEW MESSAGE</div>' +
                '<div class="item-after"><i class="icons_new_message"><svg viewBox="0 0 27.5 27.5">'+
'<circle class="blink new" cx="12" cy="12" r="6"/>'+
'</svg></i></div>' +
                '  </div>' +


                // ' </label>' +
                '  </li>' +
                '   <li>' +
                // ' <label class="label-checkbox item-content">' +
                // '  <input type="checkbox" name="show" value="40" >' +
                // ' <div class="item-media">' +
                // '   <i class="icon icon-form-checkbox"></i>' +
                // '  </div>' +

                '  <div class="item-inner">' +
                ' <div class="item-title languagespecificHTML" data-text="saved_personal_key">SAVED PERSONAL KEY</div>' +
                '<div class="item-after"><i class="icons_secretkey active"></i></div>' +
                '  </div>' +

                // ' </label>' +
                '  </li>' +
                '   <li>' +
                // ' <label class="label-checkbox item-content">' +
                // '  <input type="checkbox" name="show" value="40" >' +
                // ' <div class="item-media">' +
                // '   <i class="icon icon-form-checkbox"></i>' +
                // '  </div>' +

                '  <div class="item-inner">' +
                ' <div class="item-title languagespecificHTML" data-text="no_personal_key">NO PERSONAL KEY</div>' +
                '<div class="item-after"><i class="icons_secretkey"></i></div>' +
                '  </div>' +

                // ' </label>' +
                '  </li>' +





                '  <input type="hidden" name="show" value="100" >' +


                '  </ul>' +
                '  </div>' +
                '  </form>',
            buttons: [{
                text: languageSpecificObject.languageSpecifications[0]['OKE']
            // }, {
            //     text: languageSpecificObject.languageSpecifications[0]['WIPE'],
            //     bold: true,
            //     onClick: function() {

            //         // var formData = sslnote.formToJSON('#settings-showMessageStatus');
            //         //console.log(formData);

            //         //{"show":["10","20","30","50","40"]}
            //         //localStorage.setItem('showMessageStatus','{"show":["10","20","30","50","40"]}');

            //         // localStorage.setItem('showMessageStatus',formData.show);

            //         makeNewMessageList('reFreshYes');

            //     }
            // }, {
            //     text: languageSpecificObject.languageSpecifications[0]['SAVE'],
            //     bold: true,
            //     onClick: function() {

            //         var formData = sslnote.formToJSON('#settings-showMessageStatus');
            //         console.log('#settings-showMessageStatus');
            //         console.log(formData);
            //         console.log(formData.show);

            //         //{"show":["10","20","30","50","40"]}
            //         //localStorage.setItem('showMessageStatus','{"show":["10","20","30","50","40"]}');

            //         localStorage.setItem('showMessageStatus', formData.show);

            //         setTimeout(function() {
            //             makeNewMessageList('reFreshYes');
            //         }, 300);

            //     }
            }, ]
        })


    });


        var show = localStorage.getItem('showMessageStatus');

        console.log(show);

        sslnote.formFromJSON('#settings-showMessageStatus', {
            show: show
        });


}

else

{

    sslnote.modal({
        title: 'HELP',
        text: 'ACTIVE HELP BUTTON<BR> ' + activePage,
        buttons: [{
            text: 'OKE',
            onClick: function() {

            }
        }]
    });

}


});










$$('.sslnoteversion').html(localStorage.getItem('sslnoteversion'));
$$('.sslnoteapp').html(localStorage.getItem('sslnoteapp'));

var lastTime = 0;

$$("body").on("deleted", '.messages-page-list .swipeout', function(e) {
    console.log('!!!!!!!!  event.alert body deleted commond');

    var mid = $$(this).attr('mid');
    var mdatum = $$(this).attr('mdatum');
    var his_uid = $$(this).attr('his_uid');

    console.log('!!!!!!!!  mid = ' + mid);
    console.log('!!!!!!!!  mdatum = ' + mdatum);

    app.db.transaction(function(tx) {

        tx.executeSql(removeMessagesToReceive, [mid], onRemovedSuccess, onError);

    });

    sessionStorage.totalMessagesList = Number(sessionStorage.totalMessagesList) - 1;



    var themessage = localStorage.getItem('messageswiped'); // TRANSLATE

    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: localStorage.getItem('pushserver'),
        crossDomain: true,
        data: {
            my_uid: localStorage.getItem('UID'),
            his_uid: his_uid,
            themessage: themessage,
            mdatum: mdatum,
            sendStatusUpdate: '50'
        },
        success: function(responseData, textStatus, jqXHR) {
            console.log('PUSH MESSAGE WIPE SEND.messages');
            sessionStorage.removeItem('mid');
            console.log(responseData);
            console.log('PUSH MESSAGE WIPE SEND.messages DONE');
        }
    }); // end ajax

    // inform remote client


    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: localStorage.getItem('pushserver'),
        crossDomain: true,
        data: {
            my_uid: his_uid,
            his_uid: localStorage.getItem('UID'),
            themessage: 'remoteinform',
            mdatum: mdatum,
            sendStatusUpdate: '50'
        },
        success: function(responseData, textStatus, jqXHR) {
            console.log('PUSH MESSAGE WIPE SEND.messages INFORM REMOTE');
            // sessionStorage.removeItem('mid');
            console.log(responseData);
            console.log('PUSH MESSAGE WIPE SEND.messages INFORM REMOTE DONE');
        }
    }); // end ajax


    var totalMessagesList = sessionStorage.totalMessagesList;
    console.log('totalMessagesList = ' + totalMessagesList);



    if (totalMessagesList <= '1' || totalMessagesList === 'NaN' || totalMessagesList === NaN || totalMessagesList === null) {
        console.log('totalMessagesList = empty refresh page');
        setTimeout(function() {

            // messagesview.router.refreshPage();

            makeNewMessageList('reFreshYes');

        }, 300);

    }


    SQLiteUpdateMessagesTotal();

    console.log('!!!!!!!!  event.alert body deleted deleted');

});




// $$(document).on('click', '.remotedeletexx', function(e) {

//     console.log('CLICK remotedelete XX');

//     var mid = $$(this).attr('mid');

//     // var totalMessagesList = sessionStorage.totalMessagesList;
//     // console.log('totalMessagesList = ' +totalMessagesList);

//     if (sessionStorage.getItem('mid') !== sessionStorage.getItem('lastMIDDeleted')) {

//         var mid = sessionStorage.getItem('mid');
//         var mdatum = sessionStorage.getItem('mdatum');

//         //var sendPushMessage = sessionStorage.getItem('sendPushMessage');

//         console.log('! Delete mid ' + mid);
//         console.log('! mdatum ' + mdatum);
//         //console.log('! sendPushMessage ' + sendPushMessage);



//         var themessage = localStorage.getItem('messageswiped'); // TRANSLATE

//         $$.ajax({
//             method: 'POST',
//             dataType: 'jsonp',
//             url: localStorage.getItem('pushserver'),
//             crossDomain: true,
//             data: {
//                 my_uid: localStorage.getItem('UID'),
//                 his_uid: sessionStorage.getItem('his_uid'),
//                 themessage: themessage,
//                 mdatum: sessionStorage.getItem('mdatum'),
//                 sendStatusUpdate: '50'
//             },
//             success: function(responseData, textStatus, jqXHR) {
//                 console.log('PUSH MESSAGE WIPE SEND.messages');
//                 sessionStorage.removeItem('mid');
//                 console.log(responseData);
//             }
//         }); // end ajax

//         sessionStorage.setItem('sendPushMessage', 'empty');

//         // } // end if sendPushMessage

//         sessionStorage.setItem('lastMIDDeleted', mid);



//         SQLiteUpdateMessagesTotal();

//         // }); // end transaction

//         //  hideBusy();
//     } // end if session mid

// }); // end document




// $$(document).on('click', '.autodeletexx', function(e) {

//     console.log('CLICK AUTODELETE XX');

//     var mid = $$(this).attr('mid');

//     // var totalMessagesList = sessionStorage.totalMessagesList;
//     // console.log('totalMessagesList = ' +totalMessagesList);

//     if (sessionStorage.getItem('mid') !== sessionStorage.getItem('lastMIDDeleted')) {

//         var mid = sessionStorage.getItem('mid');
//         var mdatum = sessionStorage.getItem('mdatum');
//         var sendPushMessage = sessionStorage.getItem('sendPushMessage');

//         console.log('! Delete mid ' + mid);
//         console.log('! mdatum ' + mdatum);
//         console.log('! sendPushMessage ' + sendPushMessage);



//         if (sendPushMessage === 'yes') {

//             console.log('sendPushMessage = ' + sendPushMessage);


//             var themessage = localStorage.getItem('messageswiped'); // TRANSLATE

//             $$.ajax({
//                 method: 'POST',
//                 dataType: 'jsonp',
//                 url: localStorage.getItem('pushserver'),
//                 crossDomain: true,
//                 data: {
//                     my_uid: localStorage.getItem('UID'),
//                     his_uid: sessionStorage.getItem('his_uid'),
//                     themessage: themessage,
//                     mdatum: sessionStorage.getItem('mdatum'),
//                     sendStatusUpdate: '50'
//                 },
//                 success: function(responseData, textStatus, jqXHR) {
//                     console.log('PUSH MESSAGE WIPE SEND.messages');


//                     sessionStorage.removeItem('mid');
//                     console.log(responseData);
//                 }
//             }); // end ajax

//             sessionStorage.setItem('sendPushMessage', 'empty');

//         } // end if sendPushMessage

//         sessionStorage.setItem('lastMIDDeleted', mid);



//         SQLiteUpdateMessagesTotal();

//         // }); // end transaction

//         //  hideBusy();
//     } // end if session mid

// }); // end document

//*************************************************************************************************************
//*************************************************************************************************************
//********************** INIT ****************************************************************************
//*************************************************************************************************************
$$(document).on('pageInit', function(e) {
    //console.log('-----------------------');
    //console.log('*** pageInit ***');
    var page = e.detail.page;
    console.log('*** !!page.name *** ' + page.name);
    var mid = page.query.mid;
    ////console.log('*** mid *** ' +mid);
    var his_nick = page.query.his_nick;
    ////console.log('*** his_nick *** ' +his_nick);
    var his_uid = page.query.his_uid;
    ////console.log('*** his_uid *** ' +his_uid);
    var his_server = page.query.his_server;
    ////console.log('*** his_server *** ' +his_server);
    var playsound = page.query.playsound;
    var os = sslnote.device.os;
    //var mid = sessionStorage.setItem(sessionStorage.getItem('his_uid') +'mid', mid);
    var message = page.query.message;
    var totalmessages = page.query.totalmessages;



    $$('.refresh-link.refresh-home').on('click', function() {
        console.log('refresh-link pressed');
        importNewUIDLinks();
        JsonMessagesToSend();
    });


    $$('.sslnoteversion').html(localStorage.getItem('sslnoteversion'));
    $$('.sslnoteapp').html(localStorage.getItem('sslnoteapp'));


    if (localStorage.debugging == 'true') {

        console.log("---------------------------------");
        console.log("***** LOCAL STORAGE *****");
        console.log("---------------------------------");
        for (i = 0; i < localStorage.length; i++) {
            console.log(localStorage.key(i) + "=" + localStorage.getItem(localStorage.key(i)) + "");
        }
        console.log("---------------------------------");
        console.log("***** END LOCAL STORAGE *****");
        console.log("---------------------------------");
        
        console.log("---------------------------------");
        console.log("***** SESSION STORAGE *****");
        console.log("---------------------------------");
        for (i = 0; i < sessionStorage.length; i++) {
            console.log(sessionStorage.key(i) + "=" + sessionStorage.getItem(sessionStorage.key(i)) + "");
        }
        console.log("---------------------------------");
        console.log("***** END SESSION STORAGE *****");
        console.log("---------------------------------");

    }



    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json",
        function(languageSpecificObject) {
            // $$('.hisuidlastseen').html('<DIV>'+ languageSpecificObject.languageSpecifications[0]['lastseen']+ ' : ' +localStorage.getItem(his_uid+'active_last') +'</DIV>');
            localStorage.setItem('lastseentxt',
                languageSpecificObject.languageSpecifications[0]
                ['lastseen']);

            localStorage.setItem('messageSendtxt',
                languageSpecificObject.languageSpecifications[0]
                ['messageSendtxt']);

            localStorage.setItem('messageSendDeliveredtxt',
                languageSpecificObject.languageSpecifications[0]
                ['messageSendDeliveredtxt']);

            localStorage.setItem('messageSendReadtxt',
                languageSpecificObject.languageSpecifications[0]
                ['messageSendReadtxt']);


            localStorage.setItem('messageSendWipedtxt',
                languageSpecificObject.languageSpecifications[0]
                ['messageSendWipedtxt']);

            localStorage.setItem('messagebadgeUnkowtxt',
                languageSpecificObject.languageSpecifications[0]
                ['messagebadgeUnkowtxt']);




            localStorage.setItem('messagereadtxt',
                languageSpecificObject.languageSpecifications[0]
                ['messagereadtxt']);
            localStorage.setItem('messagebadgenewtxt',
                languageSpecificObject.languageSpecifications[0]
                ['messagebadgenewtxt']);

            localStorage.setItem('messagebadgereadtxt',
                languageSpecificObject.languageSpecifications[0]
                ['messagebadgereadtxt']);


            localStorage.setItem('contactlink',
                languageSpecificObject.languageSpecifications[0]
                ['contactlink']);
            localStorage.setItem('oke',
                languageSpecificObject.languageSpecifications[0]
                ['oke']);
            localStorage.setItem('messagesnew',
                languageSpecificObject.languageSpecifications[0]
                ['messagesnew']);
            localStorage.setItem('messageissend',
                languageSpecificObject.languageSpecifications[0]
                ['messageissend']);
            localStorage.setItem('messagesdelivered',
                languageSpecificObject.languageSpecifications[0]
                ['messagesdelivered']);
            localStorage.setItem('crypting',
                languageSpecificObject.languageSpecifications[0]
                ['crypting']);
            localStorage.setItem('oepsaerror',
                languageSpecificObject.languageSpecifications[0]
                ['oepsaerror']);
            localStorage.setItem('updating',
                languageSpecificObject.languageSpecifications[0]
                ['updating']);
            localStorage.setItem('messageswiped',
                languageSpecificObject.languageSpecifications[0]
                ['messageswiped']);
            localStorage.setItem('collectingdata',
                languageSpecificObject.languageSpecifications[0]
                ['collectingdata']);
            localStorage.setItem('passwordnotthesame',
                languageSpecificObject.languageSpecifications[0]
                ['passwordnotthesame']);
            localStorage.setItem('passwordcannotbeempty',
                languageSpecificObject.languageSpecifications[0]
                ['passwordcannotbeempty']);
            localStorage.setItem('busy',
                languageSpecificObject.languageSpecifications[0]
                ['busy']);
            // localStorage.getItem('messagesdelivered')
        });



    $$('input[name="sound"]').on('change', function() {
        if (this.checked) {
            //console.log('we have sound');
            console.log(this.value);
            var playsound = this.value;
            localStorage.setItem('sound', playsound);

            localStorage.setItem('playNotificationSound', playsound);
            console.log('------------ SYNC START playNotificationSound = ' + playsound);

            //console.log('SOUND = ' +playsound);
            if (os === 'ios') {
                var snd = new Media('sounds/'+playsound);
                snd.play();
            } else {
                var sound_click = new Howl({
                    urls: ['sounds/'+playsound],
                    volume: 50
                });
                sound_click.play();
            }
        }
    });





// RESET APP

    $$('.reset-local-storage').on('click', function() {
        //console.log('BUTTON reset-local-storage');
        var clickedLink = $(this);

        if (sslnote.device.iphone) {
            var buttons1 = [{
                text: 'This will remove data that is used for local Settings. The App will be restarted once the process is finished.',
                label: true
            }, {
                text: 'Remove Now',
                red: true,
                color: 'theme-red',
                onClick: function() {
                    //clearInterval(timedTheme);
                    localStorage.clear();
                    sessionStorage.clear();

                    $('body').append('<div class="update-view"><img src="iTunesArtwork.png" /></div>');


                    setTimeout(function() {


                        $('.update-view').append('<div class="progress-bar"><div class="inner-progress" id="update-progress"></div></div>');
                        interval = setInterval(function() {
                            addProgress('update-progress');
                        }, Math.random() * 750);
                    }, 1000);


                }
            }];
            var buttons2 = [{
                text: 'Cancel',
                bold: true,
                color: 'red'
            }];
            var group = [
                buttons1,
                buttons2
            ];
            sslnote.actions(group);
        } 

    });


    if (sessionStorage.counterStarted == 'yes') {

            if(page.name !== 'Smessages-send-new' && page.name !== 'Smessages-send' ){

                
                var totalsec = localStorage.getItem('logofftimer') * 60;
                updateCounter(totalsec, 'update');
                console.log('+++ countdown update: ',totalsec);
            }
            else
            {
                var totalminut = Number(localStorage.getItem('logofftimer')) +1;
                console.log('+++ totalminut: ', totalminut);

                var totalsec = totalminut * 60;
                updateCounter(totalsec, 'update');
                console.log('+++ ADD EXTRA 1 MINUT: ', totalsec);

            }


    } else {
        console.log('+++ countdown stop');
        updateCounter('', 'stop');
    }


// CAMERA

    $$('.camera1').on('click', function() {
        console.log('camera Pressed');

        var prepair = '<div class="message message-sent message-pic theimage"><img src="img/loader.png" alt="Busy" height="15" width="15">INSERT PHOTO PLEASE WAIT...';

        var old = '<img src="img/loader.png" alt="Busy" height="15" width="15">INSERT PHOTO PLEASE WAIT...';


        $$('#theimage').html(prepair);

        setTimeout(function() {
            navigator.camera.getPicture(onSuccess,
                onFail, {
                    quality: 50,
                    targetWidth: 260,
                    targetHeight: 260,
                    // destinationType: Camera.DestinationType.FILE_URI
                    destinationType: Camera.DestinationType.DATA_URL
                });

            function onSuccess(base64Img) {
                console.log('-- THE IMAGE onSuccess');
                //$('#message').removeClass('message-last');

                var theimage = '<div class="message message-sent message-pic message-last"><img src="data:image/jpeg;base64,' + base64Img + '"></div>';

                $$('#theimage').html(theimage);

                var theimagestore = '<div class="message message-pic"><img src="data:image/jpeg;base64,' + base64Img + '"></div>';

                sessionStorage.setItem('imageURL', theimagestore);

                console.log('-- THE IMAGE onSuccess DONE');

            }

            function onFail(message) {
                sslnote.alert('Failed because: ' + message);
            }
        }, 10);
    });


    $$('.QRscanner').on('click', function() {
        //console.log('!! STOP LOOP');
        clearTimeout(loop);
        //console.log('QRscanner Pressed');
        // var scanner = cordova.require("com.phonegap.plugins.barcodescanner.BarcodeScanner");
        cordova.plugins.barcodeScanner.scan(function(result) {
            sessionStorage.setItem('QRscanUID', result.text);
            //console.log('QRscanUID', result.text);
            var uid = localStorage.getItem('UID');
            var his_uidscan = sessionStorage.getItem('QRscanUID');
            var server = localStorage.getItem('server');
            var data = {
                uid: uid,
                server: server,
                his_uid: his_uidscan
            };
            sslnote.formFromJSON('#contactadd', data);
            settingsview.loadPage('frames/settings/mysettings/contactAdd.html');
        }, function(error) {
            sslnote.alert("Scanning failed: " + error);
        });
        //console.log('QRscanner Pressed DONE');
    });


    //*************************************************************************************************************
    //********************** END PAGE INIT ****************************************************************************
    //*************************************************************************************************************
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json",
        function(languageSpecificObject) {
            $$(".languagespecificHTML").each(function() {
                $(this).html(languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
            });
            $$(".languageSpecificPlaceholder").each(function() {
                $(this).attr("placeholder",
                    languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
            });
            $$(".languageSpecificValue").each(function() {
                $(this).attr("value",
                    languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
            });
        });


    $$('.deleteimage').on('click', function() {
        //console.log('Photo deleted');
        var buttons = [{
            text: 'DELETE',
            onClick: function() {
                $$('#theimage').html('');
                sessionStorage.removeItem('imageURL');
            }
        }, {
            text: 'Cancel',
            color: 'red'
        }, ];
        sslnote.actions(buttons);
    });



    var running = localStorage.getItem('running');

    //console.log('!!! RUNNING  !!! = ' +running);

// RUNNING



    if (running === '0') {
       // $$('.running').html('Burn');
    }

    if (running === '1') {
       // $$('.running').html('Master');
    }





    if (!localStorage.showSettingsLogoff) {
        localStorage.showSettingsLogoff = true;
    }

    var showSettingsLogoff = localStorage.showSettingsLogoff;

    //console.log('showSettingsLogoff localStorage = ' +showSettingsLogoff);

    if (showSettingsLogoff === 'true') {
        //console.log('showSettingsLogoff true = ' +showSettingsLogoff);

        // $$('.showHideTimer').hide();

    }

    if (showSettingsLogoff === 'false') {
        //console.log('showSettingsLogoff false = ' +showSettingsLogoff); 

    }


    if (sessionStorage.getItem('setupBusy') !== '1') {

        var loggedIn = sessionStorage.getItem('userLoggedIn');

        if (loggedIn === '1') {
            console.log('userLoggedIn = ' + loggedIn);
        } else {

            console.log('userLoggedOut = ' + loggedIn);

            sessionStorage.clear();

            setTimeout(function() {

                //   sslnote.loginScreen();

            }, 1000);


        }
    }




    if (localStorage.getItem('showMessageStatus') === null) {
        console.log('set showMessageStatus = 99');
        localStorage.setItem('showMessageStatus', '{"show":["90"]}');
    }




}); // end page init




//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
//*************************************************************************************************************
