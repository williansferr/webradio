// const curtidas = {};
    // var ipAddress = {};
    // function getIpAddress(){
        

    //     const request = $.ajax({
    //         url: 'https://api.ipify.org?format=json',
    //         type: 'GET'
    //     });

    //     request.done(function (msg) {
    //         console.log('getIpAddress() done');
    //         console.log(msg);
    //         ipAddress = msg;
    //     });

    //     request.fail(function (jqXHR, textStatus) {
    //         console.log('erro');
    //         console.log(jqXHR);
    //         console.log(textStatus);
    //         //swal("Erro!", textoErro1.textStatus, "error");
    //     });

    //     return ipAddress;
    // }

    // function getCurtidas(audio){
    //     console.log('request audio:', audio);

    //     const request = $.ajax({
    //         url: '/curtidas/' + audio,
    //         type: 'GET'
    //     });
        

    //     request.done(function (msg) {
    //         console.log('getCuritdas() done');
    //         console.log(msg);
    //     });

    //     request.fail(function (jqXHR, textStatus) {
    //         console.log('erro');
    //         console.log(jqXHR);
    //         console.log(textStatus);
    //         //swal("Erro!", textoErro1.textStatus, "error");
    //     });
    // }
$(function(){
    Curtida.init();
});

var Curtida = {
    init:function(){
        this.info.init();
        this.load();
    },
    load:function(){
        $('#like-audio').on('click', function() {
            if($('#like-audio')[0].innerHTML.indexOf("rgb(1, 66, 106)") >= 0){
                // console.log('ja deu like');
            } else {
                Curtida.sendLike(true);    
            }
            
        });

        $('#deslike-audio').on('click', function() {
            if($('#like-audio')[0].innerHTML.indexOf("rgb(1, 66, 106)") >= 0){
                // console.log('ja deu deslike');
            } else {
                Curtida.sendLike(false);    
            }
            
        });
    },
    info: {
        init:function(){
            this.likes = parseInt($('#qt-like-curtidas').text());
            this.deslikes = parseInt($('#qt-deslike-curtidas').text());
        },
    },
    plusLike:function(){
        // var qt_like = parseInt($('#qt-like-curtidas').text());
        let qt_like = Curtida.info.likes;
        qt_like += 1;

        $('span[id^="qt-like-curtidas"]').remove();
        $('#like-cnt').append('<span id="qt-like-curtidas">' + qt_like + '</span>');
    },
    minusLike:function (){
        // var qt_like = parseInt($('#qt-like-curtidas').text());
        let qt_like = Curtida.info.likes;
        qt_like -= 1;
        $('span[id^="qt-like-curtidas"]').remove();
        $('#like-cnt').append('<span id="qt-like-curtidas">' + qt_like + '</span>'); 
    },
    plusDeslike:function (){
        // var qt_deslike = parseInt($('#qt-deslike-curtidas').text());
        let qt_deslike = Curtida.info.deslikes;
        qt_deslike += 1;
        $('span[id^="qt-deslike-curtidas"]').remove();
        $('#deslike-cnt').append('<span id="qt-deslike-curtidas">' + qt_deslike + '</span>');    
    },
    minusDeslike:function (){
        // var qt_deslike = parseInt($('#qt-deslike-curtidas').text());
        let qt_deslike = Curtida.info.deslikes;
        qt_deslike -= 1;
        $('span[id^="qt-deslike-curtidas"]').remove();
        $('#deslike-cnt').append('<span id="qt-deslike-curtidas">' + qt_deslike + '</span>');   
    },
    sendLike:function(isLike){

        let idAudio = Audio.info.load.id;
        let audio = '';

        if (idAudio != 1) {
            audio = Audio.info.load.mp3;
            audio = audio.substring(audio.lastIndexOf('/') + 1, audio.length);
        } else {
            if($('#txt-album').text() != ''){
                audio = $('#txt-artist').text().trim() + ' - ' + $('#txt-album').text().trim() + ' - ' + $('#txt-title').text().trim();
            } else {
                audio = $('#txt-artist').text().trim() + ' - ' + $('#txt-title').text().trim();
            }

        }

        Curtida.getIPs(function(ip){

            const data = {
                audio: audio,
                id_podcast: idAudio,
                curtiu: isLike,
                ip: ip
            }

            const request = $.ajax({
                url: '/curtidas',
                type: 'POST',
                data: JSON.stringify(data),
                contentType: "application/json"
            });
            

            request.done(function (msg) {
                // console.log('sendLike() done');
                // console.log(msg);
                var json = JSON.parse(msg);

                // console.log('json.message:', json.message);
                // console.log('indexof.inserido:', json.message.indexOf('inserido'));
                // console.log('indexof.atualizado:', json.message.indexOf('atualizado'));

                if(json.message.indexOf('inserido') >= 0 ){

                    if (isLike){
                        Curtida.plusLike();
                        $('#ico-deslike-audio').removeAttr("style");
                    } else {
                        Curtida.plusDeslike();
                        $('#ico-like-audio').removeAttr("style");
                    }


                } else if(json.message.indexOf('atualizado') >= 0){
                    if (isLike){
                        Curtida.plusLike();
                        Curtida.minusDeslike();
                        $('#ico-deslike-audio').removeAttr("style");
                    } else {
                        Curtida.plusDeslike();
                        Curtida.minusLike();
                        $('#ico-like-audio').removeAttr("style");
                    }
                }
            });

            request.fail(function (jqXHR, textStatus) {
                console.log('erro');
                console.log(jqXHR);
                console.log(textStatus);
                //swal("Erro!", textoErro1.textStatus, "error");
            });
        });
    },
    sendComentario:function(){

        let email = $('#txtEmail').val();
        let nome = $('#txtNome').val();
        let comentario = $('#txtComentario').val();

        const data = {
            email: email,
            nome: nome,
            comentario: comentario
        }

        if (email === ""){
            swal('Informe seu E-mail');
            return;
        }

        if (nome === ""){
            swal('Informe seu nome');
            return;
        }

        if (comentario === ""){
            swal('Informe o comentario');
            return;
        }

        const request = $.ajax({
            url: '/comentario',
            type: 'POST',
            // method: 'POST',
            data: JSON.stringify(data),
            contentType: "application/json"
            // cache: false,
            // // dataType: 'json', // This replaces dataFilter: function() && JSON.parse( data ).
            // processData: false, // Don't process the files
            // contentType: false
        });
        

        request.done(function (msg) {
            console.log('done');
            console.log(msg);
            swal(
                'Comentário enviado!',
                '',
                'success'
            )
            $('#txtEmail').val('');
            $('#txtNome').val('');
            $('#txtComentario').val('');
        });

        request.fail(function (jqXHR, textStatus) {
            swal(
                'Comentário não enviado',
                jqXHR + ' - ' + textStatus,
                'error'
            )
            console.log('erro');
            console.log(jqXHR);
            console.log(textStatus);
            //swal("Erro!", textoErro1.textStatus, "error");
        });
    },
    getIPs:function(callback) {
        var ip_dups = {};

        //compatibility for firefox and chrome
        var RTCPeerConnection = window.RTCPeerConnection
            || window.mozRTCPeerConnection
            || window.webkitRTCPeerConnection;
        var useWebKit = !!window.webkitRTCPeerConnection;

        //bypass naive webrtc blocking using an iframe
        if(!RTCPeerConnection){
            //NOTE: you need to have an iframe in the page right above the script tag
            //
            //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
            //<script>...getIPs called in here...
            //
            var win = iframe.contentWindow;
            RTCPeerConnection = win.RTCPeerConnection
                || win.mozRTCPeerConnection
                || win.webkitRTCPeerConnection;
            useWebKit = !!win.webkitRTCPeerConnection;
        }

        //minimal requirements for data connection
        var mediaConstraints = {
            optional: [{RtpDataChannels: true}]
        };

        var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

        //construct a new RTCPeerConnection
        var pc = new RTCPeerConnection(servers, mediaConstraints);

        function handleCandidate(candidate){
            //match just the IP address
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
            var ip_addr = ip_regex.exec(candidate)[1];

            //remove duplicates
            if(ip_dups[ip_addr] === undefined)
                callback(ip_addr);

            ip_dups[ip_addr] = true;
        }

        //listen for candidate events
        pc.onicecandidate = function(ice){

            //skip non-candidate events
            if(ice.candidate)
                handleCandidate(ice.candidate.candidate);
        };

        //create a bogus data channel
        pc.createDataChannel("");

        //create an offer sdp
        pc.createOffer(function(result){

            //trigger the stun server request
            pc.setLocalDescription(result, function(){}, function(){});

        }, function(){});

        //wait for a while to let everything done
        setTimeout(function(){
            //read candidate info from local description
            var lines = pc.localDescription.sdp.split('\n');

            lines.forEach(function(line){
                if(line.indexOf('a=candidate:') === 0)
                    handleCandidate(line);
            });
        }, 1000);
    },
    curtidas:function(lista){
        var likes = 0, deslikes = 0;
        for (var i = 0; i < lista.length; i++) {
            if(lista[i].curtiu){
                likes++;
            } else {
                deslikes++;
            }
        }

        Curtida.info.likes = likes;
        Curtida.info.deslikes = deslikes;

        $('span[id^="qt-like-curtidas"]').remove();
        $('#like-cnt').append('<span id="qt-like-curtidas">' + likes + '</span>');

        $('span[id^="qt-deslike-curtidas"]').remove();
        $('#deslike-cnt').append('<span id="qt-deslike-curtidas">' + deslikes + '</span>');

    }
}
//-------------------------------------------OLD
    // function setPlusQtLike(){
    //     var qt_like = parseInt($('#qt-like-curtidas').text());
    //     qt_like += 1;
    //     $('span[id^="qt-like-curtidas"]').remove();
    //     $('#like-cnt').append('<span id="qt-like-curtidas">' + qt_like + '</span>');
    // }

    // function setMinusQtLike(){
    //     var qt_like = parseInt($('#qt-like-curtidas').text());
    //     qt_like -= 1;
    //     $('span[id^="qt-like-curtidas"]').remove();
    //     $('#like-cnt').append('<span id="qt-like-curtidas">' + qt_like + '</span>'); 
    // }

    // function setPlusQtDeslike(){
    //     var qt_deslike = parseInt($('#qt-deslike-curtidas').text());
    //     qt_deslike += 1;
    //     $('span[id^="qt-deslike-curtidas"]').remove();
    //     $('#deslike-cnt').append('<span id="qt-deslike-curtidas">' + qt_deslike + '</span>');    
    // }

    // function setMinusQtDeslike(){
    //     var qt_deslike = parseInt($('#qt-deslike-curtidas').text());
    //     qt_deslike -= 1;
    //     $('span[id^="qt-deslike-curtidas"]').remove();
    //     $('#deslike-cnt').append('<span id="qt-deslike-curtidas">' + qt_deslike + '</span>');   
    // }

    

    // function sendLike(isLike){

    //     // console.log(Audio);

    //     let idAudio = Audio.info.load.id;
    //     let audio = '';

    //     if (idAudio != 1) {
    //         audio = Audio.info.load.mp3;
    //         audio = audio.substring(audio.lastIndexOf('/') + 1, audio.length);
    //     } else {
    //         if($('#txt-album').text() != ''){
    //             audio = $('#txt-artist').text().trim() + ' - ' + $('#txt-album').text().trim() + ' - ' + $('#txt-title').text().trim();
    //         } else {
    //             audio = $('#txt-artist').text().trim() + ' - ' + $('#txt-title').text().trim();
    //         }

    //     }

    //     getIPs(function(ip){

    //         const data = {
    //             audio: audio,
    //             id_podcast: idAudio,
    //             curtiu: isLike,
    //             ip: ip
    //         }

    //         const request = $.ajax({
    //             url: '/curtidas',
    //             type: 'POST',
    //             data: JSON.stringify(data),
    //             contentType: "application/json"
    //         });
            

    //         request.done(function (msg) {
    //             console.log('sendLike() done');
    //             console.log(msg);
    //             var json = JSON.parse(msg);

    //             console.log('json.message:', json.message);
    //             console.log('indexof.inserido:', json.message.indexOf('inserido'));
    //             console.log('indexof.atualizado:', json.message.indexOf('atualizado'));

    //             if(json.message.indexOf('inserido') >= 0 ){

    //                 if (isLike){
    //                     setPlusQtLike();
    //                     styleLike = true;
    //                     $('#ico-deslike-audio').removeAttr("style");
    //                 } else {
    //                     setPlusQtDeslike();
    //                     $('#ico-like-audio').removeAttr("style");
    //                     styleLike = false;
    //                 }


    //             } else if(json.message.indexOf('atualizado') >= 0){
    //                 if (isLike){
    //                     setPlusQtLike();
    //                     setMinusQtDeslike();
    //                     $('#ico-deslike-audio').removeAttr("style");
    //                     styleLike = true;
    //                 } else {
    //                     setPlusQtDeslike();
    //                     setMinusQtLike();
    //                     $('#ico-like-audio').removeAttr("style");
    //                     styleLike = false;
    //                 }
    //             }
    //         });

    //         request.fail(function (jqXHR, textStatus) {
    //             console.log('erro');
    //             console.log(jqXHR);
    //             console.log(textStatus);
    //             //swal("Erro!", textoErro1.textStatus, "error");
    //         });
    //     });
    // }

    // $('#like-audio').on('click', function() {
    //     sendLike(true);
    // });

    // $('#deslike-audio').on('click', function() {
    //     sendLike(false);
    // });

    // function sendComentario(){

    //     const email = $('#txtEmail').val();
    //     const nome = $('#txtNome').val();
    //     const comentario = $('#txtComentario').val();

    //     data = {
    //         email: email,
    //         nome: nome,
    //         comentario: comentario
    //     }

    //     if (email === ""){
    //         swal('Informe seu E-mail');
    //         return;
    //     }

    //     if (nome === ""){
    //         swal('Informe seu nome');
    //         return;
    //     }

    //     if (comentario === ""){
    //         console.log("vazio comentario:" + comentario);
    //         swal('Informe o comentario');
    //         return;
    //     }

    //     const request = $.ajax({
    //         url: '/comentario',
    //         type: 'POST',
    //         // method: 'POST',
    //         data: JSON.stringify(data),
    //         contentType: "application/json"
    //         // cache: false,
    //         // // dataType: 'json', // This replaces dataFilter: function() && JSON.parse( data ).
    //         // processData: false, // Don't process the files
    //         // contentType: false
    //     });
        

    //     request.done(function (msg) {
    //         console.log('done');
    //         console.log(msg);
    //         swal(
    //             'Comentário enviado!',
    //             '',
    //             'success'
    //         )
    //         $('#txtEmail').val('');
    //         $('#txtNome').val('');
    //         $('#txtComentario').val('');
    //     });

    //     request.fail(function (jqXHR, textStatus) {
    //         swal(
    //             'Comentário não enviado',
    //             jqXHR + ' - ' + textStatus,
    //             'error'
    //         )
    //         console.log('erro');
    //         console.log(jqXHR);
    //         console.log(textStatus);
    //         //swal("Erro!", textoErro1.textStatus, "error");
    //     });
    // }

    // function getIPs(callback){
    //     var ip_dups = {};

    //     //compatibility for firefox and chrome
    //     var RTCPeerConnection = window.RTCPeerConnection
    //         || window.mozRTCPeerConnection
    //         || window.webkitRTCPeerConnection;
    //     var useWebKit = !!window.webkitRTCPeerConnection;

    //     //bypass naive webrtc blocking using an iframe
    //     if(!RTCPeerConnection){
    //         //NOTE: you need to have an iframe in the page right above the script tag
    //         //
    //         //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
    //         //<script>...getIPs called in here...
    //         //
    //         var win = iframe.contentWindow;
    //         RTCPeerConnection = win.RTCPeerConnection
    //             || win.mozRTCPeerConnection
    //             || win.webkitRTCPeerConnection;
    //         useWebKit = !!win.webkitRTCPeerConnection;
    //     }

    //     //minimal requirements for data connection
    //     var mediaConstraints = {
    //         optional: [{RtpDataChannels: true}]
    //     };

    //     var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

    //     //construct a new RTCPeerConnection
    //     var pc = new RTCPeerConnection(servers, mediaConstraints);

    //     function handleCandidate(candidate){
    //         //match just the IP address
    //         var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
    //         var ip_addr = ip_regex.exec(candidate)[1];

    //         //remove duplicates
    //         if(ip_dups[ip_addr] === undefined)
    //             callback(ip_addr);

    //         ip_dups[ip_addr] = true;
    //     }

    //     //listen for candidate events
    //     pc.onicecandidate = function(ice){

    //         //skip non-candidate events
    //         if(ice.candidate)
    //             handleCandidate(ice.candidate.candidate);
    //     };

    //     //create a bogus data channel
    //     pc.createDataChannel("");

    //     //create an offer sdp
    //     pc.createOffer(function(result){

    //         //trigger the stun server request
    //         pc.setLocalDescription(result, function(){}, function(){});

    //     }, function(){});

    //     //wait for a while to let everything done
    //     setTimeout(function(){
    //         //read candidate info from local description
    //         var lines = pc.localDescription.sdp.split('\n');

    //         lines.forEach(function(line){
    //             if(line.indexOf('a=candidate:') === 0)
    //                 handleCandidate(line);
    //         });
    //     }, 1000);
    // }

    // var styleLike = false;

    // function setCurtidas(lista){
    //     var likes = 0, deslikes = 0;
    //     for (var i = 0; i < lista.length; i++) {
    //         if(lista[i].curtiu){
    //             likes++;
    //         } else {
    //             deslikes++;
    //         }
    //     }

    //     $('span[id^="qt-like-curtidas"]').remove();
    //     $('#like-cnt').append('<span id="qt-like-curtidas">' + likes + '</span>');

    //     $('span[id^="qt-deslike-curtidas"]').remove();
    //     $('#deslike-cnt').append('<span id="qt-deslike-curtidas">' + deslikes + '</span>');   

    //         // if(styleLike){
    //         //     $('#ico-deslike-audio').removeAttr("style");
    //         // }
    //     // $('#ico-deslike-audio').removeAttr("style");
    //     // $('#ico-like-audio').removeAttr("style");

    // }
//-------------------------------------------