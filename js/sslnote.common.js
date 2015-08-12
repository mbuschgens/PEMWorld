// @codekit-prepend "jquery.js"
'use strict';

var sslnote = new Framework7({
    debug: true,
    // cache: true,
    // domCache: true,
    //cacheDuration: 1000,
    // swipeBackPage: false,
    // swipeBackPageAnimateShadow: false,
    // swipeBackPageAnimateOpacity: false,
    modalTitle: unescape('PEM'),
    router: true,
    material: true,
    materialPageLoadDelay:300
    //reloadPages:true,
    // onAjaxStart: function(xhr) {
    //     sslnote.showIndicator();
    // },
    // onAjaxComplete: function(xhr) {
    //     sslnote.hideIndicator();
    // },
    // onAjaxError: function(xhr) {
    //     sslnote.hideIndicator();
    //     console.log('HIDE Indicator on AJAX Error');
    //       console.error(xhr + new Error().stack);
    // }
});

var $$ = Dom7;


// $$(document).on('ajaxStart', function (e) {
//     sslnote.showIndicator();
// });
// $$(document).on('ajaxComplete', function () {
//     sslnote.hideIndicator();
// });



if (!localStorage.getItem('sslnoteapp')) {
    var sslnoteapp = 'Lite';
    localStorage.setItem('sslnoteapp', sslnoteapp);
}
var Appversion = '1.12.1';
localStorage.setItem('whatsnew', 
    'V10.0.11 Fix Scroll bij langen berichten, Aantal berichten in app icoon update.' +
    'V10.0.6 Bug fix hangen en CPU belasting.' + '');
localStorage.setItem('App', 'PEM');
var sslnoteversion = 'PEM V' + Appversion;
localStorage.setItem('sslnoteversion', sslnoteversion);
var pushserver = 'http://push.sslnoteserver.com/index.php?';
localStorage.setItem('pushserver', pushserver);
if (!localStorage.getItem('cLANGUAGE')) {
    localStorage.setItem('cLANGUAGE', 'en');
}
var onShake = function() {
    //console.log('--- WE HAVE A SHAKE ---');
    sslnote.hideIndicator();
    sessionStorage.clear();
    mainView.router.load({
        url: 'frames/login.html',
        animatePages: false
    });
    $('.countdown_dashboard').data('countdown').update({
        diff: '-1'
    });
    sslnote.loginScreen();
    //console.log('!! STOP LOOP onShake');
    clearTimeout(loop);
    sslnote.hideIndicator();
    sessionStorage.LogedIn = true;
};
//var backgroundInterval;
var ptrContent = $$('.pull-to-refresh-content');
var timeouts = [];
//var screenprotect;
var mainView = sslnote.addView('.view-main', {
    // dynamicNavbar: true,
});
// var mainView = sslnote.addView('.view-settings', {
//     // dynamicNavbar: true,
// });
// var mainView = sslnote.addView('.view-setup', {
//     // dynamicNavbar: true,
// });

var interval;
var createUID =
    "CREATE TABLE IF NOT EXISTS uid (id INTEGER PRIMARY KEY AUTOINCREMENT,uid TEXT,sslnoteapp TEXT,pass TEXT,account_id INTEGER,active INTEGER ,pass_reset INTEGER,inactive_time DATETIME,active_last DATETIME,my_nick TEXT,settpass INTEGER,logins INTEGER,reactivatecode TEXT,token TEXT,sound TEXT,volume TEXT,repeatpush INTEGER,device TEXT,maxlink INTEGER,language TEXT,server TEXT)";
var createUIDLinks =
    "CREATE TABLE IF NOT EXISTS uid_links (id INTEGER PRIMARY KEY AUTOINCREMENT,my_uid TEXT,his_uid TEXT UNIQUE, his_nick TEXT, his_server TEXT,autocrypt INTEGER,autocryptkey TEXT,online datetime,badge TEXT,totalmessages TEXT,nuonline INTEGER)";
var dropUIDLinks = "DROP TABLE uid_links";
var createUIDMessagesSend =
    "CREATE TABLE IF NOT EXISTS uid_messages_send (mid INTEGER PRIMARY KEY AUTOINCREMENT,my_uid TEXT,his_uid TEXT, his_server TEXT ,message BLOB,mdatum DATETIME UNIQUE,read INTEGER)";
var createUIDMessagesReceive =
    "CREATE TABLE IF NOT EXISTS uid_messages_receive (mid INTEGER PRIMARY KEY AUTOINCREMENT,my_uid TEXT,his_uid TEXT,message BLOB,mdatum DATETIME UNIQUE,read INTEGER)";
var insertUID =
    "INSERT INTO uid (uid, sslnoteapp, account_id, active, pass_reset, my_nick, settpass, logins, reactivatecode, sound, volume, repeatpush, device, maxlink, language, server) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
var insertUIDLinks =
    "INSERT INTO uid_links (my_uid,his_uid,his_nick,his_server,autocrypt,online,badge,totalmessages) VALUES (?,?,?,?,?,?,?)";
var insertUIDMessagesReceive =
    "INSERT INTO uid_messages_receive (my_uid,his_uid,message,mdatum,read) VALUES (?,?,?,?,?)";
var insertUIDMessagesSend =
    "INSERT INTO uid_messages_send (my_uid,his_uid,his_server,message,mdatum,read) VALUES (?,?,?,?,?,?)";
var insertMessagesToReceive =
    "INSERT INTO uid_messages_receive (my_uid,his_uid,message,mdatum,read) VALUES (?,?,?,?,?)";
var selectUID = "SELECT * FROM uid WHERE uid = ?";

var selectTotalMessages =
    "SELECT COUNT(*) AS totalmessages FROM uid_messages_receive";

var selectUIDLinks =
    "SELECT my_uid,his_uid,his_nick,his_server,autocrypt,online,badge,totalmessages,nuonline FROM uid_links WHERE my_uid = ? ORDER BY totalmessages DESC, online DESC";
var selectUIDMessagesReceive =
    "SELECT mid,my_uid,his_uid,message,mdatum,sms_active,sms_id,read FROM uid_messages_receive WHERE his_uid = ? ORDER BY mdatum DESC";
var selectMID =
    "SELECT * FROM uid_messages_receive WHERE my_uid = ? AND his_uid = ? ORDER BY read ASC";
var selectMIDByMid = "SELECT * FROM uid_messages_receive WHERE mid = ?";
var JsonUIDMessagesToSend =
    "SELECT mid,my_uid,his_uid,his_server,message,mdatum FROM uid_messages_send WHERE my_uid = ? LIMIT 1";
var removeMessagesToSend = "DELETE FROM uid_messages_send WHERE mid = ?";
var removeMessagesToReceive = "DELETE FROM uid_messages_receive WHERE mid = ?";
var removeUIDlinks = "DELETE FROM uid_links WHERE his_uid = ?";
var selectUIDLinksByHisUID = "SELECT his_uid FROM uid_links WHERE my_uid = ? ";
var updateTotalMessages =
    "UPDATE uid_links SET totalmessages = (SELECT COUNT(*) AS totalmessages FROM uid_messages_receive WHERE uid_messages_receive.his_uid = uid_links.his_uid)";
var updateBadgeToZero = "UPDATE uid_links SET badge = ?";
var updateBadgeTo =
    "UPDATE uid_links SET badge = (SELECT COUNT(*) AS badge FROM uid_messages_receive WHERE uid_messages_receive.his_uid = uid_links.his_uid AND uid_messages_receive.read = '0') ";
var updateMessageToRead =
    "UPDATE uid_messages_receive SET read = ? WHERE mid = ?";
var updateKey =
    "UPDATE uid_links SET autocrypt = ?, autocryptkey = ? WHERE his_uid = ? ";
var updateHisNick = "UPDATE uid_links SET his_nick = ? WHERE his_uid = ? ";
var updateHLastActive =
    "UPDATE uid_links SET online = ?, nuonline = ? WHERE his_uid = ? ";
var updateUIDLinks =
    "INSERT OR IGNORE INTO uid_links (my_uid,his_uid,his_nick,his_server,online,totalmessages) VALUES (?,?,?,?,?,?)";
var insertSupportUID =
    "INSERT OR IGNORE INTO uid_links (my_uid,his_uid,his_nick,his_server,autocrypt,autocryptkey,online) VALUES (?,?,?,?,?,?,?)";
var syncUIDLinks =
    "SELECT my_uid,his_uid,his_nick,autocrypt FROM uid_links WHERE my_uid = ?";


document.addEventListener("deviceready", init, false);

var app = {};
app.db = null;
app.openDb = function() {
    if (window.sqlitePlugin !== undefined) {
        app.db = window.sqlitePlugin.openDatabase("master.db");
    } else {
        // For debugging in simulator fallback to native SQL Lite
        app.db = window.openDatabase("master.db", "1.0", "SSLNote", 200000);
    }
};
app.createTable = function() {
    app.db.transaction(function(tx) {
        tx.executeSql(createUID, [], onCreateSuccess, onError);
        tx.executeSql(createUIDLinks, [], onCreateSuccess, onError);
        tx.executeSql(createUIDMessagesSend, [], onCreateSuccess,onError);
        tx.executeSql(createUIDMessagesReceive, [], onCreateSuccess,onError);
    });
};

function onCreateSuccess() // Function for Handling Error...
    {
        ////console.log('success creating');
    }

function onInsertSuccess() // Function for Handling Error...
    {
        //console.log("Your insert SQLite query was successful!");
        return true;
    }

function onRemovedSuccess() // Function for Handling Error...
    {
        //console.log("Your remove SQLite query was successful!");
        return true;
    }

function onUpdateSuccess() // Function for Handling Error...
    {
        //console.log("Your update SQLite query was successful!");
        return true;
    }

function onError(tx, error) // Function for Handeling Error...
    {
        //console.error(JSON.stringify(error));
        //console.error('function onError');
        console.error(JSON.stringify(error));
        PushErrorToSupport(JSON.stringify(error));
    }

function init() {
    
        //console.log('--- START SHAKE ---');
        app.openDb();
        app.createTable();

//console.log('common.js init');

        if (!localStorage.getItem('f7form-settings-shake')) {
            console.log('No shake Settings');
            localStorage.setItem('f7form-settings-shake',
                '{"shakeon":"on","shakesensitivity":"20"}');
            var shakeon = 'on';
            var shakesensitivity = '20';
        } else {
            console.log('We have Shake Settings!');
            var storedDataShake = sslnote.formGetData('settings-shake');
            //console.log(storedDataShake);
            var shakeon = storedDataShake.shakeon;
            //console.log('shakeon = ' + shakeon);
            var shakesensitivity = storedDataShake.shakesensitivity;
            //localStorage.removeItem('f7form-settings-shake');
        }
        if (shakeon == 'on') {
            //console.log('ShakeOn');
            shake.startWatch(onShake, shakesensitivity);
            //console.log('shakesensitivity Set = ',shakesensitivity);      
        } else { //console.log('No Shake settings On StartUp');
        }
    } // end pageload ready
var VPN = 'https://sslnote.com';
localStorage.setItem('connection', VPN);
//*************************************************************************************************************
$(document).ready(function() {
    //console.log('**** Document ready online *****' );
    var supportUID = 'EX5L9271J1';
    localStorage.setItem('supportUID', supportUID);
    var supportkey = calcMD5('support');
    localStorage.setItem('EX5L9271J1encryptkey', supportkey);
    var supportserver = '1001';
    localStorage.setItem('supportserver', supportserver);
    var testUID = 'D3UE52U1MD';
    localStorage.setItem('testUID', testUID);
    var testserver = '1001';
    localStorage.setItem('testserver', testserver);
    //     if (localStorage.getItem('autologon') === '999') {
    //     // document.getElementById('countdown_dashboardHide').innerHTML =
    //     //     '<a href=\'#\' class=\'autologon\'><i class=\'icon ion-ios-refresh\'></i></a>';
    //     // setTimeout(function() {
    //         sessionStorage.setItem('logofftimer', localStorage.getItem(
    //             'logofftimer'));
    //         sslnote.closeModal('.login-screen');
    //         mainView.router.load({
    //             url: 'frames/messages/Scontactlist.html',
    //             animatePages: false
    //         });
    // sslnote.hideIndicator();
    //     // }, 2800);
    // }
    if (!localStorage.getItem('doneSetup') && !localStorage.doneTutorial) {
        //console.log('UID not set ACTIVE it');
        if (!localStorage.getItem('cLANGUAGEset')) {
            localStorage.setItem('cLANGUAGE', 'en');
            $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
                "/strings.json", function(languageSpecificObject) {
                    sslnote.modal({
                        title: languageSpecificObject.languageSpecifications[
                            0][
                            'selectyourlanguagetitle'
                        ],
                        text: languageSpecificObject.languageSpecifications[
                            0]['selectyourlanguagetext'],
                        verticalButtons: true,
                        buttons: [{
                            text: languageSpecificObject
                                .languageSpecifications[
                                    0]['english'],
                            bold: true,
                            onClick: function() {
                                localStorage.setItem(
                                    'cLANGUAGE',
                                    'en');
                                localStorage.setItem(
                                    'cLANGUAGEset',
                                    true);
                                sslnote.closeModal(
                                    '.login-screen'
                                );
                                mainView.loadPage(
                                    'frames/setup/setupintro.html'
                                );
                            }
                        }, {
                            text: languageSpecificObject
                                .languageSpecifications[
                                    0]['dutch'],
                            bold: true,
                            onClick: function() {
                                localStorage.setItem(
                                    'cLANGUAGE',
                                    'nl');
                                localStorage.setItem(
                                    'cLANGUAGEset',
                                    true);
                                sslnote.closeModal(
                                    '.login-screen'
                                );
                                mainView.loadPage(
                                    'frames/setup/setupintro.html'
                                );
                            }
                        }, {
                            text: languageSpecificObject
                                .languageSpecifications[
                                    0]['russische'],
                            bold: true,
                            onClick: function() {
                                localStorage.setItem(
                                    'cLANGUAGE',
                                    'ru');
                                localStorage.setItem(
                                    'cLANGUAGEset',
                                    true);
                                sslnote.closeModal(
                                    '.login-screen'
                                );
                                mainView.loadPage(
                                    'frames/setup/setupintro.html'
                                );
                            }
                        }, {
                            text: languageSpecificObject
                                .languageSpecifications[
                                    0]['frans'],
                            onClick: function() {
                                localStorage.setItem(
                                    'cLANGUAGE',
                                    'fr');
                                localStorage.setItem(
                                    'cLANGUAGEset',
                                    true);
                                sslnote.closeModal(
                                    '.login-screen'
                                );
                                mainView.loadPage(
                                    'frames/setup/setupintro.html'
                                );
                            }
                        }, {
                            text: languageSpecificObject
                                .languageSpecifications[
                                    0]['spaans'],
                            onClick: function() {
                                localStorage.setItem(
                                    'cLANGUAGE',
                                    'es');
                                localStorage.setItem(
                                    'cLANGUAGEset',
                                    true);
                                sslnote.closeModal(
                                    '.login-screen'
                                );
                                mainView.loadPage(
                                    'frames/setup/setupintro.html'
                                );
                            }
                        }, {
                            text: languageSpecificObject
                                .languageSpecifications[
                                    0]['duits'],
                            onClick: function() {
                                localStorage.setItem(
                                    'cLANGUAGE',
                                    'du');
                                localStorage.setItem(
                                    'cLANGUAGEset',
                                    true);
                                sslnote.closeModal(
                                    '.login-screen'
                                );
                                mainView.loadPage(
                                    'frames/setup/setupintro.html'
                                );
                            }
                        }, {
                            text: languageSpecificObject
                                .languageSpecifications[
                                    0]['chinees'],
                            onClick: function() {
                                localStorage.setItem(
                                    'cLANGUAGE',
                                    'ch');
                                localStorage.setItem(
                                    'cLANGUAGEset',
                                    true);
                                sslnote.closeModal(
                                    '.login-screen'
                                );
                                mainView.loadPage(
                                    'frames/setup/setupintro.html'
                                );
                            }
                        }, ]
                    });
                });
        } // end if no localStorage.setItem('cLANGUAGE', 'en');
        else {
            sslnote.closeModal('.login-screen');
            setTimeout(function() {
                mainView.loadPage('frames/setup/setupintro.html');
            }, 500);
        }
    }






    $$('.contactadd').on('click', function() {
        //console.log('frames/settings/mysettings/ScontactAdd.html');
        mainView.loadPage(
            'frames/settings/mysettings/ScontactAdd.html');
    });
    $$('.bugreport').on('click', function() {
        //console.log('frames/setup/Sbugreport.html');
        mainView.loadPage('frames/Sbugreport.html');
    });
    $$('.support').on('click', function() {
        $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
            "/strings.json", function(
                languageSpecificObject) {
                //languageSpecificObject.languageSpecifications[0]['howtogetsupporttext'],  
                var buttons = [{
                    text: languageSpecificObject.languageSpecifications[
                        0][
                        'howtogetsupporttext'
                    ],
                    label: true
                }, {
                    text: languageSpecificObject.languageSpecifications[
                        0][
                        'howtogetsupportbutton'
                    ],
                    onClick: function() {
                        //console.log('Add Support contact');
                        app.db.transaction(
                            function(tx) {
                                //console.log('insertSupportUID ');
                                var
                                    testonline =
                                    "2015-06-01 17:05:47";
                                console.log(
                                    testonline
                                );
                                tx.executeSql(
                                    insertSupportUID, [
                                        localStorage
                                        .getItem(
                                            'UID'
                                        ),
                                        supportUID,
                                        'SUPPORT',
                                        supportserver,
                                        '1',
                                        supportkey,
                                        testonline
                                    ],
                                    onInsertSuccess,
                                    onError
                                );
                            });
                        var posturl =
                            'https://sslnote.com/appie/php/include/JsonInsertUIDLinks.php?sslnoteapp=' +
                            localStorage.getItem(
                                'sslnoteapp') +
                            '&my_server=' +
                            localStorage.getItem(
                                'server') +
                            '&my_uid=' +
                            localStorage.getItem(
                                'UID') +
                            '&my_nick=' +
                            localStorage.getItem(
                                'UID') +
                            '&his_uid=' +
                            supportUID +
                            '&his_server=' +
                            supportserver +
                            '&his_nick=' +
                            supportUID;
                        console.log(posturl);
                        $$.post(posturl,
                            function(data) {
                                //console.log('**************************************');
                                //console.log('POST RESPONSE INSERT');
                                console.log(
                                    data
                                );
                                //console.log('**************************************');
                            });
                        syncUILinks();
                        SQLiteUpdateMessagesTotal
                            ();
                        sslnote.alert(
                            languageSpecificObject
                            .languageSpecifications[
                                0][
                                'howtogetsupportalert'
                            ]);
                    }
                }, {
                    //text: languageSpecificObject.languageSpecifications[0]['cancel'],
                    text: 'SHOW TOUR',
                    onClick: function() {
                        localStorage.removeItem(
                            "dotour");
                        localStorage.removeItem(
                            "dotourfirstmessagesend"
                        );
                        localStorage.removeItem(
                            "dotourfirstmessage"
                        );
                        localStorage.removeItem(
                            "dotourfirstmessagedecrypt"
                        );
                        //console.log('localStorage dotour removed');
                        JsonMessagesToSend();
                    }
                }, {
                    text: languageSpecificObject.languageSpecifications[
                        0]['cancel'],
                    color: 'red'
                }, ];
                sslnote.actions(buttons);
            }); //end getJSON
    }); // end support
    // $$('.logoff').on('click', function() {
    //     //console.log('+++ LOGOFF');
    //     sslnote.hideIndicator();
    //     sessionStorage.clear();
    //     mainView.router.load({
    //         url: 'frames/login.html',
    //         animatePages: false
    //     });
    //     $('.countdown_dashboard').data('countdown').update({
    //         diff: '-1'
    //     });
    //     sslnote.loginScreen();
    //     //console.log('!! STOP LOOP logout button');
    //     clearTimeout(loop);
    // });
    // disable till slider intro works
    //  if (!localStorage.doneTutorial  && localStorage.getItem('UID') && localStorage.getItem('doneSetup'))  {
    // //sessionStorage.setItem('counter', 'yes'); 
    //  sslnote.closeModal('.login-screen');
    //     sslnote.popup('.popup-getting-started');
    //  }
    if (localStorage.getItem('UID') && (localStorage.getItem('Appversion') !== Appversion) && localStorage.getItem('doneSetup')) {
        localStorage.setItem('Appversion', Appversion);
        sslnote.modal({
            title: 'Whats new in V' + Appversion,
            text: localStorage.getItem('whatsnew'),
            buttons: [{
                text: 'OKE',
                onClick: function() {
                    updateUIDLinksTable();
                }
            }]
        });
    }
}); // end document ready
//*************************************************************************************************************
// var statusbarTheme = sslnote.formGetData('form-theme') ? $.parseJSON(JSON.stringify(
//     sslnote.formGetData('form-theme'))).theme : 'default';
// if (window.navigator.standalone && statusbarTheme != 'dark') {
//     $('meta[name=\'apple-mobile-web-app-status-bar-style\']').removeAttr('content');}
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
$$('.login-screen .form-to-json').on('click', function() {
    console.log('A login-screen Started');
    var formData = sslnote.formToJSON('#uid');
    console.log('A formData = '+formData);
    console.log(formData);


    var pass = formData.pass;
    console.log('A pass = '+pass);

    

    var uid = localStorage.getItem('UID');
    console.log('A uid = '+uid);
    




    if (pass === '') {
        sslnote.alert('Cannot be empty.');
    } else {

        var pass = calcMD5(formData.pass);
        console.log('A pass MD5 = '+pass);


        sslnote.showIndicator();
        console.log('form-to-json');
        


        document.activeElement.blur();
        app.selectAllRecords = function(fn) {
                app.db.transaction(function(tx) {
                    //console.log('app.selectAllRecords');
                    tx.executeSql(
                        "SELECT * FROM uid WHERE uid = ? and pass = ?", [
                            uid, pass
                        ], fn, app.onError);
                });
            }
            // function getAllTheData() {
        var render = function(tx, rs) {
            // rs contains our SQLite recordset, at this point you can do anything with it
            // in this case we'll just loop through it and output the results to the console
            for (var i = 0; i < rs.rows.length; i++) {
                //console.log(rs.rows.item(i)); 
            }
            if (rs.rows.length) {
                //console.log('A USER EXIST');
                for (var i = 0; i < rs.rows.length; i++) {
                    //console.log('A RECORD HAVE VAR');
                    var data = rs.rows.item(i);
                    //localStorage.setItem('server',data.server);
                    localStorage.setItem('sound', data.sound);
                    localStorage.setItem('volume', data.volume);
                    localStorage.setItem('repeatpush', data.repeatpush);
                    sessionStorage.setItem('userLoggedIn', true);
                }
                document.getElementById("uid").reset();
                localStorage.setItem('counterhide', '0');
                // if (localStorage.getItem('counterhide') !=='1') {
                //     setInterval(function() {
                //             if (localStorage.getItem('timertemp') ==='-1') {
                //                 window.location.reload();
                //             }
                //         }, 5000);
                // }
                // clearTimeout(noconnection);
                // //console.log('***** START Fn contactonline *****');
                // checkContactsOnline();
                // //console.log('***** END Fn contactonline *****');   
                // close login
                sessionStorage.setItem('counter', 'yes');
                $$('.mutecolor').removeClass('red');
                localStorage.setItem('disablesound', 'no');
                //mainView.loadPage( 'frames/messages/Scontactlist.html');
                localStorage.setItem('loginfails', '0');
                $('.loginfailsbadge').removeClass('badge-red');
                $('.loginfailsbadge').addClass('badge-green');
                $('.loginfailsbadge').text(localStorage.getItem(
                    'loginfails'));
                // check update and forward
                // if(!localStorage.setcontainers){ 
                //     sslnote.closeModal('.login-screen');
                //     sslnote.alert('Voorbereiding optie: Stel locaties in welke willekeurig gebruikt mogen worden om de berichten gecodeerd toe te versturen.'); 
                //     localStorage.setcontainers = '1';
                //     //console.log('localStorage.setcontainers = ' + localStorage.setcontainers);
                //     mainView.router.load({url:'frames/settings/mysettings/containers.html' , animatePages:false});
                // }
                // else
                // {
                sslnote.closeModal('.login-screen');
                //console.log('OPEN MAINVIEW');
                // sslnote.hideIndicator();
                mainView.router.load({
                    url: 'frames/messages/Scontactlist.html',
                    animatePages: false
                });
                //console.log('OPEN MAINVIEW DONE');
            } else {
                //console.log('A USER DONT EXIST');
                // alert user dont exist 
                // add 1 to loginfails at 3 reset app
                var loginfailstimes = localStorage.getItem(
                    'loginfails');
                //var loginfailstimes = '1';
                //console.log('--- loginfailstimes ' + loginfailstimes);
                loginfailstimes++;
                //console.log('--- loginfailstimes +1 = ' + loginfailstimes);
                localStorage.setItem('loginfails', loginfailstimes);
                //console.log('--- localStorage loginfails = ' + localStorage.getItem('loginfails'));
                if (localStorage.getItem('loginfails') >= 1) {
                    $('.loginfailsbadge').removeClass('badge-green');
                    $('.loginfailsbadge').addClass('badge-red');
                    $('.loginfailsbadge').text(localStorage.getItem(
                        'loginfails'));
                }
                document.getElementById("uid").reset();
                sslnote.hideIndicator();
                $$.getJSON("i18n/" + localStorage.getItem(
                        'cLANGUAGE') + "/strings.json",
                    function(languageSpecificObject) {
                        //sslnote.showPreloader(localStorage.getItem('updating'));
                        if (localStorage.getItem('loginfails') >=
                            3) {
                            //sslnote.alert(languageSpecificObject.languageSpecifications[0]['loginfailsreset']);  
                            sslnote.modal({
                                title: languageSpecificObject
                                    .languageSpecifications[
                                        0][
                                        'loginfailsreset'
                                    ],
                                text: data,
                                verticalButtons: true,
                                buttons: [{
                                    text: localStorage
                                        .getItem(
                                            'oke'
                                        ),
                                    onClick: function() {
                                        //clearInterval(timedTheme);
                                        localStorage
                                            .clear();
                                        sessionStorage
                                            .clear();
                                        $(
                                                'body'
                                            )
                                            .append(
                                                '<div class="update-view"><img src="iTunesArtwork.png" /></div>'
                                            );
                                        setTimeout
                                            (
                                                function() {
                                                    $
                                                        (
                                                            '.update-view'
                                                        )
                                                        .append(
                                                            '<div class="progress-bar"><div class="inner-progress" id="update-progress"></div></div>'
                                                        );
                                                    interval
                                                        =
                                                        setInterval(
                                                            function() {
                                                                addProgress
                                                                    (
                                                                        'update-progress'
                                                                    );
                                                            },
                                                            Math
                                                            .random() *
                                                            750
                                                        );
                                                },
                                                1000
                                            );
                                    }
                                }, ]
                            });
                            //sslnote.alert('TO MANY ATTEMPTS<BR>APP TOTAL RESETED'); 
                        } // end if
                        else {
                            sslnote.alert(
                                languageSpecificObject.languageSpecifications[
                                    0]['loginfailswarning']
                            );
                            //sslnote.alert('CODE NOT GOOD<BR>* WARNING *<BR>At 3 failed attempts<BR>all settings will be reset');
                        } // end else
                    }); // end get
            } // end else
        }; // end have record
        app.selectAllRecords(render);
    } // end else
}); // end form-to-json
$$('.disablerepeatsound').on('click', function() {
    var mute = sslnote.modal({
        title: 'Disable repeat sound',
        text: 'till Sign in.'
    });
    $$('.mutecolor').addClass('red');
    setTimeout(function() {
        sslnote.closeModal(mute);
    }, 2000);
    //console.log('MUTE PRESSED');
    localStorage.removeItem('repeatsound');
    localStorage.setItem('disablesound', 'yes');
    //console.log('A disablesound = ' + localStorage.getItem('disablesound') );
});
$$('.close-tutorial').on('click', function() {
    //console.log('++ press close-tutorial');
    sslnote.closeModal();
    localStorage.setItem('doneTutorial', 'yes');
    mainView.router.load({
        url: 'frames/login.html',
        animatePages: false
    });
});
$$('.firstsetup').on('click', function() {
    console.log('firstsetup clicked');
    // sslnote.closeModal();
    // localStorage.setItem('doneTutorial','yes');
    //sessionStorage.setItem('counter', 'yes');     
    sslnote.closeModal();
    mainView.loadPage('frames/setup/setupintro.html');

});
var server = localStorage.getItem('server');

