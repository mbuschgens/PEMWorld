function DateTimeNow() {
    now = new Date();
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1);
    if (month.length == 1) {
        month = "0" + month;
    }
    day = "" + now.getDate();
    if (day.length == 1) {
        day = "0" + day;
    }
    hour = "" + now.getHours();
    if (hour.length == 1) {
        hour = "0" + hour;
    }
    minute = "" + now.getMinutes();
    if (minute.length == 1) {
        minute = "0" + minute;
    }
    second = "" + now.getSeconds();
    if (second.length == 1) {
        second = "0" + second;
    }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}


var myMessagesList;


var messagesCallback = myApp.onPageInit('messages', function(page) {

    //console.log('page.name messages');

    $("#connection").removeClass("connectionHidden");

    myApp.showToolbar('.tabbar');
    localStorage.setItem('showalert', 1);

    myApp.showTab('#messagesview');

    clearTimeout(loop);

    document.activeElement.blur();

    myApp.hideIndicator();


    //console.log('++++ MAKE NEW myMessagesList INIT');

    myMessagesList = myApp.virtualList($$(page.container).find('.messages-list.list-block.virtual-list'), {
        items: JSON.parse(localStorage.myMessagesList),
        template:

            '<li mid="{{mid}}" mdatum="{{mdatum}}" his_uid="{{his_uid}}" id="li{{his_uid}}{{mdatum}}" class="swipeout li{{his_uid}}{{mdatum}}  selectMessageItem swipe-click">' +


            ' <div id="A{{his_uid}}{{mdatum}}" style="display: {{showReport}}"> ' +

            // ' <a href="#" data-confirm="Wipe message from {{his_nick}} device" data-confirm-title="ARE YOU SURE?" class="link item-link item-content swipeout-delete" id="{{mid}}" mid="{{mid}}" data-id="{{mid}}" data-mdatum="{{mdatum}}" data-his_uid="{{his_uid}}" data-sendPushMessage="{{sendPushMessage}}"  >' +


            ' <a href="#" class="item-content item-link no-link swipeout-content" id="{{mid}}" mid="{{mid}}" data-id="{{mid}}" data-mdatum="{{mdatum}}" data-his_uid="{{his_uid}}" data-sendPushMessage="{{sendPushMessage}}"  >' +

                ' <div id="showReport" class="showReport">' +

                    ' <div class="item-media"><i id="icon{{his_uid}}{{mdatum}}" class="icons_sendstatus {{sendstatus}}"></i></div>' +
               
                ' </div>' +

                ' <div class="item-inner">' +

                    ' <div class="showRow item-title-row">' +

                    '     <div class="item-title">{{his_nick}}</div> ' +
                        ' <div id="status{{his_uid}}{{mdatum}}" class="item-after">{{newdatum}} {{showButton}}</div>' +
                    ' </div> ' +

                '   <div class="showRowNoMessage item-text decryptmessage"><span>Press for options.</span></div>' +

                ' </div>' +

            '  </a>  ' +


            ' <div class="swipeout-actions-right">'+

                ' <a href="#" class="item-content bg-gray" > <table style="width:100%"><tr><tr><td><p class="block-with-text" style="width: 180px;">...{{message}}</p></td></tr></table></a>' +
                // ' <a href="#" class="link item-link item-content bg-orange" > <table style="width:100%" class=""><tr><td><center><i class="icons_edit"></i></center></td></tr><tr><td><center>EDIT NICKNAME</center></td></tr></table></a>'+
                ' <a href="#" data-confirm="Wipe message from<BR>{{his_nick}} device" data-confirm-title="ARE YOU SURE?"  class="link item-link item-content swipeout-delete bg-red" id="{{mid}}" mid="{{mid}}" data-id="{{mid}}" data-mdatum="{{mdatum}}" data-his_uid="{{his_uid}}" data-sendPushMessage="{{sendPushMessage}}" ><table style="width:100%"><tr><td><center><i class="icons_delete"></i></center></td></tr><tr><td><center>WIPE REMOTE</center></td></tr></table></a>'+

            ' </div>'+


            '</div>' +


            ' <div id="B{{his_uid}}{{mdatum}}" style="display: {{showMessage}}" class="swipeout-content "> ' +


            ' <a href="frames/messages/Smessages-send.html?mid={{mid}}&his_uid={{his_uid}}&his_nick={{his_nick}}&his_server={{his_server}}&totalmessages=1&activeLi={{his_uid}}{{mdatum}}" class="link reply item-link item-content">  ' +

            ' <div id="floatStatus" class="floatStatusMessages">' +

            ' <div id="{{his_uid}}online" class="DIV{{his_uid}}online {{nuonline}} status">' +

            // '<div class="bg-3 topspacer"></div>'+

'<div id="autocrypt{{his_uid}}" class="icons_secretkey {{autocrypt}}"></div>' +


            // '<div ><i id="readstatus{{mid}}" class="icons_new_message {{messagereadnewicon}}"></i></div>' +

'<div ><i id="readstatus{{mid}}" class="icons_new_message">'+

'<svg viewBox="0 0 27.5 27.5">'+
'<circle id="blink{{mid}}" class="blink {{messagereadnewicon}}" cx="12" cy="12" r="6"/>'+
'</svg>'+

'</i></div>'+


            '  </div>  ' +
            ' </div>' +






            '  <div class="item-inner">' +
            '  <div class="item-title-row">' +

            '  <div class="item-title">{{his_nick}} </div> ' +

            '  <div class="item-after">{{newdatum}}</div>' +

            '  </div>' +


            '  <div class="item-text decryptmessage">{{AutoDecrypt}}</div>' +

            '  </div>' +

            '  </a>  ' +


            '  <div class="swipeout-actions-right">' +
            ' <a href="#"  class="swipeout-delete {{swipeoutoverswipe}} bg-red" id="{{mid}}" data-id="{{mid}}" data-mdatum="{{mdatum}}" data-his_uid="{{his_uid}}" data-sendPushMessage="{{sendPushMessage}}" onclick="deleteAndSendPush(this)" ><table style="width:100%"><tr><td><center><i class="icons_delete"></i></center></td></tr><tr><td>DELETE</td></tr></table></a>' +
            '  </div>' +
            '  </div>' +



            '</li>'
    });


    SQLiteUpdateMessagesTotal();


    myApp.hideIndicator();

    //console.log('page.name messages DONE');


if(sessionStorage.noMessages === 'yes'){

    $('.showRow').removeClass('item-title-row');

        $('.showRowNoMessage').hide();


}



    // $$("body").on("click",".swipe-click", function(){
    //     if(!$$(this).hasClass('swipeout-opened')) {
    //         myApp.swipeoutOpen($$(this), 'right');
    //     } else {
    //         myApp.swipeoutClose($$(this));
    //     }
    // });




    // $$("body").on('click', '.selectMessageItem', function(e) {

    //     //console.log('!!!!!!!!  event.alert selectMessageItem');

    //     //var index = $(e.target).index();

    //      var selectItemId = $(this).index();

    //     //console.log('selectItemId = ' + selectItemId);

    //     sessionStorage.setItem('selectItemId', JSON.stringify(selectItemId));

    // });


    $$("body").on('deleted', '.swipeout-delete', function(e) {
        //console.log('!!!!!!!!  event.alert swipeout-delete deleted');

        //    var id = $$(this).attr('id');
        //    //Do the post somewhere

        // //console.log('!!!!!!!!  id = ' +id);

        //console.log('!!!!!!!!  event.alert body deleted deleted');

    });




    $$('.showMessageStatus').on('click', function() {

    //     // 10 = pending
    //     // 20 = send
    //     // 30 = delivered
    //     // 40 = read
    //     // 50 = wiped
    //     // 60 = replied

 
    });


// $$('.create-picker').on('click', function () {
//   // Check first, if we already have opened picker
//   if ($$('.picker-modal.modal-in').length > 0) {
//     myApp.closeModal('.picker-modal.modal-in');
//   }
//   myApp.pickerModal(
//     '<div class="picker-modal">' +

//       '<div class="toolbar">' +
//         '<div class="toolbar-inner">' +
        
//           '<div class="left"></div>' +
//           '<div class="right"><a href="#" class="close-picker">Close</a></div>' +
//         '</div>' +
//       '</div>' +

//       '<div class="picker-modal-inner">' +
//         '<div class="content-block">' +
//           '<p>Lorem ipsum dolor ...</p>' +
//         '</div>' +
//       '</div>' +

//     '</div>'
//   )
// }); 








var ptrContent = $$('.pull-to-refresh-content.messages-page-list');

    ptrContent.on('refresh', function(e) {

        setTimeout(function() {
            sessionStorage.JsonMessagesToReceive = '';
            makeNewMessageList('reFreshYes');
            //console.log(' pull to refresh');
            myApp.pullToRefreshDone();
        }, 2000);
    }); //myApp.pullToRefreshTrigger('.pull-to-refresh-content.messages-page-list');


var mySearchbar = myApp.searchbar('.searchbar', {
        searchList: '.list-block-search',
        searchIn: '.item-title'
    });

                            // var contactrequestHTML =

                            //     '<a href="frames/settings/mysettings/contactRequest.html" class="link item-link" data-view=".view-settings" >' +
                            //     '<div id="invitation">INVITATIONS<div id="invitationbadge"><span class="totalContactsRequest"></span> </div> </div> </a>';


                            // $$('.searchbar').html(contactrequestHTML);
                            // $$('.subbar').html(contactrequestHTML);

$('.messagesinvitation').hide(); // hide messagesinvitation onload page


var future = moment(localStorage.getItem('date_expire'),"YYYY-MM-DD");
var start = moment();  
var d = future.diff(start, 'days'); // 9

//console.log('!!! DATE DIFF', d);


if(d <= '3')
{
    //Your Pro license is expired on [date]
$$('.systemalert').html("Your " + localStorage.getItem('myAppapp') + " license expire in " + d + " day\'s on " + localStorage.getItem('date_expire_txt'));
//console.log('!!! SHOW ALERT A', d);
}

if(d <= '0')
{

$$('.systemalert').html("Your " + localStorage.getItem('myAppapp') + " license is expired on " + localStorage.getItem('date_expire_txt'));


setTimeout(function(){ 

// License Expired!

// Your Pro license is expired on [date]. To continue using PEM you can buy a new license, anonymous and secure, with Bitcoins. For more info check http://pem.world

        myApp.modal({
            title: 'License Expired',
            text: 'Your '+ localStorage.getItem('myAppapp')+  ' license is expired on '+ localStorage.getItem('date_expire_txt') + '. To continue using PEM you can buy a new license, anonymous and secure, with Bitcoins. For more info check<BR>http://pem.world',
            buttons: [{
                text: localStorage.getItem('OKE'),
                onClick: function() {

            //console.log('+++!!! COUNTER STOP');

            sessionStorage.clear();

            clearTimeout(loop);

            //updateCounter(totalSeconds, 'stop');

            //console.log('+++!!! COUNTER STOP Page loaded');

            $("#connection").addClass("connectionHidden");

            $(".statusbar-overlay").addClass("black");
  
            localStorage.setItem('reLoggin', '1');

            var userLoggedIn = sessionStorage.getItem('userLoggedIn');
            //console.log('+++!!! COUNTER STOP userLoggedIn = ' + userLoggedIn);

window.location.reload();

                }
            }]
        });
 },1000);

//console.log('!!! SHOW ALERT B', d);
}





clearTimeout(loop);

iAmOnlineLoop();




    myApp.hidePreloader();


    var selectItemId = sessionStorage.getItem('selectItemId');


    // if(selectItemId != null ){ 

    //     //console.log('+++++++ selectItemId =' + selectItemId); 
    //     //var itemid = number(item) + 1;

    //     sessionStorage.removeItem('selectItemId');

    //     myMessagesList.deleteItem(selectItemId);

    //     //console.log('+++++++ myMessagesList.deleteItem(selectItemId) '+ selectItemId); 

    // }



    var uid = localStorage.getItem('UID');

    app.selectAllRecordsToDecrypt = function(fn) {

        //console.log('selectAllRecordsToDecrypt Started');
        app.db.transaction(function(tx) {
            tx.executeSql(selectAlleMessages, [], fn, onError);
        });
    }

    var render = function(tx, rs) {

        ////console.log('onPageAfterAnimation messages Render');
        //console.log(rs); 

        if (rs.rows.length) {

            for (var i = 0; i < rs.rows.length; i++)

            {

                var contactmessagesItem = rs.rows.item(i);

                var autocryptkey = sessionStorage.getItem(contactmessagesItem.his_uid + 'encryptkey');

                //console.log ('autocryptkey = ' + autocryptkey);    

                if (autocryptkey != null && contactmessagesItem.read < 10) {

                    autoDecryptMessage(contactmessagesItem.mid, autocryptkey, contactmessagesItem.message, function(decryptMid, callbackDecryptMessage) {

                        //console.log ('decryptMid = ' + decryptMid); 

                        //console.log ('callbackDecryptMessage = ' + callbackDecryptMessage); 

                        $$('.mid' + decryptMid).html('<span>Message : ' + callbackDecryptMessage + '</span>');

                    }); // end functio

                } // end if

            } // end for

        }
    }
    app.selectAllRecordsToDecrypt(render);



}); // end page




