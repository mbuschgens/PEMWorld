
function checkLoginInput() {
console.log('checkLoginInput');

var password = document.getElementById("password").value;

console.log('password = ' + password);

var uid = localStorage.getItem('UID');

        var pass = calcMD5(password);
        console.log('A pass MD5 = '+pass);


        app.selectAllRecords = function(fn) 
            {

                app.db.transaction(function(tx) {
                    //console.log('app.selectAllRecords');
                    tx.executeSql(
                        "SELECT * FROM uid WHERE uid = ? and pass = ?", [uid, pass], fn, app.onError);
                });
            }




var render = function(tx, rs) {
        for (var i = 0; i < rs.rows.length; i++) 
        {
                //console.log(rs.rows.item(i)); 
            }

            if (rs.rows.length) {

                console.log('A USER EXIST');

                for (var i = 0; i < rs.rows.length; i++) 
                {
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

                sessionStorage.setItem('counter', 'yes');
                $$('.mutecolor').removeClass('red');
                localStorage.setItem('disablesound', 'no');
                //mainView.loadPage( 'frames/messages/Scontactlist.html');
                localStorage.setItem('loginfails', '0');
                $('.loginfailsbadge').removeClass('badge-red');
                $('.loginfailsbadge').addClass('badge-green');
                $('.loginfailsbadge').text(localStorage.getItem(
                    'loginfails'));

                sslnote.closeModal('.login-screen');

                mainView.router.load({
                    url: 'frames/messages/Scontactlist.html',
                    animatePages: false
                });

            }

            else

            {

            console.log('PASSWORD NOT FOUND');
            }

    }  



 app.selectAllRecords(render);

}


function checkPass(passId) {
console.log('checkPass(passId)' + passId);

var pwd = document.getElementById("pass"+passId).value;

console.log('pwd = ' + pwd);
console.log('pwd.length = ' + pwd.length);


// var strongRegex = new RegExp("^(?=.{14,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\W).*$", "g");
// var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");


// var strongRegex = new RegExp("^(?=.{14,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$", "g");


// var enoughRegex = new RegExp("(?=.{14,}).*", "g");

// if (pwd.value.length==0) 
//     {
//     // strength2.innerHTML = 'Type Password';

// $$('#check'+passId).text('0');


//     } 
//     else if (false == enoughRegex.test(pwd.value)) {
//     // strength2.innerHTML = 'More Characters';

//     $$('#check'+passId).text('More');


//     } 
//     else if (strongRegex.test(pwd.value)) {
//     // strength2.innerHTML = '<span style="color:green">Strong!</span>';

//     $$('#check'+passId).text('GOOD');

//     } 
//     // else if (mediumRegex.test(pwd.value)) {
//     // // strength2.innerHTML = '<span style="color:orange">Medium!</span>';

//     // $$('#check'+passId).text('Medium');

//     // } 
//     else 
//     {
//     // strength2.innerHTML = '<span style="color:red">Weak!</span>';

//     $$('#check'+passId).text('Weak');
//     }


if(pwd.length >1) {

$$('#check'+passId).removeClass('nok');
$$('#check'+passId).addClass('ok');


}

if(pwd.length <=1) {

$$('#check'+passId).removeClass('ok');
$$('#check'+passId).addClass('nok');


}

if (pwd.length <=1) {

$$('#check'+passId).removeClass('nok');
$$('#check'+passId).removeClass('ok');  

}



}
function messageSendSuccesFul() {

    // backgroundInterval = setInterval(function() {
        $$("#divtoBlink").removeClass("backgroundRed");
        $$("#divtoBlink").addClass("backgroundGreen");
        var messageSendSuccesFul =
            'Message Send SuccesFul.';
        $$("#divtoBlink").html(messageSendSuccesFul);

        setTimeout(function(){ 
            cryptingStop();
        },6000)

    // }, 1000);


}

function cryptingStart() {
    backgroundInterval = setInterval(function() {
        $$("#divtoBlink").toggleClass("backgroundRed");
        var busyCryptingAndSendingBusy =
            '<img src="img/connecting-white.png" width="11" height="11"> Crypting and sending...';
        $$("#divtoBlink").html(busyCryptingAndSendingBusy);
    }, 1000)
}

function cryptingStop() {
    clearTimeout(backgroundInterval);
    var busyCryptingAndSendingBusy =
        '<i class="statusbar ion-ios-locked-outline"></i> Secure Connection';
    $$("#divtoBlink").html(busyCryptingAndSendingBusy);
    $$("#divtoBlink").removeClass("backgroundRed");
    $$("#divtoBlink").removeClass("backgroundGreen");
}

function updateConnectionStatus(msg, connected) {
        var el = document.querySelector('#connection');
        if (connected) {
            if (el.classList) {
                el.classList.add('connected');
                el.classList.remove('disconnected');
            } else {
                el.addClass('connected');
                el.removeClass('disconnected');
            }
        } else {
            if (el.classList) {
                el.classList.remove('connected');
                el.classList.add('disconnected');
            } else {
                el.removeClass('connected');
                el.addClass('disconnected');
            }
        }
        el.innerHTML = msg + '<div></div>';
    }
    // ORG  updateConnectionStatus('<i class="statusbar ion-ios-locked-outline"></i> SSL Connection',true); //Online
var cryptingAndSendingBase =
    '<div id="divtoBlink" class="busyCryptingAndSending"><i class="statusbar ion-ios-locked-outline"></i> Secure Connection</div>';
//var cryptingAndSending = '<div id="divtoBlink" class="busyCryptingAndSending"><img src="img/connecting-white.png" width="11" height="11"> Crypting and sending...</div>';
window.addEventListener('load', function(e) {
    if (navigator.onLine) {
        updateConnectionStatus(cryptingAndSendingBase, true); //Online
    } else {
        updateConnectionStatus(
            '<img src="img/connecting-white.png" width="14" height="14"> No internet connection.',
            false); //Offline
    }
}, false);
window.addEventListener('online', function(e) {
    updateConnectionStatus(cryptingAndSendingBase, true); //Online
    // Get updates from server.
}, false);
window.addEventListener('offline', function(e) {
    //logger.log("Connection is flaky.");
    updateConnectionStatus(
        '<img src="img/connecting-white.png" width="14" height="14"> No internet connection.',
        false); //Offline
    // Use offine mode.
}, false);

function closeTour() {
    console.warn('doTourClosed');
    localStorage.dotour = 'Done';
    // localStorage.dotourfirstmessagesendDone= true;
    // localStorage.dotourfirstmessagesend = 'Done';
    // localStorage.dotourfirstmessagedecrypt = 'Done';
    dotourHTML = '';
    $$('.dotour').html(dotourHTML);
}

function submitLog(msg) {
    $$.ajax({
        method: 'POST',
        dataType: 'json',
        url: 'https://sslnote.com/appie/php/include/debug.php?',
        crossDomain: true,
        data: {
            msg: msg,
            log: 'LOG',
            uid: localStorage.getItem('UID')
        }
    });
}

function submitWarn(msg) {
    $$.ajax({
        method: 'POST',
        dataType: 'json',
        url: 'https://sslnote.com/appie/php/include/debug.php?',
        crossDomain: true,
        data: {
            msg: msg,
            log: 'WARN',
            uid: localStorage.getItem('UID')
        }
    });
}

function submitInfo(msg) {
    $$.ajax({
        method: 'POST',
        dataType: 'json',
        url: 'https://sslnote.com/appie/php/include/debug.php?',
        crossDomain: true,
        data: {
            msg: msg,
            log: 'INFO',
            uid: localStorage.getItem('UID')
        }
    });
}

function submitError(msg) {
    $$.ajax({
        method: 'POST',
        dataType: 'json',
        url: 'https://sslnote.com/appie/php/include/debug.php?',
        crossDomain: true,
        data: {
            msg: msg,
            log: 'ERROR',
            uid: localStorage.getItem('UID')
        }
    });
}
window.console.log = submitLog;
window.console.warn = submitWarn;
window.console.info = submitInfo;
window.console.error = submitError;

function updateUIDLinksTable() {
    //console.log('Fn updateUIDLinksTable Start');
    app.db.transaction(function(tx) {
        tx.executeSql(dropUIDLinks, [], onRemovedSuccess, onError);
        //console.log('dropUIDLinks OK');
        tx.executeSql(createUIDLinks, [], onUpdateSuccess, onError);
        //console.log('createUIDLinks OK');
        //  localStorage.setItem('dataBaseUIDLinksUpdated',true);
        setTimeout(function() {
            makecontactlist();
        }, 0);
    });
}

function klik(x) {
    // setTimeout(function(){
    //   //console.log('+ Fn Play klik sound');
    //   var storedData =  sslnote.formGetData('settings-keyboardclick') ;
    //       if(storedData) {
    //       var keyboardclick = storedData.keyboardclick ;
    //       } 
    //       else 
    //       {
    //       var keyboardclick = "on" ;
    //       }
    //       if (keyboardclick !="") {
    //           //console.log('+ Fn Play klik sound = on');
    //               var kliksound = "Tock.mp3";
    //                   if (os == 'ios') {
    //                       var snd = new Media(kliksound);
    //                       snd.setVolume('0.1');
    //                       snd.play();
    //                   } else {
    //                       var sound_click = new Howl({
    //                           urls: [kliksound],
    //                           volume: 20
    //                       });
    //                       sound_click.play();
    //                   }
    //          }
    //   },100);
}

function logotje(x) {
    // if (x === 0) {
    //     return;
    // }
    // if (x === 1) {
    //     // $$('#logotje1').addClass('logotje1') ;
    //     // setTimeout(function() {  
    //     //     $$('#logotje1').removeClass('logotje1') ;
    //     //     $$('#logotje2').addClass('logotje2');
    //     //           setTimeout(function() {  
    //     //               $$('#logotje2').removeClass('logotje2') ;
    //     //                 $$('#logotje1').addClass('logotje1') ;
    //     //             },500);
    //     // },500);
    //     $$('#send').addClass('send');
    //     setTimeout(function() {
    //         $$('#send').removeClass('send');
    //         $$('#receive').addClass('receive');
    //         setTimeout(function() {
    //             $$('#receive').removeClass('receive');
    //             // $$('#send').addClass('send') ;
    //         }, 500);
    //     }, 500);
    // }
}

function syncUILinks() {
        //console.log('-----------------------------------'); 
        //console.log('Fn syncUILinks');
        //console.log('-----------------------------------'); 
        app.selectAllRecords = function(fn) {
            app.db.transaction(function(tx) {
                tx.executeSql(syncUIDLinks, [localStorage.getItem(
                    'UID')], fn, onError);
            });
        };
        var render = function(tx, rs) {
            // rs contains our SQLite recordset, at this point you can do anything with it
            // in this case we'll just loop through it and output the results to the console
            // //console.log('............................................');
            // //console.log(rs.rows.length);
            // //console.log('............................................');
            for (var i = 0; i < rs.rows.length; i++) {
                // //console.log(rs.rows.item(i)); 
                var data = rs.rows.item(i);
                if (data) {
                    //console.log('............................................');
                    //console.log(data);
                    //console.log('............................................');
                    $$.ajax({
                        method: 'POST',
                        dataType: 'jsonp',
                        url: 'http://sslnote.com/appie/php/include/JsonSyncUIDLinks.php?callback=?',
                        crossDomain: true,
                        data: data,
                        success: function(responseData, textStatus,jqXHR) {
                            //console.log('............................................');
                            //console.log('+++ syncUILinks responseData = '+responseData); 
                            //console.log('............................................');
                        },
                        error: function(responseData, textStatus,jqXHR) {
                            //console.log('............................................');
                            //console.log('+++ syncUILinks error = '+responseData); 
                            //console.log('............................................');
                        }
                    });
                } else {
                    //console.log('Fn syncUILinks NOTHING TO DO.......');
                }
            }
        }
        app.selectAllRecords(render);
    } // end function syncUILinks
    /////////////////////////////////////////////////////////////////////////////////////////

function PushErrorToSupport(themessage) {
    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: localStorage.getItem('pushserver'),
        crossDomain: true,
        data: {
            my_uid: localStorage.getItem('UID'),
            his_uid: localStorage.getItem('supportUID'),
            themessage: themessage
        },
        success: function(responseData, textStatus, jqXHR) {
            //console.log('PUSH Error MESSAGE SEND..');
        }
    });
    sslnote.hidePreloader();
    sslnote.hideIndicator();
    //mainView.loadPage('frames/messages/Scontactlist.html');
}

