"use strict"; // credit to Yahtzee Master#0168
let ticker = document.getElementById("newsContent");
let tickerContainer = document.getElementById("newsTicker"); // ticker is the text element, tickerContainer is... the thing that contains ticker

let newsPosition = -1e100; // hopefully noones screen is this big

function tickNews() {
  if (player) {
  if (!player.hideNews) {
  newsPosition -= 3;
  ticker.style.left = `${newsPosition}px`;

  if (newsPosition < -ticker.offsetWidth) newNewsMessage()};
  }
}

function newNewsMessage() {
  if (!player.hideNews) {
  const newsCandidates = [];
  for (const i in newsArray)
    if (newsArray[i][1] === undefined || newsArray[i][1]())
      newsCandidates.push(newsArray[i][0]);
  player.newsTotal = player.newsTotal.plus(1);
  ticker.innerHTML =
    newsCandidates[Math.floor(newsCandidates.length * Math.random())];
  newsPosition = tickerContainer.offsetWidth;
  ticker.style.left = `${newsPosition}px`};
}
// you can add a second element to each message's array
// the second element is a function that returns a boolean of whether to shown it
const newsArray = [
  ["Virus detected!"],
  ["This news ticker is not what you anticipated"],
  ["The 7th Infectivity upgrade looking kinda sus, vote it out."],
  ["too short 1/0"],
  ["New worrying disease spreading! A diagnostic team has identified a new disease which has been named Vorona Cirus. It is quite severe and must be investigated further."],
  ["How many ticks can a tick tick at?"],
  ["6 feet apart"],
  ["Next second in 0.0000555 updates"],
  ["9th dimesion wehn???"],
  ["Every 18000 seconds in Africa, 5 hours pass. Together we can stop this."],
  [
    "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM-sorry that wasn't my keyboard, that was actually my microwave. Ooh, my pizza's ready!"
  ],
  ["Next update in 4.99999 hours"],
  ["There are no healthy people left in the world: The last healthy person on the planet recently became infected with Vorona Cirus"],
  ["You can't reach F1.79e308 (yet)"],
  ["Vorona Cirus begins in China"],
  ["I dare you to click this news ticker."],
  ["BREAKING NEWS: 1.8e308 cases of Vorona Cirus reported."],
  ["This news ticker is (softcapped) so you can't re.."],
  ["Ow, that hurt! Stop clicking me!"],
  ["Going horizontal is fun! Weeeeeeeeeeeeee!"],
  ["This statement is false."],
  ["read homestuck plz"],
  ["IRON 308.25"],
  ["First death : First death from Vorona Cirus has been confirmed. Bad luck or the beginning of something terrible?"],
  ["screw this, im touching virus"],
  ["Vorona Cirus placed on Watch List: Vorona Cirus has been placed on watchlist. Already dangerous, governments are warned that it could become unstoppable"],
  ["Rio Olympics infect Brazil!: People infected with Vorona Cirus came to Rio and spread their disease. It should have never went on!"],
  [
    "'are the newsticker messages all going to be dumb, like the ones in AD?' - gapples2"
  ],
  ["To prevent infection and to slow transmission of COVID-19, Wash your hands regularly with soap and water, or clean them with alcohol-based hand rub. Maintain at least 1 metre distance between you and people coughing or sneezing. Avoid touching your face. Cover your mouth and nose when coughing or sneezing. Stay home if you feel unwell. Refrain from smoking and other activities that weaken the lungs. Practice physical distancing by avoiding unnecessary travel and staying away from large groups of people."],
  ["The English greeting is not present in Virus speak."],
  ["We dug a big hole to store this virus... Adele's rolling in it."], // why are there AD copies?
  [
    "Breaking news! Hevipelle has just announced that the buy max button is in fact going to be removed!"
  ],
  ["Please insert Disc -1.8e308 to continue playing Plague Tree™."],
  ["I have a 9th, i have a dimension... UHH... IT DOESN'T EXIST!"],
  [
    "Someone once told me that virus is gonna roll me. I ain't the sharpest corona in the shed. WELL, the Plague start coming and they don't stop coming..."
  ],
  ["We have updated our Plague Privacy Policy."],
  ["THIS JUST IN: Man makes an hour long rant about timewalls"],
  [
    "New news or old news? News you knew(knew new news) or news you dont know? (New new news) -DeadlyEwookie"
  ],
  ["'and also' -TheMKeyHolder"],
  ["Incremental game gets copyright strike for stealing unfunity."],
  ["suggest more news here"],
  [
    "This isn’t the real AD... so maybe it could have a 9th Dimension? :thinking: "
  ],
  ["*sigh*"],
  ["max mall is working -reda"],
  ["TMTT is unrealistic because it implies that finished Despacit mods exist"],
  ["There exists, encoded, visible Reality leaks, potentially."],
  ["120% of code is copy pasted from stack overflow"],
  ["Correction: Time reversal is the only innovative feature of the game"],
  ["do it that way we can put memes in general"],
  ["usa is dumb and i am in the usa"],
  ["although bee megalovania might make nice white noise to sleep to"],
  ["(softcaped)"],
  ["'i will break your nico nico kneecaps' -despacit"],
  ["because mac was removed from mac -yahtzee master"],
  ["WAIT I thought i fixed that goddamnit"],
  ["NG+5C when"],
  ["Console ERROR Incremental"],
  ["making a bazillion mods is what i do -despacit"],
  ["jimmy electron"],
  ["Don't ever beg for stars for else."],
  ["incremental is just advanced waiting"],
  ["guys if you star this you will get free bobux"],
  ["gramer™️"],
  ["Florida Man attempts to port Plague Tree to PICO-8, is stopped by the heat death of the device."],
  ["Mystery Plague is real: Investigations prompted by recent riots find that the Mystery Plague is real and spreading fast. It has been named Vorona Cirus."],
  ["The question is out: Can Plague Tree run Doom?"],
  ["Riots over 'Vorona Cirus': Severe riots have erupted over the so called 'Vorona Cirus'. The government pledges to fund a medical investigation."],
  ["Off the rails and into the dumpster -Acamaeda"],
  ["I actually think I might make a prestige tree mod with a news ticker"],
  ['"Vorona has no balance" and other hilarious jokes to tell yourself'],
  ["Sacrifice isn't reset on crunch."],
  [
    "unsoftcapped stole some Prestige Game news tickers. I don't care about it, I just wanted to say that"
  ],
  ["Damn, just got NaN'd halfway through Plague Tree"],
  [
    "You've just been news tickered, send a screenshot of this news ticker to get un-news tickered"
  ],
  [":angry: -Dasani"],
  ['Petition to call F notation "Science Fiction Notation"'],
];
setTimeout(() => {
  ticker = document.getElementById("newsContent");
  tickerContainer = document.getElementById("newsTicker");
  setInterval(tickNews, 25);
}, 150);