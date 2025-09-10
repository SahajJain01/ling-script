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
