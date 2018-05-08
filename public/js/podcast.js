var Podcast = {
		save:function(){
			var data = this.validate(undefined);

			if(data === undefined){
				return false;
			} else {
				if (this.sendAudio()){
					if(this.sendCapa()){
						this.sendPodcast();
					}
				}
			}
		},
		sendAudio:function(){
			try {
				// // Get form
		  //       var form = $('#form-podcast')[0];
		  //       console.log(form);
				// // Create an FormData object 
		  //       var data = new FormData(form);
				// console.log(data);
				
				// const files = $('input[type="file"]');
				const files = $('#podcast-audio')[0].files;
				// console.log(files);
				const formData = new FormData();

				// var data = new FormData();
				// jQuery.each(jQuery('#file')[0].files, function(i, file) {
				//     formData.append('file-'+i, file);
				// });

				jQuery.each( files/*files[0].files*/, function( index, value ) {
	            	var name = 'file_' + index;
	            	// console.log(value);
	            	formData.append( name, value );
	        	});

	        	var done = false;

				const request = $.ajax({
	                url: '/dashboard/podcast/upload-audio',
	                type: 'POST',
	                method: 'POST',
	                data: formData,
	                cache: false,
	                async: false,
	                // dataType: 'json', // This replaces dataFilter: function() && JSON.parse( data ).
		            processData: false, // Don't process the files
		            contentType: false
	            });
	            
	            request.done(function (msg) {
	            	console.log('ajax sendAudio done');
	            	done = true;
	            });

	            request.fail(function (jqXHR, textStatus) {
	            	console.log('ajax sendAudio fail');
	            	console.log(jqXHR);
            		console.log(textStatus);
	            });

	            return done;
	        } catch(err) {
	        	console.log(err);
	        }
            // return true;
		},
		sendCapa:function(){
			const files = $('#podcast-capa')[0].files;
			const formData = new FormData();

			// var data = new FormData();
			// jQuery.each(jQuery('#file')[0].files, function(i, file) {
			//     formData.append('file-'+i, file);
			// });

			jQuery.each( files, function( index, value ) {
            	var name = 'file_' + index;
            	formData.append( name, value );
        	});

			var done = false;
			const request = $.ajax({
                url: '/dashboard/podcast/upload-capa',
                type: 'POST',
                method: 'POST',
                data: formData,
                async: false,
                cache: false,
                // dataType: 'json', // This replaces dataFilter: function() && JSON.parse( data ).
	            processData: false, // Don't process the files
	            contentType: false
            });
            
            request.done(function (msg) {
            	console.log('ajax sendCapa done');
            	done = true;
            	// return this.sendPodcast();
            });

            request.fail(function (jqXHR, textStatus) {
            	console.log('ajax sendCapa fail');
            	console.log(jqXHR);
            	console.log(textStatus);
                //swal("Erro!", textoErro1.textStatus, "error");
            });
            return done;
		},
		cleanInput:function(){
			$('#input-autor').val('');
			$('#input-titulo').val('');
			$('#input-subtitulo').val('');
			$('#input-descricao').val('');
			$('#podcast-audio').val('');
			$('#podcast-capa').val('');
		},
		validate:function(podcast){
			const autor     = $('#input-autor').val();
			const titulo    = $('#input-titulo').val();
			const subtitulo = $('#input-subtitulo').val();
			const descricao = $('#input-descricao').val();
			const audio     = $('#podcast-audio').val();
			const capa      = $('#podcast-capa').val();
			
			if (audio === "") {
				data = {
					autor: autor,
					titulo: titulo,
					subtitulo: subtitulo,
					descricao: descricao,
					audio: podcast.audio.replace('/podcasts/audio/', ''),
					capa: capa.replace('C:\\', '').replace('fakepath\\', '')
				}
				if(capa === ""){
					data.capa = podcast.capa.replace('/podcasts/capa/', '')
				}
			} else if(capa === ""){
				data = {
					autor: autor,
					titulo: titulo,
					subtitulo: subtitulo,
					descricao: descricao,
					audio: audio.replace('C:\\', '').replace('fakepath\\', ''),
					capa: podcast.capa.replace('/podcasts/capa/', '')
				}
			} else {
				data = {
					autor: autor,
					titulo: titulo,
					subtitulo: subtitulo,
					descricao: descricao,
					audio: audio.replace('C:\\', '').replace('fakepath\\', ''),
					capa: capa.replace('C:\\', '').replace('fakepath\\', '')
				}
			}

			console.log('data', data);

			if (data.autor === ""){
	            swal('Informe o autor');
	            return undefined;
	        }
			if (data.titulo === ""){
	            swal('Informe o título');
	            return undefined;
	        }
	        if (data.subtitulo === ""){
	            swal('Informe o subtítulo');
	            return undefined;
	        }
	        if (data.descricao === ""){
	            swal('Informe o descrição');
	            return undefined;
	        }
	        if (data.audio === ""){
	            swal('Informe o audio');
	            return undefined;
	        }
	        if (data.capa === ""){
	            swal('Informe a capa');
	            return undefined;
	        }

	        return data;
		},
		sendPodcast:function(){
	        var data = this.validate(undefined);
	        if (data != undefined){
				const request = $.ajax({
	                url: '/dashboard/podcast',
	                type: 'POST',
	                data: JSON.stringify(data),
	            	contentType: "application/json"
	            });

				// console.log(data);

	            request.done(function (msg) {
	            	console.log('sendPodcast done');
	            	Podcast.cleanInput();
	            	swal(
		                'Cadastrado com sucesso!',
		                '',
		                'success'
		            );
		            location.reload();
	            });

	            request.fail(function (jqXHR, textStatus) {
	            	console.log('ajax fail2');
	            	console.log(jqXHR);
	            	console.log(textStatus);
	            	swal(
		                'Erro ao cadastrar!',
		                jqXHR + ' - ' + textStatus,
		                'error'
		            )
	            });
            }
		},
		callEdit:function(id, titulo){
			var table = $('#datatables').DataTable();

			swal({ 	title: 'Editar podcast?'
	                ,text: 'Deseja editar este podcast? (' + id + ' - ' + titulo + ')'
	                ,type: 'info'
	                ,showCancelButton: true
	                ,confirmButtonText: 'Sim'
	                ,cancelButtonColor: '#DD6B55'
	                ,cancelButtonText: 'Não'
	                ,showConfirmButton: true
	            }).then(function(){
	            	location.href = '/dashboard/podcast/edit/'+id;
	            }, function (dismiss){

	                swal('Cancelado!', '', 'warning');
	            }
	        );
		},
		edit:function(podcast){

			console.log(podcast);

			const audio     = $('#podcast-audio').val();
			const capa      = $('#podcast-capa').val();

			if(audio !== ""){
				Podcast.sendAudio();
			}

			if(capa !== ""){
				Podcast.sendCapa();
			}

			var data = this.validate(podcast);
			console.log('update', data);
	        if (data != undefined){
				const request = $.ajax({
	                url: '/dashboard/podcast/' + podcast._id,
	                type: 'PUT',
	                data: JSON.stringify(data),
	            	contentType: "application/json"
	            });

				// console.log(data);

	            request.done(function (msg) {
	            	console.log('edit Podcast done');
	            	console.log(msg);
	            	Podcast.cleanInput();
	            	swal(
		                'Atualizado com sucesso!',
		                '',
		                'success'
		            );
		            // location.reload();
	            });

	            request.fail(function (jqXHR, textStatus) {
	            	console.log('ajax fail2');
	            	console.log(jqXHR);
	            	console.log(textStatus);
	            	swal(
		                'Erro ao cadastrar!',
		                jqXHR + ' - ' + textStatus,
		                'error'
		            )
	            });
	            
			}
		},
		del:function(id, titulo, action){

			const table = $('#datatables').DataTable();
			var row;

			// console.log($(action).closest('table'));
			if($(action).closest('table').hasClass("collapsed")) {
				var child = $(action).parents("tr.child");
				row = $(child).prevAll(".parent");
			} else {
				row = $(action).parents('tr');
			}

			swal({ 	title: 'Deletar podcast?'
	                ,text: 'Deseja deletar este podcast? (' + id + ' - ' + titulo + ')'
	                ,type: 'info'
	                ,showCancelButton: true
	                ,confirmButtonText: 'Sim'
	                ,cancelButtonColor: '#DD6B55'
	                ,cancelButtonText: 'Não'
	                ,showConfirmButton: true
	            }).then(function(){
	                var request = $.ajax({
	                    url: '/dashboard/podcast/' + id,
	                    type: 'DELETE'
	                });

	                request.done(function (msg) {
	                	// console.log(msg);
	                    if(msg.indexOf("deletado") > 0) {
	                    	
	                    	table
					        .row( row )
					        .remove()
					        .draw();
	                        swal({
	                            title: "Sucesso!",
	                            text: "Deletado com sucesso",
	                            type: "success",
	                            showConfirmButton: true
	                        }).then (function() {
	                            // if (isUpdate) {
	                            //     window.location.replace(aux_urlf);
	                            // } else {
	                            //     cleanForm($("#"+btnP)[0]);
	                            // }
	                        });
	                    }
	                });

	                request.fail(function (jqXHR, textStatus) {
	                	console.log(textStatus);
	                	console.log(jqXHR);
	                    swal("Erro!", jqXHR + ' - ' + textStatus, "error");
	                });
	            }, function (dismiss){

	                swal('Cancelado!', '', 'warning');
	            }
	        );
		}
	}