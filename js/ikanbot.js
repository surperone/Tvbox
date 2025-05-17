var rule = {
    title: '爱看机器人',
    host: 'https://v.aikanbot.com',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://v.aikanbot.com/',
        'Cookie': 'visited=true;'
    },
    timeout: 10000,
    delay: 2000,
    play_parse: true,
    lazy: 'js:fetch_params => ({ js: true })',  // 启用JS渲染

    // 首页解析（适配动态结构）
    home: function($) {
        return $('.module-list').map(function() {
            return {
                title: $(this).find('h2').text().trim(),
                list: $(this).find('.video-card').map(function() {
                    return {
                        vod_id: $(this).find('a').attr('href').match(/(\d+)\.html$/)[1],
                        vod_pic: $(this).find('img').attr('data-src'),
                        vod_remarks: $(this).find('.duration').text()
                    };
                }).get()
            };
        }).get();
    },

    // 详情页解析（含多播放源）
    detail: function($) {
        const playFrom = [], playUrl = [];
        $('.play-tab li').each(function(i) {
            playFrom.push($(this).text());
            playUrl.push($('.play-list').eq(i).find('a').map(function() {
                return $(this).text() + '$' + $(this).attr('href');
            }).get().join('#'));
        });
        return {
            vod_play_from: playFrom.join('$$$'),
            vod_play_url: playUrl.join('$$$')
        };
    }
};