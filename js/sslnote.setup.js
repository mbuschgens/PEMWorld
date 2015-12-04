//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setup-haveuid', function() {
    console.log('page.name setup-haveuid :');
    sslnote.hidePreloader();
    // setupview.hideNavbar();
    setupview.showNavbar();

$(".statusbar-overlay").css("background-color","#212121");

    // localStorage.setItem('f7form-settings-pushnotification',
    //     '{"pushreceived":["on"],"pushread":["on"],"pushwipe":["on"]}');


    // localStorage.setItem('f7form-settingsscreenprotect',
    //     '{"screenprotect":"3"}');

    // localStorage.setItem('f7form-settings-keyboardclick',
    //     '{"keyboardclick":["on"]}');

    // localStorage.setItem('f7form-cLANGUAGE', 
    //     '{"cLANGUAGE":"en"}');


    localStorage.setItem('f7form-settings-logoff', 
        '{"AUTO_LOGON":[""],"autologoff":"3 Minuts"}');
    

    localStorage.setItem('f7form-settings-shake',
        '{"shakeon":["on"],"shakesensitivity":"30"}');
    

    localStorage.setItem('f7form-settings-notification',
        '{"NOTIFICATION":["on"],"PUSH_RECEIVED":["on"],"PUSH_DELIVERD":["on"],"PUSH_READ":["on"],"PUSH_WIPED":["on"],"PUSH_CONTACTS_INVITE":["on"]}');

    localStorage.setItem('f7form-settings-notification-sound',
        '{"uid":"","sound":"1.m4a","volume":"50"}');
    

    localStorage.setItem('f7form-settings-containers',
        '{"my-container":["RUSSIA","PANAMA","CHINA","EU"]}');


    // localStorage.setItem('showMessageStatus','{"show":["10","20","30","50","40"]}');
    localStorage.setItem('showMessageStatus','{"show":[""]}');
    localStorage.setItem('showalert', 0);
    document.activeElement.blur();

    if (!localStorage.getItem('token')) {
        localStorage.setItem('token', 'NO-TOKEN');
    }


    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            // languageSpecificObject.languageSpecifications[0]['passwordcannotbeempty']
            sslnote.showPreloader(languageSpecificObject.languageSpecifications[0]['nosettingsfound']);
            //console.log('Generate UID');
    });

    console.log('Do AJAX');
    console.log('sslnoteapp: '+localStorage.getItem('sslnoteapp'));
    console.log('token: '+ localStorage.getItem('token'));
    console.log('device: '+localStorage.getItem('device'));
    console.log('cLANGUAGE: '+localStorage.getItem('cLANGUAGE'));
        console.log('connection: '+localStorage.getItem('connection'));


    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: localStorage.getItem('connection') + '/appie/php/Csslnoteapp.php?callback=?',
        crossDomain: true,
        data: {
            sslnoteapp: localStorage.getItem('sslnoteapp'),
            token: localStorage.getItem('token'),
            device: localStorage.getItem('device'),
            cLANGUAGE: localStorage.getItem('cLANGUAGE')
        },
        success: function(responseData, textStatus, jqXHR) {
            console.log('Connect to = ' +localStorage.getItem('connection'));
            console.log(responseData, textStatus, jqXHR);

            if (responseData.indexOf('Error') >= 0) {
            console.log('Error');

            sslnote.closeModal();

                    if(localStorage.development == 'yes') {

                    sslnote.alert('Sorry some Error, <BR>' +responseData);

                    }
                    else
                    {
                    sslnote.alert('Sorry main System Error, <BR>Pleasde try again later.<BR>', 'PEM Error!', function () {
                            window.location.reload();
                    });
                    }
            }

            else
            
            {

            console.log('NO Error');

            localStorage.removeItem('repeatsound');

            var a = JSON.parse(responseData);

            localStorage.setItem('UID', a.uid);

            var account_id = 'off';

            // sessionStorage.setItem('reactivatecode', a.reactivatecode);
            // localStorage.setItem('sound', a.sound);
            // localStorage.setItem('volume', a.volume);
            // localStorage.setItem('repeatpush', a.repeatpush);
            // localStorage.setItem('server', a.server);


            sslnote.hideIndicator();
            sslnote.hidePreloader();



  var modalMainPassword = sslnote.modal({
            // title: 'PASSWORD',

                text: '<form id="setpincode">' +

                '  <div class="list-block">' +

                   '<span class="">YOUR UID</span>'+  
                              
                '        <div class="loginboxPopup">' +
                '               <div class="item-inner">' +
                '                <div class="item-input">' +

                // '  <span class="yourpid"></span>' +

        '<div class="group">' +


        '  <input id="uid" class="" style="text-transform:uppercase" type="text" name="uid" required placeholder="">' +

        '  <span class="highlight"></span>' +

        '  <span class="bar"></span>' +
        '</div>' +


                // '<div class="loginfailsbadge badge badge-green"></div>'+ 
                // '                             </center>'+

                '                           </div>' +
                '                         </div>' +
                '                 </div>' +
                '        </div>' +


'<span class="">YOUR PINCODE</span>'+

                '        <div class="pincodePopup">' +

'<input id="1" oninput="moveOnMax(this,\'a\')" class="pincode" type="tel" name="pincode1" required maxlength="1">' +
'<input id="a" oninput="moveOnMax(this,\'b\')" class="pincode" type="tel" name="pincode2" required maxlength="1">' +
'<input id="b" oninput="moveOnMax(this,\'c\')" class="pincode" type="tel" name="pincode3" required maxlength="1">' +
'<input id="c" class="pincode" type="tel" name="pincode4" required maxlength="1">' +

'<div class="passwordCheckAlert"></div>' +


                '        </div>' +
                '</form>',



            buttons: [{

                text: 'BACK',
                onClick: function() {
                setupview.router.back({url:'frames/setup/setupintro.html' ,force:true});

                }

        } ,

        {
                text: 'CHECK',
                close: false,
                onClick: function() {
                    console.log('CHECK');

                var formData = sslnote.formToJSON('#setpincode');

                var uid = formData.uid;

                var pincode = formData.pincode1+formData.pincode2+formData.pincode3+formData.pincode4;

                // console.log('uid: ',uid);
                // console.log('pincode: ',pincode);


                var stopscript = 'no';

                if (uid === '') {

                    if(!localStorage.getItem('UID') ) {
                        //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                        console.log('passwordCheckAlert EMPTY : ');
                        $$('.passwordCheckAlert').text('UID CANNOT BE EMPTY');
                        var stopscript = 'yes';
                    }
                    else
                    {
                        var uid = localStorage.getItem('UID');
                    }

                }

                // console.log('uid: ',uid);
                // console.log('pincode: ',pincode);


                if (pincode.length !== 4) {
                    //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                    console.log('passwordCheckAlert EMPTY : ');
                    $$('.passwordCheckAlert').text('PINCODE NOT OKE');
                    var stopscript = 'yes';
                }




                if (uid !== '') {
                    //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                    console.log('passwordCheckAlert INPUT : ');
                
                }



                if (stopscript == 'no') {

                   if (uid !== '' && pincode !== '') {

                    $$('.passwordCheckAlert').text('...CHECKING INPUT...');

                    // console.log('CHECK uid: ',uid);
                    // console.log('CHECK pincode: ',pincode);

                    var MD5pincode = calcMD5(pincode);
                    //console.log('CHECK MD5pincode: ',MD5pincode);

    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: localStorage.getItem('connection') + '/appie/php/include/JsonCheckUID.php?callback=?',
        crossDomain: true,
        data: {
            uid: uid,
            token: localStorage.getItem('token'),
            device: localStorage.getItem('device'),
            MD5pincode: MD5pincode,
        },
        success: function(responseData, textStatus, jqXHR) {
            console.log('Connect to = ' +localStorage.getItem('connection'));

            console.log(responseData, textStatus, jqXHR);


            var a = JSON.parse(responseData);

            var uidExist = a.exist;
            var msg = a.msg;


if(uidExist === '1') { 

        localStorage.setItem('uidExist',uidExist);
        localStorage.setItem('UID',uid);

        // $$('.passwordCheckAlert').text('...INPUT OKE...');

window.plugins.toast.show('...INPUT OKE...', 'short', 'center');

        setTimeout(function(){

            console.log('setupview LOADING frames/setup/setup-setpass.html');
            setupview.loadPage('frames/setup/setup-setpass.html' );

        },1000);

}

else

{

$$('.passwordCheckAlert').text(msg);


}

        },
        error: function(responseData, textStatus, errorThrown) {
            console.log("something went wrong!! Error: " ,responseData,textStatus,errorThrown);
            sslnote.hidePreloader();
            sslnote.alert('Error. please try again.',
                function() {


setupview.router.back({url:'frames/setup/setupintro.html'});

PushErrorToSupport(errorThrown);

                });
        },
        complete: function(responseData, textStatus, errorThrown) {
            console.log("complete: " +textStatus);
            //sslnote.hidePreloader();

        }
});


                    } // end if pass the same
                } //end is stoptscript

            }
        }, ]
    });

  //          $$('.yourpid').html('<center>'+localStorage.getItem('UID')+'</center>');

