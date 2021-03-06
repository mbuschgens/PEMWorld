function startCounter(totalSeconds) {

    ////console.log('+++ Fn StartCounter = ' + totalSeconds);
    if (!counterStart) {
        var counterStart = updateCounter(totalSeconds, 'start');
        sessionStorage.counterStarted = 'yes';
    } else {
        updateCounter(totalSeconds, 'update');
    }
};

//------------------------------------------------------------//  


function updateCounter(totalSeconds, action) {

    if (action === 'update') {
        clearTimeout(updateCounterTimer);
        ////console.log('+++ updateCounter update = ' + totalSeconds);
        updateCounterTimer = '';
        updateCounter(totalSeconds, 'start');
    }


    if (action === 'start') {

        if(totalSeconds >= 1 && totalSeconds <= 10){

            // play alert sound
        ////console.log('+++ play alert sound = ' + totalSeconds);

        playNotificationSound('closed.mp3');

        }


        if (localStorage.debugging == 'true') {

            ////console.log('+++ Fn updateCounter start = ' + totalSeconds);

        }

        var hours = parseInt(totalSeconds / 3600) % 24;
        var minutes = parseInt(totalSeconds / 60) % 60;
        var seconds = totalSeconds % 60;

        //var result = '<i class="icons_eye">'+ (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds)+'</i>';
        var result = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);


        $$('#timer').html(result);

        if (totalSeconds == 0) {

            ////console.log('+++!!! COUNTER STOP');
            myApp.hideIndicator();
            myApp.hidePreloader();
            myApp.closeModal();


            sessionStorage.clear();

            clearTimeout(loop);

            updateCounter(totalSeconds, 'stop');

            ////console.log('+++!!! COUNTER STOP Page loaded');

            $("#connection").addClass("connectionHidden");

            $(".statusbar-overlay").addClass("black");
  
            localStorage.setItem('reLoggin', '1');

            var userLoggedIn = sessionStorage.getItem('userLoggedIn');
            ////console.log('+++!!! COUNTER STOP userLoggedIn = ' + userLoggedIn);

window.location.reload();


        } else {
            totalSeconds = totalSeconds - 1;
            updateCounterTimer = setTimeout(function() {
                updateCounter(totalSeconds, 'start')
            }, 1000);
        }
    }




    if (action === 'stop') {
        ////console.log('+++ Fn updateCounter stop = ' + totalSeconds);
        clearTimeout(updateCounterTimer);
        ////console.log('+++ updateCounter = stop');
        updateCounterTimer = '';
        sessionStorage.counterStarted = 'no';

    }
}

//------------------------------------------------------------//  


function messageSendSuccesFul() {

    $$(".statusbar-overlay").removeClass("backgroundRed");
    $$(".statusbar-overlay").addClass("backgroundGreen");

    var messageSendSuccesFul = 'Message Send SuccesFul.';

    $$("#divtoBlink").html(messageSendSuccesFul);

    setTimeout(function() {
        cryptingStop();
    }, 8000)

}


//------------------------------------------------------------//  


function cryptingStart() {

    ////console.log('cryptingStart = START');

    $$("#divtoBlink").html('');

    $$(".statusbar-overlay").addClass("backgroundRed");

    var busyCryptingAndSendingBusy = '<img src="img/connecting-white.png" width="11" height="11"> Crypting and sending...';

    $$("#divtoBlink").html(busyCryptingAndSendingBusy);

}

//------------------------------------------------------------//  

function cryptingStop() {

        ////console.log('cryptingStop = STOP');

        var busyCryptingAndSendingStop = '<i class="statusbar icons_locked"></i> SECURE CONNECTION</div>';

        $$("#divtoBlink").html(busyCryptingAndSendingStop);
        $$(".statusbar-overlay").removeClass("backgroundRed");
        $$(".statusbar-overlay").removeClass("backgroundGreen");

    }
//------------------------------------------------------------//  

function alertShow(theAlertMesaages) {
    ////console.log('alertShow = ' + theAlertMesaages);

    cryptingStop();

    $$(".statusbar-overlay").toggleClass("backgroundRed");

    var alertShowNotification = '...' + theAlertMesaages + '...';

    $$("#divtoBlink").html(alertShowNotification);

    setTimeout(function() {

        ////console.log('alertShow = STOP');
        // var alertShowBusy = '';
        cryptingStop();

    }, 8000);

}


//------------------------------------------------------------//  


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


var cryptingAndSendingBase =
    '<table style="width:100%"><tr>' +

    '<td class="timerBlock">' +

    '<div class="showHideTimer"> <i class="icons_timer">' +

    '<div id="timer" class="timer">00:00</div></i>' +

    '</div>' +

    '</td>' +

    '<td>' +
    '<div id="divtoBlink" class="busyCryptingAndSending"> <i class="statusbar icons_locked"></i> SECURE CONNECTION</div>' +
    '</td>' +

    '<td class="timerBlock">' +
    '<div class="running"></div>' +
    '</td>' +

    '</tr></table>';


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


//------------------------------------------------------------//  

function syncUILinks() {
        ////console.log('-----------------------------------'); 
        ////console.log('Fn syncUILinks');
        ////console.log('-----------------------------------'); 
        app.selectAllRecords = function(fn) {
            app.db.transaction(function(tx) {
                tx.executeSql(syncUIDLinks, [localStorage.getItem('UID')], fn, onError);
            });
        };
        var render = function(tx, rs) {
            // rs contains our SQLite recordset, at this point you can do anything with it
            // in this case we'll just loop through it and output the results to the console
            ////console.log('............................................');
            console.log(rs.rows.length);
            ////console.log('............................................');
            for (var i = 0; i < rs.rows.length; i++) {
                // //console.log(rs.rows.item(i)); 
                var data = rs.rows.item(i);
                if (data) {
                    ////console.log('............................................');
                    console.log(data);
                    ////console.log('............................................');
                    $$.ajax({
                        method: 'POST',
                        dataType: 'jsonp',
                        url: localStorage.getItem('connection') + '/appie/php/include/JsonSyncUIDLinks.php?callback=?',
                        crossDomain: true,
                        data: data,
                        success: function(responseData, textStatus, jqXHR) {
                            ////console.log('............................................');
                            ////console.log('+++ syncUILinks responseData = '+responseData); 
                            ////console.log('............................................');
                        },
                        error: function(responseData, textStatus, jqXHR) {
                            //////console.log('............................................');
                            //////console.log('+++ syncUILinks error = '+responseData); 
                            //////console.log('............................................');
                        }
                    });
                } else {
                    //////console.log('Fn syncUILinks NOTHING TO DO.......');
                }
            }
        }
        app.selectAllRecords(render);

} // end function syncUILinks
    /////////////////////////////////////////////////////////////////////////////////////////

//------------------------------------------------------------//  

function PushErrorToSupport(themessage) {

    ////console.log('PUSH Error To Support..');

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
            ////console.log('PUSH Error MESSAGE SEND..');
        },
        error: function(responseData, textStatus, jqXHR) {
            ////console.log('Error Ajax: ',responseData, textStatus, jqXHR);
        }
    });
    myApp.hidePreloader();
    myApp.hideIndicator();
    //mainView.loadPage('frames/contacts/Scontactlist.html');
}

//------------------------------------------------------------//  


var lastTime = 0;

//------------------------------------------------------------//  



function JsonMessagesToSend() {
    ////console.log('Fn JsonMessagesToSend Start');

    var functionJsonMessagesToSendBusy = sessionStorage.getItem('functionJsonMessagesToSendBusy');

    if (functionJsonMessagesToSendBusy !== '1') {

        var uid = localStorage.getItem('UID');
        app.selectAllRecords = function(fn) {
            app.db.transaction(function(tx) {
                //////console.log('Fn JsonUIDMessagesToSend');
                tx.executeSql(JsonUIDMessagesToSend, [uid], fn, onError);
            });
        }

        var render = function(tx, rs) {

            for (var i = 0; i < rs.rows.length; i++) {
                // //console.log(rs.rows.item(i)); 
                var data = rs.rows.item(i);

                //var now = new Date().getTime();

                // var lastMidSendIs = '0';
                var lastMidSendIs = sessionStorage.getItem('lastMidSendIs');

                // var MidSendIs = '0';
                var MidSendIs = data.mid;

                ////console.log('.......lastMidSendIs = ' + lastMidSendIs);
                ////console.log('.......MidSendIs = ' + MidSendIs);


                // if (now - lastTime > 1500) {


                if (MidSendIs !== lastMidSendIs) {

                    ////console.log('.......not busy functionJsonMessagesToSendBusy = 0');


                    if (data) {

                        cryptingStart();
                        sessionStorage.setItem('functionJsonMessagesToSendBusy', '1');

                        ////console.log('.......set to busy functionJsonMessagesToSendBusy = 1');

                        ////console.log('Fn JsonMessagesToSend SOMETHING TO SEND.!.....');
                        //////console.log('............................................');
                        //console.log(data);
                        //////console.log('............................................');
                        //////console.log('............................................');
                        //////console.log('...DELIVERY SERVER ...' +data.his_server);
                        ////console.log('...DELIVERY MID ...' +data.mid);


                        if (data.his_server === 'undefined' || data.his_server === '0000' ) {
                            ////console.log('Ooeps no server to deliver the mess. mess will be wiped. midid = ' + data.mid);
                            console.log(data);

                            //myApp.alert('Ooeps a Error with last message to ' + data.his_uid + ' Messages wiped, Please send again.');
                            app.db.transaction(function(tx) {
                                tx.executeSql(removeMessagesToSend, [data.mid], onRemovedSuccess, onError);
                            });
                            //sessionStorage.setItem('functionJsonMessagesToSendBusy','0');
                            cryptingStop();
        myApp.modal({
            title: 'Ooeps a Error',
            text: 'with last message to ' + data.his_uid + ' Messages wiped, Please send again.',
            buttons: [{
                text: localStorage.getItem('OKE'),
                onClick: function() {
                    // updateUIDLinksTable();
                }
            }]
        });


                        } 

                        else 

                        {
                            //////console.log('............................................');
                            // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                            var themessage = localStorage.getItem('messagesnew'); // TRANSLATE
                            //////console.log('--- themessage = ' +themessage);
                            //});


                            var PostUrl = 'http://' + data.his_server +
                                '.sslnoteserver.com/appie/php/include/JsonMessagesToSend.php?myAppapp=' +
                                localStorage.getItem('myAppapp') +
                                '&themessage=' + themessage +
                                '&callback=?';

                            //////console.log('PostUrl = '+ PostUrl);

                            //////console.log('data = '+ data);

                            //console.log(data);


if(sessionStorage.getItem('lastAlertMIDSend') !== data.mid){
    sessionStorage.setItem('lastAlertMIDSend',data.mid);

//window.plugins.toast.show('Message send SuccesFully', 'short', 'top');

}


                            $$.ajax({
                                method: 'POST',
                                dataType: 'jsonp',
                                url: PostUrl,
                                crossDomain: true,
                                data: data,
                                success: function(responseData, textStatus, jqXHR) {
                                    ////console.log('success : JsonMessagesToSend');
                                    console.log(responseData, textStatus, jqXHR);
                                    //console.log(jqXHR);

                                    if (responseData === '') {
                                        ////console.log('Ooeps no mid to deliver the mess. mess will be wiped. midid = ' + data.mid);
                                        //console.log(data);

                                        app.db.transaction(function(tx) {
                                            tx.executeSql(removeMessagesToSend, [data.mid], onRemovedSuccess, onError);
                                        });

                                        cryptingStop();
                                    }


                                    if (responseData.indexOf('Error') >= 0) {
                                        ////console.log('Error');

                                        myApp.closeModal();

                                        console.log(localStorage.debugging);

                                        if (localStorage.debugging === 'true') {
                                            cryptingStop();
                                            myApp.hideIndicator();
                                            myApp.alert('Sorry some Error, <BR>' + responseData);
                                            console.log(PostUrl);

                                        } else {
                                            cryptingStop();
                                            console.log(PostUrl);
                                            myApp.hideIndicator();
                                            myApp.alert('Sorry main System Error, <BR>Pleasde try again later.<BR>', 'PEM Error!', function() {
                                                window.location.reload();
                                            });
                                        }

                                    } 

                                    else 


                                    {
                                        ////console.log('NO Error Send SuccesFul');

// window.plugins.toast.show('Message send SuccesFully', 'short', 'top');

                                                cryptingStop();

                                                messageSendSuccesFul();


                                        makeContactMessages(data.mdatum, data.his_uid, '20');

                                        app.db.transaction(function(tx) {
                                            ////console.log('............................................');
                                            ////console.log('removeMessagesToSend = ' + responseData);
                                            ////console.log('............................................');

                                            tx.executeSql(removeMessagesToSend, [responseData], onRemovedSuccess, onError);

                                            sessionStorage.setItem('lastMidSendIs', responseData);

                                            ////console.log('............................................');
                                            ////console.log('updateMessagesSendStatus = ' + data);
                                            // console.log(data);

                                            ////console.log('............................................');

                                            tx.executeSql(updateMessagesSendStatus, ['20', localStorage.getItem('UID'), data.his_uid, data.mdatum], onUpdateSuccessUpdateStatus(), onError);

                                            function onUpdateSuccessUpdateStatus() {

                                                data = '';

                                                totalMessageUpdate();

                                            }


                                        });


                                    } // end else                               


                                },
                                error: function(responseData, textStatus, jqXHR) {
                                    ////console.log('Error : JsonMessagesToSend');
                                    console.log(textStatus, jqXHR);
                                    console.log(PostUrl);
                                    cryptingStop();
                                    //        JsonMessagesToSend();
                                },
                                complete: function(responseData, textStatus, jqXHR) {
                                    ////console.log('complete : JsonMessagesToSend');

                                    sessionStorage.setItem('functionJsonMessagesToSendBusy', '0');
                                }

                            }); //end ajax
                            //////console.log('AJAX Done!');
                        }


                    } //end if data
                    else

                    {
                        ////console.log('Fn JsonMessagesToSend NOTHING TO DO.......1');
                        // alert user dont exist 
                        cryptingStop();
                    }

                    //////console.log('Fn JsonMessagesToSend NOTHING TO SEND.......2');
                }

            }

        }


    ////console.log('Fn JsonMessagesToSend End');

    }


    app.selectAllRecords(render);

}




