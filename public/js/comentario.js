var Comentario = {
	del:function(id, comentario, action){

		const table = $('#datatables').DataTable();
		
		// console.log(table.row(row).data());
		// const comentario = {
		// 	id: table.row(row).data()[0],
		// 	nome: table.row(row).data()[1],
		// 	email: table.row(row).data()[2],
		// 	comentario: table.row(row).data()[3]
		// }

		var row;

		console.log($(action).closest('table'));
		if($(action).closest('table').hasClass("collapsed")) {
			var child = $(action).parents("tr.child");
			row = $(child).prevAll(".parent");
		} else {
			row = $(action).parents('tr');
		}

		swal({ 	title: 'Deletar comentário?'
                ,text: 'Deseja deletar este comentário? (' + id + ' - ' + comentario + ')'
                ,type: 'info'
                ,showCancelButton: true
                ,confirmButtonText: 'Sim'
                ,cancelButtonColor: '#DD6B55'
                ,cancelButtonText: 'Não'
                ,showConfirmButton: true
            }).then(function(){
                var request = $.ajax({
                    url: '/comentario/' + id,
                    type: 'DELETE'
                });

                request.done(function (msg) {
                	// console.log(msg);
                    if(msg.indexOf("deletado") > 0) {
                    	// var table = $('#datatables').DataTable();
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