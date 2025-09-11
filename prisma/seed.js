/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dev database...');

  const destructive = process.env.DESTRUCTIVE_SEED === 'true';
  if (destructive) {
    console.log('Destructive seed enabled: clearing existing data');
    await prisma.prompt.deleteMany();
    await prisma.unit.deleteMany();
    await prisma.lang.deleteMany();
  }

  // Languages with prompts: native script -> romanization (not translation)
  const langs = [
    {
      name: 'Japanese',
      units: [
        {
          name: 'Greetings',
          prompts: [
            { content: 'こんにちは', answer: 'konnichiwa' },
            { content: 'ありがとう', answer: 'arigatou' },
            { content: 'すみません', answer: 'sumimasen' },
            { content: 'ごめんなさい', answer: 'gomennasai' },
            { content: 'お願いします', answer: 'onegaishimasu' },
            { content: 'おはよう', answer: 'ohayou' },
            { content: 'こんばんは', answer: 'konbanwa' },
            { content: 'さようなら', answer: 'sayounara' },
            { content: 'はい', answer: 'hai' },
            { content: 'いいえ', answer: 'iie' },
          ],
        },
        {
          name: 'Numbers 1-10',
          prompts: [
            { content: '一', answer: 'ichi' },
            { content: '二', answer: 'ni' },
            { content: '三', answer: 'san' },
            { content: '四', answer: 'yon' },
            { content: '五', answer: 'go' },
            { content: '六', answer: 'roku' },
            { content: '七', answer: 'nana' },
            { content: '八', answer: 'hachi' },
            { content: '九', answer: 'kyuu' },
            { content: '十', answer: 'juu' },
          ],
        },
        {
          name: 'Food & Drink',
          prompts: [
            { content: '水', answer: 'mizu' },
            { content: 'お茶', answer: 'ocha' },
            { content: 'コーヒー', answer: 'koohii' },
            { content: 'ご飯', answer: 'gohan' },
            { content: '麺', answer: 'men' },
            { content: 'パン', answer: 'pan' },
            { content: '牛乳', answer: 'gyuunyuu' },
            { content: 'ジュース', answer: 'juusu' },
            { content: 'ビール', answer: 'biiru' },
            { content: 'ワイン', answer: 'wain' },
            { content: 'りんご', answer: 'ringo' },
            { content: '肉', answer: 'niku' },
          ],
        },
        {
          name: 'Common Verbs',
          prompts: [
            { content: '行く', answer: 'iku' },
            { content: '来る', answer: 'kuru' },
            { content: '食べる', answer: 'taberu' },
            { content: '飲む', answer: 'nomu' },
            { content: '見る', answer: 'miru' },
            { content: '話す', answer: 'hanasu' },
            { content: '書く', answer: 'kaku' },
            { content: '読む', answer: 'yomu' },
            { content: 'する', answer: 'suru' },
            { content: 'ある', answer: 'aru' },
            { content: 'いる', answer: 'iru' },
            { content: '走る', answer: 'hashiru' },
          ],
        },
        {
          name: 'Family',
          prompts: [
            { content: '母', answer: 'haha' },
            { content: '父', answer: 'chichi' },
            { content: '兄', answer: 'ani' },
            { content: '姉', answer: 'ane' },
            { content: '弟', answer: 'otouto' },
            { content: '妹', answer: 'imouto' },
            { content: '息子', answer: 'musuko' },
            { content: '娘', answer: 'musume' },
            { content: '家族', answer: 'kazoku' },
            { content: '友達', answer: 'tomodachi' },
            { content: '夫', answer: 'otto' },
            { content: '妻', answer: 'tsuma' },
          ],
        },
        {
          name: 'Days & Time',
          prompts: [
            { content: '月曜日', answer: 'getsuyoubi' },
            { content: '火曜日', answer: 'kayoubi' },
            { content: '水曜日', answer: 'suiyoubi' },
            { content: '木曜日', answer: 'mokuyoubi' },
            { content: '金曜日', answer: 'kinyoubi' },
            { content: '土曜日', answer: 'doyoubi' },
            { content: '日曜日', answer: 'nichiyoubi' },
            { content: '今日', answer: 'kyou' },
            { content: '明日', answer: 'ashita' },
            { content: '昨日', answer: 'kinou' },
          ],
        },
        {
          name: 'Places',
          prompts: [
            { content: '学校', answer: 'gakkou' },
            { content: '家', answer: 'ie' },
            { content: '店', answer: 'mise' },
            { content: '病院', answer: 'byouin' },
            { content: '駅', answer: 'eki' },
            { content: '公園', answer: 'kouen' },
            { content: '会社', answer: 'kaisha' },
            { content: '銀行', answer: 'ginkou' },
            { content: '図書館', answer: 'toshokan' },
            { content: '空港', answer: 'kuukou' },
            { content: '市場', answer: 'ichiba' },
            { content: 'レストラン', answer: 'resutoran' },
          ],
        },
      ],
    },
    {
      name: 'Korean',
      units: [
        {
          name: 'Greetings',
          prompts: [
            { content: '안녕하세요', answer: 'annyeonghaseyo' },
            { content: '안녕히 계세요', answer: 'annyeonghi gyeseyo' },
            { content: '안녕히 가세요', answer: 'annyeonghi gaseyo' },
            { content: '감사합니다', answer: 'gamsahamnida' },
            { content: '죄송합니다', answer: 'joesonghamnida' },
            { content: '제발', answer: 'jebal' },
            { content: '네', answer: 'ne' },
            { content: '아니요', answer: 'aniyo' },
            { content: '안녕', answer: 'annyeong' },
            { content: '잘 부탁합니다', answer: 'jal butakhamnida' },
          ],
        },
        {
          name: 'Numbers 1-10 (Sino)',
          prompts: [
            { content: '일', answer: 'il' },
            { content: '이', answer: 'i' },
            { content: '삼', answer: 'sam' },
            { content: '사', answer: 'sa' },
            { content: '오', answer: 'o' },
            { content: '육', answer: 'yuk' },
            { content: '칠', answer: 'chil' },
            { content: '팔', answer: 'pal' },
            { content: '구', answer: 'gu' },
            { content: '십', answer: 'sip' },
          ],
        },
        {
          name: 'Food & Drink',
          prompts: [
            { content: '물', answer: 'mul' },
            { content: '차', answer: 'cha' },
            { content: '커피', answer: 'keopi' },
            { content: '밥', answer: 'bap' },
            { content: '면', answer: 'myeon' },
            { content: '빵', answer: 'ppang' },
            { content: '우유', answer: 'uyu' },
            { content: '주스', answer: 'juseu' },
            { content: '맥주', answer: 'maekju' },
            { content: '와인', answer: 'wain' },
            { content: '사과', answer: 'sagwa' },
            { content: '고기', answer: 'gogi' },
          ],
        },
        {
          name: 'Common Verbs',
          prompts: [
            { content: '가다', answer: 'gada' },
            { content: '오다', answer: 'oda' },
            { content: '먹다', answer: 'meokda' },
            { content: '마시다', answer: 'masida' },
            { content: '보다', answer: 'boda' },
            { content: '읽다', answer: 'ikda' },
            { content: '쓰다', answer: 'sseuda' },
            { content: '하다', answer: 'hada' },
            { content: '있다', answer: 'itda' },
            { content: '없다', answer: 'eopda' },
            { content: '걷다', answer: 'geotda' },
            { content: '달리다', answer: 'dallida' },
          ],
        },
        {
          name: 'Family',
          prompts: [
            { content: '어머니', answer: 'eomeoni' },
            { content: '아버지', answer: 'abeoji' },
            { content: '형', answer: 'hyeong' },
            { content: '누나', answer: 'nuna' },
            { content: '오빠', answer: 'oppa' },
            { content: '언니', answer: 'eonni' },
            { content: '동생', answer: 'dongsaeng' },
            { content: '아들', answer: 'adeul' },
            { content: '딸', answer: 'ttal' },
            { content: '가족', answer: 'gajok' },
            { content: '친구', answer: 'chingu' },
            { content: '남편', answer: 'nampyeon' },
          ],
        },
        {
          name: 'Days & Time',
          prompts: [
            { content: '월요일', answer: 'woryoil' },
            { content: '화요일', answer: 'hwayoil' },
            { content: '수요일', answer: 'suyoil' },
            { content: '목요일', answer: 'mogyoil' },
            { content: '금요일', answer: 'geumyoil' },
            { content: '토요일', answer: 'toyoil' },
            { content: '일요일', answer: 'iryoil' },
            { content: '오늘', answer: 'oneul' },
            { content: '내일', answer: 'naeil' },
            { content: '어제', answer: 'eoje' },
          ],
        },
        {
          name: 'Places',
          prompts: [
            { content: '학교', answer: 'hakgyo' },
            { content: '집', answer: 'jib' },
            { content: '가게', answer: 'gage' },
            { content: '병원', answer: 'byeongwon' },
            { content: '역', answer: 'yeok' },
            { content: '공원', answer: 'gongwon' },
            { content: '회사', answer: 'hoesa' },
            { content: '은행', answer: 'eunhaeng' },
            { content: '도서관', answer: 'doseogwan' },
            { content: '공항', answer: 'gonghang' },
            { content: '시장', answer: 'sijang' },
            { content: '레스토랑', answer: 'reseutorang' },
          ],
        },
      ],
    },
    {
      name: 'Chinese',
      units: [
        {
          name: 'Greetings',
          prompts: [
            { content: '你好', answer: 'ni hao' },
            { content: '谢谢', answer: 'xie xie' },
            { content: '请', answer: 'qing' },
            { content: '对不起', answer: 'dui bu qi' },
            { content: '再见', answer: 'zai jian' },
            { content: '早上好', answer: 'zao shang hao' },
            { content: '晚上好', answer: 'wan shang hao' },
            { content: '没关系', answer: 'mei guan xi' },
            { content: '好的', answer: 'hao de' },
            { content: '不客气', answer: 'bu ke qi' },
          ],
        },
        {
          name: 'Numbers 1-10',
          prompts: [
            { content: '一', answer: 'yi' },
            { content: '二', answer: 'er' },
            { content: '三', answer: 'san' },
            { content: '四', answer: 'si' },
            { content: '五', answer: 'wu' },
            { content: '六', answer: 'liu' },
            { content: '七', answer: 'qi' },
            { content: '八', answer: 'ba' },
            { content: '九', answer: 'jiu' },
            { content: '十', answer: 'shi' },
          ],
        },
        {
          name: 'Food & Drink',
          prompts: [
            { content: '水', answer: 'shui' },
            { content: '茶', answer: 'cha' },
            { content: '咖啡', answer: 'ka fei' },
            { content: '米饭', answer: 'mi fan' },
            { content: '面条', answer: 'mian tiao' },
            { content: '面包', answer: 'mian bao' },
            { content: '牛奶', answer: 'niu nai' },
            { content: '果汁', answer: 'guo zhi' },
            { content: '啤酒', answer: 'pi jiu' },
            { content: '葡萄酒', answer: 'pu tao jiu' },
            { content: '苹果', answer: 'ping guo' },
            { content: '肉', answer: 'rou' },
          ],
        },
        {
          name: 'Common Verbs',
          prompts: [
            { content: '去', answer: 'qu' },
            { content: '来', answer: 'lai' },
            { content: '吃', answer: 'chi' },
            { content: '喝', answer: 'he' },
            { content: '看', answer: 'kan' },
            { content: '读', answer: 'du' },
            { content: '写', answer: 'xie' },
            { content: '做', answer: 'zuo' },
            { content: '有', answer: 'you' },
            { content: '没有', answer: 'mei you' },
            { content: '走', answer: 'zou' },
            { content: '跑', answer: 'pao' },
          ],
        },
        {
          name: 'Family',
          prompts: [
            { content: '妈妈', answer: 'ma ma' },
            { content: '爸爸', answer: 'ba ba' },
            { content: '哥哥', answer: 'ge ge' },
            { content: '姐姐', answer: 'jie jie' },
            { content: '弟弟', answer: 'di di' },
            { content: '妹妹', answer: 'mei mei' },
            { content: '儿子', answer: 'er zi' },
            { content: '女儿', answer: 'nv er' },
            { content: '家人', answer: 'jia ren' },
            { content: '朋友', answer: 'peng you' },
            { content: '丈夫', answer: 'zhang fu' },
            { content: '妻子', answer: 'qi zi' },
          ],
        },
        {
          name: 'Days & Time',
          prompts: [
            { content: '星期一', answer: 'xing qi yi' },
            { content: '星期二', answer: 'xing qi er' },
            { content: '星期三', answer: 'xing qi san' },
            { content: '星期四', answer: 'xing qi si' },
            { content: '星期五', answer: 'xing qi wu' },
            { content: '星期六', answer: 'xing qi liu' },
            { content: '星期天', answer: 'xing qi tian' },
            { content: '今天', answer: 'jin tian' },
            { content: '明天', answer: 'ming tian' },
            { content: '昨天', answer: 'zuo tian' },
          ],
        },
        {
          name: 'Places',
          prompts: [
            { content: '学校', answer: 'xue xiao' },
            { content: '家', answer: 'jia' },
            { content: '商店', answer: 'shang dian' },
            { content: '医院', answer: 'yi yuan' },
            { content: '车站', answer: 'che zhan' },
            { content: '公园', answer: 'gong yuan' },
            { content: '公司', answer: 'gong si' },
            { content: '银行', answer: 'yin hang' },
            { content: '图书馆', answer: 'tu shu guan' },
            { content: '机场', answer: 'ji chang' },
            { content: '市场', answer: 'shi chang' },
            { content: '餐厅', answer: 'can ting' },
          ],
        },
        {
          name: 'HSK4 Challenge',
          prompts: [
            { content: '尽管天气很差我们还是去旅行', answer: 'jin guan tian qi hen cha wo men hai shi qu lv xing' },
            { content: '他对中国文化有深入的了解', answer: 'ta dui zhong guo wen hua you shen ru de liao jie' },
            { content: '环境保护是全球共同的责任', answer: 'huan jing bao hu shi quan qiu gong tong de ze ren' },
            { content: '这部小说的情节非常复杂', answer: 'zhe bu xiao shuo de qing jie fei chang fu za' },
            { content: '公司计划明年扩大海外市场', answer: 'gong si ji hua ming nian kuo da hai wai shi chang' },
            { content: '教育制度的改革正在进行', answer: 'jiao yu zhi du de gai ge zheng zai jin xing' },
            { content: '他表现出极强的领导能力', answer: 'ta biao xian chu ji qiang de ling dao neng li' },
            { content: '这项研究具有很高的学术价值', answer: 'zhe xiang yan jiu ju you hen gao de xue shu jia zhi' },
            { content: '我们应该尊重不同的文化传统', answer: 'wo men ying gai zun zhong bu tong de wen hua chuan tong' },
            { content: '他们正在讨论国际合作的问题', answer: 'ta men zheng zai tao lun guo ji he zuo de wen ti' },
            { content: '虽然他很忙但是他还是会帮我', answer: 'sui ran ta hen mang dan shi ta hai shi hui bang wo' },
            { content: '如果你有时间我们一起去看电影', answer: 'ru guo ni you shi jian wo men yi qi qu kan dian ying' },
            { content: '我已经学习汉语三年了', answer: 'wo yi jing xue xi han yu san nian le' },
            { content: '天气预报说明天会下雨', answer: 'tian qi yu bao shuo ming tian hui xia yu' },
            { content: '他在公司里负责重要的项目', answer: 'ta zai gong si li fu ze zhong yao de xiang mu' },
            { content: '请把窗户关上否则会很冷', answer: 'qing ba chuang hu guan shang fou ze hui hen leng' },
            { content: '这次比赛的结果令人吃惊', answer: 'zhe ci bi sai de jie guo ling ren chi jing' },
            { content: '他对未来充满信心', answer: 'ta dui wei lai chong man xin xin' },
            { content: '你能否给我一个合理的解释', answer: 'ni neng fou gei wo yi ge he li de jie shi' },
            { content: '我对这份工作非常感兴趣', answer: 'wo dui zhe fen gong zuo fei chang gan xing qu' },
          ],
        },
        {
          name: 'HSK4+ Challenge',
          prompts: [
            { content: '尽管面临困难他仍坚持完成任务', answer: 'jin guan mian lin kun nan ta reng jian chi wan cheng ren wu' },
            { content: '由于交通堵塞我们错过了早班车', answer: 'you yu jiao tong du se wo men cuo guo le zao ban che' },
            { content: '他在会议上提出了一个独特的观点', answer: 'ta zai hui yi shang ti chu le yi ge du te de guan dian' },
            { content: '这次旅行给我留下了深刻的印象', answer: 'zhe ci lv xing gei wo liu xia le shen ke de yin xiang' },
            { content: '如果没有你的帮助我无法完成作业', answer: 'ru guo mei you ni de bang zhu wo wu fa wan cheng zuo ye' },
            { content: '随着科技的发展生活变得更加方便', answer: 'sui zhe ke ji de fa zhan sheng huo bian de geng jia fang bian' },
            { content: '他总是把别人的需要放在第一位', answer: 'ta zong shi ba bie ren de xu yao fang zai di yi wei' },
            { content: '我对他处理问题的方式感到满意', answer: 'wo dui ta chu li wen ti de fang shi gan dao man yi' },
            { content: '这家餐厅的服务质量值得称赞', answer: 'zhe jia can ting de fu wu zhi liang zhi de cheng zan' },
            { content: '在压力之下她依然保持冷静', answer: 'zai ya li zhi xia ta yi ran bao chi leng jing' },
            { content: '他为了实现梦想付出了巨大努力', answer: 'ta wei le shi xian meng xiang fu chu le ju da nu li' },
            { content: '公司正在寻找具有创造力的员工', answer: 'gong si zheng zai xun zhao ju you chuang zao li de yuan gong' },
            { content: '你应该通过运动来保持健康', answer: 'ni ying gai tong guo yun dong lai bao chi jian kang' },
            { content: '我们都非常期待即将到来的节日', answer: 'wo men dou fei chang qi dai ji jiang dao lai de jie ri' },
            { content: '这篇文章表达了作者的真实感受', answer: 'zhe pian wen zhang biao da le zuo zhe de zhen shi gan shou' },
            { content: '学校决定扩大图书馆的藏书量', answer: 'xue xiao jue ding kuo da tu shu guan de cang shu liang' },
            { content: '会议结束后我们一起讨论了计划', answer: 'hui yi jie shu hou wo men yi qi tao lun le ji hua' },
            { content: '他愿意承担失败的责任', answer: 'ta yuan yi cheng dan shi bai de ze ren' },
            { content: '面对挑战时要保持积极的态度', answer: 'mian dui tiao zhan shi yao bao chi ji ji de tai du' },
            { content: '很多人赞成采取更严格的措施', answer: 'hen duo ren zan cheng cai qu geng yan ge de cuo shi' },
          ],
        },
        {
          name: 'HSK5 Challenge',
          prompts: [
            { content: '据专家分析经济增长将持续放缓', answer: 'ju zhuan jia fen xi jing ji zeng zhang jiang chi xu fang huan' },
            { content: '他在演讲中引用了大量历史资料', answer: 'ta zai yan jiang zhong yin yong le da liang li shi zi liao' },
            { content: '为了保护环境政府制定了新的法规', answer: 'wei le bao hu huan jing zheng fu zhi ding le xin de fa gui' },
            { content: '这部电影深刻反映了社会现实', answer: 'zhe bu dian ying shen ke fan ying le she hui xian shi' },
            { content: '科学家正在研究如何利用太阳能', answer: 'ke xue jia zheng zai yan jiu ru he li yong tai yang neng' },
            { content: '他的小说以独特的结构吸引读者', answer: 'ta de xiao shuo yi du te de jie gou xi yin du zhe' },
            { content: '公司面临激烈的市场竞争', answer: 'gong si mian lin ji lie de shi chang jing zheng' },
            { content: '她凭借出色的表现获得了奖学金', answer: 'ta ping jie chu se de biao xian huo de le jiang xue jin' },
            { content: '会议的目的在于加强各国合作', answer: 'hui yi de mu di zai yu jia qiang ge guo he zuo' },
            { content: '这次事件引起了公众的广泛关注', answer: 'zhe ci shi jian yin qi le gong zhong de guang fan guan zhu' },
            { content: '专家们对实验结果展开了激烈讨论', answer: 'zhuan jia men dui shi yan jie guo zhan kai le ji lie tao lun' },
            { content: '他成功地解决了复杂的技术问题', answer: 'ta cheng gong de jie jue le fu za de ji shu wen ti' },
            { content: '未来的发展方向尚未确定', answer: 'wei lai de fa zhan fang xiang shang wei que ding' },
            { content: '为了节省时间我们决定乘坐高速铁路', answer: 'wei le jie sheng shi jian wo men jue ding cheng zuo gao su tie lu' },
            { content: '这项政策的实施需要大量资金支持', answer: 'zhe xiang zheng ce de shi shi xu yao da liang zi jin zhi chi' },
            { content: '随着城市化进程加快传统文化受到冲击', answer: 'sui zhe cheng shi hua jin cheng jia kuai chuan tong wen hua shou dao chong ji' },
            { content: '他对未来科技的发展充满期待', answer: 'ta dui wei lai ke ji de fa zhan chong man qi dai' },
            { content: '许多观众被演员精湛的演技打动', answer: 'xu duo guan zhong bei yan yuan jing zan de yan ji da dong' },
            { content: '我们正在探索新的商业模式', answer: 'wo men zheng zai tan suo xin de shang ye mo shi' },
            { content: '该项目的成功取决于团队的合作', answer: 'gai xiang mu de cheng gong qu jue yu tuan dui de he zuo' },
          ],
        },
      ],
    },
    {
      name: 'Russian',
      units: [
        {
          name: 'Greetings',
          prompts: [
            { content: 'Привет', answer: 'privet' },
            { content: 'Здравствуйте', answer: 'zdravstvuyte' },
            { content: 'Спасибо', answer: 'spasibo' },
            { content: 'Пожалуйста', answer: 'pozhaluysta' },
            { content: 'До свидания', answer: 'do svidaniya' },
            { content: 'Извините', answer: 'izvinite' },
            { content: 'Хорошо', answer: 'khorosho' },
            { content: 'Плохо', answer: 'plokho' },
            { content: 'Да', answer: 'da' },
            { content: 'Нет', answer: 'net' },
          ],
        },
        {
          name: 'Numbers 1-10',
          prompts: [
            { content: 'один', answer: 'odin' },
            { content: 'два', answer: 'dva' },
            { content: 'три', answer: 'tri' },
            { content: 'четыре', answer: 'chetyre' },
            { content: 'пять', answer: 'pyat' },
            { content: 'шесть', answer: 'shest' },
            { content: 'семь', answer: 'sem' },
            { content: 'восемь', answer: 'vosem' },
            { content: 'девять', answer: 'devyat' },
            { content: 'десять', answer: 'desyat' },
          ],
        },
        {
          name: 'Food & Drink',
          prompts: [
            { content: 'вода', answer: 'voda' },
            { content: 'чай', answer: 'chai' },
            { content: 'кофе', answer: 'kofe' },
            { content: 'рис', answer: 'ris' },
            { content: 'лапша', answer: 'lapsha' },
            { content: 'хлеб', answer: 'khleb' },
            { content: 'молоко', answer: 'moloko' },
            { content: 'сок', answer: 'sok' },
            { content: 'пиво', answer: 'pivo' },
            { content: 'вино', answer: 'vino' },
            { content: 'яблоко', answer: 'yabloko' },
            { content: 'мясо', answer: 'myaso' },
          ],
        },
        {
          name: 'Common Verbs',
          prompts: [
            { content: 'идти', answer: 'idti' },
            { content: 'делать', answer: 'delat' },
            { content: 'хотеть', answer: 'khotet' },
            { content: 'знать', answer: 'znat' },
            { content: 'понимать', answer: 'ponimat' },
            { content: 'говорить', answer: 'govorit' },
            { content: 'читать', answer: 'chitat' },
            { content: 'писать', answer: 'pisat' },
            { content: 'есть', answer: 'yest' },
            { content: 'пить', answer: 'pit' },
            { content: 'работать', answer: 'rabotat' },
            { content: 'жить', answer: 'zhit' },
          ],
        },
        {
          name: 'Family',
          prompts: [
            { content: 'мама', answer: 'mama' },
            { content: 'папа', answer: 'papa' },
            { content: 'брат', answer: 'brat' },
            { content: 'сестра', answer: 'sestra' },
            { content: 'сын', answer: 'syn' },
            { content: 'дочь', answer: 'doch' },
            { content: 'семья', answer: 'semya' },
            { content: 'друг', answer: 'drug' },
            { content: 'подруга', answer: 'podruga' },
            { content: 'муж', answer: 'muzh' },
            { content: 'жена', answer: 'zhena' },
            { content: 'родители', answer: 'roditeli' },
          ],
        },
        {
          name: 'Days & Time',
          prompts: [
            { content: 'понедельник', answer: 'ponedelnik' },
            { content: 'вторник', answer: 'vtornik' },
            { content: 'среда', answer: 'sreda' },
            { content: 'четверг', answer: 'chetverg' },
            { content: 'пятница', answer: 'pyatnitsa' },
            { content: 'суббота', answer: 'subbota' },
            { content: 'воскресенье', answer: 'voskresene' },
            { content: 'сегодня', answer: 'segodnya' },
            { content: 'завтра', answer: 'zavtra' },
            { content: 'вчера', answer: 'vchera' },
          ],
        },
        {
          name: 'Places',
          prompts: [
            { content: 'школа', answer: 'shkola' },
            { content: 'дом', answer: 'dom' },
            { content: 'магазин', answer: 'magazin' },
            { content: 'больница', answer: 'bolnitsa' },
            { content: 'станция', answer: 'stantsiya' },
            { content: 'парк', answer: 'park' },
            { content: 'компания', answer: 'kompaniya' },
            { content: 'банк', answer: 'bank' },
            { content: 'библиотека', answer: 'biblioteka' },
            { content: 'аэропорт', answer: 'aeroport' },
            { content: 'рынок', answer: 'rynok' },
            { content: 'ресторан', answer: 'restoran' },
          ],
        },
      ],
    },
  ];

  // Idempotent upsert by names (no unique constraints required)
  for (const l of langs) {
    let lang = await prisma.lang.findFirst({ where: { name: l.name } });
    if (!lang) {
      lang = await prisma.lang.create({ data: { name: l.name } });
    }
    for (const u of l.units) {
      let unit = await prisma.unit.findFirst({ where: { name: u.name, langId: lang.id } });
      if (!unit) {
        unit = await prisma.unit.create({ data: { name: u.name, langId: lang.id } });
      }
      for (const p of u.prompts) {
        const existing = await prisma.prompt.findFirst({ where: { unitId: unit.id, content: p.content } });
        if (!existing) {
          await prisma.prompt.create({ data: { content: p.content, answer: p.answer, unitId: unit.id } });
        } else if (existing.answer !== p.answer) {
          await prisma.prompt.update({ where: { id: existing.id }, data: { answer: p.answer } });
        }
      }
    }
  }

  const langCount = await prisma.lang.count();
  const unitCount = await prisma.unit.count();
  const promptCount = await prisma.prompt.count();
  console.log(`Seeded: ${langCount} langs, ${unitCount} units, ${promptCount} prompts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
