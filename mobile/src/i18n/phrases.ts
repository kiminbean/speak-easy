/**
 * SpeakEasy - Phrase Translations
 * Context-aware phrases for different locations, times, and situations
 * 20 languages supported
 */

import { SupportedLanguage } from '../types';

// Quick response phrases
export const QUICK_RESPONSE_TRANSLATIONS: Record<SupportedLanguage, string[]> = {
  en: ['Yes', 'No', 'Maybe', "I don't know", 'Please', 'Thank you', 'Sorry', "You're welcome"],
  ko: ['네', '아니요', '아마도', '모르겠어요', '제발', '감사해요', '미안해요', '천만에요'],
  ja: ['はい', 'いいえ', 'たぶん', '分からない', 'お願い', 'ありがとう', 'ごめんなさい', 'どういたしまして'],
  es: ['Sí', 'No', 'Quizás', 'No sé', 'Por favor', 'Gracias', 'Lo siento', 'De nada'],
  ru: ['Да', 'Нет', 'Может быть', 'Не знаю', 'Пожалуйста', 'Спасибо', 'Извините', 'Пожалуйста'],
  id: ['Ya', 'Tidak', 'Mungkin', 'Tidak tahu', 'Tolong', 'Terima kasih', 'Maaf', 'Sama-sama'],
  pt: ['Sim', 'Não', 'Talvez', 'Não sei', 'Por favor', 'Obrigado', 'Desculpe', 'De nada'],
  fr: ['Oui', 'Non', 'Peut-être', 'Je ne sais pas', "S'il vous plaît", 'Merci', 'Pardon', 'De rien'],
  de: ['Ja', 'Nein', 'Vielleicht', 'Ich weiß nicht', 'Bitte', 'Danke', 'Entschuldigung', 'Gern geschehen'],
  bn: ['হ্যাঁ', 'না', 'হয়তো', 'জানি না', 'দয়া করে', 'ধন্যবাদ', 'দুঃখিত', 'স্বাগতম'],
  ar: ['نعم', 'لا', 'ربما', 'لا أعرف', 'من فضلك', 'شكراً', 'آسف', 'عفواً'],
  ur: ['ہاں', 'نہیں', 'شاید', 'نہیں معلوم', 'براہ کرم', 'شکریہ', 'معذرت', 'خوش آمدید'],
  hi: ['हाँ', 'नहीं', 'शायद', 'पता नहीं', 'कृपया', 'धन्यवाद', 'माफ़ी', 'आपका स्वागत है'],
  it: ['Sì', 'No', 'Forse', 'Non lo so', 'Per favore', 'Grazie', 'Scusa', 'Prego'],
  pl: ['Tak', 'Nie', 'Może', 'Nie wiem', 'Proszę', 'Dziękuję', 'Przepraszam', 'Proszę bardzo'],
  uk: ['Так', 'Ні', 'Можливо', 'Не знаю', 'Будь ласка', 'Дякую', 'Вибачте', 'Будь ласка'],
  ro: ['Da', 'Nu', 'Poate', 'Nu știu', 'Vă rog', 'Mulțumesc', 'Scuze', 'Cu plăcere'],
  nl: ['Ja', 'Nee', 'Misschien', 'Weet ik niet', 'Alsjeblieft', 'Dank je', 'Sorry', 'Graag gedaan'],
  vi: ['Vâng', 'Không', 'Có lẽ', 'Tôi không biết', 'Xin vui lòng', 'Cảm ơn', 'Xin lỗi', 'Không có gì'],
  tr: ['Evet', 'Hayır', 'Belki', 'Bilmiyorum', 'Lütfen', 'Teşekkürler', 'Özür dilerim', 'Rica ederim'],
};

// Emergency phrases
export const EMERGENCY_TRANSLATIONS: Record<SupportedLanguage, string[]> = {
  en: ['Help me!', 'I need help now!', 'Call my parent', "I don't feel safe", 'Something is wrong', 'Emergency!', "I'm in danger", 'Please help'],
  ko: ['도와주세요!', '지금 도움이 필요해요!', '부모님께 전화해주세요', '불안해요', '뭔가 이상해요', '긴급상황!', '위험해요', '제발 도와주세요'],
  ja: ['助けて!', '今すぐ助けが必要!', '親に電話して', '安全じゃない', '何かおかしい', '緊急!', '危険です', '助けてください'],
  es: ['¡Ayúdame!', '¡Necesito ayuda ahora!', 'Llama a mis padres', 'No me siento seguro', 'Algo está mal', '¡Emergencia!', 'Estoy en peligro', 'Por favor ayuda'],
  ru: ['Помогите!', 'Мне нужна помощь!', 'Позвоните родителям', 'Мне небезопасно', 'Что-то не так', 'Экстренно!', 'Я в опасности', 'Пожалуйста, помогите'],
  id: ['Tolong!', 'Saya butuh bantuan!', 'Hubungi orang tua saya', 'Saya tidak aman', 'Ada yang salah', 'Darurat!', 'Saya dalam bahaya', 'Tolong bantu'],
  pt: ['Me ajude!', 'Preciso de ajuda agora!', 'Ligue para meus pais', 'Não me sinto seguro', 'Algo está errado', 'Emergência!', 'Estou em perigo', 'Por favor, ajude'],
  fr: ['Aidez-moi!', "J'ai besoin d'aide!", 'Appelez mes parents', 'Je ne me sens pas en sécurité', 'Quelque chose ne va pas', 'Urgence!', 'Je suis en danger', "S'il vous plaît aidez"],
  de: ['Hilf mir!', 'Ich brauche jetzt Hilfe!', 'Ruf meine Eltern an', 'Ich fühle mich nicht sicher', 'Etwas stimmt nicht', 'Notfall!', 'Ich bin in Gefahr', 'Bitte hilf'],
  bn: ['সাহায্য করুন!', 'আমার এখন সাহায্য দরকার!', 'আমার বাবা-মাকে ফোন করুন', 'আমি নিরাপদ নই', 'কিছু ভুল হয়েছে', 'জরুরি!', 'আমি বিপদে আছি', 'দয়া করে সাহায্য করুন'],
  ar: ['ساعدني!', 'أحتاج مساعدة الآن!', 'اتصل بوالدي', 'لا أشعر بالأمان', 'هناك خطأ ما', 'طوارئ!', 'أنا في خطر', 'من فضلك ساعدني'],
  ur: ['مدد کریں!', 'مجھے ابھی مدد چاہیے!', 'میرے والدین کو فون کریں', 'میں محفوظ نہیں ہوں', 'کچھ غلط ہے', 'ایمرجنسی!', 'میں خطرے میں ہوں', 'براہ کرم مدد کریں'],
  hi: ['मदद करो!', 'मुझे अभी मदद चाहिए!', 'मेरे माता-पिता को फोन करो', 'मैं सुरक्षित नहीं हूं', 'कुछ गलत है', 'आपातकाल!', 'मैं खतरे में हूं', 'कृपया मदद करें'],
  it: ['Aiutatemi!', 'Ho bisogno di aiuto ora!', 'Chiamate i miei genitori', 'Non mi sento al sicuro', 'Qualcosa non va', 'Emergenza!', 'Sono in pericolo', 'Per favore aiutatemi'],
  pl: ['Pomóżcie!', 'Potrzebuję pomocy teraz!', 'Zadzwoń do rodziców', 'Nie czuję się bezpiecznie', 'Coś jest nie tak', 'Nagły wypadek!', 'Jestem w niebezpieczeństwie', 'Proszę, pomóżcie'],
  uk: ['Допоможіть!', 'Мені потрібна допомога!', 'Зателефонуйте батькам', 'Мені небезпечно', 'Щось не так', 'Екстрено!', 'Я в небезпеці', 'Будь ласка, допоможіть'],
  ro: ['Ajutor!', 'Am nevoie de ajutor acum!', 'Sunați-mi părinții', 'Nu mă simt în siguranță', 'Ceva este în neregulă', 'Urgență!', 'Sunt în pericol', 'Vă rog ajutați-mă'],
  nl: ['Help me!', 'Ik heb nu hulp nodig!', 'Bel mijn ouders', 'Ik voel me niet veilig', 'Er is iets mis', 'Noodgeval!', 'Ik ben in gevaar', 'Help alsjeblieft'],
  vi: ['Giúp tôi!', 'Tôi cần giúp đỡ ngay!', 'Gọi cho bố mẹ tôi', 'Tôi không an toàn', 'Có gì đó không ổn', 'Khẩn cấp!', 'Tôi đang gặp nguy hiểm', 'Xin hãy giúp'],
  tr: ['Yardım edin!', 'Şimdi yardıma ihtiyacım var!', 'Ailemi arayın', 'Güvende değilim', 'Bir şeyler yanlış', 'Acil durum!', 'Tehlikedeyim', 'Lütfen yardım edin'],
};