// var serveronlineHTML = "<img src='http://" + server +
//     ".sslnoteserver.com/appie/php/online.png' alt='status' onerror=\"this.src='img/offline.png'\"/>";
// var serveronlinesmallHTML = "<img src='http://" + server +
//     ".sslnoteserver.com/appie/php/onlinesmall.png' alt='status' onerror=\"this.src='img/offlinesmall.png'\"/>";
// $$('.serveronlineimg').html(serveronlineHTML);
// $$('.serveronlineimgsmall').html(serveronlinesmallHTML);



if (localStorage.getItem('loginfails') >= '1') {
    $('.loginfailsbadge').removeClass('badge-green');
    $('.loginfailsbadge').addClass('badge-red');
    $('.loginfailsbadge').text(localStorage.getItem('loginfails'));
}
if (localStorage.getItem('loginfails') == '0') {
    $('.loginfailsbadge').removeClass('badge-red');
    $('.loginfailsbadge').addClass('badge-green');
    $('.loginfailsbadge').text(localStorage.getItem('loginfails'));
}
$$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') + "/strings.json",
    function(languageSpecificObject) {
        $$(".languagespecificHTML").each(function() {
            $(this).html(languageSpecificObject.languageSpecifications[
                0][$(this).data("text")]);
        });
        $$(".languageSpecificPlaceholder").each(function() {
            $(this).attr("placeholder", languageSpecificObject.languageSpecifications[
                0][$(this).data("text")]);
        });
        $$(".languageSpecificValue").each(function() {
            $(this).attr("value", languageSpecificObject.languageSpecifications[
                0][$(this).data("text")]);
        });
    });


// MOVED IVM ANDROID
// $$('.showcontacts').on('click', function() {
//     console.log('contactsview TAB =  ');
//     //////console.log('//!! STOP LOOP');
//     var totalsec = localStorage.getItem('logofftimer') * 58;
//     clearTimeout(loop);
//     ////console.log('UPDATE COUNTER + '+totalsec);
//     $('.countdown_dashboard').data('countdown').update({
//         diff: totalsec,
//         onEnd: function() {
//             console.log(
//                 '+++ countdown finish onPageInit Scontactlist'
//             );
//             sslnote.hideIndicator();
//             mainView.router.load({
//                 url: 'frames/login.html',
//                 animatePages: false
//             });
//             sessionStorage.clear();
//             $('.countdown_dashboard').data('countdown').update({
//                 diff: '-1'
//             });
//             sslnote.loginScreen();
//             console.log(
//                 '//!! STOP LOOP from counter #contactsview'
//             );
//             clearTimeout(loop);
//             sslnote.hideIndicator();
//         }
//     });
//     $('.countdown_dashboard').data('countdown').start();
//     ////console.log('UPDATE COUNTER DONE #contactsview');
//     //mainView.router.load('frames/messages/Scontactlist.html');
//     mainView.router.load({
//         url: 'frames/messages/Scontactlist.html',
//         animatePages: false,
//         reload: true
//     });
//     ////console.log('!!! makeContactlist DONE'); 
//     // setTimeout(function() {
//     //     ////console.log('***** START setTimeout Fn contactonline *****');
//     //     checkContactsOnline();
//     //     ////console.log('!!! makeContactlist START');
//     //     makeContactlist();
//     //     ////console.log('***** END setTimeout Fn contactonline *****');  
//     //     //  CcheckLastActive();
//     // }, 0);
// });
// $$('.showsettings').on('click', function() {
//     console.log('showsettings TAB =  ');
//     //////console.log('//!! STOP LOOP');
//     var totalsec = localStorage.getItem('logofftimer') * 58;
//     clearTimeout(loop);
//     //console.log('UPDATE COUNTER + '+totalsec);
//     $('.countdown_dashboard').data('countdown').update({
//         diff: totalsec,
//         onEnd: function() {
//             console.log(
//                 '+++ countdown finish onPageInit Scontactlist'
//             );
//             sslnote.hideIndicator();
//             mainView.router.load({
//                 url: 'frames/login.html',
//                 animatePages: false
//             });
//             sessionStorage.clear();
//             $('.countdown_dashboard').data('countdown').update({
//                 diff: '-1'
//             });
//             sslnote.loginScreen();
//             console.log(
//                 '//!! STOP LOOP from counter .showsettings'
//             );
//             clearTimeout(loop);
//             sslnote.hideIndicator();
//         }
//     });
//     $('.countdown_dashboard').data('countdown').start();
//     //console.log('UPDATE COUNTER DONE .showsettings');
//     //mainView.router.load('frames/settings/index.html');
//     mainView.router.load({
//         url: 'frames/settings/index.html',
//         animatePages: false,
//         reload: true
//     });
// });
$$('.showTourClose').on('click', function() {
    closeTour();
});

$$('.sslnoteversion').html(localStorage.getItem('sslnoteversion'));
$$('.sslnoteapp').html(localStorage.getItem('sslnoteapp'));

//*************************************************************************************************************
//*************************************************************************************************************
//********************** INIT ****************************************************************************
//*************************************************************************************************************
$$(document).on('pageInit', function(e) {
    //console.log('-----------------------');
    //console.log('*** pageInit ***');
    var page = e.detail.page;
    //console.log('*** !!page.name *** ' +page.name);
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
    ////console.log('*** totalmessages = ' +totalmessages); 
    if (mid >= '0') {
        sessionStorage.setItem('mid', mid);
        ////console.log('*** sessionStorage mid set ' +mid);
    }
    ////console.log('*** sessionStorage mid *** ' +sessionStorage.getItem('mid'));
    if (his_uid !== 'null' && his_uid !== 'undefined') {
        sessionStorage.setItem('his_uid', his_uid);
        ////console.log('*** sessionStorage his_uid set ' +his_uid);
    }
    ////console.log('*** sessionStorage his_uid *** ' +sessionStorage.getItem('his_uid'));
    if (his_nick !== 'null' && his_nick !== 'undefined') {
        sessionStorage.setItem('his_nick', his_nick);
        ////console.log('*** sessionStorage his_nick set ' +his_nick);
    }
    ////console.log('*** sessionStorage his_nick *** ' +sessionStorage.getItem('his_nick'));
    if (his_server !== 'null' && his_server !== 'undefined') {
        sessionStorage.setItem('his_server', his_server);
        ////console.log('*** sessionStorage his_server set ' +his_server);
    }
    ////console.log('*** sessionStorage his_server *** ' +sessionStorage.getItem('his_server'));
    ////console.log('-----------------------');
    var youruidcontent = "<a href='#' class='youruidinfo'>" +
        localStorage.getItem('UID') + "</a></p>";
    localStorage.setItem('youruid', youruidcontent);
    //var youruidnavbarcontent = 'YOUR PiD (' + localStorage.getItem('my_pid') + ')';
    localStorage.setItem('youruidnavbar', youruidnavbarcontent);
    var youruidnavbarcontent = localStorage.getItem('UID');
    localStorage.setItem('youruidnavbar', youruidnavbarcontent);
    var settingsscreenprotectData = sslnote.formGetData(
        'settingsscreenprotect');
    var storedData = sslnote.formGetData('settingsscreenprotect');
    

    $$('.refresh-link.refresh-home').on('click', function() {
        console.log('refresh-link pressed');
        importNewUIDLinks();
        JsonMessagesToSend();
    });


$$('.sslnoteversion').html(localStorage.getItem('sslnoteversion'));
$$('.sslnoteapp').html(localStorage.getItem('sslnoteapp'));


    // //console.log('Startscreenprotect Started = ' +localStorage.getItem('screenprotecttimer'));
    // Startscreenprotect(); 
    // var i;
    // console.log("***** LOCAL STORAGE *****");
    // for (i=0; i<localStorage.length; i++)   {
    // console.log(localStorage.key(i)+"="+localStorage.getItem(localStorage.key(i))+"");
    // }
    // console.log("***** END LOCAL STORAGE *****");
    // console.log("***** SESSION STORAGE *****");
    // for (i=0; i<sessionStorage.length; i++) {
    // console.log(sessionStorage.key(i)+"="+sessionStorage.getItem(sessionStorage.key(i))+"");
    // }
    // console.log("***** END SESSION STORAGE *****");
    $$('.contactlist').html(localStorage.getItem('contactlist'));
    $$('.UID').html(localStorage.getItem('UID'));
    $$('.yourinfo').html(localStorage.getItem('youruid'));
    $$('.yourinfonavbar').html(localStorage.getItem('youruidnavbar'));
    $$('.myuidheader').html(localStorage.getItem('UID'));
    $$('.hisnickinfonavbar').html(sessionStorage.getItem('his_nick'));
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            // $$('.hisuidlastseen').html('<DIV>'+ languageSpecificObject.languageSpecifications[0]['lastseen']+ ' : ' +localStorage.getItem(his_uid+'active_last') +'</DIV>');
            localStorage.setItem('lastseentxt',
                languageSpecificObject.languageSpecifications[0]
                ['lastseen']);
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
            localStorage.setItem('oke', languageSpecificObject.languageSpecifications[
                0]['oke']);
            localStorage.setItem('messagesnew',
                languageSpecificObject.languageSpecifications[0]
                ['messagesnew']);
            localStorage.setItem('messageissend',
                languageSpecificObject.languageSpecifications[0]
                ['messageissend']);
            localStorage.setItem('messagesdelivered',
                languageSpecificObject.languageSpecifications[0]
                ['messagesdelivered']);
            localStorage.setItem('crypting', languageSpecificObject
                .languageSpecifications[0]['crypting']);
            localStorage.setItem('oepsaerror',
                languageSpecificObject.languageSpecifications[0]
                ['oepsaerror']);
            localStorage.setItem('updating', languageSpecificObject
                .languageSpecifications[0]['updating']);
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
            localStorage.setItem('busy', languageSpecificObject.languageSpecifications[
                0]['busy']);
            // localStorage.getItem('messagesdelivered')
        });
    $$('input[name="sound"]').on('change', function() {
        if (this.checked) {
            //console.log('we have sound');
            console.log(this.value);
            var playsound = this.value;
            localStorage.setItem('sound', playsound);
            //console.log('SOUND = ' +playsound);
            if (os === 'ios') {
                var snd = new Media(playsound);
                snd.play();
            } else {
                var sound_click = new Howl({
                    urls: [playsound],
                    volume: 50
                });
                sound_click.play();
            }
        }
    });

// MOVED IVM ANDROID