function progressBar(percent, $element) {
    // //console.log('Fn progressBar');
    // var progressBarWidth = percent * $element.width() / 100;
    // $element.find('div').animate({
    //     width: progressBarWidth
    // }, 500).html(percent + "%&nbsp;");
}
var lastTime = 0;
// function buttonPressed() {
//     var now = new Date().getTime();
//     if(now-lastTime > 50) {
//        // do stuff
//     }
//     lastTime = now; 
// }
function JsonMessagesToSend() {
    //showBusy();
    var uid = localStorage.getItem('UID');
    app.selectAllRecords = function(fn) {
        app.db.transaction(function(tx) {
            //console.log('Fn JsonUIDMessagesToSend');
            tx.executeSql(JsonUIDMessagesToSend, [uid], fn,onError);
        });
    }
    var render = function(tx, rs) {
        for (var i = 0; i < rs.rows.length; i++) {
            // //console.log(rs.rows.item(i)); 
            var data = rs.rows.item(i);
            var now = new Date().getTime();
            if (now - lastTime > 1500) {
                if (data) {
                    console.log(
                        'Fn JsonMessagesToSend SOMETHING TO SEND.!.....'
                    );
                    //console.log('............................................');
                    //sessionStorage.setItem('his_server','9999');   // temp til fix server from contact    
                    //console.log(data);
                    //console.log('............................................');
                    //console.log('............................................');
                    //console.log('...DELIVERY SERVER ...' +data.his_server);
                    if (!data.his_server) {
                        console.log(
                            'Ooeps no server to deliver the mess. mess will be wiped. midid = ' +
                            data.mid);
                        console.log(data);
                        sslnote.alert(
                            'Ooeps a Error with last message to ' +
                            data.his_uid +
                            'Messages wiped, Please send again.');
                        app.db.transaction(function(tx) {
                            tx.executeSql(removeMessagesToSend, [data.mid], onRemovedSuccess,onError);
                        });
                    } else {
                        //console.log('............................................');
                        // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                        var themessage = localStorage.getItem('messagesnew'); // TRANSLATE
                       //console.log('--- themessage = ' +themessage);
                        //});
                        $$.ajax({
                            method: 'POST',
                            dataType: 'jsonp',
                            url: 'http://' + data.his_server +
                                '.sslnoteserver.com/appie/php/include/JsonMessagesToSend.php?sslnoteapp=' +
                                localStorage.getItem('sslnoteapp') +
                                '&themessage=' + themessage +
                                '&callback=?',
                            crossDomain: true,
                            data: data,
                            success: function(responseData,textStatus, jqXHR) {
                                console.log('success : JsonMessagesToSend');
                                //console.log('............................................');
                                //console.log('+++ JsonMessagesToSend responseData = '+responseData); 
                                //console.log('+++ JsonMessagesToSend Delivered @ '+data.his_server); 
                                //console.log('............................................');
                                app.db.transaction(function(
                                    tx) {
                                    //console.log('............................................');
                                    //console.log('removeMessagesToSend = ' +responseData);
                                    //console.log('............................................');
                                    tx.executeSql(removeMessagesToSend, [responseData],onRemovedSuccess,onError
                                    );
                                });
                                data = '';
                                // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                        
                                //});
                                //audiofile = localStorage.getItem('sound');
                                audiofile ='SendMessage.m4a';
                                console.log('*** AUDIOFILE = ' +audiofile);

                                cryptingStop();

                                console.log('*** cryptingStop = ');

                                messageSendSuccesFul();

                                        if (os == 'ios') {
                                            var snd = new Media(
                                                audiofile);
                                            snd.play();
                                        } else {
                                            var sound_click = new Howl({
                                                urls: [audiofile],
                                                volume: 50
                                            });
                                            sound_click.play();
                                        }

                                        // sslnote.addNotification({
                                        //     title: 'PEM',
                                        //     message: localStorage.getItem('messageissend'),
                                        //     hold: 2000
                                        // });

                                

                                //console.log('Fn SQLiteUpdateMessagesTotal from Fn JsonMessagesToSend');
                                //SQLiteUpdateMessagesTotal();  
                            },
                            error: function(responseData,textStatus, jqXHR) { 
                                console.log('Error : JsonMessagesToSend');
                            },
                            complete: function(responseData,textStatus, jqXHR) {
                                console.log('complete : JsonMessagesToSend');
                            }

                        }); //end ajax
                        //console.log('AJAX Done!');
                    }
                } //end if data
                else {
                    //console.log('Fn JsonMessagesToSend NOTHING TO DO.......1');
                    // alert user dont exist 
                    cryptingStop();
                }
                //console.log('Fn JsonMessagesToSend NOTHING TO SEND.......2');
            }
            //console.log('Fn JsonMessagesToSend NOTHING TO SEND.......3');
            lastTime = now;
        }
        //console.log('Fn JsonMessagesToSend NOTHING TO SEND.......4');
        //cryptingStop();
        //console.log('Fn JsonMessagesToReceive from Fn JsonMessagesToSend');
        JsonMessagesToReceive();
    }
    app.selectAllRecords(render);
}

function insertmessageintodbase(dmy_uid, dhis_uid, dmessage, dmdatum) {
    console.log('Fn insertmessageintodbase');
    app.db.transaction(function(tx) {
        //console.log('+++ Fn insertmessageintodbase = ' +dmy_uid + ' - ' +dhis_uid + ' - ' +dmessage+ ' - ' +dmdatum);
        tx.executeSql(insertMessagesToReceive, [dmy_uid, dhis_uid,dmessage, dmdatum, '0'], onInsertSuccess, onError);
    });
}

function JsonMessagesToReceive() {
    var uid = localStorage.getItem('UID');
    //console.log('Fn JsonMessagesToReceive');
    //setTimeout(function() {
    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: 'http://' + localStorage.getItem('server') +
            '.sslnoteserver.com/appie/php/include/JsonMessagesToReceive.php?sslnoteapp=' +
            localStorage.getItem('sslnoteapp') + '&callback=?',
        crossDomain: true,
        data: {
            uid: uid
        },
        success: function(responseData, textStatus, jqXHR) {
                // //console.log('............................................');
                // //console.log('responseData JsonMessagesToReceive = '+responseData); 
                // //console.log('............................................');
                var deletemid = [];
                if (responseData) {
                    var obj = JSON.parse(responseData);
                    for (var key in obj) {
                        var data = obj[key];
                        // //console.log(data.id);
                        if (data.id != null) {
                            deletemid.push(data.id);
                            ////console.log('+++ data.id - data.mdatum = ' + data.id + ' - ' +data.mdatum);
                            //var insertdata = data.my_uid+','+data.his_uid+','+data.message+','+data.mdatum+',0';
                            var dmy_uid = data.my_uid;
                            var dhis_uid = data.his_uid;
                            var dmessage = data.message;
                            var dmdatum = data.mdatum;
                            insertmessageintodbase(dmy_uid,
                                dhis_uid, dmessage, dmdatum);
                            // app.db.transaction(function(tx) {
                            // //console.log('+++ insertMessagesToReceive ' +data.message + ' - ' +data.mdatum );
                            // tx.executeSql(insertMessagesToReceive, [data.my_uid,data.his_uid,data.message,data.mdatum,'0'],onInsertSuccess,onError);
                            // });
                        }
                    }
                    //deletemid = deletemid.replace(/"/g, ""); 
                    //console.log('deletemid');
                    deletemid = JSON.stringify(deletemid);
                    //deletemid = '[1]';
                    //console.log(deletemid);
                    //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                    var themessage = localStorage.getItem(
                        'messagesdelivered'); // TRANSLATE
                    // time to delete
                    $$.ajax({
                        method: 'POST',
                        dataType: 'jsonp',
                        url: 'http://' + localStorage.getItem(
                                'server') +
                            '.sslnoteserver.com/appie/php/include/JsonMessagesToReceiveDelete.php?sslnoteapp=' +
                            localStorage.getItem(
                                'sslnoteapp') +
                            '&themessage=' + themessage +
                            '&callback=?',
                        crossDomain: true,
                        data: {
                            id: deletemid,
                            my_uid: data.my_uid,
                            his_uid: data.his_uid
                        },
                        success: function(responseData,
                            textStatus, jqXHR) {
                            deletemid = '';
                            //console.log('............................................');
                            //console.log(responseData);
                            //console.log('............................................');
                        }
                    });
                    //});  
                    console.log(
                        'Fn SQLiteUpdateMessagesTotal from Fn JsonMessagesToReceive'
                    );
                    SQLiteUpdateMessagesTotal();
                } // end if responseData
                else {
                    ////console.log('Fn makeContactlist from Fn JsonMessagesToReceive');
                    //SQLiteUpdateMessagesTotal();
                }
            } // end suscces
    }); // end AJAX
    //}, 800);
    //console.log('2 Fn makeContactlist from Fn JsonMessagesToReceive');
    SQLiteUpdateMessagesTotal();
}


