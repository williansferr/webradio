$(function(){
	Audio.init();
	// document.getElementById("id-play").click();
});

var intval;
var autoplay;
var Audio = {
	init:function(){
		this.info.init();
		this.player();
		this.scrollbar();
		$('.play-pause').click();
	},
	formatTime:function(secs){
		var hr,min,sec;
		hr  = Math.floor(secs / 3600);
		min = Math.floor((secs - (hr * 3600))/60);
		sec = Math.floor(secs - (hr * 3600) - (min * 60));

		min = min>9?min:'0'+min;
		sec = sec>9?sec:'0'+sec;
		return min+':'+sec;
	},
	info:{
		init:function(){
			$('.play-list .play').each(function(){
				var album,albumart,artist,title;
				
				album = $(this).data('album');
				if (album == null || album == ''){
					
				}

				albumart = $(this).data('albumart');
				artist = $(this).data('artist');
				title = $(this).data('title');


				album=album?'<span class="album">'+album+'</span>':'';
				albumart=albumart?'<img src="'+albumart+'">':'';
				artist=artist?'<span class="song-artist">'+artist+'</span>':'';
				title=title?'<div class="song-title">'+title+'</div>':'';
 
				$(this).html('<div class="album-thumb pull-left">'+albumart+'</div><div class="songs-info pull-left">'+title+'<div class="songs-detail">'+artist+' - '+album+'</div></div></div>');
			});
		},
		load: function(id,album,artist,title,albumart,mp3) {
			this.load.id = id
			this.load.mp3 = mp3
			var currentTrack, totalTrack;
			totalTrack = $('.play-list>a').length;
			currentTrack = $('.play-list a').index($('.play-list .active'))+1;
			$('.play-position').text(currentTrack+' / '+totalTrack);
			albumart=albumart?'<img src="'+albumart+'">':''; 
			album=album?album:'Unknown Album';
			title=title?title:'Unknown Title';
			artist=artist?artist:'Unknown Artist';
			$('.album-art').html(albumart);
			$('.current-info .song-album').html('<i class="fas fa-music"></i> '+album);
			$('.current-info .song-title').html('<i class="fas fa-headphones"></i> '+title);
			$('.current-info .song-artist').html('<i class="fas fa-user"></i> '+artist);
			if(mp3)
			$('.audio').html('<audio class="music" data-id="'+id+'" src="'+mp3+'"></audio>');

		}
	},
	requestImg:function(artista, musica){
		console.log('aritsta', artista);
		const request = $.ajax({
			// http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=YOUR_API_KEY&artist=cher&track=believe&format=json
			// 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artista + '&api_key=0fcb8c128735315528c258fc93d04add&format=json'
            url: 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=0fcb8c128735315528c258fc93d04add&artist=Zeca%20Pagodinho&track=Verdade&format=json',
            type: 'GET'
        });
        
        request.done(function (msg) {
            
            console.log('requestImg', msg);
            var json = JSON.parse(msg);

            console.log('img', msg.track.album.image[2]);
            console.log('url', msg.track.album.image[2].#text);
            console.log('teste-id', $('#teste-id').data('albumart'));
            
            $('#teste-id').data('albumart', msg.track.album.image[2]);
            
        });

        request.fail(function (jqXHR, textStatus) {
            console.log('erro');
            console.log(jqXHR);
            console.log(textStatus);
        });
	},
	updateCurtir:function(id, audio){
		
		var audio_aux = audio.substring(audio.lastIndexOf('/') + 1, audio.length);

		// console.log('request audio:', audio_aux);

        const request = $.ajax({
            url: '/curtidas/' + audio_aux,
            type: 'GET'
        });
        
        request.done(function (msg) {
            // console.log('updateCurtir() done');
            // console.log('updateCurtir', msg);
            var json = JSON.parse(msg);
            // console.log(json.thisuser);

            // console.log('????',Object.keys(json.curtidas).length);
            // console.log('????2',json.curtidas[0]);
            

            var qt_like = 0, qt_deslike = 0;
            $.each(json.curtidas, function(index, value) {
			    if(value.curtiu){
			    	qt_like += 1;
			    } else {
			    	qt_deslike += 1;
			    }
			});

            if(json.thisuser){
            	// console.log('este usuário curtiu a musica ', json.curtidas[0].audio);
            	$('#like-cnt').click();
            	// $('#like-cnt').remove('#qt-like-curtidas');
            	$('span[id^="qt-like-curtidas"]').remove();
            	$('#like-cnt').append('<span id="qt-like-curtidas">' + qt_like + '</span>');
            	$('#ico-deslike-audio').removeAttr("style");
            } else {
            	// console.log('este usuário não curtiu a musica ', json.curtidas[0].audio);
            	$('#deslike-cnt').click();
            	// $('#deslike-cnt').remove('#qt-deslike-curtidas');
            	$('span[id^="qt-deslike-curtidas"]').remove();
            	$('#deslike-cnt').append('<span id="qt-deslike-curtidas">' + qt_deslike + '</span>');
            	$('#ico-like-audio').removeAttr("style");
            }
        });

        request.fail(function (jqXHR, textStatus) {
            console.log('erro');
            // console.log(jqXHR);
            // console.log(textStatus);
        });

	},
	insertOuvinte:function(){
		Curtida.getIPs(function(ip){
			const request = $.ajax({
	            url: '/ouvinte',
	            type: 'POST',
	            data: {ip: ip}
	        });
	        
	        request.done(function (msg) {
	            var json = JSON.parse(msg);
	            // console.log(json);
	        });

	        request.fail(function (jqXHR, textStatus) {
	            console.error('erro');
	        });
    	});
	},
	player:function(){
		var id, album, artist, albumart, title, mp3;
		$('.play-list .play').each(function(){
			$(this).on('click',function(e){
				e.preventDefault();
				$(this).siblings().removeClass('active');
				$('.play-list a.active').removeClass('active');
				$(this).addClass('active');
				clearInterval(intval);
				id = $(this).data('id');
				album = $(this).data('album');
				artist = $(this).data('artist');
				albumart = $(this).data('albumart');
				title = $(this).data('title');
				mp3 = $(this).data('url');
				Audio.info.load(id,album,artist,title,albumart,mp3);
				Audio.play($('.music'));
				$('.music').prop('volume',$('.volume').val());
				if(id != 1){
					$('.action-button').css('display', '');
				}
				// Audio.playlist.hide();
				// Audio.updateCurtir(id, mp3);
			});
		});
		$('.play-pause').on('click',function(e){

			e.preventDefault();
			if($('.audio').is(':empty')){
				$('.play-list a:first-child')[0].click();

			}else{
				var music = $('.music')[0];
				if(music.paused){
					setInterval(intval);
					Audio.play($('.music'));
					$(this).addClass('active');
					Audio.insertOuvinte();
				}else{
					clearInterval(intval);
					Audio.pause($('.music'));
					$(this).removeClass('active');
				}
			}
		});
		$('.stop').on('click',function(e){
			e.preventDefault();
			clearInterval(intval);
			Audio.stop($('.music'));
			$('.music')[0].currentTime=0;
			$('.progress .bar').css('width',0);
		});
		$('.volume').on('change',function(){
			var vol, css;
			vol = $(this).val();
			$(this).attr('data-css',vol);
			$('.music').prop('volume',vol);
		});
		$('.fa-volume-down').on('click',function(){
			// console.log($(this));
			$('.volume').val(0);
			$('.volume').attr('data-css',0);
			$('.music').prop('volume',0);
		});

		$('.fa-volume-up').on('click',function(){
			$('.volume').val(1);
			$('.volume').attr('data-css',1);
			$('.music').prop('volume',1);
		});
		$('.prev').on('click',function(e){
			var index, firstIndex;
			e.preventDefault();
			index = $('.play-list a').length - $('.play-list a').index();
			firstIndex = $('.play-list a').length - $('.play-list a').index($('.play-list a.active'));
			if(index==firstIndex){
				$('.play-list a:last-child').click();
			}else{
				Audio.prev();
			}
		});
		$('.next').on('click',function(e){
			var index, lastIndex;
			e.preventDefault();
			index = $('.play-list a').length;
			lastIndex = $('.play-list a').index($('.play-list a.active'))+1;
			if(index==lastIndex){
				$('.play-list a:first-child').click();
			}else{
				Audio.next();
			}
		});
		$('.toggle-play-list').on('click',function(e){
			e.preventDefault();
			var toggle = $(this);
			if(toggle.hasClass('active')){
				Audio.playlist.hide();
			}else{
				Audio.playlist.show();
			}
		});
		$('.radio-on').on('click',function(e){
			$('.play-list a:first-child')[0].click();
			Audio.requestImg();
			socket.emit('airtime-info', 'reset');
		});
	},
	playlist:{
		show:function(){
			$('.play-list').fadeIn(500);
			$('.toggle-play-list').addClass('active');
			$('.album-art').addClass('blur');
		},
		hide:function(){
			// $('.play-list').fadeOut(500);
			// $('.toggle-play-list').removeClass('active');
			// $('.album-art').removeClass('blur');
		}
	},
	play:function(e){
		var musica = $('.music');
		$('.download-audio').attr('href', musica[0].src);

		var bar, current, total;
		e.trigger('play').bind('ended',function(){
			$('.next').click();
		});
		intval = setInterval(function(){
			current = e[0].currentTime;
			
			if (isNaN(current)) {
				$('.play-current-time').text(Audio.formatTime(0));
			} else {
				$('.play-current-time').text(Audio.formatTime(current));
			}
			

			bar = (current/e[0].duration)*100;
			$('.progress .bar').css('width',bar+'%');
			
		},1000);

		var totalDur = setInterval(function(t){
			if($('.audio .music')[0].readyState>0){
				total = e[0].duration;
				if (total == Infinity || isNaN(total)) {
					$('.play-total-time').text(Audio.formatTime('0'));
				}else {
					$('.play-total-time').text(Audio.formatTime(total));
				}	

				clearInterval(totalDur);
			}
		}, 1000);
		$('.play-pause').addClass('active');
	},
	pause:function(e){
		e.trigger('pause');
		$('.play-pause').removeClass('active');
	},
	stop:function(e){
		e.trigger('pause').prop('currentTime',0);
		// var musica = $('.music');
		// console.log(musica[0].src);
		// $('.download-audio').attr('href', musica[0].src);
		// download( musica[0].src, "tste.mp3", "audio/mpeg" );
		$('.play-pause').removeClass('active');
	},
	mute:function(e){
		prop('muted',!e.prop('muted'));
	},
	volumeUp:function(e){
		var volume = e.prop('volume')+0.2;
		if(volume >1){
			volume = 1;
		}
		e.prop('volume',volume);
	},
	volumeDown:function(e){
		var volume = e.prop('volume')-0.2;
		if(volume <0){
			volume = 0;
		}
		e.prop('volume',volume);
	},
	prev:function(){
		var curr = $('.music').data('id');
		var prev = $('a[data-id="'+curr+'"]').prev();
		if(curr && prev && prev.data().id != 1){
			prev.click();
		}
		var musica = $('.music');
		$('.download-audio').attr('href', musica[0].src);
	},
	next:function(){
		var curr = $('.music').data('id');
		var next = $('a[data-id="'+curr+'"]').next();
		if(curr && next){
			next.click();
		}
		var musica = $('.music');
		$('.download-audio').attr('href', musica[0].src);
	},
	scrollbar:function(){
		if(typeof $.fn.enscroll !== 'undefined'){
			// $('.play-list').enscroll({
			// 	showOnHover:true,
			// 	verticalTrackClass:'track',
			// 	verticalHandleClass:'handle'
			// });
		}
	}
}