$$('.showcontacts').on('click', function() {
    console.log('contactsview TAB =  ');
    //////console.log('//!! STOP LOOP');
    var totalsec = localStorage.getItem('logofftimer') * 58;
    clearTimeout(loop);
    ////console.log('UPDATE COUNTER + '+totalsec);
    $('.countdown_dashboard').data('countdown').update({
        diff: totalsec,
        onEnd: function() {
            console.log(
                '+++ countdown finish onPageInit Scontactlist'
            );
            sslnote.hideIndicator();
            mainView.router.load({
                url: 'frames/login.html',
                animatePages: false
            });
            sessionStorage.clear();
            $('.countdown_dashboard').data('countdown').update({
                diff: '-1'
            });
            sslnote.loginScreen();
            console.log(
                '//!! STOP LOOP from counter #contactsview'
            );
            clearTimeout(loop);
            sslnote.hideIndicator();
        }
    });
    $('.countdown_dashboard').data('countdown').start();
    ////console.log('UPDATE COUNTER DONE #contactsview');
    //mainView.router.load('frames/messages/Scontactlist.html');
    mainView.router.load({
        url: 'frames/messages/Scontactlist.html',
        animatePages: false,
        reload: true
    });
    ////console.log('!!! makeContactlist DONE'); 
    // setTimeout(function() {
    //     ////console.log('***** START setTimeout Fn contactonline *****');
    //     checkContactsOnline();
    //     ////console.log('!!! makeContactlist START');
    //     makeContactlist();
    //     ////console.log('***** END setTimeout Fn contactonline *****');  
    //     //  CcheckLastActive();
    // }, 0);
});
$$('.showsettings').on('click', function() {
    console.log('showsettings TAB =  ');
    //////console.log('//!! STOP LOOP');
    var totalsec = localStorage.getItem('logofftimer') * 58;
    clearTimeout(loop);
    //console.log('UPDATE COUNTER + '+totalsec);
    $('.countdown_dashboard').data('countdown').update({
        diff: totalsec,
        onEnd: function() {
            console.log(
                '+++ countdown finish onPageInit Scontactlist'
            );
            sslnote.hideIndicator();
            mainView.router.load({
                url: 'frames/login.html',
                animatePages: false
            });
            sessionStorage.clear();
            $('.countdown_dashboard').data('countdown').update({
                diff: '-1'
            });
            sslnote.loginScreen();
            console.log(
                '//!! STOP LOOP from counter .showsettings'
            );
            clearTimeout(loop);
            sslnote.hideIndicator();
        }
    });
    $('.countdown_dashboard').data('countdown').start();
    //console.log('UPDATE COUNTER DONE .showsettings');
    //mainView.router.load('frames/settings/index.html');
    mainView.router.load({
        url: 'frames/settings/index.html',
        animatePages: false,
        reload: true
    });
});


    // $$('.klik').on('click', function() {
    //     //console.log('+ Play klik sound');
    // var storedData =  sslnote.formGetData('settings-keyboardclick') ;
    // if(storedData) {
    // var keyboardclick = storedData.keyboardclick ;
    // } else 
    // {
    // var keyboardclick = "on" ;
    // }
    // if (keyboardclick !="") {
    //     //console.log('+ Fn Play klik sound = on');
    //         var kliksound = "Tock.mp3";
    //             if (os == 'ios') {
    //                 var snd = new Media(kliksound);
    //                 snd.setVolume('0.1');
    //                 snd.play();
    //             } else {
    //                 var sound_click = new Howl({
    //                     urls: [kliksound],
    //                     volume: 20
    //                 });
    //                 sound_click.play();
    //             }
    //    }
    // })
    if (localStorage.getItem('connection') === 'https://sslnote.com') {
        localStorage.setItem('vpnstatus', 'vpn<BR>US');
        var server = 'https://sslnote.com';
        localStorage.setItem('sslserver', server);
    }
    if (localStorage.getItem('autologon') !== '999') {
        var storedData = sslnote.formGetData('settingslogoff');
        if (storedData) {
            for (var key in storedData) {
                var tmp = storedData[key];
                if (tmp !== null) {
                    if (tmp === '999') {
                        localStorage.setItem('autologon', '999');
                        var logofftimer = 999999999999;
                        localStorage.setItem('logofftimer', logofftimer);
                        sessionStorage.setItem('logofftimer',
                            logofftimer);
                    } else {
                        var logofftimer = tmp;
                        localStorage.setItem('autologon', '0');
                        localStorage.setItem('logofftimer', logofftimer);
                        sessionStorage.setItem('logofftimer',
                            logofftimer);
                    }
                }
            }
        } else {
            var logofftimer = '3';
            localStorage.setItem('logofftimer', logofftimer);
            sessionStorage.setItem('logofftimer', logofftimer);
        }
    }




    if (localStorage.getItem('autologon') === '999') {
        var logofftimer = 999999;
        localStorage.setItem('logofftimer', logofftimer);
        sessionStorage.setItem('logofftimer', logofftimer);
    }




    $$('.reset-local-storage').on('click', function() {
        //console.log('BUTTON reset-local-storage');
        var clickedLink = $(this);
        if (sslnote.device.iphone) {
            var buttons1 = [{
                text: 'This will remove data that is used for local Settings. Installed updates are not affected. The App will be restarted once the process is finished.',
                label: true
            }, {
                text: 'Remove Now',
                red: true,
                color: 'theme-red',
                onClick: function() {
                    //clearInterval(timedTheme);
                    localStorage.clear();
                    sessionStorage.clear();
                    $('body').append(
                        '<div class="update-view"><img src="iTunesArtwork.png" /></div>'
                    );
                    setTimeout(function() {
                        $('.update-view').append(
                            '<div class="progress-bar"><div class="inner-progress" id="update-progress"></div></div>'
                        );
                        interval =
                            setInterval(
                                function() {
                                    addProgress
                                        (
                                            'update-progress'
                                        );
                                }, Math.random() *
                                750);
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
        } else {
            sslnote.modal({
                title: 'Remove Website Data',
                text: 'This will remove data that is used to display Bugs and Settings. Installed updates are not affected. The App will be restarted once the process is finished.',
                buttons: [{
                    text: 'Remove Now',
                    onClick: function() {
                        //clearInterval(timedTheme);
                        localStorage.clear();
                        $('body').append(
                            '<div class="update-view"><img src="iTunesArtwork.png" /></div>'
                        );
                        setTimeout(function() {
                            $(
                                '.update-view'
                            ).append(
                                '<div class="progress-bar"><div class="inner-progress" id="update-progress"></div></div>'
                            );
                            interval
                                =
                                setInterval(
                                    function() {
                                        addProgress
                                            (
                                                'update-progress'
                                            );
                                    },
                                    Math
                                    .random() *
                                    750
                                );
                        }, 1000);
                    }
                }, {
                    text: 'Cancel',
                    color: 'red'
                }]
            });
        }
    });
    //*************************************************************************************************************
    // $$('.reportbug').on('click', function() {
    //     sslnote.modal({
    //         title: 'Report Bug',
    //         text: '* Future function *'
    //     });
    //     setTimeout(function() {
    //         sslnote.closeModal();
    //     }, 2000);
    // });
    //*************************************************************************************************************
    //*************************************************************************************************************
    $$('.autologon').on('click', function() {
        var buttons = [{
            text: 'AutoLogon<BR>This will be disable the automatic logoff counter. The Logoff by \'Shaking\' will still work.<BR>By selecting ENABLE or DISABLE App will be restarted.',
            label: true
        }, {
            text: 'Enable',
            bold: true,
            onClick: function() {
                sslnote.closeModal();
                localStorage.setItem('autologon',
                    '999');
                var logofftimer = 999999999999;
                localStorage.setItem('logofftimer',
                    logofftimer);
                // setTimeout(function() {
                window.location.reload();
                // // mainView.loadPage('frames/login/Slogin-screen-embedded.html');
                // }, 600);
            }
        }, {
            text: 'Disable',
            bold: true,
            onClick: function() {
                sslnote.closeModal();
                sessionStorage.clear();
                localStorage.setItem('autologon',
                    '0');
                var logofftimer = 3;
                localStorage.setItem('logofftimer',
                    logofftimer);
                // setTimeout(function() {
                window.location.reload();
                // // mainView.loadPage('frames/login/Slogin-screen-embedded.html');
                // }, 600);
            }
        }, {
            text: 'Cancel',
            color: 'red',
            onClick: function() {
                sslnote.closeModal();
            }
        }];
        sslnote.actions(buttons);
    });
    //console.log('+++ Fn ShowCounter');



if (page.name !== 'index' || 
    page.name !== 'login' || 
    page.name !== 'login-screen' || 
    page.name !== 'firstsetup' || 
    page.name !== 'contactlist' || 
    page.name !== 'settings' 


    ) {

    $('.countdown_dashboard').countdown();
    console.log('+++ countdown start');



    var totalsec = localStorage.getItem('logofftimer') * 58;
    // mainView.router.load({url:'frames/messages/Scontactlist.html',animatePages:false});
    if (localStorage.getItem('autologon') == '999') {
        // mainView.router.load({
        //     url: 'frames/messages/Scontactlist.html',
        //     animatePages: false
        // });
        document.getElementById('countdown_dashboardHide').innerHTML =
            '<a href=\'#\' class=\'autologon\'>OFF</a>';
            // '<center><a href=\'#\' class=\'autologon\'><i class=\'ion-ios-refresh white\'></i></a></center>';

        //sslnote.hideIndicator();
    } else {
        //if(!localStorage.getItem('doneSetup')) { totalsec = '999999';}
        // if(!localStorage.doneTutorial) { totalsec = '999999';}
        console.log(' 1340 UPDATE COUNTER iNIT+ '+totalsec);
        //sslnote.closeModal('.login-screen');
        $('.countdown_dashboard').data('countdown').update({
            diff: totalsec,
            onEnd: function() {
                console.log('+++ 1345 countdown finish ');
                sslnote.hideIndicator();

                mainView.router.load({
                    url: 'frames/login.html',
                    animatePages: false
                });

                sessionStorage.clear();
                $('.countdown_dashboard').data('countdown')
                    .update({
                        diff: '-1'
                    });

                $('.countdown_dashboard').data('countdown').stop();

                sslnote.loginScreen();
                //console.log('!! STOP LOOP from counter');
                clearTimeout(loop);
                sslnote.hideIndicator();
            }
        });


        $('.countdown_dashboard').data('countdown').start();
        //mainView.router.load({url:'frames/messages/Scontactlist.html',animatePages:false});
        // }
        //console.log('UPDATE COUNTER DONE iNIT');
    }

}






$$('.camera1').on('click', function() {
        console.log('camera Pressed');


var prepair ='<div class="message message-sent message-pic theimage"><img src="img/loader.png" alt="Busy" height="15" width="15">INSERT PHOTO PLEASE WAIT...';

var old =  '<img src="img/loader.png" alt="Busy" height="15" width="15">INSERT PHOTO PLEASE WAIT...';


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


var theimage = '<div class="message message-sent message-pic message-last"><img src="data:image/jpeg;base64,' +base64Img + '"></div>';


                $$('#theimage').html(theimage);

var theimagestore = '<div class="message message-pic"><img src="data:image/jpeg;base64,' +base64Img + '"></div>';

                sessionStorage.setItem('imageURL',theimagestore);


                console.log('-- THE IMAGE onSuccess DONE');

            }

            function onFail(message) {
                sslnote.alert('Failed because: ' +message);
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
            var his_uidscan = sessionStorage.getItem(
                'QRscanUID');
            var server = localStorage.getItem('server');
            var data = {
                uid: uid,
                server: server,
                his_uid: his_uidscan
            };
            sslnote.formFromJSON('#contactadd', data);
            mainView.loadPage(
                'frames/settings/mysettings/ScontactAdd.html'
            );
        }, function(error) {
            sslnote.alert("Scanning failed: " + error);
        });
        //console.log('QRscanner Pressed DONE');
    });
    //*************************************************************************************************************
    //********************** PAGE ****************************************************************************
    //*************************************************************************************************************
    //*************************************************************************************************************
    //********************** END PAGE INIT ****************************************************************************
    //*************************************************************************************************************
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            $$(".languagespecificHTML").each(function() {
                $(this).html(languageSpecificObject.languageSpecifications[
                    0][$(this).data("text")]);
            });
            $$(".languageSpecificPlaceholder").each(function() {
                $(this).attr("placeholder",
                    languageSpecificObject.languageSpecifications[
                        0][$(this).data("text")]);
            });
            $$(".languageSpecificValue").each(function() {
                $(this).attr("value",
                    languageSpecificObject.languageSpecifications[
                        0][$(this).data("text")]);
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




}); // end page init
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('SmyContactList', function(page) {
    sessionStorage.setItem('showalert', 1);
    //console.log('showalert = 1');
    var uid = localStorage.getItem('UID');
    app.selectAllRecords = function(fn) {
        app.db.transaction(function(tx) {
            //console.log('selectUIDLinks');
            tx.executeSql(selectUIDLinks, [uid], fn,
                onError);
        });
    };
    // function getAllTheData() {
    var render = function(tx, rs) {
        // //console.log('-----------------------------------'); 
        // console.log(rs.rows.length); 
        // //console.log('-----------------------------------'); 
        var uid = localStorage.getItem('UID');
        for (var i = 0; i < rs.rows.length; i++) {
            //console.log(rs.rows.item(i));
        }
        if (rs.rows.length) {
            ////console.log('RECORD EXIST');
            contactlistTemplate = $$('#Mycontactlist-template').html();
            var Mycontactlisthtml = '';
            ////console.log('2 RECORD EXIST');
            for (var i = 0; i < rs.rows.length; i++) {
                //console.log('RECORD HAVE VAR');
                var MycontactItem = rs.rows.item(i);
                ////console.log('MycontactItem = ' +rs.rows.item(i));
                //console.log(MycontactItem);
                // edit lastseen view
                Mycontactlisthtml += contactlistTemplate.replace(
                    /{{my_uid}}/g, MycontactItem.my_uid).replace(
                    /{{his_uid}}/g, MycontactItem.his_uid).replace(
                    /{{his_nick}}/g, MycontactItem.his_nick).replace(
                    /{{his_server}}/g, MycontactItem.his_server
                );
            }
            ////console.log('Mycontactlisthtml = ' +Mycontactlisthtml );
            $$('.Mycontactlist').html(Mycontactlisthtml);
        }
    }
    app.selectAllRecords(render);
});
//////////////////////////////////////////////////////////////////////
sslnote.onPageBeforeAnimation('Scontactlist', function(page) {
// //console.log('!!!! onPageBeforeAnimation Scontactlist');
// //console.log(page.name);
// //console.log('!!!! onPageBeforeAnimation Scontactlist');
//     setTimeout(function(){
//     //console.log('***** START setTimeout Fn makeContactlist *****');
//     makeContactlist();
//     //console.log('***** END setTimeout Fn makeContactlist *****');  
//     CcheckLastActive();
//     },0);
// //console.log('--- Start SQLiteUpdateMessagesTotal');
// SQLiteUpdateMessagesTotal();
// //console.log('--- End SQLiteUpdateMessagesTotal');
// //console.log('***** START CHECK MESSAGE TO SEND *****');
// JsonMessagesToSend();
// //console.log('***** END CHECK MESSAGE TO SEND *****');
iAmOnline();
});
// //////////////////////////////////////////////////////////////////////
sslnote.onPageInit('Scontactlist', function(page) {
    //////////////////////////////////////////////////////////////////////
    //console.log('!!!! onPageInit Scontactlist');
    ////console.log(page.name);
    //$$('.contactlist').html(localStorage.getItem('contactlisthtml'));
    sslnote.showToolbar('.tabbar');
    localStorage.setItem('showalert', 1);
    sslnote.showTab('#contactsview');
    //importNewUIDLinks();




    setDataSource();



    $("#connection").removeClass("connectionHidden");
    if (!localStorage.dotour) {
        //console.log('Add TEST contact');
        app.db.transaction(function(tx) {
            //console.log('insertTestUID ');
            // var insertSupportUID = "INSERT OR IGNORE INTO uid_links (my_uid,his_uid,his_nick,his_server,autocrypt,autocryptkey,online) VALUES (?,?,?,?,?,?,?)";
            tx.executeSql(insertSupportUID, [localStorage.getItem(
                    'UID'), localStorage.getItem(
                    'testUID'), 'TEST UID',
                localStorage.getItem('testserver'), '0',
                '0', '1'
            ], onInsertSuccess, onError);
        });
        //         SQLiteUpdateMessagesTotal() ;
    }
    var mySearchbar = sslnote.searchbar('.searchbar', {
        searchList: '.list-block-search',
        searchIn: '.item-title'
    });
    // Pull to refresh content
    var ptrContent = $$('.pull-to-refresh-content');
    ptrContent.on('refresh', function(e) {
        // Emulate 2s loading
        //console.log('pull-to-refresh pressed'); 
        setTimeout(function() {
            importNewUIDLinks();
            JsonMessagesToSend();
            //  makeContactlist();
            //console.log('makeContactlist pull to refresh');
            //ptrContent.find('ul').prepend(linkHTML);
            // When loading done, we need to "close" it
            sslnote.pullToRefreshDone();
            // hideBusy();
            // //console.log('+++ hideBusy');
        }, 2000);
    }); //sslnote.pullToRefreshTrigger(ptrContent);


    // setTimeout(function() {
    //     console.log('***** START setTimeout Fn contactonline *****');
    //     checkContactsOnline();
    //     ////console.log('***** END setTimeout Fn contactonline *****');  
    //     //  CcheckLastActive();
    // }, 0);


    setTimeout(function() {
        console.log('***** START CHECK MESSAGE TO SEND *****');
        JsonMessagesToSend();
        ////console.log('***** END CHECK MESSAGE TO SEND *****');
    }, 0);


    sslnote.hideIndicator();
    // if (!sessionStorage.LogedIn) {
    //     // importNewUIDLinks();
    //     sessionStorage.LogedIn = true;
    // }
    makeContactlist();




});
////////////////////////////////////////////////////////////////////
sslnote.onPageAfterAnimation('Scontactlist', function(page) {
    //////////////////////////////////////////////////////////////////////
    console.log('!!! onPageAfterAnimation Scontactlist');
    //console.log(page.name);
    if (localStorage.dotourfirstmessagesend === 'showsend') {
        //console.log('dotourfirstmessagesend === showsend' );
        var dotourHTML = '<li>' +
            '<div class="item-title center">Great you send your Cypted message!.<BR>' +
            'In some seconds you will receive the message back from TEST UID (ROBOT)<BR>' +
            'Then you can Decrypt the message.<BR>' +
            '<div class="item-after center">Meanwhile let\'s look what is Pull to Refresh<BR>(Synchronisch ContactList)<BR><a href="#" class="showTourPullToRefresh badge badge-green" >Show Pull To Refresh' +
            '</a>' +
            ' -  <a href="#" class="link item-link showTourClose badge badge-green" >i know, please skip' +
            '</a>' +
            '</div><BR>Just pull page down to let the magic happen.' +
            '</div>' + '</li>';
        $$('.dotour').html(dotourHTML);
        localStorage.dotourfirstmessagesend = 'Done';
        $$('.showTourClose').on('click', function() {
            closeTour();
        });
        $$('.showTourPullToRefresh').on('click', function() {
            //console.log('showTourPullToRefresh pressed');
            sslnote.pullToRefreshTrigger();
        });
        // localStorage.dotourfirstmessagesendDone = true;
        //console.log('--- dotourfirstmessagesend = done'); 
    }
    if (localStorage.dotourfirstmessagesend === 'showaddcontact') {
        //console.log('dotourfirstmessagesend === showaddcontact' );
        var dotourHTML = '<li>' +
            '<div class="item-title center">To add a new contact click settings or<BR>' +
            '<i class="ion-navicon-round dotour"></i> upper right menu icon and select add contact.' +
            '<div class="item-after center"><a href="#" class="showTourAddContact badge badge-green" >Oke, show me' +
            '</a>' +
            ' -  <a href="#" class="link item-link showTourClose badge badge-green" >i know, please skip' +
            '</a>' + '</div><br>' + '</div>' + '</li>';
        $$('.dotour').html(dotourHTML);
        localStorage.dotourfirstmessagesend = 'Done';
        $$('.showTourClose').on('click', function() {
            closeTour();
        });
        $$('.showTourAddContact').on('click', function() {
            //console.log('showTourAddContact pressed');
            localStorage.dotourfirstmessagesend = 'Done';
            dotourHTML = '';
            $$('.dotour').html(dotourHTML);
            mainView.loadPage(
                'frames/settings/mysettings/ScontactAdd.html'
            );
        });
    }
    makeContactlist();
});
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setup-done', function() {
    // if (page.name === 'setup-done') {
    //console.log('page.name setup-done');
    localStorage.setItem('showalert', 0);
    //makeContactlist();
    // done add test UID
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            //console.log('Add TEST contact');
            app.db.transaction(function(tx) {
                //console.log('insertTestUID ');
                //var insertSupportUID = "INSERT OR IGNORE INTO uid_links (my_uid,his_uid,his_nick,his_server,autocrypt,autocryptkey,online) VALUES (?,?,?,?,?,?,?)";
                tx.executeSql(insertSupportUID, [
                    localStorage.getItem('UID'),
                    localStorage.getItem('testUID'),
                    'TEST UID', localStorage.getItem(
                        'testserver'), '0', '0',
                    '1'
                ], onInsertSuccess, onError);
            });
            var posturl =
                'https://sslnote.com/appie/php/include/JsonInsertUIDLinks.php?sslnoteapp=' +
                localStorage.getItem('sslnoteapp') + '&my_server=' +
                localStorage.getItem('server') + '&my_uid=' +
                localStorage.getItem('UID') + '&my_nick=' +
                localStorage.getItem('UID') + '&his_uid=' +
                localStorage.getItem('testUID') + '&his_server=' +
                localStorage.getItem('testserver') +
                '&his_nick=TEST UID';
            //console.log(posturl);
            $$.post(posturl, function(data) {
                //console.log('**************************************');
                //console.log('POST RESPONSE TEST UID INSERTED');
                console.log(data);
                //console.log('**************************************');
            });

            $$.ajax({
                method: 'POST',
                dataType: 'json',
                url: 'https://sslnote.com/appie/php/include/SetSyncUIDLinks.php?',
                crossDomain: true,
                data: {
                    uid: localStorage.getItem('UID')
                },
                success: function(responseData, textStatus,jqXHR) {
                  if (responseData) {
                    console.log('*** SetSyncUIDLinks ' + responseData);
                    }
                }
            });


        });



    $$('.restartapp').on('click', function() {
        localStorage.setItem('doneSetup', 'yes');
        window.location.reload();
    });
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            sslnote.modal({
                title: languageSpecificObject.languageSpecifications[
                    0]['importent'],
                text: languageSpecificObject.languageSpecifications[
                        0]['done1'] + localStorage.getItem(
                        'UID') + languageSpecificObject.languageSpecifications[
                        0]['done2'] + sessionStorage.getItem(
                        'reactivatecode') +
                    languageSpecificObject.languageSpecifications[
                        0]['done3'] + localStorage.getItem(
                        'sslnoteapp') +
                    languageSpecificObject.languageSpecifications[
                        0]['done4'],
                buttons: [{
                    text: localStorage.getItem(
                        'oke'),
                    onClick: function() {}
                }]
            }); // END  SETPASS ===== */
        });
});
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('getting-started-main', function() {
    // if (page.name === 'getting-started-main') {
    //console.log('page.name getting-started-main');
    localStorage.setItem('showalert', 0);
    //console.log('showalert = 0');
    //console.log('iNIT getting-started-main');
    // var mySlider = sslnote.slider('.slider-container-h', {
    //     spaceBetween: 100,
    //     pagination: '.slider-pagination-h',
    //     paginationHide: false
    // });
    // var vSlider = sslnote.slider('.slider-container-v', {
    //     spaceBetween: 100,
    //     pagination: '.slider-pagination-v',
    //     paginationHide: false
    // });
    $('[data-page="getting-started-main"] .close-popup').on('click',
        function() {
            setTimeout(function() {}, 300);
        });
    $('.close-tutorial').on('click', function() {
        //console.log('++ press close-tutorial');
        sslnote.closeModal();
        sslnote.hideIndicator();
        localStorage.setItem('doneTutorial', 'yes');
        mainView.router.load({
            url: 'frames/login.html',
            animatePages: false
        });
    });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('SpidEdit', function(page) {
    // if (page.name === 'SpidEdit') {
    //console.log('page.name SpidEdit');
    localStorage.setItem('showalert', 0);
    //console.log('showalert = 1');
    //console.log('SpidEdit INIT');
    var his_uid = page.query.his_uid;
    var his_nick = page.query.his_nick;
    //var lhis_uid = page.query.lhis_uid;
    console.log(his_uid);
    sessionStorage.setItem('pidtolink', his_uid);
    sessionStorage.setItem('his_uid', his_uid);
    sessionStorage.setItem('his_nick', his_nick);
    //console.log(lhis_uid);
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            sslnote.showPreloader(languageSpecificObject.languageSpecifications[
                0]['loading']);
            $$.ajax({
                method: 'POST',
                dataType: 'json',
                url: localStorage.getItem('connection') +
                    '/appie/php/' + localStorage.getItem(
                        'sslnoteapp') + '/CpidEdit.php?',
                crossDomain: true,
                data: {
                    his_uid: his_uid
                },
                success: function(data) {
                    //console.log('ECHO DATA');
                    console.log(data);
                    sslnote.formFromJSON('#pidedit',
                        data);
                    //console.log('show stored data');
                    //sslnote.hidePreloader();
                }
            });
            //console.log('Load CLinkList.php');
            $$.ajax({
                method: 'POST',
                dataType: 'jsonp',
                url: localStorage.getItem('connection') +
                    '/appie/php/' + localStorage.getItem(
                        'sslnoteapp') +
                    '/CLinkList.php?callback=?',
                crossDomain: true,
                data: {
                    his_uid: his_uid
                },
                success: function(data) {
                    ////console.log('ECHO DATA');
                    console.log(data);
                    // sslnote.formFromJSON('#pidedit', data);
                    ////console.log('show stored data');
                    sslnote.hidePreloader();
                    $$('.LINKS').html(data);
                }
            });
            //sslnote.hidePreloader();
        });
    // pidedit update
    $$('.form-to-json').on('click', function() {
        //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
        // sslnote.showPreloader(localStorage.getItem('updating'));
        //console.log('PIDUPDATE');
        var formData = sslnote.formToJSON('#pidedit');
        // sslnote.alert(JSON.stringify(formData));
        console.log(formData);
        // send data to server
        $$.ajax({
            method: 'POST',
            dataType: 'jsonp',
            url: localStorage.getItem('connection') +
                '/appie/php/' + localStorage.getItem(
                    'sslnoteapp') + '/CpidUpdate.php?',
            crossDomain: true,
            data: formData,
            success: function(responseData, textStatus,
                errorThrown) {
                //console.log('ECHO DATA');
                console.log(responseData);
                mainView.loadPage(
                    'frames/settings/mysettings/SpidList.html'
                );
            },
            error: function(responseData, textStatus,
                errorThrown) {
                //console.log('something went wrong!! Error: ' +textStatus);
                sslnote.hidePreloader();
                sslnote.alert(
                    'Error. please try again.',
                    function() {
                        PushErrorToSupport(
                            errorThrown);
                    });
            }
        }); //end ajax
        //});
    }); //end pidupdate
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('SAddLinkListDo', function(page) {
    // if (page.name === 'SAddLinkListDo') {
    //console.log('page.name SAddLinkListDo');
    localStorage.setItem('showalert', 0);
    //console.log('showalert = 1');
    //console.log('SAddListLink INIT');
    var his_uid = page.query.his_uid;
    var his_nick = page.query.his_nick;
    var lhis_uid = page.query.lhis_uid;
    var lhis_nick = page.query.lhis_nick;
    console.log(his_uid);
    console.log(his_nick);
    console.log(lhis_uid);
    console.log(lhis_nick);
    sslnote.confirm('Link "' + his_uid + '" "' + his_nick +
        '"<br>With "' + lhis_uid + '" "' + lhis_nick +
        '"<br>Are you sure?', 'SSLNote', function() {
            //sslnote.alert('You clicked Ok button');
            // do your thing
            $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
                "/strings.json", function(
                    languageSpecificObject) {
                    sslnote.showPreloader(localStorage.getItem(
                        'busy'));
                    $$.ajax({
                        method: 'POST',
                        dataType: 'json',
                        url: localStorage.getItem(
                                'connection') +
                            '/appie/php/' +
                            localStorage.getItem(
                                'sslnoteapp') +
                            '/CAddLinkListDo.php?',
                        crossDomain: true,
                        data: {
                            his_uid: his_uid,
                            his_nick: his_nick,
                            lhis_uid: lhis_uid,
                            lhis_nick: lhis_nick
                        },
                        success: function(data) {
                            //console.log('ECHO DATA A');
                            console.log(data);
                            sslnote.hidePreloader();
                            sslnote.alert(
                                'Link Add',
                                function() {
                                    mainView.loadPage(
                                        'frames/settings/mysettings/SpidList.html'
                                    );
                                });
                        }
                    });
                });
        }, function() {
            //sslnote.alert('You clicked Cancel button');
            mainView.back();
        });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('SAddLinkList', function(page) {
    // if (page.name === 'SAddLinkList') {
    //console.log('page.name SAddLinkList');
    localStorage.setItem('showalert', 0);
    //console.log('showalert = 1');
    //console.log('SAddLinkList INIT');
    var his_uid = page.query.his_uid;
    var his_nick = page.query.his_nick;
    var lhis_uid = page.query.lhis_uid;
    var lhis_nick = page.query.lhis_nick;
    console.log(his_uid);
    console.log(his_nick);
    console.log(lhis_uid);
    console.log(lhis_nick);
    $$('.pidtolink').html(sessionStorage.getItem('pidtolink'));
    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: localStorage.getItem('connection') + '/appie/php/' +
            localStorage.getItem('sslnoteapp') +
            '/CAddLinkList.php?callback=?',
        crossDomain: true,
        data: {
            his_uid: sessionStorage.getItem('pidtolink'),
            his_nick: sessionStorage.getItem('his_nick'),
            lhis_uid: lhis_uid,
            lhis_nick: lhis_nick,
            server: localStorage.getItem('server'),
            uid: localStorage.getItem('UID')
        },
        success: function(data) {
            ////console.log('ECHO DATA');
            console.log(data);
            // sslnote.formFromJSON('#pidedit', data);
            ////console.log('show stored data');
            sslnote.hidePreloader();
            $$('.menulist').html(data);
        }
    });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('SDeleteListLink', function(page) {
    // if (page.name === 'SDeleteListLink') {
    //console.log('page.name SDeleteListLink');
    localStorage.setItem('showalert', 0);
    //console.log('showalert = 1');
    //console.log('SDeleteListLink INIT');
    var his_uid = page.query.his_uid;
    var lhis_uid = page.query.lhis_uid;
    sslnote.confirm('Delete "' + lhis_uid + '" Link <br> Are you sure?',
        'SSLNote', function() {
            //sslnote.alert('You clicked Ok button');
            // do your thing
            //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
            sslnote.showPreloader(localStorage.getItem('busy'));
            $$.ajax({
                method: 'POST',
                dataType: 'jsonp',
                url: localStorage.getItem('connection') +
                    '/appie/php/' + localStorage.getItem(
                        'sslnoteapp') +
                    '/CDeleteListLink.php?callback=?',
                crossDomain: true,
                data: {
                    his_uid: his_uid,
                    lhis_uid: lhis_uid
                },
                success: function(data) {
                    //console.log('ECHO DATA');
                    console.log(data);
                    sslnote.hidePreloader();
                    sslnote.alert(data, function() {
                        mainView.loadPage(
                            'frames/settings/mysettings/SpidList.html'
                        );
                    });
                }
            });
            //});            
        }, function() {
            //sslnote.alert('You clicked Cancel button');
            mainView.back();
        });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('Smessagelist', function() {
    // if (page.name === 'Smessagelist') {
    //console.log('page.name Smessagelist');
    localStorage.setItem('showalert', 0);
    //console.log('showalert = 1');
    //console.log('PAGE INIT SMESSAGELIST');
    //console.log('insert session messagelist', +sessionStorage.getItem('messagelist'));
    $$('.messagelist').append(sessionStorage.getItem('messagelist'));
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('Scontactadd', function() {
    // if (page.name === 'Smessagelist') {
    //console.log('page.name Scontactadd');
    sslnote.showTab('#mainView');
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
// sslnote.onPageInit('Scontactmessagelist', function(e) {
// // if (page.name === 'Scontactmessagelist') {
// //console.log('page.name Scontactmessagelist');
//     // //console.log('showalert = 1');
//     // //console.log('-----------------------------');
//     // //console.log('PAGE INIT Scontactmessagelist');
//     // //console.log('-----------------------------');
//     // //var my_pid = page.query.my_pid;
//     var his_uid = e.query.his_uid;
//     var his_nick = e.query.his_nick;
//     var his_server = e.query.his_server;
//     // //var totalmessages = page.query.totalmessages;
//     // //var askkey = page.query.askkey;
//     sessionStorage.setItem('his_uid', his_uid);
//     sessionStorage.setItem('his_nick', his_nick);
//     sessionStorage.setItem('his_server', his_server);
//     localStorage.setItem('showalert', 0);
//     //console.log('showalert = 0');
// showBusy();
// makeContactMessageslist(his_uid,his_nick);  
// sslnote.hideIndicator();
// hideBusy();
// } );// end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
// sslnote.onPageInit('SmyLinkCode', function() {
// // if (page.name === 'SmyLinkCode') {
// //console.log('page.name SmyLinkCode');
//     localStorage.setItem('showalert', 0);
//     //console.log('showalert = 1');
//     //console.log('SmyLinkCode INIT');
// //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
//     sslnote.showPreloader(localStorage.getItem('collectingdata'));
//     //var his_uid = sessionStorage.getItem("his_uid");
//     //var my_pid = localStorage.getItem('my_pid');
//     $$.ajax({
//         method: 'POST',
//         dataType: 'json',
//         url: localStorage.getItem('connection') + '/appie/php/' +
//             localStorage.getItem('sslnoteapp') +
//             '/CmyLinkCodeEdit.php?',
//         crossDomain: true,
//         data: {
//             my_pid: my_pid
//         },
//         success: function(data) {
//             //console.log('ECHO DATA');
//             console.log(data);
//             sslnote.formFromJSON('#linkcodedit', data);
//             //console.log('show stored data');
//             sslnote.hidePreloader();
//         }
//     });
// //});
//     // pidedit update
//     $$('.form-to-json').on('click', function() {
//         $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
//             // sslnote.showPreloader(localStorage.getItem('updating'));
//                 //console.log('SmyLinkCodeUPDATE');
//                 var formData = sslnote.formToJSON('#linkcodedit');
//                 // sslnote.alert(JSON.stringify(formData));
//                 console.log(formData);
//                 // send data to server
//                 $$.ajax({
//                     method: 'POST',
//                     dataType: 'jsonp',
//                     url: localStorage.getItem('connection') +
//                         '/appie/php/' + localStorage.getItem(
//                             'sslnoteapp') +
//                         '/CmyLinkCodeUpdate.php?',
//                     crossDomain: true,
//                     data: formData,
//                     my_pid: my_pid,
//                     success: function(responseData, textStatus,errorThrown) {
//                         //console.log('ECHO DATA');
//                         console.log(responseData);
//                         mainView.loadPage('frames/settings/index.html'
//                         );
//                     },
//                     error: function(responseData, textStatus,errorThrown) {
//                         //console.log('something went wrong!! Error: ' +textStatus);
//                          sslnote.hidePreloader();
//                                 sslnote.alert('Error. please try again.', function() {
//                                         PushErrorToSupport(errorThrown);
//                                     });
//                     }
//                 }); //end ajax
//         });
//     }); //end pidupdate
// } );// end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
// sslnote.onPageInit('Scontactadd', function() {
sslnote.onPageAfterAnimation('Scontactadd', function(page) {
    // if (page.name === 'Scontactadd') {
    //console.log('page.name Scontactadd');
    //console.log('!! STOP LOOP');
    clearTimeout(loop);

    var uid = localStorage.getItem('UID');
    var his_uidscan = sessionStorage.getItem('QRscanUID');
    var server = localStorage.getItem('server');

    var data = {
        uid: uid,
        server: server,
        his_uid: his_uidscan
    };

    sslnote.formFromJSON('#contactadd', data);

    $$('.form-to-json').on('click', function() {
        sslnote.showIndicator();
        console.log('form-to-json');
        document.activeElement.blur();
        var formData = sslnote.formToJSON('#contactadd');
        // alert(JSON.stringify(formData));
        console.log('formData = ' + formData);
        console.log(formData);


        var fhis_uid = formData.his_uid;
        var fhis_nick = formData.his_nick;
        var fnote = formData.note;


        console.log(fhis_uid);
        console.log(fhis_nick);
        console.log(fnote);

if(fhis_uid === '' || fhis_nick === '' || fnote === '')
{


console.log('All field required.');
sslnote.alert('All field required.');

sslnote.hideIndicator();
}

// {"his_uid":"","his_nick":"","note":"","uid":"LYL8W6HQ9T","server":"1001"}
else

{
        $$.ajax({
            method: 'POST',
            dataType: 'jsonp',
            url: localStorage.getItem('connection') +
                '/appie/php/include/Ccontactadd.php?',
            crossDomain: true,
            data: formData,
            success: function(responseData, textStatus,
                jqXHR) {
                console.log(responseData);
                var jsonObject = new Function(
                    'return ' + responseData)();
                console.log(jsonObject);
                console.log(jsonObject.contactfound);
                console.log(jsonObject.msg);
                // sslnote.alert(jsonObject.id);//     does nothing
                if (jsonObject.contactfound === '1') {
                    // set sessionStorage.login
                    // sessionStorage.setItem("login", jsonObject.id);
                    // sessionStorage.setItem("pid", jsonObject.id);
                    // sessionStorage.login = jsonObject.id;
                    // sslnote.alert('SESSION Login: ' + localStorage.getItem("pid")); 
                    sslnote.hideIndicator();
                    console.log(jsonObject.msg);
                    sslnote.alert(jsonObject.msg); //mainView.loadPage("frames/settings/index.html")       
                    //mainView.loadPage("Smessages.html") 

                    // ADD CONTACT

                app.db.transaction(function(tx) {
                    console.log('insert CONTACT ');
                    tx.executeSql(insertSupportUID, [
                            localStorage.getItem('UID'),fhis_uid,fhis_nick,
                            '0000','0', '0', '1'
                        ], onInsertSuccess,onError);
                });

                } else {
                    console.log(jsonObject.msg);
                    sslnote.alert(jsonObject.msg);

                app.db.transaction(function(tx) {
                    console.log('insert CONTACT ');
                    tx.executeSql(insertSupportUID, [
                            localStorage.getItem('UID'),fhis_uid,fhis_nick,
                            '0000','0', '0', '1'
                        ], onInsertSuccess,onError);
                });


                    sslnote.hideIndicator();
                    mainView.loadPage(
                        'frames/settings/mysettings/ScontactAdd.html'
                    );
                }
            },
            error: function(responseData, textStatus,
                errorThrown) {
                //console.log('something went wrong!! Error: ' +textStatus);
                sslnote.hidePreloader();
                sslnote.alert(
                    'Error. please try again.',
                    function() {
                        PushErrorToSupport(
                            errorThrown);
                    });
            }
        }); // end ajax

}

    });



    $$('.AddTestAccount').on('click', function() {

        $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
            "/strings.json", function(
                languageSpecificObject) {
                //console.log('Add TEST contact');


                app.db.transaction(function(tx) {
                    //console.log('insertTestUID ');
                    tx.executeSql(insertSupportUID, [
                            localStorage.getItem('UID'),
                            localStorage.getItem('testUID'),'TEST UID',
                            localStorage.getItem('testserver'),'0', '0', '1'
                        ], onInsertSuccess,onError);
                });

                var posturl =
                    'https://sslnote.com/appie/php/include/JsonInsertUIDLinks.php?sslnoteapp=' +
                    localStorage.getItem('sslnoteapp') +
                    '&my_server=' + localStorage.getItem(
                        'server') + '&my_uid=' +
                    localStorage.getItem('UID') +
                    '&my_nick=' + localStorage.getItem(
                        'UID') + '&his_uid=' + localStorage
                    .getItem('testUID') + '&his_server=' +
                    localStorage.getItem('testserver') +
                    '&his_nick=TEST UID';
                console.log(posturl);


                $$.post(posturl, function(data) {
                    //console.log('**************************************');
                    //console.log('POST RESPONSE TEST UID INSERTED');
                    console.log(data);
                    //console.log('**************************************');
                });
                syncUILinks();
                SQLiteUpdateMessagesTotal();
                sslnote.alert(languageSpecificObject.languageSpecifications[
                    0]['testaccountadded']);
            });
    });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('Sbugreport', function() {
    // if (page.name === 'Sbugreport') {
    //console.log('page.name Sbugreport');
    sslnote.showTab('#mainView');
    var uid = localStorage.getItem('UID');
    var server = localStorage.getItem('server');
    var version = localStorage.getItem('sslnoteapp');
    var build = localStorage.getItem('sslnoteversion');
    var data = {
        uid: uid,
        server: server,
        version: version,
        build: build
    };
    sslnote.formFromJSON('#bugreport-form', data);
    $$('.form-to-json').on('click', function() {
        sslnote.showIndicator();
        //console.log('form-to-json');
        document.activeElement.blur();
        var formData = sslnote.formToJSON('#bugreport-form');
        // sslnote.alert(JSON.stringify(formData));
        console.log(formData);
        $$.ajax({
            method: 'POST',
            dataType: 'jsonp',
            url: 'https://sslnote.com/appie/php/include/reportbug.php?',
            crossDomain: true,
            data: formData,
            success: function(responseData, textStatus,
                jqXHR) {
                console.log(responseData);
                var jsonObject = new Function(
                    'return ' + responseData)();
                console.log(jsonObject);
                sslnote.hideIndicator();
                // console.log(jsonObject.msg);
                sslnote.alert(jsonObject.msg); //mainView.loadPage("frames/settings/index.html")       
                //mainView.loadPage("Smessages.html") 
                // } else {
                // console.log(jsonObject.msg);
                // sslnote.alert(jsonObject.msg);
                // sslnote.hideIndicator();
                // mainView.loadPage('frames/settings/mysettings/ScontactAdd.html');
                // }
            },
            error: function(responseData, textStatus,
                errorThrown) {
                //console.log('something went wrong!! Error: ' +textStatus);
                sslnote.hidePreloader();
                sslnote.alert(
                    'Error. please try again.',
                    function() {
                        PushErrorToSupport(
                            errorThrown);
                    });
            }
        });
        // sslnote.alert('Thank you..');
    });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('SmyContactEdit', function(page) {
    // if (page.name === 'SmyContactEdit') {
    //console.log('page.name SmyContactEdit');
    // $$('.view-main').hide();
    // $$('.view-settings').show();
    //console.log('1 mainView..router.refreshPage()');
    // mainView.router.refreshPage();
    sslnote.showTab('#mainView');
    //console.log('2 mainView..router.refreshPage()');
    localStorage.setItem('showalert', 0);
    //console.log('showalert = 1');
    //console.log('SmyContactEdit INIT');
    var his_uid = page.query.his_uid;
    var his_nick = page.query.his_nick;
    var uid = localStorage.getItem('UID');
    //console.log('*******************************************');
    console.log(his_uid);
    console.log(his_nick);
    console.log(uid);
    sslnote.formFromJSON('#pidedit', {
        uid: localStorage.getItem('UID'),
        his_uid: his_uid,
        his_nick: his_nick
    });
    $$('.form-to-json').on('click', function() {
        //console.log('PIDUPDATE');
        var formData = sslnote.formToJSON('#pidedit');
        // sslnote.alert(JSON.stringify(formData));
        console.log(formData);
        // send data to server\\
        var ihis_nick = formData.his_nick;
        var ihis_uid = formData.his_uid;
        app.db.transaction(function(tx) {
            ////console.log('updateHisNick');
            tx.executeSql(updateHisNick, [ihis_nick,
                ihis_uid
            ], onUpdateSuccess, onError);
            sslnote.alert('Updated.');
            syncUILinks();
        });
    }); //end pidupdate
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
// sslnote.onPageInit('settings-notification', function() {
//     //console.log('page.name settings-notification');
//     localStorage.setItem('showalert', 0);
//     //console.log('showalert = 1');
//     //console.log('settings-notification INIT');
//     sslnote.formFromJSON('#settings-notification', localStorage.getItem('f7form-settings-notification'));
// }); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('settings-shake', function() {
    //console.log('page.name settings-notification');
    localStorage.setItem('showalert', 0);
    //console.log('showalert = 1');
    //console.log('settings-notification INIT');
    sslnote.formFromJSON('#settings-shake', localStorage.getItem(
        'f7form-settings-shake'));
    var storedDataShake = sslnote.formGetData('settings-shake');
    var shakesensitivity = storedDataShake.shakesensitivity;
    $$('#showValue').text(shakesensitivity);
    $$('input[type="range"]').on('input change', function() {
        // console.log(this.value);
        $$('#showValue').text(this.value);
    })
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('AppReportTraffic', function() {
    //console.log('page.name AppReportTraffic');
    sessionStorage.setItem('showalert', 1);
    //console.log('showalert = 1');
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            sslnote.showPreloader(languageSpecificObject.languageSpecifications[
                0]['loading']);
            $$.get(localStorage.getItem('connection') +
                '/appie/php/' + localStorage.getItem(
                    'sslnoteapp') + '/CAppReportTraffic.php?', {
                    uid: localStorage.getItem('UID'),
                    server: localStorage.getItem('server')
                }, function(data) {
                    console.log(data);
                    var listHTML = data;
                    $$('.menulist').html(listHTML);
                    //console.log('INSERT DATA');
                    sslnote.hidePreloader();
                });
        });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('Slinkpids', function() {
    //console.log('page.name Slinkpids');
    sessionStorage.setItem('showalert', 1);
    //console.log('showalert = 1');
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            sslnote.showPreloader(languageSpecificObject.languageSpecifications[
                0]['loading']);
            $$.get(localStorage.getItem('connection') +
                '/appie/php/' + localStorage.getItem(
                    'sslnoteapp') + '/Clinkpids.php?', {
                    my_pid: localStorage.getItem('my_pid'),
                    uid: localStorage.getItem('UID'),
                    server: localStorage.getItem('server')
                }, function(data) {
                    console.log(data);
                    var listHTML = data;
                    $$('.menulist').html(listHTML);
                    //console.log('INSERT DATA');
                    sslnote.hidePreloader();
                });
        });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('SblockList', function() {
    //console.log('page.name SblockList');
    sessionStorage.setItem('showalert', 1);
    //console.log('showalert = 1');
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            sslnote.showPreloader(languageSpecificObject.languageSpecifications[
                0]['loading']);
            $$.get(localStorage.getItem('connection') +
                '/appie/php/' + localStorage.getItem(
                    'sslnoteapp') + '/CblockList.php?', {
                    // my_pid: localStorage.getItem('UID'),
                    uid: localStorage.getItem('UID'),
                    server: localStorage.getItem('server')
                }, function(data) {
                    console.log(data);
                    var listHTML = data;
                    $$('.menulist').html(listHTML);
                    //console.log('INSERT DATA');
                    sslnote.hidePreloader();
                });
        });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('SpidList', function() {
    //console.log('page.name SpidList');
    sessionStorage.setItem('showalert', 1);
    //console.log('showalert = 1');
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            sslnote.showPreloader(languageSpecificObject.languageSpecifications[
                0]['loading']);
            $$.get(localStorage.getItem('connection') +
                '/appie/php/' + localStorage.getItem(
                    'sslnoteapp') + '/CpidList.php?', {
                    my_pid: localStorage.getItem('my_pid'),
                    uid: localStorage.getItem('UID'),
                    server: localStorage.getItem('server')
                }, function(data) {
                    console.log(data);
                    var listHTML = data;
                    $$('.menulist').html(listHTML);
                    //console.log('INSERT DATA');
                    sslnote.hidePreloader();
                });
        });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('SmakeAccount', function() {
    //console.log('page.name SmakeAccount');
    //console.log('*** INIT SmakeAccount')
    sessionStorage.setItem('showalert', 1);
    //console.log('showalert = 1');
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            sslnote.showPreloader(languageSpecificObject.languageSpecifications[
                0]['createUID']);
            var postData = {
                server: localStorage.getItem('server'),
                sslnoteapp: localStorage.getItem('sslnoteapp')
            }
            console.log(postData);
            $$.ajax({
                method: 'POST',
                dataType: 'json',
                url: localStorage.getItem('connection') +
                    '/appie/php/CmakeAccount.php?',
                crossDomain: true,
                data: postData,
                success: function(responseData) {
                    //console.log('ECHO DATA');
                    console.log(responseData);
                    sslnote.formFromJSON('#makeAccount',
                        responseData);
                    //console.log('show stored data' + responseData);
                    sslnote.hidePreloader();
                },
                error: function(responseData, textStatus,
                    errorThrown) {
                    //console.log('something went wrong!! Error: '+textStatus);
                    sslnote.hidePreloader();
                    sslnote.alert(
                        'Error. please try again.',
                        function() {
                            PushErrorToSupport(
                                errorThrown);
                        });
                },
            });
        });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('Smessages-send', function(e) {
    //console.log('page.name Smessages-send');
    localStorage.setItem('showalert', 0);
    //console.log('showalert = 0');
    //console.log('------------------------------');
    //console.log('INIT MESSAGES-SEND');
    //console.log('1------------------------------');
    document.activeElement.blur();
    //console.log('!! STOP LOOP');
    clearTimeout(loop);
    //sslnote.hideToolbar('.tabbar');
    sslnote.showIndicator();

                    var conversationStarted = false;

                
                //sslnote.scrollMessagesContainer();
                var myMessages = sslnote.messages('.messages', {
                    autoLayout: true
                });


    var mid = e.query.mid;
    var his_uid = e.query.his_uid;
    var his_nick = e.query.his_nick;
    var his_server = e.query.his_server;
    var totalmessages = e.query.totalmessages;
    ////console.log('*** totalmessages = ' +totalmessages); 
    var uid = localStorage.getItem('UID');
    sessionStorage.setItem('his_uid', his_uid);
    sessionStorage.setItem('his_nick', his_nick);
    sessionStorage.setItem('his_server', his_server);
    sessionStorage.setItem('mid', mid);




 $$('.camera').on('click', function() {
        console.log('camera Pressed');

var prepair ='<div class="message message-sent message-pic"><img src="img/loader.png" alt="Busy" height="15" width="15">INSERT PHOTO PLEASE WAIT...';

var old =  '<img src="img/loader.png" alt="Busy" height="15" width="15">INSERT PHOTO PLEASE WAIT...';


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


var theimage = '<div class="message message-sent message-pic message-last"><img src="data:image/jpeg;base64,' +base64Img + '"></div>';


$$('#theimage').html(theimage);

var theimagestore = '<div class="message message-pic"><img src="data:image/jpeg;base64,' +base64Img + '"></div>';

                sessionStorage.setItem('imageURL',theimagestore);


                console.log('-- THE IMAGE onSuccess DONE');


        // var messageType = 'sent';

        // var avatar, name;

        // var messageText = '<img src="data:image/jpeg;base64,' +base64Img + '"></div>';

        // var theimagestore = '<div class="message message-pic"><img src="data:image/jpeg;base64,' +base64Img + '"></div>';

        // sessionStorage.setItem('imageURL',theimagestore);

        //   myMessages.addMessage({
        //     // Message text
        //     text: messageText,
        //     // Random message type
        //     type: messageType,
        //     // Avatar and name:
        //     avatar: avatar,
        //     name: name,
        //     // Day
        //     day: !conversationStarted ? 'Today' : false,
        //     time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
        //   })
         
        //   // Update conversation flag
        //   conversationStarted = true;



var myMessages = $$('.messages')[0].f7Messages;
 
// Now you can use it
//myMessages.layout();

//console.log(JSON.stringify(myMessages));

setTimeout(function() {
myMessages.scrollMessages();
 }, 100);

            }

            function onFail(message) {
                sslnote.alert('Failed because: ' +message);
            }
        }, 10);
    });

    // var mdatum = page.query.mdatum;
    // var mid = '';
    //console.log('--------------------');
    //console.log('his_uid = '+his_uid);
    //console.log('his_nick = '+his_nick);
    //console.log('his_server = '+his_server);
    //console.log('--------------------');
    // //console.log('--------------------');
    // //console.log('his_uid = '+sessionStorage.getItem('his_uid'));
    // //console.log('his_nick = '+sessionStorage.getItem('his_nick'));
    // //console.log('his_server = '+sessionStorage.getItem('his_server'));
    // //console.log('--------------------');
    // sessionStorage.setItem('his_uid', his_uid);
    // sessionStorage.setItem('his_nick', his_nick);
    // sessionStorage.setItem('his_server', his_server);
    // sessionStorage.setItem('mdatum', mdatum);
    // ster funtion askkey
    // if (totalmessages === '1') {
    //console.log('check localstorage key exist make sessionkey');
    // sslnote.showIndicator();
    if (localStorage.getItem(sessionStorage.getItem('his_uid') +
        'encryptkey')) {
        sessionStorage.setItem(sessionStorage.getItem('his_uid') +
            'encryptkey', localStorage.getItem(sessionStorage.getItem(
                'his_uid') + 'encryptkey'));
        //console.log('sessionkey maked from localstorage');
    }


    app.selectAllRecords = function(fn) {
            app.db.transaction(function(tx) {
                if (sessionStorage.getItem('mid') !=
                    'undefined') {
                    //console.log('Select 1 from mid = ' +sessionStorage.getItem('mid'));
                    tx.executeSql(selectMIDByMid, [
                        sessionStorage.getItem('mid')
                    ], fn, app.onError);
                } else {
                    //console.log('Select 1 available message. for his_uid = '+ sessionStorage.getItem('his_uid'));
                    tx.executeSql(selectMID, [localStorage.getItem(
                        'UID'), sessionStorage.getItem(
                        'his_uid')], fn, app.onError);
                }
            });
        }
        // function getAllTheData() {
    var render = function(tx, rs) {
        // rs contains our SQLite recordset, at this point you can do anything with it
        // in this case we'll just loop through it and output the results to the console
        for (var i = 0; i < rs.rows.length; i++) {
            var data = rs.rows.item(i);
            var mid = data.mid;
            var message = data.message;
            //var mdatum = data.mdatum;
            var setkey = sessionStorage.getItem(his_uid +
                'encryptkey');
            sslnote.showIndicator();
            sessionStorage.setItem('mid', mid);
            sessionStorage.setItem('his_uid', his_uid);
            sessionStorage.setItem('his_nick', his_nick);
            //console.log('----------------------------------------------------------------------------------------------------');
            //console.log('show stored data');
            //console.log(data);
            //console.log('mid = '+sessionStorage.getItem('mid'));
            //console.log('setkey = '+setkey);
            ////console.log('message = '+message);
            //console.log('his_uid = '+sessionStorage.getItem('his_uid'));
            //console.log('his_server = '+sessionStorage.getItem('his_server'));
            //console.log('----------------------------------------------------------------------------------------------------');
            var message_old = "";
            var message = message.replace(/ /g, '+');
            ////console.log('message = ' +message);    
            try {
                var message_old = sjcl.decrypt(setkey, message);
                ////console.log('INTERNAL DECRYPT= ' +message_old);
                if (message_old == '') {
                    // promt reenter key
                    sslnote.modal({
                        title: 'Crypting',
                        text: 'Oops, a Error. maybe key wrong?',
                        buttons: [{
                            text: 'RESET KEY',
                            onClick: function() {
                                sessionStorage.removeItem(
                                    sessionStorage
                                    .getItem(
                                        'his_uid'
                                    ) +
                                    'encryptkey',
                                    '');
                                sessionStorage.removeItem(
                                    'mid');
                                //console.log('SESSION KILL :');
                                sslnote.alert(
                                    'KEY resetted!'
                                );
                                mainView.router
                                    .back({
                                        url: 'frames/messages/Scontactlist.html',
                                        force: true
                                    });
                            }
                        }, {
                            text: 'WIPE',
                            onClick: function() {
                                showBusy();
                                //console.log('C CLICK AUTODELETE ');
                                var mid =
                                    sessionStorage
                                    .getItem(
                                        'mid');
                                //console.log('Deleted ' + mid);
                                //console.log('start wipe mess');
                                var lastTime =
                                    0;
                                if (
                                    sessionStorage
                                    .getItem(
                                        'mid')) {
                                    app.db.transaction(
                                        function(
                                            tx
                                        ) {
                                            //console.log('removeMessagesToReceive = ' +sessionStorage.getItem('mid'));
                                            tx
                                                .executeSql(
                                                    removeMessagesToReceive, [
                                                        sessionStorage
                                                        .getItem(
                                                            'mid'
                                                        )
                                                    ],
                                                    onRemovedSuccess,
                                                    onError
                                                );
                                            var
                                                now =
                                                new Date()
                                                .getTime();
                                            if (
                                                now -
                                                lastTime >
                                                1000
                                            ) {
                                                $$
                                                    .getJSON(
                                                        "i18n/" +
                                                        localStorage
                                                        .getItem(
                                                            'cLANGUAGE'
                                                        ) +
                                                        "/strings.json",
                                                        function(
                                                            languageSpecificObject
                                                        ) {
                                                            var
                                                                themessage =
                                                                languageSpecificObject
                                                                .languageSpecifications[
                                                                    0
                                                                ]
                                                                [
                                                                    'messageswiped'
                                                                ]; // TRANSLATE
                                                            $$
                                                                .ajax({
                                                                    method: 'POST',
                                                                    dataType: 'jsonp',
                                                                    url: localStorage
                                                                        .getItem(
                                                                            'pushserver'
                                                                        ),
                                                                    crossDomain: true,
                                                                    data: {
                                                                        my_uid: localStorage
                                                                            .getItem(
                                                                                'UID'
                                                                            ),
                                                                        his_uid: sessionStorage
                                                                            .getItem(
                                                                                'his_uid'
                                                                            ),
                                                                        themessage: themessage
                                                                    },
                                                                    success: function(
                                                                        responseData,
                                                                        textStatus,
                                                                        jqXHR
                                                                    ) {
                                                                        //console.log('PUSH MESSAGE WIPE SEND..');
                                                                        sessionStorage
                                                                            .removeItem(
                                                                                'mid'
                                                                            );
                                                                        //console.log('+++ sessionStorage.removeItem mid');
                                                                    }
                                                                });
                                                        }
                                                    );
                                            }
                                            lastTime
                                                =
                                                now;
                                            SQLiteUpdateMessagesTotal
                                                ();
                                        });
                                }
                                mainView.router
                                    .back({
                                        url: 'frames/messages/Scontactlist.html',
                                        force: true
                                    });
                            }
                        }, {
                            text: 'HOME',
                            onClick: function() {
                                mainView.router
                                    .back({
                                        url: 'frames/messages/Scontactlist.html',
                                        force: true
                                    });
                                //sslnote.alert('You clicked second button!')
                            }
                        }, ]
                    })
                }
                // sslnote.showIndicator();
                //console.log('**********************************************');
                //console.log('*************** MESSAGE OLD BEFORE *******************');
                //console.log(message_old);
                //console.log('**********************************************');
                var hesaid = new RegExp(sessionStorage.getItem(
                    'his_uid'), 'g');
                message_old = message_old.replace(hesaid, 'he said');
                var isaid = new RegExp(localStorage.getItem('UID'),
                    'g');
                message_old = message_old.replace(isaid, 'i said');
                var sslnotetemp = new RegExp('message-send', 'g');
                message_old = message_old.replace(sslnotetemp,
                    'sslnotetemp');
                // message-received > message-sent
                var receivedtemp = new RegExp('message-received',
                    'g');
                message_old = message_old.replace(receivedtemp,
                    'message-send');
                // sslnotetemp > message-received
                var sendtemp = new RegExp('sslnotetemp', 'g');
                message_old = message_old.replace(sendtemp,
                    'message-received');
                //console.log('**********************************************');
                //console.log('*************** MESSAGE OLD AFTER *******************');
                //console.log(message_old);
                //console.log('**********************************************');
                sessionStorage.setItem('message_old', message_old);
                // var mid = sessionStorage.getItem('mid');
                // var his_uid = sessionStorage.getItem('is_uid');
                // var his_nick = sessionStorage.getItem('his_nick');
                // var his_server = sessionStorage.getItem('his_server');
                // var mdatum = page.query.mdatum;
                // var message_old = sessionStorage.getItem('message_old');
                $$('.hisnickinfonavbar').html('');
                $$('.hisuidlastseen').html('');
                //var mid = sessionStorage.getItem('mid');
                //var thekey = sessionStorage.getItem(sessionStorage.getItem('his_uid') + 'encryptkey');
                //var key2 = thekey.toLowerCase();   
                //console.log('VARS ------------------------------');
                //console.log('mid =' +mid);
                //console.log('--------------------')
                //console.log('his_uid = '+sessionStorage.getItem('his_uid'))
                //console.log('his_nick = '+sessionStorage.getItem('his_nick'))
                //console.log('his_server session = '+sessionStorage.getItem('his_server'))
                //console.log('his_server var = '+his_server)
                //console.log('--------------------')
                //console.log('2------------------------------');
                //////////////////////////////////////////////////////////////////////////////////////////////////////////
                // setTimeout(function(){
                if (localStorage.getItem('cLANGUAGE') == 'en') {
                    var listHTML2 = '<BR>MESSAGE TO :' +
                        sessionStorage.getItem('his_nick') + ' (' +
                        sessionStorage.getItem('his_uid') + ')';
                }
                if (localStorage.getItem('cLANGUAGE') == 'nl') {
                    var listHTML2 = '<BR>BERICHT AAN :' +
                        sessionStorage.getItem('his_nick') + ' (' +
                        sessionStorage.getItem('his_uid') + ')';
                }
                if (localStorage.getItem('cLANGUAGE') == 'ru') {
                    var listHTML2 = '<BR>СООБЩЕНИЕ :' +
                        sessionStorage.getItem('his_nick') + ' (' +
                        sessionStorage.getItem('his_uid') + ')';
                }
                if (localStorage.getItem('cLANGUAGE') == 'es') {
                    var listHTML2 = '<BR>MENSAJE A :' +
                        sessionStorage.getItem('his_nick') + ' (' +
                        sessionStorage.getItem('his_uid') + ')';
                }
                if (localStorage.getItem('cLANGUAGE') == 'du') {
                    var listHTML2 = '<BR>NACHRICHT AN :' +
                        sessionStorage.getItem('his_nick') + ' (' +
                        sessionStorage.getItem('his_uid') + ')';
                }
                if (localStorage.getItem('cLANGUAGE') == 'ch') {
                    var listHTML2 = '<BR>消息 :' + sessionStorage.getItem(
                        'his_nick') + ' (' + sessionStorage.getItem(
                        'his_uid') + ')';
                }
                if (localStorage.getItem('cLANGUAGE') == 'fr') {
                    var listHTML2 = '<BR>MESSAGE AUX :' +
                        sessionStorage.getItem('his_nick') + ' (' +
                        sessionStorage.getItem('his_uid') + ')';
                }
                //console.log('3------------------------------');
                //$$(page.container).find('.messagessendto').html(listHTML2);
                //console.log('4------------------------------');
                app.db.transaction(function(tx) {
                    //console.log('updateMessageToRead = ' +mid);
                    tx.executeSql(updateMessageToRead, ['1',mid], onUpdateSuccess, onError);
                    tx.executeSql(updateBadgeTo, [],onUpdateSuccess, onError);
                });
                //console.log('5------------------------------');
                // //console.log('var message_old' + sessionStorage.getItem('message_old'));
                // var listHTML = message_old ;
                $$('.messageoldsend').html(sessionStorage.getItem('message_old'));



                ////console.log('myMessages = '+myMessages);  
                sslnote.hideIndicator();
                sslnote.hidePreloader();

var myMessages = $$('.messages')[0].f7Messages;
 
// Now you can use it
//myMessages.layout();



//console.log(JSON.stringify(myMessages));

setTimeout(function() {
myMessages.scrollMessages();
 }, 100);



                if (!localStorage.dotourfirstmessagedecrypt) {
                    var dotourHTML = '<li>' +
                        '<div class="item-title center">Great you Decrypt the message!.<BR>' +
                        'Now you can reply on this message or use.<BR>' +
                        '<i class="ion-ios-people-outline dotour"></i> Back to contactlist.<BR>' +
                        '<i class="ion-ios-camera-outline dotour"></i> Make and insert a foto.<BR>' +
                        '<i class="ion-key dotour"></i> Reset the KEY.<BR>' +
                        '<i class="ion-ios-compose-outline dotour"></i> Make a new message.<BR>' +
                        '<i class="ion-ios-trash-outline dotour"></i> Wipe this message.<BR>' +
                        '</div>' + '</li>';
                    $$('.dotour').html(dotourHTML);
                    localStorage.dotourfirstmessagedecrypt = 'Done';
                    localStorage.dotourfirstmessagesend =
                        'showaddcontact';
                } else {
                    var dotourHTML = '<li>' +
                        '<div class="item-title center">Your message is Decrypted.' +
                        '</div>' + '</li>';
                    $$('.dotour').html(dotourHTML);
                }
                //////////////////////////////////////////////////////////////////////////////////////////////////////////
                // start leeg bericht
                // push message read
                var uid = localStorage.getItem('UID');
                $$.getJSON("i18n/" + localStorage.getItem(
                        'cLANGUAGE') + "/strings.json",
                    function(languageSpecificObject) {
                        var themessage = languageSpecificObject
                            .languageSpecifications[0][
                                'messagesread'
                            ]; // TRANSLATE
                        $$.ajax({
                            method: 'POST',
                            dataType: 'jsonp',
                            url: localStorage.getItem('pushserver'),
                            crossDomain: true,
                            data: {
                                my_uid: localStorage.getItem('UID'),
                                his_uid: sessionStorage.getItem('his_uid'),
                                themessage: themessage
                            },
                            success: function(responseData,textStatus, jqXHR) {
                                //console.log('A PUSH MESSAGE READ SEND..');
                            }
                        });
                    });




                var lastTime = 0;

            
                $$('.Aautodelete').on('click', function() {
                    if (sessionStorage.getItem('mid')) {
                        showBusy();
                        //console.log('A CLICK AUTODELETE ');
                        var mid = sessionStorage.getItem(
                            'mid');
                        //console.log('Deleted ' + mid);
                        //console.log('start wipe mess');
                        app.db.transaction(function(tx) {
                            //console.log('removeMessagesToReceive = ' +mid);
                            tx.executeSql(
                                removeMessagesToReceive, [
                                    mid
                                ],
                                onRemovedSuccess,
                                onError);
                            var now = new Date().getTime();
                            if (now - lastTime >
                                1500) {
                                $$.getJSON("i18n/" +
                                    localStorage
                                    .getItem(
                                        'cLANGUAGE'
                                    ) +
                                    "/strings.json",
                                    function(
                                        languageSpecificObject
                                    ) {
                                        var
                                            themessage =
                                            languageSpecificObject
                                            .languageSpecifications[
                                                0
                                            ][
                                                'messageswiped'
                                            ]; // TRANSLATE
                                        $$.ajax({
                                            method: 'POST',
                                            dataType: 'jsonp',
                                            url: localStorage.getItem('pushserver'
                                                ),
                                            crossDomain: true,
                                            data: {
                                                my_uid: uid,
                                                his_uid: his_uid,
                                                themessage: themessage
                                            },
                                            success: function(responseData,textStatus,jqXHR
                                            ) {
                                                //console.log('PUSH MESSAGE WIPE SEND..');
                                                sessionStorage.removeItem('mid');
                                                //console.log('+++ sessionStorage.removeItem mid');
                                            }
                                        });
                                    });
                            }
                            lastTime = now;
                            mainView.router.load({
                                url: 'frames/messages/Scontactlist.html',
                                reload: true
                            });
                            SQLiteUpdateMessagesTotal();
                        });
                    }
                });



                $$('.newmessage').on('click', function() {
                    console.log('CLICK newmessage2');
                    sessionStorage.removeItem('mid');
                    mainView.router.load({
                        url: 'frames/messages/Smessages-send-new.html?his_uid=' +
                            sessionStorage.getItem(
                                'his_uid') +
                            '&his_nick=' +
                            sessionStorage.getItem(
                                'his_nick') +
                            '&his_server=' +
                            sessionStorage.getItem(
                                'his_server') +
                            '&totalmessages=0',
                        reload: true
                    });
                });
                $$('.changekey').on('click', function() {
                    sslnote.confirm('RESET KEY?', function() {
                        sessionStorage.removeItem(
                            sessionStorage.getItem(
                                'his_uid') +
                            'encryptkey', '');
                        sessionStorage.removeItem(
                            'mid');
                        //console.log('SESSION KILL :');
                        sslnote.alert(
                            'KEY resetted!');
                        mainView.router.back({
                            url: 'frames/messages/Scontactlist.html',
                            force: true
                        });
                    }, function() {
                        sslnote.alert(
                            'You clicked Cancel button'
                        );
                    });
                });
                $$('.messagebar .link').on('click', function() {
                    //console.log('Send button clicked');
                    // var message_new = $$(page.container).find('textarea[name="message"]').val();
                    var message_new = $$('textarea#receive').val();
                    // var message_new = '';
                    //console.log('message_new = ' +message_new);
                    if (message_new.length === 0) {
                        document.activeElement.blur();
                        sslnote.alert('Messages cannot be empty!');
                    } else {
                        if (localStorage.getItem(sessionStorage.getItem('his_uid') +'encryptkey')) {
                            sessionStorage.setItem(sessionStorage.getItem('his_uid') +'encryptkey',
                                localStorage.getItem(sessionStorage.getItem('his_uid') +'encryptkey'));
                            //console.log('sessionkey maked');
                        }
                        if (sessionStorage.getItem(sessionStorage.getItem('his_uid') +'encryptkey')) {
                            cryptingStart();
                            var thekey = sessionStorage.getItem(sessionStorage.getItem('his_uid') +'encryptkey');
                            document.activeElement.blur();
                            var mid = sessionStorage.getItem(sessionStorage.getItem('his_uid') + 'mid');
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////                                               
                            //console.log('-------------------------------------------------' );  
                            //console.log('***** START EncryptMessage 1 *****');
                            //EncryptMessage3(); // version 3.0 server crypt gedaan in SContactlist init
                            //console.log(mid,thekey,his_uid,his_server,message_new,messages_old);
                            //console.log('-------------------------------------------------' ); 
                            // console.log(message_new);
                            // console.log(sessionStorage.getItem('message_old'));
                            //EncryptMessage3(); // version 3.0 server crypt gedaan in SContactlist init
                            //  //console.log('-------------------------------------------------' );           
                            // progressBar(100, $('#progressBar'));
                            //  //console.log('-------------------------------------------------' ); 
                            insertMessageSQLite(
                                sessionStorage.getItem('mid'), thekey,
                                sessionStorage.getItem('his_uid'),
                                sessionStorage.getItem('his_server'),
                                message_new,sessionStorage.getItem('message_old'));
                            //console.log('***** END EncryptMessage *****');
                            //////////////////////////////////////////////////////////////////////////////////////////////////////////
                            // app.db.transaction(function(tx) {
                            // //console.log('removeMessagesToReceive = ' +mid);
                            //       tx.executeSql(removeMessagesToReceive, [mid],onRemovedSuccess,onError);
                            //        tx.executeSql(updateBadgeTo, [],onUpdateSuccess,onError);
                            //     });
                            // //console.log('-------------------------------------------------' );           
                            // progressBar(100, $('#progressBar'));
                            //  //console.log('-------------------------------------------------' ); 
                            //                 //sslnote.hidePreloader();
                            //                 mainView.router.back({url:'frames/messages/Scontactlist.html',force:true});                                   
                        } // end session exist
                        //             } // end else
                    } // end if messages == empty
                }); // end page.container 
            } catch (err) {
                sslnote.hidePreloader();
                // promt reenter key
                sslnote.modal({
                        title: 'Crypting',
                        text: 'Oops, a Error. maybe key wrong?',
                        buttons: [{
                            text: 'RESET KEY',
                            onClick: function() {
                                sessionStorage.removeItem(sessionStorage.getItem('his_uid') +'encryptkey','');
                                sessionStorage.removeItem('mid');
                                //console.log('SESSION KILL :');
                                sslnote.alert('KEY resetted!');
                                mainView.router.back({
                                    url: 'frames/messages/Scontactlist.html',
                                    force: true
                                });
                            }
                        }, {
                            text: 'WIPE',
                            onClick: function() {
                                showBusy();
                                //console.log('D CLICK AUTODELETE ');
                                var mid =sessionStorage.getItem('mid');
                                //console.log('Deleted ' + mid);
                                //console.log('start wipe mess');
                                if (sessionStorage.getItem('mid')) {
                                    app.db.transaction(
                                        function(tx) {
                                            //console.log('removeMessagesToReceive = ' +sessionStorage.getItem('mid'));
                                            tx.executeSql(removeMessagesToReceive, [sessionStorage.getItem('mid')],onRemovedSuccess,onError);
                                            $$.getJSON("i18n/" +localStorage.getItem('cLANGUAGE') +"/strings.json",
                                                function(languageSpecificObject) {
                                                    varthemessage =languageSpecificObject.languageSpecifications[0]['messageswiped']; // TRANSLATE
                                                    $$
                                                        .ajax({
                                                            method: 'POST',
                                                            dataType: 'jsonp',
                                                            url: localStorage
                                                                .getItem(
                                                                    'pushserver'
                                                                ),
                                                            crossDomain: true,
                                                            data: {
                                                                my_uid: localStorage
                                                                    .getItem(
                                                                        'UID'
                                                                    ),
                                                                his_uid: sessionStorage
                                                                    .getItem(
                                                                        'his_uid'
                                                                    ),
                                                                themessage: themessage
                                                            },
                                                            success: function(
                                                                responseData,
                                                                textStatus,
                                                                jqXHR
                                                            ) {
                                                                //console.log('PUSH MESSAGE WIPE SEND..');
                                                                sessionStorage
                                                                    .removeItem(
                                                                        'mid'
                                                                    );
                                                                //console.log('+++ sessionStorage.removeItem mid');
                                                            }
                                                        });
                                                }
                                            );
                                            SQLiteUpdateMessagesTotal
                                                ();
                                        });
                                }
                                mainView.router.back({
                                    url: 'frames/messages/Scontactlist.html',
                                    force: true
                                });
                            }
                        }, {
                            text: 'HOME',
                            onClick: function() {
                                mainView.router.back({
                                    url: 'frames/messages/Scontactlist.html',
                                    force: true
                                });
                                //sslnote.alert('You clicked second button!')
                            }
                        }, ]
                    })
                    // sslnote.alert("Failure in toString(CryptoJS.enc.Utf8): " + err.message);
                    //console.log("Failure in toString(CryptoJS.enc.Utf8): " + err.message);
            }
            return decrypted;
        }
    }
    if (sessionStorage.getItem(sessionStorage.getItem('his_uid') +'encryptkey')) {
        // sessionStorage.login = Number(sessionStorage.clickcount) ;
        // send data message and key session
        //console.log('KEY SET ' + sessionStorage.getItem(sessionStorage.getItem('his_uid') + 'encryptkey'));
        app.selectAllRecords(render);
        // },1000);
    } else // ask key
    {
        //////////////////////////////////////////////////////////////////////////
        // key bestaat niet do POPUP ask key save session forward $messages-read.html
        //sslnote.hideIndicator();
        document.activeElement.blur();
        //console.log('MONDAL DECRYPT MESSAGE');
        //clearInterval(loopcheck);
        localStorage.setItem('showalert', 0);
        //console.log('showalert = 0');
        // if (!localStorage.dotourfirstmessagedecrypt) {
        var dotourHTML = '<li>' +
            '<div class="item-title center">Your message to Decrypt.<BR>Fill in the KEY you agreed with this contact.<BR>' +
            '</div>' + '</li>';
        $$('.dotour').html(dotourHTML);
        // }
        $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
            "/strings.json", function(languageSpecificObject) {
                // sslnote.showPreloader(languageSpecificObject.languageSpecifications[0]['deleting']);
                sslnote.prompt(languageSpecificObject.languageSpecifications[
                        0]['yourkeyfor'] + '<BR>' +
                    sessionStorage.getItem('his_uid') + ' (' +
                    sessionStorage.getItem('his_nick') + ')',
                    languageSpecificObject.languageSpecifications[
                        0]['decryptmessage'], function(value) {
                        var newkey = value;
                        var setkey = newkey.toLowerCase();
                        var setkey = calcMD5(setkey);
                        sessionStorage.setItem(sessionStorage.getItem('his_uid') + 'encryptkey',setkey);
                        //console.log('YOUR KEY is "' + setkey + '". Ok button');
                        sslnote.showIndicator();
                        app.selectAllRecords(render);
                    }, function(value) {
                        // action CANCEL
                        //console.log('Cancel button');
                        mainView.router.back({
                            url: 'frames/messages/Scontactlist.html',
                            force: true
                        });
                    }); // end prompt
            });
    } // end else
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('Smessages-send-new', function(e) {
    //console.log('page.name Smessages-send-new');
    clearTimeout(loop);
    //toast.show(false);
    sslnote.hideIndicator();
    //sslnote.hideToolbar('.tabbar');
    localStorage.setItem('showalert', 0);
    // if (!localStorage.dotourfirstmessage) {
    var dotourHTML = '<li>' +
        '<div class="item-title center">Write your message when done press <i class="ion-android-send dotour"></i> icon.' +
        '</div>' + '</li>';
    $$('.dotour').html(dotourHTML);
    // }
    //console.log('showalert = 0');
    //console.log('------------------------------');
    //console.log('INIT MESSAGES-SEND-NEW');
    //console.log('1------------------------------');
    document.activeElement.blur();

var conversationStarted = false;



    var myMessages = sslnote.messages('.messages', {
        autoLayout: true
    });

    // myMessages.layout();


    var mid = e.query.mid;
    var his_uid = e.query.his_uid;
    var his_nick = e.query.his_nick;
    var his_server = e.query.his_server;
    var rotatehisnicklastseen = '<span class="wodry">' + his_nick +
        '| ' + localStorage.getItem('lastseentxt') + '| ' +
        localStorage.getItem(his_uid + 'active_last') + '</span>';
    $$('.rotate-hisnick-lastseen').html(rotatehisnicklastseen);
    $('.wodry').wodry({
        animation: 'rotateX',
        delay: 1000,
        animationDuration: 1200
    });
    sslnote.hideIndicator();
    //console.log('2-----------------------------');
    if (localStorage.getItem('cLANGUAGE') == 'en') {
        var listHTML2 = '<BR>MESSAGE TO :' + sessionStorage.getItem(
                'his_nick') + ' (' + sessionStorage.getItem('his_uid') +
            ')';
    }
    if (localStorage.getItem('cLANGUAGE') == 'nl') {
        var listHTML2 = '<BR>BERICHT AAN :' + sessionStorage.getItem(
                'his_nick') + ' (' + sessionStorage.getItem('his_uid') +
            ')';
    }
    if (localStorage.getItem('cLANGUAGE') == 'ru') {
        var listHTML2 = '<BR>СООБЩЕНИЕ :' + sessionStorage.getItem(
                'his_nick') + ' (' + sessionStorage.getItem('his_uid') +
            ')';
    }
    if (localStorage.getItem('cLANGUAGE') == 'es') {
        var listHTML2 = '<BR>MENSAJE A :' + sessionStorage.getItem(
                'his_nick') + ' (' + sessionStorage.getItem('his_uid') +
            ')';
    }
    if (localStorage.getItem('cLANGUAGE') == 'du') {
        var listHTML2 = '<BR>NACHRICHT AN :' + sessionStorage.getItem(
                'his_nick') + ' (' + sessionStorage.getItem('his_uid') +
            ')';
    }
    if (localStorage.getItem('cLANGUAGE') == 'ch') {
        var listHTML2 = '<BR>消息 :' + sessionStorage.getItem('his_nick') +
            ' (' + sessionStorage.getItem('his_uid') + ')';
    }
    if (localStorage.getItem('cLANGUAGE') == 'fr') {
        var listHTML2 = '<BR>MESSAGE AUX :' + sessionStorage.getItem(
                'his_nick') + ' (' + sessionStorage.getItem('his_uid') +
            ')';
    }
    //console.log('3------------------------------');            
    //    $$(page.container).find('.messagessendto').html(listHTML2);
    //console.log('4------------------------------');
    //sslnote.scrollMessagesContainer();
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // start leeg bericht





    
$$('.camera').on('click', function() {
        console.log('camera Pressed');

var prepair ='<div class="message message-sent message-pic theimage"><img src="img/loader.png" alt="Busy" height="15" width="15">INSERT PHOTO PLEASE WAIT...';

var old =  '<img src="img/loader.png" alt="Busy" height="15" width="15">INSERT PHOTO PLEASE WAIT...';


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


var theimage = '<div class="message message-sent message-pic message-last"><img src="data:image/jpeg;base64,' +base64Img + '"></div>';


                $$('#theimage').html(theimage);

var theimagestore = '<div class="message message-pic"><img src="data:image/jpeg;base64,' +base64Img + '"></div>';

                sessionStorage.setItem('imageURL',theimagestore);


                console.log('-- THE IMAGE onSuccess DONE');


        // var messageType = 'sent';

        // var avatar, name;

        // var messageText = '<img src="data:image/jpeg;base64,' +base64Img + '"></div>';

        // var theimagestore = '<div class="message message-pic"><img src="data:image/jpeg;base64,' +base64Img + '"></div>';

        // sessionStorage.setItem('imageURL',theimagestore);

        //   myMessages.addMessage({
        //     // Message text
        //     text: messageText,
        //     // Random message type
        //     type: messageType,
        //     // Avatar and name:
        //     avatar: avatar,
        //     name: name,
        //     // Day
        //     day: !conversationStarted ? 'Today' : false,
        //     time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
        //   })
         
        //   // Update conversation flag
        //   conversationStarted = true;




var myMessages = $$('.messages')[0].f7Messages;
 
// Now you can use it
//myMessages.layout();

myMessages.scrollMessages();

            }

            function onFail(message) {
                sslnote.alert('Failed because: ' +message);
            }
        }, 10);
    });


    $$('.messagebar .link').on('click', function() {
        //console.log('Send button clicked');
        // var message_new = $$(page.container).find('textarea[name="message"]').val();
        var message_new = $$('textarea#receive').val();
        // var message_new = '';
        //console.log('message_new = ' +message_new);



        if (message_new.length === 0) {
            document.activeElement.blur();
            sslnote.alert('Messages cannot be empty!');
        } 


        else 

{


            var messages_old = '';









            //console.log('messages_old : ' +messages_old); 
            //console.log('message_new : ' +message_new); 
            if (localStorage.getItem(sessionStorage.getItem(
                'his_uid') + 'encryptkey')) {
                sessionStorage.setItem(sessionStorage.getItem(
                        'his_uid') + 'encryptkey',
                    localStorage.getItem(sessionStorage.getItem(
                        'his_uid') + 'encryptkey'));
                //console.log('sessionkey maked');
            }
            if (sessionStorage.getItem(sessionStorage.getItem(
                'his_uid') + 'encryptkey')) {
                cryptingStart();
                var thekey = sessionStorage.getItem(
                    sessionStorage.getItem('his_uid') +
                    'encryptkey');
                document.activeElement.blur();
                // sslnote.showPreloader('Encrypting message</br>one moment please...');
                //  sslnote.modal({
                //   title:  'EnCrypting one moment...',
                //   text: '<div class=\'icon-only progressicon refreshing\'><i class=\'icon ion-ios-reload\'></i>\t<div id=\'progressBar\' class=\'tiny-green\'>\t<div>\t</div>\t</div>\t</div>',
                // });
                // sslnote.addNotification({
                //                 // title: 'SSLNote',
                //                 custom: '<div class=\'icon-only progressicon refreshing\'><i class=\'icon ion-ios-reload\'></i>\t<div id=\'progressBar\' class=\'tiny-green\'>\t<div>\t</div>\t</div>\t</div>'
                //                 // hold: 10000
                //             });
                //////////////////////////////////////////////////////////////////////////////////////////////////////////                                               
                //console.log('-------------------------------------------------' );  
                //console.log('***** START EncryptMessage 3 *****');
                //EncryptMessage3(); // version 3.0 server crypt gedaan in SContactlist init
                // console.log(mid,thekey,his_uid,his_server,message_new,messages_old);
                //  //console.log('-------------------------------------------------' ); 
                var message_old = '';

                insertMessageSQLite(sessionStorage.getItem(
                        'mid'), thekey, sessionStorage.getItem(
                        'his_uid'), sessionStorage.getItem(
                        'his_server'), message_new,
                    message_old);

                //insertMessageSQLite(mid,thekey,his_uid,his_server,message_new,messages_old);
                //console.log('***** END EncryptMessage *****');
                //////////////////////////////////////////////////////////////////////////////////////////////////////////
                // sslnote.hidePreloader();
                // //console.log('-------------------------------------------------' );           
                // progressBar(100, $('#progressBar'));
                //  //console.log('-------------------------------------------------' ); 
                //                 mainView.router.back({url:'frames/messages/Scontactlist.html',force:true});                                   
            } // end session exist
            else {
                //console.log('KEY BESTAAT NIET');
                document.activeElement.blur();
                if (!localStorage.dotourfirstmessage) {
                    var dotourHTML = '<li>' +
                        '<div class="item-title center">Now fill in the KEY to Encrypt the message.<BR>' +
                        'This is the KEY you agreed with this contact.<BR>' +
                        'If this is TEST UID choose your own KEY.' +
                        '</div>' + '</li>';
                } else {
                    var dotourHTML = '<li>' +
                        '<div class="item-title center">Now fill in the KEY to Encrypt the message.<BR>' +
                        'This is the KEY you agreed with this contact.' +
                        '</div>' + '</li>';
                }
                $$('.dotour').html(dotourHTML);
                $$.getJSON("i18n/" + localStorage.getItem(
                        'cLANGUAGE') + "/strings.json",
                    function(languageSpecificObject) {
                        sslnote.prompt(
                            languageSpecificObject.languageSpecifications[
                                0]['yourkeyfor'] +
                            '<BR>' + sessionStorage.getItem(
                                'his_uid') + ' (' +
                            sessionStorage.getItem(
                                'his_nick') + ')',
                            languageSpecificObject.languageSpecifications[
                                0]['encryptmessage'],
                            function(value) {
                                cryptingStart();
                                var newkey = value;
                                var thekey = newkey.toLowerCase();
                                var thekey = calcMD5(thekey);
                                sessionStorage.setItem(
                                    sessionStorage.getItem('his_uid') +'encryptkey',thekey);
                                sslnote.showIndicator();
                                ////console.log('YOUR KEY is "' + thekey + '". Ok button');
                                //    sslnote.showPreloader('Encrypting message</br>one moment please...');
                                // sslnote.modal({
                                //     // title:  'EnCrypting one moment...',
                                //     custom: '<div class=\'icon-only progressicon refreshing\'><i class=\'icon ion-ios-reload\'></i>\t<div id=\'progressBar\' class=\'tiny-green\'>\t<div>\t</div>\t</div>\t</div>'
                                //     ,closeIcon:false
                                //   });
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////                                               
                                //console.log('-------------------------------------------------' );  
                                //console.log('***** START EncryptMessage 4 *****');
                                //EncryptMessage3(); // version 3.0 server crypt gedaan in SContactlist init
                                // console.log(mid,thekey,his_uid,his_server,message_new,messages_old);
                                //  //console.log('-------------------------------------------------' ); 
                                //  //console.log('-------------------------------------------------' );           
                                // progressBar(50, $('#progressBar'));
                                //  //console.log('-------------------------------------------------' ); 
                                var message_old = '';
                                insertMessageSQLite(
                                    sessionStorage.getItem('mid'),
                                    thekey,
                                    sessionStorage.getItem('his_uid'),
                                    sessionStorage.getItem('his_server'
                                    ), message_new,message_old);
                                //(mid,thekey,his_uid,his_server,message_new,messages_old);
                                //console.log('***** END EncryptMessage *****');
                                // //////////////////////////////////////////////////////////////////////////////////////////////////////////
                                //  //console.log('-------------------------------------------------' );           
                                // progressBar(100, $('#progressBar'));
                                //  //console.log('-------------------------------------------------' ); 
                                //                                // sslnote.hidePreloader();
                                //                                 mainView.router.back({url:'frames/messages/Scontactlist.html',force:true});     
                                if (!localStorage.dotourfirstmessage) {
                                    //console.log('SET dotourfirstmessagesend = showsend');
                                    // var testUID = 'D3UE52U1MD';
                                    // localStorage.setItem('testUID',testUID);
                                    sessionStorage.removeItem(sessionStorage.getItem('his_uid') +'encryptkey');
                                    localStorage.dotourfirstmessagesend ='showsend';
                                    localStorage.dotourfirstmessage ='Done';
                                }
                            }, function(value) {
                                // action CANCEL
                                ////console.log('YOUR KEY is ' +value +' Cancel button');
                                //sslnote.alert('SEND CANCELED');
                                // forwart on class $contactlist

                   
                                mainView.router.back({
                                    url: 'frames/messages/SContactlist.html',
                                    reload: true
                                });
               

                                //mainView.router.back({url:'frames/messages/Scontactlist.html',force:true});     
                            }); // end promt
                    });
            } // end else
        } // end if messages == empty
    }); // end page.container 
}); // end page.name


//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setupintro', function() {
    console.log('setupintro init');
    mainView.hideNavbar();
    sslnote.hideToolbar('.tabbar');
    sslnote.showTab('#mainView');

    localStorage.setItem('showalert', 0);

    document.activeElement.blur();


    // // activate button
    $$('.create-new-uid').on('click', function() {
        sslnote.hideIndicator();
        //console.log('LOADING frames/setup/setup-setpass.html');
        mainView.loadPage('frames/setup/setup-setpass.html');
        sslnote.hidePreloader();
    }); // end activate button


    $$('.ihaveaaccount').on('click', function() {
        sslnote.hideIndicator();
        sslnote.hidePreloader();
        //console.log('+++ ihaveaaccount +++');
        mainView.loadPage('frames/setup/Lite.html');
    });


    $$('.ialreadyacivate').on('click', function() {
        sslnote.hideIndicator();
        sslnote.hidePreloader();
        //console.log('+++ ialreadyacivate +++');
        sslnote.closeModal();
        mainView.router.load({
            url: 'frames/login.html',
            animatePages: false
        });
    });


    $$('.ihavelicensekey').on('click', function() {
        sslnote.hideIndicator();
        sslnote.hidePreloader();
        //console.log('+++ ihavelicencekey +++');
        $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
            "/strings.json", function(
                languageSpecificObject) {
                //languageSpecificObject.languageSpecifications[0]['crypting'],  



                sslnote.prompt(languageSpecificObject.languageSpecifications[
                        0]['whatisyourlicensekey'],
                    function(value) {
                        // check licence key https://sslnote.com/appie/php/include/JsonInsertUIDLinks.php?sslnoteapp='
                        sslnote.showIndicator();
                        var templic = '7PH3E4ENB7';
                        $$.getJSON(
                            "https://sslnote.com/appie/php/include/JsonLicenseKey.php?licensekey=" +
                            templic, function(
                                response) {
                                console.log(
                                    response);
                                //sslnote.alert('response = ' + response['id'] );
                                //sslnote.alert('response = ' + response[0]['id'] );
                                //sslnote.alert('response = ' + response);
                                if (response) {
                                    // sslnote.alert('response = ' + response['id'] );
                                    // do settings
                                    sslnote.hideIndicator();
                                    sslnote.modal({
                                        title: 'SSLNOTE',
                                        text: 'We found a ' +
                                            response[
                                                'sslnoteapp'
                                            ] +
                                            ' license',
                                        buttons: [{
                                            text: languageSpecificObject
                                                .languageSpecifications[
                                                    0
                                                ]
                                                [
                                                    'cancel'
                                                ],
                                            onClick: function() {
                                                // sslnote.closeModal();
                                            }
                                        }, {
                                            text: localStorage
                                                .getItem(
                                                    'oke'
                                                ),
                                            onClick: function() {
                                                var
                                                    accounts =
                                                    response[
                                                        'accounts'
                                                    ];
                                                localStorage
                                                    .setItem(
                                                        'totalaccounts',
                                                        accounts
                                                    );
                                                var
                                                    server =
                                                    response[
                                                        'server'
                                                    ];
                                                localStorage
                                                    .setItem(
                                                        'server',
                                                        server
                                                    );
                                                var
                                                    sslnoteapp =
                                                    response[
                                                        'sslnoteapp'
                                                    ];
                                                localStorage
                                                    .setItem(
                                                        'sslnoteapp',
                                                        sslnoteapp
                                                    );
                                                mainView
                                                    .router
                                                    .load({
                                                        url: 'frames/setup/' +
                                                            localStorage
                                                            .getItem(
                                                                'sslnoteapp'
                                                            ) +
                                                            '.html'
                                                    });
                                                //window.location.reload();
                                            }
                                        }, ]
                                    });
                                } else {
                                    sslnote.hideIndicator();
                                    sslnote.alert(
                                        languageSpecificObject
                                        .languageSpecifications[
                                            0][
                                            'licensedontexist'
                                        ]);
                                }
                            });
                    });
            });
    }); // end activate button
}); // end page.name


//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
// sslnote.onPageInit('firstsetup', function() {
//     mainView.hideNavbar();
//     sslnote.hideToolbar('.tabbar');
//     sslnote.showTab('#mainView');


//     // set the basis settings


//     // localStorage.setItem('f7form-settings-pushnotification',
//     //     '{"pushreceived":["on"],"pushread":["on"],"pushwipe":["on"]}'
//     // );
//     // localStorage.setItem('f7form-settingsscreenprotect',
//     //     '{"screenprotect":"3"}');
//     // localStorage.setItem('f7form-settings-keyboardclick',
//     //     '{"keyboardclick":["on"]}');
//     // localStorage.setItem('f7form-settingslogoff', '{"autologoff":"3"}');
//     // localStorage.setItem('f7form-settings-shake',
//     //     '{"shakeon":"on","shakesensitivity":"20"}');
//     // localStorage.setItem('f7form-settings-notification',
//     //     '{"uid":"","sound":"1.m4a","volume":"50"}');
//     // localStorage.setItem('f7form-settings-containers',
//     //     '{"my-container":["RUSSIA","PANAMA","CHINA","EU"]}');

// // * TODO SOUND SHAKE notification container repeatsound




//     // sslnote.formStoreData('cLANGUAGE ', {"cLANGUAGE":["nl"]
//     //  }); // TODO
//     //console.log('page.name firstsetup');
//     localStorage.setItem('showalert', 0);
//     //console.log('showalert = 0');
//     //console.log('Lite INIT');
//     document.activeElement.blur();
//     // disable counter
//     // contactsview.router.load({url:'frames/login.html' , animatePages:false});
//     // $('.countdown_dashboard').data('countdown').update({diff: '-1'});
//     //console.log('sslnoteapp : ' + localStorage.getItem('sslnoteapp'));
//     //console.log('check token');
//     if (!localStorage.getItem('token')) {
//         localStorage.setItem('token', 'NO-TOKEN');
//     }


//     $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
//         "/strings.json", function(languageSpecificObject) {
//             // languageSpecificObject.languageSpecifications[0]['passwordcannotbeempty']
//             sslnote.showPreloader(languageSpecificObject.languageSpecifications[
//                 0]['nosettingsfound']);
//             //console.log('Generate UID');
//         });


//     $$.ajax({
//         method: 'POST',
//         dataType: 'jsonp',
//         url: localStorage.getItem('connection') +
//             '/appie/php/Csslnoteapp.php?callback=?',
//         crossDomain: true,
//         data: {
//             sslnoteapp: localStorage.getItem('sslnoteapp'),
//             token: localStorage.getItem('token')
//         },
//         success: function(responseData, textStatus, jqXHR) {
//             //console.log('LITE responseData');
//             console.log(responseData);
//             // var jsonObject = new Function('return ' +responseData)();
//             // sslnote.alert(jsonObject.id);//     does nothing
//             // set sessionStorage.login
//             // console.log(jsonObject.id);
//             // console.log(jsonObject.uid);
//             // localStorage.setItem('UID', jsonObject.uid);
//             // //console.log('ECHO MSG : ' + jsonObject.msg);
//             localStorage.removeItem('repeatsound');
//             // sessionStorage.setItem('reactivatecode',jsonObject.reactivatecode);
//             // localStorage.setItem('account_id', jsonObject.account_id);
//             // //sessionStorage.setItem('account_id', jsonObject.account_id);
//             // localStorage.setItem('sound', jsonObject.sound);
//             // localStorage.setItem('volume', jsonObject.volume);
//             // localStorage.setItem('server', jsonObject.server);
//             // UPDATE PID SHOW
//             // //console.log('UPDATE CREATE PID');
//             // $$(page.container).find('.yourpid').html(localStorage.getItem('UID'));
//             var a = JSON.parse(responseData);
//             //console.log('responseData firstsetup');
//             //console.log('uid='+a.uid);
//             localStorage.setItem('UID', a.uid);
//             //console.log('sslnoteapp='+a.sslnoteapp);
//             //console.log('account_id='+a.account_id);
//             //localStorage.setItem('account_id',a.account_id);
//             var account_id = 'off';
//             //console.log('-- manual account_id='+account_id);
//             //console.log('active='+a.active);
//             //console.log('pass_reset='+a.pass_reset);
//             //console.log('my_nick='+a.my_nick);
//             //console.log('settpass='+a.settpass);
//             //console.log('uloginsid='+a.logins);
//             //console.log('reactivatecode='+a.reactivatecode);
//             sessionStorage.setItem('reactivatecode', a.reactivatecode);
//             //console.log('token='+a.token);
//             //console.log('sound='+a.sound);
//             localStorage.setItem('sound', a.sound);
//             //console.log('volume='+a.volume);
//             localStorage.setItem('volume', a.volume);
//             //console.log('repeatpush='+a.repeatpush);
//             localStorage.setItem('repeatpush', a.repeatpush);
//             //console.log('device='+a.device);
//             //console.log('maxlink='+a.maxlink);
//             //console.log('language='+a.language);
//             //console.log('server='+a.server);
//             localStorage.setItem('server', a.server);
//             //console.log('ECHO MSG A : ' + a.msg);
//             sslnote.hideIndicator();
//             sslnote.hidePreloader();



//             app.db.transaction(function(tx) {
//                 //console.log('app.JSON to SQLite');     
//                 tx.executeSql(
//                     'DROP TABLE IF EXISTS uid');
//                 tx.executeSql(createUID, [],
//                     onCreateSuccess, onError);
//                 tx.executeSql(
//                     'DROP TABLE IF EXISTS uid_links'
//                 );
//                 tx.executeSql(createUIDLinks, [],
//                     onCreateSuccess, onError);
//                 tx.executeSql(
//                     'DROP TABLE IF EXISTS uid_messages_send'
//                 );
//                 tx.executeSql(createUIDMessagesSend, [],
//                     onCreateSuccess, onError);
//                 tx.executeSql(
//                     'DROP TABLE IF EXISTS uid_messages_receive'
//                 ); //console.log('TABLE uid_messages_receive DROP');    
//                 tx.executeSql(
//                     createUIDMessagesReceive, [],
//                     onCreateSuccess, onError);
//                 tx.executeSql(insertUID, [a.uid, a.sslnoteapp,
//                     account_id, a.active, a
//                     .pass_reset, a.my_nick,
//                     a.settpass, a.logins, a
//                     .reactivatecode, a.sound,
//                     a.volume, a.repeatpush,
//                     a.device, a.maxlink, a.language,
//                     a.server
//                 ], onInsertSuccess, onError);
//             });
//             //console.log('UPDATE CREATE PID  = ' + localStorage.getItem('UID'));
//             $$('.yourpid').html(localStorage.getItem('UID'));
//         },
//         error: function(responseData, textStatus, errorThrown) {
//             console.log("something went wrong!! Error: " +textStatus);
//             sslnote.hidePreloader();
//             sslnote.alert('Error. please try again.',
//                 function() {PushErrorToSupport(errorThrown);});
//         }
//     });


//     // // activate button
//     $$('.activate').on('click', function() {
//         sslnote.hideIndicator();
//         //console.log('LOADING frames/setup/setup-setpass.html');
//         mainView.loadPage('frames/setup/setup-setpass.html');
//         sslnote.hidePreloader();
//     }); // end activate button


//         $$('.setup-close').on('click', function() {
//         sslnote.hideIndicator();
//         sslnote.hidePreloader();
//         //console.log('+++ ihaveaaccount +++');
//         mainView.loadPage('frames/setup/setupintor.html');
//     });



//     // $$('.ihaveaaccount').on('click', function() {
//     //     sslnote.hideIndicator();
//     //     sslnote.hidePreloader();
//     //     //console.log('+++ ihaveaaccount +++');
//     //     mainView.loadPage('frames/setup/Lite.html');
//     // });
//     // $$('.ialreadyacivate').on('click', function() {
//     //     sslnote.hideIndicator();
//     //     sslnote.hidePreloader();
//     //     //console.log('+++ ialreadyacivate +++');
//     //     sslnote.closeModal();
//     //     contactsview.router.load({
//     //         url: 'frames/login.html',
//     //         animatePages: false
//     //     });
//     // });
//     // $$('.ihavelicensekey').on('click', function() {
//     //     sslnote.hideIndicator();
//     //     sslnote.hidePreloader();
//     //     //console.log('+++ ihavelicencekey +++');
//     //     $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
//     //         "/strings.json", function(
//     //             languageSpecificObject) {
//     //             //languageSpecificObject.languageSpecifications[0]['crypting'],            
//     //             sslnote.prompt(languageSpecificObject.languageSpecifications[
//     //                     0]['whatisyourlicensekey'],
//     //                 function(value) {
//     //                     // check licence key https://sslnote.com/appie/php/include/JsonInsertUIDLinks.php?sslnoteapp='
//     //                     sslnote.showIndicator();
//     //                     var templic = '7PH3E4ENB7';
//     //                     $$.getJSON(
//     //                         "https://sslnote.com/appie/php/include/JsonLicenseKey.php?licensekey=" +
//     //                         templic, function(
//     //                             response) {
//     //                             console.log(
//     //                                 response);
//     //                             //sslnote.alert('response = ' + response['id'] );
//     //                             //sslnote.alert('response = ' + response[0]['id'] );
//     //                             //sslnote.alert('response = ' + response);
//     //                             if (response) {
//     //                                 // sslnote.alert('response = ' + response['id'] );
//     //                                 // do settings
//     //                                 sslnote.hideIndicator();
//     //                                 sslnote.modal({
//     //                                     title: 'SSLNOTE',
//     //                                     text: 'We found a ' +
//     //                                         response[
//     //                                             'sslnoteapp'
//     //                                         ] +
//     //                                         ' license',
//     //                                     buttons: [{
//     //                                         text: languageSpecificObject
//     //                                             .languageSpecifications[
//     //                                                 0
//     //                                             ]
//     //                                             [
//     //                                                 'cancel'
//     //                                             ],
//     //                                         onClick: function() {
//     //                                             // sslnote.closeModal();
//     //                                         }
//     //                                     }, {
//     //                                         text: localStorage
//     //                                             .getItem(
//     //                                                 'oke'
//     //                                             ),
//     //                                         onClick: function() {
//     //                                             var
//     //                                                 accounts =
//     //                                                 response[
//     //                                                     'accounts'
//     //                                                 ];
//     //                                             localStorage
//     //                                                 .setItem(
//     //                                                     'totalaccounts',
//     //                                                     accounts
//     //                                                 );
//     //                                             var
//     //                                                 server =
//     //                                                 response[
//     //                                                     'server'
//     //                                                 ];
//     //                                             localStorage
//     //                                                 .setItem(
//     //                                                     'server',
//     //                                                     server
//     //                                                 );
//     //                                             var
//     //                                                 sslnoteapp =
//     //                                                 response[
//     //                                                     'sslnoteapp'
//     //                                                 ];
//     //                                             localStorage
//     //                                                 .setItem(
//     //                                                     'sslnoteapp',
//     //                                                     sslnoteapp
//     //                                                 );
//     //                                             mainView
//     //                                                 .router
//     //                                                 .load({
//     //                                                     url: 'frames/setup/' +
//     //                                                         localStorage
//     //                                                         .getItem(
//     //                                                             'sslnoteapp'
//     //                                                         ) +
//     //                                                         '.html'
//     //                                                 });
//     //                                             //window.location.reload();
//     //                                         }
//     //                                     }, ]
//     //                                 });
//     //                             } else {
//     //                                 sslnote.hideIndicator();
//     //                                 sslnote.alert(
//     //                                     languageSpecificObject
//     //                                     .languageSpecifications[
//     //                                         0][
//     //                                         'licensedontexist'
//     //                                     ]);
//     //                             }
//     //                         });
//     //                 });
//     //         });
//     // }); // end activate button
// }); // end page.name
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//***********
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('settings-notification', function() {
    //console.log('Page = settings-notification');
    //console.log('PAGE INIT settings-notification DATA :');
    //console.log('SESSION his_uid :');
    //sslnote.showPreloader('Collecting data...');
    sslnote.formFromJSON('#settings-notification', localStorage.getItem(
        'f7form-settings-notification'));
    var storedDataVolume = sslnote.formGetData('settings-notification');
    var notificationsVolume = storedDataVolume.volume;
    $$('#showValue').text(notificationsVolume);
    $$('input[type="range"]').on('input change', function() {
        // console.log(this.value);
        $$('#showValue').text(this.value);
    })
    var uid = localStorage.getItem('UID');
    // sslnote.formFromJSON('#settings-notification', {
    //     uid: localStorage.getItem('UID'),
    //     sound: localStorage.getItem('sound'),
    //     volume: localStorage.getItem('volume'),
    //     repeatpush: localStorage.getItem('repeatpush')
    // });
    $$('.form-to-json').on('click', function() {
        // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
        // sslnote.showPreloader(localStorage.getItem('updating'));
        //console.log('settings-notificationUPDATE');
        var formData = sslnote.formToJSON(
            '#settings-notification');
        // sslnote.alert(JSON.stringify(formData));
        console.log(formData);
        // send data to server
        $$.ajax({
            method: 'POST',
            dataType: 'jsonp',
            url: localStorage.getItem('connection') +
                '/appie/php/' + localStorage.getItem(
                    'sslnoteapp') +
                '/CnotificationUpdate.php?',
            crossDomain: true,
            data: formData,
            success: function(responseData, textStatus,
                errorThrown) {
                //console.log('ECHO DATA');
                console.log(responseData);
                // sslnote.hidePreloader();
                mainView.router.back({
                    url: 'frames/settings/index.html',
                    force: true
                });
            },
            error: function(responseData, textStatus,
                errorThrown) {
                //console.log('something went wrong!! Error: ' +textStatus);
                sslnote.hidePreloader();
                sslnote.alert(
                    'Error. please try again.',
                    function() {
                        //PushErrorToSupport(errorThrown);
                    });
            }
        }); //end ajax
        //});
    }); //end pidupdate
});
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('Scontactmessagelist', function(e) {
    //console.log('page.name Scontactmessagelist');
    var busycontactmessagelistHTML =
        '<li><div class="item-title center">Click to reply - swipe RtL wipe</div></li>';
    $$('.busycontactmessagelist').html(busycontactmessagelistHTML);
    //console.log('!! STOP LOOP');
    clearTimeout(loop);
    document.activeElement.blur();
    var his_uid = e.query.his_uid;
    var his_nick = e.query.his_nick;
    var his_server = e.query.his_server;
    var mid = e.query.mid;
    var totalmessages = e.query.totalmessages;
    ////console.log('*** totalmessages = ' +totalmessages); 
    var uid = localStorage.getItem('UID');
    sessionStorage.setItem('his_uid', his_uid);
    sessionStorage.setItem('his_nick', his_nick);
    sessionStorage.setItem('his_server', his_server);
    sessionStorage.setItem('mid', mid);
    localStorage.setItem('showalert', 0);
    //console.log('showalert = 0');
    //showBusy();
    makeContactMessageslist(his_uid, his_nick);
    sslnote.hideIndicator();
    //hideBusy();
    // var uid = localStorage.getItem('UID' );
    //       var his_uid = sessionStorage.getItem('his_uid');
    //       var his_nick = sessionStorage.getItem('his_nick');
    //       var his_server = sessionStorage.getItem('his_server');
    //makeContactMessageslist(his_uid,his_nick);  
    $$('.newmessage').on('click', function() {
        console.log('CLICK newmessage');
        //sslnote.showIndicator();
        sessionStorage.removeItem('mid');
        mainView.router.load({
            url: 'frames/messages/Smessages-send-new.html?his_uid=' +
                sessionStorage.getItem('his_uid') +
                '&his_nick=' + sessionStorage.getItem(
                    'his_nick') + '&his_server=' +
                sessionStorage.getItem('his_server') +
                '&totalmessages=0',
            reload: true
        });
    });
    var lastTime = 0;
    $$(document).on('click', '.autodelete', function() {
        if (sessionStorage.getItem('mid')) {
            showBusy();
            //console.log('B CLICK AUTODELETE ');
            var mid = sessionStorage.getItem('mid');
            //console.log('Deleted ' + mid);
            //console.log('start wipe mess Scontactmessagelist');
            app.db.transaction(function(tx) {
                //console.log('removeMessagesToReceive = ' +sessionStorage.getItem('mid'));
                tx.executeSql(removeMessagesToReceive, [
                    mid
                ], onRemovedSuccess, onError);
                //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                var now = new Date().getTime();
                if (now - lastTime > 1500) {
                    var themessage = localStorage.getItem(
                        'messageswiped'); // TRANSLATE
                    $$.ajax({
                        method: 'POST',
                        dataType: 'jsonp',
                        url: localStorage.getItem(
                            'pushserver'),
                        crossDomain: true,
                        data: {
                            my_uid: localStorage
                                .getItem('UID'),
                            his_uid: his_uid,
                            themessage: themessage
                        },
                        success: function(
                            responseData,
                            textStatus,
                            jqXHR) {
                            //console.log('PUSH MESSAGE WIPE SEND..Scontactmessagelist');
                            sessionStorage.removeItem(
                                'mid');
                            //console.log('+++ sessionStorage.removeItem mid');
                        }
                    });
                    //});
                }
                lastTime = now;
                SQLiteUpdateMessagesTotal();
            });
            hideBusy();
        }
    });
}); // end page
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('AppReportTraffic', function() {
    // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
    sslnote.showPreloader(localStorage.getItem('collectingdata'));
    //var my_pid = localStorage.getItem('my_pid');
    //console.log('COLLECT SETTINGS');
    $$.ajax({
        method: 'POST',
        dataType: 'json',
        url: localStorage.getItem('connection') + '/appie/php/' +
            localStorage.getItem('sslnoteapp') +
            '/CAppReportTraffic.php?',
        crossDomain: true,
        data: {
            my_pid: my_pid
        },
        success: function(data) {
            //console.log('ECHO DATA');
            console.log(data);
            //console.log('show stored data');
            sslnote.hidePreloader();
        }
    });
    //});
});
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('Sserver', function() {
    var server = localStorage.getItem('server');
    console.log(server);
    sslnote.formFromJSON('#server', {
        server: server
    });
    $$('.form-to-json').on('click', function() {
        //ask are y sure to change
        sslnote.modal({
            title: 'Are you sure?',
            text: 'If you change the Premium Private Server is pasable you cannot send or receive messages.',
            buttons: [{
                text: 'CANCEL',
                onClick: function() {
                    //sslnote.alert('You clicked first button!')
                }
            }, {
                text: 'It\'s OKE',
                onClick: function() {
                    var formData = sslnote.formToJSON(
                        '#server');
                    console.log(formData.server);
                    localStorage.setItem(
                        'server',
                        formData.server
                    );
                }
            }, ]
        });
    });
});
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('settings', function() {
    //console.log('page.name settings');
    //console.log('!! STOP LOOP');
    clearTimeout(loop);
    var uid = localStorage.getItem('UID');
    app.selectAllRecords = function(fn) {
            app.db.transaction(function(tx) {
                //console.log('------ selectUID settings');
                tx.executeSql(selectUID, [uid], fn, app.onError);
            });
        }
        // function getAllTheData() {
    var render = function(tx, rs) {
        for (var i = 0; i < rs.rows.length; i++) {
            var data = rs.rows.item(i);
            //console.log(data);
            //localStorage.setItem('account_id','on');
            if (data.account_id === 'off') {
                //console.log('No Admin Panel');
                //localStorage.setItem('account_id','off');
                $$('.admin').hide();
            }
            if (data.sslnoteapp != 'Premium') {
                //console.log('No PremiumServer Panel');
                $$('.premium').hide();
            }
            sslnote.formFromJSON('#settings', data);
            //console.log('+++ show stored data');
            //console.log(data);
            var server = localStorage.getItem('server');
            console.log(server);
            $$('.server').html(server);
        }
    }
    app.selectAllRecords(render);

        var qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 120,
        height: 120,
        correctLevel: QRCode.CorrectLevel.H
    });

    function makeCode() {
        qrcode.makeCode(localStorage.getItem('UID'));
    }
    makeCode();

SQLiteUpdateMessagesTotal();
}); // end page.name
//*************************************************************************************************************
//////////////////////////////////////////////////////////////////
sslnote.onPageAfterAnimation('settings', function(page) {
    //////////////////////////////////////////////////////////////////////
    //console.log('!!! onPageAfterAnimation settings');
    var cLANGUAGEdata = sslnote.formGetData('cLANGUAGE');
    if (cLANGUAGEdata) {
        //console.log(JSON.stringify(cLANGUAGEdata));
        var cLANGUAGE = cLANGUAGEdata.cLANGUAGE;
        //console.log('++++++ = '+ cLANGUAGE);
        localStorage.setItem('cLANGUAGE', cLANGUAGE);
    }
    // SYNC
    // f7form-settings-pushnotification={"pushreceived":["on"],"pushread":["on"],"pushwipe":["on"]}
    // f7form-settingsscreenprotect={"screenprotect":"999"}
    // f7form-settings-keyboardclick={"keyboardclick":["on"]}
    // f7form-cLANGUAGE={"cLANGUAGE":"nl"}
    // f7form-settingslogoff={"autologoff":"5"}
    // f7form-settings-notification={"uid":"QXEV4QHKXW","sound":"0.m4a","volume":"23.4","repeatpush":["on"]}
    //console.log('------------ SYNC START----------------');
    var storedData1 = sslnote.formGetData('settings-pushnotification');
    var storedData2 = sslnote.formGetData('settingsscreenprotect');
    var storedData3 = sslnote.formGetData('settings-keyboardclick');
    var storedData4 = sslnote.formGetData('cLANGUAGE');
    var storedData5 = sslnote.formGetData('settingslogoff');
    var storedData6 = sslnote.formGetData('settings-notification');
    var storedData7 = sslnote.formGetData('settings-containers');
    var storedData8 = sslnote.formGetData('settings-shake');
    //console.log('!settings-pushnotification = ' );
    console.log(storedData1);
    //console.log('!settingsscreenprotect = ' );
    console.log(storedData2);
    //console.log('!settings-keyboardclick = ');
    console.log(storedData3);
    //console.log('!cLANGUAGE = ' );
    console.log(storedData4);
    //console.log('!settingslogoff = ' );
    console.log(storedData5);
    //console.log('!settings-notification = ' );
    console.log(storedData6);
    //console.log('!settings-containers = ' );
    console.log(storedData7);
    //console.log('!settings-shake = ' );
    console.log(storedData8);
    var Syncpushreceived = '';
    var Syncpushread = '';
    var Syncpushwip = '';
    var Syncscreenprotect = '';
    var Synckeyboardclick = '';
    var SynccLANGUAGE = '';
    var Syncautologoff = '';
    var Syncsound = '';
    var Syncvolume = '';
    var Syncrepeatpush = '';
    var Syncshake = '';
    //console.log('------------ SYNC START a----------------');
    if (storedData1) {
        var Syncpushreceived = storedData1.pushreceived;
        var Syncpushread = storedData1.pushread;
        var Syncpushwipe = storedData1.pushwipe;
    }
    //console.log('------------ SYNC START b----------------');
    if (storedData2) {
        var Syncscreenprotect = storedData2.screenprotect;
    }
    //console.log('------------ SYNC START c----------------');
    if (storedData3) {
        var Synckeyboardclick = storedData3.keyboardclick;
    }
    //console.log('------------ SYNC START d----------------');
    if (storedData4) {
        var SynccLANGUAGE = storedData4.cLANGUAGE;
    }
    //console.log('------------ SYNC START e----------------');
    if (storedData5) {
        var Syncautologoff = storedData5.autologoff;
    }
    //console.log('------------ SYNC START f----------------');
    if (storedData6) {
        var Syncsound = storedData6.sound;
        var Syncvolume = storedData6.volume;
        var Syncrepeatpush = storedData6.repeatpush;
    }
    //console.log('------------ SYNC START g----------------'); 
    if (storedData8) {
        var Syncshakeon = storedData8.shakeon;
        var Syncshakesensitivity = storedData8.shakesensitivity;
    }
    //console.log('------------ SYNC START g----------------'); 
    var Synctoken = localStorage.getItem('token');
    var SyncApp = localStorage.getItem('App');
    //console.log('------------ AJAX START----------------');
    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: localStorage.getItem('connection') +
            '/appie/php/include/JsonSync.php?callback=?',
        crossDomain: true,
        data: {
            uid: localStorage.getItem('UID'),
            pushreceived: Syncpushreceived,
            pushread: Syncpushread,
            pushwipe: Syncpushwipe,
            screenprotect: Syncscreenprotect,
            keyboardclick: Synckeyboardclick,
            cLANGUAGE: SynccLANGUAGE,
            autologoff: Syncautologoff,
            sound: Syncsound,
            volume: Syncvolume,
            repeatpush: Syncrepeatpush,
            token: Synctoken,
            App: SyncApp
        },
        success: function(responseData, textStatus, jqXHR) {
            //console.log('............................................');
            console.log('+++ SYNC responseData = ' +
                responseData);
            //console.log('............................................');
        },
        error: function(responseData, textStatus, jqXHR) {
            //console.log('............................................');
            console.log('+++ SYNC error = ' + responseData);
            PushErrorToSupport(responseData);
            //console.log('............................................');
        }
    });
    //console.log('------------ SYNC FINISH ----------------');



});
//*************************************************************************************************************        
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('settingslogoff', function() {
    $$('.force-refresh').on('click', function() {
        //console.log('click force-refresh');
        document.location.reload();
        mainView.loadPage(
            'frames/settings/mysettings/settingsLogoff.html'
        );
    });
});
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('firstsetuplite', function() {
    console.log('page.name firstsetuplite :');
    

    localStorage.setItem('showalert', 0);



    $$('.exitsetup').on('click', function() {
        console.log('+++ exitsetup 405');
        //mainView.loadPage('index.html');
        sslnote.hideIndicator();
        // sslnote.closeModal('.popup-getting-started');
        sessionStorage.removeItem('counter');
            

                    mainView.router.load({
                        url: 'frames/login.html',
                        reload: true
                    });

        onsole.log('+++ exitsetup DONE');
    });


    // check login
    $$('form-to-json').on('click', function() {
        var formData = sslnote.formToJSON('#litesetup');
        //sslnote.alert(JSON.stringify(formData));
        //sslnote.showIndicator();
        //console.log('firstsetuplite formData =' +formData);
        console.log(formData);
        //console.log('firstsetuplite uid : ' + formData['uid'] );
        //console.log('firstsetuplite activationcode : ' + formData['activationcode']);
        var uid = formData['uid'];
        localStorage.setItem('UID', uid);
        var activationcode = formData['activationcode'];
        var error_uid = '0';
        var error_activationcode = '0';
        // function checkdata(){
        //console.log('checkdata');
        if (uid === undefined || uid === null || uid === '') {
            sslnote.alert('UID cannot be empty.');
            error_uid = '1';
            //return;
            // oke close preloader
        }
        if (activationcode === undefined || activationcode ===
            null || activationcode === '') {
            sslnote.alert('CODE cannot be empty.');
            error_activationcode = '1';
            //return;
        }
        // }
        if (error_uid === '0' && error_activationcode === '0') {
            //console.log('preloader');
            $$.getJSON("i18n/" + localStorage.getItem(
                    'cLANGUAGE') + "/strings.json",
                function(languageSpecificObject) {
                    sslnote.showPreloader(
                        languageSpecificObject.languageSpecifications[
                            0]['checking']);
                });
            //console.log('form-to-json');
            document.activeElement.blur();
            if (localStorage.getItem('token')) {
                $$.ajax({
                    method: 'POST',
                    dataType: 'jsonp',
                    url: localStorage.getItem(
                            'connection') +
                        '/appie/php/include/updatetoken.php?l?callback=?',
                    crossDomain: true,
                    data: {
                        token: localStorage.getItem(
                            'token'),
                        uid: localStorage.getItem('UID')
                    },
                    success: function(responseData,
                        textStatus, jqXHR) {
                        //console.log('TOKEN : ' +localStorage.getItem('token'));
                        //console.log('TOKEN : ' +responseData);
                    }
                });
            } // end if token
            //console.log('+++ DO Csetup.php');
            $$.ajax({
                method: 'POST',
                dataType: 'jsonp',
                url: localStorage.getItem('connection') +
                    '/appie/php/' + localStorage.getItem(
                        'sslnoteapp') +
                    '/Csetup.php?sslnoteapp=' +
                    localStorage.getItem('sslnoteapp') +
                    'callback=?',
                crossDomain: true,
                data: formData,
                success: function(responseData,
                    textStatus, jqXHR) {
                    //console.log('+++ LOGIN OKE responseData');
                    console.log(responseData);
                    //console.log('+++ LOGIN OKE end');
                    // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                    //     sslnote.showPreloader(languageSpecificObject.languageSpecifications[0]['preparing']);
                    // });
                    var jsonObject = (new Function(
                        'return ' +
                        responseData))();
                    if (jsonObject.prove === '1') {
                        // set sessionStorage.login
                        // console.log(jsonObject.id);
                        // sessionStorage.setItem('my_pid',jsonObject.id);
                        // localStorage.setItem('server',jsonObject.server);
                        // localStorage.setItem('sound',jsonObject.server);
                        // localStorage.setItem('volume',jsonObject.server);
                        // localStorage.setItem('repeatpush',jsonObject.server);
                        var a = JSON.parse(
                            responseData);
                        //console.log('responseData A');
                        //console.log('uid='+a.uid);
                        localStorage.setItem('UID',
                            a.uid);
                        //console.log('sslnoteapp='+a.sslnoteapp);
                        //console.log('account_id='+a.account_id);
                        var account_id = 'off';
                        //console.log('-- manual account_id='+account_id);
                        //localStorage.setItem('account_id',a.account_id);
                        //console.log('active='+a.active);
                        //console.log('pass_reset='+a.pass_reset);
                        //console.log('my_nick='+a.my_nick);
                        //console.log('settpass='+a.settpass);
                        //console.log('uloginsid='+a.logins);
                        //console.log('reactivatecode='+a.reactivatecode);
                        sessionStorage.setItem(
                            'reactivatecode', a
                            .reactivatecode);
                        //console.log('token='+a.token);
                        //console.log('sound='+a.sound);
                        localStorage.setItem(
                            'sound', a.sound);
                        //console.log('volume='+a.volume);
                        localStorage.setItem(
                            'volume', a.volume);
                        //console.log('repeatpush='+a.repeatpush);
                        localStorage.setItem(
                            'repeatpush', a.repeatpush
                        );
                        //console.log('device='+a.device);
                        //console.log('maxlink='+a.maxlink);
                        //console.log('language='+a.language);
                        //console.log('server='+a.server);
                        localStorage.setItem(
                            'server', a.server);
                        app.db.transaction(function(
                            tx) {
                            //console.log('app.JSON to SQLite');     
                            tx.executeSql(
                                'DROP TABLE IF EXISTS uid'
                            );
                            tx.executeSql(
                                createUID, [],
                                onCreateSuccess,
                                onError
                            );
                            tx.executeSql(
                                'DROP TABLE IF EXISTS uid_links'
                            );
                            tx.executeSql(
                                createUIDLinks, [],
                                onCreateSuccess,
                                onError
                            );
                            tx.executeSql(
                                'DROP TABLE IF EXISTS uid_messages_send'
                            );
                            tx.executeSql(
                                createUIDMessagesSend, [],
                                onCreateSuccess,
                                onError
                            );
                            tx.executeSql(
                                'DROP TABLE IF EXISTS uid_messages_receive'
                            ); //console.log('TABLE uid_messages_receive DROP');    
                            tx.executeSql(
                                createUIDMessagesReceive, [],
                                onCreateSuccess,
                                onError
                            );
                            tx.executeSql(
                                insertUID, [
                                    a.uid,
                                    a.sslnoteapp,
                                    account_id,
                                    a.active,
                                    a.pass_reset,
                                    a.my_nick,
                                    a.settpass,
                                    a.logins,
                                    a.reactivatecode,
                                    a.sound,
                                    a.volume,
                                    a.repeatpush,
                                    a.device,
                                    a.maxlink,
                                    a.language,
                                    a.server
                                ],
                                onInsertSuccess,
                                onError
                            );
                        });
                        sslnote.hideIndicator();
                        //console.log('LOADING frames/setup/setup-setpass.html');
                        // clearTimeout(noconnection);
                        sslnote.hidePreloader();
                        mainView.loadPage(
                            'frames/setup/setup-setpass.html'
                        );
                    } else {
                        sslnote.hidePreloader();
                        sslnote.alert(jsonObject.msg,
                            function() {
                                //mainView.loadPage("frames/setup/index.html")
                                sslnote.hidePreloader();
                            });
                        //TODO fix checking preloader weg        
                    }
                },
                error: function(responseData,
                    textStatus, errorThrown) {
                    //console.log('something went wrong!! Error: '+textStatus);
                    // sslnote.hidePreloader();
                    // sslnote.alert(responseData,textStatus,errorThrown +' Error', function() {
                    //         sslnote.hidePreloader();
                    //     });
                    sslnote.hidePreloader();
                    sslnote.alert(
                        'Error. please try again.',
                        function() {
                            // PushErrorToSupport(errorThrown);
                        });
                },
            }); // end ajax
        } //end if 
        // }
    }); // end .form-to-json
}); // end page.name
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('firstsetuppremium', function() {
    console.log('page.name firstsetuppremium :');
    localStorage.setItem('showalert', 0);
    $$('.exitsetup').on('click', function() {
        //console.log('+++ exitsetup');
        //mainView.loadPage('index.html');
        sslnote.hideIndicator();
        // sslnote.closeModal('.popup-getting-started');
        sessionStorage.removeItem('counter');
        mainView.router.load({
            url: 'frames/login.html',
            animatePages: false
        });
    });
    // check login
    $$('.activate .form-to-json').on('click', function() {
        var formData = sslnote.formToJSON('#premiumsetup');
        //sslnote.alert(JSON.stringify(formData));
        //sslnote.showIndicator();
        //console.log('firstsetuppremium formData =' +formData);
        console.log(formData);
        //console.log('firstsetuppremium uid : ' + formData['uid'] );
        //console.log('firstsetuppremium activationcode : ' + formData['activationcode']);
        var uid = formData['uid'];
        localStorage.setItem('UID', uid);
        var activationcode = formData['activationcode'];
        var error_uid = '0';
        var error_activationcode = '0';
        // function checkdata(){
        //console.log('checkdata');
        if (uid === undefined || uid === null || uid === '') {
            sslnote.alert('UID cannot be empty.');
            error_uid = '1';
            //return;
            // oke close preloader
        }
        if (activationcode === undefined || activationcode ===
            null || activationcode === '') {
            sslnote.alert('CODE cannot be empty.');
            error_activationcode = '1';
            //return;
        }
        // }
        if (error_uid === '0' && error_activationcode === '0') {
            //console.log('preloader');
            $$.getJSON("i18n/" + localStorage.getItem(
                    'cLANGUAGE') + "/strings.json",
                function(languageSpecificObject) {
                    sslnote.showPreloader(
                        languageSpecificObject.languageSpecifications[
                            0]['checking']);
                });
            //console.log('form-to-json');
            document.activeElement.blur();
            if (localStorage.getItem('token')) {
                $$.ajax({
                    method: 'POST',
                    dataType: 'jsonp',
                    url: localStorage.getItem(
                            'connection') +
                        '/appie/php/include/updatetoken.php?l?callback=?',
                    crossDomain: true,
                    data: {
                        token: localStorage.getItem(
                            'token'),
                        uid: localStorage.getItem('UID')
                    },
                    success: function(responseData,
                        textStatus, jqXHR) {
                        //console.log('TOKEN : ' +localStorage.getItem('token'));
                        //console.log('TOKEN : ' +responseData);
                    }
                });
            } // end if token
            //console.log('+++ DO Csetup.php');
            $$.ajax({
                method: 'POST',
                dataType: 'jsonp',
                url: localStorage.getItem('connection') +
                    '/appie/php/' + localStorage.getItem(
                        'sslnoteapp') +
                    '/Csetup.php?sslnoteapp=' +
                    localStorage.getItem('sslnoteapp') +
                    'callback=?',
                crossDomain: true,
                data: formData,
                success: function(responseData,
                    textStatus, jqXHR) {
                    //console.log('+++ LOGIN OKE responseData');
                    console.log(responseData);
                    //console.log('+++ LOGIN OKE end');
                    // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                    //     sslnote.showPreloader(languageSpecificObject.languageSpecifications[0]['preparing']);
                    // });
                    var jsonObject = (new Function(
                        'return ' +
                        responseData))();
                    if (jsonObject.prove === '1') {
                        // set sessionStorage.login
                        // console.log(jsonObject.id);
                        // sessionStorage.setItem('my_pid',jsonObject.id);
                        // localStorage.setItem('server',jsonObject.server);
                        // localStorage.setItem('sound',jsonObject.server);
                        // localStorage.setItem('volume',jsonObject.server);
                        // localStorage.setItem('repeatpush',jsonObject.server);
                        var a = JSON.parse(
                            responseData);
                        //console.log('responseData premium');
                        //console.log('uid='+a.uid);
                        localStorage.setItem('UID',
                            a.uid);
                        //console.log('sslnoteapp='+a.sslnoteapp);
                        //console.log('account_id='+a.account_id);
                        //localStorage.setItem('account_id',a.account_id);
                        //console.log('active='+a.active);
                        //console.log('pass_reset='+a.pass_reset);
                        //console.log('my_nick='+a.my_nick);
                        //console.log('settpass='+a.settpass);
                        //console.log('uloginsid='+a.logins);
                        //console.log('reactivatecode='+a.reactivatecode);
                        sessionStorage.setItem(
                            'reactivatecode', a
                            .reactivatecode);
                        //console.log('token='+a.token);
                        //console.log('sound='+a.sound);
                        localStorage.setItem(
                            'sound', a.sound);
                        //console.log('volume='+a.volume);
                        localStorage.setItem(
                            'volume', a.volume);
                        //console.log('repeatpush='+a.repeatpush);
                        localStorage.setItem(
                            'repeatpush', a.repeatpush
                        );
                        //console.log('device='+a.device);
                        //console.log('maxlink='+a.maxlink);
                        //console.log('language='+a.language);
                        //console.log('server='+a.server);
                        localStorage.setItem(
                            'server', a.server);
                        app.db.transaction(function(
                            tx) {
                            //console.log('app.JSON to SQLite');     
                            tx.executeSql(
                                'DROP TABLE IF EXISTS uid'
                            );
                            tx.executeSql(
                                createUID, [],
                                onCreateSuccess,
                                onError
                            );
                            tx.executeSql(
                                'DROP TABLE IF EXISTS uid_links'
                            );
                            tx.executeSql(
                                createUIDLinks, [],
                                onCreateSuccess,
                                onError
                            );
                            tx.executeSql(
                                'DROP TABLE IF EXISTS uid_messages_send'
                            );
                            tx.executeSql(
                                createUIDMessagesSend, [],
                                onCreateSuccess,
                                onError
                            );
                            tx.executeSql(
                                'DROP TABLE IF EXISTS uid_messages_receive'
                            ); //console.log('TABLE uid_messages_receive DROP');    
                            tx.executeSql(
                                createUIDMessagesReceive, [],
                                onCreateSuccess,
                                onError
                            );
                            tx.executeSql(
                                insertUID, [
                                    a.uid,
                                    a.sslnoteapp,
                                    a.account_id,
                                    a.active,
                                    a.pass_reset,
                                    a.my_nick,
                                    a.settpass,
                                    a.logins,
                                    a.reactivatecode,
                                    a.sound,
                                    a.volume,
                                    a.repeatpush,
                                    a.device,
                                    a.maxlink,
                                    a.language,
                                    a.server
                                ],
                                onInsertSuccess,
                                onError
                            );
                        });
                        sslnote.hideIndicator();
                        //console.log('LOADING frames/setup/setup-setpass.html');
                        // clearTimeout(noconnection);
                        sslnote.hidePreloader();
                        mainView.loadPage(
                            'frames/setup/setup-setpass.html'
                        );
                    } else {
                        sslnote.hidePreloader();
                        sslnote.alert(jsonObject.msg,
                            function() {
                                //mainView.loadPage("frames/setup/index.html")
                                sslnote.hidePreloader();
                            });
                        //TODO fix checking preloader weg        
                    }
                },
                error: function(responseData,
                    textStatus, errorThrown) {
                    //console.log('something went wrong!! Error: '+textStatus);
                    // sslnote.hidePreloader();
                    // sslnote.alert(responseData,textStatus,errorThrown +' Error', function() {
                    //         sslnote.hidePreloader();
                    //     });
                    sslnote.hidePreloader();
                    sslnote.alert(
                        'Error. please try again.',
                        function() {
                            // PushErrorToSupport(errorThrown);
                        });
                },
            }); // end ajax
        } //end if 
        // / }
    }); // end .form-to-json
}); // end page.name

//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setup-setpass', function() {
    console.log('page.name setup-setpass :');
    sslnote.hidePreloader();
    mainView.hideNavbar();
    localStorage.setItem('showalert', 0);





    localStorage.setItem('f7form-settings-pushnotification',
        '{"pushreceived":["on"],"pushread":["on"],"pushwipe":["on"]}'
    );
    localStorage.setItem('f7form-settingsscreenprotect',
        '{"screenprotect":"3"}');
    localStorage.setItem('f7form-settings-keyboardclick',
        '{"keyboardclick":["on"]}');
    localStorage.setItem('f7form-settingslogoff', '{"autologoff":"3"}');
    localStorage.setItem('f7form-settings-shake',
        '{"shakeon":"on","shakesensitivity":"20"}');
    localStorage.setItem('f7form-settings-notification',
        '{"uid":"","sound":"1.m4a","volume":"50"}');
    localStorage.setItem('f7form-settings-containers',
        '{"my-container":["RUSSIA","PANAMA","CHINA","EU"]}');

// * TODO SOUND SHAKE notification container repeatsound




    // sslnote.formStoreData('cLANGUAGE ', {"cLANGUAGE":["nl"]
    //  }); // TODO
    //console.log('page.name firstsetup');
    localStorage.setItem('showalert', 0);
    //console.log('showalert = 0');
    //console.log('Lite INIT');
    document.activeElement.blur();
    // disable counter
    // contactsview.router.load({url:'frames/login.html' , animatePages:false});
    // $('.countdown_dashboard').data('countdown').update({diff: '-1'});
    //console.log('sslnoteapp : ' + localStorage.getItem('sslnoteapp'));
    //console.log('check token');
    if (!localStorage.getItem('token')) {
        localStorage.setItem('token', 'NO-TOKEN');
    }


    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            // languageSpecificObject.languageSpecifications[0]['passwordcannotbeempty']
            sslnote.showPreloader(languageSpecificObject.languageSpecifications[
                0]['nosettingsfound']);
            //console.log('Generate UID');
        });


    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: localStorage.getItem('connection') +
            '/appie/php/Csslnoteapp.php?callback=?',
        crossDomain: true,
        data: {
            sslnoteapp: localStorage.getItem('sslnoteapp'),
            token: localStorage.getItem('token')
        },
        success: function(responseData, textStatus, jqXHR) {
            //console.log('LITE responseData');
            console.log(responseData);
            // var jsonObject = new Function('return ' +responseData)();
            // sslnote.alert(jsonObject.id);//     does nothing
            // set sessionStorage.login
            // console.log(jsonObject.id);
            // console.log(jsonObject.uid);
            // localStorage.setItem('UID', jsonObject.uid);
            // //console.log('ECHO MSG : ' + jsonObject.msg);
            localStorage.removeItem('repeatsound');
            // sessionStorage.setItem('reactivatecode',jsonObject.reactivatecode);
            // localStorage.setItem('account_id', jsonObject.account_id);
            // //sessionStorage.setItem('account_id', jsonObject.account_id);
            // localStorage.setItem('sound', jsonObject.sound);
            // localStorage.setItem('volume', jsonObject.volume);
            // localStorage.setItem('server', jsonObject.server);
            // UPDATE PID SHOW
            // //console.log('UPDATE CREATE PID');
            // $$(page.container).find('.yourpid').html(localStorage.getItem('UID'));
            var a = JSON.parse(responseData);
            //console.log('responseData firstsetup');
            //console.log('uid='+a.uid);
            localStorage.setItem('UID', a.uid);
            //console.log('sslnoteapp='+a.sslnoteapp);
            //console.log('account_id='+a.account_id);
            //localStorage.setItem('account_id',a.account_id);
            var account_id = 'off';
            //console.log('-- manual account_id='+account_id);
            //console.log('active='+a.active);
            //console.log('pass_reset='+a.pass_reset);
            //console.log('my_nick='+a.my_nick);
            //console.log('settpass='+a.settpass);
            //console.log('uloginsid='+a.logins);
            //console.log('reactivatecode='+a.reactivatecode);
            sessionStorage.setItem('reactivatecode', a.reactivatecode);
            //console.log('token='+a.token);
            //console.log('sound='+a.sound);
            localStorage.setItem('sound', a.sound);
            //console.log('volume='+a.volume);
            localStorage.setItem('volume', a.volume);
            //console.log('repeatpush='+a.repeatpush);
            localStorage.setItem('repeatpush', a.repeatpush);
            //console.log('device='+a.device);
            //console.log('maxlink='+a.maxlink);
            //console.log('language='+a.language);
            //console.log('server='+a.server);
            localStorage.setItem('server', a.server);
            console.log('ECHO MSG A : ' + a.msg);
            
            sslnote.hideIndicator();
            sslnote.hidePreloader();



            app.db.transaction(function(tx) {
                console.log('app.JSON to SQLite');     
                tx.executeSql(
                    'DROP TABLE IF EXISTS uid');
                tx.executeSql(createUID, [],
                    onCreateSuccess, onError);
                tx.executeSql(
                    'DROP TABLE IF EXISTS uid_links'
                );
                tx.executeSql(createUIDLinks, [],
                    onCreateSuccess, onError);
                tx.executeSql(
                    'DROP TABLE IF EXISTS uid_messages_send'
                );
                tx.executeSql(createUIDMessagesSend, [],
                    onCreateSuccess, onError);
                tx.executeSql(
                    'DROP TABLE IF EXISTS uid_messages_receive'
                ); //console.log('TABLE uid_messages_receive DROP');    
                tx.executeSql(
                    createUIDMessagesReceive, [],
                    onCreateSuccess, onError);
                tx.executeSql(insertUID, [a.uid, a.sslnoteapp,
                    account_id, a.active, a
                    .pass_reset, a.my_nick,
                    a.settpass, a.logins, a
                    .reactivatecode, a.sound,
                    a.volume, a.repeatpush,
                    a.device, a.maxlink, a.language,
                    a.server
                ], onInsertSuccess, onError);
            });
            console.log('UPDATE CREATE PID  = ' + localStorage.getItem('UID'));
            $$('.yourpid').html(localStorage.getItem('UID'));
        },
        error: function(responseData, textStatus, errorThrown) {
            console.log("something went wrong!! Error: " +textStatus);
            sslnote.hidePreloader();
            sslnote.alert('Error. please try again.',
                function() {PushErrorToSupport(errorThrown);});
        }
    });


    $$('.form-to-json').on('click', function() {
        var formData = sslnote.formToJSON('#setpass');
        // alert(JSON.stringify(formData));
        console.log(formData);
        //console.log('PASS1 : ' + formData.pass1);
        //console.log('PASS2 : ' + formData.pass2);
        var pass1 = formData.pass1;
        var pass2 = formData.pass2;


        var pass1 = pass1.replace(/\s/g, '');
        var pass2 = pass2.replace(/\s/g, '');
        
        console.log('PASS1 : ' + pass1);
        console.log('PASS2 : ' + pass2);


        var stopscript = 'no';

        if (pass1 !== pass2) {
            // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
            sslnote.modal({
                title: 'PEM',
                text: localStorage.getItem(
                    'passwordnotthesame'),
                buttons: [{
                    text: localStorage.getItem(
                        'oke'),
                    onClick: function() {}
                }, ]
            });
            //});
            var stopscript = 'yes';
        }

        if (pass1 === '' || pass2 === '') {
            //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
            sslnote.modal({
                title: 'PEM',
                text: localStorage.getItem(
                    'passwordcannotbeempty'),
                buttons: [{
                    text: localStorage.getItem(
                        'oke'),
                    onClick: function() {}
                }, ]
            });
            //});
            var stopscript = 'yes';
        }

        if (stopscript == 'no') {
            if (pass1 == pass2) {
                ////console.log('preloader');
                //sslnote.showPreloader('Checking...');
                //var pass = md5("pass1");
                var pass = calcMD5(pass1);
                var uid = localStorage.getItem('UID');
                //console.log('form-to-json');
                document.activeElement.blur();
                // url: localStorage.getItem('connection')+"/appie/php/"+localStorage.getItem('sslnoteapp')+"/Clogin-screen-embedded.php?callback=?",
                app.db.transaction(function(tx) {
                    //console.log('app.updateRecord');   
                    var mDate = new Date();
                    tx.executeSql(
                        "UPDATE uid SET pass = ?, active_last = ? WHERE uid = ?", [
                            pass, mDate, uid
                        ], onInsertSuccess, onError
                    );
                });
                

                console.log('mainView LOADING frames/setup/setup-settingslogoff.html');
                mainView.loadPage(
                    'frames/setup/setupintroexplanation.html'
                );




                // sslnote.hidePreloader();
            } // end if pass the same
        } //end is stoptscript
    }); // end .form-to-json
}); // end page.name

