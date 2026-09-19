import { HOLD_PLANT } from "./copy.js";

interface Card {
  pattern: RegExp;
  reply: string;
  wilt: boolean;
}

const CARDS: Card[] = [
  {
    pattern: /late blight/i,
    reply: "*Signs of late blight*\nWater-soaked brown patches on the leaf.\nWhite mould under the leaf in cool wet weather.\nThe fruit turns brown and rots.\n\n*Do this*\nPick off the bad leaves and fruit. Do not compost them.\nWater the soil, not the leaves.",
    wilt: false,
  },
  {
    pattern: /early blight/i,
    reply: "*Signs of early blight*\nBrown spots with rings, like a target, on older lower leaves.\nThe spots dry out. The fruit can get a dark sunken patch near the stem.\n\n*Do this*\nPick off the spotted leaves. Stake the plants.\nWater the soil, not the leaves.",
    wilt: false,
  },
  {
    pattern: /tuta|leaf miner/i,
    reply: "*Signs of Tuta*\nPale mines inside the leaf, pinholes, and black specks.\nSmall holes in the fruit.\n\n*Do this*\nPick off mined leaves and fruit. Do not compost them.\nCheck the plants twice a week.",
    wilt: false,
  },
  {
    pattern: /bacterial wilt|fusarium/i,
    reply: "*Signs of bacterial wilt*\nA green plant wilts, often one side first, and does not recover at night.\nCut the stem: brown slime.\nNo spray cures it.\nDo not compost it, and do not move that soil.",
    wilt: true,
  },
  {
    pattern: /leaf curl|yellow leaf curl|whitefly/i,
    reply: "*Signs of leaf curl*\nLeaves cup upward and turn yellow. The plant stays short. Flowers drop.\nSpread by whitefly, not by seed.",
    wilt: true,
  },
  {
    pattern: /red spider|spider mite/i,
    reply: "*Signs of red spider mite*\nFine yellow dots, bronzing, and webbing, worse in hot dry weather.\nThis is not a fungus. Do not spray a blight chemical for it.",
    wilt: false,
  },
  {
    pattern: /septoria/i,
    reply: "*Signs of Septoria*\nMany small round spots with a grey centre, starting on lower leaves.\n\n*Do this*\nPick off the spotted leaves. Water the soil, not the leaves.",
    wilt: false,
  },
  {
    pattern: /blossom end rot/i,
    reply: "*Signs of blossom end rot*\nThe bottom of the fruit turns black and leathery.\nThis is uneven water, not a disease.\n\n*Do this*\nWater the soil evenly. Do not spray a fungicide for it.",
    wilt: false,
  },
  {
    pattern: /bollworm/i,
    reply: "*Signs of bollworm*\nHoles in green fruit, with a caterpillar inside.\n\n*Do this*\nPick off the damaged fruit. Do not compost it.",
    wilt: false,
  },
];

const ASKING =
  /\b(sign|signs|symptom|symptoms|what is|what are|look like|looks like|how (?:do|can) i (?:know|tell)|tell me about)\b/i;

export function diseaseCard(text: string, name?: null | string): null | string {
  const card = CARDS.find((item) => item.pattern.test(text));
  return card ? withName(card, name) : null;
}

export function explainQuestion(text: string, name?: null | string): null | string {
  const card = CARDS.find((item) => item.pattern.test(text));
  if (!card) return null;
  const words = text.trim().split(/\s+/).length;
  if (!ASKING.test(text) && words > 4) return null;
  return withName(card, name);
}

function withName(card: Card, name?: null | string): string {
  const first = name?.split(" ")[0];
  const body = first ? card.reply.replace("*Signs of ", `*${first}, signs of `) : card.reply;
  return card.wilt ? `${body}\n\n${HOLD_PLANT}` : body;
}
