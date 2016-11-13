const interval = 1440;

let date = new Date;
date.setDate(date.getDate() - 1);
const yesterday = date.getTime();

date = new Date;
date.setTime(date.getTime() + 20 * 60 * 60 * 1000);
const tomorrow = date.getTime();

const tips = [
  {
    text: 'Get periodic reminders for your notes.',
    interval,
    reviewAfter: yesterday,
  },
  {
    text: 'When reminded, choose to keep or remove that note.',
    interval,
    reviewAfter: yesterday,
  },
  {
    text: 'You can review all your notes by clicking the link below.',
    interval,
    reviewAfter: tomorrow,
  },
];

export default tips;