//------------------------------------------------------------//  

function insertmessageintodbase(dmy_uid, dhis_uid, dmessage, dmdatum) {
    ////console.log('!!!  Fn insertmessageintodbase =' + dmdatum);

    if (sessionStorage.getItem('lastInsertmessageintodbase') !== dmdatum) {

        sessionStorage.setItem('lastInsertmessageintodbase', dmdatum);

        ////console.log('!!!  Fn lastInsertmessageintodbase not the same =' + dmdatum);

        app.db.transaction(function(tx) {
            //////console.log('+++ Fn insertmessageintodbase = ' +dmy_uid + ' - ' +dhis_uid + ' - ' +dmessage+ ' - ' +dmdatum); 
            tx.executeSql(insertMessagesToReceive, [dmy_uid, dhis_uid, dmessage, dmdatum, '0'], makeContactMessages(dmdatum, dhis_uid), onError);
       

        });


    } 

    else 

    {
        ////console.log('!!!  Fn lastInsertmessageintodbase SAME SKIP=' + dmdatum);
    }


}


var idListToRemove = [];
//------------------------------------------------------------//  
function JsonMessagesSendStatus() {
    var uid = localStorage.getItem('UID');
    ////console.log('Fn JsonMessagesSendStatus Start');



    //setTimeout(function() {
    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: 'http://' + localStorage.getItem('server') +
            '.sslnoteserver.com/appie/php/include/JsonMessagesSendStatus.php?myAppapp=' +
            localStorage.getItem('myAppapp') + '&callback=?',
        crossDomain: true,
        data: {
            uid: uid
        },

        success: function(responseData, textStatus, jqXHR) {
                // ////console.log('............................................');
                // ////console.log('responseData JsonMessagesSendStatus = '+responseData); 
                // ////console.log('............................................');

                //var deletemid = [];

                if (responseData) {

                    // if(responseData !== sessionStorage.lastMessagesSendStatusList) {

                    // ////console.log('SOMETHING TO UPDATE lastMessagesSendStatusList UPDATE');

                    // ////console.log('............................................');
                    // ////console.log('responseData JsonMessagesSendStatus = '+responseData); 
                    // ////console.log('............................................');

                    sessionStorage.lastMessagesSendStatusList = responseData;

                    var obj = JSON.parse(responseData);

                    for (var key in obj) {

                        var data = obj[key];
                        // //console.log(data.id);
                        if (data.id != null) {

                            var id = data.id;
                            var dmy_uid = data.my_uid;
                            var dhis_uid = data.his_uid;
                            var dsendStatus = data.sendStatus;
                            var dmdatum = data.mdatum;

                            fnUpdateMessagesSendStatus(id, dmy_uid, dhis_uid, dsendStatus, dmdatum);

                        }
                    }
                    // } // end if !responseData

                } // end if responseData


            } // end suscces

    }); // end AJAX



    if (sessionStorage.idListToRemove) {

        ////console.log('SEND TO SERVER TO DELETE sessionStorage.idListToRemove', sessionStorage.idListToRemove);

        $$.ajax({
            method: 'POST',
            dataType: 'jsonp',
            url: 'http://' + localStorage.getItem('server') +
                '.sslnoteserver.com/appie/php/include/JsonStatusToDelete.php?&callback=?',
            crossDomain: true,
            data: {
                id: sessionStorage.idListToRemove
            },
            success: function(responseData, textStatus, jqXHR) {
                // ////console.log('............................................');
                ////console.log('responseData JsonStatusToDelete = '+responseData ); 
                // ////console.log('responseData JsonStatusToDelete = '+textStatus ); 
                // ////console.log('responseData JsonStatusToDelete = '+jqXHR ); 
                // ////console.log('............................................');

                sessionStorage.idListToRemove = '';

            }

        });

    }

////console.log('Fn JsonMessagesSendStatus End');

}

//------------------------------------------------------------//  



function fnUpdateMessagesSendStatus(id, dmy_uid, dhis_uid, dsendStatus, dmdatum) {
    //////console.log('!!!  fnUpdateMessagesSendStatus: ',id, dmy_uid, dhis_uid, dsendStatus, dmdatum);

    app.db.transaction(function(tx) {


        if (dsendStatus <= '40') {
            //////console.log('!!!  fnUpdateMessagesSendStatus = ',dsendStatus);
            tx.executeSql(updateMessagesSendStatus, [dsendStatus, dmy_uid, dhis_uid, dmdatum], onUpdateMessagesSendStatusSuccesFull, onError);

            // var rdatum = dmdatum.replace(/ /g, "");
            // var rdatum = rdatum.replace(/-/g, "");
            // var rdatum = rdatum.replace(/:/g, "");
            var playSound = 'playSoundNO';

            makeContactMessages(dmdatum, dhis_uid, dsendStatus, playSound);

        }

        if (dsendStatus >= '50') {
            //////console.log('!!!  fnUpdateMessagesSendStatus = ',dsendStatus);

            tx.executeSql(removeMessagesByTmeDate, [dhis_uid, dmdatum], onUpdateMessagesSendStatusSuccesFull, onError);

            var rdatum = dmdatum.replace(/ /g, "");
            var rdatum = rdatum.replace(/-/g, "");
            var rdatum = rdatum.replace(/:/g, "");

            myMessagesList.update();

            myApp.swipeoutDelete('.li' + dhis_uid + rdatum);

            sessionStorage.totalMessagesList = Number(sessionStorage.totalMessagesList) - 1;

            //////console.log('!!!  swipeoutDelete = .li' + dhis_uid + rdatum);

        }
});




    function onUpdateMessagesSendStatusSuccesFull(tx, succes) // Function for Handling Error...
        {

            var ProwsAffected = JSON.stringify(succes.rowsAffected);

            //////console.log('ProwsAffected = ' +ProwsAffected);

            if (ProwsAffected === '0') {

                //////console.log('ProwsAffected = 0 - ' +ProwsAffected);  
                //////console.log('id = '+ id); 

                idListToRemove.push(id);

                //////console.log('id insert to array = '+ id); 

            }

            sessionStorage.idListToRemove = JSON.stringify(idListToRemove);

            return true;

        }
}

//------------------------------------------------------------//  

function JsonMessagesToReceive() {
    var uid = localStorage.getItem('UID');
    ////console.log('Fn JsonMessagesToReceive Start');

    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: 'http://' + localStorage.getItem('server') +
            '.sslnoteserver.com/appie/php/include/JsonMessagesToReceive.php?myAppapp=' +
            localStorage.getItem('myAppapp') + '&callback=?',
        crossDomain: true,
        data: {
            uid: uid
        },
        success: function(responseData, textStatus, jqXHR) {
                // ////console.log('............................................');
                // ////console.log('responseData JsonMessagesToReceive = '+responseData); 
                // ////console.log('............................................');


                var deletemid = [];
                var mdatumArray = [];

                if (responseData !== sessionStorage.JsonMessagesToReceive)

                {

                    ////console.log('sessionStorage.JsonMessagesToReceive not the same ');

                    sessionStorage.JsonMessagesToReceive = responseData;


                    var obj = JSON.parse(responseData);



                    for (var key in obj) {
                        var data = obj[key];
                        // //console.log(data.id);
                        if (data.id != null) {
                            deletemid.push(data.id);
                            ////////console.log('+++ data.id - data.mdatum = ' + data.id + ' - ' +data.mdatum);
                            //var insertdata = data.my_uid+','+data.his_uid+','+data.message+','+data.mdatum+',0';
                            var dmy_uid = data.my_uid;
                            var dhis_uid = data.his_uid;
                            var dmessage = data.message;
                            var dmdatum = data.mdatum;
                            mdatumArray.push(data.mdatum)

                            insertmessageintodbase(dmy_uid, dhis_uid, dmessage, dmdatum);
                        }


                    }


                    deletemid = JSON.stringify(deletemid);
                    mdatumArray = JSON.stringify(mdatumArray);
                    //deletemid = '[1]';
                    //console.log(deletemid);
                    //$$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
                    var themessage = localStorage.getItem('messagesdelivered'); // TRANSLATE
                    // time to delete

                    ////console.log('PushNotification = Deliverd');

                    console.log(deletemid);

                    console.log(mdatumArray);

                    var mdatum = data.mdatum;

                    console.log(mdatum);


                    if (sessionStorage.getItem('lastPushDeliveredSend') !== mdatumArray) {

                        sessionStorage.setItem('lastPushDeliveredSend', mdatumArray);

                        // setTimeout(function(){ 

                        $$.ajax({
                            method: 'POST',
                            dataType: 'jsonp',
                            url: 'http://' + localStorage.getItem('server') + '.sslnoteserver.com/appie/php/include/JsonMessagesToReceiveDelete.php?myAppapp=' +
                                localStorage.getItem('myAppapp') + '&themessage=' + themessage + '&callback=?',
                            crossDomain: true,
                            data: {
                                id: deletemid,
                                my_uid: data.my_uid,
                                his_uid: data.his_uid,
                                mdatum: mdatumArray,
                                themessage: themessage,
                                sendStatusUpdate: '30'
                            },
                            success: function(responseData, textStatus, jqXHR) {
                                //deletemid = '';
                                ////console.log('..............Success..............................');
                                console.log(responseData);
                                ////console.log('............................................');
                            },
                            error: function(responseData, textStatus, jqXHR) {
                                //deletemid = '';
                                ////console.log('..............Error..............................');
                                console.log(responseData, textStatus, jqXHR);
                                ////console.log('............................................');
                            },
                            complete: function(responseData, textStatus, jqXHR) {
                                deletemid = '';
                                //////console.log('..............Complete..............................');
                                //console.log(responseData,textStatus, jqXHR);
                                //////console.log('............................................');
                            }

                        });

                        ////console.log('Fn SQLiteUpdateMessagesTotal from Fn JsonMessagesToReceive');
                        SQLiteUpdateMessagesTotal();

                    }

                } // end if responseData
                else


                {
                    ////console.log('sessionStorage.JsonMessagesToReceive WELL the same ');
                }
            } // end suscces
    }); // end AJAX
    //}, 800);
    //////console.log('2 Fn makeContactlist from Fn JsonMessagesToReceive');
    //SQLiteUpdateMessagesTotal();

////console.log('Fn JsonMessagesToReceive End Call JsonMessagesSendStatus');
    JsonMessagesSendStatus();
}

//------------------------------------------------------------//  

function SQLiteUpdateMessagesTotal() {
        ////console.log('SQLiteUpdateMessagesTotal');

        app.db.transaction(function(tx) {

            tx.executeSql(updateBadgeTo, [], onUpdateSuccess, onError);

            tx.executeSql(updateTotalMessages, [], onUpdateSuccess, onError);

            totalMessageUpdate();

        });
        //hideBusy();
    } // end SQLiteUpdateMessagesTotal
    ///////////////////////////////////////

//------------------------------------------------------------//  

function totalMessageUpdate() {

    ////console.log('fn totalMessageUpdate');

    app.selectTotalMessages = function(fn) {
        app.db.transaction(function(tx) {
            //////console.log('Collect totalmessages');
            tx.executeSql(selectTotalMessages, [], fn, onError);
        });
    }

    var render = function(tx, rs) {

        for (var i = 0; i < rs.rows.length; i++)

            if (rs.rows.length) {

                for (var i = 0; i < rs.rows.length; i++) {

                    var totalMessage = rs.rows.item(i);

                    //  ////console.log('totalMessage.totalmessages = ' +totalMessage.totalmessages);

                    if (totalMessage.totalmessages >= '1') {
                        $('.totalMessages').addClass('badge badge-red');
                        $('.totalMessages').text(totalMessage.totalmessages);
                    } else {
                        $('.totalMessages').removeClass('badge badge-red');
                        $('.totalMessages').text('');
                    }

                }
            } 
            else 
            {
                ////console.log('RECORD DONT EXIST');
            }

            totalDataBaseMessages();

    };

    app.selectTotalMessages(render);

}