// Coping phrases by emotion
export const COPING_PHRASE_TRANSLATIONS: Record<SupportedLanguage, Record<string, string[]>> = {
  en: {
    happy: ["I'm happy!", 'This is fun!', 'I love this!', 'Thank you!', "I'm having a great time!"],
    sad: ['I feel sad', 'I need a hug', 'Can we talk?', 'I miss someone', 'I need comfort'],
    anxious: ['I feel worried', 'Can you stay with me?', 'I need comfort', "Tell me it's okay", 'I need a quiet place'],
    frustrated: ['I need a break', 'This is hard for me', 'Can you help me?', "I'm trying my best", 'Let me try again'],
    scared: ["I'm scared", "I don't feel safe", 'Stay with me please', 'I need help', 'Something is wrong'],
    calm: ["I'm okay", 'I feel good', 'Everything is fine', "I'm ready", 'I feel peaceful'],
    excited: ["I'm so excited!", "I can't wait!", 'This is amazing!', "Let's go!", "I'm ready!"],
    tired: ["I'm tired", 'I need rest', 'Can I take a nap?', "I'm sleepy", 'I need a break'],
  },
  ko: {
    happy: ['행복해요!', '재미있어요!', '좋아요!', '감사해요!', '즐거워요!'],
    sad: ['슬퍼요', '안아주세요', '얘기하고 싶어요', '보고 싶어요', '위로해주세요'],
    anxious: ['걱정돼요', '같이 있어주세요', '위로해주세요', '괜찮다고 말해주세요', '조용한 곳이 필요해요'],
    frustrated: ['쉬고 싶어요', '이거 어려워요', '도와주세요', '노력하고 있어요', '다시 해볼게요'],
    scared: ['무서워요', '불안해요', '같이 있어주세요', '도와주세요', '뭔가 이상해요'],
    calm: ['괜찮아요', '기분 좋아요', '다 괜찮아요', '준비됐어요', '평화로워요'],
    excited: ['너무 신나요!', '기다릴 수 없어요!', '대단해요!', '가요!', '준비됐어요!'],
    tired: ['피곤해요', '쉬고 싶어요', '낮잠 자도 될까요?', '졸려요', '휴식이 필요해요'],
  },
  ja: {
    happy: ['幸せです!', '楽しい!', '大好き!', 'ありがとう!', '楽しんでます!'],
    sad: ['悲しい', 'ハグしてほしい', '話したい', '寂しい', '慰めてほしい'],
    anxious: ['心配です', 'そばにいて', '慰めてほしい', '大丈夫だと言って', '静かな場所が必要'],
    frustrated: ['休憩が必要', 'これは難しい', '助けて', '頑張ってる', 'もう一度やらせて'],
    scared: ['怖い', '安全じゃない', 'そばにいて', '助けが必要', '何かおかしい'],
    calm: ['大丈夫', '気分がいい', '全部大丈夫', '準備OK', '穏やかです'],
    excited: ['わくわく!', '待てない!', 'すごい!', '行こう!', '準備OK!'],
    tired: ['疲れた', '休みたい', '昼寝していい?', '眠い', '休憩が必要'],
  },
  es: {
    happy: ['¡Estoy feliz!', '¡Es divertido!', '¡Me encanta!', '¡Gracias!', '¡Lo paso genial!'],
    sad: ['Estoy triste', 'Necesito un abrazo', '¿Podemos hablar?', 'Echo de menos a alguien', 'Necesito consuelo'],
    anxious: ['Estoy preocupado', '¿Puedes quedarte conmigo?', 'Necesito consuelo', 'Dime que está bien', 'Necesito un lugar tranquilo'],
    frustrated: ['Necesito un descanso', 'Esto es difícil', '¿Puedes ayudarme?', 'Hago lo mejor que puedo', 'Déjame intentar de nuevo'],
    scared: ['Tengo miedo', 'No me siento seguro', 'Quédate conmigo', 'Necesito ayuda', 'Algo está mal'],
    calm: ['Estoy bien', 'Me siento bien', 'Todo está bien', 'Estoy listo', 'Me siento en paz'],
    excited: ['¡Estoy muy emocionado!', '¡No puedo esperar!', '¡Es increíble!', '¡Vamos!', '¡Estoy listo!'],
    tired: ['Estoy cansado', 'Necesito descansar', '¿Puedo dormir?', 'Tengo sueño', 'Necesito un descanso'],
  },
  ru: { happy: ['Я счастлив!'], sad: ['Мне грустно'], anxious: ['Я волнуюсь'], frustrated: ['Мне нужен перерыв'], scared: ['Мне страшно'], calm: ['Я в порядке'], excited: ['Я так взволнован!'], tired: ['Я устал'] },
  id: { happy: ['Saya senang!'], sad: ['Saya sedih'], anxious: ['Saya khawatir'], frustrated: ['Saya butuh istirahat'], scared: ['Saya takut'], calm: ['Saya baik-baik saja'], excited: ['Saya sangat bersemangat!'], tired: ['Saya lelah'] },
  pt: { happy: ['Estou feliz!'], sad: ['Estou triste'], anxious: ['Estou preocupado'], frustrated: ['Preciso de uma pausa'], scared: ['Estou com medo'], calm: ['Estou bem'], excited: ['Estou muito animado!'], tired: ['Estou cansado'] },
  fr: { happy: ['Je suis content!'], sad: ['Je suis triste'], anxious: ["Je m'inquiète"], frustrated: ["J'ai besoin d'une pause"], scared: ["J'ai peur"], calm: ['Je vais bien'], excited: ['Je suis tellement excité!'], tired: ['Je suis fatigué'] },
  de: { happy: ['Ich bin glücklich!'], sad: ['Ich bin traurig'], anxious: ['Ich mache mir Sorgen'], frustrated: ['Ich brauche eine Pause'], scared: ['Ich habe Angst'], calm: ['Mir geht es gut'], excited: ['Ich bin so aufgeregt!'], tired: ['Ich bin müde'] },
  bn: { happy: ['আমি খুশি!'], sad: ['আমি দুঃখিত'], anxious: ['আমি চিন্তিত'], frustrated: ['আমার বিরতি দরকার'], scared: ['আমি ভয় পাচ্ছি'], calm: ['আমি ঠিক আছি'], excited: ['আমি খুব উত্তেজিত!'], tired: ['আমি ক্লান্ত'] },
  ar: { happy: ['أنا سعيد!'], sad: ['أنا حزين'], anxious: ['أنا قلق'], frustrated: ['أحتاج استراحة'], scared: ['أنا خائف'], calm: ['أنا بخير'], excited: ['أنا متحمس جداً!'], tired: ['أنا متعب'] },
  ur: { happy: ['میں خوش ہوں!'], sad: ['میں دکھی ہوں'], anxious: ['میں فکرمند ہوں'], frustrated: ['مجھے آرام چاہیے'], scared: ['میں ڈرا ہوا ہوں'], calm: ['میں ٹھیک ہوں'], excited: ['میں بہت پرجوش ہوں!'], tired: ['میں تھکا ہوا ہوں'] },
  hi: { happy: ['मैं खुश हूं!'], sad: ['मैं दुखी हूं'], anxious: ['मुझे चिंता है'], frustrated: ['मुझे ब्रेक चाहिए'], scared: ['मुझे डर लग रहा है'], calm: ['मैं ठीक हूं'], excited: ['मैं बहुत उत्साहित हूं!'], tired: ['मैं थका हुआ हूं'] },
  it: { happy: ['Sono felice!'], sad: ['Sono triste'], anxious: ['Sono preoccupato'], frustrated: ['Ho bisogno di una pausa'], scared: ['Ho paura'], calm: ['Sto bene'], excited: ['Sono così emozionato!'], tired: ['Sono stanco'] },
  pl: { happy: ['Jestem szczęśliwy!'], sad: ['Jestem smutny'], anxious: ['Martwię się'], frustrated: ['Potrzebuję przerwy'], scared: ['Boję się'], calm: ['Wszystko w porządku'], excited: ['Jestem bardzo podekscytowany!'], tired: ['Jestem zmęczony'] },
  uk: { happy: ['Я щасливий!'], sad: ['Мені сумно'], anxious: ['Я хвилююсь'], frustrated: ['Мені потрібна перерва'], scared: ['Мені страшно'], calm: ['Я в порядку'], excited: ['Я такий схвильований!'], tired: ['Я втомився'] },
  ro: { happy: ['Sunt fericit!'], sad: ['Sunt trist'], anxious: ['Sunt îngrijorat'], frustrated: ['Am nevoie de o pauză'], scared: ['Mi-e frică'], calm: ['Sunt bine'], excited: ['Sunt atât de entuziasmat!'], tired: ['Sunt obosit'] },
  nl: { happy: ['Ik ben blij!'], sad: ['Ik ben verdrietig'], anxious: ['Ik maak me zorgen'], frustrated: ['Ik heb een pauze nodig'], scared: ['Ik ben bang'], calm: ['Het gaat goed'], excited: ['Ik ben zo opgewonden!'], tired: ['Ik ben moe'] },
  vi: { happy: ['Tôi vui!'], sad: ['Tôi buồn'], anxious: ['Tôi lo lắng'], frustrated: ['Tôi cần nghỉ ngơi'], scared: ['Tôi sợ'], calm: ['Tôi ổn'], excited: ['Tôi rất phấn khích!'], tired: ['Tôi mệt'] },
  tr: { happy: ['Mutluyum!'], sad: ['Üzgünüm'], anxious: ['Endişeliyim'], frustrated: ['Bir molaya ihtiyacım var'], scared: ['Korkuyorum'], calm: ['İyiyim'], excited: ['Çok heyecanlıyım!'], tired: ['Yorgunum'] },
};