function SQLiteUpdateMessagesTotal() {
        ////console.log('SQLiteUpdateMessagesTotal'); 
        showBusy();
        ////console.log('+++ showBusy');
        app.db.transaction(function(tx) {
            //console.log('Fn SQLiteUpdateMessagesTotal'); 
            // //console.log('TX updateBadgeToZero');
            //       tx.executeSql(updateBadgeToZero, ['0'],onUpdateSuccess,onError);
            //console.log('TX updateBadgeTo'); 
            tx.executeSql(updateBadgeTo, [], onUpdateSuccess, onError);
            //console.log('TX updateTotalMessages');
            tx.executeSql(updateTotalMessages, [], onUpdateSuccess,onError);
            //console.log('Fn makeContactlist from Fn SQLiteUpdateMessagesTotal '); 
            ////console.log(result); 

            makeContactlist();

            totalMessageUpdate();
            // hideBusy();
            // //console.log('+++ hideBusy');
        });
        //hideBusy();
    } // end SQLiteUpdateMessagesTotal
    ///////////////////////////////////////


function totalMessageUpdate() {

    console.log('fn totalMessageUpdate');

     app.selectTotalMessages = function(fn) {
                app.db.transaction(function(tx) {
                    tx.executeSql(selectTotalMessages, [], fn,onError);
                });
            }


    //         // function getAllTheData() {


        var render = function(tx, rs) {
            //console.log('start render'); 
            // rs contains our SQLite recordset, at this point you can do anything with it
            // in this case we'll just loop through it and output the results to the console
            for (var i = 0; i < rs.rows.length; i++)

                if (rs.rows.length) {

                            for (var i = 0; i < rs.rows.length; i++) {

                                var totalMessage = rs.rows.item(i);

                                console.log('totalMessage.totalmessages = ' +totalMessage.totalmessages);

                                if(totalMessage.totalmessages >= '1')
                                {

                                   $('.totalMessages').addClass('badge badge-red');
                                    $('.totalMessages').text(totalMessage.totalmessages);
                                }

                                else

                                {
                                    $('.totalMessages').removeClass('badge badge-red');
                                    $('.totalMessages').text('');

                                }

                            }

            } 

            else 
            {
                console.log('RECORD DONT EXIST');

            }



        };


        app.selectTotalMessages(render);


    //     //console.log('DONE');
    //     //hideBusy();


    // } // end function makeContactList


}

