var rule = {
    title: '爱看机器人',
    host: 'https://v.aikanbot.com',
    homeUrl: '/',
    url: '/fyclass/page/fypage/',
    searchUrl: '/search/**/fypage/',
    searchable: 2,
    quickSearch: 1,
    filterable: 0,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36',
        'Referer': 'https://v.aikanbot.com/'
    },
    class_name: '电影&电视剧&综艺&动漫&纪录片',
    class_url: 'dianying&dianshiju&zongyi&dongman&jilupian',
    timeout: 5000,
    play_parse: true,
    lazy: '',
    limit: 6,
    double: true,

    // 首页推荐解析优化
    home: function($) {
        const result = [];
        $('.module-items').each(function() { // 修正模块容器选择器
            const moduleTitle = $(this).prev('h3').text().trim(); // 模块标题可能在前面的h3标签
            const vodList = [];
            $(this).find('.video-item').each(function() {
                const $this = $(this);
                const vod = {
                    vod_name: $this.find('.title').text().trim(),
                    vod_pic: $this.find('img').attr('data-original') || $this.find('img').attr('src'),
                    vod_remarks: $this.find('.tags').text().trim(), // 修正备注信息选择器
                    vod_id: $this.find('a').attr('href').match(/(\d+)\.html$/)[1] // 提取ID更精确
                };
                vod.vod_pic = vod.vod_pic.startsWith('http') ? vod.vod_pic : this.host + vod.vod_pic;
                vodList.push(vod);
            });
            result.push({ title: moduleTitle, list: vodList });
        });
        return result;
    },

    // 分类页解析优化
    list: function($) {
        const result = [];
        $('.video-list .video-item').each(function() { // 更精确的选择器
            const $this = $(this);
            const vod = {
                vod_name: $this.find('.title').text().trim(),
                vod_pic: $this.find('img').attr('data-src') || $this.find('img').attr('src'), // 处理懒加载
                vod_remarks: $this.find('.video-info').text().trim(),
                vod_id: $this.find('a').attr('href').match(/(\d+)\.html$/)[1]
            };
            vod.vod_pic = vod.vod_pic.startsWith('http') ? vod.vod_pic : this.host + vod.vod_pic;
            result.push(vod);
        });
        return result;
    },

    // 详情页解析优化
    detail: function($) {
        const $info = $('.video-info-box');
        const vod = {
            vod_name: $('.video-title').text().trim(),
            vod_pic: $('.video-cover img').attr('src'),
            vod_year: $info.find('p:contains("年份")').text().split('：')[1] || '',
            vod_area: $info.find('p:contains("地区")').text().split('：')[1] || '',
            vod_actor: $info.find('p:contains("主演")').text().split('：')[1] || '',
            vod_director: $info.find('p:contains("导演")').text().split('：')[1] || '',
            vod_content: $('.video-intro').text().trim(),
            vod_play_from: [],
            vod_play_url: []
        };

        // 处理多播放源
        $('.playlist-tab li').each(function(i) {
            const source = $(this).text().trim();
            vod.vod_play_from.push(source);
            const urls = [];
            $($('.playlist-item').eq(i).find('a')).each(function() {
                urls.push($(this).text().trim() + '$' + $(this).attr('href'));
            });
            vod.vod_play_url.push(urls.join('#'));
        });
        vod.vod_play_from = vod.vod_play_from.join('$$$');
        vod.vod_play_url = vod.vod_play_url.join('$$$');

        return vod;
    },

    // 搜索解析优化
    search: function($) {
        const result = [];
        $('.search-result-item').each(function() { // 修正选择器
            const $this = $(this);
            const vod = {
                vod_name: $this.find('.video-title').text().trim(),
                vod_pic: $this.find('img').attr('data-src') || $this.find('img').attr('src'),
                vod_remarks: $this.find('.video-tag').text().trim(),
                vod_id: $this.find('a').attr('href').match(/(\d+)\.html$/)[1]
            };
            vod.vod_pic = vod.vod_pic.startsWith('http') ? vod.vod_pic : this.host + vod.vod_pic;
            result.push(vod);
        });
        return result;
    },

    // 播放地址解析增强
    play: function(html) {
        let playUrl = '';
        // 处理多种可能的播放器脚本
        const regex = /urls*=\s*["'](.*?)["']/;
        const match = html.match(regex);
        if (match && match[1]) {
            playUrl = match[1];
            if (!playUrl.startsWith('http')) {
                playUrl = this.host + playUrl;
            }
        }
        // 处理Base64编码地址
        if (playUrl.startsWith('http') && playUrl.includes('url=')) {
            const base64Str = playUrl.split('url=')[1];
            playUrl = Buffer.from(base64Str, 'base64').toString();
        }
        return { parse: 0, url: playUrl, header: this.headers };
    },

    // 增强预处理
    before: function(html) {
        // 移除干扰脚本和注释
        return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  .replace(/<!--.*?-->/gs, '');
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = rule;
}