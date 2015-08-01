

    

$$('.close-popup').on('click', function() {
    $('.statusbar-overlay').removeClass('bgblack');
    console.log('Startscreenprotect close-popup Started');
    Startscreenprotect();
    checkContactsOnline();
    
    if (localStorage.getItem('timertemp') === '-1') {
        window.location.reload();
    }
});

$$('.vpnstatus').html(localStorage.getItem('vpnstatus'));

if (!localStorage.getItem('logofftimer')) {
    localStorage.setItem('logofftimer', 3);
}

// sslnote.onPageInit('settings-theme', function() {
//     $('form#form-theme li').on('click', function() {
//         setTimeout(function() {
//             changeDesign('theme');
//         }, 10);
//     });
// });

// sslnote.onPageInit('settings-tint', function() {
//     $('form#form-tint li').on('click', function() {
//         setTimeout(function() {
//             changeDesign('tint');
//         }, 10);
//     });
// });

$$('.popup-update-detail').on('open', function() {
    $.getJSON('update.json', function(data) {
        $('span#content').html(data.en.updates[0].content +
            '<br><br>' + data.en.updates[0].instructions);
    });
});