myApp.onPageInit('settings', function() {
    //console.log('page.name settings');
    ////console.log('!! STOP LOOP');
    // clearTimeout(loop);



    var uid = localStorage.getItem('UID');

    app.selectAllRecords = function(fn) {
            app.db.transaction(function(tx) {
                ////console.log('------ selectUID settings');
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
                ////console.log('No Admin Panel');
                //localStorage.setItem('account_id','off');
                $$('.admin').hide();
            }
            if (data.myAppapp != 'Premium') {
                ////console.log('No PremiumServer Panel');
                $$('.premium').hide();
            }

            myApp.formFromJSON('#settings', data);
            ////console.log('+++ show stored data');
            //console.log(data);
            var server = localStorage.getItem('server');
            //console.log(server);
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

    $$('.myUID').html('UNIQUE ID : ' + localStorage.getItem('UID'));

    $$('.data-expire').html(localStorage.getItem('date_expire_txt'));

    

    $$('input[type="checkbox"]').on('change', function() {
        console.log(this.checked);

        var debugging = this.checked;

        //console.log('debugging switch = ' + debugging);

        localStorage.debugging = debugging;

    })

    $$('.aboutinfo').on('click', function() {
        //console.log('about info button clicked = ');


        myApp.modal({
            title: 'ABOUT PEM',
            text: localStorage.getItem('whatsnew'),
            afterText: '<BR>' + 'More info : http://pem.world' ,
            buttons: [{
                text: localStorage.getItem('OKE'),
                onClick: function() {

                }
            }]

        });
    })

        $$('.license').on('click', function() {
        //console.log('license button clicked = ');


        myApp.modal({
            title: 'LICENSE',

            text: localStorage.getItem('license'),
            // afterText: '<BR>' + 'More info : http://pem.world' ,
            buttons: [{
                text: localStorage.getItem('OKE'),
                onClick: function() {

                }
            }]

        });
    })


}); // end page.name

//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
myApp.onPageAfterAnimation('settings', function(page) {
    //////////////////////////////////////////////////////////////////////
    //console.log('!!! onPageAfterAnimation settings');

    // var cLANGUAGEdata = myApp.formGetData('cLANGUAGE');

    // if (cLANGUAGEdata) {
    //     //console.log(JSON.stringify(cLANGUAGEdata));
    //     var cLANGUAGE = cLANGUAGEdata.cLANGUAGE;
    //     //console.log('++++++ = '+ cLANGUAGE);
    //     localStorage.setItem('cLANGUAGE', cLANGUAGE);
    // }
    // SYNC
    // f7form-settings-pushnotification={"pushreceived":["on"],"pushread":["on"],"pushwipe":["on"]}
    // f7form-settingsscreenprotect={"screenprotect":"999"}
    // f7form-settings-keyboardclick={"keyboardclick":["on"]}
    // f7form-cLANGUAGE={"cLANGUAGE":"nl"}
    // f7form-settingslogoff={"autologoff":"5"}
    // f7form-settings-notification={"uid":"QXEV4QHKXW","sound":"0.m4a","volume":"23.4","repeatpush":["on"]}
    ////console.log('------------ SYNC START----------------');


    var storedData1 = myApp.formGetData('settings-notification-sound');
    ////console.log('1' );

    //var storedData2 = myApp.formGetData('settingsscreenprotect');
    //var storedData3 = myApp.formGetData('settings-keyboardclick');
    var storedData4 = myApp.formGetData('cLANGUAGE');
    ////console.log('11' );

    var storedData5 = myApp.formGetData('settings-logoff');
    ////console.log('111' );   

    var storedData6 = myApp.formGetData('settings-notification');
    ////console.log('1111' );  

    var storedData7 = myApp.formGetData('settings-containers');
    ////console.log('11111' );  
    var storedData8 = myApp.formGetData('settings-shake');




    // var storedData10 = myApp.formGetData('settings-showMessageStatus');


    //console.log('!settings-notification-sound = ');
    console.log(storedData1);
    ////console.log('!settingsscreenprotect = ' );
    //console.log(storedData2);
    ////console.log('!settings-keyboardclick = ');
    //console.log(storedData3);
    //console.log('!cLANGUAGE = ' );
    console.log(storedData4);

    //console.log('!settings-logoff = ');
    console.log(storedData5);

    //console.log('!settings-notification = ');
    console.log(storedData6);
    //console.log('!settings-containers = ');
    console.log(storedData7);

    //console.log('!settings-shake = ');
    console.log(storedData8);


    // //console.log('!settings-showMessageStatus = ' );
    // console.log(storedData10);


    var Syncpushreceived = '';
    var Syncpushdelivered = '';
    var Syncpushread = '';
    var Syncpushwipe = '';
    var Syncpushcontacts = '';

    var Syncscreenprotect = '';
    var Synckeyboardclick = '';


    var SynccLANGUAGE = '';

    var Syncautologoff = '';
    var SyncAUTOLOGON = '';
    var Syncnotifications = '';
    var Syncsound = '';
    var Syncvolume = '';
    var Syncrepeatpush = '';
    var Syncshake = '';

    ////console.log('------------ SYNC START a----------------');
    if (storedData6) {
        var Syncpushreceived = JSON.stringify(storedData6.PUSH_RECEIVED);

        var Syncpushread = JSON.stringify(storedData6.PUSH_READ);
        var Syncpushwipe = JSON.stringify(storedData6.PUSH_WIPED);
        var Syncpushdelivered = JSON.stringify(storedData6.PUSH_DELIVERD);
        // var Syncpushcontacts = storedData6.PUSH_CONTACTS_INVITE;
        var Syncpushrepeat = JSON.stringify(storedData6.PUSH_REPEAT_NOTIFICATION);

        var Syncnotifications = JSON.stringify(storedData6.NOTIFICATION);
       // if(Syncnotifications === '[\"on\"]') { Syncnotifications = 'on' ;}

    }
    ////console.log('------------ SYNC START b----------------');
    // if (storedData2) {
    //     var Syncscreenprotect = storedData2.screenprotect;
    // }
    // ////console.log('------------ SYNC START c----------------');
    // if (storedData3) {
    //     var Synckeyboardclick = storedData3.keyboardclick;
    // }
    ////console.log('------------ SYNC START d----------------');
    if (storedData4) {
        var SynccLANGUAGE = storedData4.cLANGUAGE;
    }
    ////console.log('------------ SYNC START e----------------');

    //    var storedData5 = myApp.formGetData('settings-logoff');


    if (storedData5) {
        var Syncautologoff = storedData5.autologoff;
        var SyncAUTOLOGON = storedData5.AUTOLOGON;

        localStorage.setItem('AUTOLOGON', SyncAUTOLOGON);
    }
    ////console.log('------------ SYNC START f----------------');
    if (storedData1) {
        var Syncsound = storedData1.sound;
        var Syncvolume = storedData1.volume;
        //var Syncrepeatpush = storedData1.repeatpush;
        localStorage.setItem('playNotificationSound', Syncsound);

        //console.log('------------ SYNC START playNotificationSound = ' + Syncsound);

    }
    ////console.log('------------ SYNC START g----------------'); 
    if (storedData8) {
        var Syncshakeon = storedData8.shakeon;
        var Syncshakesensitivity = storedData8.shakesensitivity;
    }
    ////console.log('------------ SYNC START g----------------'); 
    var Synctoken = localStorage.getItem('token');
    var SyncApp = localStorage.getItem('App');



    //console.log('------------ AJAX START----------------');

var settingsData = {
            uid: localStorage.getItem('UID'),
            repeatpush: Syncrepeatpush,
            pushreceived: Syncpushreceived,
            pushread: Syncpushread,
            pushwipe: Syncpushwipe,
            pushdelivered: Syncpushdelivered,
            pushrepeat: Syncpushrepeat,
            notifications: Syncnotifications,
            cLANGUAGE: SynccLANGUAGE,
            autologoff: Syncautologoff,
            sound: Syncsound,
            volume: Syncvolume,
            token: Synctoken,
            App: SyncApp
        };

//console.log('+++ SYNC settingsData = ' ,settingsData);
console.log(settingsData);

    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: localStorage.getItem('connection') +
            '/appie/php/include/JsonSync.php?callback=?',
        crossDomain: true,
        data: settingsData,
        success: function(responseData, textStatus, jqXHR) {
            ////console.log('............................................');
            //console.log('+++ SYNC responseData = ' + responseData);
            ////console.log('............................................');
        },
        error: function(responseData, textStatus, jqXHR) {
            ////console.log('............................................');
            //console.log('+++ SYNC error = ' + responseData);
            //PushErrorToSupport(responseData);
            ////console.log('............................................');
        },
        complete: function(responseData, textStatus, jqXHR) {
            ////console.log('............................................');
            //console.log('+++ SYNC complete = ' + responseData);
            ////console.log('............................................');
        }
    });
    //console.log('------------ SYNC FINISH ----------------');

});