$$("#uid").attr("placeholder", localStorage.getItem('UID'));



} // end else

        },
        error: function(responseData, textStatus, errorThrown) {
            console.log("something went wrong!! Error: " +textStatus);
            sslnote.hidePreloader();
            sslnote.alert('Error. please try again.',
                function() {PushErrorToSupport(errorThrown);});
        },
        complete: function(responseData, textStatus, errorThrown) {
            console.log("complete: " +textStatus);
            //sslnote.hidePreloader();

        }
});

}); // end page.name

//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setupintro', function() {
    sslnote.closeModal();
    setupview.hideNavbar();
    sslnote.hideToolbar('.tabbar');
    sslnote.showTab('#setupview');


// setup busy

sessionStorage.setItem('setupBusy','1');


$(".statusbar-overlay").css("background-color","#000000");

    localStorage.setItem('showalert', 0);

    document.activeElement.blur();

    console.log('language = ' + localStorage.getItem( 'cLANGUAGE'));

    // // activate button
    $$('.create-new-uid').on('click', function() {
        sslnote.hideIndicator();
        //console.log('LOADING frames/setup/setup-setpass.html');

        localStorage.removeItem('UID');

        console.log('UID localStorage.clear()');

        setupview.loadPage('frames/setup/setup-setpass.html');
        sslnote.hidePreloader();

    }); // end activate button


    $$('.ihaveauid').on('click', function() {
        sslnote.hideIndicator();
        sslnote.hidePreloader();
        //console.log('+++ ihaveaaccount +++');
        setupview.loadPage('frames/setup/setup-haveuid.html');
    });


    $$('.ialreadyacivate').on('click', function() {
        sslnote.hideIndicator();
        sslnote.hidePreloader();
        //console.log('+++ ialreadyacivate +++');
        sslnote.closeModal();
        contactview.router.load({
            url: 'frames/login.html',
            animatePages: false
        });
    });


    $$('.toIndex').on('click', function() { 

        // sslnote.loginScreen();

        window.location.reload();

                })

    $$('.ihavelicensekey').on('click', function() {
        sslnote.hideIndicator();
        sslnote.hidePreloader();
        //console.log('+++ ihavelicencekey +++');
        $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
            "/strings.json", function(languageSpecificObject) {
                //languageSpecificObject.languageSpecifications[0]['crypting'],  



                sslnote.prompt(languageSpecificObject.languageSpecifications[0]['whatisyourlicensekey'],
                    function(value) {
                        // check licence key https://sslnote.com/appie/php/include/JsonInsertUIDLinks.php?sslnoteapp='
                        sslnote.showIndicator();

                        var templic = '7PH3E4ENB7';
                        $$.getJSON(localStorage.getItem('connection') + "/appie/php/include/JsonLicenseKey.php?licensekey=" +
                            templic, function(response) {
                                console.log(response);
                                //sslnote.alert('response = ' + response['id'] );
                                //sslnote.alert('response = ' + response[0]['id'] );
                                //sslnote.alert('response = ' + response);
                                if (response) {
                                    // sslnote.alert('response = ' + response['id'] );
                                    // do settings
                                    sslnote.hideIndicator();
                                    sslnote.modal({
                                        title: 'PEM',
                                        text: 'We found a ' + response['sslnoteapp'] +' license',
                                        buttons: [{
                                            text: languageSpecificObject.languageSpecifications[0]['cancel'],
                                            onClick: function() {
                                                // sslnote.closeModal();
                                            }
                                        }, {
                                            text: localStorage.getItem('oke'),
                                            onClick: function() {
                                                var accounts =response['accounts'];
                                                localStorage.setItem('totalaccounts',accounts);
                                                var server =response['server'];
                                                localStorage.setItem('server',server);
                                                var sslnoteapp =response['sslnoteapp'];
                                                localStorage.setItem('sslnoteapp',sslnoteapp);
                                                setupview.router.load({url: 'frames/setup/' +localStorage.getItem('sslnoteapp') +'.html'});
                                                //window.location.reload();
                                            }
                                        }, ]
                                    });
                                } else {
                                    sslnote.hideIndicator();
                                    sslnote.alert(languageSpecificObject.languageSpecifications[0]['licensedontexist']);
                                }
                            });
                    });
            });
    }); // end activate button
}); // end page.name


