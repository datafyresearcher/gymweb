const knowledgeSections = [
  {
    id: "business",
    title: "Business overview",
    keywords: ["lifestyle reset", "gym", "about", "overview", "what is", "who are you"],
    content: [
      "Lifestyle Reset is a gym in Lahore focused on strength, discipline, confidence, and long-term fitness progress.",
      "The website presents the gym as a supportive fitness community with expert coaching, personalized plans, and modern equipment.",
      "The gym highlights open access seven days a week, nutrition coaching, and a dedicated ladies floor.",
    ],
  },
  {
    id: "contact",
    title: "Contact and location",
    keywords: ["contact", "phone", "call", "email", "location", "address", "where", "map", "lahore"],
    content: [
      "Address: 6th Avenue Commercial Plaza, LDA Avenue-01, 2nd Floor, Raiwind Rd, Lahore.",
      "Phone: 0323-4222747.",
      "Email: lifestylereset747@gmail.com.",
      "The contact page also embeds Google Maps for LDA Avenue One, Lahore, Pakistan.",
    ],
  },
  {
    id: "hours",
    title: "Opening hours",
    keywords: ["hours", "opening", "timing", "time", "open", "close", "weekend", "monday", "friday"],
    content: [
      "Opening hours on the contact page are Monday to Friday: 9 AM to 8 PM.",
      "Opening hours on the contact page are Saturday and Sunday: 10 AM to 4 PM.",
      "The homepage also highlights that the gym is open seven days a week.",
    ],
  },
  {
    id: "services",
    title: "Services and classes",
    keywords: ["services", "classes", "programs", "training", "workout", "hiit", "crossfit", "yoga", "pilates", "cardio", "zumba", "nutrition"],
    content: [
      "Website services include personal training, strength training, cardio workouts, nutrition counseling, group classes, and online fitness coaching.",
      "Group classes mentioned across the site include HIIT, CrossFit, yoga, pilates, cardio, and Zumba.",
      "The homepage also highlights gym training, strength, HIIT class, CrossFit, yoga, pilates, cardio, and nutrition coaching.",
    ],
  },
  {
    id: "plans",
    title: "Membership plans",
    keywords: ["price", "pricing", "plan", "membership", "fees", "cost", "join", "monthly", "package"],
    content: [
      "The homepage pricing section lists a Basic Plan at 10,000 PKR per month for full gym access.",
      "It lists a Standard Plan at 14K per month and says it includes flexible couple and individual membership options.",
      "The Standard card also mentions figures of 14K for couples, 7K basic, and 30K premium.",
      "The Premium Plan card shows 25K per month and mentions a personal choice option at 25K.",
      "Because the published plan cards contain overlapping figures, exact membership pricing should be confirmed with the gym directly.",
    ],
  },
  {
    id: "trainers",
    title: "Gym trainers",
    keywords: ["trainer", "coach", "staff", "shahid", "abdul ahad", "gym trainer"],
    content: [
      "The trainers page features Shahid Adnan as Gym Trainer 01 with 16 years of experience.",
      "The trainers page features Abdul Ahad as Gym Trainer 02 with 3 years of experience.",
      "Both trainer profiles point visitors to the main gym phone number 0323-4222747.",
    ],
  },
  {
    id: "martial-arts",
    title: "Martial arts program",
    keywords: ["martial arts", "self defense", "mma", "kids", "discipline", "ahmad shahid", "zahra aslam", "ahsan raza", "ch usama"],
    content: [
      "Lifestyle Reset offers a martial arts program focused on strength, discipline, confidence, self-defense, conditioning, and technique.",
      "The martial arts page says sessions are designed for beginners and advanced learners in a safe, motivating environment.",
      "The martial arts coaching team includes Ahmad Shahid with 7 years of experience, Zahra Aslam with 5 years, Ahsan Raza with 5 years, and Ch Usama with 2 years.",
      "The martial arts page says the program is designed for kids, teens, and adults.",
    ],
  },
  {
    id: "joining",
    title: "Joining guidance",
    keywords: ["join", "signup", "sign up", "book", "start", "trial", "membership"],
    content: [
      "The clearest call to action on the website is to contact the gym through the contact page, phone number, or email to get started.",
      "The homepage includes Join Now and Start Your Free Trail calls to action.",
      "For final plan confirmation or enrollment help, the safest guidance is to call 0323-4222747 or email lifestylereset747@gmail.com.",
    ],
  },
];

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getRelevantSections(message, limit = 4) {
  const normalizedMessage = normalizeText(message);
  const scored = knowledgeSections
    .map((section) => {
      const haystack = `${section.title} ${section.keywords.join(" ")} ${section.content.join(" ")}`;
      const score = section.keywords.reduce((total, keyword) => {
        return normalizedMessage.includes(normalizeText(keyword)) ? total + 3 : total;
      }, normalizedMessage && haystack.includes(normalizedMessage) ? 1 : 0);

      return { ...section, score };
    })
    .sort((a, b) => b.score - a.score);

  const matches = scored.filter((section) => section.score > 0).slice(0, limit);
  return matches.length ? matches : knowledgeSections.slice(0, Math.min(limit, knowledgeSections.length));
}