// Enhanced location-based phrases with detailed context
type LocationPhrases = Record<string, Record<string, string[]>>;
export const LOCATION_PHRASE_TRANSLATIONS: Record<SupportedLanguage, LocationPhrases> = {
  en: {
    home: {
      morning: [
        'Good morning!', "I'm hungry", 'I want breakfast', 'Can I have cereal?',
        'I need to use the bathroom', "I'm thirsty", 'Can I watch cartoons?',
        'I want to play', 'Where is mom/dad?', 'I want juice'
      ],
      afternoon: [
        "I'm thirsty", 'Can I have a snack?', 'I want to play games',
        'Can we go outside?', "I'm bored", 'I need help', 'I want a drink',
        'Can I watch TV?', "I'm tired", 'I want to draw'
      ],
      evening: [
        "What's for dinner?", "I'm hungry", 'Can I help cook?',
        'I want to play before bed', 'Can we read a story?', "I'm thirsty",
        'I want dessert', 'Can I have a bath?', 'I want to talk', "I'm tired"
      ],
      night: [
        "I'm sleepy", 'Good night!', 'I need water', "I can't sleep",
        'Stay with me please', 'I had a bad dream', 'Can you read to me?',
        "I'm scared", 'I need to go to the bathroom', 'I want a hug'
      ],
    },
    school: {
      morning: [
        'Good morning teacher!', 'I need help', 'Can I go to the bathroom?',
        "I don't understand", 'Can you repeat that?', 'I have a question',
        "I'm ready to learn", 'Present!', 'I forgot my homework', 'Can I sit here?'
      ],
      afternoon: [
        "I'm hungry", 'When is lunch?', 'Can I have a break?', 'I finished my work',
        'I need help with this', 'Can I get water?', "I'm tired",
        'Can I work with a friend?', 'I need more time', "I don't feel well"
      ],
      evening: [
        'Is school over?', "I'm tired", 'When can I go home?',
        'Thank you teacher', 'See you tomorrow!', 'I had fun today',
        "Where's my backpack?", 'I need to pack up', 'Goodbye everyone!', 'Have a good night!'
      ],
      night: [
        'Good night', 'See you tomorrow', 'Thank you for teaching me',
        'I learned a lot today', "I'm going home now", 'Goodbye!',
        'Have a nice evening', 'Take care!', 'See you!', 'Bye bye!'
      ],
    },
    hospital: {
      morning: [
        'Good morning doctor', 'I feel sick', 'It hurts here', 'I need medicine',
        "I'm scared", 'Can I see my family?', 'When is breakfast?',
        "I didn't sleep well", 'I need to use the bathroom', 'Can I have water?'
      ],
      afternoon: [
        'I need my medicine', 'Am I getting better?', 'Can I go home soon?',
        "I'm thirsty", 'It still hurts', 'I need to rest', 'When is the doctor coming?',
        'Can I walk around?', "I'm bored", 'Can someone visit me?'
      ],
      evening: [
        'When can I leave?', 'I want to see my family', "I'm tired",
        'It hurts', 'I need help', "I'm feeling a bit better",
        "What's for dinner?", 'Can I watch TV?', 'I miss home', 'When is bedtime?'
      ],
      night: [
        "I can't sleep", 'I need help', "I'm in pain", 'I want my mom/dad',
        "I'm scared", 'Can someone stay with me?', 'I need water',
        'The bed is uncomfortable', 'I had a bad dream', "I'm cold/hot"
      ],
    },
    outdoor: {
      morning: [
        "It's nice outside!", 'I want to play!', "Let's go explore!",
        'I need sunscreen', 'Can we go to the park?', 'Look at that!',
        "I'm excited!", 'Can I run around?', 'I want to swing', 'Push me on the swing!'
      ],
      afternoon: [
        "I'm tired", "I'm hungry", "I'm thirsty", 'Can we rest in the shade?',
        "It's too hot", 'I need water', 'Can we go home soon?',
        'I want ice cream', "I'm having fun!", 'Can we stay longer?'
      ],
      evening: [
        "It's getting dark", 'Can we go home?', "I'm cold",
        "I'm tired", 'That was fun!', 'I want to come back',
        'Look at the sunset!', "I'm hungry", 'Thank you for today', 'I had a great time!'
      ],
      night: [
        'Look at the stars!', "I'm cold", 'Can we go inside?',
        "I'm tired", "It's dark", 'I want to go home',
        'Where are we going?', 'Hold my hand', "I'm sleepy", 'Carry me please'
      ],
    },
    restaurant: {
      morning: [
        "I'm hungry", 'Can I see the menu?', 'I want pancakes',
        'I want eggs', 'Orange juice please', 'This looks good!',
        'Can I have more?', "Where's the bathroom?", 'Thank you!', "I'm thirsty"
      ],
      afternoon: [
        "I'm hungry", 'I want this one', 'Can I have a kids meal?',
        'More water please', 'This is delicious!', "I'm full",
        'Can I have dessert?', 'I need napkins', 'Can we get the check?', 'Thank you!'
      ],
      evening: [
        "I'm hungry", 'What do you recommend?', 'I want to try something new',
        'Can I have dessert?', 'This is yummy!', 'Thank you for dinner!',
        "I'm full", 'Can we go home now?', "That was great!", "I'm tired"
      ],
      night: [
        "I'm tired", 'Can we go home?', 'Thank you', "I'm full",
        'That was nice', "I'm sleepy", 'I had a good time',
        'Goodbye!', 'See you next time!', 'Thank you for the meal!'
      ],
    },
    unknown: {
      morning: [
        'Good morning', 'Hello', 'I need help', "I'm okay", 'Thank you',
        'Where am I?', 'Can you help me?', "I'm looking for someone",
        "I'm lost", 'Can I use the phone?'
      ],
      afternoon: [
        'Hello', 'I need help', "I'm okay", 'Thank you', "I'm lost",
        'Can you help me?', 'Where is this place?', 'I need directions',
        "I'm looking for my family", 'Can someone help me?'
      ],
      evening: [
        'Hello', 'Good evening', 'I need help', "I'm okay",
        'Thank you', 'I want to go home', 'Can you call someone for me?',
        "I don't know where I am", "I'm tired", 'Please help me'
      ],
      night: [
        'Hello', 'I need help', "I'm okay", 'Thank you',
        'I want to go home', "I'm scared", "It's dark",
        'Can someone help me?', 'Please call my family', "I'm tired"
      ],
    },
  },
  ko: {
    home: {
      morning: [
        '좋은 아침이에요!', '배고파요', '아침밥 먹고 싶어요', '시리얼 먹어도 돼요?',
        '화장실 가고 싶어요', '목말라요', '만화 봐도 돼요?',
        '놀고 싶어요', '엄마/아빠 어디 있어요?', '주스 마시고 싶어요'
      ],
      afternoon: [
        '목말라요', '간식 먹어도 돼요?', '게임하고 싶어요',
        '밖에 나가도 돼요?', '심심해요', '도와주세요', '음료수 마시고 싶어요',
        'TV 봐도 돼요?', '피곤해요', '그림 그리고 싶어요'
      ],
      evening: [
        '저녁 뭐예요?', '배고파요', '요리 도와줄까요?',
        '자기 전에 놀고 싶어요', '동화책 읽어주세요', '목말라요',
        '디저트 먹고 싶어요', '목욕해도 돼요?', '얘기하고 싶어요', '피곤해요'
      ],
      night: [
        '졸려요', '잘 자요!', '물 주세요', '잠이 안 와요',
        '같이 있어주세요', '무서운 꿈 꿨어요', '책 읽어주세요',
        '무서워요', '화장실 가고 싶어요', '안아주세요'
      ],
    },
    school: {
      morning: [
        '선생님 안녕하세요!', '도와주세요', '화장실 가도 돼요?',
        '이해가 안 돼요', '다시 말해주세요', '질문이 있어요',
        '배울 준비 됐어요', '네, 왔어요!', '숙제를 깜빡했어요', '여기 앉아도 돼요?'
      ],
      afternoon: [
        '배고파요', '점심 언제예요?', '쉬어도 돼요?', '다 했어요',
        '이거 도와주세요', '물 마셔도 돼요?', '피곤해요',
        '친구랑 같이 해도 돼요?', '시간이 더 필요해요', '몸이 안 좋아요'
      ],
      evening: [
        '학교 끝났어요?', '피곤해요', '언제 집에 가요?',
        '선생님 감사해요', '내일 봐요!', '오늘 재미있었어요',
        '가방 어디 있어요?', '정리해야 해요', '안녕히 가세요!', '좋은 저녁 되세요!'
      ],
      night: [
        '잘 자요', '내일 봐요', '가르쳐 주셔서 감사해요',
        '오늘 많이 배웠어요', '이제 집에 가요', '안녕!',
        '좋은 저녁 되세요', '잘 가세요!', '또 봐요!', '안녕히 가세요!'
      ],
    },
    hospital: {
      morning: [
        '의사 선생님 안녕하세요', '아파요', '여기가 아파요', '약 주세요',
        '무서워요', '가족 보고 싶어요', '아침밥 언제예요?',
        '잠을 잘 못 잤어요', '화장실 가고 싶어요', '물 마셔도 돼요?'
      ],
      afternoon: [
        '약 먹을 시간이에요', '좀 나아지고 있어요?', '언제 집에 가요?',
        '목말라요', '아직 아파요', '쉬고 싶어요', '의사 선생님 언제 와요?',
        '걸어 다녀도 돼요?', '심심해요', '누가 면회 올 수 있어요?'
      ],
      evening: [
        '언제 퇴원해요?', '가족 보고 싶어요', '피곤해요',
        '아파요', '도와주세요', '조금 나아졌어요',
        '저녁 뭐예요?', 'TV 봐도 돼요?', '집이 그리워요', '잘 시간 언제예요?'
      ],
      night: [
        '잠이 안 와요', '도와주세요', '아파요', '엄마/아빠 보고 싶어요',
        '무서워요', '같이 있어주세요', '물 주세요',
        '침대가 불편해요', '무서운 꿈 꿨어요', '추워요/더워요'
      ],
    },
    outdoor: {
      morning: [
        '날씨 좋다!', '놀고 싶어요!', '탐험하자!',
        '선크림 발라야 해요', '공원 가도 돼요?', '저것 봐요!',
        '신나요!', '뛰어도 돼요?', '그네 타고 싶어요', '그네 밀어주세요!'
      ],
      afternoon: [
        '피곤해요', '배고파요', '목말라요', '그늘에서 쉬어도 돼요?',
        '너무 더워요', '물 주세요', '곧 집에 가요?',
        '아이스크림 먹고 싶어요', '재미있어요!', '더 있어도 돼요?'
      ],
      evening: [
        '어두워지고 있어요', '집에 갈래요', '추워요',
        '피곤해요', '재미있었어요!', '다시 오고 싶어요',
        '노을 봐요!', '배고파요', '오늘 고마워요', '정말 즐거웠어요!'
      ],
      night: [
        '별 봐요!', '추워요', '안에 들어갈래요',
        '피곤해요', '어두워요', '집에 가고 싶어요',
        '어디로 가요?', '손 잡아주세요', '졸려요', '안아주세요'
      ],
    },
    restaurant: {
      morning: [
        '배고파요', '메뉴판 볼래요', '팬케이크 먹고 싶어요',
        '계란 먹고 싶어요', '오렌지 주스 주세요', '맛있어 보여요!',
        '더 먹어도 돼요?', '화장실 어디예요?', '감사해요!', '목말라요'
      ],
      afternoon: [
        '배고파요', '이거 주세요', '어린이 메뉴 있어요?',
        '물 더 주세요', '맛있어요!', '배불러요',
        '디저트 먹어도 돼요?', '냅킨 주세요', '계산해주세요', '감사합니다!'
      ],
      evening: [
        '배고파요', '뭐가 맛있어요?', '새로운 거 먹어보고 싶어요',
        '디저트 먹어도 돼요?', '맛있어요!', '저녁 감사해요!',
        '배불러요', '이제 집에 가요?', '정말 맛있었어요!', '피곤해요'
      ],
      night: [
        '피곤해요', '집에 가요', '감사해요', '배불러요',
        '좋았어요', '졸려요', '즐거웠어요',
        '안녕히 가세요!', '다음에 또 와요!', '맛있게 먹었습니다!'
      ],
    },
    unknown: {
      morning: [
        '좋은 아침이에요', '안녕하세요', '도와주세요', '괜찮아요', '감사해요',
        '여기가 어디예요?', '도와주실래요?', '누군가를 찾고 있어요',
        '길을 잃었어요', '전화 써도 돼요?'
      ],
      afternoon: [
        '안녕하세요', '도와주세요', '괜찮아요', '감사해요', '길을 잃었어요',
        '도와주실래요?', '여기가 어디예요?', '길 좀 알려주세요',
        '가족을 찾고 있어요', '누가 도와주세요'
      ],
      evening: [
        '안녕하세요', '좋은 저녁이에요', '도와주세요', '괜찮아요',
        '감사해요', '집에 가고 싶어요', '전화해주세요',
        '여기가 어딘지 모르겠어요', '피곤해요', '제발 도와주세요'
      ],
      night: [
        '안녕하세요', '도와주세요', '괜찮아요', '감사해요',
        '집에 가고 싶어요', '무서워요', '어두워요',
        '도와주세요', '가족한테 전화해주세요', '피곤해요'
      ],
    },
  },
  ja: {
    home: {
      morning: [
        'おはよう!', 'お腹すいた', '朝ごはん食べたい', 'シリアル食べていい?',
        'トイレに行きたい', '喉が渇いた', 'アニメ見ていい?',
        '遊びたい', 'ママ/パパどこ?', 'ジュース飲みたい'
      ],
      afternoon: [
        '喉が渇いた', 'おやつ食べていい?', 'ゲームしたい',
        '外に出ていい?', '暇だ', '助けて', '飲み物ほしい',
        'テレビ見ていい?', '疲れた', 'お絵描きしたい'
      ],
      evening: [
        '夕飯は何?', 'お腹すいた', '料理手伝う?',
        '寝る前に遊びたい', '絵本読んで', '喉が渇いた',
        'デザート食べたい', 'お風呂入っていい?', '話したい', '疲れた'
      ],
      night: [
        '眠い', 'おやすみ!', '水ください', '眠れない',
        'そばにいて', '怖い夢見た', '本読んで',
        '怖い', 'トイレ行きたい', 'ハグして'
      ],
    },
    school: {
      morning: [
        '先生おはようございます!', '助けて', 'トイレに行ってもいい?',
        '分からない', 'もう一度言って', '質問があります',
        '勉強する準備OK', 'はい!', '宿題忘れた', 'ここに座ってもいい?'
      ],
      afternoon: [
        'お腹すいた', 'お昼いつ?', '休憩してもいい?', '終わりました',
        'これ手伝って', '水飲んでもいい?', '疲れた',
        '友達と一緒にやってもいい?', 'もっと時間が必要', '気分が悪い'
      ],
      evening: [
        '学校終わり?', '疲れた', 'いつ帰れる?',
        '先生ありがとう', 'また明日!', '今日楽しかった',
        'カバンどこ?', '片付けなきゃ', 'さようなら!', 'よい夜を!'
      ],
      night: [
        'おやすみ', 'また明日', '教えてくれてありがとう',
        '今日たくさん学んだ', 'もう帰るね', 'バイバイ!',
        'よい夜を', '気をつけて!', 'また!', 'さようなら!'
      ],
    },
    hospital: {
      morning: [
        '先生おはようございます', '気分が悪い', 'ここが痛い', '薬ください',
        '怖い', '家族に会いたい', '朝ごはんいつ?',
        'よく眠れなかった', 'トイレに行きたい', '水飲んでいい?'
      ],
      afternoon: [
        '薬の時間', '良くなってる?', 'いつ帰れる?',
        '喉が渇いた', 'まだ痛い', '休みたい', '先生いつ来る?',
        '歩いてもいい?', '暇だ', '誰か来れる?'
      ],
      evening: [
        'いつ退院?', '家族に会いたい', '疲れた',
        '痛い', '助けて', '少し良くなった',
        '夕飯は何?', 'テレビ見ていい?', '家が恋しい', '寝る時間いつ?'
      ],
      night: [
        '眠れない', '助けて', '痛い', 'ママ/パパに会いたい',
        '怖い', 'そばにいて', '水ください',
        'ベッドが辛い', '怖い夢見た', '寒い/暑い'
      ],
    },
    outdoor: {
      morning: [
        'いい天気!', '遊びたい!', '探検しよう!',
        '日焼け止め塗らなきゃ', '公園行っていい?', 'あれ見て!',
        'わくわく!', '走ってもいい?', 'ブランコ乗りたい', '押して!'
      ],
      afternoon: [
        '疲れた', 'お腹すいた', '喉が渇いた', '日陰で休もう',
        '暑すぎる', '水ください', 'もうすぐ帰る?',
        'アイス食べたい', '楽しい!', 'もっといていい?'
      ],
      evening: [
        '暗くなってきた', '帰りたい', '寒い',
        '疲れた', '楽しかった!', 'また来たい',
        '夕日見て!', 'お腹すいた', '今日ありがとう', '最高だった!'
      ],
      night: [
        '星見て!', '寒い', '中に入りたい',
        '疲れた', '暗い', '帰りたい',
        'どこ行くの?', '手つないで', '眠い', '抱っこして'
      ],
    },
    restaurant: {
      morning: [
        'お腹すいた', 'メニュー見せて', 'パンケーキ食べたい',
        '卵食べたい', 'オレンジジュースください', '美味しそう!',
        'もっと食べていい?', 'トイレどこ?', 'ありがとう!', '喉が渇いた'
      ],
      afternoon: [
        'お腹すいた', 'これください', 'お子様メニューある?',
        '水もっとください', '美味しい!', 'お腹いっぱい',
        'デザート食べていい?', 'ナプキンください', 'お会計お願いします', 'ありがとう!'
      ],
      evening: [
        'お腹すいた', 'おすすめは?', '新しいの食べてみたい',
        'デザート食べていい?', '美味しい!', '夕飯ありがとう!',
        'お腹いっぱい', 'もう帰る?', '最高だった!', '疲れた'
      ],
      night: [
        '疲れた', '帰ろう', 'ありがとう', 'お腹いっぱい',
        '良かった', '眠い', '楽しかった',
        'バイバイ!', 'また来るね!', 'ごちそうさまでした!'
      ],
    },
    unknown: {
      morning: ['おはよう', 'こんにちは', '助けて', '大丈夫', 'ありがとう', 'ここどこ?', '助けてくれる?', '誰か探してる', '迷子です', '電話使っていい?'],
      afternoon: ['こんにちは', '助けて', '大丈夫', 'ありがとう', '迷子です', '助けてくれる?', 'ここどこ?', '道を教えて', '家族を探してる', '誰か助けて'],
      evening: ['こんにちは', 'こんばんは', '助けて', '大丈夫', 'ありがとう', '帰りたい', '電話して', 'ここがどこか分からない', '疲れた', '助けて'],
      night: ['こんにちは', '助けて', '大丈夫', 'ありがとう', '帰りたい', '怖い', '暗い', '誰か助けて', '家族に電話して', '疲れた'],
    },
  },
  // Other languages with basic phrases
  es: {
    home: { morning: ['Buenos días', 'Tengo hambre', 'Quiero desayunar'], afternoon: ['Tengo sed', 'Quiero jugar', 'Estoy aburrido'], evening: ['¿Qué hay de cena?', 'Quiero jugar', 'Tengo hambre'], night: ['Tengo sueño', 'Buenas noches', 'Necesito agua'] },
    school: { morning: ['Buenos días profesor', 'Necesito ayuda', '¿Puedo ir al baño?'], afternoon: ['Tengo hambre', 'Terminé', 'Necesito descanso'], evening: ['¿Puedo irme?', 'Estoy cansado', 'Gracias'], night: ['Buenas noches', 'Hasta mañana', 'Gracias'] },
    hospital: { morning: ['Buenos días doctor', 'Me siento mal', 'Me duele aquí'], afternoon: ['Necesito medicina', 'Me siento mejor', '¿Puedo irme?'], evening: ['¿Cuándo puedo irme?', 'Quiero ver a mi familia', 'Estoy cansado'], night: ['No puedo dormir', 'Necesito ayuda', 'Tengo miedo'] },
    outdoor: { morning: ['¡Hace buen tiempo!', 'Quiero jugar', 'Vamos a explorar'], afternoon: ['Estoy cansado', 'Tengo hambre', 'Tengo sed'], evening: ['Está oscureciendo', 'Vamos a casa', 'Tengo frío'], night: ['Mira las estrellas', 'Tengo frío', 'Quiero ir a casa'] },
    restaurant: { morning: ['Tengo hambre', 'Quiero ver el menú', 'Quiero pancakes'], afternoon: ['Tengo hambre', 'Quiero esto', 'Está delicioso'], evening: ['Tengo hambre', '¿Qué recomiendas?', 'Quiero postre'], night: ['Estoy cansado', 'Vamos a casa', 'Gracias'] },
    unknown: { morning: ['Buenos días', 'Hola', 'Necesito ayuda'], afternoon: ['Hola', 'Necesito ayuda', 'Estoy perdido'], evening: ['Hola', 'Buenas tardes', 'Quiero ir a casa'], night: ['Hola', 'Necesito ayuda', 'Tengo miedo'] },
  },
  ru: {
    home: { morning: ['Доброе утро', 'Я голоден', 'Хочу завтракать'], afternoon: ['Хочу пить', 'Можно поиграть?', 'Мне скучно'], evening: ['Что на ужин?', 'Хочу играть', 'Я голоден'], night: ['Хочу спать', 'Спокойной ночи', 'Нужна вода'] },
    school: { morning: ['Здравствуйте учитель', 'Нужна помощь', 'Можно в туалет?'], afternoon: ['Я голоден', 'Я закончил', 'Нужен отдых'], evening: ['Можно домой?', 'Я устал', 'Спасибо'], night: ['Спокойной ночи', 'До завтра', 'Спасибо'] },
    hospital: { morning: ['Здравствуйте доктор', 'Мне плохо', 'Болит здесь'], afternoon: ['Нужно лекарство', 'Мне лучше', 'Можно домой?'], evening: ['Когда домой?', 'Хочу к семье', 'Я устал'], night: ['Не могу спать', 'Нужна помощь', 'Мне страшно'] },
    outdoor: { morning: ['Хорошая погода!', 'Хочу играть', 'Пойдём исследовать'], afternoon: ['Я устал', 'Я голоден', 'Хочу пить'], evening: ['Темнеет', 'Пойдём домой', 'Мне холодно'], night: ['Смотри звёзды', 'Мне холодно', 'Хочу домой'] },
    restaurant: { morning: ['Я голоден', 'Покажите меню', 'Хочу блины'], afternoon: ['Я голоден', 'Хочу это', 'Вкусно'], evening: ['Я голоден', 'Что посоветуете?', 'Хочу десерт'], night: ['Я устал', 'Пойдём домой', 'Спасибо'] },
    unknown: { morning: ['Доброе утро', 'Привет', 'Нужна помощь'], afternoon: ['Привет', 'Нужна помощь', 'Я потерялся'], evening: ['Привет', 'Добрый вечер', 'Хочу домой'], night: ['Привет', 'Нужна помощь', 'Мне страшно'] },
  },
  id: { home: { morning: ['Selamat pagi', 'Saya lapar', 'Saya ingin sarapan'], afternoon: ['Saya haus', 'Boleh bermain?', 'Saya bosan'], evening: ['Makan malam apa?', 'Saya ingin bermain', 'Saya lapar'], night: ['Saya mengantuk', 'Selamat malam', 'Butuh air'] }, school: { morning: ['Selamat pagi guru'], afternoon: ['Saya lapar'], evening: ['Boleh pulang?'], night: ['Selamat malam'] }, hospital: { morning: ['Selamat pagi dokter'], afternoon: ['Butuh obat'], evening: ['Kapan pulang?'], night: ['Tidak bisa tidur'] }, outdoor: { morning: ['Cuacanya bagus!'], afternoon: ['Saya lelah'], evening: ['Sudah gelap'], night: ['Lihat bintangnya'] }, restaurant: { morning: ['Saya lapar'], afternoon: ['Saya ingin ini'], evening: ['Saya lapar'], night: ['Saya lelah'] }, unknown: { morning: ['Selamat pagi'], afternoon: ['Halo'], evening: ['Halo'], night: ['Halo'] } },
  pt: { home: { morning: ['Bom dia', 'Estou com fome', 'Quero café da manhã'], afternoon: ['Estou com sede', 'Posso brincar?', 'Estou entediado'], evening: ['O que tem para jantar?', 'Quero brincar', 'Estou com fome'], night: ['Estou com sono', 'Boa noite', 'Preciso de água'] }, school: { morning: ['Bom dia professor'], afternoon: ['Estou com fome'], evening: ['Posso ir?'], night: ['Boa noite'] }, hospital: { morning: ['Bom dia doutor'], afternoon: ['Preciso de remédio'], evening: ['Quando posso ir?'], night: ['Não consigo dormir'] }, outdoor: { morning: ['Tempo bom!'], afternoon: ['Estou cansado'], evening: ['Está escurecendo'], night: ['Olha as estrelas'] }, restaurant: { morning: ['Estou com fome'], afternoon: ['Quero isso'], evening: ['Estou com fome'], night: ['Estou cansado'] }, unknown: { morning: ['Bom dia'], afternoon: ['Olá'], evening: ['Olá'], night: ['Olá'] } },
  fr: { home: { morning: ['Bonjour', "J'ai faim", 'Je veux le petit-déjeuner'], afternoon: ["J'ai soif", 'Je peux jouer?', "Je m'ennuie"], evening: ["Qu'est-ce qu'on mange?", 'Je veux jouer', "J'ai faim"], night: ["J'ai sommeil", 'Bonne nuit', "J'ai besoin d'eau"] }, school: { morning: ['Bonjour professeur'], afternoon: ["J'ai faim"], evening: ['Je peux partir?'], night: ['Bonne nuit'] }, hospital: { morning: ['Bonjour docteur'], afternoon: ["J'ai besoin de médicament"], evening: ['Quand je peux partir?'], night: ['Je ne peux pas dormir'] }, outdoor: { morning: ['Beau temps!'], afternoon: ['Je suis fatigué'], evening: ['Il fait sombre'], night: ['Regarde les étoiles'] }, restaurant: { morning: ["J'ai faim"], afternoon: ['Je veux ça'], evening: ["J'ai faim"], night: ['Je suis fatigué'] }, unknown: { morning: ['Bonjour'], afternoon: ['Bonjour'], evening: ['Bonsoir'], night: ['Bonsoir'] } },
  de: { home: { morning: ['Guten Morgen', 'Ich habe Hunger', 'Ich will frühstücken'], afternoon: ['Ich habe Durst', 'Darf ich spielen?', 'Mir ist langweilig'], evening: ['Was gibt es zum Abendessen?', 'Ich will spielen', 'Ich habe Hunger'], night: ['Ich bin müde', 'Gute Nacht', 'Ich brauche Wasser'] }, school: { morning: ['Guten Morgen Lehrer'], afternoon: ['Ich habe Hunger'], evening: ['Darf ich gehen?'], night: ['Gute Nacht'] }, hospital: { morning: ['Guten Morgen Doktor'], afternoon: ['Ich brauche Medizin'], evening: ['Wann kann ich gehen?'], night: ['Ich kann nicht schlafen'] }, outdoor: { morning: ['Schönes Wetter!'], afternoon: ['Ich bin müde'], evening: ['Es wird dunkel'], night: ['Schau die Sterne'] }, restaurant: { morning: ['Ich habe Hunger'], afternoon: ['Ich will das'], evening: ['Ich habe Hunger'], night: ['Ich bin müde'] }, unknown: { morning: ['Guten Morgen'], afternoon: ['Hallo'], evening: ['Guten Abend'], night: ['Guten Abend'] } },
  bn: { home: { morning: ['সুপ্রভাত', 'আমি ক্ষুধার্ত', 'আমি সকালের নাস্তা চাই'], afternoon: ['আমি তৃষ্ণার্ত', 'খেলতে পারি?', 'বোরিং লাগছে'], evening: ['রাতের খাবার কী?', 'খেলতে চাই', 'আমি ক্ষুধার্ত'], night: ['ঘুম পাচ্ছে', 'শুভ রাত্রি', 'পানি দরকার'] }, school: { morning: ['শুভ সকাল স্যার'], afternoon: ['আমি ক্ষুধার্ত'], evening: ['যেতে পারি?'], night: ['শুভ রাত্রি'] }, hospital: { morning: ['শুভ সকাল ডাক্তার'], afternoon: ['ওষুধ দরকার'], evening: ['কখন যেতে পারব?'], night: ['ঘুম হচ্ছে না'] }, outdoor: { morning: ['সুন্দর আবহাওয়া!'], afternoon: ['ক্লান্ত লাগছে'], evening: ['অন্ধকার হচ্ছে'], night: ['তারা দেখো'] }, restaurant: { morning: ['আমি ক্ষুধার্ত'], afternoon: ['এটা চাই'], evening: ['আমি ক্ষুধার্ত'], night: ['ক্লান্ত লাগছে'] }, unknown: { morning: ['সুপ্রভাত'], afternoon: ['হ্যালো'], evening: ['শুভ সন্ধ্যা'], night: ['শুভ সন্ধ্যা'] } },
  ar: { home: { morning: ['صباح الخير', 'أنا جائع', 'أريد الفطور'], afternoon: ['أنا عطشان', 'هل يمكنني اللعب?', 'أنا ملل'], evening: ['ما هو العشاء?', 'أريد اللعب', 'أنا جائع'], night: ['أنا نعسان', 'تصبح على خير', 'أحتاج ماء'] }, school: { morning: ['صباح الخير أستاذ'], afternoon: ['أنا جائع'], evening: ['هل يمكنني الذهاب?'], night: ['تصبح على خير'] }, hospital: { morning: ['صباح الخير دكتور'], afternoon: ['أحتاج دواء'], evening: ['متى أستطيع الذهاب?'], night: ['لا أستطيع النوم'] }, outdoor: { morning: ['طقس جميل!'], afternoon: ['أنا متعب'], evening: ['أصبح مظلماً'], night: ['انظر للنجوم'] }, restaurant: { morning: ['أنا جائع'], afternoon: ['أريد هذا'], evening: ['أنا جائع'], night: ['أنا متعب'] }, unknown: { morning: ['صباح الخير'], afternoon: ['مرحباً'], evening: ['مساء الخير'], night: ['مساء الخير'] } },
  ur: { home: { morning: ['صبح بخیر', 'مجھے بھوک لگی ہے', 'ناشتہ چاہیے'], afternoon: ['پیاس لگی ہے', 'کھیل سکتا ہوں?', 'بوریت ہو رہی ہے'], evening: ['رات کا کھانا کیا ہے?', 'کھیلنا چاہتا ہوں', 'بھوک لگی ہے'], night: ['نیند آ رہی ہے', 'شب بخیر', 'پانی چاہیے'] }, school: { morning: ['صبح بخیر استاد'], afternoon: ['بھوک لگی ہے'], evening: ['جا سکتا ہوں?'], night: ['شب بخیر'] }, hospital: { morning: ['صبح بخیر ڈاکٹر'], afternoon: ['دوائی چاہیے'], evening: ['کب جا سکتا ہوں?'], night: ['نیند نہیں آ رہی'] }, outdoor: { morning: ['اچھا موسم!'], afternoon: ['تھک گیا'], evening: ['اندھیرا ہو رہا ہے'], night: ['ستارے دیکھو'] }, restaurant: { morning: ['بھوک لگی ہے'], afternoon: ['یہ چاہیے'], evening: ['بھوک لگی ہے'], night: ['تھک گیا'] }, unknown: { morning: ['صبح بخیر'], afternoon: ['ہیلو'], evening: ['شام بخیر'], night: ['شام بخیر'] } },
  hi: { home: { morning: ['सुप्रभात', 'मुझे भूख लगी है', 'नाश्ता चाहिए'], afternoon: ['प्यास लगी है', 'खेल सकता हूं?', 'बोर हो रहा हूं'], evening: ['रात का खाना क्या है?', 'खेलना चाहता हूं', 'भूख लगी है'], night: ['नींद आ रही है', 'शुभ रात्रि', 'पानी चाहिए'] }, school: { morning: ['गुड मॉर्निंग टीचर'], afternoon: ['भूख लगी है'], evening: ['जा सकता हूं?'], night: ['शुभ रात्रि'] }, hospital: { morning: ['गुड मॉर्निंग डॉक्टर'], afternoon: ['दवाई चाहिए'], evening: ['कब जा सकता हूं?'], night: ['नींद नहीं आ रही'] }, outdoor: { morning: ['अच्छा मौसम!'], afternoon: ['थक गया'], evening: ['अंधेरा हो रहा है'], night: ['तारे देखो'] }, restaurant: { morning: ['भूख लगी है'], afternoon: ['यह चाहिए'], evening: ['भूख लगी है'], night: ['थक गया'] }, unknown: { morning: ['सुप्रभात'], afternoon: ['नमस्ते'], evening: ['शुभ संध्या'], night: ['शुभ संध्या'] } },
  it: { home: { morning: ['Buongiorno', 'Ho fame', 'Voglio la colazione'], afternoon: ['Ho sete', 'Posso giocare?', 'Mi annoio'], evening: ['Cosa c\'è per cena?', 'Voglio giocare', 'Ho fame'], night: ['Ho sonno', 'Buonanotte', 'Ho bisogno di acqua'] }, school: { morning: ['Buongiorno professore'], afternoon: ['Ho fame'], evening: ['Posso andare?'], night: ['Buonanotte'] }, hospital: { morning: ['Buongiorno dottore'], afternoon: ['Ho bisogno di medicina'], evening: ['Quando posso andare?'], night: ['Non riesco a dormire'] }, outdoor: { morning: ['Bel tempo!'], afternoon: ['Sono stanco'], evening: ['Sta diventando buio'], night: ['Guarda le stelle'] }, restaurant: { morning: ['Ho fame'], afternoon: ['Voglio questo'], evening: ['Ho fame'], night: ['Sono stanco'] }, unknown: { morning: ['Buongiorno'], afternoon: ['Ciao'], evening: ['Buonasera'], night: ['Buonasera'] } },
  pl: { home: { morning: ['Dzień dobry', 'Jestem głodny', 'Chcę śniadanie'], afternoon: ['Chce mi się pić', 'Mogę się pobawić?', 'Nudzę się'], evening: ['Co na kolację?', 'Chcę się bawić', 'Jestem głodny'], night: ['Chce mi się spać', 'Dobranoc', 'Potrzebuję wody'] }, school: { morning: ['Dzień dobry nauczycielu'], afternoon: ['Jestem głodny'], evening: ['Mogę iść?'], night: ['Dobranoc'] }, hospital: { morning: ['Dzień dobry doktorze'], afternoon: ['Potrzebuję lekarstwa'], evening: ['Kiedy mogę iść?'], night: ['Nie mogę spać'] }, outdoor: { morning: ['Ładna pogoda!'], afternoon: ['Jestem zmęczony'], evening: ['Robi się ciemno'], night: ['Popatrz na gwiazdy'] }, restaurant: { morning: ['Jestem głodny'], afternoon: ['Chcę to'], evening: ['Jestem głodny'], night: ['Jestem zmęczony'] }, unknown: { morning: ['Dzień dobry'], afternoon: ['Cześć'], evening: ['Dobry wieczór'], night: ['Dobry wieczór'] } },
  uk: { home: { morning: ['Доброго ранку', 'Я голодний', 'Хочу сніданок'], afternoon: ['Хочу пити', 'Можна пограти?', 'Мені нудно'], evening: ['Що на вечерю?', 'Хочу гратися', 'Я голодний'], night: ['Хочу спати', 'На добраніч', 'Потрібна вода'] }, school: { morning: ['Доброго ранку вчителю'], afternoon: ['Я голодний'], evening: ['Можна йти?'], night: ['На добраніч'] }, hospital: { morning: ['Доброго ранку лікарю'], afternoon: ['Потрібні ліки'], evening: ['Коли можна йти?'], night: ['Не можу заснути'] }, outdoor: { morning: ['Гарна погода!'], afternoon: ['Я втомився'], evening: ['Темніє'], night: ['Дивись на зірки'] }, restaurant: { morning: ['Я голодний'], afternoon: ['Хочу це'], evening: ['Я голодний'], night: ['Я втомився'] }, unknown: { morning: ['Доброго ранку'], afternoon: ['Привіт'], evening: ['Добрий вечір'], night: ['Добрий вечір'] } },
  ro: { home: { morning: ['Bună dimineața', 'Mi-e foame', 'Vreau micul dejun'], afternoon: ['Mi-e sete', 'Pot să mă joc?', 'Mă plictisesc'], evening: ['Ce e la cină?', 'Vreau să mă joc', 'Mi-e foame'], night: ['Mi-e somn', 'Noapte bună', 'Am nevoie de apă'] }, school: { morning: ['Bună dimineața profesor'], afternoon: ['Mi-e foame'], evening: ['Pot să plec?'], night: ['Noapte bună'] }, hospital: { morning: ['Bună dimineața doctor'], afternoon: ['Am nevoie de medicament'], evening: ['Când pot pleca?'], night: ['Nu pot dormi'] }, outdoor: { morning: ['Vreme frumoasă!'], afternoon: ['Sunt obosit'], evening: ['Se întunecă'], night: ['Uită-te la stele'] }, restaurant: { morning: ['Mi-e foame'], afternoon: ['Vreau asta'], evening: ['Mi-e foame'], night: ['Sunt obosit'] }, unknown: { morning: ['Bună dimineața'], afternoon: ['Bună'], evening: ['Bună seara'], night: ['Bună seara'] } },
  nl: { home: { morning: ['Goedemorgen', 'Ik heb honger', 'Ik wil ontbijten'], afternoon: ['Ik heb dorst', 'Mag ik spelen?', 'Ik verveel me'], evening: ['Wat eten we?', 'Ik wil spelen', 'Ik heb honger'], night: ['Ik ben moe', 'Welterusten', 'Ik heb water nodig'] }, school: { morning: ['Goedemorgen meester'], afternoon: ['Ik heb honger'], evening: ['Mag ik gaan?'], night: ['Welterusten'] }, hospital: { morning: ['Goedemorgen dokter'], afternoon: ['Ik heb medicijn nodig'], evening: ['Wanneer mag ik gaan?'], night: ['Ik kan niet slapen'] }, outdoor: { morning: ['Lekker weer!'], afternoon: ['Ik ben moe'], evening: ['Het wordt donker'], night: ['Kijk naar de sterren'] }, restaurant: { morning: ['Ik heb honger'], afternoon: ['Ik wil dit'], evening: ['Ik heb honger'], night: ['Ik ben moe'] }, unknown: { morning: ['Goedemorgen'], afternoon: ['Hallo'], evening: ['Goedenavond'], night: ['Goedenavond'] } },
  vi: { home: { morning: ['Chào buổi sáng', 'Con đói', 'Con muốn ăn sáng'], afternoon: ['Con khát', 'Con chơi được không?', 'Con chán'], evening: ['Tối nay ăn gì?', 'Con muốn chơi', 'Con đói'], night: ['Con buồn ngủ', 'Chúc ngủ ngon', 'Con cần nước'] }, school: { morning: ['Chào thầy cô'], afternoon: ['Con đói'], evening: ['Con về được chưa?'], night: ['Chúc ngủ ngon'] }, hospital: { morning: ['Chào bác sĩ'], afternoon: ['Con cần thuốc'], evening: ['Khi nào con về được?'], night: ['Con không ngủ được'] }, outdoor: { morning: ['Thời tiết đẹp!'], afternoon: ['Con mệt'], evening: ['Trời tối rồi'], night: ['Nhìn sao kìa'] }, restaurant: { morning: ['Con đói'], afternoon: ['Con muốn cái này'], evening: ['Con đói'], night: ['Con mệt'] }, unknown: { morning: ['Chào buổi sáng'], afternoon: ['Xin chào'], evening: ['Chào buổi tối'], night: ['Chào buổi tối'] } },
  tr: { home: { morning: ['Günaydın', 'Acıktım', 'Kahvaltı istiyorum'], afternoon: ['Susadım', 'Oynayabilir miyim?', 'Sıkıldım'], evening: ['Akşam yemeği ne?', 'Oynamak istiyorum', 'Acıktım'], night: ['Uykum geldi', 'İyi geceler', 'Su lazım'] }, school: { morning: ['Günaydın öğretmenim'], afternoon: ['Acıktım'], evening: ['Gidebilir miyim?'], night: ['İyi geceler'] }, hospital: { morning: ['Günaydın doktor'], afternoon: ['İlaç lazım'], evening: ['Ne zaman gidebilirim?'], night: ['Uyuyamıyorum'] }, outdoor: { morning: ['Hava güzel!'], afternoon: ['Yoruldum'], evening: ['Karanlık oluyor'], night: ['Yıldızlara bak'] }, restaurant: { morning: ['Acıktım'], afternoon: ['Bunu istiyorum'], evening: ['Acıktım'], night: ['Yoruldum'] }, unknown: { morning: ['Günaydın'], afternoon: ['Merhaba'], evening: ['İyi akşamlar'], night: ['İyi akşamlar'] } },
};