//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('firstsetuppremium', function() {
    console.log('page.name firstsetuppremium :');
    localStorage.setItem('showalert', 0);
    $$('.exitsetup').on('click', function() {
        //console.log('+++ exitsetup');
        //contactview.loadPage('index.html');
        sslnote.hideIndicator();
        // sslnote.closeModal('.popup-getting-started');
        sessionStorage.removeItem('counter');
        contactview.router.load({
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
            sslnote.alert('UID can not be empty.');
            error_uid = '1';
            //return;
            // oke close preloader
        }
        if (activationcode === undefined || activationcode ===
            null || activationcode === '') {
            sslnote.alert('CODE can not be empty.');
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
                        setupview.loadPage(
                            'frames/setup/setup-setpass.html'
                        );
                    } else {
                        sslnote.hidePreloader();
                        sslnote.alert(jsonObject.msg,
                            function() {
                                //contactview.loadPage("frames/setup/index.html")
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
                    sslnote.alert('Error. please try again.',
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
    // setupview.hideNavbar();
    setupview.showNavbar();

$(".statusbar-overlay").css("background-color","#212121");

    // localStorage.setItem('f7form-settings-pushnotification',
    //     '{"pushreceived":["on"],"pushread":["on"],"pushwipe":["on"]}');


    // localStorage.setItem('f7form-settingsscreenprotect',
    //     '{"screenprotect":"3"}');

    // localStorage.setItem('f7form-settings-keyboardclick',
    //     '{"keyboardclick":["on"]}');


    localStorage.setItem('f7form-settings-logoff', 
        '{"AUTO_LOGON":[""],"autologoff":"3 Minuts"}');
    

    localStorage.setItem('f7form-settings-shake',
        '{"shakeon":["on"],"shakesensitivity":"30"}');
    

    localStorage.setItem('f7form-settings-notification',
        '{"NOTIFICATION":["on"],"PUSH_RECEIVED":["on"],"PUSH_DELIVERD":["on"],"PUSH_READ":["on"],"PUSH_WIPED":["on"],"PUSH_CONTACTS_INVITE":["on"]}');

    localStorage.setItem('f7form-settings-notification-sound',
        '{"uid":"","sound":"1.m4a","volume":"50"}');
    

    localStorage.setItem('f7form-settings-containers',
        '{"my-container":["RUSSIA","PANAMA","CHINA","EU"]}');


    // localStorage.setItem('showMessageStatus','{"show":["10","20","30","50","40"]}');
    localStorage.setItem('showMessageStatus','{"show":[""]}');
    localStorage.setItem('showalert', 0);
    document.activeElement.blur();

    if (!localStorage.getItem('token')) {
        localStorage.setItem('token', 'NO-TOKEN');
    }


    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            // languageSpecificObject.languageSpecifications[0]['passwordcannotbeempty']
            sslnote.showPreloader(languageSpecificObject.languageSpecifications[0]['nosettingsfound']);
            //console.log('Generate UID');
    });

    console.log('Do AJAX');
    console.log('sslnoteapp: '+localStorage.getItem('sslnoteapp'));
    console.log('token: '+ localStorage.getItem('token'));
    console.log('device: '+localStorage.getItem('device'));
    console.log('cLANGUAGE: '+localStorage.getItem('cLANGUAGE'));


    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: localStorage.getItem('connection') + '/appie/php/CsslnoteappNew.php?callback=?',
        crossDomain: true,
        data: {
            uid: localStorage.getItem('UID'),
            sslnoteapp: localStorage.getItem('sslnoteapp'),
            token: localStorage.getItem('token'),
            device: localStorage.getItem('device'),
            cLANGUAGE: localStorage.getItem('cLANGUAGE')
        },
        success: function(responseData, textStatus, jqXHR) {
            console.log('Connect to = ' +localStorage.getItem('connection'));
            console.log(responseData, textStatus, jqXHR);

            if (responseData.indexOf('Error') >= 0) {
            console.log('Error');

            sslnote.closeModal();

                    if(localStorage.development == 'yes') {

                    sslnote.alert('Sorry some Error, <BR>' +responseData);

                    }
                    else
                    {
                    sslnote.alert('Sorry main System Error, <BR>Pleasde try again later.<BR>', 'PEM Error!', function () {
                            window.location.reload();
                            });
                    }
            }
            else
            {

            console.log('NO Error');

            localStorage.removeItem('repeatsound');

            var a = JSON.parse(responseData);
            localStorage.setItem('UID', a.uid);

            var account_id = 'off';

            //sessionStorage.setItem('reactivatecode', a.reactivatecode);
            localStorage.setItem('sound', a.sound);
            localStorage.setItem('volume', a.volume);
            localStorage.setItem('repeatpush', a.repeatpush);
            localStorage.setItem('server', a.server);

            sslnote.hideIndicator();
            sslnote.hidePreloader();


            app.db.transaction(function(tx) {
                //console.log('app.JSON to SQLite');     
                tx.executeSql('DROP TABLE IF EXISTS uid');

                tx.executeSql(createUID, [],onCreateSuccess, onError);

                tx.executeSql('DROP TABLE IF EXISTS uid_links');

                tx.executeSql(createUIDLinks, [], onCreateSuccess, onError);
                
                tx.executeSql('DROP TABLE IF EXISTS uid_messages_send');

                tx.executeSql(createUIDMessagesSend, [], onCreateSuccess, onError);
               
                tx.executeSql('DROP TABLE IF EXISTS uid_messages_receive'); //console.log('TABLE uid_messages_receive DROP');    
                
                tx.executeSql(createUIDMessagesReceive, [],onCreateSuccess, onError);

                tx.executeSql(insertUID, [a.uid, a.sslnoteapp,'',account_id, a.active, a.pass_reset, a.my_nick,a.settpass, a.logins, a.reactivatecode, a.sound,a.volume, a.repeatpush,a.device, a.maxlink, a.language,a.server,'1'], onInsertSuccess, onError);
            });

            //console.log('UPDATE CREATE PID  = ' + localStorage.getItem('UID'));
            $$('.yourpid').html('<center>YOUR UID : '+localStorage.getItem('UID')+'</center>');

            console.log('*** Fn importNewUIDLinks');

            importNewUIDLinks();



  var modalMainPassword = sslnote.modal({
            // title: 'PASSWORD',
            text: '<form id="setpass">' +

                '  <div class="list-block">' +
                '        <div class="loginboxPopup">' +
                '               <div class="item-inner">' +
                '                <div class="item-input">' +


                '<div class="group">' +

'<input id="password" oninput="checkPasswordInputRules(this.value)" class="" type="password" name="pass1" required>' +
                

'<span id="input_img" onClick="changeShowPassword(this.value)"> <i id="eye" class="icon-only showPassword"></i> </span>'+



                '  <span class="highlight"></span>' +
                '  <span class="bar"></span>' +
                '  <label>MAIN PASSWORD</label>' +

                '<div class="passwordCheckAlert"></div>' +
                '</div>' +


                // '<div class="loginfailsbadge badge badge-green"></div>'+ 
                // '                             </center>'+

                '                           </div>' +
                '                         </div>' +
                '                 </div>' +
                '        </div>' +
                '</form>',
            buttons: [{

                text: 'BACK',
                onClick: function() {
                setupview.router.back({url:'frames/setup/setupintro.html' ,force:true});

                }

        } ,
        {
                text: 'NEXT',
                close: false,
                onClick: function() {
                    console.log('next');

                var formData = sslnote.formToJSON('#setpass');
                var pass1 = formData.pass1;
                var pass1 = pass1.replace(/\s/g, '');
                var stopscript = 'no';

                if (pass1 === '') {
                    //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                    console.log('passwordCheckAlert EMPTY : ');
                    $$('.passwordCheckAlert').text(localStorage.getItem('passwordcannotbeempty'));
                    var stopscript = 'yes';
                }

                if (pass1 !== '') {
                    //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                    console.log('passwordCheckAlert INPUT : ');

                    var decimal =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;  


if(localStorage.checkStrongPassword === 'true'){

                    if(pass1.match(decimal))   
                                {   

                                    $$('.passwordCheckAlert').text('Oke, Strong enough.'); 
                                    $$('.passwordCheckAlert').css('color','green');

                                    var stopscript = 'no';
                                    }  
                                    else  
                                    {  

                                    $$('.passwordCheckAlert').text('Not strong enough.');  
                                    $$('.passwordCheckAlert').css('color','#f64f02');

                                    var stopscript = 'yes';
                                    }
                                }
}


                if (stopscript == 'no') {

                   if (pass1 !== '') {

                        var pass = calcMD5(pass1);
                        var uid = localStorage.getItem('UID');

                        sessionStorage.setItem('setupMainPassword', pass1);

                        document.activeElement.blur();
                        app.db.transaction(function(tx) {  
                        var mDate = new Date();
                            tx.executeSql("UPDATE uid SET pass = ?, active_last = ? WHERE uid = ?", [pass, mDate, uid], onInsertSuccess, onError);                                       
                        });
                        
                        sslnote.closeModal();

                        console.log('setupview LOADING frames/setup/setup-introexplanation.html');
                        setupview.loadPage('frames/setup/setup-introexplanation.html' );

                    } // end if pass the same
                } //end is stoptscript
            }
        }, ]
    });


} // end else

        },
        error: function(responseData, textStatus, errorThrown) {
            console.log("something went wrong!! Error: " +textStatus);
            sslnote.hidePreloader();
            sslnote.alert('Error. please try again.',
                function() {PushErrorToSupport(errorThrown);});
        },
        complete: function(responseData, textStatus, errorThrown) {
            console.log("complete: " +textStatus);
            //sslnote.hidePreloader();

        }
});

}); // end page.name



//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setup-setBurnPass', function() {
    console.log('page.name setup-setBurnPass :');
    sslnote.hidePreloader();
    localStorage.setItem('showalert', 0);
    document.activeElement.blur();

  var modalMainPassword = sslnote.modal({
            // title: 'PASSWORD',
            text: '<form id="setpass">' +

                '  <div class="list-block">' +
                '        <div class="loginboxPopup">' +
                '               <div class="item-inner">' +
                '                <div class="item-input">' +


                '<div class="group">' +
'  <input id="password" class="" type="text" name="pass1" required>' +

'<span id="input_img" onClick="changeShowPassword(this.value)"> <i id="eye" class="icon-only showPassword"></i> </span>'+


                '  <span class="highlight"></span>' +
                '  <span class="bar"></span>' +
                '  <label>BURN PASSWORD</label>' +

                '<div class="passwordCheckAlert"></div>' +
                '</div>' +


                // '<div class="loginfailsbadge badge badge-green"></div>'+ 
                // '                             </center>'+

                '                           </div>' +
                '                         </div>' +
                '                 </div>' +
                '        </div>' +
                '</form>',
            buttons: [{

                text: 'BACK',
                onClick: function() {
                setupview.router.back({url:'frames/setup/setup-settings-logoff.html' ,force:true});

                }

        } ,

        {
                text: 'NEXT',
                close: false,
                onClick: function() {
                    console.log('next');

                var formData = sslnote.formToJSON('#setpass');
                var pass1 = formData.pass1;
                var pass1 = pass1.replace(/\s/g, '');
                var stopscript = 'no';

                if (pass1 === '') {
                    //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                    console.log('passwordCheckAlert EMPTY : ');
                    $$('.passwordCheckAlert').text(localStorage.getItem('passwordcannotbeempty'));
                    var stopscript = 'yes';
                }

                if (pass1 !== '') {
                    //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                    console.log('passwordCheckAlert INPUT : ');
                    var decimal =  /^(?=.*\d)(?=.*[a-z])(?!.*\s).{8,15}$/;  

if(localStorage.checkStrongPassword === 'true'){

                if(pass1.match(decimal))   
                            {   

                                // $$('.passwordCheckAlert').text('Oke, Strong enough.');   
                                var stopscript = 'no';
                                }  
                                else  
                                {  

                                // $$('.passwordCheckAlert').text('Not strong enough.');  
                                // var stopscript = 'yes';
                                var stopscript = 'no';
                                }
                            }

}

                if (stopscript == 'no') {

                   if (pass1 !== '') {

                        var pass = calcMD5(pass1);
                        var uid = localStorage.getItem('UID');

                        document.activeElement.blur();

                    app.db.transaction(function(tx) {
                        tx.executeSql(insertUID, [uid, '',pass,'', '', '', '','', '', '', '','', '','', '', '','','0'], onInsertSuccess, onError);             
                    });
                    
                    sslnote.closeModal();

                    // console.log('setupview LOADING frames/setup/setup-done.html');
                    // setupview.loadPage('frames/setup/setup-done.html' );

                    console.log('setupview LOADING frames/setup/setup-pincode.html');
                    setupview.loadPage('frames/setup/setup-pincode.html' );

                    } // end if pass the same
                } //end is stoptscript
            }
        }, ]
    });

}); // end page.name