//------------------------------------------------------------//  

function totalContacts() {

    ////console.log('fn totalContacts');

    app.selectTotalContacts = function(fn) {
        app.db.transaction(function(tx) {
            //////console.log('Collect totalmessages');
            tx.executeSql(selectTotalContacts, [], fn, onError);
        });
    }

    var render = function(tx, rs) {

            for (var i = 0; i < rs.rows.length; i++)

            if (rs.rows.length) {

                for (var i = 0; i < rs.rows.length; i++) {

                    var total = rs.rows.item(i);


////console.log('!!! ---------------------------------------------------');
////console.log('total.totalcontacts = ' +total.totalcontacts);
////console.log('!!! ---------------------------------------------------');




var maxlink = localStorage.getItem('maxlink');

////console.log('!!! ---------------------------------------------------');
////console.log('maxlink: ', maxlink);
////console.log('!!! ---------------------------------------------------');

localStorage.setItem('contactallowed','yes');

if(total.totalcontacts >= maxlink ){ 
////console.log('!!! ---------------------------------------------------');
////console.log('ADD CONTACT NOT ALLOWED');
////console.log('!!! ---------------------------------------------------');
localStorage.setItem('contactallowed','no');
}





                }
            } 





    };

    app.selectTotalContacts(render);

}

//------------------------------------------------------------//  


function totalDataBaseMessages() {

    ////console.log('fn totalDataBaseMessages');

    app.selectTotalDataBaseMessagesReceived = function(fn) {
        app.db.transaction(function(tx) {
            //////console.log('Collect totalmessages');
            tx.executeSql(selectTotalDataBaseMessagesReceived, [], fn, onError);
        });
    }

    var render = function(tx, rs) {

        for (var i = 0; i < rs.rows.length; i++)

            if (rs.rows.length) {

                for (var i = 0; i < rs.rows.length; i++) {

                    var totalDataBaseMessageRecieved = rs.rows.item(i);

                    var totalDataBaseMessageNrReceived = totalDataBaseMessageRecieved.totalDataBaseMessagesReceived;

                    ////console.log('+++ totalDataBaseMessageNrReceived = ' +totalDataBaseMessageNrReceived);

                    // $$('.running').html('R='+totalDataBaseMessageNrReceived);

                    sessionStorage.totalDataBaseMessageNrReceived = totalDataBaseMessageNrReceived;
                }
            } else {
                ////console.log('NO totalDataBaseMessages');
            }
    };
    app.selectTotalDataBaseMessagesReceived(render);



    app.selectTotalDataBaseMessagesSend = function(fn) {
        app.db.transaction(function(tx) {
            //////console.log('Collect totalmessages');
            tx.executeSql(selectTotalDataBaseMessagesSend, [], fn, onError);
        });
    }

    var render = function(tx, rs) {

        for (var i = 0; i < rs.rows.length; i++)

            if (rs.rows.length) {

                for (var i = 0; i < rs.rows.length; i++) {

                    var totalDataBaseMessageSend = rs.rows.item(i);

                    var totalDataBaseMessageNrSend = totalDataBaseMessageSend.totalDataBaseMessagesSend;

                    ////console.log('+++ totalDataBaseMessageNrSend = ' +totalDataBaseMessageNrSend);

                    //$$('.running').html('S='+totalDataBaseMessageNrSend);

                    sessionStorage.totalDataBaseMessageNrSend = totalDataBaseMessageNrSend;
                }
            } else {
                ////console.log('NO totalDataBaseMessages');
            }



$$('.DataBaseMessages').html('(S'+sessionStorage.totalDataBaseMessageNrSend+')(R'+sessionStorage.totalDataBaseMessageNrReceived+')');


    };

    
    app.selectTotalDataBaseMessagesSend(render);

}




//------------------------------------------------------------//  



function insertMessageSQLite(mid, thekey, his_uid, his_server, message_new, message_old, activeLi) {

    // ////console.log('------------------------------------');
    // ////console.log('Fn insertMessageSQLite');
    // ////console.log('mid = ' + mid);
    // ////console.log('thekey = ' + thekey);
    // ////console.log('his_uid = ' + his_uid);
    // ////console.log('his_server = ' + his_server);
    // ////console.log('message_new = ' + message_new);
    // ////console.log('message_old = ' + message_old);
    // ////console.log('activeLi = ' + activeLi);
    // ////console.log('------------------------------------');


    //cryptingStart();

    if (his_server === 'undefined')

    {
        // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 
        myApp.modal({
            title: localStorage.getItem('crypting'),
            text: localStorage.getItem('oepsaerror'),
            buttons: [{
                text: localStorage.getItem('OKE'),
                onClick: function() {
                    var themessage = 'Missing his_server'; // TRANSLATE
                    PushErrorToSupport(themessage);

                    cryptingStop();

                    var activePage = localStorage.getItem('activePage');

                    ////console.log('Load Page activePage = ' + activePage);

                    if (activePage === 'Smessages-send') {

                        messagesview.router.load({
                            url: 'frames/messages/messages.html'
                        });
                    }

                    if (activePage === 'Smessages-send-new') {

                        contactsview.router.load({
                            url: 'frames/contacts/contacts.html'
                        });
                    }

                    ////console.log('We load Page activePage = ' + activePage);

                }
            }, ]
        })

    } 

    else

    {

        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        var mDate = new Date();

        var time_now = addZero(mDate.getHours()) + ':' + addZero(mDate.getMinutes()); // time() returns a time in seconds already
//MONTH        
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var date_now = mDate.getDate() + ' ' + monthNames[mDate.getMonth()] + ' ' + mDate.getFullYear(); // time() returns a time in seconds already
        var uid = localStorage.getItem('UID');


        //////console.log('mDate = ' + mDate);

        if (message_old !== '') {

            var he = new RegExp('he said', 'g');
            message_old = message_old.replace(he, his_uid);

            var i = new RegExp('i said', 'g');
            message_old = message_old.replace(i, uid);
            //////console.log('DO message_old is not empty');

            var removemessagelast = new RegExp('message-last', 'g');
            message_old = message_old.replace(removemessagelast, '');
            //////console.log('DO message_old is not empty');








            if (sessionStorage.getItem('imageURL') || sessionStorage.getItem('vCardstore') ) {
                var imageURL= '';
                var vCardstore= ''; 

                if(sessionStorage.getItem('imageURL') !== null && sessionStorage.getItem('imageURL') !== undefined ) { var imageURL = sessionStorage.getItem('imageURL') };
                if(sessionStorage.getItem('vCardstore')!== null && sessionStorage.getItem('vCardstore') !== undefined) { var vCardstore = sessionStorage.getItem('vCardstore') } ;


                //////console.log('imageURL= ' +imageURL);
                var message = message_old +
                    "<div class='message message-send message-last'>" +
                    "<div class='message-name'>" + uid + " (" + time_now +
                    ")</div>" + 

                imageURL + 
                vCardstore + 

                 "<div class='message-text'>" +
                    message_new + "</div></div>";
            } 

            else 

            {
                var message = message_old +
                    "<div class='message message-send message-last'>" +
                    "<div class='message-name'>" + uid + " (" + time_now +
                    ")</div>" + "<div class='message-text'>" + message_new +
                    "</div></div>";
            }
        } // end if message_old not empty


// NEW MESSAGE

        else

        {
            ////console.log('DO message_old is empty');




            if (sessionStorage.getItem('imageURL') || sessionStorage.getItem('vCardstore') ) {

                var imageURL = '';
                var vCardstore = ''; 

                if(sessionStorage.getItem('imageURL') !== null && sessionStorage.getItem('imageURL') !== undefined ) { var imageURL = sessionStorage.getItem('imageURL') };
                if(sessionStorage.getItem('vCardstore') !== null && sessionStorage.getItem('vCardstore') !== undefined) { var vCardstore = sessionStorage.getItem('vCardstore') } ;



                //////console.log('imageURL= ' +imageURL);

                var message = 
                "<div class='messages-date'>" +
                "   <span>" + date_now +"</span>" +
                "</div>" +
                "<div class='message message-send message-last'>" +
                "<div class='message-name'>" + uid + " (" + time_now + ")</div>" +

                imageURL + 
                vCardstore + 

                "<div class='message-text'>" + message_new + "</div></div>";
            } 

            else 

            {
                var message = "<div class='messages-date'><span>" + date_now +
                    "</span></div><div class='message message-send message-last'>" +
                    "<div class='message-name'>" + uid + " (" + time_now +
                    ")</div>" + "<div class='message-text'>" + message_new +
                    "</div></div>";
            }
        } // end if message_old is empty


        var key2 = thekey.toLowerCase();
        //////console.log('key2 = ' +key2);
        sessionStorage.setItem(sessionStorage.getItem('his_uid') + 'encryptkey', key2);

        var datatosend = sjcl.encrypt(key2, message);


        var mDate = DateTimeNow();


        app.db.transaction(function(tx) {
            ////console.log('insertUIDMessagesIntoSqlite');

            // tx.executeSql(insertMessagesToReceive, [localStorage.getItem('UID'), his_uid, '', mDate, '10'], onInsertSuccessMessagesToReceive, onError);
            
tx.executeSql(insertMessagesToReceive, [localStorage.getItem('UID'), his_uid, message_new, mDate, '10'], onInsertSuccessMessagesToReceive, onError);
           





            tx.executeSql(insertUIDMessagesSend, [localStorage.getItem('UID'), his_uid, his_server, datatosend, mDate, '0', '0', '0', '0'], onInsertSuccessMessagesToSend, onError);


            ////console.log('............................................');
            ////console.log('insertMessagesToReceive = ' + localStorage.getItem('UID') + his_uid + message_new + mDate + '10');
            ////console.log('............................................');

         sessionStorage.removeItem('imageURL');
         sessionStorage.removeItem('vCardstore'); 

            // append send message

            function onInsertSuccessMessagesToReceive() {

                //console.log("onInsertSuccessMessagesToReceive fn makeContactMessages");

if (mid) {


////console.log('removeMessagesToReceive = ' + mid);


tx.executeSql(removeMessagesToReceive, [mid], onRemovedMessagesSuccess, onError);

tx.executeSql(updateBadgeTo, [], onUpdateSuccess, onError);




                makeContactMessages(mDate, his_uid, '10');

                data = '';

                cryptingStop();

                ////console.log('*** cryptingStop = ');

                totalMessageUpdate();

} // end no mid

else


{

                makeContactMessages(mDate, his_uid, '10');

                data = '';

                cryptingStop();

                ////console.log('*** cryptingStop = ');

                totalMessageUpdate();


}

                //return true;
            }


            function onInsertSuccessMessagesToSend() {
                        //console.log("onInsertSuccessMessagesToSend fn makeContactMessages");
                        JsonMessagesToSend();
            }








                            function onRemovedMessagesSuccess() {
                                //////console.log('+++++++ onRemovedSuccess =' + onRemovedSuccess); 

var selectItemId = JSON.parse(sessionStorage.getItem('selectItemId'));

////console.log('+++++++ selectItemId: ', selectItemId); 

myMessagesList.deleteItem(selectItemId);

sessionStorage.totalMessagesList = Number(sessionStorage.totalMessagesList) - 1;

sessionStorage.removeItem('selectItemId');



                myApp.showTab('#messagesview');

                setTimeout(function() {
                    messagesview.router.back({
                        url: 'frames/messages/messages.html',
                        animatePages: false,
                        reload: true
                    });
                }, 400);

                            if (sessionStorage.getItem('Pushmdatum') != null)

                                {
                                    var themessage = 'wiped'; // TRANSLATE


                                    // var themessage = 'replied'; // TRANSLATE

                                    ////console.log('Send PushNotification = Replied')

                                    ////console.log('PushDatum = ' + sessionStorage.getItem('Pushmdatum'));


                                    $$.ajax({
                                        method: 'POST',
                                        dataType: 'jsonp',
                                        url: localStorage.getItem('pushserver'),
                                        crossDomain: true,
                                        data: {
                                            my_uid: localStorage.getItem('UID'),
                                            his_uid: his_uid,
                                            themessage: themessage,
                                            mdatum: sessionStorage.getItem('Pushmdatum'),
                                            sendStatusUpdate: '50'
                                        },
                                        success: function(responseData, textStatus, jqXHR) {
                                            ////console.log('PUSH MESSAGE WIPE SEND..');
                                            console.log(responseData, textStatus, jqXHR);

                                        }
                                    });
                                }



                            } // end onRemovedSuccess




            sessionStorage.removeItem('imageURL');

            myApp.hidePreloader();




        });
    }

}


//------------------------------------------------------------//  