type SeasonType = 'spring' | 'summer' | 'fall' | 'winter';
type _DayType = 'weekday' | 'weekend';

export const SEASONAL_PHRASES: Record<SupportedLanguage, Record<SeasonType, Record<string, string[]>>> = {
  en: {
    spring: {
      morning: ["It's nice outside!", 'The flowers are blooming!', 'Can we go outside?'],
      afternoon: ['Can we have a picnic?', "It's so nice today!", 'I want to play outside'],
      evening: ["It's getting cool", 'The sunset is pretty', 'I had fun today'],
      night: ['Good night!', 'I had a great day', "It's getting dark early"],
    },
    summer: {
      morning: ["It's already warm!", 'I need sunscreen', 'Can we go swimming?'],
      afternoon: ["It's so hot!", 'I need water', 'Can we get ice cream?', "It's too hot outside"],
      evening: ["It's still warm", 'Can we play a bit more?', 'I want cold water'],
      night: ["It's hard to sleep", "It's too hot", 'Can I have a fan?'],
    },
    fall: {
      morning: ["It's chilly!", 'I need a jacket', 'The leaves are pretty'],
      afternoon: ['Can we play with leaves?', "It's windy today", 'I want hot chocolate'],
      evening: ["It's getting dark early", "I'm cold", 'Can we go inside?'],
      night: ['Good night!', "It's cozy inside", 'I need a blanket'],
    },
    winter: {
      morning: ["It's so cold!", 'I need warm clothes', 'Is it snowing?'],
      afternoon: ['Can we play in the snow?', "It's freezing!", 'I want hot cocoa'],
      evening: ["It's dark already", "I'm cold", 'Can we stay inside?'],
      night: ["It's so cold", 'I need more blankets', 'Good night!'],
    },
  },
  ko: {
    spring: {
      morning: ['날씨 좋다!', '꽃이 피었어요!', '밖에 나가도 돼요?'],
      afternoon: ['소풍 가도 돼요?', '오늘 날씨 좋아요!', '밖에서 놀고 싶어요'],
      evening: ['선선해지고 있어요', '노을이 예뻐요', '오늘 재미있었어요'],
      night: ['잘 자요!', '오늘 좋은 하루였어요', '벌써 어두워졌어요'],
    },
    summer: {
      morning: ['벌써 더워요!', '선크림 발라야 해요', '수영하러 가도 돼요?'],
      afternoon: ['너무 더워요!', '물 주세요', '아이스크림 먹고 싶어요', '밖에 너무 더워요'],
      evening: ['아직 더워요', '좀 더 놀아도 돼요?', '차가운 물 마시고 싶어요'],
      night: ['잠이 안 와요', '너무 더워요', '선풍기 틀어도 돼요?'],
    },
    fall: {
      morning: ['쌀쌀해요!', '겉옷 필요해요', '단풍이 예뻐요'],
      afternoon: ['낙엽 놀이해도 돼요?', '오늘 바람 부네요', '따뜻한 음료 마시고 싶어요'],
      evening: ['벌써 어두워져요', '추워요', '안으로 들어갈래요'],
      night: ['잘 자요!', '안이 따뜻해요', '이불 필요해요'],
    },
    winter: {
      morning: ['너무 추워요!', '따뜻하게 입어야 해요', '눈 와요?'],
      afternoon: ['눈싸움하고 싶어요!', '얼어붙을 것 같아요!', '따뜻한 코코아 마시고 싶어요'],
      evening: ['벌써 어두워요', '추워요', '집에 있고 싶어요'],
      night: ['너무 추워요', '이불 더 필요해요', '잘 자요!'],
    },
  },
  ja: {
    spring: {
      morning: ['いい天気!', '花が咲いてる!', '外に出ていい?'],
      afternoon: ['ピクニック行きたい!', '今日気持ちいい!', '外で遊びたい'],
      evening: ['涼しくなってきた', '夕日きれい', '今日楽しかった'],
      night: ['おやすみ!', 'いい一日だった', 'もう暗くなった'],
    },
    summer: {
      morning: ['もう暑い!', '日焼け止め塗らなきゃ', '泳ぎに行きたい!'],
      afternoon: ['暑すぎる!', '水ください', 'アイス食べたい', '外暑すぎる'],
      evening: ['まだ暑い', 'もう少し遊びたい', '冷たい水飲みたい'],
      night: ['寝れない', '暑すぎる', '扇風機つけて'],
    },
    fall: {
      morning: ['寒い!', '上着いる', '紅葉きれい'],
      afternoon: ['落ち葉で遊びたい', '今日風強いね', 'ホットチョコ飲みたい'],
      evening: ['暗くなるの早い', '寒い', '中に入りたい'],
      night: ['おやすみ!', '中は暖かい', '毛布ほしい'],
    },
    winter: {
      morning: ['寒すぎる!', '暖かい服着なきゃ', '雪降ってる?'],
      afternoon: ['雪遊びしたい!', '凍りそう!', 'ココア飲みたい'],
      evening: ['もう暗い', '寒い', '家にいたい'],
      night: ['寒すぎる', '毛布もっとほしい', 'おやすみ!'],
    },
  },
  es: { spring: { morning: ['¡Hace buen tiempo!'], afternoon: ['¡Qué lindo día!'], evening: ['Se está poniendo fresco'], night: ['¡Buenas noches!'] }, summer: { morning: ['¡Ya hace calor!'], afternoon: ['¡Hace mucho calor!'], evening: ['Todavía hace calor'], night: ['Hace calor para dormir'] }, fall: { morning: ['¡Hace fresco!'], afternoon: ['Hay viento hoy'], evening: ['Oscurece temprano'], night: ['¡Buenas noches!'] }, winter: { morning: ['¡Hace mucho frío!'], afternoon: ['¡Está helando!'], evening: ['Ya está oscuro'], night: ['Hace mucho frío'] } },
  ru: { spring: { morning: ['Хорошая погода!'], afternoon: ['Какой чудесный день!'], evening: ['Становится прохладно'], night: ['Спокойной ночи!'] }, summer: { morning: ['Уже жарко!'], afternoon: ['Очень жарко!'], evening: ['Ещё тепло'], night: ['Жарко спать'] }, fall: { morning: ['Прохладно!'], afternoon: ['Сегодня ветрено'], evening: ['Рано темнеет'], night: ['Спокойной ночи!'] }, winter: { morning: ['Очень холодно!'], afternoon: ['Морозно!'], evening: ['Уже темно'], night: ['Очень холодно'] } },
  id: { spring: { morning: ['Cuaca bagus!'], afternoon: ['Hari yang indah!'], evening: ['Mulai sejuk'], night: ['Selamat malam!'] }, summer: { morning: ['Sudah panas!'], afternoon: ['Sangat panas!'], evening: ['Masih panas'], night: ['Panas untuk tidur'] }, fall: { morning: ['Sejuk!'], afternoon: ['Berangin hari ini'], evening: ['Cepat gelap'], night: ['Selamat malam!'] }, winter: { morning: ['Sangat dingin!'], afternoon: ['Membeku!'], evening: ['Sudah gelap'], night: ['Sangat dingin'] } },
  pt: { spring: { morning: ['Tempo bom!'], afternoon: ['Que dia lindo!'], evening: ['Está esfriando'], night: ['Boa noite!'] }, summer: { morning: ['Já está quente!'], afternoon: ['Muito quente!'], evening: ['Ainda está quente'], night: ['Calor para dormir'] }, fall: { morning: ['Está fresco!'], afternoon: ['Está ventando hoje'], evening: ['Escurece cedo'], night: ['Boa noite!'] }, winter: { morning: ['Muito frio!'], afternoon: ['Está gelando!'], evening: ['Já está escuro'], night: ['Muito frio'] } },
  fr: { spring: { morning: ['Beau temps!'], afternoon: ['Quelle belle journée!'], evening: ['Il fait frais'], night: ['Bonne nuit!'] }, summer: { morning: ['Il fait déjà chaud!'], afternoon: ['Il fait très chaud!'], evening: ['Il fait encore chaud'], night: ['Chaud pour dormir'] }, fall: { morning: ['Il fait frais!'], afternoon: ['Il y a du vent'], evening: ['Il fait nuit tôt'], night: ['Bonne nuit!'] }, winter: { morning: ['Il fait très froid!'], afternoon: ['Il gèle!'], evening: ['Il fait déjà nuit'], night: ['Il fait très froid'] } },
  de: { spring: { morning: ['Schönes Wetter!'], afternoon: ['Was für ein schöner Tag!'], evening: ['Es wird kühl'], night: ['Gute Nacht!'] }, summer: { morning: ['Es ist schon warm!'], afternoon: ['Es ist sehr heiß!'], evening: ['Es ist noch warm'], night: ['Zu warm zum Schlafen'] }, fall: { morning: ['Es ist kühl!'], afternoon: ['Es ist windig heute'], evening: ['Es wird früh dunkel'], night: ['Gute Nacht!'] }, winter: { morning: ['Es ist sehr kalt!'], afternoon: ['Es ist eiskalt!'], evening: ['Es ist schon dunkel'], night: ['Es ist sehr kalt'] } },
  bn: { spring: { morning: ['সুন্দর আবহাওয়া!'], afternoon: ['কি সুন্দর দিন!'], evening: ['ঠান্ডা হচ্ছে'], night: ['শুভ রাত্রি!'] }, summer: { morning: ['গরম পড়েছে!'], afternoon: ['খুব গরম!'], evening: ['এখনো গরম'], night: ['ঘুমাতে গরম'] }, fall: { morning: ['ঠান্ডা!'], afternoon: ['আজ বাতাস'], evening: ['তাড়াতাড়ি অন্ধকার'], night: ['শুভ রাত্রি!'] }, winter: { morning: ['খুব ঠান্ডা!'], afternoon: ['জমে যাচ্ছে!'], evening: ['অন্ধকার হয়ে গেছে'], night: ['খুব ঠান্ডা'] } },
  ar: { spring: { morning: ['طقس جميل!'], afternoon: ['يوم رائع!'], evening: ['الجو يبرد'], night: ['تصبح على خير!'] }, summer: { morning: ['الجو حار!'], afternoon: ['حار جداً!'], evening: ['لا يزال حاراً'], night: ['حار للنوم'] }, fall: { morning: ['الجو بارد!'], afternoon: ['يوم عاصف'], evening: ['يظلم باكراً'], night: ['تصبح على خير!'] }, winter: { morning: ['بارد جداً!'], afternoon: ['متجمد!'], evening: ['أظلم مبكراً'], night: ['بارد جداً'] } },
  ur: { spring: { morning: ['اچھا موسم!'], afternoon: ['کیا خوبصورت دن!'], evening: ['ٹھنڈا ہو رہا ہے'], night: ['شب بخیر!'] }, summer: { morning: ['گرمی ہے!'], afternoon: ['بہت گرم!'], evening: ['ابھی تک گرم'], night: ['سونے کے لیے گرم'] }, fall: { morning: ['ٹھنڈا!'], afternoon: ['آج ہوا ہے'], evening: ['جلدی اندھیرا'], night: ['شب بخیر!'] }, winter: { morning: ['بہت سردی!'], afternoon: ['جما دینے والی!'], evening: ['اندھیرا ہو گیا'], night: ['بہت سردی'] } },
  hi: { spring: { morning: ['अच्छा मौसम!'], afternoon: ['क्या सुंदर दिन!'], evening: ['ठंडा हो रहा है'], night: ['शुभ रात्रि!'] }, summer: { morning: ['गर्मी है!'], afternoon: ['बहुत गर्मी!'], evening: ['अभी भी गर्म'], night: ['सोने के लिए गर्म'] }, fall: { morning: ['ठंडा!'], afternoon: ['आज हवा है'], evening: ['जल्दी अंधेरा'], night: ['शुभ रात्रि!'] }, winter: { morning: ['बहुत ठंड!'], afternoon: ['जमा देने वाली!'], evening: ['अंधेरा हो गया'], night: ['बहुत ठंड'] } },
  it: { spring: { morning: ['Bel tempo!'], afternoon: ['Che bella giornata!'], evening: ['Si rinfresca'], night: ['Buonanotte!'] }, summer: { morning: ['Fa già caldo!'], afternoon: ['Fa molto caldo!'], evening: ['Fa ancora caldo'], night: ['Caldo per dormire'] }, fall: { morning: ['Fa fresco!'], afternoon: ['C\'è vento oggi'], evening: ['Fa buio presto'], night: ['Buonanotte!'] }, winter: { morning: ['Fa molto freddo!'], afternoon: ['Sta gelando!'], evening: ['È già buio'], night: ['Fa molto freddo'] } },
  pl: { spring: { morning: ['Ładna pogoda!'], afternoon: ['Co za piękny dzień!'], evening: ['Robi się chłodno'], night: ['Dobranoc!'] }, summer: { morning: ['Już jest ciepło!'], afternoon: ['Jest bardzo gorąco!'], evening: ['Nadal jest ciepło'], night: ['Za gorąco do snu'] }, fall: { morning: ['Jest chłodno!'], afternoon: ['Dziś wieje'], evening: ['Wcześnie ciemnieje'], night: ['Dobranoc!'] }, winter: { morning: ['Jest bardzo zimno!'], afternoon: ['Mróz!'], evening: ['Już ciemno'], night: ['Jest bardzo zimno'] } },
  uk: { spring: { morning: ['Гарна погода!'], afternoon: ['Який чудовий день!'], evening: ['Стає прохолодно'], night: ['На добраніч!'] }, summer: { morning: ['Вже спекотно!'], afternoon: ['Дуже жарко!'], evening: ['Ще тепло'], night: ['Жарко спати'] }, fall: { morning: ['Прохолодно!'], afternoon: ['Сьогодні вітряно'], evening: ['Рано темніє'], night: ['На добраніч!'] }, winter: { morning: ['Дуже холодно!'], afternoon: ['Мороз!'], evening: ['Вже темно'], night: ['Дуже холодно'] } },
  ro: { spring: { morning: ['Vreme frumoasă!'], afternoon: ['Ce zi frumoasă!'], evening: ['Se răcorește'], night: ['Noapte bună!'] }, summer: { morning: ['Deja e cald!'], afternoon: ['E foarte cald!'], evening: ['Încă e cald'], night: ['E cald să dormi'] }, fall: { morning: ['E răcoare!'], afternoon: ['E vânt azi'], evening: ['Se întunecă devreme'], night: ['Noapte bună!'] }, winter: { morning: ['E foarte frig!'], afternoon: ['Îngheață!'], evening: ['Deja e întuneric'], night: ['E foarte frig'] } },
  nl: { spring: { morning: ['Mooi weer!'], afternoon: ['Wat een mooie dag!'], evening: ['Het wordt fris'], night: ['Welterusten!'] }, summer: { morning: ['Het is al warm!'], afternoon: ['Het is erg heet!'], evening: ['Het is nog warm'], night: ['Te warm om te slapen'] }, fall: { morning: ['Het is fris!'], afternoon: ['Het waait vandaag'], evening: ['Het wordt vroeg donker'], night: ['Welterusten!'] }, winter: { morning: ['Het is erg koud!'], afternoon: ['Het vriest!'], evening: ['Het is al donker'], night: ['Het is erg koud'] } },
  vi: { spring: { morning: ['Thời tiết đẹp!'], afternoon: ['Ngày thật đẹp!'], evening: ['Trời mát dần'], night: ['Chúc ngủ ngon!'] }, summer: { morning: ['Nóng rồi!'], afternoon: ['Nóng quá!'], evening: ['Vẫn còn nóng'], night: ['Nóng khó ngủ'] }, fall: { morning: ['Mát mẻ!'], afternoon: ['Hôm nay có gió'], evening: ['Tối sớm'], night: ['Chúc ngủ ngon!'] }, winter: { morning: ['Lạnh quá!'], afternoon: ['Đóng băng!'], evening: ['Tối rồi'], night: ['Lạnh quá'] } },
  tr: { spring: { morning: ['Hava güzel!'], afternoon: ['Ne güzel bir gün!'], evening: ['Serinliyor'], night: ['İyi geceler!'] }, summer: { morning: ['Şimdiden sıcak!'], afternoon: ['Çok sıcak!'], evening: ['Hâlâ sıcak'], night: ['Uyumak için sıcak'] }, fall: { morning: ['Serin!'], afternoon: ['Bugün rüzgarlı'], evening: ['Erken kararıyor'], night: ['İyi geceler!'] }, winter: { morning: ['Çok soğuk!'], afternoon: ['Dondurucu!'], evening: ['Karardı bile'], night: ['Çok soğuk'] } },
};