//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setup-pincode', function() {
    console.log('page.name setup-pincode :');
    sslnote.hidePreloader();
    localStorage.setItem('showalert', 0);
    document.activeElement.blur();


  var modalMainPassword = sslnote.modal({
            // title: 'PASSWORD',
            text: '<form id="setpincode">' +

                '        <div class="pincodePopup">' +

'<input id="1" oninput="moveOnMax(this,\'a\')" class="pincode" type="tel" name="pincode1" required maxlength="1">' +
'<input id="a" oninput="moveOnMax(this,\'b\')" class="pincode" type="tel" name="pincode2" required maxlength="1">' +
'<input id="b" oninput="moveOnMax(this,\'c\')" class="pincode" type="tel" name="pincode3" required maxlength="1">' +
'<input id="c" class="pincode" type="tel" name="pincode4" required maxlength="1">' +
'<div class="passwordCheckAlert"></div>' +


                '        </div>' +
                '</form>',
            buttons: [{

                text: 'BACK',
                onClick: function() {
                setupview.router.back({url:'frames/setup/setup-setBurnPass.html' ,force:true});

                }

        } ,
        {
                text: 'NEXT',
                close: false,
                onClick: function() {
                console.log('next');

                var formData = sslnote.formToJSON('#setpincode');
                var pincode = formData.pincode1+formData.pincode2+formData.pincode3+formData.pincode4;

                var stopscript = 'no';

                if (pincode === '') {
                    //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                    console.log('passwordCheckAlert EMPTY : ');
                    $$('.passwordCheckAlert').text('PINCODE cannot be Empty.');
                    var stopscript = 'yes';
                }

                if (pincode !== '') {
                    //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                    //console.log('passwordCheckAlert INPUT : ');


                if(pincode.length === 4)   
                            {   

                                $$('.passwordCheckAlert').text('Oke.');   
                                var stopscript = 'no';
                                }  
                                else  
                                {  

                                $$('.passwordCheckAlert').text('Not good enough.');  
                                var stopscript = 'yes';
                                }
                            }



                if (stopscript == 'no') {

                   if (pincode !== '') {

                        // var pass = calcMD5(pass1);
                        var uid = localStorage.getItem('UID');

                        sessionStorage.setItem('pincode', pincode); 

                        document.activeElement.blur();

                    var MD5pincode = calcMD5(pincode);


            $$.ajax({
                method: 'POST',
                dataType: 'jsonp',
                url: localStorage.getItem('connection') + '/appie/php/include/JsonUpdatePincode.php?',
                crossDomain: true,
                data: {
                    uid: uid,
                    MD5pincode: MD5pincode,
                },
                success: function(responseData, textStatus, jqXHR) {
                    console.log('..............success..............................');
                    console.log(responseData, textStatus, jqXHR);
                    console.log('............................................');
                    if (responseData) {

                    console.log('*** MD5pincode ' + responseData);

                    sslnote.closeModal();

                    console.log('setupview LOADING frames/setup/setup-done.html');
                    setupview.loadPage('frames/setup/setup-done.html' );  
                                  
                    }


                },
                error: function(responseData, textStatus, jqXHR) {
                    //deletemid = '';
                    console.log('..............Error..............................');
                    console.log(responseData, textStatus, jqXHR);
                    console.log('............................................');
                    sslnote.hidePreloader();
                    sslnote.alert('Error. please try again.',
                        function() {PushErrorToSupport(errorThrown);});
                },
                complete: function(responseData, textStatus, jqXHR) {
                    //console.log('..............Complete..............................');
                    //console.log(responseData,textStatus, jqXHR);
                    //console.log('............................................');
                }

            });


                    } // end if pass the same
                } //end is stoptscript
            }
        }, ]
    });





}); // end page.name


