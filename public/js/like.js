
var check_status = false;
var like_cnt = $("#like-cnt");
var like_parent = $(".like-container");

// var burst = new mojs.Burst({
//   parent: like_parent,
//   // radius:   { 20: 60 },
//   count: 15,
//   angle:{0:30},
//   children: {
//     delay: 250,
//     duration: 700,
//     radius:{10: 0},
//     fill:   [ '#01426A' ],
//     easing: 		mojs.easing.bezier(.08,.69,.39,.97)
//   }
// });

$("#like-cnt").click(function(){
  var t1 = new TimelineLite();
  var t2 = new TimelineLite();
  if(!check_status){
    t1.set(like_cnt, {scale:0});
    t1.set('.like-btn', {scale: 0});
    t1.to(like_cnt, 0.6, {scale:1, ease: Expo.easeOut});//, background: '#00A3E0'
    t2.to('.like-btn', 0.65, {scale: 1, color: '#01426A', ease: Elastic.easeOut.config(1, 0.3)}, '+=0.2');
//    t1.timeScale(5);
    check_status=true;
    //circleShape.replay();
    // burst.replay();
  }
  else{
    t1.to(like_cnt, 1, {scale:1})
      .to(like_cnt, 1, {scale:1, ease: Power4.easeOut}); //, background: 'rgba(255,255,255,0.3)'
    t1.timeScale(7);
    check_status=false;
  }
  
})



var descheck_status = false;
var deslike_cnt = $("#deslike-cnt");
var deslike_parent = $(".deslike-container");

// var burst = new mojs.Burst({
//   parent: like_parent,
//   // radius:   { 20: 60 },
//   count: 15,
//   angle:{0:30},
//   children: {
//     delay: 250,
//     duration: 700,
//     radius:{10: 0},
//     fill:   [ '#01426A' ],
//     easing:    mojs.easing.bezier(.08,.69,.39,.97)
//   }
// });

$("#deslike-cnt").click(function(){
  var t1 = new TimelineLite();
  var t2 = new TimelineLite();
  if(!descheck_status){
    t1.set(deslike_cnt, {scale:0});
    t1.set('.deslike-btn', {scale: 0});
    t1.to(deslike_cnt, 0.6, {scale:1, ease: Expo.easeOut});//, background: '#00A3E0'
    t2.to('.deslike-btn', 0.65, {scale: 1, color: '#01426A', ease: Elastic.easeOut.config(1, 0.3)}, '+=0.2');
//    t1.timeScale(5);
    descheck_status=true;
    //circleShape.replay();
    // burst.replay();
  }
  else{
    t1.to(deslike_cnt, 1, {scale:1})
      .to(deslike_cnt, 1, {scale:1, ease: Power4.easeOut}); //, background: 'rgba(255,255,255,0.3)'
    t1.timeScale(7);
    descheck_status=false;
  }
  
})