export const WEEKEND_PHRASES: Record<SupportedLanguage, Record<string, string[]>> = {
  en: {
    morning: ['Can we sleep in?', 'No school today!', 'What are we doing today?', 'Can we have pancakes?'],
    afternoon: ['Can we go to the park?', 'I want to play all day!', 'Can we watch a movie?', 'Let\'s go somewhere fun!'],
    evening: ['Can we order pizza?', 'I don\'t want the weekend to end', 'Can we stay up late?', 'This was a fun day!'],
    night: ['Can I stay up a bit more?', 'I had so much fun today!', 'Do we have school tomorrow?', 'Good night!'],
  },
  ko: {
    morning: ['더 자도 돼요?', '오늘 학교 안 가요!', '오늘 뭐 해요?', '팬케이크 먹어도 돼요?'],
    afternoon: ['공원 가도 돼요?', '하루 종일 놀고 싶어요!', '영화 봐도 돼요?', '재미있는 데 가요!'],
    evening: ['피자 시켜도 돼요?', '주말 끝나기 싫어요', '늦게까지 깨어있어도 돼요?', '오늘 재미있었어요!'],
    night: ['조금 더 깨어있어도 돼요?', '오늘 정말 재미있었어요!', '내일 학교 가요?', '잘 자요!'],
  },
  ja: {
    morning: ['もっと寝ていい?', '今日学校ない!', '今日何するの?', 'パンケーキ食べたい!'],
    afternoon: ['公園行っていい?', '一日中遊びたい!', '映画見ていい?', '楽しいところ行こう!'],
    evening: ['ピザ頼んでいい?', '週末終わってほしくない', '夜更かししていい?', '今日楽しかった!'],
    night: ['もう少し起きてていい?', '今日すごく楽しかった!', '明日学校ある?', 'おやすみ!'],
  },
  es: { morning: ['¿Puedo dormir más?', '¡No hay escuela!', '¿Qué hacemos hoy?'], afternoon: ['¿Vamos al parque?', '¡Quiero jugar todo el día!'], evening: ['¿Pedimos pizza?', 'No quiero que termine el fin de semana'], night: ['¿Puedo quedarme despierto?', '¡Me divertí mucho!'] },
  ru: { morning: ['Можно поспать?', 'Сегодня нет школы!', 'Что делаем сегодня?'], afternoon: ['Пойдём в парк?', 'Хочу играть весь день!'], evening: ['Закажем пиццу?', 'Не хочу чтобы выходные кончались'], night: ['Можно ещё не спать?', 'Сегодня было весело!'] },
  id: { morning: ['Boleh tidur lagi?', 'Tidak ada sekolah!', 'Hari ini mau apa?'], afternoon: ['Ke taman yuk?', 'Mau main seharian!'], evening: ['Pesan pizza yuk?', 'Tidak mau akhir pekan berakhir'], night: ['Boleh begadang?', 'Hari ini menyenangkan!'] },
  pt: { morning: ['Posso dormir mais?', 'Não tem escola!', 'O que vamos fazer?'], afternoon: ['Vamos ao parque?', 'Quero brincar o dia todo!'], evening: ['Vamos pedir pizza?', 'Não quero que o fim de semana acabe'], night: ['Posso ficar acordado?', 'Me diverti muito!'] },
  fr: { morning: ['Je peux dormir encore?', 'Pas d\'école!', 'On fait quoi aujourd\'hui?'], afternoon: ['On va au parc?', 'Je veux jouer toute la journée!'], evening: ['On commande une pizza?', 'Je ne veux pas que le weekend finisse'], night: ['Je peux rester debout?', 'Je me suis bien amusé!'] },
  de: { morning: ['Darf ich ausschlafen?', 'Keine Schule heute!', 'Was machen wir heute?'], afternoon: ['Gehen wir in den Park?', 'Ich will den ganzen Tag spielen!'], evening: ['Pizza bestellen?', 'Ich will nicht dass das Wochenende endet'], night: ['Darf ich aufbleiben?', 'Ich hatte so viel Spaß!'] },
  bn: { morning: ['আরো ঘুমাতে পারি?', 'আজ স্কুল নেই!', 'আজ কী করব?'], afternoon: ['পার্কে যাই?', 'সারাদিন খেলতে চাই!'], evening: ['পিৎজা অর্ডার করি?', 'সপ্তাহান্ত শেষ হতে চাই না'], night: ['আরো জেগে থাকতে পারি?', 'আজ খুব মজা ছিল!'] },
  ar: { morning: ['هل يمكنني النوم أكثر?', 'لا مدرسة اليوم!', 'ماذا نفعل اليوم?'], afternoon: ['هل نذهب للحديقة?', 'أريد اللعب طوال اليوم!'], evening: ['هل نطلب بيتزا?', 'لا أريد أن تنتهي العطلة'], night: ['هل يمكنني السهر?', 'استمتعت كثيراً!'] },
  ur: { morning: ['اور سو سکتا ہوں?', 'آج سکول نہیں!', 'آج کیا کریں گے?'], afternoon: ['پارک چلیں?', 'سارا دن کھیلنا چاہتا ہوں!'], evening: ['پیزا منگوائیں?', 'ویک اینڈ ختم نہیں ہونا چاہیے'], night: ['تھوڑا اور جاگ سکتا ہوں?', 'آج بہت مزا آیا!'] },
  hi: { morning: ['और सो सकता हूं?', 'आज स्कूल नहीं!', 'आज क्या करेंगे?'], afternoon: ['पार्क चलें?', 'पूरा दिन खेलना चाहता हूं!'], evening: ['पिज्जा मंगाएं?', 'वीकेंड खत्म नहीं होना चाहिए'], night: ['थोड़ा और जाग सकता हूं?', 'आज बहुत मजा आया!'] },
  it: { morning: ['Posso dormire ancora?', 'Niente scuola!', 'Cosa facciamo oggi?'], afternoon: ['Andiamo al parco?', 'Voglio giocare tutto il giorno!'], evening: ['Ordiniamo la pizza?', 'Non voglio che finisca il weekend'], night: ['Posso stare sveglio?', 'Mi sono divertito!'] },
  pl: { morning: ['Mogę jeszcze pospać?', 'Nie ma szkoły!', 'Co robimy dziś?'], afternoon: ['Idziemy do parku?', 'Chcę się bawić cały dzień!'], evening: ['Zamówimy pizzę?', 'Nie chcę żeby weekend się skończył'], night: ['Mogę jeszcze nie spać?', 'Dobrze się bawiłem!'] },
  uk: { morning: ['Можна ще поспати?', 'Сьогодні немає школи!', 'Що робимо сьогодні?'], afternoon: ['Підемо в парк?', 'Хочу грати весь день!'], evening: ['Замовимо піцу?', 'Не хочу щоб вихідні закінчились'], night: ['Можна ще не спати?', 'Сьогодні було весело!'] },
  ro: { morning: ['Pot să mai dorm?', 'Nu e școală!', 'Ce facem azi?'], afternoon: ['Mergem în parc?', 'Vreau să mă joc toată ziua!'], evening: ['Comandăm pizza?', 'Nu vreau să se termine weekendul'], night: ['Pot să stau treaz?', 'M-am distrat!'] },
  nl: { morning: ['Mag ik uitslapen?', 'Geen school!', 'Wat doen we vandaag?'], afternoon: ['Gaan we naar het park?', 'Ik wil de hele dag spelen!'], evening: ['Pizza bestellen?', 'Ik wil niet dat het weekend eindigt'], night: ['Mag ik opblijven?', 'Ik heb me zo geamuseerd!'] },
  vi: { morning: ['Con ngủ thêm được không?', 'Hôm nay không đi học!', 'Hôm nay làm gì?'], afternoon: ['Đi công viên được không?', 'Con muốn chơi cả ngày!'], evening: ['Đặt pizza được không?', 'Con không muốn cuối tuần kết thúc'], night: ['Con thức thêm được không?', 'Hôm nay vui quá!'] },
  tr: { morning: ['Biraz daha uyuyabilir miyim?', 'Bugün okul yok!', 'Bugün ne yapıyoruz?'], afternoon: ['Parka gidebilir miyiz?', 'Bütün gün oynamak istiyorum!'], evening: ['Pizza söyleyelim mi?', 'Hafta sonunun bitmesini istemiyorum'], night: ['Biraz daha kalabilir miyim?', 'Çok eğlendim!'] },
};