//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************


sslnote.onPageInit('setup-introexplanation', function() {
    //console.log('page.name setup-settingslogoff :');
    localStorage.setItem('showalert', 0);
    document.activeElement.blur();
    setupview.showNavbar();


$(".statusbar-overlay").css("background-color","#212121");

    $$('.next').on('click', function() {
        setupview.router.loadPage('frames/setup/setup-settings-logoff.html');
    });

}); // end page.name




//*************************************************************************************************************
//********************** PAGE ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setup-settings-logoff', function() {
    console.log('page.name setup-settingslogoff :');
    localStorage.setItem('showalert', 0);
    document.activeElement.blur();
    setupview.showNavbar();

    var storedData5 = sslnote.formGetData('settings-logoff');

    if (storedData5) {

        var Syncautologoff = [storedData5.autologoff];
        console.log('storedData5 = ',storedData5);
        console.log('Syncautologoff = '+Syncautologoff);    
    }

    


  var pickerInline = sslnote.picker({
        input: '#picker-device',
        container: '#picker-device-container',
        toolbar: false,
        rotateEffect: true,

        cols: [

                {
                values: ('1 Minut,2 Minuts,3 Minuts,4 Minuts,5 Minuts,6 Minuts,7 Minuts,8 Minuts,9 Minuts').split(','),
                //displayValues: ('1 Minut,2 Minuts,3 Minuts,4 Minuts,5 Minuts,6 Minuts,7 Minuts,8 Minuts,9 Minuts').split(','),
                textAlign: 'center'
            }

        ],

    onChange: function (picker, values, displayValues) {

    var totalMinutsInput = values[0];

    var totalMinuts = totalMinutsInput.split(" ", 1);

    localStorage.setItem('logofftimer',totalMinuts[0]);

    }
});