myApp.onPageAfterAnimation('messages', function(page) {


    ////console.log('page.name onPageAfterAnimation messages');


    if (sessionStorage.getItem('messagesReadStatus')) {

        //console.log('WE HAVE MESSAGES READ STATUS');

        var mid = sessionStorage.getItem('messagesReadStatus');


        $$('#readstatus' + mid).removeClass('new').addClass('read');
        // $$('#readstatus'+ mid).addClass('read');      

        //console.log('WE HAVE MESSAGES READ STATUS mid = ' + mid);

    }

// var contactrequestHTML =

//     '<a href="frames/settings/mysettings/contactRequest.html" class="link item-link" data-view=".view-settings" >' +
//     '<div id="invitation">INVITATIONS<div id="invitationbadge"><span class="totalContactsRequest"></span> </div> </div> </a>';


// $$('.searchbar').html(contactrequestHTML);


}); // end page




////////////////////////////////////////////////

function makeNewMessageList(doReload) {

    // //console.log('+++ Fn makeNewMessageList');

    // //console.log('+++ Fn makeNewMessageList doReload = ' + doReload);




    var uid = localStorage.getItem('UID');

    app.selectAllRecords = function(fn) {
        app.db.transaction(function(tx) {
            tx.executeSql(selectAlleMessages, [], fn, onError);
        });
    }

    var render = function(tx, rs) {

        ////console.log('start render makeNewMessageList'); 
        //console.log(rs); 

        if (rs.rows.length) {

            ////console.log('TOTAL RECORD EXIST makeNewMessageList');
            //console.log(rs.rows.length);

            sessionStorage.totalMessagesList = Number(rs.rows.length);
            //  var messagesItems = sessionStorage.getItem('messagesItems');

            // localStorage.setItem('myContactListItems',JSON.stringify(items));
            // //console.log('!!! sessionStorage.totalMessagesList = ' + sessionStorage.totalMessagesList);


            // sessionStorage.setItem('messagesItems', JSON.stringify(rs.rows.length));

            var items = new Array();

            for (var i = 0; i < rs.rows.length; i++)

            {

                ////console.log('RECORD HAVE VAR makeNewMessageList');
                var contactmessagesItem = rs.rows.item(i);

                reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g;
                var mdatum = contactmessagesItem.mdatum;

                dateArray = reggie.exec(contactmessagesItem.mdatum);


                var mdatum = mdatum.replace(/ /g, "");
                var mdatum = mdatum.replace(/-/g, "");
                var mdatum = mdatum.replace(/:/g, "");

                contactmessagesItem.mdatum = mdatum;

                mdatum2 = new Date((+dateArray[1]), (+dateArray[2]) - 1, (+dateArray[3]), (+dateArray[4]), (+dateArray[5]), (+dateArray[6]));

                ////console.log('mdatum2 = ' +mdatum2);
// MONTH                
                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                newdatum = mdatum2.getDate() + '-' + monthNames[mdatum2.getMonth()] + ' ' + (mdatum2.getHours() < 10 ? '0' : '') + mdatum2.getHours() + ':' + (mdatum2.getMinutes() < 10 ? '0' : '') + mdatum2.getMinutes();
                ////console.log('mdatum = ' +mdatum);

                contactmessagesItem.newdatum = newdatum;

                //mdatum = 'date:';

                ////console.log('contactmessagesItem.read = ' +contactmessagesItem.read);

                var decryptMid = contactmessagesItem.mid;
                var his_uid = contactmessagesItem.his_uid;

                if (contactmessagesItem.read >= 0 && contactmessagesItem.read < 5) // new message

                {
                    var showReport = "none";
                    var showMessage = "show";
                    var sendPushMessage = "yes";
                    var swipeoutoverswipe = "swipeout-overswipe";

                    contactmessagesItem.showReport = showReport;
                    contactmessagesItem.showMessage = showMessage;
                    contactmessagesItem.sendPushMessage = sendPushMessage;
                    contactmessagesItem.swipeoutoverswipe = swipeoutoverswipe;

                } else

                {

                    var show = localStorage.getItem('showMessageStatus');

                    if (show == null) {
                        //console.log('show = null we update');
                        localStorage.setItem('showMessageStatus', '{"show":["99"]}');
                        var show = localStorage.getItem('showMessageStatus');

                    }

                    if (show.indexOf(contactmessagesItem.read) >= 0) {

                        var showReport = "none";
                        var showMessage = "none";
                        var sendPushMessage = "no";
                    } else

                    {

                        var showReport = "show";
                        var showMessage = "none";
                        var sendPushMessage = "no";
                    }
                    contactmessagesItem.showReport = showReport;
                    contactmessagesItem.showMessage = showMessage;
                    contactmessagesItem.sendPushMessage = sendPushMessage;
                }


                if (contactmessagesItem.read === 1) {
                    var badge = "badge badge-gray";
                    var messagereadnew = localStorage.getItem('messagebadgereadtxt');
                    var messagereadnewicon = "read";
                    contactmessagesItem.badge = badge;
                    contactmessagesItem.messagereadnew = messagereadnew;
                    contactmessagesItem.messagereadnewicon = messagereadnewicon;


                } else if (contactmessagesItem.read === 0) {
                    var badge = "badge badge-green";
                    var messagereadnew = localStorage.getItem('messagebadgenewtxt');
                    var messagereadnewicon = "new";
                    contactmessagesItem.badge = badge;
                    contactmessagesItem.messagereadnew = messagereadnew;
                    contactmessagesItem.messagereadnewicon = messagereadnewicon;
                } else


                if (contactmessagesItem.read === 10) {
                    var badge = "";
                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Pending</div>';
                    var sendstatus = 'pending';
                    contactmessagesItem.badge = badge;
                    contactmessagesItem.sendstatus = sendstatus;
                    contactmessagesItem.messagereadnew = messagereadnew;

                } else
                if (contactmessagesItem.read === 20) {
                    var badge = "";
                    // var messagereadnew = localStorage.getItem('messagebadgeSendtxt');
                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Send</div>';
                    var sendstatus = 'send';
                    contactmessagesItem.badge = badge;
                    contactmessagesItem.sendstatus = sendstatus;
                    contactmessagesItem.messagereadnew = messagereadnew;

                } else

                if (contactmessagesItem.read === 30) {
                    var badge = "";
                    // var messagereadnew = localStorage.getItem('messagebadgeSendDeliveredtxt');
                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Delivered</div>';
                    var sendstatus = 'delivered';
                    contactmessagesItem.badge = badge;
                    contactmessagesItem.sendstatus = sendstatus;
                    contactmessagesItem.messagereadnew = messagereadnew;

                } else

                if (contactmessagesItem.read === 40) {
                    var badge = "";
                    // var messagereadnew = localStorage.getItem('messagebadgeSendReadtxt');
                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Read</div>';
                    var sendstatus = 'read';
                    contactmessagesItem.badge = badge;
                    contactmessagesItem.sendstatus = sendstatus;
                    contactmessagesItem.messagereadnew = messagereadnew;
                } else

                if (contactmessagesItem.read === 50) {
                    var badge = "";
                    // var messagereadnew = localStorage.getItem('messagebadgeSendWipedtxt');
                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Wiped</div>';
                    var sendstatus = 'wiped';
                    contactmessagesItem.badge = badge;
                    contactmessagesItem.sendstatus = sendstatus;
                    contactmessagesItem.messagereadnew = messagereadnew;
                } else

                if (contactmessagesItem.read === 60) {
                    var badge = "";
                    // var messagereadnew = localStorage.getItem('messagebadgeSendWipedtxt');
                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Replied</div>';
                    var sendstatus = 'replied';
                    contactmessagesItem.badge = badge;
                    contactmessagesItem.sendstatus = sendstatus;
                    contactmessagesItem.messagereadnew = messagereadnew;
                } else

                {
                    var badge = "badge badge-red";
                    var messagereadnew = localStorage.getItem('messagebadgeUnkowtxt');
                    var sendstatus = 'unknow';
                    contactmessagesItem.badge = badge;
                    contactmessagesItem.sendstatus = sendstatus;
                    contactmessagesItem.messagereadnew = messagereadnew;
                }


                if (contactmessagesItem.autocrypt === 1) {
                    var autocrypt = "active";
                    var AutoDecrypt = "<div id='mid" + decryptMid + "' class='mid" + decryptMid + "' >Try Decrypting...</div>";
                    sessionStorage.setItem(contactmessagesItem.his_uid + 'encryptkey', contactmessagesItem.autocryptkey);

                    contactmessagesItem.autocrypt = autocrypt;
                    contactmessagesItem.AutoDecrypt = AutoDecrypt;
                } else {
                    if (sessionStorage.getItem(contactmessagesItem.his_uid + 'encryptkey') != null) {
                        var AutoDecrypt = "<div id='mid" + decryptMid + "' class='mid" + decryptMid + "'>Try Decrypting...</div>";
                        contactmessagesItem.AutoDecrypt = AutoDecrypt;
                    } else

                    {
                        var autocrypt = "";
                        var AutoDecrypt = '<span>Message : locked.</span>';
                        contactmessagesItem.autocrypt = autocrypt;
                        contactmessagesItem.AutoDecrypt = AutoDecrypt;
                    }
                }

                if (contactmessagesItem.nuonline === '1') {
                    var online = "active";
                    contactmessagesItem.online = online;
                } else {
                    var online = "";
                    contactmessagesItem.online = online;
                }


                items.push(contactmessagesItem);

                // //console.log('items : a ');
                // console.log(items);

            } // end for


sessionStorage.noMessages = 'no';

        } // end record exist
        else

        {

            //console.log('++++ RECORD EMPTY');

            var items = [{
                showReport: 'show',
                showMessage: 'none',
                his_uid: '0000',
                mdatum: '0000',
                his_nick: '<center>...No messages...</center>'
            }];

sessionStorage.noMessages = 'yes';

            //console.log('++++ HIDE BUTTON');



        }

        // //console.log('++++ SET localStorage.myMessagesList');

        localStorage.myMessagesList = JSON.stringify(items);

        if (doReload === 'reloadYes') {
            ////console.log('++++ makeNewMessageList doReload = yes = ' + doReload);
            setTimeout(function() {
                messagesview.router.reload();
            }, 300);
        } else

        if (doReload === 'reFreshYes') {
            ////console.log('++++ makeNewMessageList doReload = yes = ' + doReload);

            myMessagesList.update();
            setTimeout(function() {
                //console.log('+++++ makeNewMessageList reload = no = ' + doReload);
                messagesview.router.load({
                    url: 'frames/messages/messages.html',
                    ignoreCache: true,
                    reload: true
                });
            }, 300);
            
        } else

        if (doReload === 'noLoad') {
            ////console.log('++++ makeNewMessageList doReload = no = ' + doReload);

        } else

        {
            ////console.log('+++++ trigger makeNewMessageList reload = no = ' + doReload);
            messagesCallback.trigger();
        }


    };

    app.selectAllRecords(render);

}