function importNewUIDLinks() {
    ////console.log('*** Fn importNewUIDLinks Started');

    $$('.importNewUIDLinks').html('<img src="img/loader.png" height="15" width="15">');

    var uid = localStorage.getItem('UID');


    console.log(localStorage.getItem('connection'));
    console.log(localStorage.getItem('UID'));

    //myApp.showIndicator();
    $$.post(localStorage.getItem('connection') +
        '/appie/php/include/JsonImportUIDLinks.php?uid=' + uid +
        '&myAppapp=' + localStorage.getItem('myAppapp'),
        function(responseData) {
            ////////console.log('*** Fn importNewUIDLinks responseData = ' +responseData);  
            if (responseData) {

                //////console.log('*** importNewUIDLinks A = ' + responseData);


                if (responseData.indexOf('Error') >= 0) {
                    ////console.log('Error');

                    myApp.closeModal();

                    if (localStorage.debugging == 'true') {
                        myApp.alert('Sorry some Error, <BR>' + responseData);
                    } else {
                        myApp.alert('Sorry main System Error, <BR>Pleasde try again later.<BR>', 'PEM Error!', function() {
                            window.location.reload();
                        });
                    }
                } 

                else 

                {
                    ////console.log('NO Error');

                    ////console.log('*** IMPORT UIDLINKS B = ');

                    app.db.transaction(function(tx) {
                        ////console.log('dropUIDLinks');

                        tx.executeSql(dropUIDLinks, [], onRemovedSuccess, onError);

                        ////console.log('createUIDLinks');
                        tx.executeSql(createUIDLinks, [], onUpdateSuccess, onError);
                    });


                    app.db.transaction(function(tx) {

                        var obj = JSON.parse(responseData);


                        for (var key in obj) {

                            var data = obj[key];

                            // ////console.log('data.his_uid = ' +data.his_uid);
                            // ////console.log('data.his_nick = ' +data.his_nick);
                            // ////console.log('data.his_server = ' +data.his_server);
                            // ////console.log('data.active_last = ' +data.active_last);
                            //////console.log('*** updateUIDLinks');


                            localStorage.removeItem(data.his_uid + 'encryptkey');
                            sessionStorage.removeItem(data.his_uid + 'encryptkey');

                            //var testonline = "2015-06-01 00:00:01";

                            //////console.log('updateUIDLinks');

                            ////console.log('*** importNewUIDLinks DATA AA = ' + data);

                            console.log(data);

                            tx.executeSql(updateUIDLinks, [uid, data.his_uid, data.his_nick, data.his_server, data.active_last, '0'], onInsertSuccess, onError);

                        } // end for




                    }); // end app.db.transaction

                        ////console.log('importNewUIDLinks makeContactlist');



                        setTimeout(function() {
                            contactsview.reloadPage();
                        }, 1000);

                    // norecordes forward to contactadd

                } // end

            } // end if responseData
            else

            {
                ////console.log('NOTHING TO IMPORT ADD NEW');
                app.db.transaction(function(tx) {
                    //////console.log('insertTestUID ');
                    var testonline = "2015-06-01 17:05:47";
                    //console.log(testonline);
                    tx.executeSql(insertSupportUID, [localStorage.getItem('UID'), localStorage.getItem('testUID'), localStorage.getItem('testNick'), localStorage.getItem('testserver'), '0', '0', '0'], onInsertSuccess, onError);
                });

                var posturl =
                    localStorage.getItem('connection') + '/appie/php/include/JsonInsertUIDLinks.php?myAppapp=' +
                    localStorage.getItem('myAppapp') + '&my_server=' +
                    localStorage.getItem('server') + '&my_uid=' +
                    localStorage.getItem('UID') + '&my_nick=' +
                    localStorage.getItem('UID') + '&his_uid=' +
                    localStorage.getItem('testUID') + '&his_server=' +
                    localStorage.getItem('testserver') + '&his_nick=' +
                    localStorage.getItem('testNick');
                //console.log(posturl);

                $$.post(posturl, function(data) {
                    //////console.log('**************************************');
                    //////console.log('POST RESPONSE INSERT');
                    //console.log(data);
                    //////console.log('**************************************');
                });

            }


            $$('.importNewUIDLinks').html('');

// myApp.alert('SYNC CONTACT LIST DONE');

        }); //end contact verzoek check
}




function fNupdateUIDServer() {

    ////console.log('*** Fn updateUIDServer Started');

    $$('.importNewUIDLinks').html('<img src="img/loader.png" height="15" width="15">');

    var uid = localStorage.getItem('UID');


    console.log(localStorage.getItem('connection'));
    console.log(localStorage.getItem('UID'));

    //myApp.showIndicator();
    $$.post(localStorage.getItem('connection') +
        '/appie/php/include/JsonImportUIDLinks.php?uid=' + uid +
        '&myAppapp=' + localStorage.getItem('myAppapp'),
        function(responseData) {

            ////console.log('*** Fn updateUIDServer responseData = ' +responseData);  

            if (responseData) {

                //////console.log('*** IMPORT UIDLINKS A = ' + responseData);


                if (responseData.indexOf('Error') >= 0) {
                    ////console.log('Error');

                    myApp.closeModal();

                    if (localStorage.debugging == 'true') {
                        myApp.alert('Sorry some Error, <BR>' + responseData);
                    } else {
                        myApp.alert('Sorry main System Error, <BR>Pleasde try again later.<BR>', 'PEM Error!', function() {
                            window.location.reload();
                        });
                    }
                } 

                else 

                {
                    ////console.log('NO Error updateUIDServer');

                    //////console.log('*** IMPORT UIDLINKS B = ');

                    // app.db.transaction(function(tx) {
                    //     ////console.log('dropUIDLinks');

                    //     tx.executeSql(dropUIDLinks, [], onRemovedSuccess, onError);

                    //     ////console.log('createUIDLinks');
                    //     tx.executeSql(createUIDLinks, [], onUpdateSuccess, onError);

                    // });


                    app.db.transaction(function(tx) {

                        var obj = JSON.parse(responseData);


                        for (var key in obj) {

                            var data = obj[key];

                            // ////console.log('data.his_uid = ' +data.his_uid);
                            // ////console.log('data.his_nick = ' +data.his_nick);
                            // ////console.log('data.his_server = ' +data.his_server);
                            // ////console.log('data.active_last = ' +data.active_last);

//////console.log('data.id = ' +data.id);

                            ////console.log('*** updateUIDServer');


                            localStorage.removeItem(data.his_uid + 'encryptkey');

                            sessionStorage.removeItem(data.his_uid + 'encryptkey');

                            //var testonline = "2015-06-01 00:00:01";

                            //////console.log('updateUIDLinks');

                            ////console.log('*** updateUIDServer A :' ,data);

                            //console.log(data);

                           //tx.executeSql(updateUIDLinks, [uid, data.his_uid, data.his_nick, data.his_server, data.active_last, '0'], onInsertSuccess, onError);

                            tx.executeSql(updateHisServer, [data.his_server ,data.his_uid], onInsertSuccess, onError);



                // send id delete

                        $$.post(localStorage.getItem('connection') +
                            '/appie/php/include/Ccontactcheckreturn.php?uid=' +
                            localStorage.getItem('UID') + '&myAppapp=' +
                            localStorage.getItem('myAppapp') + '&my_server=' +
                            localStorage.getItem('server')+ '&action=del&id=',

                            function(data) {
                                ////console.log('*** updateUIDServer DEL :' ,data);
                            });



                            //makeNewContactList();


                        } // end for

                    }); // end app.db.transaction


                        makeNewContactList();



                        ////console.log('updateUIDServer makeContactlist');

                } // end

            } // end if responseData

            $$('.importNewUIDLinks').html('');

        }); //end contact verzoek check
}



function updateUIDOnline() {

    ////console.log('*** Fn updateUIDOnline Started');

    $$('.importNewUIDLinks').html('<img src="img/loader.png" height="15" width="15">');

    var uid = localStorage.getItem('UID');


    console.log(localStorage.getItem('connection'));
    console.log(localStorage.getItem('UID'));

    //myApp.showIndicator();
    $$.post(localStorage.getItem('connection') +
        '/appie/php/include/JsonImportUIDLinks.php?uid=' + uid +
        '&myAppapp=' + localStorage.getItem('myAppapp'),
        function(responseData) {

            //////console.log('*** Fn updateUIDOnline responseData = ' +responseData);  
            if (responseData) {

                //////console.log('*** IMPORT UIDLINKS A = ' + responseData);


                if (responseData.indexOf('Error') >= 0) {
                    ////console.log('Error');

                    myApp.closeModal();

                    if (localStorage.debugging == 'true') {
                        myApp.alert('Sorry some Error, <BR>' + responseData);
                    } else {
                        myApp.alert('Sorry main System Error, <BR>Pleasde try again later.<BR>', 'PEM Error!', function() {
                            window.location.reload();
                        });
                    }
                } 

                else 

                {
                    ////console.log('NO Error updateUIDOnline');

                    //////console.log('*** IMPORT UIDLINKS B = ');

                    // app.db.transaction(function(tx) {
                    //     ////console.log('dropUIDLinks');

                    //     tx.executeSql(dropUIDLinks, [], onRemovedSuccess, onError);

                    //     ////console.log('createUIDLinks');
                    //     tx.executeSql(createUIDLinks, [], onUpdateSuccess, onError);

                    // });


                    app.db.transaction(function(tx) {

                        var obj = JSON.parse(responseData);


                        for (var key in obj) {

                            var data = obj[key];

                            // ////console.log('data.his_uid = ' +data.his_uid);
                            // ////console.log('data.his_nick = ' +data.his_nick);
                            // ////console.log('data.his_server = ' +data.his_server);
                            // ////console.log('data.active_last = ' +data.active_last);
                            // ////console.log('*** updateUIDOnline');


                            localStorage.removeItem(data.his_uid + 'encryptkey');

                            sessionStorage.removeItem(data.his_uid + 'encryptkey');

                            //var testonline = "2015-06-01 00:00:01";

                            //////console.log('updateUIDLinks');

                            // ////console.log('*** updateUIDOnline A :' ,data);

                            // console.log(data);

                           //tx.executeSql(updateUIDLinks, [uid, data.his_uid, data.his_nick, data.his_server, data.active_last, '0'], onInsertSuccess, onError);

tx.executeSql(updateHisOnline, [data.active_last ,data.his_uid], onInsertSuccess, onError);



                        } // end for




                    }); // end app.db.transaction


                        makeNewContactList();


                        ////console.log('updateUIDOnline makeContactlist');


                        setTimeout(function() {
                            contactsview.reloadPage();
                        }, 1000);

                    // norecordes forward to contactadd

                } // end

            } // end if responseData
            
            $$('.importNewUIDLinks').html('');

        }); //end contact verzoek check
}


//------------------------------------------------------------//  

function iAmOnline() {

    ////console.log('***** iAmOnlineLoop By Boot App *****');

    $$.post(localStorage.getItem('connection') +
        '/appie/php/include/iAmOnline.php?uid=' +
        localStorage.getItem('UID') + '&myAppapp=' + localStorage.getItem('myAppapp') + '&token=' + localStorage.getItem('token'),
        function(data) {}); // end post


    contactRequest();

    JsonMessagesSendStatus();

    JsonMessagesToReceive();

    JsonMessagesToSend();

    iAmOnlineLoop(); // start loop

}


function iAmOnlineLoop() {


    $$.post(localStorage.getItem('connection') +
         '/appie/php/include/iAmOnline.php?uid=' +
         localStorage.getItem('UID') + '&myAppapp=' + localStorage.getItem('myAppapp')+ '&token=' + localStorage.getItem('token'), function(data) {
     }); // end post

    //     JsonMessagesToSend();


    ////console.log('+++ !!! sessionStorage.totalMessagesList = ' + sessionStorage.totalMessagesList);

    loop = setTimeout(function() {

        ////console.log('***** iAmOnlineLoop Start Fn ***** 30 sec');

        JsonMessagesToReceive();

        JsonMessagesToSend();

        contactRequest();

        ////console.log('***** iAmOnlineLoop End Fn ***** 30 sec');

        var idListToRemove2 = JSON.stringify(idListToRemove);


        if (idListToRemove2 >= 1) {

            ////console.log('..............JsonStatusToDelete..............................');

            $$.ajax({
                method: 'POST',
                dataType: 'jsonp',
                url: 'http://' + localStorage.getItem('server') + '.sslnoteserver.com/appie/php/include/JsonStatusToDelete.php?callback=?',
                crossDomain: true,
                data: {
                    id: idListToRemove2,
                },
                success: function(responseData, textStatus, jqXHR) {
                    //deletemid = '';
                    //////console.log('..............Success..............................');
                    //console.log(responseData);
                    //////console.log('............................................');
                    //////console.log('idListToRemove RESET = ');

                    idListToRemove.length = 0;


                },
                error: function(responseData, textStatus, jqXHR) {
                    //deletemid = '';
                    ////console.log('..............Error..............................');
                    console.log(responseData, textStatus, jqXHR);
                    ////console.log('............................................');
                },
                complete: function(responseData, textStatus, jqXHR) {
                    //deletemid = '';
                    //////console.log('..............Complete..............................');
                    //console.log(responseData,textStatus, jqXHR);
                    //////console.log('............................................');
                }

            });
        }

        if (localStorage.debugging == 'true') {

            ////console.log('***** START CHECK MESSAGE TO SEND *****');
            console.log(localStorage.getItem('UID') + ' *** Fn iAmOnlineLoop ');

        }

        ////console.log('***** iAmOnlineLoop Call Loop ***** 30 sec');
        iAmOnlineLoop();

    }, 30000);


}