pickerInline.setValue(Syncautologoff);


    $$('.next').on('click', function() {
        setupview.router.loadPage('frames/setup/setup-setBurnPass.html');
    });

}); // end page.name


//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************



// sslnote.onPageBeforeAnimation('setup-settings-logoff', function() {

//     console.log('!!! onPageBeforeAnimation settings-logoff');

//     sslnote.formFromJSON('#settings-logoff', localStorage.getItem('f7form-settings-logoff'));


// });


//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
sslnote.onPageInit('setup-done', function() {
    // if (page.name === 'setup-done') {
    //console.log('page.name setup-done');
    localStorage.setItem('showalert', 0);
    //makeContactlist();
    // done add test UID


$(".statusbar-overlay").css("background-color","#000000");



    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            //console.log('Add TEST contact');
            app.db.transaction(function(tx) {
                tx.executeSql(insertSupportUID, [localStorage.getItem('UID'),localStorage.getItem('testUID'),localStorage.getItem('testNick'), localStorage.getItem('testserver'), '0', '0','1'], onInsertSuccess, onError);
            });
            var posturl =
                localStorage.getItem('connection') + '/appie/php/include/JsonInsertUIDLinks.php?sslnoteapp=' +
                localStorage.getItem('sslnoteapp') + '&my_server=' +
                localStorage.getItem('server') + '&my_uid=' +
                localStorage.getItem('UID') + '&my_nick=' +
                localStorage.getItem('UID') + '&his_uid=' +
                localStorage.getItem('testUID') + '&his_server=' +
                localStorage.getItem('testserver') +'&his_nick='+localStorage.getItem('testNick');
            //console.log(posturl);
            $$.post(posturl, function(data) {
                //console.log('**************************************');
                //console.log('POST RESPONSE TEST ROBOT INSERTED');
                console.log(data);
                //console.log('**************************************');
            });

            $$.ajax({
                method: 'POST',
                dataType: 'json',
                url: localStorage.getItem('connection') + '/appie/php/include/SetSyncUIDLinks.php?',
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
                title: languageSpecificObject.languageSpecifications[0]['importent'],

                text: languageSpecificObject.languageSpecifications[0]['done1'] 
                + localStorage.getItem('UID')
                + languageSpecificObject.languageSpecifications[0]['done2'] 

                + sessionStorage.getItem('pincode') 

                + languageSpecificObject.languageSpecifications[0]['done3'] 
                + localStorage.getItem('sslnoteapp') 
                + languageSpecificObject.languageSpecifications[0]['done4'],

                buttons: [{
                    text: languageSpecificObject.languageSpecifications[0]['oke'],
                    onClick: function() {
                            localStorage.setItem('doneSetup', 'yes');
                            window.location.reload();
                    }
                }]
            }); // END  SETPASS ===== */
        });
});