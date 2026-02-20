var rule = {
  title: '网飞猫',
  host: 'https://www.ncat2.com',
  url: '/show/fyclass-fyfilter-fypage.html',
  filter_url:'{{fl.类型}}-{{fl.地区}}-{{fl.语言}}-{{fl.年份}}-{{fl.排序}}',
  searchUrl: '/search?k=**&page=fypage',
  searchable: 2,
  quickSearch: 0,
  filterable: 1,
  headers: {
    'User-Agent': 'MOBILE_UA',
  },
  class_parse: '#nav-swiper&&.nav-swiper-slide;a&&Text;a&&href;/(\\w+).html',
  cate_exclude:'Netflix|今日更新|专题列表|排行榜',
  //class_name: '电视剧&电影&动漫&综艺&短剧',
  //class_url: '2&1&3&4&6',
  play_parse: true,
  lazy: '',
  limit: 20,
  推荐: '.section-box:eq(2)&&.module-main&&.module-items .module-item;a&&title;img&&data-original;.module-item-text&&Text;a&&href',
  double: true,
  一级: '.module-items .module-item;a&&title;img&&data-original;.module-item-text&&Text;a&&href',
  二级: {
    title: '.detail-title&&Text;.detail-tags&&a:eq(-2)&&Text',
    img: '.detail-pic&&img&&data-original',
    desc: '.detail-info-row-main:eq(-2)&&Text;.detail-tags&&a&&Text;.detail-tags&&a:eq(1)&&Text;.detail-info-row-main:eq(1)&&Text;.detail-info-row-main&&Text',
    content: '.detail-desc&&Text',
    tabs: '.source-tab&&a',
    lists: '.play-list:eq(#id) a',
  },
  搜索: '.search-result-list&&.search-result-item-header;a&&title;img&&data-original;.search-result-item-header&&Text;a&&href;.desc&&Text',
  图片替换:'https://www.ncat2.com=>https://vres.a357899.cn',
  filter: {
    "1": [
      {
        "key": "类型",
        "name": "类型",
        "value": [
          {"n": "全部", "v": ""},
          {"n": "动作", "v": "动作"},
          {"n": "喜剧", "v": "喜剧"},
          {"n": "爱情", "v": "爱情"},
          {"n": "科幻", "v": "科幻"},
          {"n": "恐怖", "v": "恐怖"},
          {"n": "剧情", "v": "剧情"},
          {"n": "战争", "v": "战争"}
        ]
      },
      {
        "key": "地区",
        "name": "地区",
        "value": [
          {"n": "全部", "v": ""},
          {"n": "大陆", "v": "大陆"},
          {"n": "香港", "v": "香港"},
          {"n": "台湾", "v": "台湾"},
          {"n": "美国", "v": "美国"},
          {"n": "韩国", "v": "韩国"},
          {"n": "日本", "v": "日本"},
          {"n": "英国", "v": "英国"}
        ]
      },
      {
        "key": "年份",
        "name": "年份",
        "value": [
          {"n": "全部", "v": ""},
          {"n": "2023", "v": "2023"},
          {"n": "2022", "v": "2022"},
          {"n": "2021", "v": "2021"},
          {"n": "2020", "v": "2020"}
        ]
      }
    ]
  },
  一级f: `js:
    pdfa = jsp.pdfa;
    pdfh = jsp.pdfh;
    pd = jsp.pd;
    let html = request(input);
    let list = pdfa(html, '.module-items .module-item');
    let d = [];
    list.forEach(it => {
      d.push({
        title: pdfh(it, 'a&&title'),
        img: pd(pdfh(it, 'img&&data-original'), input),
        desc: pdfh(it, '.module-item-text&&Text'),
        url: pd(pdfh(it, 'a&&href'), input)
      });
    });
    setResult(d);
  `
};
