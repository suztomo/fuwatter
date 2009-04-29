$(function() {
//    jQuery.getJSON('/some.json', function(json) { alert('JSON rocks: ' + json.foo + ' ' + json.bar); 
//    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&tagmode=any&format=json&jsoncallback=?",
    $("div.fade").hover(function(){$(this).fadeOut(100);$(this).fadeIn(500);});

    var p = 0;
    var canvasWidth = $("#images").width() - 250;
    var canvasHeight = $(window).height();
    $("#images").css('height', canvasHeight);
    var last_post_id = 0;
    var max_z_index = 0;
    var user_last_post_id = {};


    function create_random_string(str_length) {
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var str = "";
        for(i = 0; i < str_length; ++i) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }

    function put_giza_text(targetNode, message) {
        var len = message.length;
        var fixed_str = "";
        var fixed_count = 0;
        targetNode.html(create_random_string(len));
        var timer = setInterval(
            function () {
                fixed_str += message[fixed_count];
                if (fixed_str.length >= len) {
                    clearInterval(timer);
                }
                fixed_count++;
            },
            150
        );
        var timer2 = setInterval(
            function() {
                random_str = create_random_string(len - fixed_count);
                targetNode.html(fixed_str + random_str);
                if (fixed_str.length >= len) {
                    clearInterval(timer2);
                }
            },
            100
        );
    }



    function TweetObjectPrototype(name, message, icon_image_url) {
        this.name = name;
        this._drawArea = $('<div class="tweet_area"></div');
        this._messageText = $('<p class="message">' + message + '</p>');
        this._messageText.appendTo(this._drawArea);
        this._messageText.hide();
        this._iconImage = $('<img class="icon_image" />');
        this._nameText = $('<a class="screen_name" href="http://twitter.com/' + this.name + '"></a>');
        this._nameText.appendTo(this._drawArea);
        this._drawArea.appendTo('#images');
        this._iconImage.attr('src',icon_image_url);
        this._left = Math.random() * canvasWidth;
        this._top = Math.random() * canvasHeight;
        this._v_left = 0.01;
        this._v_top = 0.01;
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
                movetarget._v_left += movetarget._a_left / 50;
                movetarget._v_top += movetarget._a_top / 50;
//                movetarget._left += movetarget._v_left;
//                movetarget._top += movetarget._v_top;

                if (movetarget._left < 0 || movetarget._left > canvasWidth) {
                   movetarget._v_left *= -1;
//                   movetarget._a_left *= -1;
                }
                if (movetarget._top < 0 || movetarget._top > canvasHeight) {
                   movetarget._v_top *= -1;
//                   movetarget._a_top *= -1;
                }

                movetarget._drawArea.css('left', movetarget._left);
                movetarget._drawArea.css('top', movetarget._top);
                var div_value = (movetarget._v_left * movetarget._v_left) + (movetarget._v_top * movetarget._v_top) + 0.01;
                movetarget._v_left /= div_value;
                movetarget._v_top /= div_value;
            },
            100
        );
        this._resume_id = null;
        setInterval(
            function() {
                movetarget._a_left = Math.random() * 4 - 2;
                movetarget._a_top = Math.random() * 4 - 2;
            },
            5000 + Math.random() * 30000
        );
        setInterval(
            function() {
                movetarget._messageText.fadeIn(500);
                movetarget._resume_id = setTimeout(
                    function() {
                        movetarget._messageText.fadeOut(100);
                        movetarget._resume_id = null;
                    },
                    5000
                );
            },
            1000 + Math.random() * 30000
        );
        this._drawArea.hover(
            function () {
                movetarget._messageText.fadeIn(500);
                max_z_index++;
                movetarget._drawArea.css('z-index', max_z_index);
                put_giza_text(movetarget._nameText, movetarget.name);
            },
            function () {
                if (! movetarget._resume_id) {
                    movetarget._messageText.fadeOut(100);
                }
                movetarget._nameText.html('');
            }
        );


        this._iconImage.click(
            function() {
                var url = "http://twitter.com/statuses/friends/" + movetarget.name + ".json?callback=?";
                $.getJSON(
                    url,
                    function (data, textStatus) {
                        var max_id = 0;
                        var pre_max_id = user_last_post_id[movetarget.name] || 0;
                        var friends_count = 0;
                        $.each(
                            data,
                            function(i, item) {
                                if (friends_count < 20 && item.status && item.status.id > pre_max_id) {
                                    var hoge = new TweetObjectPrototype(item.screen_name, item.status.text, item.profile_image_url);
                                    if (item.status.id > max_id) {
                                        max_id = item.status.id + 0;
                                    }
                                    friends_count++;
                                } else {
                                        console.log("skipped");
                                }
                            }
                        );
                        user_last_post_id[movetarget.name] = max_id;
                    }
                );
            }
        );
        this._drawArea.fadeIn(500);
    }

    function hello(data, textStatus) {
        var max_id = 0;
        $.each(
            data,
            function(i, item) {
                hoge = item;
                if (item.id > last_post_id) {
                    var fuga = new TweetObjectPrototype(item.user.screen_name, item.text, item.user["profile_image_url"]);
                }
                if (max_id < item.id) {
                    max_id = item.id;
                }
            }
        );
        last_post_id = max_id;
    }
//       var url = "http://twitter.com/status/user_timeline/RedWolves.json?callback=?"; 
    var url = "http://twitter.com/statuses/friends_timeline.json?callback=?";
    $.getJSON(url, hello);

    var getjson_id = setInterval(
        function () {
            $.getJSON(url, hello);
            /*.error(
                function() {
                    clearInterval(getjson_id);
                    $('#error').html("Cannot fetch data from twitter.com <br />You might have exceeded rate limit.")
                    .fadeIn(500)
                    .fadeOut(10000);
                }
            );*/
        },
        15000
    );
    $(window).error(
        function() {
            clearInterval(getjson_id);
            $('#error').html("Cannot fetch data from twitter.com <br />You might have exceeded rate limit.").
            fadeIn(500)
            .fadeOut(10000);
        }
    );
    put_giza_text($('#fuwatter'), "Fuwatter");

});