//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
myApp.onPageBeforeAnimation('settings-resetMainPassword', function() {

    //console.log('!!! onPageInit settings-resetMainPassword');

    $('input').val('');
    $('textarea').val('');
    $$('.showResetMainPassword').hide();



    $('#resetMainPassword').on('input', function() {

        var password = $(this).val();


        //console.log('password = ' + password);
        var uid = localStorage.getItem('UID');
        var pass = calcMD5(password);
        ////console.log('A pass MD5 = '+pass);
        app.selectAllRecords = function(fn) {
            app.db.transaction(function(tx) {
                ////console.log('app.selectAllRecords');
                tx.executeSql("SELECT * FROM uid WHERE uid = ? and pass = ?", [uid, pass], fn, app.onError);
            });
        }

        var render = function(tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                //console.log(rs.rows.item(i)); 
            }

            if (rs.rows.length) {
                //console.log('PASSWORD OKE');

                $$('.showResetMainPassword').show();
            } else {
                //console.log('PASSWORD NOT FOUND');
                $$('.showResetMainPassword').hide();
            }
        }
        app.selectAllRecords(render);

    }); // end input


});

//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
myApp.onPageBeforeAnimation('settings-resetBurnPassword', function() {

    //console.log('!!! onPageInit settings-resetBurnPassword');

    $('input').val('');
    $('textarea').val('');
    $$('.showResetBurnPassword').hide();


    $('#resetBurnPassword').on('input', function() {

        var password = $(this).val();


        //console.log('password = ' + password);
        var uid = localStorage.getItem('UID');
        var pass = calcMD5(password);
        ////console.log('A pass MD5 = '+pass);
        app.selectAllRecords = function(fn) {
            app.db.transaction(function(tx) {
                ////console.log('app.selectAllRecords');
                tx.executeSql("SELECT * FROM uid WHERE uid = ? and pass = ?", [uid, pass], fn, app.onError);
            });
        }

        var render = function(tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                //console.log(rs.rows.item(i)); 
            }

            if (rs.rows.length) {
                //console.log('PASSWORD OKE');

                $$('.showResetBurnPassword').show();
            } else {
                //console.log('PASSWORD NOT FOUND');
                $$('.showResetBurnPassword').hide();
            }
        }
        app.selectAllRecords(render);

    }); // end input



});



//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('settings-swiper-password', function() {

    //console.log('!!! onPageInit settings-swiper-password');

});