type WeatherType = 'rain' | 'snow' | 'hot' | 'cold' | 'freezing' | 'wind' | 'storm' | 'clear' | 'cloudy';

export const WEATHER_PHRASES: Record<SupportedLanguage, Record<WeatherType, string[]>> = {
  en: {
    rain: ["It's raining!", 'I need an umbrella', "I don't want to get wet", 'Can we stay inside?', 'I hear the rain', 'The rain is loud'],
    snow: ["It's snowing!", 'I want to play in the snow', 'Can we build a snowman?', "It's so pretty outside", 'I need my boots', 'Snow day!'],
    hot: ["It's so hot!", 'I need water', 'Can we turn on the AC?', "I'm sweating", 'I want something cold', 'Too hot to go outside'],
    cold: ["It's cold!", 'I need a jacket', 'Can we turn on the heater?', 'My hands are cold', 'I want something warm', "It's chilly"],
    freezing: ["It's freezing!", 'I can see my breath', "I can't feel my fingers", 'Way too cold!', 'I need more layers', "Don't want to go outside"],
    wind: ["It's so windy!", 'My hair is blowing', 'Hold my hand please', 'The wind is strong', 'My hat might fly away', 'Hard to walk'],
    storm: ["There's a storm!", "I'm scared of thunder", 'Can we stay inside?', "It's loud outside", 'I want to hide', 'When will it stop?'],
    clear: ['Nice weather today!', 'The sky is so blue', 'Perfect day to go out', 'I love this weather', 'Can we go outside?', 'So sunny!'],
    cloudy: ["It's cloudy today", 'Will it rain?', 'No sun today', 'Kind of gloomy', 'I hope it clears up', 'Gray sky'],
  },
  ko: {
    rain: ['비 와요!', '우산 필요해요', '젖고 싶지 않아요', '안에 있어도 돼요?', '비 소리 들려요', '비가 많이 와요'],
    snow: ['눈 와요!', '눈싸움하고 싶어요', '눈사람 만들어도 돼요?', '밖이 너무 예뻐요', '장화 신어야 해요', '눈 오는 날이다!'],
    hot: ['너무 더워요!', '물 주세요', '에어컨 틀어도 돼요?', '땀 나요', '차가운 거 먹고 싶어요', '밖에 나가기 너무 더워요'],
    cold: ['추워요!', '겉옷 필요해요', '히터 틀어도 돼요?', '손이 차가워요', '따뜻한 거 먹고 싶어요', '쌀쌀해요'],
    freezing: ['얼어붙을 것 같아요!', '입김이 보여요', '손가락이 안 느껴져요', '너무 추워요!', '옷 더 입어야 해요', '밖에 나가기 싫어요'],
    wind: ['바람이 세요!', '머리카락 날려요', '손 잡아주세요', '바람이 강해요', '모자 날아갈 것 같아요', '걷기 힘들어요'],
    storm: ['폭풍이에요!', '천둥 무서워요', '안에 있어도 돼요?', '밖이 시끄러워요', '숨고 싶어요', '언제 그칠까요?'],
    clear: ['오늘 날씨 좋다!', '하늘이 파래요', '나가기 좋은 날이에요', '이런 날씨 좋아요', '밖에 나가도 돼요?', '햇살이 좋아요!'],
    cloudy: ['오늘 흐려요', '비 올까요?', '해가 안 보여요', '좀 우울해요', '개었으면 좋겠어요', '하늘이 회색이에요'],
  },
  ja: {
    rain: ['雨だ!', '傘が必要', '濡れたくない', '中にいていい?', '雨の音が聞こえる', '雨がすごい'],
    snow: ['雪だ!', '雪遊びしたい', '雪だるま作っていい?', '外がきれい', 'ブーツ履かなきゃ', '雪の日だ!'],
    hot: ['暑すぎる!', '水ください', 'エアコンつけて', '汗かいてる', '冷たいものほしい', '外出るには暑すぎる'],
    cold: ['寒い!', '上着いる', 'ヒーターつけて', '手が冷たい', '温かいものほしい', '肌寒い'],
    freezing: ['凍りそう!', '息が白い', '指の感覚ない', '寒すぎる!', 'もっと着なきゃ', '外出たくない'],
    wind: ['風が強い!', '髪が飛んでる', '手つないで', '風がすごい', '帽子飛びそう', '歩きにくい'],
    storm: ['嵐だ!', '雷怖い', '中にいていい?', '外がうるさい', '隠れたい', 'いつ止むの?'],
    clear: ['今日いい天気!', '空が青い', '出かけるのにいい日', 'この天気好き', '外行っていい?', 'すごく晴れてる!'],
    cloudy: ['今日曇り', '雨降るかな?', '太陽見えない', 'ちょっと暗い', '晴れるといいな', '灰色の空'],
  },
  es: { rain: ['¡Está lloviendo!', 'Necesito un paraguas', 'No quiero mojarme'], snow: ['¡Está nevando!', 'Quiero jugar en la nieve'], hot: ['¡Hace mucho calor!', 'Necesito agua', '¿Podemos encender el aire?'], cold: ['¡Hace frío!', 'Necesito una chaqueta'], freezing: ['¡Está helando!', 'Hace demasiado frío'], wind: ['¡Hace mucho viento!', 'Mi sombrero puede volar'], storm: ['¡Hay tormenta!', 'Tengo miedo del trueno'], clear: ['¡Buen tiempo hoy!', 'El cielo está azul'], cloudy: ['Está nublado', '¿Va a llover?'] },
  ru: { rain: ['Идёт дождь!', 'Нужен зонтик', 'Не хочу мокнуть'], snow: ['Идёт снег!', 'Хочу играть в снегу'], hot: ['Очень жарко!', 'Нужна вода', 'Включите кондиционер'], cold: ['Холодно!', 'Нужна куртка'], freezing: ['Морозно!', 'Слишком холодно'], wind: ['Очень ветрено!', 'Шляпа улетит'], storm: ['Гроза!', 'Боюсь грома'], clear: ['Хорошая погода!', 'Небо голубое'], cloudy: ['Облачно', 'Будет дождь?'] },
  id: { rain: ['Hujan!', 'Butuh payung', 'Tidak mau basah'], snow: ['Salju!', 'Mau main salju'], hot: ['Panas sekali!', 'Butuh air', 'Nyalakan AC'], cold: ['Dingin!', 'Butuh jaket'], freezing: ['Membeku!', 'Terlalu dingin'], wind: ['Berangin!', 'Topi bisa terbang'], storm: ['Badai!', 'Takut petir'], clear: ['Cuaca bagus!', 'Langit biru'], cloudy: ['Mendung', 'Mau hujan?'] },
  pt: { rain: ['Está chovendo!', 'Preciso de guarda-chuva', 'Não quero me molhar'], snow: ['Está nevando!', 'Quero brincar na neve'], hot: ['Está muito quente!', 'Preciso de água', 'Liga o ar-condicionado'], cold: ['Está frio!', 'Preciso de casaco'], freezing: ['Está congelando!', 'Frio demais'], wind: ['Muito vento!', 'Meu chapéu vai voar'], storm: ['Tem tempestade!', 'Tenho medo de trovão'], clear: ['Tempo bom hoje!', 'O céu está azul'], cloudy: ['Está nublado', 'Vai chover?'] },
  fr: { rain: ['Il pleut!', "J'ai besoin d'un parapluie", 'Je ne veux pas être mouillé'], snow: ['Il neige!', 'Je veux jouer dans la neige'], hot: ['Il fait très chaud!', "J'ai besoin d'eau", 'On peut mettre la clim?'], cold: ['Il fait froid!', "J'ai besoin d'une veste"], freezing: ['Il gèle!', 'Trop froid'], wind: ['Il y a beaucoup de vent!', 'Mon chapeau va s\'envoler'], storm: ['Il y a une tempête!', "J'ai peur du tonnerre"], clear: ['Beau temps aujourd\'hui!', 'Le ciel est bleu'], cloudy: ['C\'est nuageux', 'Il va pleuvoir?'] },
  de: { rain: ['Es regnet!', 'Ich brauche einen Regenschirm', 'Ich will nicht nass werden'], snow: ['Es schneit!', 'Ich will im Schnee spielen'], hot: ['Es ist so heiß!', 'Ich brauche Wasser', 'Können wir die Klimaanlage anmachen?'], cold: ['Es ist kalt!', 'Ich brauche eine Jacke'], freezing: ['Es ist eiskalt!', 'Viel zu kalt'], wind: ['Es ist so windig!', 'Mein Hut fliegt weg'], storm: ['Es gibt einen Sturm!', 'Ich habe Angst vor Donner'], clear: ['Schönes Wetter heute!', 'Der Himmel ist blau'], cloudy: ['Es ist bewölkt', 'Wird es regnen?'] },
  bn: { rain: ['বৃষ্টি হচ্ছে!', 'ছাতা দরকার', 'ভিজতে চাই না'], snow: ['তুষার পড়ছে!', 'তুষারে খেলতে চাই'], hot: ['খুব গরম!', 'পানি দরকার', 'এসি চালাও'], cold: ['ঠান্ডা!', 'জ্যাকেট দরকার'], freezing: ['জমে যাচ্ছে!', 'খুব ঠান্ডা'], wind: ['খুব বাতাস!', 'টুপি উড়ে যাবে'], storm: ['ঝড় হচ্ছে!', 'বজ্রপাতে ভয়'], clear: ['আজ সুন্দর আবহাওয়া!', 'আকাশ নীল'], cloudy: ['মেঘলা', 'বৃষ্টি হবে?'] },
  ar: { rain: ['إنها تمطر!', 'أحتاج مظلة', 'لا أريد أن أبتل'], snow: ['إنها تثلج!', 'أريد اللعب بالثلج'], hot: ['الجو حار جداً!', 'أحتاج ماء', 'هل يمكننا تشغيل المكيف?'], cold: ['الجو بارد!', 'أحتاج جاكيت'], freezing: ['الجو متجمد!', 'بارد جداً'], wind: ['الرياح قوية!', 'قبعتي ستطير'], storm: ['هناك عاصفة!', 'أخاف من الرعد'], clear: ['طقس جميل اليوم!', 'السماء زرقاء'], cloudy: ['الجو غائم', 'هل ستمطر?'] },
  ur: { rain: ['بارش ہو رہی ہے!', 'چھتری چاہیے', 'بھیگنا نہیں چاہتا'], snow: ['برف پڑ رہی ہے!', 'برف میں کھیلنا چاہتا ہوں'], hot: ['بہت گرمی ہے!', 'پانی چاہیے', 'اے سی چلاؤ'], cold: ['سردی ہے!', 'جیکٹ چاہیے'], freezing: ['جما دینے والی سردی!', 'بہت ٹھنڈا'], wind: ['بہت ہوا ہے!', 'ٹوپی اڑ جائے گی'], storm: ['طوفان ہے!', 'گرج سے ڈر لگتا ہے'], clear: ['آج موسم اچھا ہے!', 'آسمان نیلا ہے'], cloudy: ['ابر آلود', 'بارش ہوگی?'] },
  hi: { rain: ['बारिश हो रही है!', 'छाता चाहिए', 'भीगना नहीं चाहता'], snow: ['बर्फ पड़ रही है!', 'बर्फ में खेलना चाहता हूं'], hot: ['बहुत गर्मी है!', 'पानी चाहिए', 'एसी चलाओ'], cold: ['सर्दी है!', 'जैकेट चाहिए'], freezing: ['जमा देने वाली सर्दी!', 'बहुत ठंडा'], wind: ['बहुत हवा है!', 'टोपी उड़ जाएगी'], storm: ['तूफान है!', 'गरज से डर लगता है'], clear: ['आज मौसम अच्छा है!', 'आसमान नीला है'], cloudy: ['बादल हैं', 'बारिश होगी?'] },
  it: { rain: ['Sta piovendo!', 'Ho bisogno di un ombrello', 'Non voglio bagnarmi'], snow: ['Sta nevicando!', 'Voglio giocare nella neve'], hot: ['Fa molto caldo!', 'Ho bisogno di acqua', 'Possiamo accendere l\'aria?'], cold: ['Fa freddo!', 'Ho bisogno di una giacca'], freezing: ['Sta gelando!', 'Troppo freddo'], wind: ['C\'è molto vento!', 'Il mio cappello volerà via'], storm: ['C\'è un temporale!', 'Ho paura dei tuoni'], clear: ['Bel tempo oggi!', 'Il cielo è blu'], cloudy: ['È nuvoloso', 'Pioverà?'] },
  pl: { rain: ['Pada deszcz!', 'Potrzebuję parasola', 'Nie chcę się zmoczyć'], snow: ['Pada śnieg!', 'Chcę bawić się w śniegu'], hot: ['Jest bardzo gorąco!', 'Potrzebuję wody', 'Czy możemy włączyć klimatyzację?'], cold: ['Jest zimno!', 'Potrzebuję kurtki'], freezing: ['Jest mróz!', 'Za zimno'], wind: ['Jest bardzo wietrznie!', 'Mój kapelusz odleci'], storm: ['Jest burza!', 'Boję się grzmotów'], clear: ['Ładna pogoda dziś!', 'Niebo jest niebieskie'], cloudy: ['Jest pochmurno', 'Będzie padać?'] },
  uk: { rain: ['Йде дощ!', 'Потрібна парасолька', 'Не хочу мокнути'], snow: ['Йде сніг!', 'Хочу грати в снігу'], hot: ['Дуже жарко!', 'Потрібна вода', 'Можна включити кондиціонер?'], cold: ['Холодно!', 'Потрібна куртка'], freezing: ['Мороз!', 'Занадто холодно'], wind: ['Дуже вітряно!', 'Мій капелюх злетить'], storm: ['Буря!', 'Боюся грому'], clear: ['Гарна погода сьогодні!', 'Небо блакитне'], cloudy: ['Хмарно', 'Буде дощ?'] },
  ro: { rain: ['Plouă!', 'Am nevoie de umbrelă', 'Nu vreau să mă ud'], snow: ['Ninge!', 'Vreau să mă joc în zăpadă'], hot: ['E foarte cald!', 'Am nevoie de apă', 'Putem porni aerul condiționat?'], cold: ['E frig!', 'Am nevoie de jachetă'], freezing: ['Îngheață!', 'Prea frig'], wind: ['E foarte vânt!', 'Pălăria mea va zbura'], storm: ['E furtună!', 'Mi-e frică de tunet'], clear: ['Vreme frumoasă azi!', 'Cerul e albastru'], cloudy: ['E înnorat', 'Va ploua?'] },
  nl: { rain: ['Het regent!', 'Ik heb een paraplu nodig', 'Ik wil niet nat worden'], snow: ['Het sneeuwt!', 'Ik wil in de sneeuw spelen'], hot: ['Het is zo heet!', 'Ik heb water nodig', 'Kunnen we de airco aanzetten?'], cold: ['Het is koud!', 'Ik heb een jas nodig'], freezing: ['Het vriest!', 'Te koud'], wind: ['Het is zo winderig!', 'Mijn hoed waait weg'], storm: ['Er is storm!', 'Ik ben bang voor donder'], clear: ['Mooi weer vandaag!', 'De lucht is blauw'], cloudy: ['Het is bewolkt', 'Gaat het regenen?'] },
  vi: { rain: ['Trời đang mưa!', 'Con cần ô', 'Con không muốn bị ướt'], snow: ['Tuyết rơi!', 'Con muốn chơi tuyết'], hot: ['Nóng quá!', 'Con cần nước', 'Bật điều hòa được không?'], cold: ['Lạnh quá!', 'Con cần áo khoác'], freezing: ['Đóng băng!', 'Lạnh quá'], wind: ['Gió to quá!', 'Mũ sẽ bay mất'], storm: ['Có bão!', 'Con sợ sấm'], clear: ['Thời tiết đẹp!', 'Trời xanh quá'], cloudy: ['Trời u ám', 'Sẽ mưa không?'] },
  tr: { rain: ['Yağmur yağıyor!', 'Şemsiye lazım', 'Islanmak istemiyorum'], snow: ['Kar yağıyor!', 'Karda oynamak istiyorum'], hot: ['Çok sıcak!', 'Su lazım', 'Klimayı açabilir miyiz?'], cold: ['Soğuk!', 'Ceket lazım'], freezing: ['Dondurucu!', 'Çok soğuk'], wind: ['Çok rüzgarlı!', 'Şapkam uçacak'], storm: ['Fırtına var!', 'Gök gürültüsünden korkuyorum'], clear: ['Bugün hava güzel!', 'Gökyüzü mavi'], cloudy: ['Bulutlu', 'Yağmur yağacak mı?'] },
};

