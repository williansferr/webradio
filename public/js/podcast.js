var podcast = {
		save:function(){
			this.sendAudio();
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

				const request = $.ajax({
	                url: '/dashboard/podcast/upload-audio',
	                type: 'POST',
	                method: 'POST',
	                data: formData,
	                cache: false,
	                // dataType: 'json', // This replaces dataFilter: function() && JSON.parse( data ).
		            processData: false, // Don't process the files
		            contentType: false
	            });
	            
	            request.done(function (msg) {
	            	console.log('ajax sendAudio done');
	            	sendCapa();
	            });

	            request.fail(function (jqXHR, textStatus) {
	            	console.log('ajax sendAudio fail');
	            	console.log(jqXHR);
            		console.log(textStatus);
	            });

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


			const request = $.ajax({
                url: '/dashboard/podcast/upload-capa',
                type: 'POST',
                method: 'POST',
                data: formData,
                cache: false,
                // dataType: 'json', // This replaces dataFilter: function() && JSON.parse( data ).
	            processData: false, // Don't process the files
	            contentType: false
            });
            
            request.done(function (msg) {
            	console.log('ajax sendCapa done');
            	return sendPodcast();
            });

            request.fail(function (jqXHR, textStatus) {
            	console.log('ajax sendCapa fail');
            	console.log(jqXHR);
            	console.log(textStatus);
                //swal("Erro!", textoErro1.textStatus, "error");
            });
		},
		sendPodcast:function(){
			const autor     = $('#input-autor').val();
			const titulo    = $('#input-titulo').val();
			const subtitulo = $('#input-subtitulo').val();
			const descricao = $('#input-descricao').val();
			const audio     = $('#podcast-audio').val();
			const capa      = $('#podcast-capa').val();

			data = {
				autor: autor,
				titulo: titulo,
				subtitulo: subtitulo,
				descricao: descricao,
				audio: audio.replace('C:\\fakepath\\', ''),
				capa: capa.replace('C:\\fakepath\\', '')
			}

			if (autor === ""){
	            swal('Informe o autor');
	            return;
	        }
			if (titulo === ""){
	            swal('Informe o título');
	            return;
	        }
	        if (subtitulo === ""){
	            swal('Informe o subtítulo');
	            return;
	        }
	        if (descricao === ""){
	            swal('Informe o descrição');
	            return;
	        }
	        if (audio === ""){
	            swal('Informe o audio');
	            return;
	        }
	        if (capa === ""){
	            swal('Informe a capa');
	            return;
	        }

			const request = $.ajax({
                url: '/dashboard/podcast',
                type: 'POST',
                data: JSON.stringify(data),
            	contentType: "application/json"
            });

			// console.log(data);

            request.done(function (msg) {
            	console.log('sendPodcast done');
            	$('#input-autor').val('');
				$('#input-titulo').val('');
				$('#input-subtitulo').val('');
				$('#input-descricao').val('');
				$('#podcast-audio').val('');
				$('#podcast-capa').val('');

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
		},
		edit:function(row){
			var table = $('#datatables').DataTable();
		},
		requestDel:function(id, dado, row){
			console.log('row', row);
			swal({ 	title: 'Deletar podcast?'
	                ,text: 'Deseja deletar este podcast? (' + id + ' - ' +dado + ')'
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
	                    	var table = $('#datatables').DataTable();
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