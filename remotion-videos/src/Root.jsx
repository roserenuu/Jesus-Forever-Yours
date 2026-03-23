import { Composition } from "remotion";
import { BookPromo } from "./BookPromo";
import { ScriptureClip } from "./ScriptureClip";

// All 24 days from the devotional
const ALL_DAYS = [
  { day: "1", title: "Forever With You", quote: "I am with you in every moment and every chapter of your life. When happiness fills your heart, I am your God of blessings. When you are broken by pain, I am your God of healing.", scripture: "I am with you always, even to the end of the age.", scriptureRef: "Matthew 28:20 NLT" },
  { day: "2", title: "Gentle Knock", quote: "I am not asking for perfection, only the real you.", scripture: "Look! I stand at the door and knock. If you hear my voice and open the door, I will come in.", scriptureRef: "Revelation 3:20 NLT" },
  { day: "3", title: "Steady Guide", quote: "I started your story, and I promise to finish it more beautifully than you can imagine. Trust my guidance, for I am always leading you to good.", scripture: "I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.", scriptureRef: "Psalm 32:8" },
  { day: "4", title: "Promise Keeper", quote: "I will remove the mountain in the way of My Will for your life. My promises are unfailing, and I am working all things for your good.", scripture: "God is not a man, so he does not lie. He is not human, so he does not change his mind.", scriptureRef: "Numbers 23:19" },
  { day: "5", title: "Heaven Holds You Close", quote: "The separation you experience is only temporary. I hold you close, and our reunion will be eternal and glorious.", scripture: "Then we who are alive and remain will be caught up in the clouds to meet the Lord in the air.", scriptureRef: "1 Thessalonians 4:17" },
  { day: "6", title: "Release And Receive", quote: "Release what hurts you, so it does not harm what I am giving you. Let go of the past, and open your heart to the new season I have for you.", scripture: "For everything there is a season, a time for every activity under heaven.", scriptureRef: "Ecclesiastes 3:1" },
  { day: "7", title: "Hold On", quote: "One day, you will see how every piece fits together into something beautiful. Keep holding on, for I am working behind the scenes for your good.", scripture: "Jesus replied, you don't understand now what I am doing but someday you will.", scriptureRef: "John 13:7" },
  { day: "8", title: "Nothing Is Wasted", quote: "Nothing you do for Me is ever wasted. Every effort, every tear, every act of love is seen and valued in my eyes.", scripture: "Nothing you do for the Lord is ever useless.", scriptureRef: "1 Corinthians 15:58" },
  { day: "9", title: "Beauty Within", quote: "Do not allow anyone or anything change you, nor dim your light. Your true beauty shines from within, a reflection of my image.", scripture: "The Lord doesn't see things the way you see them. People judge by outward appearance, but the Lord looks at the heart.", scriptureRef: "1 Samuel 16:7" },
  { day: "10", title: "Godly Self Love", quote: "I said to love your neighbor as yourself, not instead of yourself. Embrace the divine love I have placed within you.", scripture: "Love your neighbor as yourself.", scriptureRef: "Mark 12:31" },
  { day: "11", title: "Rest Is Holy", quote: "I created you to walk with Me, not to race without Me. Find sacred rest in my presence, and let your soul be refreshed.", scripture: "By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work.", scriptureRef: "Genesis 2:2" },
  { day: "12", title: "The Peace You Need", quote: "Bring Me what you've been carrying, and I will trade it for My peace. My peace is a gift, freely given, that transcends all earthly understanding.", scripture: "I am leaving you with a gift: peace of mind and heart. And the peace I give is a gift the world cannot give.", scriptureRef: "John 14:27" },
  { day: "13", title: "Quiet The Noise", quote: "I am the still, small voice, speaking peace into your heart.", scripture: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.", scriptureRef: "Isaiah 26:3" },
  { day: "14", title: "The False Echoes", quote: "I will quiet the false echoes, and My peace will settle your heart.", scripture: "My sheep listen to my voice; I know them, and they follow me.", scriptureRef: "John 10:27" },
  { day: "15", title: "Inner Confidence", quote: "When your confidence is rooted in Me, nothing can take it away from you.", scripture: "Let not the wise boast of their wisdom or the strong boast of their strength, but let the one who boasts boast about this: that they have the understanding to know me.", scriptureRef: "Jeremiah 9:23-24" },
  { day: "16", title: "Always Listening", quote: "Just because I did not give you what you asked for does not mean I did not hear you.", scripture: "Trust in the Lord with all your heart and lean not on your own understanding.", scriptureRef: "Proverbs 3:5-6" },
  { day: "17", title: "Family And Friends", quote: "Trust Me with your loved ones as you trust Me with yourself.", scripture: "Because he loves me, says the Lord, I will rescue him; I will protect him, for he acknowledges my name.", scriptureRef: "Psalm 91:14-16" },
  { day: "18", title: "Loving Again", quote: "Loving again does not make you weak. Rather, it makes you more like Me.", scripture: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.", scriptureRef: "1 Corinthians 13:4-7" },
  { day: "19", title: "Letting Go", quote: "Revenge does not punish them. It steals your peace.", scripture: "Do not be overcome by evil, but overcome evil with good.", scriptureRef: "Romans 12:21" },
  { day: "20", title: "Forgiveness", quote: "There is so much joy waiting for you on the other side of forgiveness.", scripture: "Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.", scriptureRef: "Colossians 3:13" },
  { day: "21", title: "Turn To Me", quote: "When it's hardest to turn to Me, that is when I am closest to you.", scripture: "There will be more joy in heaven over one sinner who repents than over ninety-nine righteous persons who need no repentance.", scriptureRef: "Luke 15:7" },
  { day: "22", title: "Victory Over Temptation", quote: "You will no longer be controlled by temptation. You will live in freedom and peace.", scripture: "For we do not have a high priest who is unable to empathize with our weaknesses.", scriptureRef: "Hebrews 4:15-16" },
  { day: "23", title: "Living Spirit", quote: "Let My word soften your heart, renew your mind, and realign your perspective.", scripture: "For the word of God is alive and active. Sharper than any double-edged sword.", scriptureRef: "Hebrews 4:12" },
  { day: "24", title: "Paid By Love", quote: "The tomb is empty, and your future is full. I did it for you.", scripture: "Though he was God, he did not think of equality with God as something to cling to. Instead, he gave up his divine privileges.", scriptureRef: "Philippians 2:6-8" },
];

export const RemotionRoot = () => {
  return (
    <>
      {/* Main Book Promo Video — 25 seconds, square format */}
      <Composition
        id="BookPromo"
        component={BookPromo}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          title: "Forever Yours",
          subtitle: "24 Days With Jesus",
          tagline: "24 intimate love letters from God's heart to yours",
          quote: "I am with you in every moment and every chapter of your life. When happiness fills your heart, I am your God of blessings. When you are broken by pain, I am your God of healing.",
          scripture: "I have loved you with an everlasting love; I have drawn you with unfailing kindness.",
          scriptureRef: "Jeremiah 31:3",
          reviewer: "Michelle K.",
          review: "Forever Yours is the devotional I did not know I needed. The way Scripture comes alive in these pages is something special.",
          price: "$20",
          cta: "jesusforeveryours.com",
        }}
      />

      {/* Scripture Clips — one for each of the 24 days, vertical format for Reels/TikTok */}
      {ALL_DAYS.map((day) => (
        <Composition
          key={`ScriptureClip-Day${day.day}`}
          id={`ScriptureClip-Day${day.day}`}
          component={ScriptureClip}
          durationInFrames={270}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            dayNumber: day.day,
            letterTitle: day.title,
            quote: day.quote,
            scripture: day.scripture,
            scriptureRef: day.scriptureRef,
            signature: "Forever Yours, Heavenly Father",
          }}
        />
      ))}
    </>
  );
};