function insertMessageSQLite(mid, thekey, his_uid, his_server, message_new,message_old) {
        // var time_now = date('H:i', time()+25200); // time() returns a time in seconds already
        // var date_now = date('D : d : M'); // time() returns a time in seconds already
        //console.log('------------------------------------');
        //console.log('Fn insertMessageSQLite');
        //console.log('thekey = ' +thekey);
        //console.log('his_uid = ' +his_uid);
        //console.log('his_server = ' +his_server);
        //console.log('message_new = ' +message_new);
        //console.log('message_old = ' +message_old);
        //console.log('------------------------------------');
        if (his_server == '') {
            // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
            sslnote.modal({
                    title: localStorage.getItem('crypting'),
                    text: localStorage.getItem('oepsaerror'),
                    buttons: [{
                        text: localStorage.getItem('oke'),
                        onClick: function() {
                            var themessage =
                                'Missing his_server'; // TRANSLATE
                            PushErrorToSupport(themessage);
                            mainView.router.back({
                                url: 'frames/messages/Scontactlist.html',
                                force: true
                            });
                        }
                    }, ]
                })
                //languageSpecificObject.languageSpecifications[0]['messageissend'],
                // });
        }

        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        var mDate = new Date();
        var time_now = addZero(mDate.getHours()) + ':' + addZero(mDate.getMinutes()); // time() returns a time in seconds already
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var date_now = mDate.getDate() + ' ' + monthNames[mDate.getMonth()] +
            ' ' + mDate.getFullYear(); // time() returns a time in seconds already
        var uid = localStorage.getItem('UID');



        if (message_old !== '') {

            var he = new RegExp('he said', 'g');
            message_old = message_old.replace(he, his_uid);
            
            var i = new RegExp('i said', 'g');
            message_old = message_old.replace(i, uid);
            //console.log('DO message_old is not empty');


            var removemessagelast = new RegExp('message-last', 'g');
            message_old = message_old.replace(removemessagelast, '');
            //console.log('DO message_old is not empty');



            if (sessionStorage.getItem('imageURL')) {
                var imageURL = sessionStorage.getItem('imageURL');
                //console.log('imageURL= ' +imageURL);
                var message = message_old +
                    "<div class='message message-send message-last'>" +
                    "<div class='message-name'>" + uid + " (" + time_now +
                    ")</div>" + imageURL + "<div class='message-text'>" +
                    message_new + "</div></div>";
            } else {
                var message = message_old +
                    "<div class='message message-send message-last'>" +
                    "<div class='message-name'>" + uid + " (" + time_now +
                    ")</div>" + "<div class='message-text'>" + message_new +
                    "</div></div>";
            }
        } 

        else 


        {
            console.log('DO message_old is empty');
            if (sessionStorage.getItem('imageURL')) {
                var imageURL = sessionStorage.getItem('imageURL');
                //console.log('imageURL= ' +imageURL);
                var message = "<div class='messages-date'><span>" + date_now +
                    "</span></div><div class='message message-send message-last'>" +
                    "<div class='message-name'>" + uid + " (" + time_now +
                    ")</div>" + imageURL + "<div class='message-text'>" +
                    message_new + "</div></div>";
            } else {
                var message = "<div class='messages-date'><span>" + date_now +
                    "</span></div><div class='message message-send message-last'>" +
                    "<div class='message-name'>" + uid + " (" + time_now +
                    ")</div>" + "<div class='message-text'>" + message_new +
                    "</div></div>";
            }
        }
        var key2 = thekey.toLowerCase();
        //console.log('key2 = ' +key2);
        sessionStorage.setItem(sessionStorage.getItem('his_uid') + 'encryptkey',key2);
        var datatosend = sjcl.encrypt(key2, message);
        //console.log('datatosend 1= ' +datatosend);
        app.db.transaction(function(tx) {
            //console.log('insertUIDMessagesIntoSqlite');     
            ////console.log('+++ insertUIDMessagesIntoSqlite his_server = ' +sessionStorage.getItem('his_server'));
            tx.executeSql(insertUIDMessagesSend, [localStorage.getItem('UID'), sessionStorage.getItem('his_uid'),
                sessionStorage.getItem('his_server'),datatosend, mDate, '0', '0', '0', '0'], onInsertSuccess, onError);
           
            var mid = sessionStorage.getItem('mid');

            app.db.transaction(function(tx) {
                //console.log('removeMessagesToReceive = ' +mid);
                tx.executeSql(removeMessagesToReceive, [mid],onRemovedSuccess, onError);
                tx.executeSql(updateBadgeTo, [],onUpdateSuccess, onError);
            });
            // remove session image
            sessionStorage.removeItem('imageURL');
            mainView.loadPage('frames/messages/Scontactlist.html');

            // setTimeout(function(){


                console.log("url: 'frames/messages/SContactlist.html'");

//mainView.router.load({url: 'frames/messages/SContactlist.html'});

                // },300);


            //mainView.router.load({url:'frames/messages/Scontactlist.html',reload:true});   

            sslnote.hidePreloader();
        });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function importNewUIDLinks() {
        //showBusy();
        var uid = localStorage.getItem('UID');
        console.log('*** Fn importNewUIDLinks Started');
        //sslnote.showIndicator();
        $$.post(localStorage.getItem('connection') +
            '/appie/php/include/JsonImportUIDLinks.php?uid=' + uid +
            '&sslnoteapp=' + localStorage.getItem('sslnoteapp'), function(
                responseData) {
                ////console.log('*** Fn importNewUIDLinks responseData = ' +responseData);  
                if (responseData) {
                    console.log('*** IMPORT UIDLINKS = ' + responseData);


console.log('*** IMPORT UIDLINKS = ');



        app.db.transaction(function(tx) {                    
            console.log('dropUIDLinks');
                    tx.executeSql(dropUIDLinks, [], onRemovedSuccess, onError);
            console.log('createUIDLinks');
                    tx.executeSql(createUIDLinks, [], onUpdateSuccess, onError);
         });           



                    app.db.transaction(function(tx) {
                        var obj = JSON.parse(responseData);
                        for (var key in obj) {

                            var data = obj[key];
                            //console.log('data.his_uid = ' +data.his_uid);
                            //console.log('data.his_nick = ' +data.his_nick);
                            //console.log('data.his_server = ' +data.his_server);
                            //console.log('*** updateUIDLinks');
                            var testonline = "2015-06-01 00:00:01";

//console.log('updateUIDLinks');

console.log('*** IMPORT UIDLINKS DATA = ' +data);


tx.executeSql(updateUIDLinks, [uid,data.his_uid, data.his_nick,data.his_server, testonline,'0'], onInsertSuccess, onError);
                        

                        } // end for
                        //tx.executeSql(updateUIDLinks, [uid, data.his_uid, data.his_nick], onInsertSuccess, onError);
                    }); // end app.db.transaction



                    // norecordes forward to SContactadd
                   console.log('updateUIDLinks makeContactlist');
                    makeContactlist();
                } // end if responseData
                else {
                    console.log ('NOTHING TO IMPORT ADD NEW');
                    app.db.transaction(function(tx) {
                        //console.log('insertTestUID ');
                        var testonline = "2015-06-01 17:05:47";
                        //console.log(testonline);
                        tx.executeSql(insertSupportUID, [
                            localStorage.getItem('UID'),
                            localStorage.getItem('testUID'),
                            'TEST UID', localStorage.getItem(
                                'testserver'), '0', '0',
                            testonline
                        ], onInsertSuccess, onError);
                    });
                    var posturl =
                        'https://sslnote.com/appie/php/include/JsonInsertUIDLinks.php?sslnoteapp=' +
                        localStorage.getItem('sslnoteapp') + '&my_server=' +
                        localStorage.getItem('server') + '&my_uid=' +
                        localStorage.getItem('UID') + '&my_nick=' +
                        localStorage.getItem('UID') + '&his_uid=' +
                        localStorage.getItem('testUID') + '&his_server=' +
                        localStorage.getItem('testserver') + '&his_nick=' +
                        localStorage.getItem('testUID');
                    //console.log(posturl);
                    $$.post(posturl, function(data) {
                        //console.log('**************************************');
                        //console.log('POST RESPONSE INSERT');
                        //console.log(data);
                        //console.log('**************************************');
                    });
                    //       syncUILinks();
                    // SQLiteUpdateMessagesTotal() ;
                    //checkContactsOnline();
                    // settingsview.loadPage('frames/settings/mysettings/ScontactAdd.html');
                }
            }); //end contact verzoek check
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function makeContactlist() {
        //console.log('Fn makecontactlist sqlite');
        // showBusy();
        // //console.log('+++ showBusy');
        //$$('.refresh-link.refresh-home').addClass('refreshing');
        var uid = localStorage.getItem('UID');
        app.selectAllRecords = function(fn) {
                app.db.transaction(function(tx) {
                    ////console.log('selectUIDLinks');
                    tx.executeSql(selectUIDLinks, [uid], fn, onError);
                    // hideBusy();
                    // //console.log('+++ hideBusy');
                });
            }
            // function getAllTheData() {
        var render = function(tx, rs) {
                //console.log('-----------------------------------'); 
                //console.log('makeContactlist = '+rs.rows.length); 
                //console.log('-----------------------------------'); 
                var uid = localStorage.getItem('UID');
                if (rs.rows.length) {
                    ////console.log('RECORD EXIST');
                    contactlistTemplate = $$('#contactlist-template').html();
                    var contactlisthtml = '';
                    for (var i = 0; i < rs.rows.length; i++) {
                        // //console.log('RECORD HAVE VAR');
                        var contactItem = rs.rows.item(i);
                        ////console.log('contactItem = ' +rs.rows.item(i));
                        ////console.log(contactItem);
                        ////console.log('contactItem.autocrypt = ' );
                        ////console.log(contactItem.autocrypt);
                        if (contactItem.autocrypt === 1) {
                            var autocrypt = "ion-ios-locked white";
                        } else {
                            var autocrypt = "ion-ios-locked blanco";
                        }
                        if (contactItem.nuonline === 1) {
                            var nuonline = "useronline";
                            var online = "green";
                        } else {
                            var nuonline = "useroffline";
                            var online = "grey";
                        }
                        // if(contactItem.online === 1)
                        // {
                        // var online ="green";
                        // var useronline ="useronline";
                        // }
                        // else
                        // {
                        //  var  online ="grey";
                        //  var useronline ="useroffline";
                        // }
                        if (contactItem.badge >= '1') {
                            var badge = "badge-green";
                        } else {
                            var badge = "badge-grey";
                        }




                        // if (contactItem.totalmessages == 0) 
                        // {
                        // // var page ="Smessages-send-new";
                        // var page ="Spopup-ask-key";
                        // }
                        if (contactItem.totalmessages == 0) {
                            var page = "Smessages-send-new";
                        }
                        if (contactItem.totalmessages == 1) {
                            // var page = "Spopup-ask-key";
                            var page = "Smessages-send";
                        }

                        if (contactItem.his_server === '0000') {
                            var his_server = "0000";
                            var page = "";
                            var notconfirm = " ( Not Confirm )";

                        } else {
                            var his_server = contactItem.his_server;
                            var notconfirm = "";
                        }


                        // if (contactItem.totalmessages == 1) 
                        // {
                        // var page ="Smessages-send";
                        // }
                        if (contactItem.totalmessages >= 2) {
                            var page = "Scontactmessagelist";
                        }
                        if (contactItem.his_nick == 'EX5L9271J1') {
                            var his_nick = "SUPPORT";
                        } else if (contactItem.his_nick == 'EMD7LDAV5X') {
                            var his_nick = "TEST ACCOUNT";
                        } else {
                            var his_nick = contactItem.his_nick;
                        }
                        ////console.log('contactItem.badge = ' +contactItem.badge);
                        ////console.log(badge);
                        ////console.log('autocrypt = ' +autocrypt);
                        var lastseen = localStorage.getItem(contactItem.his_uid +
                            'active_last');
                        //var lastseentxt = 'laatst gezien';
                        // edit lastseen view
                        contactlisthtml += contactlistTemplate.replace(
                            /{{my_uid}}/g, contactItem.my_uid).replace(
                            /{{his_uid}}/g, contactItem.his_uid).replace(
                            /{{his_nick}}/g, his_nick).replace(
                            /{{his_server}}/g, his_server).replace(
                            /{{notconfirm}}/g, notconfirm).replace(
                            /{{mid}}/g, contactItem.mid).replace(
                            /{{status}}/g, contactItem.status).replace(
                            /{{askkey}}/g, contactItem.askkey).replace(
                            /{{online}}/g, online).replace(/{{nuonline}}/g,
                            nuonline).replace(/{{autocrypt}}/g, autocrypt).replace(
                            /{{badge}}/g, badge).replace(
                            /{{totalmessages}}/g, contactItem.totalmessages
                        ).replace(/{{page}}/g, page).replace(
                            /{{lastseen}}/g, lastseen).replace(
                            /{{lastseentxt}}/g, localStorage.getItem(
                                'lastseentxt'));
                    } // end for
                    ////console.log('contactlisthtml = ' +contactlisthtml );
                    //localStorage.setItem('contactlisthtml',contactlisthtml);
                    $$('.contactlist').html(contactlisthtml);
                    hideBusy();
                    ////console.log('+++ hideBusy');
                } // end if
                else {
                    //console.log('RECORD DONT EXIST');
                    console.log('Fn importNewUIDLinks')
                    importNewUIDLinks();
                }
                if (rs.rows.length >= '1') {
                    ////console.log('+++ SHOW WELCOME');
                    if (!localStorage.dotour) {
                        // added TEST UID
                        var dotourHTML = '<li>' +
                            '<div class="item-title center">Hi, we already added a TEST UID for you!<BR>' +
                            'so we can give you a little tour.<BR>' +
                            'The tour will show you what you can do with PEM.<BR>' +
                            'In the contact list Swipe to the right or left.<BR>' +
                            'Howto send receive Crypted message.' +
                            '<div class="item-after center"><a href="#" class="showTourSwipeToRight badge badge-green" >Oke lets show me' +
                            '</a>' +
                            ' <a href="#" class="link item-link showTourClose badge badge-green" >No thanks' +
                            '</a>' + '</div><br>' + '</div>' + '</li>';
                        $$('.dotour').html(dotourHTML);
                        $$('.showTourSwipeToRight').on('click', function() {
                            //console.log('showTourSwipeToRight pressed');
                            clearTimeout(loop);
                            sslnote.swipeoutOpen($$('li.swipeout').eq(),'left');
                            var dotourHTML = '<li>' +
                                '<div class="item-title center">' +
                                'Swipe to the right<BR>You see the user UID, ' +
                                'set a private KEY to automatic crypt the message with this contact, ' +
                                'or EDIT contact name.' +
                                '<div class="item-after center"><a href="#" class="showTourSwipeToLeft badge badge-green" >Oke i understand next' +
                                '</a>' + '</div><br>' + '</div>' +
                                '</li>';
                            $$('.dotour').html(dotourHTML);
                            $$('.showTourSwipeToLeft').on('click',
                                function() {
                                    //console.log('showTourSwipeToLeft pressed');
                                    sslnote.swipeoutClose($$('li.swipeout').eq());
                                    var dotourHTML = '<li>' +
                                        '<div class="item-title center">Swipe to the left<BR>now you can DELETE this contact.' +
                                        '<div class="item-after center"><a href="#" class="showTourSendMessage badge badge-green" >Oke i understand next' +
                                        '</a>' + '</div><br>' +
                                        '</div>' + '</li>';
                                    $$('.dotour').html(dotourHTML);
                                    sslnote.swipeoutOpen($$('li.swipeout').eq(),'right');
                                    $$('.showTourSendMessage').on(
                                        'click', function() {
                                            //console.log('showTourSendMessage pressed');
                                            sslnote.swipeoutClose(
                                                $$(
                                                    'li.swipeout'
                                                ).eq(1));
                                            var dotourHTML =
                                                '<li>' +
                                                '<div class="item-title center">Oke Let\'s send some Crypt message to TEST UID.<BR>' +
                                                'Press TEST UID and follow next step.' +
                                                '<div class="item-after center"><a href="#" class="link item-link showTourClose badge badge-green" >No thanks' +
                                                '</a>' +
                                                '</div><BR>' +
                                                '</div>' +
                                                '</li>';
                                            $$('.dotour').html(
                                                dotourHTML);
                                            localStorage.dotour =
                                                true;
                                            $$('.showTourClose')
                                                .on('click',
                                                    function() {
                                                        closeTour
                                                            ();
                                                    });
                                        }); // end showTourSendMessage
                                }); // end showTourSwipeToLeft
                        }); // end showTourSwipeToRight
                        $$('.showTourClose').on('click', function() {
                            closeTour();
                        });
                    } // end session dotour
                } // end only 1 contact
            } // end render
        app.selectAllRecords(render);
        

        console.log('*** CHECK SyncUIDLinks');

            $$.ajax({
                method: 'POST',
                dataType: 'json',
                url: localStorage.getItem('connection') +'/appie/php/include/SyncUIDLinks.php?',
                crossDomain: true,
                data: {
                    uid: localStorage.getItem('UID'),
                    sslnoteapp: localStorage.getItem('sslnoteapp')
                },
                success: function(responseData, textStatus,jqXHR) {
                  if (responseData) {
                    console.log('*** responseData SyncUIDLinks' + responseData);
                importNewUIDLinks();
                    }
                }
            });

        $$.post(localStorage.getItem('connection') +
            '/appie/php/include/Ccontactcheck.php?uid=' + localStorage.getItem(
                'UID') + '&sslnoteapp=' + localStorage.getItem('sslnoteapp'),
            function(data) {
                //console.log('--- START Ccontactcheck.php data response= ' +data);     
                if (data) {
                    var jsonObject = new Function('return ' + data)();
                    if (jsonObject.id >= '1') {
                        // if(sessionStorage.getItem('contactrequest') !== '1') {
                        //     sessionStorage.setItem('contactrequest', '1');
                        //console.log('Ccontactcheck.php something todo ' );  
                        $$.getJSON("i18n/" + localStorage.getItem(
                                'cLANGUAGE') + "/strings.json",
                            function(languageSpecificObject) {
                                //languageSpecificObject.languageSpecifications[0]['crypting'],
                                contactrequestHTML = '<li>' +
                                    '<div class="item-title center">' +
                                    languageSpecificObject.languageSpecifications[
                                        0]["youhavecontactrequest"] +
                                    '<BR>' + languageSpecificObject.languageSpecifications[
                                        0]['on'] + ': ' + jsonObject.time_request +
                                    '<BR>' + languageSpecificObject.languageSpecifications[
                                        0]['from'] + ': ' + jsonObject.his_uid +
                                    '<BR>' + languageSpecificObject.languageSpecifications[
                                        0]['note'] + ': ' + jsonObject.note +
                                    '<div class="item-after center"><a href="#" class="contactrequestAccept badge badge-green" >' +
                                    languageSpecificObject.languageSpecifications[
                                        0]['accept'] +
                                    '</a>  -  <a href="#" class="link item-link contactrequestCancel badge badge-red" >' +
                                    languageSpecificObject.languageSpecifications[
                                        0]['cancel'] + '</a>' +
                                    '</div><br>' + '</div>' + '</li>';
                                $$('.contactrequest').html(
                                    contactrequestHTML);
                                $$('.contactrequestCancel').on('click',
                                    function() {
                                        //console.log('contactrequestCancel pressed');
                                        sslnote.showPreloader(
                                            languageSpecificObject
                                            .languageSpecifications[
                                                0]['processing']
                                        );
                                        $$.post(localStorage.getItem(
                                                'connection') +
                                            '/appie/php/include/Ccontactcheckreturn.php?uid=' +
                                            localStorage.getItem(
                                                'UID') +
                                            '&sslnoteapp=' +
                                            localStorage.getItem(
                                                'sslnoteapp') +
                                            '&action=no&id=' +
                                            jsonObject.id,
                                            function(data) {
                                                //console.log('++ Cancel data response actions =' +data);
                                            });
                                        sslnote.hidePreloader();
                                        contactrequestHTML = '';
                                        $$('.contactrequest').html(
                                            contactrequestHTML);
                                    });
                                $$('.contactrequestAccept').on('click',
                                    function() {
                                        //console.log('contactrequestAccept pressed');
                                        // ask for nickname
                                        sslnote.prompt(
                                            languageSpecificObject
                                            .languageSpecifications[
                                                0][
                                                'givenickname'
                                            ], function(value) {
                                                // sslnote.alert(value);
                                                sslnote.showPreloader(
                                                    languageSpecificObject
                                                    .languageSpecifications[
                                                        0][
                                                        'processing'
                                                    ]);
                                                $$.post(
                                                    localStorage
                                                    .getItem(
                                                        'connection'
                                                    ) +
                                                    '/appie/php/include/Ccontactcheckreturn.php?uid=' +
                                                    localStorage
                                                    .getItem(
                                                        'UID'
                                                    ) +
                                                    '&sslnoteapp=' +
                                                    localStorage
                                                    .getItem(
                                                        'sslnoteapp'
                                                    ) +
                                                    '&my_server=' +
                                                    localStorage
                                                    .getItem(
                                                        'server'
                                                    ) +
                                                    '&my_nick=' +
                                                    value +
                                                    '&action=oke&id=' +
                                                    jsonObject
                                                    .id,
                                                    function(
                                                        data
                                                    ) {
                                                        //console.log('+++ data response actions =' +data);
                                                        //console.log('Fn importNewUIDLinks Start');
                                                        importNewUIDLinks
                                                            ();
                                                        //console.log('Fn importNewUIDLinks End');
                                                        //console.log('Fn SQLiteUpdateMessagesTotal Start');
                                                        SQLiteUpdateMessagesTotal
                                                            ();
                                                        //console.log('Fn SQLiteUpdateMessagesTotal End');
                                                        sslnote
                                                            .hidePreloader();
                                                        contactrequestHTML
                                                            =
                                                            '';
                                                        $$(
                                                                '.contactrequest'
                                                            )
                                                            .html(
                                                                contactrequestHTML
                                                            );
                                                    });
                                            });
                                    });
                            });
                    } // end if jsonObject
                    // } // session
                } // end if data
                else {
                    //console.log("NO DATA Ccontactcheck");
                }
            }); //end post
        ////console.log('*** END CHECK Cccontactcheck.php');
        //hideBusy();
        // checkContactsOnline();
    } // end function makeContactList
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function makeContactMessageslist(his_uid, his_nick) {
        //console.log('Fn makeContactMessageslist sqlite');
        //showBusy();
        //$$('.refresh-link.refresh-home').addClass('refreshing');
        var uid = localStorage.getItem('UID');
        app.selectAllRecords = function(fn) {
                app.db.transaction(function(tx) {
                    //console.log('selectMID');
                    //console.log(his_uid);
                    tx.executeSql(selectMID, [uid, his_uid], fn,
                        onError);
                });
            }
            // function getAllTheData() {
        var render = function(tx, rs) {
            //console.log('start render'); 
            // rs contains our SQLite recordset, at this point you can do anything with it
            // in this case we'll just loop through it and output the results to the console
            for (var i = 0; i < rs.rows.length; i++)
            //{ //console.log(rs.rows.item(i)); }
            //console.log('rs.rows.length');
                if (rs.rows.length) {
                //console.log('RECORD EXIST');
                contactmessageslistTemplate = $$(
                    '#contactmessageslist-template').html();
                var contactmessageslisthtml = '';
                for (var i = 0; i < rs.rows.length; i++) {
                    //console.log('RECORD HAVE VAR');
                    var contactmessagesItem = rs.rows.item(i);
                    //console.log('contactItem = ' +rs.rows.item(i));
                    ////console.log(contactmessagesItem);
                    ////console.log('contactItem.autocrypt = ' );
                    ////console.log(contactItem.autocrypt);
                    reggie =
                        /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g;
                    dateArray = reggie.exec(contactmessagesItem.mdatum);
                    // //console.log('dateArray = ');
                    // //console.log(dateArray);
                    // //console.log('dateArray[1] = ' +dateArray[1]);
                    // //console.log('dateArray[2]-1 = ' +dateArray[2]-1);
                    // //console.log('dateArray[3] = ' +dateArray[3]);
                    // //console.log('dateArray[4] = ' +dateArray[4]);
                    // //console.log('dateArray[5] = ' +dateArray[5]);
                    // //console.log('dateArray[6] = ' +dateArray[6]);
                    mdatum2 = new Date(
                        (+dateArray[1]), (+dateArray[2]) - 1, // Careful, month starts at 0!
                        (+dateArray[3]), (+dateArray[4]), (+
                            dateArray[5]), (+dateArray[6]));
                    //console.log('mdatum2 = ' +mdatum2);
                    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May",
                        "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
                        "Dec"
                    ];
                    mdatum = mdatum2.getDate() + '-' + monthNames[
                            mdatum2.getMonth()] + ' ' + (mdatum2.getHours() <
                            10 ? '0' : '') + mdatum2.getHours() + ':' +
                        (mdatum2.getMinutes() < 10 ? '0' : '') +
                        mdatum2.getMinutes();
                    //console.log('mdatum = ' +mdatum);
                    if (contactmessagesItem.read === 1) {
                        var badge = "badge-gray";
                        var messagereadnew = localStorage.getItem(
                            'messagebadgereadtxt');
                    } else {
                        var badge = "badge-green";
                        var messagereadnew = localStorage.getItem(
                            'messagebadgenewtxt');
                    }
                    // if (contactmessagesItem.read === 1) 
                    // {
                    // //var readtxt ="icon ion-android-done-all";
                    // //var readtxt ="icon ion-ios-locked";
                    // var readtxt ="icon ion-android-done green";
                    // }
                    // else
                    // {
                    // //var readtxt ="icon ion-android-done";
                    // var readtxt ="icon ion-android-done white";
                    // }
                    // contactmessageslisthtml += contactmessageslistTemplate.replace(/{{my_uid}}/g, contactmessagesItem.my_uid)
                    // .replace(/{{his_uid}}/g, contactmessagesItem.his_uid).replace(/{{his_nick}}/g, his_nick).replace(/{{his_server}}/g, contactmessagesItem.his_server)
                    // .replace(/{{mid}}/g, contactmessagesItem.mid).replace(/{{mdatum}}/g, mdatum)
                    // .replace(/{{messagereadtxt}}/g, localStorage.getItem('messagereadtxt')).replace(/{{badge}}/g, badge).replace(/{{messagereadnew}}/g, messagereadnew);
                    contactmessageslisthtml +=
                        contactmessageslistTemplate.replace(
                            /{{my_uid}}/g, contactmessagesItem.my_uid).replace(
                            /{{his_uid}}/g, contactmessagesItem.his_uid
                        ).replace(/{{his_nick}}/g, his_nick).replace(
                            /{{his_server}}/g, sessionStorage.getItem(
                                'his_server')).replace(/{{mid}}/g,
                            contactmessagesItem.mid).replace(
                            /{{mdatum}}/g, mdatum).replace(
                            /{{messagereadtxt}}/g, localStorage.getItem(
                                'messagereadtxt')).replace(/{{badge}}/g,
                            badge).replace(/{{messagereadnew}}/g,
                            messagereadnew);
                }
                ////console.log(contactmessageslisthtml);
                $$('.contactmessageslistdiv').html(
                    contactmessageslisthtml);
                //  hideBusy();
            } else {
                //console.log('RECORD DONT EXIST');
                // alert user dont exist 
            }
        };
        app.selectAllRecords(render);
        //console.log('DONE');
        //hideBusy();
    } // end function makeContactList
    // function sslcheck() {
    //     //console.log('Do SSL check');
    //     window.plugins.sslCertificateChecker.check(
    //           successCallback,
    //           errorCallback,
    //           localStorage.getItem('sslserver'),
    //           localStorage.getItem('fingerprint')
    //           );
    //    function successCallback(message) {
    //      //sslnote.alert(message);
    //      // Message is always: CONNECTION_SECURE.
    //      // Now do something with the trusted server.
    //      //sslnote.showPreloader('Your connection is Secure!');
    //    }
    //    function errorCallback(message) {
    //      sslnote.alert(message);
    //      if (message == "CONNECTION_NOT_SECURE") {
    //         sslnote.alert('Something wrong!!!<BR>Maybe man in the middle attack going on<BR>Please quit!');
    //        // There is likely a man in the middle attack going on, be careful!
    //      } else if (message == "CONNECTION_FAILED") {
    //         //sslnote.alert('There was no connection (yet). Internet may be down. Try again (a few times) after a little timeout.');
    //        // There was no connection (yet). Internet may be down. Try again (a few times) after a little timeout.
    //      }
    //    }
    // sslnote.hidePreloader();
    // sessionStorage.setItem('sslconnection',message);
    // }  
    //////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////

function Startscreenprotect() {
    clearTimeout(screenprotect);
    screenprotect = setTimeout(function() {
        // add black statusbar-overlay
        $('.statusbar-overlay').addClass('bgblack');
        sslnote.popup('.popup-screenprotect');
        Stopscreenprotect();
        //console.log('Startscreenprotect excute');
    }, localStorage.getItem('screenprotecttimer'));
}

function Stopscreenprotect() {
    clearTimeout(screenprotect);
    //console.log('Stopscreenprotect function');
    clearTimeout(contactonline);
    //console.log('contactonline stopped');
}

function CcheckLastActive() {
        //console.log('*** CcheckLastActive ');
        $$.post(localStorage.getItem('connection') +
            '/appie/php/include/CcheckLastActive.php?uid=' + localStorage.getItem(
                'UID') + '&sslnoteapp=' + localStorage.getItem('sslnoteapp'),
            function(data) {
                //console.log('*** CcheckLastActive DATA = '+data);
                //console.log('*** CcheckLastActive DATA');
                if (data) {
                    var obj = JSON.parse(data);
                    app.db.transaction(function(tx) {
                        for (var key in obj) {
                            var tmp = obj[key];
                            tx.executeSql(updateHLastActive, [tmp.active_last,
                                tmp.nuonline, tmp.his_uid
                            ]);
                        }
                    }); // end app.db.transaction
                }
            });
        JsonMessagesToSend();
    } //end function CcheckLastActive
var contactonline;





function setDataSource() {
console.log(localStorage.getItem('UID') + ' Fn setDataSource ');


        if (!!window.EventSource) {


            var CcheckContactsOnline = new EventSource("http://pem.world/sse/CcheckContactsOnline.php?uid=" + localStorage.getItem('UID'));

            //console.log("***** LOADING http://pem.world/sse/CcheckContactsOnline.php?uid=" + localStorage.getItem('UID') );

            var CcheckContactsLastOnline = new EventSource("http://pem.world/sse/CcheckContactsLastOnline.php?uid=" + localStorage.getItem('UID'));


            CcheckContactsOnline.addEventListener("onlineStatus", function(e) {
                
                // logMessage(e);
                console.log('addEventListener onlineStatus ' + e.data);
                onlineStatus(e.data);

            }, false);

            CcheckContactsLastOnline.addEventListener("lastOnline", function(e) {
                
                // logMessage(e);
                console.log('addEventListener lastOnline ' + e.data);
                lastOnline(e.data);

            }, false);

            
            // source.addEventListener("open", function(e) {
            //     // logMessage("OPENED");
            //     console.log('***** addEventListener CONNECTION OPENED ***** ');

            // }, false);

            // source.addEventListener("error", function(e) {
            //     // logMessage("ERROR");
            //     if (e.readyState == EventSource.CLOSED) {
            //         // logMessage("CLOSED");
            //         console.log('***** addEventListener error ***** '+ e.data);

            //     }
            // }, false);
        } 

        // else 

        // {
        //     // document.getElementById("notSupported").style.display = "block";
        //     console.log('***** getElementById notSupported *****');

        // }
}



function lastOnline(data) {

//console.log('data ' + data);


           if (data) {
                var obj = JSON.parse(data);

               // console.log('obj ' + obj);


                for (var key in obj) {

                    var value = obj[key];

// console.log('key ' + key + ' : value ' + value);

                   
                    if (key.indexOf('active_last') >= 0) {
                      
                        console.log('.' + key + '=' +value);

                        reggie =
                            /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g;
                        dateArray = reggie.exec(value);
                        mdatum2 = new Date(
                            (+dateArray[1]), (+dateArray[2]) - 1, // Careful, month starts at 0!
                            (+dateArray[3]), (+dateArray[4]), (+
                                dateArray[5]), (+dateArray[6]));
                        ////console.log('mdatum2 = ' +mdatum2);
                        var monthNames = ["Jan", "Feb", "Mar", "Apr",
                            "May", "Jun", "Jul", "Aug", "Sep",
                            "Oct", "Nov", "Dec"
                        ];


                        lastseen = mdatum2.getDate() + '-' + monthNames[
                                mdatum2.getMonth()] + ' ' + (mdatum2.getHours() <
                                10 ? '0' : '') + mdatum2.getHours() +
                            ':' + (mdatum2.getMinutes() < 10 ? '0' : '') +
                            mdatum2.getMinutes();
                        ////console.log('lastseen = ' +lastseen);

                        localStorage.setItem(key, lastseen);

                        $('.' + key).text(localStorage.getItem('lastseentxt') + ' ' + lastseen);



                    }
                }
            }

    }





function onlineStatus(data) {

//console.log('data ' + data);


           if (data) {
                var obj = JSON.parse(data);

               // console.log('obj ' + obj);


                for (var key in obj) {




                    var value = obj[key];

console.log('key ' + key + ' : value ' + value);

                    if (key.indexOf('online') >= 0) {


                        if (value === '1') {
                            console.log('.' + key+'=green');

                            localStorage.setItem(key, 'green');

                            // $('.' + key).removeClass('red');
                            $('.' + key).removeClass('grey');
                            $('.' + key).addClass('green');
                            //$('.DIV' + key).removeClass('useroffline');
                            //$('.DIV' + key).addClass('useronline');
                        }

                        if (value === '0') {
                            localStorage.setItem(key, 'grey');
                            console.log('.' + key +'=grey');
                            $('.' + key).removeClass('green');
                            // $('.' + key).addClass('red');
                            $('.' + key).addClass('grey');
                            //$('.DIV' + key).removeClass('useronline');
                            //$('.DIV' + key).addClass('useroffline');
                        }
                    }
                    
                   
                }
            }

    }




function iAmOnline() {

    console.log(localStorage.getItem('UID') + ' Fn iAmOnline ');

    $$.post(localStorage.getItem('connection') +
        '/appie/php/include/iAmOnline.php?uid=' +
        localStorage.getItem('UID') + '&sslnoteapp=' + localStorage.getItem(
            'sslnoteapp'), function(data) {

    }); // end post
    
    loop = setTimeout(function() {
        iAmOnline();
    }, 5000);

}










function checkContactsOnline() {
    console.log(localStorage.getItem('UID') + ' Fn checkContactsOnline ');
    $$.post(localStorage.getItem('connection') +
        '/appie/php/include/CcheckContactsOnline.php?uid=' +
        localStorage.getItem('UID') + '&sslnoteapp=' + localStorage.getItem(
            'sslnoteapp'), function(data) {
            //console.log('*** checkContactsOnline = '+data);
            //console.log('*** checkContactsOnline');
            if (data) {
                var obj = JSON.parse(data);
                for (var key in obj) {
                    var value = obj[key];
                    if (key.indexOf('online') >= 0) {
                        if (value === '1') {
                            ////console.log('.' + key+'=1');
                            localStorage.setItem(key, '1');
                            // $('.' + key).removeClass('red');
                            $('.' + key).removeClass('grey');
                            $('.' + key).addClass('green');
                            $('.DIV' + key).removeClass('useroffline');
                            $('.DIV' + key).addClass('useronline');
                        }
                        if (value === '0') {
                            localStorage.setItem(key, '0');
                            ////console.log('.' + key +'=0');
                            $('.' + key).removeClass('green');
                            // $('.' + key).addClass('red');
                            $('.' + key).addClass('grey');
                            $('.DIV' + key).removeClass('useronline');
                            $('.DIV' + key).addClass('useroffline');
                        }
                    }
                    if (key.indexOf('active_last') >= 0) {
                        // //console.log('active_last = ');
                        // //console.log('active_last = ' + key + ' - ' +value);
                        reggie =
                            /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g;
                        dateArray = reggie.exec(value);
                        mdatum2 = new Date(
                            (+dateArray[1]), (+dateArray[2]) - 1, // Careful, month starts at 0!
                            (+dateArray[3]), (+dateArray[4]), (+
                                dateArray[5]), (+dateArray[6]));
                        ////console.log('mdatum2 = ' +mdatum2);
                        var monthNames = ["Jan", "Feb", "Mar", "Apr",
                            "May", "Jun", "Jul", "Aug", "Sep",
                            "Oct", "Nov", "Dec"
                        ];
                        lastseen = mdatum2.getDate() + '-' + monthNames[
                                mdatum2.getMonth()] + ' ' + (mdatum2.getHours() <
                                10 ? '0' : '') + mdatum2.getHours() +
                            ':' + (mdatum2.getMinutes() < 10 ? '0' : '') +
                            mdatum2.getMinutes();
                        ////console.log('lastseen = ' +lastseen);
                        localStorage.setItem(key, lastseen);
                    }
                }
            }
        });
    
    //console.log('*** DO systemalert ');
    var systemalertHTML = '';

    $$.post('http://push.sslnoteserver.com/systemalert.php?uid=' + localStorage.getItem(
            'UID') + '&sslnoteapp=' + localStorage.getItem('sslnoteapp'),

        function(data) {
            //console.log('*** systemalert.php = '+data);
            //console.log('*** systemalert DATA');

            if (data !== "") {
                systemalertHTML = '<li>' +
                    '<div class="item-title center"><i class="ion-alert-circled"></i> SYSTEM ALERT<BR>' +
                    '<div class="systemalerttext">' + data + '<BR>' +
                    '</div>' + '</li>';
                $$('.systemalert').html(systemalertHTML);
            }
            else
            {$$('.systemalert').html(systemalertHTML);}



        }); // end post


    ////console.log('*** END systemalert ');
    CcheckLastActive();
    loop = setTimeout(function() {
        ////console.log('LOOP Fn checkContactsOnline');
        checkContactsOnline();
        //CcheckLastActive();
        ////console.log('LOOP Fn checkContactsOnline checkMessageToSent Start');
        //JsonMessagesToSend();
        ////console.log('LOOP Fn checkContactsOnline checkMessageToSent Done');
    }, 10000);
}

function showBusy() {
    ////console.log('+++ Fn showBusy');
    var busy =
        '<div class=\'busy\'><i class=\'icon ion-loading-a\'></i> Still busy...</div>';
    var busynavbar = '<div class=\'busynavbar\'>Still busy...</div>';
    // var showbusycontactmessagelist ='<ul><li class=\'item-divider\'> Still busy...one moment please...</li></ul></div>';
    var showbusycontactmessagelist =
        '<li><div class="item-title center">Still busy...one moment please...</div></li>';
    // logotje(1);
    // var refreshIntervalId = setInterval(logotje, 2000);
    // $$('.refresh-link.refresh-home').addClass('refreshing');
    // $$('.icon.ion-ios-reload').addClass('red');
    // $$('.icon.ion-ionic').addClass('red');
    $$('.yourinfo').html(busy);
    $$('.yourinfonavbar').html(busynavbar);
    $$(
        '.page[data-page="Scontactlist"] .page-content .list-block .yourinfo'
    ).html(busy);
    $$('.busycontactmessagelist').html(showbusycontactmessagelist);
}

function hideBusy() {
    ////console.log('+++ Fn hideBusy');
    //logotje(0);
    //var hidebusycontactmessagelist ='<ul><li class=\'item-divider center \' >Click to reply - swipe RtL wipe</li></ul></div>';
    var hidebusycontactmessagelist =
        '<li><div class="item-title center">Click to reply - swipe RtL wipe</div></li>';
    // setTimeout(function() {
    // $$('.refresh-link.refresh-home').removeClass('refreshing');
    // $$('.icon.ion-ios-reload').removeClass('red');
    // $$('.icon.ion-ionic').removeClass('red');
    // },1000);
    $$('.yourinfo').html(localStorage.getItem('yourpid'));
    $$('.yourinfonavbar').html(localStorage.getItem('yourpidnavbar'));
    $$(
        '.page[data-page="Scontactlist"] .page-content .list-block .yourinfo'
    ).html(localStorage.getItem('yourpid'));
    $$('.busycontactmessagelist').html(hidebusycontactmessagelist);
}

function sslnoteupdate() {
    var html =
        '<div class=\'animate-height\'> \t<div class=\'content-block tablet-inset\'> \t    <div class=\'content-block-inner\'> \t    \t<img src=\'iTunesArtwork.png\' style=\'width: 60px; height: 60px; vertical-align: top; float: left;\'> \t    \t<p style=\'margin: 0; margin-left: 8px;\'> \t    \t\t<span style=\'font-weight: 500; font-size: 16px; margin-left: 8px\'>Bug Reporter&#8311; {{version}}<br></span> \t    \t\t<span style=\'font-size: 14px; margin-left: 8px\'>Sniper_GER<br></span> \t    \t\t<span style=\'font-size: 14px; margin-left: 8px\'>Downloaded</span> \t    \t</p>\xA0\t    \t<p>{{description}}<br><br>For more information, visit:<br><a href=\'https://github.com/SniperGER/Bug-Reporter7\' class=\'external\' target=\'_blank\' style=\'text-decoration: underline;\'>https://github.com/SniperGER/Bug-Reporter7</a>{{instructions}}</p> \t    </div> \t</div> \t</div> \t<div class=\'list-block tablet-inset\'> \t    <ul> \t    \t<li> \t    \t\t<a href=\'#\' class=\'item-link open-popup\' data-popup=\'.popup-update-detail\'> \t    \t\t\t<div class=\'item-content\'> \t    \t\t\t\t<div class=\'item-inner\'> \t    \t\t\t\t\t<div class=\'item-title\'>Details</div> \t    \t\t\t\t</div> \t    \t\t\t</div> \t    \t\t</a> \t    \t</li> \t    </ul> \t</div> \t<div class=\'list-block tablet-inset\'> \t    <ul> \t    \t<li class=\'center item-button\'> \t    \t\t<a href=\'#\' class=\'update-button\'> \t    \t\t\t<div class=\'item-content\'> \t    \t\t\t\t<div class=\'item-inner\'> \t    \t\t\t\t\t<div class=\'item-title\' style=\'width: 100%;\'>Install</div> \t    \t\t\t\t</div> \t    \t\t\t</div> \t    \t\t</a> \t    \t</li> \t    </ul> \t</div>';
    $.getJSON('update.json', function(data) {
        $('p#update-status').closest('.page-content').html(html.replace(
            /{{version}}/g, data.en.updates[0].version).replace(
            /{{description}}/g, data.en.updates[0].description
        ).replace(/{{instructions}}/g, ''));
        $('span#content').html(data.en.updates[0].content);
        $('.update-button').on('click', function() {
            sslnote.modal({
                title: 'Software Update',
                text: unescape('SSLNote ' + data.en
                    .updates[0].version +
                    ' will begin installing. The app will restart when installation is finished.'
                ),
                buttons: [{
                    text: 'Later',
                    onClick: function() {
                        sslnote.closeModal();
                    }
                }, {
                    text: 'Install',
                    bold: true,
                    onClick: function() {
                        sslnote.hidePreloader();
                        $('body').append(
                            '<div class="update-view"><img src="iTunesArtwork.png" /></div>'
                        );
                        setTimeout(
                            function() {
                                $(
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
                            }, 1000
                        );
                    }
                }]
            });
        });
    });
}

function changeDesign(key) {
    var settingsTheme = $.parseJSON(JSON.stringify(sslnote.formGetData(
        'form-theme'))) !== null ? $.parseJSON(JSON.stringify(sslnote.formGetData(
        'form-theme'))) : 'default';
    var settingsTint = $.parseJSON(JSON.stringify(sslnote.formGetData(
        'form-tint'))) !== null ? $.parseJSON(JSON.stringify(sslnote.formGetData(
        'form-tint'))) : 'blue';
    switch (key) {
        case 'theme':
            $('body').removeClass('layout-dark layout-white').addClass(
                'layout-' + settingsTheme.theme).attr('data-theme',
                settingsTheme.theme);
            if (settingsTheme.theme === 'dark') {
                $('meta[name=\'apple-mobile-web-app-status-bar-style\']').removeAttr(
                    'content');
            } else {
                $('meta[name=\'apple-mobile-web-app-status-bar-style\']').attr(
                    'content', 'black-translucent');
            }
            break;
        case 'tint':
            $('body').removeClass(
                'theme-white theme-black theme-yellow theme-red theme-blue theme-green theme-pink theme-lightblue theme-orange theme-gray'
            ).addClass('theme-' + settingsTint.tint).attr('data-color',
                settingsTint.tint);
            break;
        case 'init':
            $('body').removeClass('layout-dark layout-white').addClass(
                'layout-' + settingsTheme.theme).attr('data-theme',
                settingsTheme.theme);
            $('body').removeClass(
                'theme-white theme-black theme-yellow theme-red theme-blue theme-green theme-pink theme-lightblue theme-orange theme-gray'
            ).addClass('theme-' + settingsTint.tint).attr('data-color',
                settingsTint.tint);
            break;
        default:
            break;
    }
}
changeDesign('init');
var progress = 0;

function giveRandom(limit) {
    return Math.floor(Math.random() * limit) + 1;
}

function addProgress(selector, callback) {
    if (progress < 100) {
        var randomValue = giveRandom(30);
        if (progress + randomValue <= 100) {
            progress = progress + randomValue;
        } else {
            progress = 100;
        }
    } else if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        interval = undefined;
        setTimeout(function() {
            $('.progress-bar').remove();
        }, 1000);
        setTimeout(function() {
            window.location.reload();
        }, 2000);
    }
    $('#' + selector).css('width', progress + '%');
}
var pushNotification;

function onDeviceReady() {

    console.log('Fn onDeviceReady');
    try {
        pushNotification = window.plugins.pushNotification;
        if (device.platform === 'android' || device.platform === 'Android' ||
            device.platform === 'amazon-fireos') {
            pushNotification.register(successHandler, errorHandler, {
                'senderID': '661780372179',
                'ecb': 'onNotification'
            });
        } else {
            pushNotification.register(tokenHandler, errorHandler, {
                'badge': 'true',
                'sound': 'true',
                'alert': 'true',
                'ecb': 'window.onNotification'
            });
            console.log('+++ pushNotification iOS ACTIVE  ');
        }
    } catch (err) {
        txt = 'There was an error on this page.\n\n';
        txt += 'Error description: ' + err.message + '\n\n';
        alert(txt);
    }
}
var os = sslnote.device.os;
// result contains any message sent from the plugin call
function successHandler(result) {
        console.log('successHandler result = ' + result);
    }
    // result contains any error description text returned from the plugin call

function errorHandler(error) {
        console.log('errorHandler error = ' + error);
    }
    // iOS
window.onNotification = function(event) {
    //console.log('!!!!!! onNotificationAPN event');
    if (event.alert) {
        //console.log('!!!!!! onNotificationAPN event.alert ' +event.alert);
        // navigator.notification.alert(event.alert);
        // makeContactlist();
        //console.log('Fn onNotificationAPN To Fn JsonMessagesToReceive');
        if (localStorage.getItem('showalert') === '1') {
            localStorage.removeItem('repeatsound');
            localStorage.setItem('disablesound', 'no');
            //mainView.loadPage('frames/messages/Scontactlist.html');
        }
        if (localStorage.getItem('disablesound') === 'no') {
            if (os === 'ios') {
                setTimeout(function() {
                    var snd = new Media(event.sound);
                    snd.play();
                }, 2000);
            } else {
                var sound_click = new Howl({
                    urls: [localStorage.getItem('sound')],
                    volume: localStorage.getItem('volume')
                });
                sound_click.play();
            }
            sslnote.addNotification({
                title: 'PEM',
                message: event.alert,
                hold: 3000
            });
            console.log('Fn navigator.notification.alert');
            setInterval(function() {
                navigator.notification.alert(event.alert);
            }, 1000);
        } // end if disablesound
        if (event.alert.indexOf('Accepted') >= 0) {
            //console.log('event.alert Contact accepted');
            setTimeout(function() {
                importNewUIDLinks();
            }, 1200);
        }
        if (event.alert.indexOf('Request') >= 0) {
            //console.log('event.alert Contact request');
            setTimeout(function() {
                makeContactlist();
            }, 1200);
        }
        JsonMessagesToSend();
    }
    if (event.sound) {
        //console.log('!!!!!! onNotificationAPN event.sound ' +event.sound);
        // var snd = new Media(event.sound);
        // snd.play();
    }
    if (event.badge) {
        //console.log('!!!!!! onNotificationAPN event.badge ' +event.badge);
    }
};

function tokenHandler(result) {
    console.log('Fn tokenHandler = ' +result);

    localStorage.setItem('token', result);

    if (localStorage.getItem('UID')) {

        if (!localStorage.tokenUpdated) {
            var posturl =
                'https://sslnote.com/appie/php/include/updatetoken.php?sslnoteapp=' +
                localStorage.getItem('sslnoteapp') + '&server=' +
                localStorage.getItem('server') + '&App=' + localStorage.getItem(
                    'App') + '&os=' + os + '&uid=' + localStorage.getItem(
                    'UID') + '&token=' + localStorage.getItem('token');
            $$.post(posturl, function(data) {
                //console.log('**************************************');
                console.log('POST RESPONSE FN tokenHandler ');
                console.log(data);
                sslnote.hideIndicator();
                //console.log('**************************************');
                if (!sslnote.formGetData(
                    'settings-pushnotification')) {
                    //console.log('! NO settings-pushnotification');
                    sslnote.formStoreData(
                        'settings-pushnotification', {
                            'pushreceived': ['on'],
                            'pushread': ['on'],
                            'pushwipe': ['on']
                        });
                }
                if (!sslnote.formGetData('settingsscreenprotect')) {
                    //console.log('! NO settingsscreenprotect');
                    sslnote.formStoreData('settingsscreenprotect', {
                        'screenprotect': '999'
                    });
                }
                if (!sslnote.formGetData('settingslogoff')) {
                    //console.log('! NO settingslogoff');
                    sslnote.formStoreData('settingslogoff', {
                        'keyboardclick': ['on']
                    });
                }
                if (!sslnote.formGetData('settingslogoff')) {
                    //console.log('! NO settingslogoff');
                    sslnote.formStoreData('settingslogoff', {
                        'autologoff': '3'
                    });
                }
                if (!sslnote.formGetData('settings-notification')) {
                    //console.log('! NO settings-notification');
                    sslnote.formStoreData('settings-notification', {
                        'sound': '1.m4a',
                        'volume': '50',
                        'repeatpush': ['on'],
                        'slider': 10
                    });
                }
                if (!sslnote.formGetData('settings-containers')) {
                    //console.log('! NO settings-containers');
                    sslnote.formStoreData('settings-containers', {
                        'my-container': 'RUSSIA'
                    });
                }
            }); // end post
            localStorage.tokenUpdated = true;
        } // end if localStorage
    } // end if UID
}
document.addEventListener('deviceready', onDeviceReady, true);

function goDoSomething(d) {
    var mid = d.getAttribute('data-id');
    sessionStorage.setItem('mid', mid);
}

function DeleteUidLink(d) {
    // mondal are you sure
    var DeleteUidLinkiD = d.getAttribute('data-id');
    var DeleteUidLinkHisUID = d.getAttribute('his_nick');
    //   sslnote.alert('Are you sure?<br>Delete link with<br>' + DeleteUidLinkiD);
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            sslnote.confirm('Are you sure?', 'Delete <br>' +
                DeleteUidLinkiD + '<br>(' + DeleteUidLinkHisUID +
                ')', function() {
                    sslnote.showPreloader(languageSpecificObject.languageSpecifications[
                        0]['deleting']);
                    app.db.transaction(function(tx) {
                        //console.log('Fn removeUIDlinks '); 
                        tx.executeSql(removeUIDlinks, [
                                DeleteUidLinkiD
                            ], onRemovedSuccess,
                            onError);
                    });
                    // delete remote uids_links
                    var posturl =
                        'https://sslnote.com/appie/php/include/JsonRemoveUIDLinks.php?sslnoteapp=' +
                        localStorage.getItem('sslnoteapp') +
                        '&server=' + localStorage.getItem('server') +
                        '&uid=' + localStorage.getItem('UID') +
                        '&his_uid=' + DeleteUidLinkiD;
                    //console.log(posturl);
                    $$.post(posturl, function(data) {
                        //console.log('**************************************');
                        //console.log('POST RESPONSE DELETE');
                        //console.log(data);
                        sslnote.hidePreloader();
                        //console.log('**************************************');
                        var data = 'Delete <br>' +
                            DeleteUidLinkiD + '<br>(' +
                            DeleteUidLinkHisUID +
                            ')<br>SuccesFully.';
                        sslnote.hidePreloader();
                        syncUILinks();
                        // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                        sslnote.modal({
                            title: localStorage.getItem(
                                'contactlink'),
                            text: data,
                            verticalButtons: true,
                            buttons: [{
                                text: localStorage
                                    .getItem(
                                        'oke'
                                    ),
                                onClick: function() {
                                    // window.location.reload();
                                    //console.log('NO Contactlist create new');
                                    makeContactlist
                                        ();
                                    //console.log('makeContactlist();');
                                    sslnote
                                        .hidePreloader();
                                    // mainView.loadPage('frames/messages/Scontactlist.html');
                                    mainView
                                        .router
                                        .reloadPage();
                                }
                            }, ]
                        });
                        //});
                        // }); // end post
                    });
                }, function() {
                    makeContactlist();
                    //console.log('You clicked Cancel button');
                });
        });
}

