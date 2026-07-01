(function () {
  const config = window.GG_CONFIG || {};

  const COLLECTION_ORDER = [
    "profile",
    "announcements",
    "fixtures",
    "results",
    "highlights",
    "media",
  ];

  const DEFAULT_PROFILE = {
    id: "profile-main",
    collection: "profile",
    title: "ဂရိတ်တက်စ် ဂလိုရီ ဘောလုံးအသင်း",
    slug: "club-profile",
    heroTitle: "စည်းကမ်း၊ ဇွဲနဲ့ အနိုင်ရရေးဆီ လှမ်းနေတဲ့ အသင်းသစ်",
    heroText:
      "Greatest Glory FC ဟာ စနစ်တကျတည်ဆောက်ထားတဲ့ အသင်းယဉ်ကျေးမှု၊ လူငယ်ဖွံ့ဖြိုးရေးနဲ့ ရဲရဲဝံ့ဝံ့ တိုက်စစ်ဘောလုံးကစားဟန်ကို အခြေခံပြီး တည်ဆောက်နေတဲ့ အသင်းသစ်တစ်သင်းပါ။",
    summary:
      "ဒေသခံအခြေခံကနေ စတင်ပြီး ကွင်းတွင်းကွင်းပြင် နှစ်ဖက်စလုံးမှာ လေးစားမှုရတဲ့ အသင်းတစ်သင်းအဖြစ် တိုးတက်လာဖို့ ရည်ရွယ်ထားတဲ့ ဘောလုံးအသင်းသစ်ပါ။",
    body:
      "Greatest Glory Football Club ကို တည်ဆောက်ရတဲ့ ရည်ရွယ်ချက်ကတော့ အားထုတ်မှုရှိတဲ့ ကစားသမားတွေ၊ ပရိသတ်တွေ၊ volunteer တွေကို ခေတ်မီဘောလုံးစီမံကိန်းတစ်ခုအောက်မှာ စုစည်းနိုင်ဖို့ပါ။ အသင်းက အခုမှ အစပြုနေသေးပေမယ့် ရည်ရွယ်ချက်က ရှင်းပါတယ်။ ခိုင်မာတဲ့ ယဉ်ကျေးမှုတည်ဆောက်မယ်၊ အရည်အချင်းရှိတဲ့ ကစားသမားတွေ ဖွံ့ဖြိုးစေမယ်၊ ဒေသခံတွေ တကယ်စိတ်ဝင်စားမယ့် ပွဲနေ့အတွေ့အကြုံကို ဖန်တီးမယ်။",
    motto: "ရည်ရွယ်ချက်နဲ့ တက်လှမ်းမယ်",
    foundedYear: "၂၀၂၆",
    city: "ရန်ကုန်",
    ground: "ဂလိုရီ အားကစားကွင်း",
    contactEmail: "hello@greatestgloryfc.club",
    contactPhone: "+95 9 000 000 000",
    facebookUrl: "https://facebook.com/",
    youtubeUrl: "https://youtube.com/",
    instagramUrl: "https://instagram.com/",
    createdAt: "2026-06-29T00:00:00.000Z",
    updatedAt: "2026-06-29T00:00:00.000Z",
  };

  const EMPTY_PROFILE = {
    id: "",
    collection: "profile",
    title: "",
    slug: "",
    heroTitle: "",
    heroText: "",
    summary: "",
    body: "",
    motto: "",
    foundedYear: "",
    city: "",
    ground: "",
    contactEmail: "",
    contactPhone: "",
    facebookUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
    createdAt: "",
    updatedAt: "",
  };

  const SEED_RECORDS = [
    DEFAULT_PROFILE,
    {
      id: "announce-launch",
      collection: "announcements",
      title: "အသင်းမိတ်ဆက်ပွဲနှင့် ပရိသတ်စာရင်း စတင်ဖွင့်လှစ်လိုက်ပါပြီ",
      slug: "club-launch-supporter-registration",
      badge: "အသင်းသတင်း",
      date: "2026-07-05",
      summary:
        "ပရိသတ်တွေဟာ ပွဲနေ့ update များ၊ volunteer အခွင့်အလမ်းများနဲ့ အသင်းသတင်းအစောပိုင်းတွေကို လက်ခံရရှိဖို့ အခုကတည်းက စာရင်းပေးသွင်းနိုင်ပါတယ်။",
      body:
        "Greatest Glory FC ရဲ့ public journey ကို အခုကစပြီး တရားဝင်စတင်လိုက်ပါတယ်။ အစောပိုင်းပရိသတ်တွေဟာ contact list ထဲ ပါဝင်နိုင်သလို ပွဲနေ့ကူညီမှု၊ event preparation နဲ့ အသင်းရဲ့ ပထမဦးဆုံးခရီးစဉ်ကို အနီးကပ်လိုက်ပါနိုင်ပါတယ်။",
      tags: "ပရိသတ်, မိတ်ဆက်, အသိုင်းအဝိုင်း",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "announce-trials",
      collection: "announcements",
      title: "ဒေသခံလူငယ်ကစားသမားများအတွက် trial day စီစဉ်ထားပါတယ်",
      slug: "open-trials-emerging-local-talent",
      badge: "Trial",
      date: "2026-07-12",
      summary:
        "စည်းကမ်းရှိတဲ့ အသင်းပတ်ဝန်းကျင်ထဲမှာ ကိုယ့်ကိုယ်ကို စမ်းသပ်ချင်တဲ့ လူငယ်ကစားသမားတွေကို အသင်းက ကြိုဆိုဖို့ စီစဉ်ထားပါတယ်။",
      body:
        "ကစားသမားအကဲဖြတ်မှုမှာ အားထုတ်နိုင်မှု၊ နေရာယူမှန်ကန်မှုနဲ့ coach နဲ့အတူ တိုးတက်နိုင်စွမ်းကို ဦးစားပေးကြည့်ရှုမယ်။ အသင်းကတော့ တိုးတက်မှုနဲ့ teamwork ကို အလေးထားတဲ့ ကစားသမားတွေကို အခြေခံပြီး တည်ဆောက်ချင်ပါတယ်။",
      tags: "လူငယ်, talent, trial",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "fixture-royal-tigers",
      collection: "fixtures",
      title: "ရာသီမစတင်မီ ခြေစမ်းပွဲ - ရွိုင်ယယ် တိုက်ဂါးစ် FC",
      slug: "pre-season-friendly-vs-royal-tigers-fc",
      status: "Scheduled",
      date: "2026-07-20",
      time: "16:00",
      opponent: "ရွိုင်ယယ် တိုက်ဂါးစ် FC",
      venue: "ဂလိုရီ အားကစားကွင်း",
      location: "ရန်ကုန်",
      competition: "ရာသီမစတင်မီ ခြေစမ်းပွဲ",
      summary:
        "အသင်းစုစည်းပုံ၊ pressing structure နဲ့ transition speed ကို စမ်းသပ်မယ့် ပရိသတ်ရှေ့ ပထမဆုံးပွဲပါ။",
      body:
        "ဒီပွဲက အသင်းရဲ့ ကစားဟန်အထောက်အထားကို ပထမဆုံးပြသမယ့်ပွဲလည်း ဖြစ်ပါတယ်။ ပရိသတ်တွေက အားမာန်ပြည့်တဲ့ ကစားပုံ၊ ရဲရဲတင်းတင်း pressing နဲ့ ပွဲအရှိန်ကို ကိုယ်တိုင်ထိန်းချုပ်ချင်တဲ့ စိတ်ဓာတ်ကို မြင်တွေ့ရမှာပါ။",
      tags: "ခြေစမ်း, အိမ်ကွင်း, pre-season",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "fixture-east-harbour",
      collection: "fixtures",
      title: "City Challenge Cup - အီစ့် ဟာဘား အက်သလက်တစ်",
      slug: "city-challenge-cup-vs-east-harbour-athletic",
      status: "Scheduled",
      date: "2026-07-30",
      time: "18:30",
      opponent: "အီစ့် ဟာဘား အက်သလက်တစ်",
      venue: "ဗစ်တရီ မြို့နယ်ကွင်း",
      location: "ရန်ကုန်",
      competition: "City Challenge Cup",
      summary:
        "ပိုပြီးပြိုင်ဆိုင်မှုပြင်းထန်တဲ့ ပွဲဖြစ်ပြီး အသင်းက ဖိအားအောက်မှာ ဘယ်လောက်မြန်မြန် လိုက်လျောညီထွေဖြစ်နိုင်မလဲ ဆိုတာကို စမ်းသပ်ပေးမယ့်ပွဲပါ။",
      body:
        "City Challenge Cup ပွဲမှာ အသင်းရဲ့ shape, mentality နဲ့ in-game discipline ကို ပိုမိုပြင်းထန်တဲ့ ပြိုင်ဘက်ရှေ့ စမ်းသပ်ခံရမှာ ဖြစ်ပါတယ်။",
      tags: "cup, အဝေးကွင်း, စမ်းသပ်",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "result-city-united",
      collection: "results",
      title: "လေ့ကျင့်ရေးပွဲ - စီးတီးယူနိုက်တက် U21",
      slug: "training-match-vs-city-united-u21",
      status: "Finished",
      date: "2026-06-21",
      time: "17:00",
      opponent: "စီးတီးယူနိုက်တက် U21",
      venue: "ဂလိုရီ အားကစားကွင်း",
      location: "ရန်ကုန်",
      competition: "လေ့ကျင့်ရေးပွဲ",
      score: "GGFC ၂ - ၁ စီးတီးယူနိုက်တက် U21",
      summary:
        "ဒုတိယပိုင်းမှာ ယုံကြည်မှုရှိရှိ ကစားနိုင်ခဲ့တာကြောင့် midfield structure နဲ့ wing combination ပိုင်းမှာ အလားအလာကောင်းတွေ မြင်ရပါတယ်။",
      body:
        "အစောပိုင်းဂိုးပေးခဲ့ရပေမယ့် Greatest Glory FC က ပြန်တုံ့ပြန်နိုင်ခဲ့ပြီး ပွဲပြီးခါနီးပိုင်းမှာ ပိုမိုအားကောင်းတဲ့ intensity ကို ပြသနိုင်ခဲ့ပါတယ်။ ဒါဟာ coaching staff တည်ဆောက်ချင်တဲ့ identity နဲ့ ကိုက်ညီပါတယ်။",
      tags: "အနိုင်, ဖွံ့ဖြိုးရေး, analysis",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "result-starline",
      collection: "results",
      title: "ပိတ်ကွင်းခြေစမ်းပွဲ - စတာလိုင်း FC",
      slug: "closed-door-friendly-vs-starline-fc",
      status: "Finished",
      date: "2026-06-14",
      time: "15:30",
      opponent: "စတာလိုင်း FC",
      venue: "Training Ground B",
      location: "ရန်ကုန်",
      competition: "ခြေစမ်းပွဲ",
      score: "GGFC ၁ - ၁ စတာလိုင်း FC",
      summary:
        "အသင်းက defensive discipline ကောင်းကောင်း ပြသနိုင်ခဲ့ပြီး shape ကိုလည်း ထိန်းထားနိုင်ခဲ့ပါတယ်။ ဒါပေမယ့် အခွင့်အရေးဖန်တီးပုံမှာ တိုးတက်စရာ ကျန်ပါသေးတယ်။",
      body:
        "ဒီသရေပွဲက line တွေအကြားအကွာအဝေး၊ final third ထဲက decision making ပိုင်းတွေကို coaching staff အတွက် အသုံးဝင်တဲ့ data ပေးနိုင်ခဲ့ပါတယ်။",
      tags: "ခြေစမ်း, analysis, သရေ",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "highlight-identity",
      collection: "highlights",
      title: "Greatest Glory FC ဘာကို ကိုယ်စားပြုချင်သလဲ",
      slug: "what-greatest-glory-fc-wants-to-stand-for",
      badge: "ထင်ရှားသတင်း",
      date: "2026-06-29",
      summary:
        "အသင်းကို စွမ်းအင်ပြည့်မှု၊ စည်းကမ်းရှိမှုနဲ့ အစကတည်းက အရေးကြီးစွာ ရည်ရွယ်ထားတဲ့ ကစားဟန်အတွက် လူသိများစေချင်ပါတယ်။",
      body:
        "ဒီ project က ရလဒ်တစ်ခုတည်းမဟုတ်ဘဲ identity အကြောင်းလည်း ဖြစ်ပါတယ်။ ရေရှည်မှာ ဒေသခံပရိသတ်တွေ ယုံကြည်နိုင်မယ့်၊ ပျော်ပျော်ပါးပါးအားပေးနိုင်မယ့်၊ ကိုယ်စားပြုလိုချင်မယ့် အသင်းတစ်သင်းဖြစ်လာဖို့ ရည်ရွယ်ထားပါတယ်။ ဒါကြောင့် လေ့ကျင့်ရေး၊ ဆက်သွယ်ရေးနဲ့ ပွဲနေ့ professionalism စတဲ့အချက်တွေကို အစကတည်းက စံနှုန်းထားပြီး လုပ်ဆောင်နေပါတယ်။",
      externalUrl: "",
      tags: "identity, ယဉ်ကျေးမှု, ရေရှည်",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "highlight-supporters",
      collection: "highlights",
      title: "အစကတည်းက ပရိသတ်ယဉ်ကျေးမှု ဘာကြောင့် အရေးကြီးသလဲ",
      slug: "why-the-supporter-culture-matters-this-early",
      badge: "ပရိသတ်",
      date: "2026-06-28",
      summary:
        "အသင်းနာမည်ကြီးလာမှ မဟုတ်ဘဲ အခုကတည်းက ခိုင်မာတဲ့ ဘောလုံးပတ်ဝန်းကျင်ကို တည်ဆောက်ရပါတယ်။ အငွေ့အသက်က အခုကစပါတယ်။",
      body:
        "Website, announcements နဲ့ media board တွေဟာ အသင်းသစ်တစ်သင်းကို စနစ်တကျရှိပြီး ယုံကြည်လောက်တယ်လို့ မြင်စေဖို့ အရေးကြီးပါတယ်။ ပရိသတ်ဆိုတာ အောင်မြင်ပြီးမှ ရောက်လာတာမဟုတ်ပါဘူး။ အောင်မြင်မှုဖြစ်လာဖို့ လိုအပ်တဲ့ ပတ်ဝန်းကျင်ကို ပထမကတည်းက တည်ဆောက်ပေးသူတွေပါ။",
      externalUrl: "",
      tags: "ပရိသတ်, media, launch",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "media-crest",
      collection: "media",
      title: "အသင်းလိုဂို အတည်ပြုပုံ",
      slug: "official-club-crest",
      mediaType: "image",
      date: "2026-06-29",
      summary:
        "အသင်းရဲ့ ပထမဆုံး visual identity ဖြစ်ပြီး match graphic များနဲ့ branded material များအတွက် အခြေခံအမှတ်အသားအဖြစ် သုံးနိုင်ပါတယ်။",
      fileUrl: "assets/images/logo.png",
      fileName: "logo.png",
      tags: "branding, crest, ပုံ",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
    {
      id: "media-sponsor-pack",
      collection: "media",
      title: "နောက်ပိုင်း sponsor presentation နေရာ",
      slug: "future-sponsor-presentation-slot",
      mediaType: "document",
      date: "2026-06-29",
      summary:
        "နောက်ပိုင်းမှာ admin panel ကနေ upload လုပ်ထားတဲ့ Google Drive PDF, Excel budget file, partnership proposal စတဲ့ဖိုင်တွေကို ဒီနေရာမှာ ပြနိုင်ပါတယ်။",
      externalUrl: "",
      tags: "စာရွက်စာတမ်း, sponsorship, drive",
      createdAt: "2026-06-29T00:00:00.000Z",
      updatedAt: "2026-06-29T00:00:00.000Z",
    },
  ];

  const COLLECTION_DEFINITIONS = {
    profile: {
      label: "အသင်းမိတ်ဆက်",
      description: "Homepage ပေါ်မှာ ပြမယ့် အသင်းရဲ့ အဓိကအချက်အလက်တွေကို ဒီနေရာမှာ စီမံနိုင်ပါတယ်။",
      allowMultiple: false,
      fields: [
        { name: "title", label: "အသင်းနာမည်", type: "text", required: true, placeholder: "ဥပမာ - ဂရိတ်တက်စ် ဂလိုရီ ဘောလုံးအသင်း" },
        { name: "heroTitle", label: "Hero ခေါင်းစဉ်", type: "text", required: true, placeholder: "အပေါ်ဆုံး section မှာ ပြမယ့် ခေါင်းစဉ်" },
        { name: "heroText", label: "Hero စာသား", type: "textarea", required: true, placeholder: "ပင်မစာမျက်နှာထိပ်မှာ အကျဉ်းချုပ်မိတ်ဆက်ရေးပါ" },
        { name: "summary", label: "အတိုချုပ်", type: "textarea", required: true, placeholder: "အသင်းကို အတိုချုပ် မိတ်ဆက်ပါ" },
        { name: "body", label: "အသင်းဇာတ်လမ်း", type: "textarea", required: true, placeholder: "အသင်းအကြောင်း ပိုရှည်ရှည်ရေးပါ" },
        { name: "motto", label: "ဆောင်ပုဒ်", type: "text", placeholder: "ဥပမာ - ရည်ရွယ်ချက်နဲ့ တက်လှမ်းမယ်" },
        { name: "foundedYear", label: "တည်ထောင်နှစ်", type: "text", placeholder: "၂၀၂၆" },
        { name: "city", label: "အခြေစိုက်မြို့", type: "text", placeholder: "ရန်ကုန်" },
        { name: "ground", label: "အိမ်ကွင်း", type: "text", placeholder: "ဂလိုရီ အားကစားကွင်း" },
        { name: "contactEmail", label: "ဆက်သွယ်ရန် အီးမေးလ်", type: "email", placeholder: "hello@greatestgloryfc.club" },
        { name: "contactPhone", label: "ဆက်သွယ်ရန် ဖုန်း", type: "text", placeholder: "+95 9 000 000 000" },
        { name: "facebookUrl", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/..." },
        { name: "youtubeUrl", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/..." },
        { name: "instagramUrl", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/..." },
      ],
    },
    announcements: {
      label: "အသင်းသတင်းများ",
      description: "Ticker row ပေါ်မှာ ပြမယ့် အသင်းသတင်း၊ launch note နဲ့ update များကို ဒီနေရာမှာ စီမံနိုင်ပါတယ်။",
      allowMultiple: true,
      fields: [
        { name: "title", label: "ခေါင်းစဉ်", type: "text", required: true, placeholder: "ဥပမာ - အသင်းမိတ်ဆက်ပွဲနှင့် ပရိသတ်စာရင်း စတင်ဖွင့်လှစ်လိုက်ပါပြီ" },
        { name: "slug", label: "Custom Slug", type: "text", placeholder: "မဖြည့်လျှင် စနစ်က အလိုအလျောက်ထုတ်ပေးမယ်" },
        { name: "badge", label: "Badge", type: "text", placeholder: "ဥပမာ - အသင်းသတင်း" },
        { name: "date", label: "ရက်စွဲ", type: "date" },
        { name: "summary", label: "အတိုချုပ်", type: "textarea", required: true, placeholder: "သတင်းအကြောင်းကို အတိုချုပ်ရေးပါ" },
        { name: "body", label: "အပြည့်အစုံ", type: "textarea", placeholder: "detail page အတွက် ပိုရှည်တဲ့စာသားရေးပါ" },
        { name: "tags", label: "Tag များ", type: "text", placeholder: "ပရိသတ်, မိတ်ဆက်, အသိုင်းအဝိုင်း" },
        { name: "externalUrl", label: "ပြင်ပ Link", type: "url", placeholder: "လိုအပ်ရင် public page (သို့) document link ထည့်ပါ" },
        { name: "file", label: "ဖိုင်တွဲမယ်", type: "file", accept: "image/*,video/*,audio/*,.pdf,.csv,.xlsx,.xls,.doc,.docx" },
      ],
    },
    fixtures: {
      label: "ပွဲစဉ်များ",
      description: "လာမယ့်ပွဲများအတွက် ရက်စွဲ၊ အချိန်၊ ပြိုင်ဘက်နဲ့ အသေးစိတ်အချက်အလက်တွေကို ဒီနေရာမှာ စီမံနိုင်ပါတယ်။",
      allowMultiple: true,
      fields: [
        { name: "title", label: "ပွဲခေါင်းစဉ်", type: "text", required: true, placeholder: "ဥပမာ - ရာသီမစတင်မီ ခြေစမ်းပွဲ - ရွိုင်ယယ် တိုက်ဂါးစ် FC" },
        { name: "slug", label: "Custom Slug", type: "text", placeholder: "မဖြည့်လျှင် စနစ်က အလိုအလျောက်ထုတ်ပေးမယ်" },
        { name: "status", label: "အခြေအနေ", type: "select", options: ["Scheduled", "Postponed", "Live", "Completed"] },
        { name: "date", label: "ရက်စွဲ", type: "date" },
        { name: "time", label: "ပွဲစချိန်", type: "time" },
        { name: "opponent", label: "ပြိုင်ဘက်အသင်း", type: "text", placeholder: "ဥပမာ - ရွိုင်ယယ် တိုက်ဂါးစ် FC" },
        { name: "venue", label: "ကွင်း", type: "text", placeholder: "ဂလိုရီ အားကစားကွင်း" },
        { name: "location", label: "မြို့ / နေရာ", type: "text", placeholder: "ရန်ကုန်" },
        { name: "competition", label: "ပြိုင်ပွဲအမည်", type: "text", placeholder: "ရာသီမစတင်မီ ခြေစမ်းပွဲ" },
        { name: "summary", label: "အတိုချုပ်", type: "textarea", placeholder: "ပွဲအကြောင်း အတိုချုပ်ရေးပါ" },
        { name: "body", label: "အသေးစိတ်", type: "textarea", placeholder: "ပွဲမတိုင်ခင် preview (သို့) ပိုရှည်တဲ့စာသားရေးပါ" },
        { name: "tags", label: "Tag များ", type: "text", placeholder: "ခြေစမ်း, အိမ်ကွင်း, pre-season" },
        { name: "externalUrl", label: "ပြင်ပ Link", type: "url", placeholder: "လိုအပ်ရင် ticket, livestream (သို့) reference link ထည့်ပါ" },
      ],
    },
    results: {
      label: "ရလဒ်များ",
      description: "ပြီးဆုံးထားတဲ့ပွဲရလဒ်နဲ့ ပွဲအစီရင်ခံစာအတိုချုပ်တွေကို ဒီနေရာမှာ တင်နိုင်ပါတယ်။",
      allowMultiple: true,
      fields: [
        { name: "title", label: "ပွဲခေါင်းစဉ်", type: "text", required: true, placeholder: "ဥပမာ - လေ့ကျင့်ရေးပွဲ - စီးတီးယူနိုက်တက် U21" },
        { name: "slug", label: "Custom Slug", type: "text", placeholder: "မဖြည့်လျှင် စနစ်က အလိုအလျောက်ထုတ်ပေးမယ်" },
        { name: "status", label: "အခြေအနေ", type: "select", options: ["Finished", "Abandoned", "Awarded"] },
        { name: "date", label: "ရက်စွဲ", type: "date" },
        { name: "time", label: "ပွဲစချိန်", type: "time" },
        { name: "opponent", label: "ပြိုင်ဘက်အသင်း", type: "text", placeholder: "ဥပမာ - စီးတီးယူနိုက်တက် U21" },
        { name: "venue", label: "ကွင်း", type: "text", placeholder: "ဂလိုရီ အားကစားကွင်း" },
        { name: "location", label: "မြို့ / နေရာ", type: "text", placeholder: "ရန်ကုန်" },
        { name: "competition", label: "ပြိုင်ပွဲအမည်", type: "text", placeholder: "လေ့ကျင့်ရေးပွဲ" },
        { name: "score", label: "ရလဒ်စာကြောင်း", type: "text", placeholder: "GGFC ၂ - ၁ စီးတီးယူနိုက်တက် U21" },
        { name: "summary", label: "အတိုချုပ်", type: "textarea", placeholder: "ရလဒ်အကြောင်း အတိုချုပ်ရေးပါ" },
        { name: "body", label: "ပွဲအစီရင်ခံစာ", type: "textarea", placeholder: "ပွဲအပြီး analysis (သို့) အစီရင်ခံစာကို ပိုရှည်ရှည်ရေးပါ" },
        { name: "tags", label: "Tag များ", type: "text", placeholder: "အနိုင်, ဖွံ့ဖြိုးရေး, analysis" },
        { name: "externalUrl", label: "ပြင်ပ Link", type: "url", placeholder: "လိုအပ်ရင် report (သို့) highlight link ထည့်ပါ" },
      ],
    },
    highlights: {
      label: "ထင်ရှားသတင်းများ",
      description: "Feature story, video, spotlight content နဲ့ အသင်းရဲ့ အရေးကြီးတဲ့ update များကို ဒီနေရာမှာ ထည့်နိုင်ပါတယ်။",
      allowMultiple: true,
      fields: [
        { name: "title", label: "ခေါင်းစဉ်", type: "text", required: true, placeholder: "ဥပမာ - Greatest Glory FC ဘာကို ကိုယ်စားပြုချင်သလဲ" },
        { name: "slug", label: "Custom Slug", type: "text", placeholder: "မဖြည့်လျှင် စနစ်က အလိုအလျောက်ထုတ်ပေးမယ်" },
        { name: "badge", label: "Badge", type: "text", placeholder: "ဥပမာ - ထင်ရှားသတင်း" },
        { name: "date", label: "ရက်စွဲ", type: "date" },
        { name: "summary", label: "အတိုချုပ်", type: "textarea", required: true, placeholder: "Highlight အကြောင်း အတိုချုပ်ရေးပါ" },
        { name: "body", label: "အသေးစိတ်", type: "textarea", placeholder: "article စာသားကို ပိုရှည်ရှည်ရေးပါ" },
        { name: "externalUrl", label: "Video / Article Link", type: "url", placeholder: "YouTube, Drive (သို့) public link တစ်ခုခုထည့်ပါ" },
        { name: "tags", label: "Tag များ", type: "text", placeholder: "identity, ယဉ်ကျေးမှု, launch" },
        { name: "file", label: "ဖိုင်တွဲမယ်", type: "file", accept: "image/*,video/*,audio/*,.pdf" },
      ],
    },
    media: {
      label: "မီဒီယာဘုတ်",
      description: "ပုံ၊ ဗီဒီယို၊ အသံ၊ document နဲ့ Google Drive အခြေခံ asset များကို ဒီနေရာမှာ စုစည်းနိုင်ပါတယ်။",
      allowMultiple: true,
      fields: [
        { name: "title", label: "ခေါင်းစဉ်", type: "text", required: true, placeholder: "ဥပမာ - အသင်းလိုဂို အတည်ပြုပုံ" },
        { name: "slug", label: "Custom Slug", type: "text", placeholder: "မဖြည့်လျှင် စနစ်က အလိုအလျောက်ထုတ်ပေးမယ်" },
        { name: "mediaType", label: "မီဒီယာအမျိုးအစား", type: "select", options: ["image", "video", "audio", "document", "link"] },
        { name: "date", label: "ရက်စွဲ", type: "date" },
        { name: "summary", label: "အတိုချုပ်", type: "textarea", required: true, placeholder: "မီဒီယာအကြောင်း အတိုချုပ်ရေးပါ" },
        { name: "externalUrl", label: "ပြင်ပ Link", type: "url", placeholder: "Google Drive (သို့) public URL တစ်ခု ထည့်ပါ" },
        { name: "tags", label: "Tag များ", type: "text", placeholder: "branding, crest, ပုံ" },
        { name: "file", label: "ဖိုင် upload လုပ်မယ်", type: "file", accept: "image/*,video/*,audio/*,.pdf,.csv,.xlsx,.xls,.doc,.docx" },
      ],
    },
  };

  const UNIVERSAL_FILE_ACCEPT = "image/*,video/*,audio/*,.pdf,.csv,.xlsx,.xls,.doc,.docx";

  [
    { collection: "fixtures", field: { name: "file", label: "File Upload", type: "file", accept: UNIVERSAL_FILE_ACCEPT } },
    { collection: "results", field: { name: "file", label: "File Upload", type: "file", accept: UNIVERSAL_FILE_ACCEPT } },
  ].forEach(function (entry) {
    const definition = COLLECTION_DEFINITIONS[entry.collection];
    if (!definition || !Array.isArray(definition.fields)) {
      return;
    }

    const hasFileField = definition.fields.some(function (field) {
      return field.type === "file";
    });

    if (!hasFileField) {
      definition.fields.push(entry.field);
    }
  });

  ["announcements", "highlights", "media"].forEach(function (collectionName) {
    const definition = COLLECTION_DEFINITIONS[collectionName];
    if (!definition || !Array.isArray(definition.fields)) {
      return;
    }

    definition.fields.forEach(function (field) {
      if (field.type === "file") {
        field.accept = UNIVERSAL_FILE_ACCEPT;
      }
    });
  });

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function uid(prefix) {
    return [prefix || "ggfc", Date.now().toString(36), Math.random().toString(36).slice(2, 8)].join("-");
  }

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function textToHtml(value) {
    return String(value || "")
      .split(/\n+/)
      .filter(Boolean)
      .map(function (line) {
        return "<p>" + escapeHtml(line) + "</p>";
      })
      .join("");
  }

  function truncate(value, maxLength) {
    const text = String(value || "");
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, Math.max(0, maxLength - 3)).trimEnd() + "...";
  }

  function parseTags(value) {
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }
    return String(value || "")
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function joinTags(value) {
    return parseTags(value).join(", ");
  }

  function toMyanmarDigits(value) {
    return String(value == null ? "" : value).replace(/\d/g, function (digit) {
      return "၀၁၂၃၄၅၆၇၈၉"[Number(digit)];
    });
  }

  function formatDate(value) {
    if (!value) {
      return "";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return toMyanmarDigits(value);
    }
    try {
      return new Intl.DateTimeFormat("my-MM", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(parsed);
    } catch (error) {
      return toMyanmarDigits(
        parsed.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      );
    }
  }

  function formatTime(value) {
    if (!value) {
      return "";
    }
    const parts = String(value).split(":");
    if (parts.length < 2) {
      return toMyanmarDigits(value);
    }
    return toMyanmarDigits(parts[0].padStart(2, "0") + ":" + parts[1].padStart(2, "0"));
  }

  function formatDateTime(dateValue, timeValue) {
    const dateText = formatDate(dateValue);
    const timeText = formatTime(timeValue);
    if (!dateText && !timeText) {
      return "";
    }
    return [dateText, timeText].filter(Boolean).join(" | ");
  }

  function sortRecords(records, collection) {
    const list = clone(records || []);
    const order = collection === "fixtures" ? 1 : -1;
    return list.sort(function (left, right) {
      const leftValue = new Date(left.date || left.createdAt || 0).getTime();
      const rightValue = new Date(right.date || right.createdAt || 0).getTime();
      return (leftValue - rightValue) * order;
    });
  }

  function inferMediaType(mimeType, fallback) {
    if (fallback) {
      return fallback;
    }
    if (!mimeType) {
      return "document";
    }
    if (mimeType.startsWith("image/")) {
      return "image";
    }
    if (mimeType.startsWith("video/")) {
      return "video";
    }
    if (mimeType.startsWith("audio/")) {
      return "audio";
    }
    return "document";
  }

  const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "avif"];
  const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov", "m4v", "mkv"];
  const AUDIO_EXTENSIONS = ["mp3", "wav", "ogg", "aac", "m4a", "flac"];
  const DOCUMENT_EXTENSIONS = ["pdf", "csv", "xlsx", "xls", "doc", "docx", "ppt", "pptx", "txt"];
  const ACCEPT_LABELS = {
    "image/*": "JPG, PNG, GIF, WEBP, SVG",
    "video/*": "MP4, WEBM, MOV",
    "audio/*": "MP3, WAV, AAC, M4A",
    ".pdf": "PDF",
    ".csv": "CSV",
    ".xlsx": "XLSX",
    ".xls": "XLS",
    ".doc": "DOC",
    ".docx": "DOCX",
    ".ppt": "PPT",
    ".pptx": "PPTX",
    ".txt": "TXT",
  };

  function cleanUrl(value) {
    return String(value || "").trim();
  }

  function getFileExtension(value) {
    const normalized = cleanUrl(value).split("?")[0].split("#")[0];
    const match = normalized.match(/\.([a-z0-9]+)$/i);
    return match ? match[1].toLowerCase() : "";
  }

  function startsWithDataType(url, prefix) {
    return new RegExp("^data:" + prefix.replace("/", "\\/"), "i").test(cleanUrl(url));
  }

  function hasExtension(value, extensions) {
    const extension = getFileExtension(value);
    return Boolean(extension && (extensions || []).indexOf(extension) >= 0);
  }

  function splitAcceptTokens(accept) {
    return String(accept || "")
      .split(",")
      .map(function (token) {
        return token.trim().toLowerCase();
      })
      .filter(Boolean);
  }

  function describeAcceptList(accept) {
    const tokens = splitAcceptTokens(accept);
    if (!tokens.length) {
      return "common file types";
    }

    const seen = {};
    return tokens
      .map(function (token) {
        return ACCEPT_LABELS[token] || token.replace(/^\./, "").toUpperCase();
      })
      .filter(function (label) {
        if (seen[label]) {
          return false;
        }
        seen[label] = true;
        return true;
      })
      .join(", ");
  }

  function formatFileSize(bytes) {
    const size = Number(bytes || 0);
    if (size <= 0) {
      return "0 B";
    }
    if (size < 1024) {
      return toMyanmarDigits(size) + " B";
    }
    if (size < 1024 * 1024) {
      return toMyanmarDigits((size / 1024).toFixed(size >= 10 * 1024 ? 0 : 1)) + " KB";
    }
    return toMyanmarDigits((size / (1024 * 1024)).toFixed(size >= 10 * 1024 * 1024 ? 0 : 1)) + " MB";
  }

  function describeFilePolicy(field, maxSize) {
    const limitText = formatFileSize(maxSize || 0);
    const acceptText = describeAcceptList(field && field.accept);
    return "Record တစ်ခုစီမှာ ဖိုင် ၁ ခုသာ တင်နိုင်ပြီး အများဆုံး " + limitText + " ထိ လက်ခံပါတယ်။ Allowed types: " + acceptText + "။";
  }

  function tokenMatchesFile(file, token) {
    const normalizedToken = String(token || "").trim().toLowerCase();
    if (!normalizedToken || !file) {
      return false;
    }

    const mimeType = String(file.type || "").toLowerCase();
    const extension = getFileExtension(file.name || "");

    if (normalizedToken === "image/*") {
      return mimeType.indexOf("image/") === 0 || IMAGE_EXTENSIONS.indexOf(extension) >= 0;
    }
    if (normalizedToken === "video/*") {
      return mimeType.indexOf("video/") === 0 || VIDEO_EXTENSIONS.indexOf(extension) >= 0;
    }
    if (normalizedToken === "audio/*") {
      return mimeType.indexOf("audio/") === 0 || AUDIO_EXTENSIONS.indexOf(extension) >= 0;
    }
    if (normalizedToken.charAt(0) === ".") {
      return normalizedToken.slice(1) === extension;
    }
    return mimeType === normalizedToken;
  }

  function validateFileSelection(file, field, maxSize) {
    if (!file) {
      return null;
    }

    const tokens = splitAcceptTokens(field && field.accept);
    if (tokens.length && !tokens.some(function (token) { return tokenMatchesFile(file, token); })) {
      throw new Error("`" + (file.name || "file") + "` ကို လက်မခံနိုင်ပါ။ " + describeAcceptList(field && field.accept) + " ကိုသာ တင်ပါ။");
    }

    if (file.size > maxSize) {
      throw new Error("`" + (file.name || "file") + "` က အရမ်းကြီးနေပါတယ်။ အများဆုံး " + formatFileSize(maxSize) + " ထိသာ တင်နိုင်ပါတယ်။");
    }

    return true;
  }

  function extractDriveFileId(url) {
    const normalized = cleanUrl(url);
    if (!normalized) {
      return "";
    }

    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/i,
      /[?&]id=([a-zA-Z0-9_-]+)/i,
      /\/d\/([a-zA-Z0-9_-]+)/i,
    ];

    for (let index = 0; index < patterns.length; index += 1) {
      const match = normalized.match(patterns[index]);
      if (match && match[1]) {
        return match[1];
      }
    }

    return "";
  }

  function buildDriveAssetUrls(fileId) {
    if (!fileId) {
      return {
        view: "",
        preview: "",
        download: "",
        image: "",
      };
    }

    return {
      view: "https://drive.google.com/file/d/" + encodeURIComponent(fileId) + "/view",
      preview: "https://drive.google.com/file/d/" + encodeURIComponent(fileId) + "/preview",
      download: "https://drive.google.com/uc?export=download&id=" + encodeURIComponent(fileId),
      image: "https://drive.google.com/uc?export=view&id=" + encodeURIComponent(fileId),
    };
  }

  function extractYouTubeId(url) {
    const normalized = cleanUrl(url);
    if (!normalized) {
      return "";
    }

    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/i,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/i,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/i,
      /youtu\.be\/([a-zA-Z0-9_-]{6,})/i,
    ];

    for (let index = 0; index < patterns.length; index += 1) {
      const match = normalized.match(patterns[index]);
      if (match && match[1]) {
        return match[1];
      }
    }

    return "";
  }

  function buildYouTubeEmbedUrl(videoId) {
    return videoId ? "https://www.youtube.com/embed/" + encodeURIComponent(videoId) : "";
  }

  function isImage(url, mediaType) {
    return startsWithDataType(url, "image/") || mediaType === "image" || hasExtension(url, IMAGE_EXTENSIONS);
  }

  function isVideo(url, mediaType) {
    return startsWithDataType(url, "video/") || mediaType === "video" || hasExtension(url, VIDEO_EXTENSIONS);
  }

  function isAudio(url, mediaType) {
    return startsWithDataType(url, "audio/") || mediaType === "audio" || hasExtension(url, AUDIO_EXTENSIONS);
  }

  function isDocument(url, mediaType, fileName) {
    return startsWithDataType(url, "application/pdf") || mediaType === "document" || hasExtension(url, DOCUMENT_EXTENSIONS) || hasExtension(fileName, DOCUMENT_EXTENSIONS);
  }

  function actionLabelForMediaType(mediaType) {
    if (mediaType === "image") {
      return "ပုံကိုဖွင့်မယ်";
    }
    if (mediaType === "video") {
      return "ဗီဒီယိုကိုကြည့်မယ်";
    }
    if (mediaType === "audio") {
      return "အသံဖိုင်ကိုနားထောင်မယ်";
    }
    if (mediaType === "document") {
      return "ဖိုင်ကိုဖွင့်မယ်";
    }
    return "ပြင်ပ link ကိုဖွင့်မယ်";
  }

  function resolveRecordAsset(record) {
    const fileUrl = cleanUrl(record && record.fileUrl);
    const externalUrl = cleanUrl(record && record.externalUrl);
    const primaryUrl = fileUrl || externalUrl;
    const fileName = String((record && record.fileName) || "");
    const mediaType = String((record && record.mediaType) || "").toLowerCase();
    const actions = [];

    if (!primaryUrl) {
      return {
        kind: "empty",
        mediaType: mediaType,
        fileName: fileName,
        actions: actions,
      };
    }

    const driveId = extractDriveFileId(primaryUrl);
    const youtubeId = extractYouTubeId(primaryUrl);
    const typedImage = mediaType === "image";
    const typedVideo = mediaType === "video";
    const typedAudio = mediaType === "audio";
    const typedDocument = mediaType === "document";
    const directImage = startsWithDataType(primaryUrl, "image/") || hasExtension(primaryUrl, IMAGE_EXTENSIONS);
    const directVideo = startsWithDataType(primaryUrl, "video/") || hasExtension(primaryUrl, VIDEO_EXTENSIONS);
    const directAudio = startsWithDataType(primaryUrl, "audio/") || hasExtension(primaryUrl, AUDIO_EXTENSIONS);
    const looksImage = directImage || hasExtension(fileName, IMAGE_EXTENSIONS) || (driveId && typedImage);
    const looksVideo = directVideo || hasExtension(fileName, VIDEO_EXTENSIONS) || (driveId && typedVideo);
    const looksAudio = directAudio || hasExtension(fileName, AUDIO_EXTENSIONS) || (driveId && typedAudio);
    const looksDocument = isDocument(primaryUrl, driveId ? mediaType : typedDocument ? mediaType : "", fileName) || (driveId && typedDocument);

    if (youtubeId) {
      actions.push({ url: primaryUrl, label: "YouTube တွင်ဖွင့်မယ်" });
      if (fileUrl && externalUrl && fileUrl !== externalUrl) {
        actions.push({ url: externalUrl, label: "ပြင်ပ link ကိုဖွင့်မယ်" });
      }

      return {
        kind: "iframe",
        mediaType: "video",
        title: record && record.title,
        fileName: fileName,
        previewUrl: buildYouTubeEmbedUrl(youtubeId),
        primaryUrl: primaryUrl,
        note: "YouTube video ကို ဒီစာမျက်နှာထဲကနေ တိုက်ရိုက်ကြည့်နိုင်ပါတယ်။",
        previewLabel: "YouTube video",
        actions: actions,
      };
    }

    if (driveId) {
      const driveUrls = buildDriveAssetUrls(driveId);

      if (looksImage) {
        actions.push({ url: driveUrls.view, label: "Drive တွင်ဖွင့်မယ်" });
        actions.push({ url: driveUrls.download, label: "ဒေါင်းလုဒ်လုပ်မယ်" });
        if (externalUrl && externalUrl !== fileUrl) {
          actions.push({ url: externalUrl, label: "ပြင်ပ link ကိုဖွင့်မယ်" });
        }

        return {
          kind: "image",
          mediaType: mediaType || "image",
          title: record && record.title,
          fileName: fileName,
          previewUrl: driveUrls.image,
          primaryUrl: driveUrls.view,
          note: "Google Drive မှာသိမ်းထားတဲ့ ပုံကို preview ပြထားပါတယ်။",
          previewLabel: "Google Drive image",
          actions: actions,
        };
      }

      if (looksVideo || looksAudio || looksDocument || mediaType === "link" || !mediaType) {
        actions.push({ url: driveUrls.view, label: actionLabelForMediaType(looksAudio ? "audio" : looksDocument ? "document" : looksVideo ? "video" : mediaType) });
        actions.push({ url: driveUrls.download, label: "ဒေါင်းလုဒ်လုပ်မယ်" });
        if (externalUrl && externalUrl !== fileUrl) {
          actions.push({ url: externalUrl, label: "ပြင်ပ link ကိုဖွင့်မယ်" });
        }

        return {
          kind: "iframe",
          mediaType: looksAudio ? "audio" : looksDocument ? "document" : looksVideo ? "video" : mediaType,
          title: record && record.title,
          fileName: fileName,
          previewUrl: driveUrls.preview,
          primaryUrl: driveUrls.view,
          note: "Google Drive preview player နဲ့ ဒီစာမျက်နှာထဲမှာ ဖွင့်နိုင်အောင် ပြထားပါတယ်။",
          previewLabel: "Google Drive preview",
          actions: actions,
        };
      }
    }

    if (looksImage) {
      actions.push({ url: primaryUrl, label: "ပုံကို tab အသစ်နဲ့ဖွင့်မယ်" });
      if (externalUrl && externalUrl !== fileUrl) {
        actions.push({ url: externalUrl, label: "ပြင်ပ link ကိုဖွင့်မယ်" });
      }

      return {
        kind: "image",
        mediaType: mediaType || "image",
        title: record && record.title,
        fileName: fileName,
        previewUrl: primaryUrl,
        primaryUrl: primaryUrl,
        note: "Public image link ကို တိုက်ရိုက် preview ပြထားပါတယ်။",
        previewLabel: "Image preview",
        actions: actions,
      };
    }

    if (looksVideo) {
      actions.push({ url: primaryUrl, label: "ဗီဒီယိုကိုဖွင့်မယ်" });
      if (externalUrl && externalUrl !== fileUrl) {
        actions.push({ url: externalUrl, label: "ပြင်ပ link ကိုဖွင့်မယ်" });
      }

      return {
        kind: "video",
        mediaType: mediaType || "video",
        title: record && record.title,
        fileName: fileName,
        previewUrl: primaryUrl,
        primaryUrl: primaryUrl,
        note: "Direct video link ဖြစ်လို့ ဒီ page ထဲကနေ ဖွင့်နိုင်ပါတယ်။",
        previewLabel: "Video preview",
        actions: actions,
      };
    }

    if (looksAudio) {
      actions.push({ url: primaryUrl, label: "အသံဖိုင်ကိုဖွင့်မယ်" });
      if (externalUrl && externalUrl !== fileUrl) {
        actions.push({ url: externalUrl, label: "ပြင်ပ link ကိုဖွင့်မယ်" });
      }

      return {
        kind: "audio",
        mediaType: mediaType || "audio",
        title: record && record.title,
        fileName: fileName,
        previewUrl: primaryUrl,
        primaryUrl: primaryUrl,
        note: "Direct audio link ဖြစ်လို့ ဒီ page ထဲကနေ နားထောင်နိုင်ပါတယ်။",
        previewLabel: "Audio preview",
        actions: actions,
      };
    }

    if (looksDocument) {
      actions.push({ url: primaryUrl, label: "ဖိုင်ကိုဖွင့်မယ်" });
      return {
        kind: hasExtension(primaryUrl, ["pdf"]) || hasExtension(fileName, ["pdf"]) || startsWithDataType(primaryUrl, "application/pdf") ? "iframe" : "link",
        mediaType: mediaType || "document",
        title: record && record.title,
        fileName: fileName,
        previewUrl: primaryUrl,
        primaryUrl: primaryUrl,
        note: "Document link ဖြစ်လို့ ဖိုင် preview (သို့) ဖွင့်မယ့် ခလုတ်နဲ့ ပြထားပါတယ်။",
        previewLabel: "Document preview",
        actions: actions,
      };
    }

    actions.push({ url: primaryUrl, label: actionLabelForMediaType(mediaType || "link") });
    return {
      kind: "link",
      mediaType: mediaType || "link",
      title: record && record.title,
      fileName: fileName,
      previewUrl: "",
      primaryUrl: primaryUrl,
      note: "ဒီ public link က browser preview ကို အာမမခံနိုင်လို့ ဖွင့်မယ့် ခလုတ်နဲ့ ပြထားပါတယ်။",
      previewLabel: "External link",
      actions: actions,
    };
  }

  function createSeedData() {
    return { records: clone(SEED_RECORDS) };
  }

  function createEmptyData() {
    return { records: [] };
  }

  function normalizeRecord(collection, draft, existingRecord) {
    const current = existingRecord ? clone(existingRecord) : {};
    const title = draft.title || current.title || "ခေါင်းစဉ် မထည့်ရသေးပါ";
    const next = Object.assign({}, current, draft, {
      collection: collection,
      title: title,
      slug: draft.slug ? slugify(draft.slug) : current.slug || slugify(title || uid(collection)),
      tags: joinTags(draft.tags || current.tags || ""),
      updatedAt: nowIso(),
    });

    if (!next.id) {
      next.id = uid(collection);
    }

    if (!next.createdAt) {
      next.createdAt = next.updatedAt;
    }

    return next;
  }

  function serializeDataUrl(file, maxSize) {
    return new Promise(function (resolve, reject) {
      if (!file) {
        resolve(null);
        return;
      }

      if (file.size > maxSize) {
        reject(new Error("ရွေးထားတဲ့ဖိုင်က upload limit ထက် ပိုကြီးနေပါတယ်။"));
        return;
      }

      const reader = new FileReader();
      reader.onerror = function () {
        reject(new Error("ရွေးထားတဲ့ဖိုင်ကို ဖတ်မရပါ။"));
      };
      reader.onload = function () {
        const dataUrl = String(reader.result || "");
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: dataUrl,
          base64: dataUrl.includes(",") ? dataUrl.split(",")[1] : "",
        });
      };
      reader.readAsDataURL(file);
    });
  }

  class LocalAdapter {
    constructor(storageKey, options) {
      this.storageKey = storageKey;
      this.options = options || {};
    }

    createInitialData() {
      const shouldSeed = typeof this.options.seedEnabled === "function" ? this.options.seedEnabled() : true;
      if (shouldSeed && typeof this.options.seedFactory === "function") {
        return this.options.seedFactory();
      }
      if (typeof this.options.emptyFactory === "function") {
        return this.options.emptyFactory();
      }
      return { records: [] };
    }

    fetchAll() {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) {
        const initialData = this.createInitialData();
        this.saveAll(initialData);
        return initialData;
      }

      try {
        const parsed = JSON.parse(raw);
        if (!parsed || !Array.isArray(parsed.records)) {
          throw new Error("Local data format မမှန်ကန်ပါ။");
        }
        return parsed;
      } catch (error) {
        const initialData = this.createInitialData();
        this.saveAll(initialData);
        return initialData;
      }
    }

    saveAll(data) {
      window.localStorage.setItem(this.storageKey, JSON.stringify(data));
      return data;
    }

    async upsert(collection, record, options) {
      const data = this.fetchAll();
      const list = data.records.slice();
      const index = list.findIndex(function (item) {
        return item.id === record.id;
      });
      const existing = index >= 0 ? list[index] : null;
      const next = normalizeRecord(collection, record, existing);

      if (options && options.filePayload) {
        next.fileName = options.filePayload.name;
        next.fileUrl = options.filePayload.dataUrl || next.fileUrl || "";
        next.mediaType = inferMediaType(options.filePayload.type, next.mediaType);
      }

      if (collection === "profile") {
        const filtered = list.filter(function (item) {
          return item.collection !== "profile";
        });
        filtered.unshift(next);
        data.records = filtered;
      } else if (index >= 0) {
        list[index] = next;
        data.records = list;
      } else {
        list.push(next);
        data.records = list;
      }

      this.saveAll(data);
      return { records: data.records, record: next };
    }

    async remove(collection, id) {
      const data = this.fetchAll();
      data.records = data.records.filter(function (item) {
        return !(item.collection === collection && item.id === id);
      });
      this.saveAll(data);
      return { records: data.records };
    }
  }

  const APPS_SCRIPT_BRIDGE_CHANNEL = "GGFC_APPS_SCRIPT_BRIDGE_V1";
  const bridgeClientsById = {};
  const bridgeClientsByUrl = {};
  let bridgeListenerAttached = false;

  function buildAppsScriptUrl(url, action, extraParams) {
    const parsed = new URL(url, window.location.href);
    if (action) {
      parsed.searchParams.set("action", action);
    }

    Object.keys(extraParams || {}).forEach(function (key) {
      if (extraParams[key] == null || extraParams[key] === "") {
        return;
      }
      parsed.searchParams.set(key, String(extraParams[key]));
    });

    return parsed.toString();
  }

  function isBridgeBootstrapError(message) {
    return /bridge|iframe|postmessage|timed out|not ready|frame/i.test(String(message || ""));
  }

  class AppsScriptBridgeClient {
    constructor(url) {
      this.url = url;
      this.id = uid("bridge");
      this.frame = null;
      this.ready = false;
      this.readyPromise = null;
      this.readyResolver = null;
      this.readyRejecter = null;
      this.readyTimeoutId = 0;
      this.pending = {};

      bridgeClientsById[this.id] = this;
      AppsScriptBridgeClient.attachListener();
    }

    static attachListener() {
      if (bridgeListenerAttached) {
        return;
      }

      bridgeListenerAttached = true;
      window.addEventListener("message", function (event) {
        const message = event.data || {};
        if (!message || message.channel !== APPS_SCRIPT_BRIDGE_CHANNEL || !message.bridgeId) {
          return;
        }

        const client = bridgeClientsById[message.bridgeId];
        if (!client) {
          return;
        }

        client.handleMessage(message, event.source);
      });
    }

    static get(url) {
      const key = String(url || "").trim();
      if (!bridgeClientsByUrl[key]) {
        bridgeClientsByUrl[key] = new AppsScriptBridgeClient(key);
      }
      return bridgeClientsByUrl[key];
    }

    getFrameWindow() {
      return this.frame && this.frame.contentWindow ? this.frame.contentWindow : null;
    }

    ensureFrame() {
      if (this.frame && document.body.contains(this.frame)) {
        return this.frame;
      }

      const frame = document.createElement("iframe");
      frame.hidden = true;
      frame.tabIndex = -1;
      frame.setAttribute("aria-hidden", "true");
      frame.style.position = "absolute";
      frame.style.width = "0";
      frame.style.height = "0";
      frame.style.border = "0";
      frame.style.pointerEvents = "none";
      frame.src = buildAppsScriptUrl(this.url, "bridge", {
        bridgeId: this.id,
      });

      document.body.appendChild(frame);
      this.frame = frame;
      return frame;
    }

    resolveReady() {
      this.ready = true;
      if (this.readyTimeoutId) {
        window.clearTimeout(this.readyTimeoutId);
        this.readyTimeoutId = 0;
      }

      if (this.readyResolver) {
        this.readyResolver(true);
        this.readyResolver = null;
        this.readyRejecter = null;
      }
    }

    rejectReady(message) {
      this.ready = false;
      if (this.readyTimeoutId) {
        window.clearTimeout(this.readyTimeoutId);
        this.readyTimeoutId = 0;
      }

      if (this.readyRejecter) {
        this.readyRejecter(new Error(message || "Apps Script bridge not ready."));
      }

      this.readyPromise = null;
      this.readyResolver = null;
      this.readyRejecter = null;
    }

    async ensureReady() {
      if (this.ready) {
        return true;
      }

      if (!this.readyPromise) {
        const self = this;
        this.ensureFrame();
        this.readyPromise = new Promise(function (resolve, reject) {
          self.readyResolver = resolve;
          self.readyRejecter = reject;
          self.readyTimeoutId = window.setTimeout(function () {
            self.rejectReady("Apps Script bridge iframe timed out. Latest Code.gs ကို deploy ပြန်လုပ်ပြီး web app ကို update လုပ်ပါ။");
          }, 10000);
        });
      }

      return this.readyPromise;
    }

    handleMessage(message, sourceWindow) {
      if (sourceWindow !== this.getFrameWindow()) {
        return;
      }

      if (message.type === "ready") {
        this.resolveReady();
        return;
      }

      if (message.type !== "response" || !message.requestId) {
        return;
      }

      const pending = this.pending[message.requestId];
      if (!pending) {
        return;
      }

      window.clearTimeout(pending.timeoutId);
      delete this.pending[message.requestId];

      if (message.ok) {
        pending.resolve(message.data);
        return;
      }

      pending.reject(new Error(message.error || "Bridge request failed."));
    }

    async request(payload) {
      await this.ensureReady();

      const frameWindow = this.getFrameWindow();
      if (!frameWindow) {
        throw new Error("Apps Script bridge iframe မဖွင့်နိုင်ပါ။");
      }

      const requestId = uid("bridge-request");
      const self = this;

      return new Promise(function (resolve, reject) {
        const timeoutId = window.setTimeout(function () {
          delete self.pending[requestId];
          reject(new Error("Apps Script bridge response timed out."));
        }, 20000);

        self.pending[requestId] = {
          resolve: resolve,
          reject: reject,
          timeoutId: timeoutId,
        };

        frameWindow.postMessage(
          {
            channel: APPS_SCRIPT_BRIDGE_CHANNEL,
            bridgeId: self.id,
            type: "request",
            requestId: requestId,
            payload: payload || {},
          },
          "*"
        );
      });
    }
  }

  class AppsScriptAdapter {
    constructor(settings) {
      this.url = settings.url;
      this.adminKey = settings.adminKey || "";
      this.sessionToken = settings.sessionToken || "";
    }

    async request(method, payload) {
      if (!this.url) {
        throw new Error("Apps Script URL မဖြည့်ရသေးပါ။");
      }

      const normalizedPayload = method === "GET"
        ? { action: "list" }
        : Object.assign({}, payload || {});

      try {
        return await AppsScriptBridgeClient.get(this.url).request(normalizedPayload);
      } catch (error) {
        if (!isBridgeBootstrapError(error && error.message)) {
          throw error;
        }
      }

      return this.requestViaFetch(method, normalizedPayload);
    }

    async requestViaFetch(method, payload) {
      if (!this.url) {
        throw new Error("Apps Script URL မဖြည့်ရသေးပါ။");
      }

      const requestOptions = {
        method: method,
      };

      let url = this.url;
      if (method === "GET") {
        url = buildAppsScriptUrl(this.url, "list");
      } else {
        requestOptions.headers = {
          "Content-Type": "text/plain;charset=utf-8",
        };
        requestOptions.body = JSON.stringify(payload || {});
      }

      let response;
      try {
        response = await fetch(url, requestOptions);
      } catch (error) {
        throw new Error("Browser က Apps Script ကို မချိတ်ဆက်နိုင်ပါ။ Web app deployment, /exec URL နဲ့ access setting တွေကို စစ်ပေးပါ။");
      }

      if (!response.ok) {
        throw new Error("Remote request မအောင်မြင်ပါ။ Status code: " + response.status + "။");
      }

      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error || "Remote request မအောင်မြင်ပါ။");
      }

      return result.data;
    }

    async fetchAll() {
      try {
        return await this.request("POST", {
          action: "list",
        });
      } catch (error) {
        if (/unsupported action/i.test(String(error && error.message))) {
          return this.requestViaFetch("GET");
        }
        throw error;
      }
    }

    async login(adminKey) {
      return this.request("POST", {
        action: "login",
        adminKey: adminKey || this.adminKey,
      });
    }

    async validateSession(sessionToken) {
      return this.request("POST", {
        action: "validateSession",
        sessionToken: sessionToken || this.sessionToken,
      });
    }

    async logout(sessionToken) {
      return this.request("POST", {
        action: "logout",
        adminKey: this.adminKey,
        sessionToken: sessionToken || this.sessionToken,
      });
    }

    async upsert(collection, record, options) {
      const payload = {
        action: "upsert",
        adminKey: this.adminKey,
        sessionToken: this.sessionToken,
        collection: collection,
        record: record,
      };

      if (options && options.filePayload) {
        payload.file = {
          name: options.filePayload.name,
          mimeType: options.filePayload.type,
          base64: options.filePayload.base64,
        };
        payload.previousFileId = record.fileId || "";
      }

      return this.request("POST", payload);
    }

    async remove(collection, id) {
      return this.request("POST", {
        action: "delete",
        adminKey: this.adminKey,
        sessionToken: this.sessionToken,
        collection: collection,
        id: id,
      });
    }
  }

  class ClubStore {
    constructor(settings) {
      this.config = settings || config;
      this.localAdapter = new LocalAdapter(this.config.localStorageKey, {
        seedEnabled: this.shouldAutoSeedLocal.bind(this),
        seedFactory: createSeedData,
        emptyFactory: createEmptyData,
      });
      this.remoteCacheStorageKey = this.config.remoteCacheStorageKey || "ggfc-public-remote-cache-v1";
      this.remoteCacheTtlMs = Math.max(5000, Number(this.config.remoteCacheTtlMs || 45000));
      this.remoteMemoryCache = {};
      this.pendingRemoteFetches = {};
      this.localAdapter.fetchAll();
    }

    withFetchMeta(data, source, errorMessage) {
      const snapshot = data && Array.isArray(data.records) ? clone(data) : { records: [] };
      snapshot._source = source || "";
      if (errorMessage) {
        snapshot._error = String(errorMessage);
      }
      return snapshot;
    }

    getRemoteCacheUrl(url) {
      return String(url || "").trim();
    }

    readRemoteCacheStore() {
      if (!this.remoteCacheStorageKey) {
        return {};
      }

      try {
        const parsed = JSON.parse(window.localStorage.getItem(this.remoteCacheStorageKey) || "{}");
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch (error) {
        return {};
      }
    }

    writeRemoteCacheStore(storeData) {
      if (!this.remoteCacheStorageKey) {
        return;
      }

      try {
        window.localStorage.setItem(this.remoteCacheStorageKey, JSON.stringify(storeData || {}));
      } catch (error) {
        // Ignore cache persistence failures and keep the in-memory cache only.
      }
    }

    getRemoteCacheEntry(url) {
      const key = this.getRemoteCacheUrl(url);
      if (!key) {
        return null;
      }

      const memoryEntry = this.remoteMemoryCache[key];
      if (memoryEntry && memoryEntry.data && Array.isArray(memoryEntry.data.records)) {
        return memoryEntry;
      }

      const storedEntry = this.readRemoteCacheStore()[key];
      if (!storedEntry || !storedEntry.data || !Array.isArray(storedEntry.data.records)) {
        return null;
      }

      this.remoteMemoryCache[key] = storedEntry;
      return storedEntry;
    }

    isRemoteCacheFresh(entry) {
      if (!entry || !entry.savedAt) {
        return false;
      }

      return Date.now() - Number(entry.savedAt) <= this.remoteCacheTtlMs;
    }

    rememberRemoteData(url, data) {
      const key = this.getRemoteCacheUrl(url);
      const normalizedData = data && Array.isArray(data.records) ? data : { records: [] };
      const snapshot = {
        savedAt: Date.now(),
        data: clone(normalizedData),
      };

      if (!key) {
        return clone(snapshot.data);
      }

      this.remoteMemoryCache[key] = snapshot;
      const storeData = this.readRemoteCacheStore();
      storeData[key] = snapshot;
      this.writeRemoteCacheStore(storeData);
      return clone(snapshot.data);
    }

    clearRemoteCache(url) {
      const key = this.getRemoteCacheUrl(url);
      if (!key) {
        return;
      }

      delete this.remoteMemoryCache[key];
      delete this.pendingRemoteFetches[key];

      const storeData = this.readRemoteCacheStore();
      if (storeData[key]) {
        delete storeData[key];
        this.writeRemoteCacheStore(storeData);
      }
    }

    getRemoteUrlForMode(mode, authSession) {
      if (mode === "site" || mode === "remotePublic") {
        return this.getRemoteSettings(true).url;
      }

      if (mode === "adminAuto") {
        const savedMode = window.localStorage.getItem(this.config.adminModeKey) || "local";
        if (savedMode !== "remote") {
          return "";
        }
      }

      const session = authSession || this.getAuthSession();
      if (session && session.mode === "remote" && session.url) {
        return session.url;
      }

      return this.getRemoteSettings(false).url;
    }

    getCachedData(mode, authSession) {
      const entry = this.getRemoteCacheEntry(this.getRemoteUrlForMode(mode, authSession));
      return entry ? clone(entry.data) : null;
    }

    buildRemoteAdapter(mode, authSession) {
      const remoteUrl = this.getRemoteUrlForMode(mode, authSession);
      if (!remoteUrl) {
        throw new Error("Apps Script URL is missing.");
      }

      if (mode === "site" || mode === "remotePublic") {
        return new AppsScriptAdapter({
          url: remoteUrl,
        });
      }

      const remoteSettings = this.getRemoteSettings(false);
      const session = authSession || this.getAuthSession();
      return new AppsScriptAdapter({
        url: remoteUrl,
        adminKey: remoteSettings.adminKey,
        sessionToken: session && session.mode === "remote" ? session.sessionToken || "" : "",
      });
    }

    async fetchRemoteSnapshot(mode, authSession) {
      const remoteUrl = this.getRemoteUrlForMode(mode, authSession);
      if (!remoteUrl) {
        throw new Error("Apps Script URL is missing.");
      }

      const cachedEntry = this.getRemoteCacheEntry(remoteUrl);
      if (cachedEntry && this.isRemoteCacheFresh(cachedEntry)) {
        return clone(cachedEntry.data);
      }

      if (!this.pendingRemoteFetches[remoteUrl]) {
        const adapter = this.buildRemoteAdapter(mode, authSession);
        this.pendingRemoteFetches[remoteUrl] = adapter
          .fetchAll()
          .then(
            function (data) {
              return this.rememberRemoteData(remoteUrl, data);
            }.bind(this)
          )
          .finally(
            function () {
              delete this.pendingRemoteFetches[remoteUrl];
            }.bind(this)
          );
      }

      try {
        return clone(await this.pendingRemoteFetches[remoteUrl]);
      } catch (error) {
        if (cachedEntry && cachedEntry.data) {
          return clone(cachedEntry.data);
        }
        throw error;
      }
    }

    getRemoteSettings(publicOnly) {
      let saved = {};
      try {
        saved = JSON.parse(window.localStorage.getItem(this.config.remoteSettingsKey) || "{}");
      } catch (error) {
        saved = {};
      }

      return {
        url: saved.url || this.config.publicApiUrl || "",
        adminKey: publicOnly ? "" : saved.adminKey || "",
      };
    }

    saveRemoteSettings(settings) {
      const next = {
        url: settings.url || "",
        adminKey: settings.adminKey || "",
      };
      window.localStorage.setItem(this.config.remoteSettingsKey, JSON.stringify(next));
      return next;
    }

    getLocalDemoBehavior() {
      const saved = window.localStorage.getItem(this.config.demoBehaviorKey);
      return saved === "seed" ? "seed" : "empty";
    }

    saveLocalDemoBehavior(mode) {
      const nextMode = mode === "seed" ? "seed" : "empty";
      if (this.config.demoBehaviorKey) {
        window.localStorage.setItem(this.config.demoBehaviorKey, nextMode);
      }
      return nextMode;
    }

    shouldAutoSeedLocal() {
      return this.getLocalDemoBehavior() === "seed";
    }

    resetLocalData(mode) {
      const nextMode = mode === "seed" ? "seed" : "empty";
      const nextData = nextMode === "seed" ? createSeedData() : createEmptyData();
      this.localAdapter.saveAll(nextData);
      return nextData;
    }

    getAuthSession() {
      if (!this.config.authSessionKey) {
        return null;
      }

      try {
        return JSON.parse(window.localStorage.getItem(this.config.authSessionKey) || "null");
      } catch (error) {
        return null;
      }
    }

    saveAuthSession(session) {
      if (!this.config.authSessionKey) {
        return session || null;
      }

      if (!session) {
        window.localStorage.removeItem(this.config.authSessionKey);
        return null;
      }

      window.localStorage.setItem(this.config.authSessionKey, JSON.stringify(session));
      return session;
    }

    clearAuthSession() {
      if (this.config.authSessionKey) {
        window.localStorage.removeItem(this.config.authSessionKey);
      }
    }

    resolveAdapter(mode, authSession) {
      if (mode === "remote" || mode === "remotePublic") {
        const remoteSettings = this.getRemoteSettings(mode === "remotePublic");
        if (!remoteSettings.url) {
          throw new Error("Apps Script URL ကို မသတ်မှတ်ရသေးပါ။");
        }
        const session = authSession || this.getAuthSession();
        return new AppsScriptAdapter({
          url: remoteSettings.url,
          adminKey: remoteSettings.adminKey,
          sessionToken: session && session.mode === "remote" ? session.sessionToken || "" : "",
        });
      }
      return this.localAdapter;
    }

    async authenticateRemote(adminKey) {
      const remoteSettings = this.getRemoteSettings(false);
      const secret = adminKey || remoteSettings.adminKey || "";
      if (!remoteSettings.url) {
        throw new Error("Apps Script URL ကို အရင်ထည့်ပေးပါ။");
      }
      if (!secret) {
        throw new Error("Remote mode အတွက် Admin Key လိုအပ်ပါတယ်။");
      }

      return new AppsScriptAdapter({
        url: remoteSettings.url,
        adminKey: secret,
      }).login(secret);
    }

    async validateRemoteSession(session) {
      const currentSession = session || this.getAuthSession();
      if (!currentSession || !currentSession.sessionToken) {
        throw new Error("Remote session token မရှိသေးပါ။");
      }

      return new AppsScriptAdapter({
        url: currentSession.url || this.getRemoteSettings(false).url,
        adminKey: this.getRemoteSettings(false).adminKey,
        sessionToken: currentSession.sessionToken,
      }).validateSession(currentSession.sessionToken);
    }

    async logoutRemoteSession(session) {
      const currentSession = session || this.getAuthSession();
      if (currentSession && currentSession.sessionToken) {
        try {
          await new AppsScriptAdapter({
            url: currentSession.url || this.getRemoteSettings(false).url,
            adminKey: this.getRemoteSettings(false).adminKey,
            sessionToken: currentSession.sessionToken,
          }).logout(currentSession.sessionToken);
        } catch (error) {
          // Best-effort logout so the local session can still be cleared.
        }
      }

      this.clearAuthSession();
      return true;
    }

    async fetchAll(mode) {
      const adapterMode = mode || "local";

      if (adapterMode === "site") {
        if (this.getRemoteUrlForMode("site")) {
          try {
            return this.withFetchMeta(await this.fetchRemoteSnapshot("site"), "remote");
          } catch (error) {
            const cachedRemoteData = this.getCachedData("site");
            if (cachedRemoteData) {
              return this.withFetchMeta(cachedRemoteData, "cache", error && error.message);
            }
            return this.withFetchMeta(createEmptyData(), "remote-unavailable", error && error.message);
          }
        }
        return this.withFetchMeta(this.localAdapter.fetchAll(), "local");
      }

      if (adapterMode === "adminAuto") {
        const savedMode = window.localStorage.getItem(this.config.adminModeKey) || "local";
        if (savedMode === "remote") {
          try {
            return await this.fetchRemoteSnapshot("remote", this.getAuthSession());
          } catch (error) {
            const cachedRemoteData = this.getCachedData("remote", this.getAuthSession());
            if (cachedRemoteData) {
              return cachedRemoteData;
            }
            return this.localAdapter.fetchAll();
          }
        }
        return this.localAdapter.fetchAll();
      }

      if (adapterMode === "remote" || adapterMode === "remotePublic") {
        return this.fetchRemoteSnapshot(adapterMode, this.getAuthSession());
      }

      return this.resolveAdapter(adapterMode, this.getAuthSession()).fetchAll();
    }

    async list(collection, mode) {
      const data = await this.fetchAll(mode);
      return sortRecords(
        (data.records || []).filter(function (item) {
          return item.collection === collection;
        }),
        collection
      );
    }

    async getProfile(mode) {
      const profiles = await this.list("profile", mode);
      return profiles[0] || clone(EMPTY_PROFILE);
    }

    async find(collection, value, field, mode) {
      const list = await this.list(collection, mode);
      return (
        list.find(function (item) {
          return item[field] === value;
        }) || null
      );
    }

    async upsert(collection, record, mode, file, authSession) {
      const payload = Object.assign({}, record);
      const options = {};
      const definition = COLLECTION_DEFINITIONS[collection];
      const fileField = definition && Array.isArray(definition.fields)
        ? definition.fields.find(function (field) {
            return field.type === "file";
          })
        : null;

      if (file) {
        validateFileSelection(file, fileField || {}, this.config.maxInlineFileSize);
        options.filePayload = await serializeDataUrl(file, this.config.maxInlineFileSize);
      }

      const result = await this.resolveAdapter(mode, authSession).upsert(collection, payload, options);
      if (mode === "remote") {
        this.rememberRemoteData(this.getRemoteUrlForMode("remote", authSession), {
          records: result.records || [],
        });
      }
      return result.record || null;
    }

    async remove(collection, id, mode, authSession) {
      const result = await this.resolveAdapter(mode, authSession).remove(collection, id);
      if (mode === "remote") {
        this.rememberRemoteData(this.getRemoteUrlForMode("remote", authSession), {
          records: result.records || [],
        });
      }
      return result;
    }
  }

  window.GGCore = {
    COLLECTION_ORDER: COLLECTION_ORDER,
    COLLECTION_DEFINITIONS: COLLECTION_DEFINITIONS,
    ClubStore: ClubStore,
    DEFAULT_PROFILE: clone(DEFAULT_PROFILE),
    EMPTY_PROFILE: clone(EMPTY_PROFILE),
    createEmptyData: createEmptyData,
    createSeedData: createSeedData,
    helpers: {
      clone: clone,
      describeAcceptList: describeAcceptList,
      describeFilePolicy: describeFilePolicy,
      escapeHtml: escapeHtml,
      formatDate: formatDate,
      formatDateTime: formatDateTime,
      formatFileSize: formatFileSize,
      formatTime: formatTime,
      inferMediaType: inferMediaType,
      isAudio: isAudio,
      isDocument: isDocument,
      isImage: isImage,
      isVideo: isVideo,
      joinTags: joinTags,
      parseTags: parseTags,
      resolveRecordAsset: resolveRecordAsset,
      slugify: slugify,
      sortRecords: sortRecords,
      splitAcceptTokens: splitAcceptTokens,
      textToHtml: textToHtml,
      toMyanmarDigits: toMyanmarDigits,
      truncate: truncate,
      validateFileSelection: validateFileSelection,
    },
  };
})();