function makeContactMessages(mdatum, his_uid, status, playSound) {
        // //console.log('!!! Fn makeContactMessages :',mdatum, his_uid, status, playSound);
        // //console.log('!ADD LOG TO LIST A ' +status);
        // console.log(mdatum);
        // console.log(his_uid);
        // console.log(status);
        // console.log(playSound);
        // //console.log('!ADD LOG TO LIST B');

        var sdatum = mdatum.replace(/ /g, "");
        var sdatum = sdatum.replace(/-/g, "");
        var sdatum = sdatum.replace(/:/g, "");

        if (status > sessionStorage.getItem('lastStatusUpdate' + his_uid + sdatum) || status === undefined) {

            ////console.log('STATUS UPDATE GROTER DAN LAATSTE '+his_uid+sdatum+' NU = ' + status + ' Storage = ' +sessionStorage.getItem('lastStatusUpdate'+his_uid+sdatum)); 

            var items = new Array();

            var uid = localStorage.getItem('UID');
            app.selectAllRecords = function(fn) {
                app.db.transaction(function(tx) {
                    ////console.log('selectMID');
                    //console.log(his_uid);
                    tx.executeSql(selectMessages, [mdatum, his_uid], fn, onError);
                });
            }

            var render = function(tx, rs) {
                ////console.log('start render makeContactMessages'); 

                for (var i = 0; i < rs.rows.length; i++)

                    if (rs.rows.length) {
                        ////console.log('RECORD EXIST makeContactMessages');
                        contactmessageslistTemplate = $$('#contactmessageslist-template').html();

                        var contactmessageslisthtml = '';

                        for (
                            var i = 0; i < rs.rows.length; i++) {

                            ////console.log('RECORD HAVE VAR makeContactMessages');
                            var contactmessagesItem = rs.rows.item(i);
                            //console.log(contactmessagesItem);
                            //////console.log('contactItem.autocrypt = ' );
                            //console.log(contactmessagesItem.autocrypt);
                            reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g;
                            dateArray = reggie.exec(contactmessagesItem.mdatum);
                            var mdatum = contactmessagesItem.mdatum;
                            var mdatum = mdatum.replace(/ /g, "");
                            var mdatum = mdatum.replace(/-/g, "");
                            var mdatum = mdatum.replace(/:/g, "");
                            // //console.log('mdatum');
                            // console.log(mdatum);
                            contactmessagesItem.mdatum = mdatum;
                            mdatum2 = new Date((+dateArray[1]), (+dateArray[2]) - 1, (+dateArray[3]), (+dateArray[4]), (+dateArray[5]), (+dateArray[6]));
                            ////console.log('mdatum2 = ' +mdatum2);
// MONTH                            
                            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                            newdatum = mdatum2.getDate() + '-' + monthNames[mdatum2.getMonth()] + ' ' + (mdatum2.getHours() < 10 ? '0' : '') + mdatum2.getHours() + ':' + (mdatum2.getMinutes() < 10 ? '0' : '') + mdatum2.getMinutes();
                            ////console.log('newdatum = ' +newdatum);
                            contactmessagesItem.newdatum = newdatum;
                            //mdatum = 'date:';
                            ////console.log('contactmessagesItem.read = ' +contactmessagesItem.read);
                            var decryptMid = contactmessagesItem.mid;
                            var his_uid = contactmessagesItem.his_uid;



                            if (status)

                            {

                                ////console.log('WE HAVE STATUS UPDATE ' +status);

                                if (status === '0' || status === '2') {
                                    var showReport = "none";
                                    var showMessage = "show";
                                    var sendPushMessage = "yes";
                                    var swipeoutoverswipe = "swipeout-overswipe";

                                    contactmessagesItem.showReport = showReport;
                                    contactmessagesItem.showMessage = showMessage;
                                    contactmessagesItem.sendPushMessage = sendPushMessage;
                                    contactmessagesItem.swipeoutoverswipe = swipeoutoverswipe;

                                } else

                                {

                                    var show = localStorage.getItem('showMessageStatus');

                                    if (show.indexOf(contactmessagesItem.read) >= 0) {
                                        var showReport = "none";
                                        var showMessage = "none";
                                        var sendPushMessage = "no";
                                    } else

                                    {
                                        var showReport = "show";
                                        var showMessage = "none";
                                        var sendPushMessage = "no";
                                    }

                                    contactmessagesItem.showReport = showReport;
                                    contactmessagesItem.showMessage = showMessage;
                                    contactmessagesItem.sendPushMessage = sendPushMessage;

                                }

                                ////console.log('WE HAVE STATUS UPDATE a ');

                                if (status === '1') {
                                    var badge = "badge badge-gray";
                                    var messagereadnew = localStorage.getItem('messagebadgereadtxt');
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                } else if (status === '0') {
                                    var badge = "badge badge-green";
                                    var messagereadnew = localStorage.getItem('messagebadgenewtxt');
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                } else if (status === '10') {
                                    var badge = "";
                                    // var messagereadnew = localStorage.getItem('messagebadgeSendtxt');
                                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Pending</div>';
                                    var sendstatus = 'pending';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;

                                } else if (status === '20') {
                                    var badge = "";
                                    // var messagereadnew = localStorage.getItem('messagebadgeSendtxt');
                                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Send</div>';
                                    var sendstatus = 'send';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;

                                } else if (status === '30') {
                                    var badge = "";
                                    // var messagereadnew = localStorage.getItem('messagebadgeSendDeliveredtxt');
                                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Delivered</div>';
                                    var sendstatus = 'delivered';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;
                                } else if (status === '40') {

                                    ////console.log('WE HAVE STATUS UPDATE b ');

                                    var badge = "";
                                    // var messagereadnew = localStorage.getItem('messagebadgeSendReadtxt');
                                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Read</div>';
                                    var sendstatus = 'read';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;
                                } else if (status === '50') {
                                    var badge = "";
                                    // var messagereadnew = localStorage.getItem('messagebadgeSendWipedtxt');
                                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Wiped</div>';
                                    var sendstatus = 'wiped';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;
                                } else if (status === '60') {
                                    var badge = "";
                                    // var messagereadnew = localStorage.getItem('messagebadgeSendWipedtxt');
                                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Replied</div>';
                                    var sendstatus = 'replied';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;
                                } else {
                                    var badge = "badge badge-red";
                                    var messagereadnew = localStorage.getItem('messagebadgeUnkowtxt');
                                    var sendstatus = 'unknow';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;
                                }
                                ////console.log('WE HAVE STATUS UPDATE c ');
                            } else

                            {

                                ////console.log('WE HAVE -NO- STATUS UPDATE');

                                if (contactmessagesItem.read === 0 || contactmessagesItem.read === 2) {
                                    var showReport = "none";
                                    var showMessage = "show";
                                    var sendPushMessage = "yes";
                                    var swipeoutoverswipe = "swipeout-overswipe";
                                    contactmessagesItem.showReport = showReport;
                                    contactmessagesItem.showMessage = showMessage;
                                    contactmessagesItem.sendPushMessage = sendPushMessage;
                                    contactmessagesItem.swipeoutoverswipe = swipeoutoverswipe;
                                    ////console.log('read = groter dan 0 kleiner dan 10');
                                } else

                                {
                                    var show = localStorage.getItem('showMessageStatus');
                                    if (show.indexOf(contactmessagesItem.read) >= 0) {
                                        var showReport = "none";
                                        var showMessage = "none";
                                        var sendPushMessage = "no";
                                    } else

                                    {
                                        var showReport = "show";
                                        var showMessage = "none";
                                        var sendPushMessage = "no";
                                    }

                                    contactmessagesItem.showReport = showReport;
                                    contactmessagesItem.showMessage = showMessage;
                                    contactmessagesItem.sendPushMessage = sendPushMessage;
                                }




                                // if (contactmessagesItem.read === 1) {
                                //     var badge = "badge badge-gray";
                                //     var messagereadnew = localStorage.getItem('messagebadgereadtxt');
                                //     contactmessagesItem.badge = badge;
                                //     contactmessagesItem.messagereadnew = messagereadnew;

                                // } 

                                // else if (contactmessagesItem.read === 0) {
                                //     var badge = "badge badge-green";
                                //     var messagereadnew = localStorage.getItem('messagebadgenewtxt');
                                //     contactmessagesItem.badge = badge;
                                //     contactmessagesItem.messagereadnew = messagereadnew;

                                // }


                                if (contactmessagesItem.read === 1) {
                                    var badge = "badge badge-gray";
                                    var messagereadnew = localStorage.getItem('messagebadgereadtxt');
                                    var messagereadnewicon = "read";
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.messagereadnewicon = messagereadnewicon;


                                } else if (contactmessagesItem.read === 0) {
                                    var badge = "badge badge-green";
                                    var messagereadnew = localStorage.getItem('messagebadgenewtxt');
                                    var messagereadnewicon = "new";
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.messagereadnewicon = messagereadnewicon;
                                } else if (contactmessagesItem.read === 10) {
                                    var badge = "";
                                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Pending</div>';
                                    var sendstatus = 'pending';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;
                                } else if (contactmessagesItem.read === 20) {
                                    var badge = "";
                                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Send</div>';
                                    var sendstatus = 'send';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;
                                } else if (contactmessagesItem.read === 30) {
                                    var badge = "";
                                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Delivered</div>';
                                    var sendstatus = 'delivered';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;
                                } else if (contactmessagesItem.read === 40) {
                                    var badge = "";
                                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Read</div>';
                                    var sendstatus = 'read';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;
                                } else if (contactmessagesItem.read === 50) {
                                    var badge = "";
                                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Wiped</div>';
                                    var sendstatus = 'wiped';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;
                                } else if (contactmessagesItem.read === 60) {
                                    var badge = "";
                                    var messagereadnew = '<div id="' + his_uid + decryptMid + 'SendStatus" class="SendStatus">Replied</div>';
                                    var sendstatus = 'replied';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;
                                } else {
                                    var badge = "badge badge-red";
                                    var messagereadnew = localStorage.getItem('messagebadgeUnkowtxt');
                                    var sendstatus = 'unknow';
                                    contactmessagesItem.badge = badge;
                                    contactmessagesItem.messagereadnew = messagereadnew;
                                    contactmessagesItem.sendstatus = sendstatus;
                                }




                                if (contactmessagesItem.autocrypt === 1) {
                                    var autocrypt = "active";
                                    var AutoDecrypt = "<div id='mid" + decryptMid + "' class='mid" + decryptMid + "' >Try Decrypting...</div>";
                                    sessionStorage.setItem(contactmessagesItem.his_uid + 'encryptkey', contactmessagesItem.autocryptkey);
                                    contactmessagesItem.autocrypt = autocrypt;
                                    contactmessagesItem.AutoDecrypt = AutoDecrypt;
                                } else

                                {
                                    if (sessionStorage.getItem(contactmessagesItem.his_uid + 'encryptkey') != null) {
                                        var AutoDecrypt = "<div id='mid" + decryptMid + "' class='mid" + decryptMid + "'>Try Decrypting..." + decryptMid + "</div>";
                                        contactmessagesItem.AutoDecrypt = AutoDecrypt;
                                    } else

                                    {
                                        var autocrypt = "";
                                        var AutoDecrypt = '<span>Message : locked.</span>';
                                        contactmessagesItem.autocrypt = autocrypt;
                                        contactmessagesItem.AutoDecrypt = AutoDecrypt;
                                    }
                                }

                                if (contactmessagesItem.nuonline === '1') {
                                    var online = "active";
                                    contactmessagesItem.online = online;
                                } else {
                                    var online = "";
                                    contactmessagesItem.online = online;
                                }
                            }

                            ////console.log('WE HAVE STATUS UPDATE x ');
                            items.push(contactmessagesItem);
                            ////console.log('WE HAVE STATUS UPDATE x x');

                        }

                        // 0 = new
                        // 1 = read
                        // 10 = pending
                        // 20 = send
                        // 30 = delivered
                        // 40 = read
                        // 50 = wiped
                        // 60 = replied

                        $('#A00000000').remove();

                        if (status) {

                            //myMessagesList.update();

                            ////console.log('HAVE STATUS DO UPDATE DIV A = '+ status); 
                            var show = localStorage.getItem('showMessageStatus');
                            if (show.indexOf(status) != 0) {
                                ////console.log('HAVE STATUS DO UPDATE DIV = ' + his_uid+mdatum + ' = '+ status);  
                                sessionStorage.setItem('lastStatusUpdate' + his_uid + mdatum, status);
                                ////console.log('sessionStorage.setItem' + his_uid+mdatum+' : DATA = ' +sessionStorage.getItem('lastStatusUpdate'+his_uid+mdatum));  

                                if (['60'].indexOf(status) + 1) {
                                    ////console.log('UPDATE DIV REPLIED = ' +his_uid+mdatum); 
                                    // $('#'+his_uid+decryptMid+'SendStatus').html($(messagereadnew).fadeIn(1000));
                                    // $('#icon'+his_uid+mdatum).removeClass();
                                    // $('#icon'+his_uid+mdatum).addClass('icons_sendstatus');
                                    // $('#icon'+his_uid+mdatum).addClass(sendstatus);
                                    // //console.log('UPDATE loadContent = ' +status); 
                                    // playNotificationSound('plop.mp3');
                                    //$('#'+his_uid+mdatum).remove();
                                    //$('#li'+his_uid+mdatum).remove();
                                }
                                if (['50'].indexOf(status) + 1) {
                                    ////console.log('UPDATE DIV WIPED = ' +status);  
                                    // $('#'+his_uid+decryptMid+'SendStatus').html($(messagereadnew).fadeIn(1000));
                                    // $('#icon'+his_uid+mdatum).removeClass();
                                    // $('#icon'+his_uid+mdatum).addClass('icons_sendstatus');
                                    // $('#icon'+his_uid+mdatum).addClass(sendstatus);
                                    //$('#A00000000').remove();
                                    //$('#li'+his_uid+mdatum).remove();
                                }
                                // read 
                                if (['40'].indexOf(status) + 1) {
                                    ////console.log('UPDATE DIV READ  = ' +status);  
                                    $('#' + his_uid + decryptMid + 'SendStatus').html($(messagereadnew).fadeIn(1000));
                                    $('#icon' + his_uid + mdatum).removeClass();
                                    $('#icon' + his_uid + mdatum).addClass('icons_sendstatus');
                                    $('#icon' + his_uid + mdatum).addClass(sendstatus);
                                    if (playSound !== 'playSoundNO') {
                                        playNotificationSound('plop.mp3');
                                        ////console.log('playNotificationSound status = ' + stastus + ' - '+ sessionStorage.getItem('playNotificationSound'));  
                                    }
                                }

                                // delivered
                                if (['30'].indexOf(status) + 1) {
                                    setTimeout(function() {
                                        ////console.log('UPDATE DIV DELIVERED = ' +his_uid+mdatum); 
                                        $('#' + his_uid + decryptMid + 'SendStatus').html($(messagereadnew).fadeIn(1000));
                                        $('#icon' + his_uid + mdatum).removeClass();
                                        $('#icon' + his_uid + mdatum).addClass('icons_sendstatus');
                                        $('#icon' + his_uid + mdatum).addClass(sendstatus);
                                        ////console.log('UPDATE loadContent = ' + status);
                                        if (playSound !== 'playSoundNO') {
                                            playNotificationSound('plop.mp3');
                                            ////console.log('playNotificationSound status = ' + stastus + ' - '+ sessionStorage.getItem('playNotificationSound'));  
                                        }
                                    }, 1000);
                                }

                                // send

                                if (['20'].indexOf(status) + 1) {
                                    setTimeout(function() {
                                        //console.log('UPDATE DIV SEND = ' +his_uid+mdatum); 
                                        $('#' + his_uid + decryptMid + 'SendStatus').html($(messagereadnew).fadeIn(1000));
                                        $('#icon' + his_uid + mdatum).removeClass();
                                        $('#icon' + his_uid + mdatum).addClass('icons_sendstatus');
                                        $('#icon' + his_uid + mdatum).addClass(sendstatus);
                                        //console.log('UPDATE loadContent = ' + status);
                                        if (playSound !== 'playSoundNO') {
                                            playNotificationSound('plop.mp3');
                                            ////console.log('playNotificationSound status = ' + stastus + ' - '+ sessionStorage.getItem('playNotificationSound'));  
                                        }
                                    }, 1000);
                                }

                                // pending
                                if (['10'].indexOf(status) + 1) {
                                    //console.log('PREPEND MESSAGE PENDING items = ' +items); 


// var selectItemId = sessionStorage.getItem('selectItemId');

// //console.log('+++++++ selectItemId: ', selectItemId); 
// //var itemid = number(item) + 1;
// myMessagesList.deleteItem(selectItemId);

// sessionStorage.removeItem('selectItemId');
// myMessagesList.update();




                                    myMessagesList.prependItems(items);
                                    sessionStorage.totalMessagesList = Number(sessionStorage.totalMessagesList) + 1;
                                    ////console.log('PREPEND MESSAGE PENDING SUCCESFULL DONE ! items = ' +items);  
// myMessagesList.update();
//                                   // JsonMessagesToSend();
// myMessagesList.clearCache();

                                }


                            }


                        } // end have status
                        else

                        {

                            //console.log('------- NO STATUS = ');
                            //console.log('------- New items ' + items);

                            

                           // myMessagesList.clearCache();
                            // myMessagesList.destroy();

                            myMessagesList.prependItems(items);

myMessagesList.update();
                            sessionStorage.totalMessagesList = Number(sessionStorage.totalMessagesList) + 1;

                            //console.log('------- New Message myMessagesList.prependItems ' + items);

                            totalMessageUpdate();

                            setTimeout(function() {
                                playNotificationSound();
                            }, 300);

                            setTimeout(function() {

                                for (
                                    var i = 0; i < rs.rows.length; i++) {
                                    var contactmessagesItem = rs.rows.item(i);

                                    var autocryptkey = sessionStorage.getItem(contactmessagesItem.his_uid + 'encryptkey');

                                    if (autocryptkey != null && contactmessagesItem.read < 10) {

                                        autoDecryptMessage(contactmessagesItem.mid, autocryptkey, contactmessagesItem.message, function(decryptMid, callbackDecryptMessage) {

                                            $$('.mid' + decryptMid).html('<span>Message : ' + callbackDecryptMessage + '</span>');
                                        }); // end functio
                                    } // end if
                                } // end for
                            }, 500);
                        } // end addon new
                    } // end template
                    else

                    {
                        //console.log('RECORD DONT EXIST');
                        // alert user dont exist 
                    }

            };
            app.selectAllRecords(render);

        }
    } // end function makeContactList