//------------------------------------------------------------//  

function myAppupdate() {
    var html = '<div class=\'animate-height\'> \t<div class=\'content-block tablet-inset\'> \t    <div class=\'content-block-inner\'> \t    \t<img src=\'iTunesArtwork.png\' style=\'width: 60px; height: 60px; vertical-align: top; float: left;\'> \t    \t<p style=\'margin: 0; margin-left: 8px;\'> \t    \t\t<span style=\'font-weight: 500; font-size: 16px; margin-left: 8px\'>Bug Reporter&#8311; {{version}}<br></span> \t    \t\t<span style=\'font-size: 14px; margin-left: 8px\'>Sniper_GER<br></span> \t    \t\t<span style=\'font-size: 14px; margin-left: 8px\'>Downloaded</span> \t    \t</p>\xA0\t    \t<p>{{description}}<br><br>For more information, visit:<br><a href=\'https://github.com/SniperGER/Bug-Reporter7\' class=\'external\' target=\'_blank\' style=\'text-decoration: underline;\'>https://github.com/SniperGER/Bug-Reporter7</a>{{instructions}}</p> \t    </div> \t</div> \t</div> \t<div class=\'list-block tablet-inset\'> \t    <ul> \t    \t<li> \t    \t\t<a href=\'#\' class=\'item-link open-popup\' data-popup=\'.popup-update-detail\'> \t    \t\t\t<div class=\'item-content\'> \t    \t\t\t\t<div class=\'item-inner\'> \t    \t\t\t\t\t<div class=\'item-title\'>Details</div> \t    \t\t\t\t</div> \t    \t\t\t</div> \t    \t\t</a> \t    \t</li> \t    </ul> \t</div> \t<div class=\'list-block tablet-inset\'> \t    <ul> \t    \t<li class=\'center item-button\'> \t    \t\t<a href=\'#\' class=\'update-button\'> \t    \t\t\t<div class=\'item-content\'> \t    \t\t\t\t<div class=\'item-inner\'> \t    \t\t\t\t\t<div class=\'item-title\' style=\'width: 100%;\'>Install</div> \t    \t\t\t\t</div> \t    \t\t\t</div> \t    \t\t</a> \t    \t</li> \t    </ul> \t</div>';
    $.getJSON('update.json', function(data) {
        $('p#update-status').closest('.page-content').html(html.replace(
            /{{version}}/g, data.en.updates[0].version).replace(
            /{{description}}/g, data.en.updates[0].description
        ).replace(/{{instructions}}/g, ''));
        $('span#content').html(data.en.updates[0].content);
        $('.update-button').on('click', function() {
            myApp.modal({
                title: 'Software Update',
                text: unescape('myApp ' + data.en.updates[0].version + ' will begin installing. The app will restart when installation is finished.'),
                buttons: [{
                    text: 'Later',
                    onClick: function() {
                        myApp.closeModal();
                    }
                }, {
                    text: 'Install',
                    bold: true,
                    onClick: function() {
                        myApp.hidePreloader();
                        $('body').append('<div class="update-view"><img src="iTunesArtwork.png" /></div>');
                        setTimeout(function() {
                            $('.update-view').append('<div class="progress-bar"><div class="inner-progress" id="update-progress"></div></div>');
                            interval = setInterval(function() {
                                addProgress('update-progress');
                            }, Math.random() * 750);
                        }, 1000);
                    }
                }]
            });
        });
    });
}

//------------------------------------------------------------//  


var progress = 0;


//------------------------------------------------------------//  

function giveRandom(limit) {
    return Math.floor(Math.random() * limit) + 1;
}

// //------------------------------------------------------------//  

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

//var pushNotification;

//------------------------------------------------------------//  




var os = myApp.device.os;
localStorage.setItem('device', os);
////console.log('device:',os);

// result contains any message sent from the plugin call

//------------------------------------------------------------//  

function successHandler(result) {
        ////console.log('successHandler result = ' + result);
    }
    // result contains any error description text returned from the plugin call

//------------------------------------------------------------//  

function errorHandler(error) {
        ////console.log('errorHandler error = ' + error);
    }
    // iOS



//------------------------------------------------------------//  

function tokenHandler(result) {
    // ////console.log('Fn tokenHandler = UID: ' +localStorage.getItem('UID') + ' - token: ' + result);

    // localStorage.setItem('token', result);

    // if (localStorage.getItem('UID')) {

    //     if (!localStorage.tokenUpdated) {

    //         var posturl =
    //             localStorage.getItem('connection') + '/appie/php/include/updatetoken.php?myAppapp=' +
    //             localStorage.getItem('myAppapp') + '&server=' +
    //             localStorage.getItem('server') + '&App=' + localStorage.getItem(
    //                 'App') + '&os=' + os + '&uid=' + localStorage.getItem(
    //                 'UID') + '&token=' + localStorage.getItem('token');

    //            console.log(posturl);     

    //         $$.post(posturl, function(data) {
    //             //////console.log('**************************************');
    //             ////console.log('POST RESPONSE FN tokenHandler ');
    //             console.log(data);
    //             myApp.hideIndicator();
    //             //////console.log('**************************************');
    //             if (!myApp.formGetData('settings-pushnotification')) {
    //                 //////console.log('! NO settings-pushnotification');
    //                 myApp.formStoreData(
    //                     'settings-pushnotification', {
    //                         'pushreceived': ['on'],
    //                         'pushread': ['on'],
    //                         'pushwipe': ['on']
    //                     });
    //             }
    //             if (!myApp.formGetData('settingslogoff')) {
    //                 //////console.log('! NO settingslogoff');
    //                 myApp.formStoreData('settingslogoff', {
    //                     'autologoff': '3'
    //                 });
    //             }
    //             if (!myApp.formGetData('settings-notification')) {
    //                 //////console.log('! NO settings-notification');
    //                 myApp.formStoreData('settings-notification', {
    //                     'sound': '1.m4a',
    //                     'volume': '50',
    //                     'repeatpush': ['on'],
    //                     'slider': 10
    //                 });
    //             }
    //             if (!myApp.formGetData('settings-containers')) {
    //                 //////console.log('! NO settings-containers');
    //                 myApp.formStoreData('settings-containers', {
    //                     'my-container': 'RUSSIA'
    //                 });
    //             }
    //         }); // end post

    //         localStorage.tokenUpdated = true;
    //     } // end if localStorage
    // } // end if UID
}





//------------------------------------------------------------//  

function DeleteUidLink(d) {

    var DeleteUidLinkiD = d.getAttribute('data-id');
    var DeleteUidLinkHisUID = d.getAttribute('his_nick');  
     
    ////console.log('DeleteUidLink = ', DeleteUidLinkiD );


    //   myApp.alert('Are you sure?<br>Delete link with<br>' + DeleteUidLinkiD);
    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json",
        function(languageSpecificObject) {
            myApp.confirm('Are you sure?', 'Delete <br>' +
                DeleteUidLinkiD + '<br>(' + DeleteUidLinkHisUID + ')',

                function() {
                    //myApp.showPreloader(languageSpecificObject.languageSpecifications[0]['deleting']);
                   
                    app.db.transaction(function(tx) {
                        //////console.log('Fn removeUIDlinks '); 
                        tx.executeSql(removeUIDlinks, [DeleteUidLinkiD], onRemovedSuccess, onError);
                        makeNewContactList();

                    });

                    // delete remote uids_links
                    var posturl =
                        localStorage.getItem('connection') + '/appie/php/include/JsonRemoveUIDLinks.php?myAppapp=' +
                        localStorage.getItem('myAppapp') +
                        '&server=' + localStorage.getItem('server') +
                        '&uid=' + localStorage.getItem('UID') +
                        '&his_uid=' + DeleteUidLinkiD;

                    //console.log(posturl);
                    $$.post(posturl, function(data) {
                        ////console.log('**************************************');
                        ////console.log('POST RESPONSE DELETE');
                        console.log(data);
                        myApp.hidePreloader();
                        //////console.log('**************************************');
                        var data = 'Delete <br>' +
                        DeleteUidLinkiD + '<br>(' +
                        DeleteUidLinkHisUID + ')<br>SuccesFully.';
                        myApp.hidePreloader();

                        syncUILinks();
                        // $$.getJSON("i18n/"+localStorage.getItem('cLANGUAGE')+"/strings.json" , function(languageSpecificObject) { 


                        myApp.modal({
                            title: localStorage.getItem('contactlink'),
                            text: data,
                            verticalButtons: true,
                            buttons: [{
                                text: localStorage.getItem('OKE'),
                                onClick: function() {
                                    // window.location.reload();
                                    //////console.log('NO Contactlist create new');
                                    //  makeContactlist();
                                    //////console.log('makeContactlist();');
                                    myApp.hidePreloader();
                                    // mainView.loadPage('frames/contacts/Scontactlist.html');
                                    contactsview.router.refreshPage();
                                }
                            }, ]
                        });
                        //});
                        // }); // end post
                    });
                },
                function() {
                    ////console.log('myApp.swipeoutClose(); canceled');
                    myApp.swipeoutClose();
                    contactsview.router.refreshPage();
                    //  makeContactlist();
                    //////console.log('You clicked Cancel button');
                });
        });
}

//------------------------------------------------------------//  

function KeySettings(d) {
    ////console.log('KeySettings = ');
    var KeySettingsiD = d.getAttribute('data-id');
    var KeySettingsHis_nick = d.getAttribute('his_nick');

    myApp.allowSwipeout = true;
    //  myApp.alert('Are you sure?<br>Set Key Settings<br>' + KeySettingsiD);

    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
        "/strings.json",
        function(languageSpecificObject) {
            //languageSpecificObject.languageSpecifications[0]['crypting'],
            myApp.modal({
                title: languageSpecificObject.languageSpecifications[0]['keysettings'],
                text: languageSpecificObject.languageSpecifications[0]['keysettingstxt'] + '<br>(' + KeySettingsHis_nick + ')',
                buttons: [{
                    text: '<center><i class="icons_modalcancel"></i></center>',
                    onClick: function() {
                        //makeContactlist();
                        ////console.log('You clicked Cancel button');


                        myApp.swipeoutClose();
                        // setTimeout(function(){
                        contactsview.router.refreshPage();
                    }
                }, {
                    text: '<center><i class="icons_keysave"></i></center>',
                    onClick: function() {
                        // myApp.alert('You clicked second button!')
                        myApp.prompt(
                            languageSpecificObject.languageSpecifications[0]['whatkeytouse'] + '<br>' +
                            KeySettingsHis_nick, languageSpecificObject.languageSpecifications[0]['keysettings'],
                            function(value) { //oke 

                                var str = value;
                                var tempkey = str.toLowerCase();
                                var tempkey = calcMD5(tempkey);

                                ////console.log('+++ str = ' + str);
                                ////console.log('+++ tempkey = ' + tempkey);
                                ////console.log('+++ KeySettingsiD = ' + KeySettingsiD);


                                localStorage.setItem(KeySettingsiD + 'encryptkey', tempkey);




                                app.db.transaction(
                                    function(tx) {
                                        //////console.log('Fn KeySettings '); 
                                        tx.executeSql(updateKey, ['1', tempkey, KeySettingsiD], onUpdateSuccess, onError);


                                        makeNewContactList();



                                    });

                                myApp.modal({
                                    title: languageSpecificObject.languageSpecifications[0]['keyset'],
                                    text: languageSpecificObject.languageSpecifications[0]['keysetxt'],
                                    verticalButtons: true,
                                    buttons: [{
                                        text: localStorage.getItem('OKE'),
                                        onClick: function() {
                                            //////console.log('NO Contactlist create new');
                                            //makeContactlist();
                                            ////console.log('KEY SET');
                                            myApp.swipeoutClose();


                                            // setTimeout(function(){

                                                sessionStorage.setItem('doReload', '1');

                                            ////console.log('RELOADPAGE');

                                            makeNewMessageList('noLoad');       

                                            contactsview.router.refreshPage();


                                            // },800);
         
                                        }
                                    }, ]
                                });
                            },
                            function(value) { //cancel
                                //makeContactlist();
                                //////console.log('You clicked Cancel button');

                                myApp.swipeoutClose();
                                // setTimeout(function(){
                                contactsview.router.refreshPage();
                            });
                    }
                }, {
                    text: '<center><i class="icons_keydelete"></i></center>',
                    bold: true,
                    onClick: function() {


                        localStorage.removeItem(KeySettingsiD + 'encryptkey');
                        sessionStorage.removeItem(KeySettingsiD + 'encryptkey');



                        app.db.transaction(function(tx) {
                            //////console.log('Fn KeySettings '); 
                            tx.executeSql(updateKey, ['0', '', KeySettingsiD], onUpdateSuccess, onError);

                            sessionStorage.setItem('doReload', '1');

                            makeNewContactList();

                        });


                        myApp.modal({
                            title: languageSpecificObject.languageSpecifications[0]['keyremoved'],
                            text: languageSpecificObject.languageSpecifications[0]['keyremovedtxt'],
                            verticalButtons: true,
                            buttons: [{
                                text: localStorage.getItem('OKE'),
                                onClick: function() {
                                    ////console.log('Remove KEY');
                                    //makeContactlist();
                                    //////console.log('makeContactlist();');
                                    myApp.swipeoutClose();
                                    // setTimeout(function(){
                                    contactsview.router.refreshPage();
                                    // },800);
                                }
                            }, ]
                        });
                    }
                }, ]
            });
        });
}