export function getWeatherPhrasesForLanguage(
  language: SupportedLanguage,
  weather: { condition: string; isRaining: boolean; isSnowing: boolean; temperature: number; windSpeed: number }
): string[] {
  const phrases: string[] = [];
  const langPhrases = WEATHER_PHRASES[language] || WEATHER_PHRASES.en;

  if (weather.isRaining && langPhrases.rain) {
    phrases.push(...langPhrases.rain.slice(0, 2));
  }
  if (weather.isSnowing && langPhrases.snow) {
    phrases.push(...langPhrases.snow.slice(0, 2));
  }
  if (weather.temperature >= 30 && langPhrases.hot) {
    phrases.push(...langPhrases.hot.slice(0, 2));
  } else if (weather.temperature <= 0 && langPhrases.freezing) {
    phrases.push(...langPhrases.freezing.slice(0, 2));
  } else if (weather.temperature <= 10 && langPhrases.cold) {
    phrases.push(...langPhrases.cold.slice(0, 2));
  }
  if (weather.windSpeed >= 30 && langPhrases.wind) {
    phrases.push(...langPhrases.wind.slice(0, 2));
  }
  if (weather.condition === 'storm' && langPhrases.storm) {
    phrases.push(...langPhrases.storm.slice(0, 2));
  }
  if (weather.condition === 'clear' && langPhrases.clear) {
    phrases.push(...langPhrases.clear.slice(0, 1));
  }
  if (weather.condition === 'cloudy' && langPhrases.cloudy) {
    phrases.push(...langPhrases.cloudy.slice(0, 1));
  }

  return phrases;
}