function autoDecryptMessage(decryptMid, setkey, message, callback) {


    // //console.log('autoDecryptMessage = ' + decryptMid);  


    var message_old = "";

    var message = message.replace(/ /g, '+');


    // //console.log('decryptMid = ' +decryptMid); 
    // //console.log('message = ' +message); 

    ////console.log('setkey = ' + setkey);

    try {

        var message_old = sjcl.decrypt(setkey, message);

        var n = message_old.lastIndexOf("message-text");
        ////console.log('message-text = ' + n);
        nstart = n + 14;
        var callbackDecryptMessage = message_old.slice(nstart, -12);
        ////console.log('message-text = ' +  callbackDecryptMessage);
        setTimeout(function() {
            callback(decryptMid, callbackDecryptMessage);
        }, 300);
    } catch (err) {
        setTimeout(function() {

            //console.log('!!! CATCH ERROR WRONG setkey');

            callback(decryptMid, 'Error...Wrong key?');

        }, 300);
    }
    return autoDecryptMessage;
}


// //////////////////////////////////////////////////////////////////////
myApp.onPageInit('Smessages-send-new', function(e) {
    localStorage.setItem('activePage', 'messages-send-new');

    //console.log('page.name Smessages-send-new');
    myApp.hideIndicator();
    localStorage.setItem('showalert', 0);
    myApp.showTab('#contactsview');
    //console.log('------------------------------');
    //console.log('INIT MESSAGES-SEND-NEW');
//    console.log(e.query);
    //console.log('------------------------------');
    document.activeElement.blur();

    var conversationStarted = false;
    var myMessages = myApp.messages('.messages', {
        autoLayout: true
    });


    var mid = e.query.mid;
    var his_uid = e.query.his_uid;
    var his_nick = e.query.his_nick;
    var his_server = e.query.his_server;
    var activeLi = activeLi;



    if(his_server === '0000'){

        // show alert first wait on confimation


        var data = {
            "his_uid": his_uid,
            "my_uid": localStorage.getItem('UID'),
            "his_nick": his_nick
        };

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

                        },
                        error: function(responseData, textStatus, errorThrown) {
                            ////console.log('something went wrong!! Error: ' +textStatus);
                            myApp.hidePreloader();
                            myApp.alert('Error. please try again.', function() {
                                PushErrorToSupport(errorThrown);
                            });
                        }
                    }); // end ajax



        myApp.modal({
            title: 'CONTACT NOT CONFIRM',
            text: 'We resend your request, Please wait for contact to confim your contact reqeust.',
            buttons: [{
                text: localStorage.getItem('OKE'),
                onClick: function() {

                        contactsview.router.back({
                            url: 'frames/contacts/contacts.html',
                            reload: true
                        });

                }
            }]
        });

    }