function KeySettings(d) {
    // mondal are you sure
    var KeySettingsiD = d.getAttribute('data-id');
    var KeySettingsHis_nick = d.getAttribute('his_nick');
    sslnote.allowSwipeout = true;
    //  sslnote.alert('Are you sure?<br>Set Key Settings<br>' + KeySettingsiD);
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json", function(languageSpecificObject) {
            //languageSpecificObject.languageSpecifications[0]['crypting'],
            sslnote.modal({
                title: languageSpecificObject.languageSpecifications[
                    0]['keysettings'],
                text: languageSpecificObject.languageSpecifications[
                        0]['keysettingstxt'] + '<br>(' +
                    KeySettingsHis_nick + ')',
                buttons: [{
                    text: languageSpecificObject.languageSpecifications[
                        0]['cancel'],
                    onClick: function() {
                        makeContactlist();
                        //console.log('You clicked Cancel button');
                    }
                }, {
                    text: languageSpecificObject.languageSpecifications[
                        0]['setkey'],
                    onClick: function() {
                        // sslnote.alert('You clicked second button!')
                        sslnote.prompt(
                            languageSpecificObject
                            .languageSpecifications[
                                0][
                                'whatkeytouse'
                            ] + '<br>' +
                            KeySettingsHis_nick,
                            languageSpecificObject
                            .languageSpecifications[
                                0][
                                'keysettings'
                            ], function(value) { //oke 
                                var str = value;
                                var tempkey =
                                    str.toLowerCase();
                                var tempkey =
                                    calcMD5(
                                        tempkey
                                    );
                                localStorage.setItem(
                                    KeySettingsiD +
                                    'encryptkey',
                                    tempkey
                                );
                                app.db.transaction(
                                    function(
                                        tx) {
                                        //console.log('Fn KeySettings '); 
                                        tx.executeSql(
                                            updateKey, [
                                                '1',
                                                tempkey,
                                                KeySettingsiD
                                            ],
                                            onUpdateSuccess,
                                            onError
                                        );
                                    });
                                sslnote.modal({
                                    title: languageSpecificObject
                                        .languageSpecifications[
                                            0
                                        ]
                                        [
                                            'keyset'
                                        ],
                                    text: languageSpecificObject
                                        .languageSpecifications[
                                            0
                                        ]
                                        [
                                            'keysetxt'
                                        ],
                                    verticalButtons: true,
                                    buttons: [{
                                        text: languageSpecificObject
                                            .languageSpecifications[
                                                0
                                            ]
                                            [
                                                'oke'
                                            ],
                                        onClick: function() {
                                            //console.log('NO Contactlist create new');
                                            makeContactlist
                                                ();
                                            //console.log('makeContactlist();');
                                            sslnote
                                                .swipeoutClose();
                                            // setTimeout(function(){
                                            mainView
                                                .router
                                                .reloadPage();
                                            // },800);
                                        }
                                    }, ]
                                });
                            }, function(value) { //cancel
                                makeContactlist
                                    ();
                                //console.log('You clicked Cancel button');
                            });
                    }
                }, {
                    text: languageSpecificObject.languageSpecifications[
                        0]['remove'],
                    bold: true,
                    onClick: function() {
                        localStorage.removeItem(
                            KeySettingsiD +
                            'encryptkey');
                        app.db.transaction(function(
                            tx) {
                            //console.log('Fn KeySettings '); 
                            tx.executeSql(
                                updateKey, [
                                    '0',
                                    '',
                                    KeySettingsiD
                                ],
                                onUpdateSuccess,
                                onError
                            );
                        });
                        sslnote.modal({
                            title: languageSpecificObject
                                .languageSpecifications[
                                    0][
                                    'keyremoved'
                                ],
                            text: languageSpecificObject
                                .languageSpecifications[
                                    0][
                                    'keyremovedtxt'
                                ],
                            verticalButtons: true,
                            buttons: [{
                                text: languageSpecificObject
                                    .languageSpecifications[
                                        0
                                    ]
                                    [
                                        'oke'
                                    ],
                                onClick: function() {
                                    //console.log('NO Contactlist create new');
                                    makeContactlist
                                        ();
                                    //console.log('makeContactlist();');
                                    sslnote
                                        .swipeoutClose();
                                    // setTimeout(function(){
                                    mainView
                                        .router
                                        .reloadPage();
                                    // },800);
                                }
                            }, ]
                        });
                    }
                }, ]
            });
        });
}