export function getLocationPhrasesForLanguage(
  language: SupportedLanguage,
  locationType: string,
  timeOfDay: string,
  season?: string,
  dayOfWeek?: string
): string[] {
  const basePhrases = LOCATION_PHRASE_TRANSLATIONS[language]?.[locationType]?.[timeOfDay] ||
         LOCATION_PHRASE_TRANSLATIONS[language]?.unknown?.[timeOfDay] ||
         LOCATION_PHRASE_TRANSLATIONS.en[locationType]?.[timeOfDay] ||
         LOCATION_PHRASE_TRANSLATIONS.en.unknown[timeOfDay] ||
         [];
  
  const result: string[] = [...basePhrases];
  
  if (season && SEASONAL_PHRASES[language]?.[season as SeasonType]?.[timeOfDay]) {
    const seasonalPhrases = SEASONAL_PHRASES[language][season as SeasonType][timeOfDay];
    result.push(...seasonalPhrases);
  }
  
  if (dayOfWeek === 'weekend' && WEEKEND_PHRASES[language]?.[timeOfDay]) {
    const weekendPhrases = WEEKEND_PHRASES[language][timeOfDay];
    result.push(...weekendPhrases);
  }
  
  return result;
}

export function getCopingPhrasesForLanguage(language: SupportedLanguage, emotion: string): string[] {
  return COPING_PHRASE_TRANSLATIONS[language]?.[emotion] || COPING_PHRASE_TRANSLATIONS.en[emotion] || [];
}

export function getQuickResponsesForLanguage(language: SupportedLanguage): string[] {
  return QUICK_RESPONSE_TRANSLATIONS[language] || QUICK_RESPONSE_TRANSLATIONS.en;
}

export function getEmergencyPhrasesForLanguage(language: SupportedLanguage): string[] {
  return EMERGENCY_TRANSLATIONS[language] || EMERGENCY_TRANSLATIONS.en;
}

export function getCommonPhrasesForLanguage(language: SupportedLanguage, timeOfDay: string): string[] {
  return LOCATION_PHRASE_TRANSLATIONS[language]?.unknown?.[timeOfDay] || 
         LOCATION_PHRASE_TRANSLATIONS.en.unknown[timeOfDay] || 
         [];
}