//    //console.log('!!!!!');
    

$$('.his_nick').html(his_nick);








$$('.vcard').on('click', function() {
        //console.log('vcard Pressed 3');


        var prepair = '<div class="message message-send message-vcard"><span>INSERT VCARD (.........)</span></DIV>';
        
        // var old = '<img src="img/loader.png" alt="Busy" height="15" width="15">INSERT VCARD PLEASE WAIT...';

        $$('#thevcard').html(prepair);

        var popupHTML = '<div class="popup">'+

                    '<div class="content-block">'+


                    '  <div class="row">'+
                    '    <div class="col-80"><p>SELECT CONTACT TO SHARE</p></div>'+
                    '    <div class="col-20"><p><a href="#" onclick="cancelThisVcard(this)" >CANCEL</a></p></div>'+
                    '  </div>'+

                        '<div class="vcardList media-list list-block virtual-list"></div>'+

                    '</div>'+
                  '</div>';

      myApp.popup(popupHTML);

      //console.log('OPEN myVcard = ');

    makeVcard();

    });







    $$('.camera').on('click', function() {
        //console.log('camera Pressed 3');


        var prepair = '<div class="message message-sent message-pic theimage">INSERT PHOTO ...';
        
        // var old = '<img src="img/loader.png" alt="Busy" height="15" width="15">INSERT PHOTO PLEASE WAIT...';

        $$('#theimage').html(prepair);


        setTimeout(function() {
            navigator.camera.getPicture(onSuccess,
                onFail, {
                    quality: 50,
                    targetWidth: 260,
                    targetHeight: 260,
                    destinationType: Camera.DestinationType.DATA_URL
                });

            function onSuccess(base64Img) {
                //console.log('-- THE IMAGE onSuccess');

                var theimage = '<div class="message message-sent message-pic message-last"><img src="data:image/jpeg;base64,' + base64Img + '"></div>';

                $$('#theimage').html(theimage);



var conversationStarted = false;
var myMessages = myApp.messages('.messages', {
  autoLayout:true
});
var avatar, name;

var messageType = 'sent';

//var messageText = '<div class="message message-sent message-pic message-last"><img src="data:image/jpeg;base64,' + base64Img + '"></div>';

// var messageText = 'New contact';


// //console.log('myMessages.addMessage ');

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

// //console.log('myMessages.addMessage DONE');

//   // Update conversation flag
//   conversationStarted = true;

//   var myMessages = $$('.messages')[0].f7Messages;

// myMessages.scrollMessages();



               
var theimagestore = '<div class="message message-pic"><img src="data:image/jpeg;base64,' + base64Img + '"></div>';

sessionStorage.setItem('imageURL', theimagestore);







                //console.log('-- THE IMAGE onSuccess DONE');
                //console.log('page.name Smessages-send-new B');
                
                var myMessages = $$('.messages')[0].f7Messages;

                myMessages.scrollMessages();
            }

            function onFail(message) {
                //myApp.alert('Failed because: ' + message);
                $$('#theimage').html('');
            }
        }, 10);
    });

    //console.log('page.name Smessages-send-new 1');


    $$('.messagebar .link.send').on('click', function() {


        var message_new = $$('textarea#receive').val();



var sendMessage = 'no';


// if(sessionStorage.getItem('imageURL') || sessionStorage.getItem('vCardstore') ) { 
//     //console.log('have session image or vcard sendMessage = yes');
//     var sendMessage = 'yes'; 
// }


if(message_new.length !== 0) { 
    //console.log('message_new.length sendMessage = yes');
    var sendMessage = 'yes'; 
} 

if(sessionStorage.getItem('imageURL') || sessionStorage.getItem('vCardstore') ) { 
    //console.log('2314 have session image or vcard sendMessage = yes');
    var sendMessage = 'yes'; 

    if (message_new.length === 0) {
        if( sessionStorage.getItem('imageURL')) {     
            //console.log('have session image');
            var message_new = 'New picture';  
        }
        if( sessionStorage.getItem('vCardstore') ) {     
            //console.log('have session vCardstore');
            var message_new = 'New contact';  
        }

   } 
}



        // if (message_new.length === 0) {
        //     document.activeElement.blur();
        //     myApp.alert('Messages cannot be empty!');
        // } 


        if (sendMessage === 'no') {
            document.activeElement.blur();
            myApp.alert('Messages cannot be empty!');
        } 

        else

        {

            var messages_old = '';




var conversationStarted = false;
var myMessages = myApp.messages('.messages', {
  autoLayout:true
});
var avatar, name;

var messageType = 'sent';

var messageText = message_new;

//console.log('myMessages.addMessage ');

myMessages.addMessage({
    // Message text
    text: messageText,
    // Random message type
    type: messageType,
    // Avatar and name:
    avatar: avatar,
    name: name,
    // Day
    day: !conversationStarted ? 'Today' : false,
    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
  })

//console.log('myMessages.addMessage DONE');

  // Update conversation flag
  conversationStarted = true;

  var myMessages = $$('.messages')[0].f7Messages;

myMessages.scrollMessages();





            if (localStorage.getItem(his_uid + 'encryptkey')) {



                // //console.log('-------------------------------------------------');
                // //console.log('localStorage KEY + ' + localStorage.getItem(his_uid + 'encryptkey'));
                // //console.log('localStorage his_uid + ' + his_uid);
                // //console.log('-------------------------------------------------');



                sessionStorage.setItem(his_uid + 'encryptkey', localStorage.getItem(his_uid + 'encryptkey'));
                ////console.log('sessionkey maked');
            }

                //console.log('-------------------------------------------------');
                //console.log('sessionStorage his_uid ' + his_uid + ' KEY + ' + sessionStorage.getItem(his_uid + 'encryptkey'));
                //console.log('-------------------------------------------------');


            if (sessionStorage.getItem(his_uid + 'encryptkey')) {

                cryptingStart();






                var thekey = sessionStorage.getItem(his_uid + 'encryptkey');

                document.activeElement.blur();

                var message_old = '';



//var myMessages = $$('.messages')[0].f7Messages;

var data =[];
$('.message').each(function(){

   data.push({text: $(this).find('.message-text').html()});

});




// // Init Messages
// var myMessages = myApp.messages('.messages', {
//   autoLayout:true
// });

                //console.log('-------------------------------------------------');
                //console.log('f7Messages + ' + myMessages);
                console.log(data);
                //console.log('-------------------------------------------------');





                insertMessageSQLite('', thekey, his_uid, his_server, message_new, message_old);


                //console.log('-------------------------------------------------');
                //console.log('loadPage');
                //console.log('-------------------------------------------------');

                

                setTimeout(function() {

myApp.showTab('#messagesview');


                    contactsview.router.back({
                        url: 'frames/contacts/contacts.html',
                        animatePages: false,
                        reload: true
                    });



                }, 500);

            } // end session exist
            
            else 
            
            {
                ////console.log('KEY BESTAAT NIET');
                document.activeElement.blur();

                //console.log('NO KEY SET KEY B!');

                $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') + "/strings.json",
                    function(languageSpecificObject) {



var inputKeyValue = myApp.modal({
            title:  languageSpecificObject.languageSpecifications[0]['encryptmessage'],
            text: languageSpecificObject.languageSpecifications[0]['yourkeyfor'] + '<BR>' + his_uid + ' (' + his_nick + ')',
        afterText: '<input type="text" class="modal-text-input">',
        buttons: [
            {
                text: localStorage.getItem('CANCEL')
            },
            {
                text: localStorage.getItem('OKE'),
                close: false
            }
        ],
        onClick: function (modal, index) {
            if (index === 0 ) {

                var value = $(modal).find('.modal-text-input').val();

                //console.log('inputvalue 0:',value);

            }


            if (index === 1 ) {

                var value = $(modal).find('.modal-text-input').val();

                //console.log('inputvalue 1:',value);

                if(value.length < 4) {

                    //console.log('inputvalue EMPTY:',value);

                    window.plugins.toast.show('please enter at least 4 characters', 'short', 'center');

                    return false;
                    
                }
                else
                {
                    myApp.closeModal();

                                var newkey = value;
                                var thekey = newkey.toLowerCase();
                                var thekey = calcMD5(thekey);

                                //console.log('SET SESSION = ' + his_uid + 'encryptkey = ' + thekey);

                                sessionStorage.setItem(his_uid + 'encryptkey', thekey);

                                var message_old = '';

                                insertMessageSQLite('', thekey, his_uid, his_server, message_new, message_old, activeLi);

                               

                                setTimeout(function() {


                                    contactsview.router.back({
                                        url: 'frames/contacts/contacts.html',
                                        animatePages: false,
                                        reload: true
                                    });

 myApp.showTab('#messagesview');

                                }, 500);

                }

            }

        }
});


//                         myApp.prompt(
//                             languageSpecificObject.languageSpecifications[0]['yourkeyfor'] + '<BR>' + his_uid + ' (' + his_nick + ')',
//                             languageSpecificObject.languageSpecifications[0]['encryptmessage'],
//                             function(value) {

// if(value.length >= 4) {

//                                 var newkey = value;
//                                 var thekey = newkey.toLowerCase();
//                                 var thekey = calcMD5(thekey);

//                                 //console.log('SET SESSION = ' + his_uid + 'encryptkey = ' + thekey);

//                                 sessionStorage.setItem(his_uid + 'encryptkey', thekey);

//                                 var message_old = '';

//                                 insertMessageSQLite('', thekey, his_uid, his_server, message_new, message_old, activeLi);

//                                 myApp.showTab('#messagesview');


//                                 setTimeout(function() {
//                                     contactsview.router.back({
//                                         url: 'frames/contacts/contacts.html',
//                                         animatePages: false,
//                                         reload: true
//                                     });
//                                 }, 400);

// }

// else


// {

// return;


// }




                            // }); // end promt

                    });

            } // end else
        } // end if messages == empty

    }); // end page.container 

    //console.log('page.name Smessages-send-new END');

}); // end page.name