function buildKnowledgePrompt(message) {
  const relevantSections = getRelevantSections(message);
  const formattedSections = relevantSections
    .map((section) => `- ${section.title}: ${section.content.join(" ")}`)
    .join("\n");

  return [
    "Use only the verified Lifestyle Reset website facts below.",
    "If details are missing or pricing looks inconsistent, say that clearly and suggest confirming by phone or email.",
    formattedSections,
  ].join("\n");
}

function answerFromKnowledge(message) {
  const text = normalizeText(message);

  if (!text) {
    return "Please send a message and I will help with Lifestyle Reset information.";
  }

  if (/(phone|call|contact|email|address|where|location|map)/.test(text)) {
    return "Lifestyle Reset is at 6th Avenue Commercial Plaza, LDA Avenue-01, 2nd Floor, Raiwind Rd, Lahore. You can contact the gym at 0323-4222747 or lifestylereset747@gmail.com.";
  }

  if (/(hours|opening|timing|time|open|close|weekend)/.test(text)) {
    return "Lifestyle Reset lists these opening hours on the contact page: Monday to Friday 9 AM to 8 PM, and Saturday to Sunday 10 AM to 4 PM.";
  }

  if (/(price|pricing|fee|fees|cost|membership|plan|package|monthly)/.test(text)) {
    return "The website lists a Basic Plan at 10,000 PKR per month, a Standard Plan at 14K, and a Premium or personal-choice option at 25K. One plan card also mentions 7K basic and 30K premium, so I recommend confirming the exact membership option with the gym at 0323-4222747.";
  }

  if (/(trainer|coach|staff|shahid|abdul ahad)/.test(text)) {
    return "The trainers page highlights Shahid Adnan with 16 years of experience and Abdul Ahad with 3 years of experience. For trainer availability or joining guidance, the site points visitors to 0323-4222747.";
  }

  if (/(martial|self defense|mma|kids|zahra|ahmad shahid|ahsan raza|usama)/.test(text)) {
    return "Lifestyle Reset offers martial arts training for beginners and advanced learners, with sessions designed for kids, teens, and adults. The martial arts coaching team includes Ahmad Shahid, Zahra Aslam, Ahsan Raza, and Ch Usama.";
  }

  if (/(class|classes|service|services|program|programs|hiit|crossfit|yoga|pilates|cardio|zumba|nutrition)/.test(text)) {
    return "Lifestyle Reset offers personal training, strength training, cardio workouts, nutrition counseling, group classes, online fitness coaching, and martial arts. Classes mentioned on the site include HIIT, CrossFit, yoga, pilates, cardio, and Zumba.";
  }

  if (/(join|signup|sign up|start|trial|book)/.test(text)) {
    return "You can get started through the Contact page or by calling 0323-4222747. The site also promotes Join Now and Start Your Free Trail, so the best next step is to contact the gym for the latest membership option.";
  }

  return "Lifestyle Reset is a Lahore gym focused on strength, coaching, and long-term fitness progress. I can help with services, classes, pricing, trainers, martial arts, timings, and contact details. For anything not clearly listed on the site, the safest contact is 0323-4222747.";
}

module.exports = {
  knowledgeSections,
  buildKnowledgePrompt,
  answerFromKnowledge,
};
