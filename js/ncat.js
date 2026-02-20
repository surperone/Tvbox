var rule = {
  title: '网飞猫',
  host: 'https://www.ncat2.com',
  url: '/show/fyclass-fyfilter-fypage.html',
  filter_url: '{{fl.类型}}-{{fl.地区}}-{{fl.语言}}-{{fl.年份}}-{{fl.排序}}',
  searchUrl: '/search?k=**&page=fypage',
  searchable: 2,
  quickSearch: 0,
  filterable: 1,
  headers: {
    'User-Agent': 'MOBILE_UA',
  },
  class_parse: '#nav-swiper&&.nav-item;a&&Text;a&&href;/show/(\\d+)\\.html',
  cate_exclude: 'Netflix|今日更新|专题列表|排行榜',
  tab_order: ['超清', '蓝光', '极速蓝光'],
  play_parse: true,
  lazy: '',
  limit: 20,
  
  // 推荐（首页热播）
  推荐: '.section-box:eq(2) .module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
  
  // 一级分类（电影/电视剧/动漫/综艺）
  一级: '.module-items .module-item;a&&title;img&&data-src;.module-item-text&&Text;a&&href',
  
  // 二级详情页
  二级: {
    title: '.detail-title&&Text',
    img: '.detail-pic&&img&&data-src',
    desc: '.detail-info-row-main:eq(0)&&Text;.detail-info-row-main:eq(1)&&Text;.detail-info-row-main:eq(2)&&Text',
    content: '.detail-desc&&Text',
    tabs: '.source-tab&&a',
    lists: '.play-list:eq(#id)&&a',
  },
  
  // 搜索页
  搜索: '.search-result-item-header;a&&title;img&&data-src;.search-result-item-header&&Text;a&&href;.desc&&Text',
  图片替换: 'https://www.ncat2.com=>https://vres.a357899.cn',
  
  // 动态过滤器（可选）
  filter: {
    "movie": [
      {
        "key": "类型",
        "name": "类型",
        "value": [
          {"n": "全部", "v": ""},
          {"n": "动作", "v": "动作"},
          {"n": "喜剧", "v": "喜剧"},
          {"n": "科幻", "v": "科幻"}
        ]
      },
      {
        "key": "地区",
        "name": "地区",
        "value": [
          {"n": "全部", "v": ""},
          {"n": "大陆", "v": "大陆"},
          {"n": "香港", "v": "香港"},
          {"n": "美国", "v": "美国"}
        ]
      }
    ]
  },
  
  // 爬取一级分类的动态内容（JS方式，可选）
  一级f: `
    js:
    pdfa = jsp.pdfa;
    pdfh = jsp.pdfh;
    pd = jsp.pd;
    let html = request(input);
    let list = pdfa(html, '.module-items .module-item');
    let d = [];
    list.forEach(it => {
      d.push({
        title: pdfh(it, 'a&&title'),
        img: pd(pdfh(it, 'img&&data-src'), input),
        desc: pdfh(it, '.module-item-text&&Text'),
        url: pd(pdfh(it, 'a&&href'), input)
      });
    });
    setResult(d);
  `
};

