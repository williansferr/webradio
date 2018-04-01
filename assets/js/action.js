var like_cnt = $("#action");

var btnAction = {
	action:function(){
		var t1 = new TimelineLite();
		var t2 = new TimelineLite();
		// if(!check_status){
			// t1.set(like_cnt, {scale:0});
			t1.set('.action', {scale: 0});
			// t1.to(like_cnt, 0.6, {scale:1, ease: Expo.easeOut});//, background: '#00A3E0'
			t2.to('.action', 0.65, {scale: 1, color: '#01426A', ease: Elastic.easeOut.config(1, 0.3)}, '+=0.2');
			//    t1.timeScale(5);
			// check_status=true;
			//circleShape.replay();
			// burst.replay();
		// }
		// else{
		// 	t1.to(like_cnt, 1, {scale:1})
		// 	.to(like_cnt, 1, {scale:1, ease: Power4.easeOut}); //, background: 'rgba(255,255,255,0.3)'
		// 	t1.timeScale(7);
		// 	check_status=false;
		// }
	}	
}