function insertThisVcard(d) {
    ////console.log('insertThisVcard ');

    var his_uid = d.getAttribute('data-his_uid');
    var his_nick = d.getAttribute('data-his_nick');
    var his_server = d.getAttribute('data-his_server');

    var his_nick = his_nick.toUpperCase();

      ////console.log('his_uid = ',his_uid);
        ////console.log('his_nick = ',his_nick);
          ////console.log('his_server = ',his_server);


    var thevcardHTML = 
    '   <div class="message message-sent message-vcard message-last"> '+ 

    '   <span><a href="#" onclick="cancelThisVcard(this)" data-his_uid="'+his_uid+'" data-his_nick="'+his_nick+'" data-his_server="'+his_server+'" >' + 
    '   <div class="message-vcardicon"></div>'+

        his_nick + ' (' + his_uid + ') </a><span>'+

    '   </div>';


   $$('#thevcard').html(thevcardHTML);


// var conversationStarted = false;
// var myMessages = myApp.messages('.messages', {
//   autoLayout:true
// });
// var avatar, name;

// var messageType = 'sent';

// var messageText = '<a href="#" onclick="addThisVcard(this)" >CONTACT: ' + his_nick + '<BR> ( ' + his_uid + ' ) </a>';

// ////console.log('myMessages.addMessage ');

// myMessages.addMessage({
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

// ////console.log('myMessages.addMessage DONE');

//   // Update conversation flag
//   conversationStarted = true;

var myMessages = $$('.messages')[0].f7Messages;

myMessages.scrollMessages();

//var vCardstore = '<div class="message message-send message-vcard"><a href="#" onclick="addThisVcard(this)" data-his_uid="'+his_uid+'" data-his_nick="'+his_nick+'" data-his_server="'+his_server+'" style="color: #808080"  >' + his_nick + '<BR> ( ' + his_uid + ' ) </a></div>';

var vCardstore = '<div class="message message-send message-vcard"><span><a href="frames/settings/mysettings/contactAdd.html" onclick="addThisVcard(this)" class="item-link link item-content" data-view=".view-settings" data-his_uid="'+his_uid+'" data-his_nick="'+his_nick+'" data-his_server="'+his_server+'" ><div class="message-vcardicon"></div>' + his_nick + ' (' + his_uid + ') </a></span></div>'


sessionStorage.setItem('vCardstore', vCardstore);



}



function addThisVcard(d) {
    ////console.log('addThisVcard ');

    var his_uid = d.getAttribute('data-his_uid');
    var his_nick = d.getAttribute('data-his_nick');
    var his_server = d.getAttribute('data-his_server');


sessionStorage.setItem('QRscanUID',his_uid );
sessionStorage.setItem('QRscanNICK',his_nick);


      ////console.log('his_uid = ',his_uid);
        ////console.log('his_nick = ',his_nick);
          ////console.log('his_server = ',his_server);

}

function cancelThisVcard(d) {
    ////console.log('cancelThisVcard ');

    // var his_uid = d.getAttribute('data-his_uid');
    // var his_nick = d.getAttribute('data-his_nick');
    // var his_server = d.getAttribute('data-his_server');

    //   ////console.log('his_uid = ',his_uid);
    //     ////console.log('his_nick = ',his_nick);
    //       ////console.log('his_server = ',his_server);

myApp.closeModal('.popup');
sessionStorage.removeItem('vCardstore');

$$('#thevcard').html('');
}



function playNotificationSound(sound) {

    ////console.log('----------- playSound event -----------');

    if (sessionStorage.getItem('soundIsPlaying') !== '1') {

        sessionStorage.setItem('soundIsPlaying', '1');

        if (sound) {

            ////console.log('----------- have sound -----------' + sound);

            if (os === 'ios') 
            {
                var snd = new Media('sounds/'+sound, mediaSuccess);
                snd.play();

                function mediaSuccess() {
                    sessionStorage.setItem('soundIsPlaying', '2');
                }
            } 
            else 
            {
                var sound_click = new Howl({
                    urls: ['sounds/'+sound],
                    volume: 50,
                    onend: function() {
                        sessionStorage.setItem('soundIsPlaying', '2');
                    }
                });

                sound_click.play();
            }

        } 

        else

        {


            ////console.log('----------- have saved sound -----------');


            if (os === 'ios') {

                var snd = new Media('sounds/'+localStorage.getItem('playNotificationSound'), mediaSuccess);
                snd.play();

                function mediaSuccess() {
                    sessionStorage.setItem('soundIsPlaying', '2');
                }
            } else {
                var sound_click = new Howl({
                    urls: ['sounds/'+localStorage.getItem('sound')],
                    volume: localStorage.getItem('volume'),
                    onend: function() {
                        sessionStorage.setItem('soundIsPlaying', '2');
                    }
                });

                sound_click.play();


            }
        }
    } else

    {

        ////console.log('----------- SOUND BUSY -----------');
    }
}





function loadMyContacts() {

    ////console.log('loadMyContacts() = Started on autologon 999');


    app.selectAllRecords = function(fn) {
        app.db.transaction(function(tx) {
            tx.executeSql(selectUIDLinks, [localStorage.getItem('UID')], fn, onError);
        });
    }

    var render = function(tx, rs) {

            if (rs.rows.length) {
                ////console.log('RECORD EXIST myContactListItems');

                //console.log(rs.rows.length);

                var items = new Array();

                for (var i = 0; i < rs.rows.length; i++) {

                    var contactItem = rs.rows.item(i);

                    //console.log(contactItem);


                    if (contactItem.autocrypt === 1) {
                        contactItem.autocrypt = "active";
                    } else {
                        contactItem.autocrypt = "";
                    }

                    if (contactItem.nuonline === '1') {

                    } else {
                        //         items['online'] = "";
                    }

                    if (contactItem.badge >= '1') {
                        contactItem.badge = "badge-green";
                    } else {
                        contactItem.badge = "badge-grey";
                    }


                    if (contactItem.his_server === '0000') {
                        contactItem.his_server = "0000";
                        contactItem.page = "";
                        contactItem.notconfirm = " ( Not Confirm )";

                    } else {
                        contactItem.his_server = contactItem.his_server;
                        contactItem.notconfirm = "";
                    }


                    if (contactItem.totalmessages >= 2) {
                        contactItem.page = "messages/messages";
                    }

                    if (contactItem.his_nick == 'EX5L9271J1') {
                        contactItem.his_nick = "SUPPORT";
                    } else if (contactItem.his_nick == 'EMD7LDAV5X') {
                        contactItem.his_nick = "TEST ACCOUNT";
                    }

                    reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g;

                    dateArray = reggie.exec(contactItem.online);

                    mdatum2 = new Date(
                        (+dateArray[1]), (+dateArray[2]) - 1, // Careful, month starts at 0!
                        (+dateArray[3]), (+dateArray[4]), (+dateArray[5]), (+dateArray[6]));

                    ////////console.log('mdatum2 = ' +mdatum2);
// MONTH
                    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                    contactItem.lastseen = mdatum2.getDate() + '-' + monthNames[mdatum2.getMonth()] + ' ' + (mdatum2.getHours() < 10 ? '0' : '') + mdatum2.getHours() + ':' + (mdatum2.getMinutes() < 10 ? '0' : '') + mdatum2.getMinutes();

                    contactItem.lastseentxt = localStorage.getItem('lastseentxt');

                    items.push(contactItem);

                } // end for


                // ////console.log('items : b ');
                // console.log(items);

                localStorage.setItem('myContactListItems', JSON.stringify(items));

                var myContactListItems = JSON.parse(localStorage.getItem('myContactListItems'));

                ////console.log('myContactListItems : b ');
                console.log(myContactListItems);



            } // end   if (rs.rows.length
            else

            {
                ////console.log('Fn importNewUIDLinks')
            }


        } // end render


    app.selectAllRecords(render);

}




function contactRequest() {
    ////console.log('*** Fn contactRequest Start');



    $$.post(localStorage.getItem('connection') +
        '/appie/php/include/Ccontactcheck.php?uid=' + localStorage.getItem('UID') + '&myAppapp=' + localStorage.getItem('myAppapp'),
        function(data) {
            ////console.log('--- START Ccontactcheck.php data response= ',data); 

if(data){


            var jsonObject = new Function('return ' + data)();

            var contactRequestId = jsonObject.id;


            //////console.log('--- jsonObject.idstatus: ',jsonObject.idstatus);     


            if (jsonObject.idstatus >= '1' && jsonObject.idstatus <= '4' ) {
                ////console.log('--- jsonObject.idstatus: new contact verzoek ',jsonObject.idstatus); 

                $('.messagessearchbar').hide();
                $('.messagesinvitation').show();

                // var contactrequestHTML =

                // '<a href="frames/settings/mysettings/contactRequest.html" class="link item-link" data-view=".view-settings" >' +
                // // '<div id="invitation">INVITATIONS<div id="invitationbadge"><span class="totalContactsRequest"></span> </div> </div> </a>';
                // '<div id="invitation">INVITATIONS<div id="invitationbadge"><span class="totalContactsRequest"></span> </div> </div> </a>';

                

                //$$('.messagessearchbar.searchbar').html(contactrequestHTML);

                sessionStorage.setItem('f7form-contactRequest', data);

                


     //           if (jsonObject.id >= '1') {

                    // ////console.log('---------------- contactRequest -------------------');

                    // console.log(data);

                    // ////console.log('---------------- contactRequest -------------------');



                    $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') + "/strings.json",
                        function(languageSpecificObject) {
                            //languageSpecificObject.languageSpecifications[0]['crypting'],

                            $('.totalContactsRequest').text('1');

                        });





      //          } // end if jsonObject


                // } // session
            } // end if data


            if (jsonObject.idstatus === '5') {

                ////console.log('............................................');
                //console.log("idstatus 5 do updateUIDServer");
                ////console.log('............................................');

                fNupdateUIDServer();

            }

}

else 

            {
                ////console.log('............................................');
                //console.log("NO DATA Fn contactRequest");
                ////console.log('............................................');

                // var contactrequestHTML =
                //     '<div class="searchbar-input">' +
                //     '<input type="search"  data-text="search" class="languageSpecificPlaceholder" placeholder="Search">' +
                //     '<a href="#" class="searchbar-clear"></a></div>' +
                //     '<a href="#" class="searchbar-cancel"><div><i class="icons_searchcancel"></i></div></a>';

                $('.messagessearchbar').show();
                $('.messagesinvitation').hide();

                // $('.messagessearchbar').hide();
                // $('.messagesinvitation').show();


            }





        }); //end post

////console.log('*** Fn contactRequest End');

}


function changeShowPassword(password) {



                ////console.log('changeShowPassword');
                if(!sessionStorage.showPassword){
                ////console.log('show Password');
                

                $$('#eye').removeClass('showPassword');
                $$('#eye').addClass('hidePassword');
                document.getElementById("password").attributes["type"].value = "text";
                sessionStorage.showPassword = true;
                document.getElementById("password").focus();

                }

                else

                {
                ////console.log('hide Password');


                $$('#eye').removeClass('hidePassword');
                $$('#eye').addClass('showPassword');
                document.getElementById("password").attributes["type"].value = "password";
                sessionStorage.removeItem('showPassword');
                document.getElementById("password").focus();

                }


};



