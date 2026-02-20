var rule = {
    title: '网飞猫',
    host: 'https://www.ncat2.com',
    url: '/vod/show/id/--fypage---.html', // 网飞猫的分页URL结构
    searchUrl: '/vod/search/**----------fypage---.html', // 网飞猫的搜索URL结构
    searchable: 2,  // 启用搜索
    quickSearch: 0, // 不启用快捷搜索
    filterable: 0,  // 不启用过滤
    headers: {
        'User-Agent': 'MOBILE_UA',  // 设置 User-Agent
    },
    class_name: '电影&电视剧&综艺&动漫',  // 类别名称
    class_url: '1&2&3&4',  // 类别对应URL
    play_parse: false,
    lazy: "js:var html=JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);var url=html.url;if(html.encrypt=='1'){url=unescape(url)}else if(html.encrypt=='2'){url=unescape(base64Decode(url))}if(/m3u8|mp4/.test(url)){input=url}else{input}",
    limit: 6,
    推荐: '.module-items;a;a&&title;img&&data-original;.module-item-note&&Text;a&&href', // 推荐影片的提取规则
    double: true, // 双击打开详情
    一级: 'a.module-poster-item.module-item;a&&title;img&&data-original;.module-item-note&&Text;a&&href', // 一级页面抓取规则
    二级: {
        "title": "h1&&Text;.module-info-tag&&Text",  // 电影/电视剧标题
        "img": ".lazyload&&data-original",  // 电影封面
        "desc": ".module-info-item:eq(1)&&Text;.module-info-item:eq(2)&&Text;.module-info-item:eq(3)&&Text",  // 简介
        "content": ".module-info-introduction&&Text",  // 内容简介
        "tabs": ".hisSwiper&&span",  // 电影标签
        "lists": ".his-tab-list:eq(#id) a"  // 播放列表
    },
    搜索: 'body .module-item;.module-card-item-title&&Text;.lazyload&&data-original;.module-item-note&&Text;a&&href;.module-info-item-content&&Text',  // 搜索结果规则
};