//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
myApp.onPageBeforeAnimation('settings-notification', function() {
    ////console.log('Page = settings-notification');
    ////console.log('PAGE INIT settings-notification DATA :');
    ////console.log('SESSION his_uid :');
    //myApp.showPreloader('Collecting data...');
    myApp.formFromJSON('#settings-notification', localStorage.getItem('f7form-settings-notification'));

    // var storedDataVolume = myApp.formGetData('settings-notification');
    // var notificationsVolume = storedDataVolume.volume;

    var uid = localStorage.getItem('UID');


    $$('.mainSwitch input[type="checkbox"]').on('change', function() {
        //console.log(this.checked);

        var showSettings = this.checked;

        //console.log('showSettings switch = ' + showSettings);

        localStorage.showSettings = showSettings;

        if (showSettings === true) {
            $$('.showSettings').show();
        }

        if (showSettings === false) {
            $$('.showSettings').hide();
        }


    })

    if (!localStorage.showSettings) {
        localStorage.showSettings = true;
    }

    var showSettings = localStorage.showSettings;

    //console.log('showSettings localStorage = ' + showSettings);

    if (showSettings === 'true') {
        //console.log('showSettings true = ' + showSettings);
        $$('.showSettings').show();
    }

    if (showSettings === 'false') {
        //console.log('showSettings false = ' + showSettings);
        $$('.showSettings').hide();
    }




    $$('.form-to-json').on('click', function() {
        // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
        // myApp.showPreloader(localStorage.getItem('updating'));
        ////console.log('settings-notificationUPDATE');
        var formData = myApp.formToJSON('#settings-notification');
        // myApp.alert(JSON.stringify(formData));
        console.log(formData);
        // send data to server
        $$.ajax({
            method: 'POST',
            dataType: 'jsonp',
            url: localStorage.getItem('connection') +
                '/appie/php/' + localStorage.getItem('myAppapp') +
                '/CnotificationUpdate.php?',
            crossDomain: true,
            data: formData,
            success: function(responseData, textStatus, errorThrown) {
                ////console.log('ECHO DATA');
                console.log(responseData);
                // myApp.hidePreloader();
                settingsview.router.back({
                    url: 'frames/settings/index.html',
                    force: true
                });
            },
            error: function(responseData, textStatus, errorThrown) {
                ////console.log('something went wrong!! Error: ' +textStatus);
                myApp.hidePreloader();
                myApp.alert('Error. please try again.',
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
myApp.onPageBeforeAnimation('settings-logoff', function() {

    //console.log('!!! onPageInit settings-logoff');


    // myApp.formFromJSON('#settings-shake', localStorage.getItem('f7form-settings-logoff'));

    myApp.formFromJSON('#settings-logoff', localStorage.getItem('f7form-settings-logoff'));

    var storedData5 = myApp.formGetData('settings-logoff');

    if (storedData5) {

        var Syncautologoff = [storedData5.autologoff];
        //console.log('storedData5 = ',storedData5);
        //console.log('Syncautologoff = '+Syncautologoff);    
    }



    $$('input[type="checkbox"]').on('change', function() {
        //console.log(this.checked);

        var showSettingsLogoff = this.checked;

        ////console.log('showSettingsLogoff switch = ' +showSettingsLogoff);

        localStorage.showSettingsLogoff = showSettingsLogoff;


        var totalsec = localStorage.getItem('logofftimer') * 60;


        if (showSettingsLogoff === true) {

            // myApp.alert('Reminder: Enable Automatic logon will affect safety.');

            // $$('.showSettingsLogoff').hide();

            // $$('.showHideTimer').hide();

            // localStorage.setItem('autologon', '999'); 

            // sessionStorage.counterStarted = 'no';

            // updateCounter(totalsec,'stop');

        }


        if (showSettingsLogoff === false) {

            $$('.showSettingsLogoff').show();

            $$('.showHideTimer').show();


            if (!sessionStorage.counterStarted) {

                //console.log('NO sessionStorage.accountLogedIn ');

                var counterStart = updateCounter(totalsec, 'start');

            } else {
                //console.log('HAVE sessionStorage.accountLogedIn ');
                updateCounter(totalsec, 'update');

                sessionStorage.counterStarted = 'yes';
            }


            localStorage.removeItem('autologon');




        }


    })



    if (!localStorage.showSettingsLogoff) {
        localStorage.showSettingsLogoff = true;
    }



    var storedData5 = myApp.formGetData('settings-logoff');



    if (storedData5) {

        var Syncautologoff = [storedData5.autologoff];
        // var SyncAUTOLOGON = storedData5.AUTOLOGON;
        ////console.log('Syncautologoff = '+Syncautologoff);    
    }

// $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
//         "/strings.json", function(languageSpecificObject) {

    var pickerInline = myApp.picker({
        input: '#picker-device',
        container: '#picker-device-container',
        toolbar: false,
        rotateEffect: true,

        cols: [

            {
                values: localStorage.getItem('minutes').split(','),
                //displayValues: ('1 Minut,2 Minuts,3 Minuts,4 Minuts,5 Minuts,6 Minuts,7 Minuts,8 Minuts,9 Minuts').split(','),
                textAlign: 'center'
            }

        ],

        onChange: function(picker, values, displayValues) {

            var totalMinutsInput = values[0];

            var totalMinuts = totalMinutsInput.split(" ", 1);

            localStorage.setItem('logofftimer', totalMinuts[0]);

            var totalsec = localStorage.getItem('logofftimer') * 60;

            updateCounter(totalsec, 'update');

            sessionStorage.counterStarted = 'yes';

            localStorage.removeItem('autologon');

        }
    });
// });



    pickerInline.setValue(Syncautologoff);

    ////console.log('Syncautologoff = ' +Syncautologoff);




    var showSettingsLogoff = localStorage.showSettingsLogoff;

    ////console.log('showSettingsLogoff localStorage = ' +showSettingsLogoff);

    if (showSettingsLogoff === 'true') {
        ////console.log('showSettingsLogoff true = ' +showSettingsLogoff);
        $$('.showSettingsLogoff').hide();
    }

    if (showSettingsLogoff === 'false') {
        // //console.log('showSettingsLogoff false = ' +showSettingsLogoff); 
        $$('.showSettingsLogoff').show();
    }




});


//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************




myApp.onPageInit('settings-sound', function() {

    //console.log('page.name settings-sound');
    localStorage.setItem('showalert', 0);
    ////console.log('showalert = 1');
    ////console.log('settings-notification INIT');


    myApp.formFromJSON('#settings-notification-sound', localStorage.getItem('f7form-settings-notification-sound'));


}); // end page.name


//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('settings-shake', function() {
    ////console.log('page.name settings-notification');
    localStorage.setItem('showalert', 0);
    ////console.log('showalert = 1');
    ////console.log('settings-notification INIT');
    myApp.formFromJSON('#settings-shake', localStorage.getItem('f7form-settings-shake'));


    $$('input[type="range"]').on('input change', function() {

        var shakesensitivity = this.value;

        //console.log('shakesensitivity = ' + shakesensitivity);

        localStorage.setItem('f7form-settings-shake', '{"shakeon":["on"],"shakesensitivity":' + shakesensitivity + '}');

        shake.startWatch(onShake, shakesensitivity);

        //console.log('update data = ' + shakesensitivity);


        var sensetivetxt = '';

        if (shakesensitivity >= 36 && shakesensitivity <= 101) {
            sensetivetxt = 'Sensitivity : LOW';
        } else if (shakesensitivity >= 26 && shakesensitivity <= 35) {
            sensetivetxt = 'Sensitivity : MEDIUM';
        } else if (shakesensitivity >= 0 && shakesensitivity <= 25) {
            sensetivetxt = 'Sensitivity : HIGH';
        }

        ////console.log('sensetivetxt = '+ sensetivetxt);

        $$('.showValue').text(sensetivetxt);
    })




    $$('input[type="checkbox"]').on('change', function() {
        console.log(this.checked);

        var showSettingsShake = this.checked;

        //console.log('showSettingsShake switch = ' + showSettingsShake);

        localStorage.showSettingsShake = showSettingsShake;

        if (showSettingsShake === true) {

            //myApp.alert('Reminder: Enable Automatic logon will affect safety.');

            $$('.showSettingsShake').show();
        }

        if (showSettingsShake === false) {

            $$('.showSettingsShake').hide();

            //localStorage.setItem('f7form-settings-shake','{"shakeon":["on"],"shakesensitivity":'+ shakesensitivity+'}');

            var shakesensitivity = '100';

            shake.startWatch(onShake, shakesensitivity);

            //console.log('update data = ' + shakesensitivity);

        }
    });

    if (!localStorage.showSettingsShake) {
        localStorage.showSettingsShake = true;
    }

    var showSettingsShake = localStorage.showSettingsShake;

    //console.log('showSettingsShake localStorage = ' + showSettingsShake);

    if (showSettingsShake === 'true') {
        //console.log('showSettingsShake true = ' + showSettingsShake);
        $$('.showSettingsShake').show();
    }

    if (showSettingsShake === 'false') {
        //console.log('showSettingsShake false = ' + showSettingsShake);
        $$('.showSettingsShake').hide();

        var shakesensitivity = '100';

        shake.startWatch(onShake, shakesensitivity);

        //console.log('update data = ' + shakesensitivity);
    }

}); // end page.name

//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************

myApp.onPageAfterAnimation('settings-shake', function(page) {
    //////////////////////////////////////////////////////////////////////
    //console.log('!!! onPageAfterAnimation settings-shake');

    var storedDataShake = myApp.formGetData('settings-shake');

    var shakeon = storedDataShake.shakeon;
    
    var shakesensitivity = storedDataShake.shakesensitivity;

//console.log('+++shakesensitivity = ',shakesensitivity);

        if (shakesensitivity >= 36 && shakesensitivity <= 101) {
            sensetivetxt = 'Sensitivity : LOW';
        } else if (shakesensitivity >= 26 && shakesensitivity <= 35) {
            sensetivetxt = 'Sensitivity : MEDIUM';
        } else if (shakesensitivity >= 0 && shakesensitivity <= 25) {
            sensetivetxt = 'Sensitivity : HIGH';
        }

//console.log('+++sensetivetxt = ',sensetivetxt);


    $$('.showValue').text(sensetivetxt);

});






//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('AppReportTraffic', function() {
    ////console.log('page.name AppReportTraffic');
    sessionStorage.setItem('showalert', 1);
    ////console.log('showalert = 1');
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json",
        function(languageSpecificObject) {
            myApp.showPreloader(languageSpecificObject.languageSpecifications[
                0]['loading']);
            $$.get(localStorage.getItem('connection') +
                '/appie/php/' + localStorage.getItem(
                    'myAppapp') + '/CAppReportTraffic.php?', {
                    uid: localStorage.getItem('UID'),
                    server: localStorage.getItem('server')
                },
                function(data) {
                    console.log(data);
                    var listHTML = data;
                    $$('.menulist').html(listHTML);
                    ////console.log('INSERT DATA');
                    myApp.hidePreloader();
                });
        });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('Slinkpids', function() {
    ////console.log('page.name Slinkpids');
    sessionStorage.setItem('showalert', 1);
    ////console.log('showalert = 1');
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json",
        function(languageSpecificObject) {
            myApp.showPreloader(languageSpecificObject.languageSpecifications[
                0]['loading']);
            $$.get(localStorage.getItem('connection') +
                '/appie/php/' + localStorage.getItem(
                    'myAppapp') + '/Clinkpids.php?', {
                    my_pid: localStorage.getItem('my_pid'),
                    uid: localStorage.getItem('UID'),
                    server: localStorage.getItem('server')
                },
                function(data) {
                    console.log(data);
                    var listHTML = data;
                    $$('.menulist').html(listHTML);
                    ////console.log('INSERT DATA');
                    myApp.hidePreloader();
                });
        });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('SblockList', function() {
    ////console.log('page.name SblockList');
    sessionStorage.setItem('showalert', 1);
    ////console.log('showalert = 1');
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json",
        function(languageSpecificObject) {
            myApp.showPreloader(languageSpecificObject.languageSpecifications[
                0]['loading']);
            $$.get(localStorage.getItem('connection') +
                '/appie/php/' + localStorage.getItem(
                    'myAppapp') + '/CblockList.php?', {
                    // my_pid: localStorage.getItem('UID'),
                    uid: localStorage.getItem('UID'),
                    server: localStorage.getItem('server')
                },
                function(data) {
                    console.log(data);
                    var listHTML = data;
                    $$('.menulist').html(listHTML);
                    ////console.log('INSERT DATA');
                    myApp.hidePreloader();
                });
        });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('SpidList', function() {
    ////console.log('page.name SpidList');
    sessionStorage.setItem('showalert', 1);
    ////console.log('showalert = 1');
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json",
        function(languageSpecificObject) {
            myApp.showPreloader(languageSpecificObject.languageSpecifications[
                0]['loading']);
            $$.get(localStorage.getItem('connection') +
                '/appie/php/' + localStorage.getItem(
                    'myAppapp') + '/CpidList.php?', {
                    my_pid: localStorage.getItem('my_pid'),
                    uid: localStorage.getItem('UID'),
                    server: localStorage.getItem('server')
                },
                function(data) {
                    console.log(data);
                    var listHTML = data;
                    $$('.menulist').html(listHTML);
                    ////console.log('INSERT DATA');
                    myApp.hidePreloader();
                });
        });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('SmakeAccount', function() {
    ////console.log('page.name SmakeAccount');
    ////console.log('*** INIT SmakeAccount')
    sessionStorage.setItem('showalert', 1);
    ////console.log('showalert = 1');
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json",
        function(languageSpecificObject) {
            myApp.showPreloader(languageSpecificObject.languageSpecifications[
                0]['createUID']);
            var postData = {
                server: localStorage.getItem('server'),
                myAppapp: localStorage.getItem('myAppapp')
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
                    ////console.log('ECHO DATA');
                    console.log(responseData);
                    myApp.formFromJSON('#makeAccount', responseData);
                    ////console.log('show stored data' + responseData);
                    myApp.hidePreloader();
                },
                error: function(responseData, textStatus,
                    errorThrown) {
                    ////console.log('something went wrong!! Error: '+textStatus);
                    myApp.hidePreloader();
                    myApp.alert(
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
myApp.onPageInit('SmyContactList', function(page) {
    sessionStorage.setItem('showalert', 1);
    ////console.log('showalert = 1');
    var uid = localStorage.getItem('UID');
    app.selectAllRecords = function(fn) {
        app.db.transaction(function(tx) {
            ////console.log('selectUIDLinks');
            tx.executeSql(selectUIDLinks, [uid], fn,
                onError);
        });
    };
    // function getAllTheData() {
    var render = function(tx, rs) {
        // ////console.log('-----------------------------------'); 
        // console.log(rs.rows.length); 
        // ////console.log('-----------------------------------'); 
        var uid = localStorage.getItem('UID');
        for (var i = 0; i < rs.rows.length; i++) {
            //console.log(rs.rows.item(i));
        }
        if (rs.rows.length) {
            //////console.log('RECORD EXIST');
            contactlistTemplate = $$('#Mycontactlist-template').html();
            var Mycontactlisthtml = '';
            //////console.log('2 RECORD EXIST');
            for (var i = 0; i < rs.rows.length; i++) {
                ////console.log('RECORD HAVE VAR');
                var MycontactItem = rs.rows.item(i);
                //////console.log('MycontactItem = ' +rs.rows.item(i));
                //console.log(MycontactItem);
                // edit lastseen view
                Mycontactlisthtml += contactlistTemplate.replace(
                    /{{my_uid}}/g, MycontactItem.my_uid).replace(
                    /{{his_uid}}/g, MycontactItem.his_uid).replace(
                    /{{his_nick}}/g, MycontactItem.his_nick).replace(
                    /{{his_server}}/g, MycontactItem.his_server
                );
            }
            //////console.log('Mycontactlisthtml = ' +Mycontactlisthtml );
            $$('.Mycontactlist').html(Mycontactlisthtml);
        }
    }
    app.selectAllRecords(render);
});
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('SpidEdit', function(page) {
    // if (page.name === 'SpidEdit') {
    ////console.log('page.name SpidEdit');
    localStorage.setItem('showalert', 0);
    ////console.log('showalert = 1');
    ////console.log('SpidEdit INIT');
    var his_uid = page.query.his_uid;
    var his_nick = page.query.his_nick;
    //var lhis_uid = page.query.lhis_uid;
    console.log(his_uid);
    sessionStorage.setItem('pidtolink', his_uid);
    sessionStorage.setItem('his_uid', his_uid);
    sessionStorage.setItem('his_nick', his_nick);
    //console.log(lhis_uid);
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json",
        function(languageSpecificObject) {
            myApp.showPreloader(languageSpecificObject.languageSpecifications[0]['loading']);
            $$.ajax({
                method: 'POST',
                dataType: 'json',
                url: localStorage.getItem('connection') +'/appie/php/' + localStorage.getItem('myAppapp') + '/CpidEdit.php?',
                crossDomain: true,
                data: {
                    his_uid: his_uid
                },
                success: function(data) {
                    ////console.log('ECHO DATA');
                    console.log(data);
                    myApp.formFromJSON('#pidedit', data);
                    ////console.log('show stored data');
                    //myApp.hidePreloader();
                }
            });
            ////console.log('Load CLinkList.php');
            $$.ajax({
                method: 'POST',
                dataType: 'jsonp',
                url: localStorage.getItem('connection') +'/appie/php/' + localStorage.getItem('myAppapp') +'/CLinkList.php?callback=?',
                crossDomain: true,
                data: {
                    his_uid: his_uid
                },
                success: function(data) {
                    //////console.log('ECHO DATA');
                    console.log(data);
                    // myApp.formFromJSON('#pidedit', data);
                    //////console.log('show stored data');
                    myApp.hidePreloader();
                    $$('.LINKS').html(data);
                }
            });
            //myApp.hidePreloader();
        });
    // pidedit update
    $$('.form-to-json').on('click', function() {
        //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
        // myApp.showPreloader(localStorage.getItem('updating'));
        ////console.log('PIDUPDATE');
        var formData = myApp.formToJSON('#pidedit');
        // myApp.alert(JSON.stringify(formData));
        console.log(formData);
        // send data to server
        $$.ajax({
            method: 'POST',
            dataType: 'jsonp',
            url: localStorage.getItem('connection') +'/appie/php/' + localStorage.getItem('myAppapp') + '/CpidUpdate.php?',
            crossDomain: true,
            data: formData,
            success: function(responseData, textStatus,errorThrown) {
                ////console.log('ECHO DATA');
                console.log(responseData);
                settingsview.loadPage(
                    'frames/settings/mysettings/SpidList.html'
                );
            },
            error: function(responseData, textStatus,errorThrown) {
                ////console.log('something went wrong!! Error: ' +textStatus);
                myApp.hidePreloader();
                myApp.alert('Error. please try again.',
                    function() {PushErrorToSupport(errorThrown);
                    });
            }
        }); //end ajax
        //});
    }); //end pidupdate
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************

//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('contactrequest', function() {
    // if (page.name === 'Smessagelist') {
    ////console.log('page.name contactadd');
    myApp.showTab('#settingsview');
}); // end page.name

//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
// myApp.onPageInit('contactadd', function() {
myApp.onPageBeforeAnimation('contactrequest', function(page) {
    // if (page.name === 'contactadd') {
    ////console.log('page.name contactadd');
    ////console.log('!! STOP LOOP');
    clearTimeout(loop);

    var uid = localStorage.getItem('UID');
    // var his_uidscan = sessionStorage.getItem('QRscanUID');
    // var server = localStorage.getItem('server');

    //var data = {"id":"151","his_uid":"SVFDZAJMTN","his_nick":"PEM MARCO","his_server":"1001","time_request":"2015-10-12 02:07:44","secret_key":"Phone"};

    // var data2 = sessionStorage.getItem('f7form-contactRequest');

    var jsonObject = new Function('return ' + sessionStorage.getItem('f7form-contactRequest'))();

    // {"id":"162","his_uid":"JTYQ6KJERN","his_nick":"sim","his_server":"1001","time_request":"2015-10-14 23:04:53","secret_key":""}

    // code secret_key
    var idstatus = jsonObject.idstatus;

    //console.log('status: ',idstatus);

    var tempkey = jsonObject.secret_key;

    console.log(tempkey);
    // var tempkey =jsonObject.secret_key.toLowerCase();


    var cryptedKey = sjcl.decrypt(uid, tempkey);

    console.log(cryptedKey);


    var data = {
        id: jsonObject.id,
        his_uid: jsonObject.his_uid,
        his_nick: jsonObject.his_nick,
        his_server: jsonObject.his_server,
        time_request: jsonObject.time_request,
        secret_key: cryptedKey
    };

    myApp.formFromJSON('#contactrequest', data);


    $$('.refused').on('click', function() {
        //console.log('refused clicked ');

        $$.post(localStorage.getItem('connection') +
            '/appie/php/include/Ccontactcheckreturn.php?uid=' +
            localStorage.getItem('UID') + '&myAppapp=' + localStorage.getItem('myAppapp') + '&action=no&id=' + jsonObject.id,
            function(data) {
                //console.log('++ refused actions =' + data);
            });

        myApp.hidePreloader();

        sessionStorage.removeItem('f7form-contactRequest');

$('.messagessearchbar.searchbar').show();  
$('.messagessearchbar.invitation-overlay').hide();      

        // var contactrequestHTML = '<div class="searchbar-input">' +
        //     '<input type="search"  data-text="search" class="languageSpecificPlaceholder" placeholder="Search">' +
        //     '<a href="#" class="searchbar-clear"></a></div>' +
        //     '<a href="#" class="searchbar-cancel"><div><i class="icons_searchcancel"></i></div></a>';

        // $$('.searchbar').html(contactrequestHTML);




        settingsview.router.back({
            url: 'frames/settings/index.html',
            force: true
        });

    });



    $$('.accept').on('click', function() {
        //console.log('accept clicked');

        myApp.showIndicator();

        var formData = myApp.formToJSON('#contactrequest');

        //console.log('formData = ' + formData);
        console.log(formData);

        // {"his_uid":"P1HYLBXYLT","his_nick":"Mb","secret_key":"test","REMEMBER_SECRET_KEY":[],"server":""}

        var fhis_uid = formData.his_uid;
        var fhis_nick = formData.his_nick;
        var fhis_server = formData.his_server;

        var fsecret_key = formData.secret_key;

        var fmy_uid = formData.my_uid;
        var fmy_nick = formData.my_nick;

        var fStorePrivateKey = JSON.stringify(formData.REMEMBER_SECRET_KEY);

        var tempkey = fsecret_key.toLowerCase();
        //console.log('tempkey: ',tempkey);

        var cryptedKeyStore = calcMD5(tempkey);
        //console.log('cryptedKeyStore: ',cryptedKeyStore);

        var testonline = "2015-06-01 17:05:47";
        
        var keyStore = '1';

        if(fStorePrivateKey !== '["on"]') { 
            cryptedKeyStore = ''; 
            keyStore = '';
        }


        $$.post(localStorage.getItem('connection') +
            '/appie/php/include/Ccontactcheckreturn.php?uid=' +
            localStorage.getItem('UID') + '&myAppapp=' +
            localStorage.getItem('myAppapp') + '&my_server=' +
            localStorage.getItem('server') +
            '&my_nick=' + fmy_nick + '&action=oke&id=' +jsonObject.id,

            function(data) {

                //console.log('===================================');

                //console.log('++ accept actions =' + data);

                //console.log('===================================');

                app.db.transaction(function(tx) {
                    //console.log('contactadd insert CONTACT A ');

                    // (my_uid,his_uid,his_nick,his_server,autocrypt,autocryptkey,online) VALUES (?,?,?,?,?,?,?)";

                    var data = [localStorage.getItem('UID'), fhis_uid, fhis_nick, fhis_server, keyStore, cryptedKeyStore, testonline];

                    console.log(data);

                    tx.executeSql(insertSupportUID, data, onInsertSuccess, onError);

                });

                myApp.hideIndicator();


                syncUILinks();


                myApp.modal({
                    text: 'CONTACT ADD TO LIST',
                    verticalButtons: true,
                    buttons: [{
                        text: localStorage.getItem('OKE'),
                        onClick: function() {
                            
                $('.messagessearchbar').show();
                $('.messagesinvitation').hide();

                            makeNewContactList();

                            myApp.showTab('#contactsview');

                            contactsview.router.refreshPage();


                            setTimeout(function() {

                                settingsview.router.back({
                                    url: 'frames/settings/index.html',
                                    animatePages: false,
                                    reload: true
                                });

                            }, 400);

                            // settingsview.router.back({url:'frames/settings/index.html',force:true});

                        }
                    }, ]
                });
            });
    });


}); // end page.name


//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('contactadd', function() {
    // if (page.name === 'Smessagelist') {
    //console.log('page.name contactadd');

myApp.showTab('#settingsview');

if(localStorage.getItem('contactallowed') === 'no') {
    //console.log('contactallowed:no');

setTimeout(function(){ 
          myApp.modal({
            title: 'PEM ' + localStorage.getItem('myAppapp'),
            text: 'Your '+ localStorage.getItem('myAppapp')+  ' license accept '+ localStorage.getItem('maxlink') + ' contact.<BR>For Unlimitation PEM buy a license anonymous and secure<BR> with Bitcoins on <BR> http://pem.world ',
            buttons: [{
                text: localStorage.getItem('OKE'),
                onClick: function() {

settingsview.router.back({url:'frames/settings/index.html',force:true});


                }
            }]
        });
},1000);
}




}); // end page.name

//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
// myApp.onPageInit('contactadd', function() {
myApp.onPageBeforeAnimation('contactadd', function(page) {
    // if (page.name === 'contactadd') {
    ////console.log('page.name contactadd');
    ////console.log('!! STOP LOOP');
    clearTimeout(loop);

    var uid = localStorage.getItem('UID');
    var his_uidscan = sessionStorage.getItem('QRscanUID');
    var server = localStorage.getItem('server');
    var his_nick;

    // && sessionStorage.getItem('QRscanNICK') !== null && sessionStorage.getItem('QRscanNICK') !== undefined ; 


    if(sessionStorage.getItem('QRscanNICK')) 
    {   var his_nick = sessionStorage.getItem('QRscanNICK'); }




    var data = {
        my_uid: uid,
        server: server,
        his_uid: his_uidscan,
        his_nick: his_nick
    };

    myApp.formFromJSON('#contactadd', data);


    $$('.form-to-json').on('click', function() {


        myApp.showIndicator();


        //console.log('form-to-json');
        document.activeElement.blur();


        var formData = myApp.formToJSON('#contactadd');
        // alert(JSON.stringify(formData));
        //console.log('formData = ' + formData);
        console.log(formData);


        var fhis_uid = formData.his_uid;
        var fhis_nick = formData.his_nick;

        var fsecret_key = formData.secret_key;
        
        var fmy_uid = formData.my_uid;
        var fmy_nick = formData.my_nick;

        var fStorePrivateKey = JSON.stringify(formData.REMEMBER_SECRET_KEY);


        // console.log(fhis_uid);
        // console.log(fhis_nick);
        // console.log(fsecret_key);
        // console.log(fmy_uid);
        //console.log('fStorePrivateKey: ',fStorePrivateKey);



        // his_uid UPPERCASE

        var fhis_uid = fhis_uid.toUpperCase();

        // code secret_key
        var tempkey = fsecret_key.toLowerCase();
//console.log('tempkey: ',tempkey);
        var cryptedKey = sjcl.encrypt(fhis_uid, tempkey);

        var cryptedKeyStore = calcMD5(tempkey);
//console.log('cryptedKeyStore: ',cryptedKeyStore);

        console.log(cryptedKeyStore);

        var data = {
            "his_uid": fhis_uid,
            "his_nick": fhis_nick,
            "secret_key": cryptedKey,
            "my_uid": fmy_uid,
            "my_nick": fmy_nick,
            "server": "1001"
        };

        var testonline = "2015-06-01 17:05:47";
        var keyStore = '1';

        if(fStorePrivateKey !== '["on"]') { 
            cryptedKeyStore = ''; 
            keyStore = '';
        }


        //console.log('data = ' + data);


        if (fhis_uid === '' || fhis_nick === '' || fsecret_key === '') {


            //console.log('All field required.');

            myApp.alert('ALL FIELD REQUIRED.');

            myApp.hideIndicator();
        }

        // {"his_uid":"","his_nick":"","note":"","uid":"LYL8W6HQ9T","server":"1001"}

        else

        {



            $$.ajax({
                method: 'POST',
                dataType: 'jsonp',
                url: localStorage.getItem('connection') + '/appie/php/include/Ccontactadd.php?',
                crossDomain: true,
                data: data,
                success: function(responseData, textStatus, jqXHR) {
                    console.log(responseData);
                    var jsonObject = new Function('return ' + responseData)();
                    console.log(jsonObject);
                    console.log(jsonObject.contactfound);
                    console.log(jsonObject.msg);
                    // myApp.alert(jsonObject.id);//     does nothing
                    if (jsonObject.contactfound === '1') {
                        // set sessionStorage.login
                        // sessionStorage.setItem("login", jsonObject.id);
                        // sessionStorage.setItem("pid", jsonObject.id);
                        // sessionStorage.login = jsonObject.id;
                        // myApp.alert('SESSION Login: ' + localStorage.getItem("pid")); 
                        myApp.hideIndicator();
                        console.log(jsonObject.msg);

                        app.db.transaction(function(tx) {
                            //console.log('contactadd insert CONTACT B');

                            // (my_uid,his_uid,his_nick,his_server,autocrypt,autocryptkey,online) VALUES (?,?,?,?,?,?,?)";

                            var data = [localStorage.getItem('UID'), fhis_uid, fhis_nick, '0000', keyStore, cryptedKeyStore, testonline];

                            console.log(data);

                            tx.executeSql(insertSupportUID, data, onInsertSuccess, onError);

                        });

                        syncUILinks();


                        myApp.modal({
                            text: jsonObject.msg,
                            verticalButtons: true,
                            buttons: [{
                                text: localStorage.getItem('OKE'),
                                onClick: function() {

                                    makeNewContactList();

                                    myApp.showTab('#contactsview');

                                    contactsview.router.refreshPage();

                                    setTimeout(function() {

                                        settingsview.router.back({
                                            url: 'frames/settings/index.html',
                                            animatePages: false,
                                            reload: true
                                        });

                                    }, 600);

                                    // settingsview.router.back({url:'frames/settings/index.html',force:true});

                                }
                            }, ]
                        });




                    } 

                    else

                    {
                        console.log(jsonObject.msg);


                        app.db.transaction(function(tx) {
                            //console.log('contactadd insert CONTACT C');

                            var data = [localStorage.getItem('UID'), fhis_uid, fhis_nick, '0000', keyStore, cryptedKeyStore, testonline];

                            console.log(data);

                            tx.executeSql(insertSupportUID, data, onInsertSuccess, onError);
                        });

                        syncUILinks();

                        myApp.modal({
                            text: jsonObject.msg,
                            verticalButtons: true,
                            buttons: [{
                                text: localStorage.getItem('OKE'),
                                onClick: function() {


                                    makeNewContactList();

                                    myApp.showTab('#contactsview');

                                    contactsview.router.refreshPage();


                                    setTimeout(function() {

                                        settingsview.router.back({
                                            url: 'frames/settings/index.html',
                                            animatePages: false,
                                            reload: true
                                        });

                                    }, 600);

                                    // settingsview.router.back({url:'frames/settings/index.html',force:true});

                                }
                            }, ]
                        });


                        // myApp.hideIndicator();
                        // settingsview.loadPage('frames/settings/mysettings/contactadd.html');
                    }
                },
                error: function(responseData, textStatus, errorThrown) {
                    ////console.log('something went wrong!! Error: ' +textStatus);
                    myApp.hidePreloader();
                    myApp.alert('Error. please try again.', function() {
                        PushErrorToSupport(errorThrown);
                    });
                }
            }); // end ajax

        }

    });



    $$('.AddTestAccount').on('click', function() {

        //console.log('Add Test Contact');

        $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
            "/strings.json",
            function(languageSpecificObject) {
                ////console.log('Add TEST contact');

                app.db.transaction(function(tx) {
                    ////console.log('insertTestUID ');

                    var testonline = "2015-06-01 17:05:47";

                    tx.executeSql(insertSupportUID, [
                        localStorage.getItem('UID'),
                        localStorage.getItem('testUID'), localStorage.getItem('testNick'),
                        localStorage.getItem('testserver'), '0', '0', testonline], onInsertSuccess, onError);
                });

                var posturl =
                    localStorage.getItem('connection') + '/appie/php/include/JsonInsertUIDLinks.php?myAppapp=' +
                    localStorage.getItem('myAppapp') +
                    '&my_server=' + localStorage.getItem('server') + '&my_uid=' +
                    localStorage.getItem('UID') +
                    '&my_nick=' + localStorage.getItem('UID') + '&his_uid=' + localStorage.getItem('testUID') + '&his_server=' +
                    localStorage.getItem('testserver') + '&his_nick=' +localStorage.getItem('testNick');

                console.log(posturl);

                $$.post(posturl, function(data) {
                    //console.log('**************************************');
                    //console.log('POST RESPONSE TEST ROBOT INSERTED');
                    console.log(data);
                    //console.log('**************************************');

                    syncUILinks();
                    makeNewContactList();

                    SQLiteUpdateMessagesTotal();
                    // myApp.alert(languageSpecificObject.languageSpecifications[0]['testaccountadded']);



                    myApp.modal({
                        text: data,
                        verticalButtons: true,
                        buttons: [{
                            text: localStorage.getItem('OKE'),
                            onClick: function() {
                        
                                myApp.showTab('#contactsview');

                                contactsview.router.refreshPage();

                                    setTimeout(function() {

                                        settingsview.router.back({
                                            url: 'frames/settings/index.html',
                                            animatePages: false,
                                            reload: true
                                        });

                                    }, 400);

                                // settingsview.router.back({url:'frames/settings/index.html',force:true});
                            }
                        }, ]
                    });


                });

            });
    });
}); // end page.name




//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('Sbugreport', function() {
    // if (page.name === 'Sbugreport') {
    ////console.log('page.name Sbugreport');
    myApp.showTab('#settingsview');
    var uid = localStorage.getItem('UID');
    var server = localStorage.getItem('server');
    var version = localStorage.getItem('myAppapp');
    var build = localStorage.getItem('myAppversion');
    var data = {
        uid: uid,
        server: server,
        version: version,
        build: build
    };
    myApp.formFromJSON('#bugreport-form', data);
    $$('.form-to-json').on('click', function() {
        myApp.showIndicator();
        ////console.log('form-to-json');
        document.activeElement.blur();
        var formData = myApp.formToJSON('#bugreport-form');
        // myApp.alert(JSON.stringify(formData));
        console.log(formData);
        $$.ajax({
            method: 'POST',
            dataType: 'jsonp',
            url: localStorage.getItem('connection') + '/appie/php/include/reportbug.php?',
            crossDomain: true,
            data: formData,
            success: function(responseData, textStatus,jqXHR) {
                console.log(responseData);
                var jsonObject = new Function('return ' + responseData)();
                console.log(jsonObject);
                myApp.hideIndicator();
                // console.log(jsonObject.msg);
                myApp.alert(jsonObject.msg); //contactview.loadPage("frames/settings/index.html")       
                //contactview.loadPage("Smessages.html") 
                // } else {
                // console.log(jsonObject.msg);
                // myApp.alert(jsonObject.msg);
                // myApp.hideIndicator();
                // contactview.loadPage('frames/settings/mysettings/contactadd.html');
                // }
            },
            error: function(responseData, textStatus,errorThrown) {
                ////console.log('something went wrong!! Error: ' +textStatus);
                myApp.hidePreloader();
                myApp.alert('Error. please try again.',function() {PushErrorToSupport(errorThrown);});
            }
        });
        // myApp.alert('Thank you..');
    });
}); // end page.name
//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('SmyContactEdit', function(page) {
    // if (page.name === 'SmyContactEdit') {

    localStorage.setItem('showalert', 0);
    ////console.log('showalert = 1');
    ////console.log('SmyContactEdit INIT');
    var his_uid = page.query.his_uid;
    var his_nick = page.query.his_nick;
    var uid = localStorage.getItem('UID');
    ////console.log('*******************************************');
    console.log(his_uid);
    console.log(his_nick);
    console.log(uid);

    myApp.formFromJSON('#pidedit', {
        uid: localStorage.getItem('UID'),
        his_uid: his_uid,
        his_nick: his_nick
    });

    $$('.form-to-json').on('click', function() {
        ////console.log('PIDUPDATE');
        var formData = myApp.formToJSON('#pidedit');
        // myApp.alert(JSON.stringify(formData));
        console.log(formData);
        // send data to server\\
        var ihis_nick = formData.his_nick;
        var ihis_uid = formData.his_uid;
        app.db.transaction(function(tx) {
            //////console.log('updateHisNick');
            tx.executeSql(updateHisNick, [ihis_nick, ihis_uid], onUpdateSuccess, onError);
            myApp.alert('Updated.');

            syncUILinks();

            makeNewContactList();

        });
    }); //end pidupdate

}); // end page.name


//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('Sserver', function() {
    var server = localStorage.getItem('server');
    console.log(server);
    myApp.formFromJSON('#server', {
        server: server
    });
    $$('.form-to-json').on('click', function() {
        //ask are y sure to change
        myApp.modal({
            title: 'Are you sure?',
            text: 'If you change the Premium Private Server is pasable you cannot send or receive messages.',
            buttons: [{
                text: 'CANCEL',
                onClick: function() {
                    //myApp.alert('You clicked first button!')
                }
            }, {
                text: 'It\'s' + localStorage.getItem('OKE'),
                onClick: function() {
                    var formData = myApp.formToJSON('#server');
                    console.log(formData.server);
                    localStorage.setItem('server', formData.server);
                }
            }, ]
        });
    });
});


//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('settings-language', function() {
    //console.log('page.name settings-language');
});

//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('settings-containers', function() {
    ////console.log('page.name settings-containers');
    console.log(myApp.formGetData('settings-containers'));
    console.log(myApp.formGetData('containers'));

});