//*************************************************************************************************************
//********************** END PAGE INIT ****************************************************************************
//*************************************************************************************************************
myApp.onPageInit('Smessages-send', function(e) {
    localStorage.setItem('activePage', 'messages-send');

    //console.log('page.name Smessages-send');
    localStorage.setItem('showalert', 0);

    myApp.showTab('#messagesview');


    document.activeElement.blur();
    myApp.showIndicator();
    //console.log('------------------------------');
    //console.log('INIT MESSAGES-SEND');
 //   console.log(e.query);
    //console.log('------------------------------');
    var conversationStarted = false;

    var myMessages = myApp.messages('.messages', {
        autoLayout: true
    });

    var mid = e.query.mid;
    var his_uid = e.query.his_uid;
    var his_nick = e.query.his_nick;
    var his_server = e.query.his_server;
    var totalmessages = e.query.totalmessages;
    var activeLi = e.query.activeLi;
    var uid = localStorage.getItem('UID');



        $$('#blink'+ mid).removeClass('new');

    sessionStorage.setItem('his_uid', his_uid);
    sessionStorage.setItem('his_nick', his_nick);
    sessionStorage.setItem('his_server', his_server);
    sessionStorage.setItem('mid', mid);


    sessionStorage.setItem('messagesReadStatus', mid);

$$('.his_nick').html(his_nick);


$$('.vcard').on('click', function() {
        //console.log('vcard Pressed 3');


        var prepair = '<div class="message message-send message-vcard"><span>INSERT VCARD (.........)</span></DIV>';

        
        // var old = '<img src="img/loader.png" alt="Busy" height="15" width="15">INSERT VCARD PLEASE WAIT...';

        $$('#thevcard').html(prepair);

        var popupHTML = '<div class="popup">'+

                    '<div class="content-block">'+


                    '  <div class="row">'+
                    '    <div class="col-80"><p>SELECT CONTACT TO SHARE</p></div>'+
                    '    <div class="col-20"><p><a href="#" onclick="cancelThisVcard(this)" >CANCEL</a></p></div>'+
                    '  </div>'+

                        '<div class="vcardList media-list list-block virtual-list"></div>'+

                    '</div>'+
                  '</div>';

      myApp.popup(popupHTML);

      //console.log('OPEN myVcard = ');

    makeVcard();

    });



    $$('.camera').on('click', function() {
        //console.log('camera Pressed 2');

        var prepair = '<div class="message message-sent message-pic">INSERT PHOTO PLEASE WAIT...';

        // var old = '<img src="img/loader.png" alt="Busy" height="15" width="15">INSERT PHOTO PLEASE WAIT...';


        $$('#theimage').html(prepair);

        setTimeout(function() {

            navigator.camera.getPicture(onSuccess,
                onFail, {
                    quality: 50,
                    targetWidth: 260,
                    targetHeight: 260,
                    destinationType: Camera.DestinationType.DATA_URL
                });

            function onSuccess(base64Img) {
                //console.log('-- THE IMAGE onSuccess');
                var theimage = '<div class="message message-sent message-pic message-last"><img src="data:image/jpeg;base64,' + base64Img + '"></div>';
                $$('#theimage').html(theimage);
                var theimagestore = '<div class="message message-pic"><img src="data:image/jpeg;base64,' + base64Img + '"></div>';

                sessionStorage.setItem('imageURL', theimagestore);
                //console.log('-- THE IMAGE onSuccess DONE');
                var myMessages = $$('.messages')[0].f7Messages;


                setTimeout(function() {
                    myMessages.scrollMessages();
                }, 100);

            }

            function onFail(message) {
               // myApp.alert('Failed because: ' + message);
                $$('#theimage').html('');
            }

        }, 10);
    });


    if (localStorage.getItem(his_uid + 'encryptkey')) {
        sessionStorage.setItem(his_uid + 'encryptkey', localStorage.getItem(his_uid + 'encryptkey'));
    }


    app.selectAllRecords = function(fn) {
        app.db.transaction(function(tx) {

            //console.log('app.db.transaction');

            if (sessionStorage.getItem('mid') != 'undefined') {
                //console.log('selectMIDByMid 1 from mid = ' + sessionStorage.getItem('mid'));
                tx.executeSql(selectMIDByMid, [sessionStorage.getItem('mid')], fn, app.onError);
            } else {
                //console.log('selectMID 1 available message. for his_uid = ' + sessionStorage.getItem('his_uid'));
                tx.executeSql(selectMID, [localStorage.getItem('UID'), sessionStorage.getItem('his_uid')], fn, app.onError);
            }
        });
    }


    var render = function(tx, rs) {
        for (var i = 0; i < rs.rows.length; i++) {
            var data = rs.rows.item(i);
            //console.log('data READ = ' + data);

            var mid = data.mid;
            var message = data.message;
            var his_server = data.his_server;
            var his_his_nick = data.his_nick;
            var mdatum = data.mdatum;


            //console.log('mdatum DBASE = ' + mdatum);
            sessionStorage.setItem('Pushmdatum', mdatum);
            //console.log('mdatum READ = ' + sessionStorage.getItem('Pushmdatum'));


            var setkey = sessionStorage.getItem(his_uid + 'encryptkey');


            // //console.log('+++ setkey = ' + sessionStorage.getItem(his_uid + 'encryptkey'));

            myApp.showIndicator();

            var message_old = "";
            var message = message.replace(/ /g, '+');

            try {
                var message_old = sjcl.decrypt(setkey, message);

                //console.log('INTERNAL DECRYPT');

                if (message_old == '') {
                    myApp.modal({
                        title: 'Crypting',
                        text: 'Oops, a Error. maybe key wrong?',



                        buttons: [

                        {
                            text: 'TRY AGAIN',
                            onClick: function() {
                                sessionStorage.removeItem(his_uid + 'encryptkey', '');
                                sessionStorage.removeItem('mid');
                                myApp.alert('KEY resetted!');
                                messagesview.router.back({
                                    url: 'frames/contacts/Scontactlist.html',
                                    reload: true
                                });
                            }
                        }, 

                        // {
                        //     text: 'DELETE',
                        //     onClick: function() {
                        //         var lastTime = 0;
                        //         if (mid) {
                        //             app.db.transaction(function(tx) {
                        //                 tx.executeSql(removeMessagesToReceive, [mid], onRemovedSuccess, onError);
                        //                 var now = new Date().getTime();
                        //                 if (now - lastTime > 1000) {
                        //                     $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
                        //                         "/strings.json",
                        //                         function(languageSpecificObject) {
                        //                             var themessage = languageSpecificObject.languageSpecifications[0]['messageswiped']; // TRANSLATE
                        //                             $$.ajax({
                        //                                 method: 'POST',
                        //                                 dataType: 'jsonp',
                        //                                 url: localStorage.getItem('pushserver'),
                        //                                 crossDomain: true,
                        //                                 data: {
                        //                                     my_uid: localStorage.getItem('UID'),
                        //                                     his_uid: his_uid,
                        //                                     themessage: themessage
                        //                                 },
                        //                                 success: function(responseData, textStatus, jqXHR) {
                        //                                     sessionStorage.removeItem('mid');
                        //                                 }
                        //                             });
                        //                         }
                        //                     );
                        //                 }
                        //                 lastTime = now;
                        //                 SQLiteUpdateMessagesTotal();
                        //             });
                        //         }
                        //         contactview.router.back({
                        //             url: 'frames/contacts/Scontactlist.html',
                        //             reload: true
                        //         });
                        //     }
                        // }, 

                        // {
                        //     text: 'TRY AGAIN',
                        //     onClick: function() {

                        //         sessionStorage.removeItem(his_uid + 'encryptkey', '');
                        //         sessionStorage.removeItem('mid');

                        //         messagesview.router.back()
                        //     }
                        // }, 



                        ]
                    })




                }

                var hesaid = new RegExp(sessionStorage.getItem('his_uid'), 'g');
                message_old = message_old.replace(hesaid, his_nick);

                var isaid = new RegExp(localStorage.getItem('UID'), 'g');
                message_old = message_old.replace(isaid, 'Me');

                var myApptemp = new RegExp('message-send', 'g');
                message_old = message_old.replace(myApptemp, 'myApptemp');
                // message-received > message-sent
                var receivedtemp = new RegExp('message-received', 'g');
                message_old = message_old.replace(receivedtemp, 'message-send');
                // myApptemp > message-received
                var sendtemp = new RegExp('myApptemp', 'g');
                message_old = message_old.replace(sendtemp, 'message-received');
                ////console.log('**********************************************');
                ////console.log('*************** MESSAGE OLD AFTER *******************');
                //console.log(message_old);
                ////console.log('**********************************************');
                sessionStorage.setItem('message_old', message_old);
                $$('.hisnickinfonavbar').html('');
                $$('.hisuidlastseen').html('');

                app.db.transaction(function(tx) {
                    tx.executeSql(updateMessageToRead, ['1', mid], onUpdateSuccess, onError);
                    tx.executeSql(updateBadgeTo, [], onUpdateSuccess, onError);
                });

                totalMessageUpdate();

                $$('.messageoldsend').html(sessionStorage.getItem('message_old'));

                myApp.hideIndicator();
                myApp.hidePreloader();

                var myMessages = $$('.messages')[0].f7Messages;

                setTimeout(function() {
                    myMessages.scrollMessages();
                }, 100);


                var uid = localStorage.getItem('UID');

                $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') + "/strings.json",
                    function(languageSpecificObject) {
                        var themessage = languageSpecificObject.languageSpecifications[0]['messagesread']; // TRANSLATE

                        //console.log('PushNotification = Read');
                        //console.log('PushDatum = ' + sessionStorage.getItem('Pushmdatum'))

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
                                sendStatusUpdate: '40'
                            },
                            success: function(responseData, textStatus, jqXHR) {
                                console.log(responseData);
                                //console.log('------------------------------');
                            }
                        });
                    });




                var lastTime = 0;


                $$('.Aautodelete').on('click', function() {


                    if (mid) {
                        //console.log('A CLICK AUTODELETE ');
                        app.db.transaction(function(tx) {
                            tx.executeSql(removeMessagesToReceive, [mid], onRemovedSuccess, onError);

                            sessionStorage.totalMessagesList = Number(sessionStorage.totalMessagesList) - 1;


                            var now = new Date().getTime();
                            if (now - lastTime > 1500) {
                                $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') + "/strings.json",
                                    function(languageSpecificObject) {
                                        var themessage = languageSpecificObject.languageSpecifications[0]['messageswiped']; // TRANSLATE

                                        //console.log('PushNotification = Wiped');
                                        //console.log('PushDatum = ' + sessionStorage.getItem('Pushmdatum'));

                                        $$.ajax({
                                            method: 'POST',
                                            dataType: 'jsonp',
                                            url: localStorage.getItem('pushserver'),
                                            crossDomain: true,
                                            data: {
                                                my_uid: uid,
                                                his_uid: his_uid,
                                                themessage: themessage,
                                                mdatum: sessionStorage.getItem('Pushmdatum'),
                                                sendStatusUpdate: '50'
                                            },
                                            success: function(responseData, textStatus, jqXHR) {
                                                sessionStorage.removeItem('mid');
                                                console.log(responseData);
                                            }
                                        });

                                    });
                            }


                            makeNewMessageList('reFreshYes');

                            // messagesview.router.load({
                            //     url: 'frames/messages/messages.html',
                            //     reload: true
                            // });



                            SQLiteUpdateMessagesTotal();
                        });
                    }
                });



                $$('.message-send-back').on('click', function() {

                    //console.log('.message-send-back');
                    sessionStorage.removeItem('selectItemId');
                    // makeNewMessageList('reFreshYes');
                })


                $$('.newmessage').on('click', function() {
                    //console.log('CLICK newmessage2');
                    sessionStorage.removeItem('mid');
                });


                $$('.changekey').on('click', function() {
                    myApp.confirm('RESET KEY?', function() {
                        sessionStorage.removeItem(his_uid + 'encryptkey', '');
                        sessionStorage.removeItem('mid');
                        myApp.alert('KEY resetted!');

                        localStorage.removeItem(his_uid + 'encryptkey');
                        app.db.transaction(function(tx) {
                            tx.executeSql(updateKey, ['0', '', his_uid], onUpdateSuccess, onError);
                        });


                        messagesview.router.back();

                    }, function() {
                        myApp.alert('You clicked Cancel button');
                    });
                });


                $$('.changekeyMessagesList').on('click', function() {
                    myApp.confirm('RESET KEY?', function() {
                            sessionStorage.removeItem(his_uid + 'encryptkey', '');
                            sessionStorage.removeItem('mid');
                            myApp.alert('KEY resetted!');
                            localStorage.removeItem(his_uid + 'encryptkey');
                            app.db.transaction(function(tx) {
                                tx.executeSql(updateKey, ['0', '', his_uid], onUpdateKeySuccess, onError);
                            });
                            function onUpdateKeySuccess(){
                                messagesview.router.back({ url:'frames/messages/messages.html',reload:true});
                            }
                        },

                        function() {});
                });




                // -----------------------------------------------------------------------------
                $$('.messagebar .link.send').on('click', function() {
                    var message_new = $$('textarea#receive').val();

var sendMessage = 'no';





if(message_new.length !== 0) { 
    //console.log('message_new.length sendMessage = yes');
    var sendMessage = 'yes'; 
} 


if(sessionStorage.getItem('imageURL') || sessionStorage.getItem('vCardstore') ) { 
    //console.log('2314 have session image or vcard sendMessage = yes');
    var sendMessage = 'yes'; 

    if (message_new.length === 0) {
        if( sessionStorage.getItem('imageURL')) {     
            //console.log('have session image');
            var message_new = 'New picture';  
        }
        if( sessionStorage.getItem('vCardstore') ) {     
            //console.log('have session vCardstore');
            var message_new = 'New contact';  
        }

   } 
}






        // if (message_new.length === 0) {
        //     document.activeElement.blur();
        //     myApp.alert('Messages cannot be empty!');
        // } 


        if (sendMessage === 'no') {
            document.activeElement.blur();
            myApp.alert('Messages cannot be empty!');
        } 








                    // if (message_new.length === 0) {
                    //     document.activeElement.blur();
                    //     myApp.alert('Messages cannot be empty!');
                    // } 

                    else

                    {

var conversationStarted = false;
var myMessages = myApp.messages('.messages', {
  autoLayout:true
});
var avatar, name;

var messageType = 'sent';

var messageText = message_new;

//console.log('myMessages.addMessage ');

myMessages.addMessage({
    // Message text
    text: messageText,
    // Random message type
    type: messageType,
    // Avatar and name:
    avatar: avatar,
    name: name,
    // Day
    day: !conversationStarted ? 'Today' : false,
    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
  })

//console.log('2410 myMessages.addMessage DONE');

  // Update conversation flag
  conversationStarted = true;

  var myMessages = $$('.messages')[0].f7Messages;

myMessages.scrollMessages();



                        if (localStorage.getItem(his_uid + 'encryptkey')) {
                            sessionStorage.setItem(his_uid + 'encryptkey',
                                localStorage.getItem(his_uid + 'encryptkey'));

                        }

                        if (sessionStorage.getItem(his_uid + 'encryptkey')) {
                            cryptingStart();

                            var thekey = sessionStorage.getItem(his_uid + 'encryptkey');
                            document.activeElement.blur();

                            insertMessageSQLite(mid, thekey, his_uid, his_server, message_new, sessionStorage.getItem('message_old'), activeLi);


                            // setTimeout(function(){

                            //       messagesview.router.load({url:'frames/messages/messages.html', reload:true});

                            // },300);


                // myApp.showTab('#messagesview');

                // setTimeout(function() {
                //     messagesview.router.back({
                //         url: 'frames/messages/messages.html',
                //         animatePages: false,
                //         reload: true
                //     });


                // }, 400);



                //console.log('-------------------------------------------------');
                //console.log('loadPage');
                //console.log('-------------------------------------------------');

                

                setTimeout(function() {

myApp.showTab('#messagesview');


                    contactsview.router.back({
                        url: 'frames/contacts/contacts.html',
                        animatePages: false,
                        reload: true
                    });



                }, 500);

                        } // end session exist




                        //             } // end else
                    } // end if messages == empty
                }); // end page.container 
            } catch (err) {
                myApp.hidePreloader();
                //console.log('Oops, a Error. maybe key wrong?');
                myApp.modal(

                {
                    title: 'Crypting',
                    text: 'Oops, a Error. maybe key wrong?',
                    buttons: [


                    {
                        text: 'TRY AGAIN',
                        onClick: function() {
                            sessionStorage.removeItem(his_uid + 'encryptkey');
                            sessionStorage.removeItem('mid');
                            myApp.alert('KEY resetted!');
                            myApp.hideIndicator();
                            messagesview.router.back({
                                url: 'frames/messages/messages.html',
                                reload: true
                            });
                        }
                    }, 


                    // {
                    //     text: 'WIPE',
                    //     onClick: function() {
                    //         //console.log('D CLICK WIPE ');
                    //         if (sessionStorage.getItem('mid')) {
                    //             app.db.transaction(
                    //                 function(tx) {
                    //                     tx.executeSql(removeMessagesToReceive, [mid], onRemovedSuccess, onError);
                    //                     $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') + "/strings.json",
                    //                         function(languageSpecificObject) {
                    //                             var themessage = languageSpecificObject.languageSpecifications[0]['messageswiped']; // TRANSLATE
                    //                             $$.ajax({
                    //                                 method: 'POST',
                    //                                 dataType: 'jsonp',
                    //                                 url: localStorage.getItem('pushserver'),
                    //                                 crossDomain: true,
                    //                                 data: {
                    //                                     my_uid: localStorage.getItem('UID'),
                    //                                     his_uid: his_uid,
                    //                                     themessage: themessage
                    //                                 },
                    //                                 success: function(responseData, textStatus, jqXHR) {
                    //                                     sessionStorage.removeItem('mid');
                    //                                 }
                    //                             });
                    //                         }
                    //                     );
                    //                     SQLiteUpdateMessagesTotal();
                    //                 });
                    //         }
                    //         myApp.hideIndicator();
                    //         messagesview.router.back();
                    //     }
                    // }, 


                    //     {
                    //         text: 'TRY AGAIN',
                    //         onClick: function() {

                    //             sessionStorage.removeItem(his_uid + 'encryptkey', '');
                    //             sessionStorage.removeItem('mid');
                                
                    //             messagesview.router.back()
                    //         }
                    //     }, 


                    ]
                })
            }
            return decrypted;
        }
    }

        //console.log('Have session key render Mesaages');
        //console.log('Have session key render Mesaages = ' + sessionStorage.getItem(his_uid + 'encryptkey'));
        //console.log('Have session key render Mesaages');


    if (sessionStorage.getItem(his_uid + 'encryptkey'))

    {


        app.selectAllRecords(render);

    } 

    else // ask key

    {


        //console.log('NO KEY SET KEY A!');

        document.activeElement.blur();
        localStorage.setItem('showalert', 0);

        $$.getJSON("i18n/" + localStorage.getItem('cLANGUAGE') +
            "/strings.json",
            function(languageSpecificObject) {


var inputKeyValue = myApp.modal({
            title:  languageSpecificObject.languageSpecifications[0]['decryptmessage'],
            text: languageSpecificObject.languageSpecifications[0]['yourkeyfor'] + '<BR>' + his_uid + ' (' + his_nick + ')',
        afterText: '<input type="text" class="modal-text-input">',
        buttons: [
            {
                text: localStorage.getItem('CANCEL')
            },
            {
                text: localStorage.getItem('OKE'),
                close: false
            }
        ],
        onClick: function (modal, index) {
            if (index === 0 ) {

                var value = $(modal).find('.modal-text-input').val();

                //console.log('inputvalue 0:',value);

            }


            if (index === 1 ) {

                var value = $(modal).find('.modal-text-input').val();

                //console.log('inputvalue 1:',value);

                if(value.length < 4) {

                    //console.log('inputvalue EMPTY:',value);

                    window.plugins.toast.show('please enter at least 4 characters', 'short', 'center');

                    return false;
                    
                }
                else
                {
                    myApp.closeModal();

                        var newkey = value;
                        var setkey = newkey.toLowerCase();
                        var setkey = calcMD5(setkey);

                        sessionStorage.setItem(his_uid + 'encryptkey', setkey);

                        //console.log('SET SESSION = ' + his_uid + 'encryptkey = ' + setkey);


                        //console.log('render Mesaages');

                        messagesview.router.refreshPage({
                            url: 'frames/messages/Smessages-send.html',
                            reload: true
                        });


                        myMessagesList.update();

                        //console.log('render Mesaages loaded');

                }

            }

        }
});





                // myApp.prompt(languageSpecificObject.languageSpecifications[0]['yourkeyfor'] + '<BR>' + his_uid + ' (' + his_nick + ')',
                //     languageSpecificObject.languageSpecifications[0]['decryptmessage'],
                //     function(value) {



                //         var newkey = value;
                //         var setkey = newkey.toLowerCase();
                //         var setkey = calcMD5(setkey);

                //         sessionStorage.setItem(his_uid + 'encryptkey', setkey);

                //         //console.log('SET SESSION = ' + his_uid + 'encryptkey = ' + setkey);


                //         //console.log('render Mesaages');

                //         messagesview.router.refreshPage({
                //             url: 'frames/messages/Smessages-send.html',
                //             reload: true
                //         });


                //         myMessagesList.update();

                //         //console.log('render Mesaages loaded');

                //     }); // end prompt



            });
    } // end else