function checkPasswordInputLogin(password) {

    // LOGIN

    //////console.log('We have Password input ' + password);

    var uid = localStorage.getItem('UID');

    var pass = calcMD5(password);



if(sessionStorage.getItem('pemworldLoginCheck') === '1') {

        if(pass === '3ef581d87874845960abc887a0366ca1') {


        // pemworld oke, reset session

         ////console.log('pemworld reset ok ' + pass);


            sessionStorage.removeItem('pemworldLoginCheck');
            document.getElementById("uid").reset();


                        var buttons1 = [{
                            // text: '"pemworld" fil in ok. try your password.',
                            text: localStorage.getItem('TEMPERY_BLOCK_OKE'),
                            label: true,
                            color: 'red',
                    
                        }];

                        var group = [
                            buttons1,
                            // buttons2
                        ];
                        myApp.actions(group);
return false;


        }

        else

        {

        // pemworld not ok
        // popup

         ////console.log('pemworld reset not ok ' + pass);

                        var buttons1 = [{
                            text: localStorage.getItem('TEMPERY_BLOCK'),
                            label: true,
                            color: 'red',
                    
                        }];

                        var group = [
                            buttons1,
                            // buttons2
                        ];

                        myApp.actions(group);



        }




}

else

{


    //////console.log('We have Password input ' + pass);


    // pemworld = 3ef581d87874845960abc887a0366ca1

    app.selectAllRecords = function(fn) {
        app.db.transaction(function(tx) {
            //////console.log('app.selectAllRecords');
            tx.executeSql("SELECT * FROM uid WHERE uid = ? and pass = ?", [uid, pass], fn, app.onError);
        });
    }


    var render = function(tx, rs) {
        for (var i = 0; i < rs.rows.length; i++) {
            //console.log(rs.rows.item(i)); 
        }

        if (rs.rows.length) {
            ////console.log('A USER EXIST');


            document.activeElement.blur();

window.plugins.toast.show('authorized', 'short', 'center');

            ////console.log('UID: ' + localStorage.getItem('UID') + ' - TOKEN: ' + localStorage.getItem('token'));  

            // $('.loginfailsbadge').show();

            //myApp.showIndicator();

            // playNotificationSound('plop.mp3');


            if (localStorage.getItem('reLoggin' === '1')) {

                makeNewMessageList('reFreshYes');
                // myMessagesList.update();
                ////console.log('!!! reLoggin = myMessagesList.update');

            }


            for (var i = 0; i < rs.rows.length; i++) {
                //////console.log('A RECORD HAVE VAR');
                var data = rs.rows.item(i);
                //////console.log('!!! DATA = ');
                //console.log(data);
                //localStorage.setItem('server',data.server);
                localStorage.setItem('sound', data.sound);
                localStorage.setItem('volume', data.volume);
                localStorage.setItem('repeatpush', data.repeatpush);


                var userLoggedIn = '1';
                sessionStorage.setItem('userLoggedIn', userLoggedIn);

                var running = data.running;
                localStorage.setItem('running', running);
                ////console.log('!!! RUNNING = ' + running);
            }

            document.getElementById("uid").reset();

            localStorage.setItem('counterhide', '0');

            sessionStorage.setItem('counter', 'yes');


            // $$('.mutecolor').removeClass('disable');
            // localStorage.setItem('disablesound', 'no');

            localStorage.setItem('loginfails', '0');

            var totalsec = localStorage.getItem('logofftimer') * 60;

            ////console.log('+++++++++ totalsec = ' + totalsec);

            startCounter(totalsec);

            var userLoggedIn = sessionStorage.getItem('userLoggedIn');

            ////console.log('+++++++++ userLoggedIn = ' + userLoggedIn);

            $(".statusbar-overlay").removeClass("black");

           // ////console.log('iAmOnline() = Started on PasswordCheck');

// UPDATE LICENSE

////console.log('------- UPDATE LICENSE ---------');

    $$.ajax({
        method: 'POST',
        dataType: 'jsonp',
        url: localStorage.getItem('connection') + '/appie/php/pemworldupdatelicense.php?callback=?',
        crossDomain: true,
        data: {
            uid: uid
        },
        success: function(responseData, textStatus, jqXHR) {
            ////console.log('Connect to = ' +localStorage.getItem('connection'));
            console.log(responseData);
            var a = JSON.parse(responseData);
            
            var date_expire = a.date_expire;
            var version = a.version;


localStorage.setItem('date_expire', a.date_expire);
localStorage.setItem('maxlink', a.maxlink);  
localStorage.setItem('myAppapp',version);

var dateExpireTxt = moment(a.date_expire).format('MMMM Do YYYY');

localStorage.setItem('date_expire_txt', dateExpireTxt);
////console.log('!!! dateExpireTxt', dateExpireTxt);





var myAppapp = localStorage.getItem('myAppapp');

if (myAppapp === 'Lite'){
localStorage.setItem('maxlink', '1');
}

if (myAppapp === 'Pro'){
localStorage.setItem('maxlink', 'Unlimited');
}

localStorage.setItem('license',

    'PEM: '  + localStorage.getItem('myAppapp') + '<BR>' +
    'Total allowed contacts<BR>* ' + localStorage.getItem('maxlink') + ' *<BR>' +
    'License expire on<BR>* ' + localStorage.getItem('date_expire_txt') + ' *');





totalContacts();






        },
        error: function(responseData, textStatus, errorThrown) {
            //console.log("something went wrong A!! Error: " ,responseData,textStatus,errorThrown);
            myApp.hidePreloader();
            PushErrorToSupport(errorThrown);
        },
        complete: function(responseData, textStatus, errorThrown) {
            //console.log("complete: " +textStatus);
        }
});


// UPDATE LICENSE

makeNewMessageList('reFreshYes');



            setTimeout(function() {
                myApp.closeModal()
                ////console.log('+++++++++ messagesCallback.trigger ');
                messagesCallback.trigger();
            }, 300);


        } 

        else 

        {
            ////console.log('PASSWORD NOT FOUND');

            var loginAttemps = parseInt(localStorage.getItem('loginfails') );
            ////console.log('loginAttemps: ',loginAttemps);

            loginAttemps = loginAttemps +1;

            localStorage.setItem('loginfails', loginAttemps);


            document.getElementById("uid").reset();

            $$(".loginAttemptsCountFailer").text(loginAttemps);

            if (localStorage.getItem('loginfails') < '3') {


                        var buttons1 = [{
                            text: localStorage.getItem('INVALID_PASSWORD'),
                            label: true,
                            color: 'red',
                            onClick: function() {
                            }
                    
                        }];

                        var group = [
                            buttons1,
                            // buttons2
                        ];

                        myApp.actions(group);

                setTimeout(function(){
                    myApp.closeModal('.actions-modal');
                }, 3000);
            }   

            if (localStorage.getItem('loginfails') === '3') {


                        var buttons1 = [{
                            text: localStorage.getItem('TEMPERY_BLOCK'),
                            label: true,
                            color: 'red',
                    
                        }];

                        var group = [
                            buttons1,
                            // buttons2
                        ];

                        myApp.actions(group);

                   sessionStorage.setItem('pemworldLoginCheck', '1');     

                // setTimeout(function(){
                //     myApp.closeModal('.actions-modal');
                // }, 3000);
            }  




            if (localStorage.getItem('loginfails') === '4') {

                $$('.loginAttemptsTxt').addClass('lastAttempt');


                        var buttons1 = [{
                            text: localStorage.getItem('LAST_ATTEMPT'),
                            label: true,
                            color: 'red',
                    
                        }];

                        var group = [
                            buttons1,
                            // buttons2
                        ];
                        myApp.actions(group);
            }

            if (localStorage.getItem('loginfails') >= '5') {

                                localStorage.clear();
                                sessionStorage.clear();

                                $('body').append('<div class="update-view"><img src="iTunesArtwork.png" /></div>');

                                setTimeout(function() {

                                    $('.update-view').append('<div class="progress-bar"><div class="inner-progress" id="update-progress"></div></div>');
                                    interval = setInterval(function() {
                                        addProgress('update-progress');

                                        localStorage.setItem('loginfails', '0');

                                    }, Math.random() * 750);
                                }, 1000);

            }
        }
    }

    }
    app.selectAllRecords(render);
}


function checkPasswordInput(password) {

    // LOGIN

    //////console.log('We have Password input ' + password);

//     var uid = localStorage.getItem('UID');

//     var pass = calcMD5(password);

//     app.selectAllRecords = function(fn) {
//         app.db.transaction(function(tx) {
//             //////console.log('app.selectAllRecords');
//             tx.executeSql("SELECT * FROM uid WHERE uid = ? and pass = ?", [uid, pass], fn, app.onError);
//         });
//     }


//     var render = function(tx, rs) {
//         for (var i = 0; i < rs.rows.length; i++) {
//             //console.log(rs.rows.item(i)); 
//         }

//         if (rs.rows.length) {
//             ////console.log('A USER EXIST');

//             document.activeElement.blur();

//             ////console.log('UID: ' + localStorage.getItem('UID') + ' - TOKEN: ' + localStorage.getItem('token'));  

//             $('.loginfailsbadge').show();

//             //myApp.showIndicator();

//             playNotificationSound('plop.mp3');

//             if (localStorage.getItem('reLoggin' === '1')) {

//                 makeNewMessageList('reFreshYes');
//                 // myMessagesList.update();
//                 ////console.log('!!! reLoggin = myMessagesList.update');

//             }


//             for (var i = 0; i < rs.rows.length; i++) {
//                 //////console.log('A RECORD HAVE VAR');
//                 var data = rs.rows.item(i);
//                 //////console.log('!!! DATA = ');
//                 //console.log(data);
//                 //localStorage.setItem('server',data.server);
//                 localStorage.setItem('sound', data.sound);
//                 localStorage.setItem('volume', data.volume);
//                 localStorage.setItem('repeatpush', data.repeatpush);


//                 var userLoggedIn = '1';
//                 sessionStorage.setItem('userLoggedIn', userLoggedIn);

//                 var running = data.running;
//                 localStorage.setItem('running', running);
//                 ////console.log('!!! RUNNING = ' + running);
//             }

//             document.getElementById("uid").reset();

//             localStorage.setItem('counterhide', '0');

//             sessionStorage.setItem('counter', 'yes');


//             $$('.mutecolor').removeClass('disable');
//             localStorage.setItem('disablesound', 'no');

//             localStorage.setItem('loginfails', '0');

//             var totalsec = localStorage.getItem('logofftimer') * 60;

//             ////console.log('+++++++++ totalsec = ' + totalsec);

//             startCounter(totalsec);

//             var userLoggedIn = sessionStorage.getItem('userLoggedIn');

//             ////console.log('+++++++++ userLoggedIn = ' + userLoggedIn);

//             $(".statusbar-overlay").removeClass("black");

//             ////console.log('iAmOnline() = Started on PasswordCheck');


// window.plugins.toast.show('Hello there!', 'long', 'center', function(a){
//     ////console.log('toast success: ' + a)
// })



//             setTimeout(function() {
//                 myApp.closeModal()

//                 messagesCallback.trigger();

//             }, 300);


//         } else {
//             ////console.log('PASSWORD NOT FOUND');
//         }
//     }
//     app.selectAllRecords(render);


}




function checkPasswordInputRules(password) {

    //////console.log('We have Password input ');

    var decimal =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;  

    if(password.match(decimal))   
    {   

    $$('.passwordCheckAlert').text('Oke, Strong enough.');   
        $$('.passwordCheckAlert').css('color','green');
    }  
    else  
    {  

    $$('.passwordCheckAlert').text('Too short.'); 
        $$('.passwordCheckAlert').css('color','#f64f02');

    }


    if(password === sessionStorage.getItem('setupMainPassword')){

        $$('.passwordCheckAlert').text('! Burn cannot be the same as Main.'); 

    }

}

function checkBurnPasswordInputRules(password) {

    //////console.log('We have Password input ');

    var decimal =  /^(?=.*\d)(?=.*[a-z])(?!.*\s).{4,15}$/;  

    if(password.match(decimal))   
    {   

    $$('.passwordCheckAlert').text('Oke, Strong enough.');   
        $$('.passwordCheckAlert').css('color','green');
    }  
    else  
    {  

    $$('.passwordCheckAlert').text('Too short.'); 
        $$('.passwordCheckAlert').css('color','#f64f02');

    }


    if(password === sessionStorage.getItem('setupMainPassword')){

        $$('.passwordCheckAlert').text('! Burn cannot be the same as Main.'); 

    }

}




var lastNotificationUpdate;

