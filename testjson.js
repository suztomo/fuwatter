$(function() {
//    jQuery.getJSON('/some.json', function(json) { alert('JSON rocks: ' + json.foo + ' ' + json.bar); 
//    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&tagmode=any&format=json&jsoncallback=?",
    $("div.fade").hover(function(){$(this).fadeOut(100);$(this).fadeIn(500);});

    var p = 0;
    var canvasWidth = 1000;
    var canvasHeight = 600;
    var last_post_id = 0;
    var max_z_index = 0;
    function TweetObjectPrototype(message, icon_image_url) {
        this._drawArea = $('<div class="tweet_area"></div');
        this._messageText = $('<p class="message">' + message + '</p>');
        this._messageText.appendTo(this._drawArea);
        this._messageText.hide();
        this._iconImage = $('<img class="icon_image" />');
        this._drawArea.appendTo('#images');
        this._iconImage.attr('src',icon_image_url);
        this._left = Math.random() * canvasWidth;
        this._top = Math.random() * canvasHeight;
        this._v_left = 0.001;
        this._v_top = 0.001;
        this._a_left = 0;
        this._a_top = 0;
        this._drawArea.css('left', this._left);
        this._drawArea.css('top', this._top);
        this._iconImage.appendTo(this._drawArea);
        p+= 30;
        var movetarget = this;
        movetarget._a_left = Math.random() * 4 - 2;
        movetarget._a_top = Math.random() * 4 - 2;

        setInterval(
            function() {
//                movetarget._a_left += Math.random() * 10 - 5;
//                movetarget._a_top += Math.random() * 10 - 5;
                movetarget._v_left += movetarget._a_left / 50;
                movetarget._v_top += movetarget._a_top / 50;
                movetarget._left += movetarget._v_left;
                movetarget._top += movetarget._v_top;

                if (movetarget._left < 0 || movetarget._left > canvasWidth) {
                   movetarget._v_left *= -1;
                   movetarget._a_left *= -1;
                }
                if (movetarget._top < 0 || movetarget._top > canvasHeight) {
                   movetarget._v_top *= -1;
                   movetarget._a_top *= -1;
                }

                movetarget._drawArea.css('left', movetarget._left);
                movetarget._drawArea.css('top', movetarget._top);
                var div_value = (movetarget._v_left * movetarget._v_left) + (movetarget._v_top * movetarget._v_top) + 0.01;
                movetarget._v_left /= div_value;
                movetarget._v_top /= div_value;
            },
            100
        );
        setInterval(
            function() {
                movetarget._a_left = Math.random() * 4 - 2;
                movetarget._a_top = Math.random() * 4 - 2;
            },
            5000 + Math.random() * 30000
        );
        this._drawArea.hover(
            function () {
                movetarget._messageText.fadeIn(500);
                max_z_index++;
                movetarget._drawArea.css('z-index', max_z_index);
            },
            function () {
                movetarget._messageText.fadeOut(100);
            }
        );
    }

    function hello(data, textStatus) {
        var max_id = 0;
        $.each(data, function(i, item) {
            if (item.id > last_post_id) {
                var fuga = new TweetObjectPrototype(item.text, item.user["profile_image_url"]);
            }
            if (max_id < item.id) {
                max_id = item.id;
            }
//            $("img#profile").attr("src", item.user["profile_image_url"]);
            $("#tweets ul").append("<li>"
                      + item.text
                      + " <span class='created_at'>"  
                      + item.created_at
                      + " via "  
                      + item.source  
                      + "</span></li>"); 
            });
        last_post_id = max_id;
    }
//       var url = "http://twitter.com/status/user_timeline/RedWolves.json?callback=?"; 
    var url = "http://twitter.com/statuses/friends_timeline.json?callback=?";
    $.getJSON(url, hello);
    var getjson_id = setInterval(
        function () {
            $.getJSON(url, hello);
        },
        5000
    );
    $(window).error(
        function() {
            clearInterval(getjson_id);
            alert("You might have exceeded rate limit.");

        }
    );
});