//console.log('INIT MESSAGES-SEND END');

}); // end page.name



////////////////////////////////////////////////////////////////////////////////////////

function makeVcard() {


//console.log('+++ Fn makeVcard :',localStorage.getItem('UID'));

var uid = localStorage.getItem('UID');

    app.selectAllRecords = function(fn) {
            app.db.transaction(function(tx) {
                tx.executeSql(selectUIDLinks, [uid], fn, onError);
            });
        }

    var render = function(tx, rs) {

                    var uid = localStorage.getItem('UID');

                    if (rs.rows.length) {

                      //console.log(rs);

                        //console.log('RECORD EXIST makeVcard');

                    var items = new Array(); 

                        for (var i = 0; i < rs.rows.length; i++) {
                       
                            var contactItem = rs.rows.item(i);
// //console.log('------------------------------------------');
//                             console.log(contactItem);
// //console.log('------------------------------------------');
                            if (contactItem.autocrypt === 1) {
                                contactItem.autocrypt  = "active";



                                // var tempkey =str.toLowerCase();
                                // var tempkey =calcMD5(tempkey);
                                
localStorage.setItem(contactItem.his_uid +'encryptkey',contactItem.autocryptkey);

//console.log(contactItem.his_uid + '!!!!!!!! encryptkey SET');



                            }                         
                            else 
                            {
                                contactItem.autocrypt = "";

localStorage.removeItem(contactItem.his_uid +'encryptkey');
//console.log(contactItem.his_uid + '!!!!!!!!!! encryptkey REMOVED');

                            } 

                            if (contactItem.nuonline === '1') {

                            } 
                            else 
                            {
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
                                (+dateArray[3]), (+dateArray[4]), 
                                (+dateArray[5]), (+dateArray[6]));

                            //////console.log('mdatum2 = ' +mdatum2);
// MONTH                            
                            var monthNames = ["Jan", "Feb", "Mar", "Apr",
                                "May", "Jun", "Jul", "Aug", "Sep",
                                "Oct", "Nov", "Dec"
                            ];

                            contactItem.lastseen = mdatum2.getDate() + '-' + monthNames[mdatum2.getMonth()] + ' ' 
                                                    + (mdatum2.getHours() < 10 ? '0' : '') + mdatum2.getHours() + ':' 
                                                    + (mdatum2.getMinutes() < 10 ? '0' : '') + mdatum2.getMinutes();
                                                    
                            contactItem.lastseentxt = localStorage.getItem('lastseentxt');

                            items.push(contactItem);

                        } // end for

          // //console.log('items : b contacts ');
          // console.log(items);

  //            localStorage.myVcard = JSON.stringify(items);




var myVcard = Template7.templates.myVcardTemplate(items);


$$('.vcardList').html(myVcard);

// $$('.closeButton').html('<p><a href="#" onclick="cancelThisVcard(this)" >CANCEL</a></p>');


// //console.log('test DONE = ',myVcard);



             // //console.log('+++ loadContent contacts.js');
          } // end   if (rs.rows.length


               

    } // end render

app.selectAllRecords(render);

}


