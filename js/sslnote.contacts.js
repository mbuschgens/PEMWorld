
myApp.onPageInit('contacts', function() {
    //console.log('!!! page.name contacts');    

    myApp.showToolbar('.tabbar');

    localStorage.setItem('showalert', 1);

    myApp.showTab('#contactsview');

   clearTimeout(loop);


    var ptrContent = $$('.pull-to-refresh-content.contacts-page-list');

    ptrContent.on('refresh', function(e) {

        setTimeout(function() {
            // importNewUIDLinks();
            // JsonMessagesToSend();

            makeNewContactList();

            // setTimeout(function(){   
            // contactsview.router.refreshPage();
            // },1000);

            myApp.pullToRefreshDone();
        }, 2000);
    }); //myApp.pullToRefreshTrigger(ptrContent);

    myApp.hideIndicator();


      myContactList = myApp.virtualList('.contacts-list.list-block.virtual-list', {
          items: JSON.parse(localStorage.myContactList),
          template: '<li class="swipeout">' +
          
                    '<a href="frames/messages/Smessages-send-new.html?his_uid={{his_uid}}&his_nick={{his_nick}}&his_server={{his_server}}&mid={{mid}}&totalmessages={{totalmessages}}" data-animate-pages="false" class="swipeout-content item-link item-content">'+
                                     

                    '<div id="floatStatus" class="floatStatusContacts">'+

                    '<div id="{{his_uid}}online" class="DIV{{his_uid}}online {{nuonline}} status">'+

                    // '  <div class="bg-3 topspacercontact"></div>'+
                    // '  <div class="bg-3"><i id="autocrypt{{his_uid}}" class="icons_secretkey {{autocrypt}}"></i></div>'+
                   
                    '<div ><i id="autocrypt{{his_uid}}" class="icons_secretkey {{autocrypt}}"></i></div>'+

                    // '<div ><i class="icons_new_message read"></i></div>'+

                    '</div>'+  

                    '</div>'+


                    '<div class="item-inner">'+
                    '<div class="item-title-row">'+
                    '<div class="item-title">{{his_nick}} {{notconfirm}} </div> '+
                    '<div class="item-after"></div>'+
                    '</div>'+
                    '<div class="item-subtitle {{his_uid}}active_last"> {{lastseentxt}} : {{lastseen}} </div> '+
                    '</div>'+
                    '</a>'+

                    '<div class="swipeout-actions-left contactlist">'+    
                    '<a href="#" class="bg-gray">UID: {{his_uid}}</a>'+
                    '</div>'+

                    '<div class="swipeout-actions-right">'+

                    '<a href="frames/settings/mysettings/SmyContactEdit.html?his_uid={{his_uid}}&his_nick={{his_nick}}"  class="bg-yellow"> <table style="width:100%" class=""><tr><td><center><i class="icons_edit"></i></center></td></tr><tr><td><center>EDIT NICKNAME</center></td></tr></table></a>'+

                    '<a href="#" class="keysettings bg-orange" id="{{his_uid}}" data-id="{{his_uid}}" his_nick="{{his_nick}}" onclick="KeySettings(this)"><table style="width:100%"><tr><td><center><i class="icons_setkey"></i></center></td></tr><tr><td><center>SET SECRETKEY</center></td></tr></table></a>'+       

                    '<a href="#" class="bg-red" id="{{his_uid}}" data-id="{{his_uid}}" his_nick="{{his_nick}}" onclick="DeleteUidLink(this)"><table style="width:100%"><tr><td><center><i class="icons_delete"></i></center></td></tr><tr><td><center>DELETE CONTACT</center></td></tr></table></a>'+     

                    // '<a href="#" class="swipeout-delete DeleteUidLink bg-red" id="{{his_uid}}" data-id="{{his_uid}}" his_nick="{{his_nick}}" onclick="DeleteUidLink(this)"><table style="width:100%"><tr><td><center><i class="icons_delete"></i></center></td></tr><tr><td><center>DELETE</center></td></tr></table></a>'+     


                    '</div>'+
                    '</li>'
      });  


// //console.log('myContactList = ');
// console.log(myContactList);


    var mySearchbar = myApp.searchbar('.searchbar', {
        searchList: '.list-block-search',
        searchIn: '.item-title'
    });






iAmOnlineLoop();

});



////////////////////////////////////////////////////////////////////////////////////////

function makeNewContactList() {


//console.log('+++ Fn makeNewContactList :',localStorage.getItem('UID'));

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

                        //console.log('RECORD EXIST makeNewContactList');

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

              localStorage.myContactList = JSON.stringify(items);

             // //console.log('+++ loadContent contacts.js');
          } // end   if (rs.rows.length


          else

          {
            //console.log('Fn importNewUIDLinks')

            importNewUIDLinks();


          }
                

    } // end render

app.selectAllRecords(render);

}