window.onNotification = function(event) {
    // ////console.log('!!!!!! onNotificationAPN event');
    // var updateBadgeData;
    // var updateAlertData;

    // ////console.log('----------- onNotificationAPN event -----------');
    // updateBadgeData = event.badge;
    // // console.log(updateBadgeData);
    // updateAlertData = event.alert;
    // // console.log(updateAlertData);

    // var lastNotificationUpdate = sessionStorage.getItem('lastNotificationUpdate');

    // ////console.log('----------- onNotificationAPN event -----------');

    // if (localStorage.getItem('showalert') === '1') {
    //     localStorage.removeItem('repeatsound');
    //     localStorage.setItem('disablesound', 'no');
    //     //mainView.loadPage('frames/contacts/Scontactlist.html');
    // }

    // if (localStorage.getItem('disablesound') === 'no') {

    //     if (event.sound) {
    //         localStorage.setItem('playNotificationSound', event.sound);
    //     }
    // } // end if disablesound



    // if (updateBadgeData !== lastNotificationUpdate) {


    //     if (updateBadgeData.indexOf('UPDATE') >= 0) {

    //         ////console.log('We have updateBadgeData = UPDATE');
    //         // console.log(event.alert);
    //         JsonMessagesSendStatus();

    //         var a = event.badge.split("+++") // Delimiter is a string
    //         for (var i = 0; i < a.length; i++)

    //             var his_uid = a[1];
    //         var status = a[2];
    //         var mdatum = a[3];
    //         var message = a[4];

    //         var rdatum = mdatum.replace(/ /g, "");
    //         var rdatum = rdatum.replace(/-/g, "");
    //         var rdatum = rdatum.replace(/:/g, "");

    //         if (rdatum >= '1' && message != 'messagesreply' && message != 'Nieuw') {
    //             ////console.log('!!! we have date !!!!');
    //             makeContactMessages(mdatum, his_uid, status);


    //         }


    //         if (status === '50') {

    //             myApp.swipeoutDelete('.li' + his_uid + mdatum);

    //         }

    //         if (status === '60') {
    //             ////console.log('!!!!!!!!  event.alert replied');

    //             $('#li' + his_uid + rdatum).fadeOut(1000).remove();

    //             sessionStorage.totalMessagesList = Number(sessionStorage.totalMessagesList) - 1;

    //             if (sessionStorage.totalMessagesList === '0') {
    //                 ////console.log('totalMessagesList = empty refresh page');
    //                 messagesview.router.refreshPage();
    //             }


    //         }

    //     }

    //     sessionStorage.setItem('lastNotificationUpdate', updateBadgeData);


    // };



    // if (updateBadgeData.indexOf('Accepted') >= 0) {
    //     ////console.log('event.alert Contact accepted');
    //     setTimeout(function() {
    //         importNewUIDLinks();
    //     }, 1200);
    // }


    // if (updateBadgeData.indexOf('Request') >= 0) {
    //     ////console.log('event.alert Contact request');
    //     setTimeout(function() {
    //         makeContactlist();
    //     }, 1200);
    // }


    // if (updateBadgeData.indexOf('Nieuw') >= 0) {
    //     ////console.log('event.alert Nieuw');
    //     JsonMessagesToReceive();
    // }

    // if (updateBadgeData.indexOf('New') >= 0) {
    //     ////console.log('event.alert New');
    //     JsonMessagesToReceive();
    // }

    // if (updateBadgeData.indexOf('deliverd') >= 0) {
    //     ////console.log('event.alert deliverd');

    // }


    // if (updateBadgeData.indexOf('reply') >= 0) {
    //     ////console.log('event.alert reply');

    // }

    // if (updateBadgeData.indexOf('wiped') >= 0) {
    //     ////console.log('event.alert wiped');

    // }

    // if (updateBadgeData.indexOf('gelezen') >= 0) {
    //     ////console.log('event.alert gelezen');

    // }


    // if (updateAlertData) {
    //     ////console.log('!!!!!!  event.alert afgeleverd');
    //     alertShow(updateAlertData);
    // }

};


function onDeviceReady() {

    ////console.log('*** Fn onDeviceReady');

    myApp.hideToolbar('.tabbar');






    var push = PushNotification.init({ 
        "android": {"senderID": "12345679"},
        "ios": {"alert": "true", "badge": "true", "sound": "true" , "clearBadge": "true" }, 
        "windows": {}
    });

    push.on('registration', function(data) {
        // data.registrationId

            localStorage.setItem('token', data.registrationId);

            ////console.log('UID: ' +localStorage.getItem('UID') + ' - token: ' + localStorage.getItem('token'));



    if (localStorage.getItem('UID')) {

        if (!localStorage.tokenUpdated) {

            var posturl =
                localStorage.getItem('connection') + '/appie/php/include/updatetoken.php?myAppapp=' +
                localStorage.getItem('myAppapp') + '&server=' +
                localStorage.getItem('server') + '&App=' + 
                localStorage.getItem('App') + '&os=' + os + '&uid=' + 
                localStorage.getItem('UID') + '&token=' + localStorage.getItem('token');

               console.log(posturl);     

            $$.post(posturl, function(data) {
                //////console.log('**************************************');
                ////console.log('POST RESPONSE FN tokenHandler ');
                console.log(data);
                myApp.hideIndicator();
                //////console.log('**************************************');
                if (!myApp.formGetData('settings-pushnotification')) {
                    //////console.log('! NO settings-pushnotification');
                    myApp.formStoreData(
                        'settings-pushnotification', {
                            'pushdelivered': ['on'],
                            'pushread': ['on'],
                            'pushwipe': ['on']
                        });
                }
                if (!myApp.formGetData('settingslogoff')) {
                    //////console.log('! NO settingslogoff');
                    myApp.formStoreData('settingslogoff', {
                        'autologoff': '3'
                    });
                }
                if (!myApp.formGetData('settings-notification')) {
                    //////console.log('! NO settings-notification');
                    myApp.formStoreData('settings-notification', {
                        'sound': '1.m4a',
                        'volume': '50',
                        'repeatpush': ['on'],
                        'slider': 10
                    });
                }
                if (!myApp.formGetData('settings-containers')) {
                    //////console.log('! NO settings-containers');
                    myApp.formStoreData('settings-containers', {
                        'my-container': 'RUSSIA'
                    });
                }
            }); // end post

            localStorage.tokenUpdated = true;
        } // end if localStorage
    } // end if UID
    });

    push.on('notification', function(data) {
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData

        ////console.log('+++ data.message: ',data.message);
        ////console.log('+++ pdata.title: ',data.title);
        ////console.log('+++ data.count: ',data.count);
        ////console.log('+++ data.sound: ',data.sound);
        ////console.log('+++ data.image: ',data.image);
        ////console.log('+++ data.additionalData: ',data.additionalData);
        console.log(data.additionalData);



    ////console.log('!!!!!! onNotificationAPN event');
    var updateBadgeData;
    var updateAlertData;

    ////console.log('----------- onNotificationAPN event -----------');
    updateBadgeData = data.count;
    // console.log(updateBadgeData);
    updateAlertData = data.message;
    // console.log(updateAlertData);

    var lastNotificationUpdate = sessionStorage.getItem('lastNotificationUpdate');

    ////console.log('----------- onNotificationAPN event -----------');

    if (localStorage.getItem('showalert') === '1') {
        localStorage.removeItem('repeatsound');
        localStorage.setItem('disablesound', 'no');
        //mainView.loadPage('frames/contacts/Scontactlist.html');
    }

    if (localStorage.getItem('disablesound') === 'no') {

        if (data.sound) {
            localStorage.setItem('playNotificationSound', data.sound);
        }
    } // end if disablesound



    if (updateBadgeData !== lastNotificationUpdate) {


        if (updateBadgeData.indexOf('UPDATE') >= 0) {

            ////console.log('We have updateBadgeData = UPDATE');
            // console.log(event.alert);
            JsonMessagesSendStatus();

            var a = updateBadgeData.split("+++") // Delimiter is a string
            for (var i = 0; i < a.length; i++)

                var his_uid = a[1];
            var status = a[2];
            var mdatum = a[3];
            var message = a[4];

            var rdatum = mdatum.replace(/ /g, "");
            var rdatum = rdatum.replace(/-/g, "");
            var rdatum = rdatum.replace(/:/g, "");

            if (rdatum >= '1' && message != 'messagesreply' && message != 'Nieuw') {
                ////console.log('!!! we have data !!!!');
                makeContactMessages(mdatum, his_uid, status);
            }


            if (status === '50') {
                myApp.swipeoutDelete('.li' + his_uid + mdatum);
            }

            if (status === '60') {
                ////console.log('!!!!!!!!  event.alert replied');

                $('#li' + his_uid + rdatum).fadeOut(1000).remove();

                sessionStorage.totalMessagesList = Number(sessionStorage.totalMessagesList) - 1;

                if (sessionStorage.totalMessagesList === '0') {
                    ////console.log('totalMessagesList = empty refresh page');
                    messagesview.router.refreshPage();
                }


            }

        }

        sessionStorage.setItem('lastNotificationUpdate', updateBadgeData);


    };



    if (updateBadgeData.indexOf('Accepted') >= 0) {
        ////console.log('event.alert Contact accepted');
        setTimeout(function() {
            fNupdateUIDServer();
        }, 1200);
    }


    if (updateBadgeData.indexOf('Request') >= 0) {
        ////console.log('event.alert Contact request');
        setTimeout(function() {
            makeContactlist();
        }, 1200);
    }


    if (updateBadgeData.indexOf('Nieuw') >= 0) {
        ////console.log('event.alert Nieuw');
        JsonMessagesToReceive();
    }

    if (updateBadgeData.indexOf('New') >= 0) {
        ////console.log('event.alert New');
        JsonMessagesToReceive();
    }

    if (updateBadgeData.indexOf('deliverd') >= 0) {
        ////console.log('event.alert deliverd');

    }


    if (updateBadgeData.indexOf('reply') >= 0) {
        ////console.log('event.alert reply');

    }

    if (updateBadgeData.indexOf('wiped') >= 0) {
        ////console.log('event.alert wiped');

    }

    if (updateBadgeData.indexOf('gelezen') >= 0) {
        ////console.log('event.alert gelezen');

    }


    if (updateAlertData) {
        ////console.log('!!!!!!  event.alert afgeleverd');
        alertShow(updateAlertData);
    }


    });

    push.on('error', function(e) {
        // e.message
    });



    // try {
    //     pushNotification = window.plugins.pushNotification;

    //     if (device.platform === 'android' || device.platform === 'Android' || device.platform === 'amazon-fireos') {
    //         pushNotification.register(successHandler, errorHandler, {
    //             'senderID': '661780372179',
    //             'ecb': 'onNotification'
    //         });
    //     } else

    //     {
    //         pushNotification.register(tokenHandler, errorHandler, {
    //             'badge': 'true',
    //             'sound': 'true',
    //             'alert': 'true',
    //             'ecb': 'window.onNotification'
    //         });

    //         ////console.log('+++ pushNotification iOS ACTIVE  ');
    //     }

    // } catch (err) {
    //     txt = 'There was an error on this page.\n\n';
    //     txt += 'Error description: ' + err.message + '\n\n';
    //     // console.log(txt);
    // }




    $(".statusbar-overlay").addClass("black");

    var storedData = myApp.formGetData('settings-logoff');

    if (storedData) {

        var autologoff = storedData.autologoff;
        var AUTO_LOGON = storedData.AUTO_LOGON;

        // console.log(autologoff);
        // console.log(AUTO_LOGON);

        if (AUTO_LOGON == "on") {
            localStorage.setItem('autologon', '999');
        } 
        else 
        {

            var totalMinuts = autologoff.split(" ", 1);

            localStorage.setItem('logofftimer', totalMinuts[0]);

            sessionStorage.setItem('logofftimer', totalMinuts[0]);

            localStorage.removeItem('autologon');
        }
    } 

    else

    {
        var logofftimer = '3';
        localStorage.setItem('logofftimer', logofftimer);
        sessionStorage.setItem('logofftimer', logofftimer);
    }




        if (localStorage.getItem('doneSetup')) {

            ////console.log('++++ LOAD loginScreen');
  myApp.loginScreen(); 





//             loader.check().then(function(updateAvailable) { 

//                 ////console.log('updateAvailable:' ,updateAvailable);

//                 if(updateAvailable === true){

//                         ////console.log('UPDATES BESCHIKBAAR:' ,updateAvailable);
//                         myApp.alert('NEW UPDATES...');

// loader.download(onprogress).then(function(manifest){ 
//     ////console.log('onprogress:' ,onprogress);
//     ////console.log('manifest:' ,manifest);
//     console.log(manifest);


//     // {
//     //     "files":
//     //     {
//     //         "bluebird":{"version":"f37ff9832449594d1cefe98260cae9fdc13e0749","filename":"lib/bluebird.js"},
//     //         "CordovaPromiseFS":{"version":"58f3b1d28ea7dda0c1c336360b26f92e3f24731e","filename":"lib/CordovaPromiseFS.js"},
//     //         "CordovaAppLoader":{"version":"d6a10cd44da1ac10216593b735d9fe9f8acc22b6","filename":"lib/CordovaAppLoader.js"},
//     //         "contacts":{"version":"1.12.14","filename":"js/myApp.contacts.js"},
//     //         "messages":{"version":"1.12.14","filename":"js/myApp.messages.js"},
//     //         "settings":{"version":"1.12.14","filename":"js/myApp.settings.js"},
//     //         "setup":{"version":"1.12.14","filename":"js/myApp.setup.js"},
//     //         "functions":{"version":"1.12.18","filename":"js/myApp.functions.js"},
//     //         "style":{"version":"1.12.19","filename":"css/pem.css"}
//     //     },
//     //         "load":["css/pem.css","lib/bluebird.js","lib/CordovaPromiseFS.js","lib/CordovaAppLoader.js","js/myApp.contacts.js","js/myApp.messages.js","js/myApp.settings.js","js/myApp.setup.js","js/myApp.functions.js"],
//     //         "version":"1.12.19",
//     //         "root":"cdvfile://localhost/persistent/app/"
//     // }





//     loader.update(); 

//  },function(failedDownloadUrlArray){ 
//     ////console.log('failedDownloadUrlArray:' ,failedDownloadUrlArray);

//     loader.update(); 

//   });




//                 }

//                 else

//                 {

// ////console.log('NON UPDATES BESCHIKBAAR:' ,updateAvailable);

//                    myApp.loginScreen(); 

//                 }

//              }); 

            
        }



cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);


////console.log('navigator.globalization');
console.log(navigator.globalization);
navigator.globalization



setTimeout(function (){
////console.log('-- HIDE splashscreen');
         navigator.splashscreen.hide();
    

}, 800);

// database curupt





}


document.addEventListener('deviceready', onDeviceReady, true);