//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setupintroexplanation', function() {
    //console.log('page.name setup-settingslogoff :');
    localStorage.setItem('showalert', 0);
    document.activeElement.blur();
    mainView.showNavbar();


        console.log('*** Fn importNewUIDLinks');

importNewUIDLinks();




    $$('.next').on('click', function() {
        //mainView.router.loadPage('frames/setup/setup-settingsscreenprotect.html'); //skip screenprotect
        mainView.router.loadPage(
            'frames/setup/setup-notification.html');
    });
}); // end page.name




//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setup-settingslogoff', function() {
    //console.log('page.name setup-settingslogoff :');
    localStorage.setItem('showalert', 0);
    document.activeElement.blur();
    mainView.showNavbar();
    sslnote.formFromJSON('#settingslogoff', localStorage.getItem(
        'f7form-settingslogoff'));
    // sslnote.formFromJSON('#settingslogoff', {"autologoff":"3"});
    $$('.next').on('click', function() {
        //mainView.router.loadPage('frames/setup/setup-settingsscreenprotect.html'); //skip screenprotect
        mainView.router.loadPage(
            'frames/setup/setup-notification.html');
    });
}); // end page.name
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setup-settingsscreenprotect', function() {
    //console.log('page.name setup-settingsscreenprotect :');
    localStorage.setItem('showalert', 0);
    document.activeElement.blur();
    sslnote.formFromJSON('#settingsscreenprotect', localStorage.getItem(
        'f7form-settingsscreenprotect'));
    // sslnote.formFromJSON('#settingsscreenprotect', {"screenprotect":"3" });
    $$('.next').on('click', function() {
        mainView.router.loadPage(
            'frames/setup/setup-notification.html');
    });
}); // end page.name
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setup-notification', function() {
    //console.log('page.name setup-notification :');
    localStorage.setItem('showalert', 0);
    document.activeElement.blur();
    var uid = localStorage.getItem('UID');
    sslnote.formFromJSON('#settings-notification', localStorage.getItem(
        'f7form-settings-notification'));
}); // end page.name
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('settings-keyboardclick', function() {
    //console.log('page.name settings-keyboardclick');
    //console.log('+++ show stored settings-keyboardclick data');
    // settings - notification
    sslnote.formFromJSON('#settings-keyboardclick', sslnote.formGetData(
        'settings-keyboardclick'));
    var storedData = sslnote.formGetData('settings-keyboardclick');
    if (storedData) {
        //console.log('+++++++++++++ storedData = ');
        console.log(storedData);
        var keyboardclick = storedData.keyboardclick;
        var volumekeyboardclick = storedData.volumekeyboardclick;
        //console.log('+++ keyboardclick = ' +keyboardclick);
        //console.log('+++ volumekeyboardclick = ' +volumekeyboardclick);
        // localStorage.setItem('keyboardclick',keyboardclick);
        // localStorage.setItem('volumekeyboardclick',volumekeyboardclick);
    }
});
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('settings-taal', function() {
    //console.log('page.name settings-taal');
});
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('settings-pushnotification', function() {
    //console.log('page.name settings-pushnotification');
    //console.log('+++ show stored settings-pushnotification data');
    sslnote.formFromJSON('#settings-pushnotification', localStorage.getItem(
        'f7form-settings-pushnotification'));
    var storedData = sslnote.formGetData('settings-pushnotification');
    if (storedData) {
        //console.log('+++++++++++++ storedData = ');
        console.log(storedData);
        var pushreceived = storedData.pushreceived;
        var pushwipe = storedData.pushwipe;
        //console.log('+++ pushreceived = ' +pushreceived);
        //console.log('+++ pushwipe = ' +pushwipe);
    }
});
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('login', function() {
    console.log('page.name login A');
var UID = localStorage.getItem('UID');
console.log(UID);


    
if (UID === '' || UID === null ) {
    console.log('page.name login B');





    sslnote.alert('NO UID Please do setup.', function() {

// mainView.loadPage('frames/setup/setupintro.html');


    mainView.router.load({
        url: 'frames/setup/setupintro.html',
        animatePages: false,
        reload: true
    });




    });
}

else

{
    console.log('page.name login C');

    $("#connection").addClass("connectionHidden");
    sessionStorage.clear();
    sslnote.hideIndicator();
    sslnote.loginScreen();
    //console.log('!! STOP LOOP from onPageInit login');
    clearTimeout(loop);
    sslnote.hideIndicator();

}




}); // end page.name
//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('settings-containers', function() {
    //console.log('page.name settings-containers');
    console.log(sslnote.formGetData('settings-containers'));
    console.log(sslnote.formGetData('containers'));

});
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageBeforeAnimation('settings', function() {
    //console.log('pageBeforeAnimation settings');
    $('.tab-settings').removeClass('inactive');
    $('.tab-settings').addClass('icon');
    $('.tab-home').removeClass('icon');
    $('.tab-home').addClass('inactive');
});
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
$(document).ready(function() {
    console.log('**** Document ready online *****');
    if (localStorage.getItem('autologon') === '999') {
        // document.getElementById('countdown_dashboardHide').innerHTML =
        //     '<a href=\'#\' class=\'autologon\'><i class=\'icon ion-ios-refresh\'></i></a>';


        sslnote.closeModal('.login-screen');

        setTimeout(function() {
            sessionStorage.setItem('logofftimer', localStorage.getItem(
                'logofftimer'));
            mainView.router.load({
                url: 'frames/messages/Scontactlist.html',
                animatePages: false
            });
            sslnote.hideIndicator();
            
        }, 800);
    }
});