var rule = {
    title:'爱看机器人',
    host:'https://v.aikanbot.com',
    homeUrl:'/',
    url:'/fyclass/page/fypage/',
    searchUrl:'/search/**/fypage/',
    searchable:2,
    quickSearch:1,
    filterable:0,
    headers:{
        'User-Agent':'MOBILE_UA',
        'Referer':'https://v.aikanbot.com/'
    },
    class_name:'电影&电视剧&综艺&动漫&纪录片',
    class_url:'dianying&dianshiju&zongyi&dongman&jilupian',
    timeout:5000,
    play_parse:true,
    lazy:'',
    limit:6,
    double:true,
    
    // 首页推荐解析
    home:function($) {
        var result = [];
        $('.module-item').each(function() {
            var moduleTitle = $(this).find('.module-title').text().trim();
            var vodList = [];
            $(this).find('.video-item').each(function() {
                var vod = {
                    vod_name: $(this).find('.title').text().trim(),
                    vod_pic: $(this).find('img').attr('data-original') || $(this).find('img').attr('src'),
                    vod_remarks: $(this).find('.info').text().trim(),
                    vod_id: $(this).find('a').attr('href').replace(/.*\/(.*?)\.html/, '\$1')
                };
                if (!vod.vod_pic.startsWith('http')) {
                    vod.vod_pic = rule.host + vod.vod_pic;
                }
                vodList.push(vod);
            });
            result.push({
                title: moduleTitle,
                list: vodList
            });
        });
        return result;
    },
    
    // 分类页解析
    list:function($) {
        var result = [];
        $('.video-item').each(function() {
            var vod = {
                vod_name: $(this).find('.title').text().trim(),
                vod_pic: $(this).find('img').attr('data-original') || $(this).find('img').attr('src'),
                vod_remarks: $(this).find('.info').text().trim(),
                vod_id: $(this).find('a').attr('href').replace(/.*\/(.*?)\.html/, '\$1')
            };
            if (!vod.vod_pic.startsWith('http')) {
                vod.vod_pic = rule.host + vod.vod_pic;
            }
            result.push(vod);
        });
        return result;
    },
    
    // 详情页解析
    detail:function($) {
        var vod = {
            vod_name: $('.video-title').text().trim(),
            vod_pic: $('.video-cover img').attr('src'),
            vod_year: $('.video-info:contains("年份")').text().replace('年份：', '').trim(),
            vod_area: $('.video-info:contains("地区")').text().replace('地区：', '').trim(),
            vod_actor: $('.video-info:contains("主演")').text().replace('主演：', '').trim(),
            vod_director: $('.video-info:contains("导演")').text().replace('导演：', '').trim(),
            vod_content: $('.video-desc').text().trim(),
            vod_play_from: '',
            vod_play_url: ''
        };
        
        if (!vod.vod_pic.startsWith('http')) {
            vod.vod_pic = rule.host + vod.vod_pic;
        }
        
        // 处理播放源
        var playFrom = [];
        var playUrl = [];
        $('.playlist li').each(function() {
            var sourceName = $(this).find('a').text().trim();
            var sourceUrl = $(this).find('a').attr('href');
            playFrom.push(sourceName);
            playUrl.push(sourceName + '$' + sourceUrl);
        });
        
        vod.vod_play_from = playFrom.join('$$$');
        vod.vod_play_url = playUrl.join('$$$');
        
        return vod;
    },
    
    // 搜索解析
    search:function($) {
        var result = [];
        $('.search-item').each(function() {
            var vod = {
                vod_name: $(this).find('.title').text().trim(),
                vod_pic: $(this).find('img').attr('data-original') || $(this).find('img').attr('src'),
                vod_remarks: $(this).find('.info').text().trim(),
                vod_id: $(this).find('a').attr('href').replace(/.*\/(.*?)\.html/, '\$1')
            };
            if (!vod.vod_pic.startsWith('http')) {
                vod.vod_pic = rule.host + vod.vod_pic;
            }
            result.push(vod);
        });
        return result;
    },
    
    // 播放地址解析
    play:function(html) {
        var playUrl = '';
        var script = html.match(/<script.*?player_aaaa.*?<\/script>/);
        if (script) {
            var urlMatch = script[0].match(/url:\s*["'](.*?)["']/);
            if (urlMatch && urlMatch[1]) {
                playUrl = urlMatch[1];
                if (!playUrl.startsWith('http')) {
                    playUrl = rule.host + playUrl;
                }
            }
        }
        return {
            parse: 0,
            url: playUrl,
            header: rule.headers
        };
    },
    
    // 自定义预处理
    before:function(html) {
        return html.replace(/<script.*?<\/script>/g, '');
    }
};

// 导出规则
if (typeof module !== 'undefined' && module.exports) {
    module.exports = rule;
}