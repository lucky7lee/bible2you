import { VerseThemeData } from './bibleVerses';

// English Bible Verses (World English Bible / Public Domain) & Traditional Hymns
export const VERSE_DATABASE_EN: Record<string, VerseThemeData[]> = {
  rest: [
    {
      themeTitle: 'A Sanctuary of Peace for Your Weary Soul',
      themeSubtitle: 'Lay down every heavy burden and receive true rest',
      verse: {
        reference: 'Matthew 11:28',
        testament: 'NT',
        book: 'Matthew',
        chapter: 11,
        verseRange: '28',
        text: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.',
        context:
          'Jesus gently invites tired and burdened hearts to step away from striving and find lasting renewal in His presence.',
        keyword: 'Rest & Renewal',
      },
      reflectionGuide:
        'Weariness is often a sign of faithful effort. Yet God never asks you to carry every weight alone. Pause for a deep breath and place your worries at the foot of the cross. True rest in Christ is not idleness; it is heaven’s strength preparing you for tomorrow.',
      reflectionQuestions: [
        'What burden feels heaviest on your heart right now?',
        'Why has it been hard to hand this worry completely to the Lord?',
        'How can you carve out 10 quiet minutes with God today?',
      ],
      actionCore: 'Put down your phone for 10 minutes today and breathe deeply in quiet prayer.',
      actionItems: [
        {
          id: 'rest-en-1',
          title: 'Warm Drink & Quiet Thanks',
          description: 'Sip warm water or tea slowly while whispering, "Lord, restore my soul."',
          category: 'prayer',
        },
        {
          id: 'rest-en-2',
          title: 'Release One Non-Essential Task',
          description: 'Postpone one stressful item to tomorrow and allow breathing room today.',
          category: 'word',
        },
        {
          id: 'rest-en-3',
          title: 'Speak a Gentle Encouragement',
          description: 'Tell someone nearby, "Thank you for your hard work today."',
          category: 'love',
        },
      ],
      prayerTitle: '1-Minute Prayer for Rest',
      prayerBody:
        'Gracious Father, I bring my tired mind and weary heart to You today. I lay down my hurry and every heavy concern at Your feet. Thank You for inviting me to come and find rest. Renew my strength, calm my thoughts, and fill my soul with Your gentle peace. In Jesus’ name, Amen.',
      prayerConfession: 'I find true rest in God’s grace, not in my own striving.',
      praise: {
        title: 'What a Friend We Have in Jesus',
        artist: 'Traditional Hymn',
        lyricSnippet: 'Take it to the Lord in prayer.',
        theme: 'Rest & Comfort',
      },
      spiritualHabit: 'Read Psalm 23 slowly before going to sleep tonight.',
      readingSuggestion: 'Psalm 23 (The Lord Is My Shepherd)',
    },
    {
      themeTitle: 'Green Pastures & Still Waters',
      themeSubtitle: 'Guided and cared for by the Good Shepherd',
      verse: {
        reference: 'Psalm 23:1-3',
        testament: 'OT',
        book: 'Psalms',
        chapter: 23,
        verseRange: '1-3',
        text: 'Yahweh is my shepherd; I shall lack nothing. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.',
        context:
          'David’s beloved psalm reminds us that our security comes not from wealth or control, but from walking closely with our Shepherd.',
        keyword: 'Guidance & Care',
      },
      reflectionGuide:
        'Anxiety grows when we focus on what we lack. Peace returns when we remember who leads us. Because the Lord is your Shepherd, you are watched over and provided for today. Trust His gentle pace.',
      reflectionQuestions: [
        'Where do you feel a sense of lack or restlessness today?',
        'How has God quietly provided for you in past seasons?',
        'What worry can you hand over to your Shepherd right now?',
      ],
      actionCore: 'Whenever anxiety rises, declare: "The Lord is my shepherd; I have all I need."',
      actionItems: [
        {
          id: 'rest-en-4',
          title: 'Look Up & Take 3 Deep Breaths',
          description: 'Gaze at the sky for a moment and remember the Creator who cares for you.',
          category: 'prayer',
        },
        {
          id: 'rest-en-5',
          title: 'Note 3 Small Blessings',
          description: 'Write down three simple gifts you received today.',
          category: 'thanks',
        },
        {
          id: 'rest-en-6',
          title: 'Unhurried Grateful Meal',
          description: 'Pause before eating to give sincere thanks and eat peacefully.',
          category: 'word',
        },
      ],
      prayerTitle: '1-Minute Shepherd’s Prayer',
      prayerBody:
        'Loving Shepherd, I turn my eyes away from the noise of the world and look to You. Because You walk with me, I lack nothing essential. Lead my heart beside still waters today and restore my spirit with fresh peace. In Jesus’ name, Amen.',
      prayerConfession: 'My soul is safe because the Lord is my Shepherd.',
      praise: {
        title: 'It Is Well with My Soul',
        artist: 'Traditional Hymn',
        lyricSnippet: 'Whatever my lot, Thou hast taught me to say, it is well.',
        theme: 'Peace & Trust',
      },
      spiritualHabit: 'Whisper "Thank You, Lord" with each step on your walk today.',
      readingSuggestion: 'Psalm 121 (My Help Comes from the Lord)',
    },
  ],

  joy: [
    {
      themeTitle: 'A Day of Gratitude and Joy',
      themeSubtitle: 'Living in God’s will with a thankful heart',
      verse: {
        reference: '1 Thessalonians 5:16-18',
        testament: 'NT',
        book: '1 Thessalonians',
        chapter: 5,
        verseRange: '16-18',
        text: 'Always rejoice. Pray without ceasing. In everything give thanks, for this is the will of God in Christ Jesus toward you.',
        context:
          'Paul encourages believers to practice joy, constant prayer, and gratitude in every season as the hallmark of life in Christ.',
        keyword: 'Joy & Gratitude',
      },
      reflectionGuide:
        'True joy is not built on perfect circumstances, but on the unchanging love of Christ. A grateful heart turns ordinary moments into sacred worship and brings warm light to everyone around you.',
      reflectionQuestions: [
        'What brings genuine joy to your heart today?',
        'What everyday grace have you recently taken for granted?',
        'Who can you brighten with a word of thanks today?',
      ],
      actionCore: 'Greet people with a warm smile and speak one sincere word of gratitude today.',
      actionItems: [
        {
          id: 'joy-en-1',
          title: 'Send a Thank-You Message',
          description: 'Text a family member or friend to express heartfelt appreciation.',
          category: 'love',
        },
        {
          id: 'joy-en-2',
          title: 'Hum a Song of Praise',
          description: 'Listen to or hum a favorite hymn during your commute or break.',
          category: 'thanks',
        },
        {
          id: 'joy-en-3',
          title: 'One Quiet Act of Kindness',
          description: 'Hold a door open or offer a small thoughtful gesture to someone.',
          category: 'word',
        },
      ],
      prayerTitle: '1-Minute Prayer of Thanksgiving',
      prayerBody:
        'Heavenly Father, thank You for the gift of this new day and the joy of Your salvation. Fill my heart with gratitude in every circumstance. May my smile and my words carry Your warmth and light to everyone I meet today. In Jesus’ name, Amen.',
      prayerConfession: 'The joy of the Lord is my strength today.',
      praise: {
        title: 'Joyful, Joyful, We Adore Thee',
        artist: 'Traditional Hymn',
        lyricSnippet: 'Hearts unfold like flowers before Thee, opening to the sun above.',
        theme: 'Joy & Praise',
      },
      spiritualHabit: 'Say "Your grace is enough for me" whenever you look in the mirror.',
      readingSuggestion: 'Psalm 100 (Make a Joyful Noise)',
    },
    {
      themeTitle: 'Rejoicing Always in the Lord',
      themeSubtitle: 'Heavenly gladness that rises above circumstances',
      verse: {
        reference: 'Philippians 4:4',
        testament: 'NT',
        book: 'Philippians',
        chapter: 4,
        verseRange: '4',
        text: 'Rejoice in the Lord always! Again I will say, Rejoice!',
        context:
          'Written from prison, Paul’s joyful call proves that Christian gladness flows from closeness with Christ rather than outward comfort.',
        keyword: 'Abiding Joy',
      },
      reflectionGuide:
        'Joy is a fruit of the Spirit that springs from deep within. No matter what small frustrations appear today, stay anchored "in the Lord" and let His peace guard your gladness.',
      reflectionQuestions: [
        'What small complaint tries to steal your joy today?',
        'What does staying rooted in Christ look like in your routine?',
        'Who needs a share of your hope and warmth today?',
      ],
      actionCore: 'Replace any urge to complain today with three quick words of thanks.',
      actionItems: [
        {
          id: 'joy-en-4',
          title: 'Give a Specific Compliment',
          description: 'Notice and praise one genuine strength in a colleague or loved one.',
          category: 'love',
        },
        {
          id: 'joy-en-5',
          title: 'Write 3 Joyful Moments',
          description: 'Jot down three small moments of goodness from your day.',
          category: 'thanks',
        },
        {
          id: 'joy-en-6',
          title: 'Heartfelt Meal Blessing',
          description: 'Offer a genuine prayer of thanks before your next meal.',
          category: 'prayer',
        },
      ],
      prayerTitle: '1-Minute Prayer for Abiding Joy',
      prayerBody:
        'Good and faithful God, thank You for filling my soul with a joy the world cannot take away. Keep me rooted in Your presence today, and use my life as salt and light to bless those around me. In Jesus’ name, Amen.',
      prayerConfession: 'In Christ alone my heart is satisfied and glad.',
      praise: {
        title: 'Amazing Grace',
        artist: 'Traditional Hymn',
        lyricSnippet: 'Amazing grace, how sweet the sound.',
        theme: 'Grace & Joy',
      },
      spiritualHabit: 'Say "Lord, walk with me today" as you step out the door.',
      readingSuggestion: 'Philippians 4 (Rejoice in the Lord)',
    },
  ],

  courage: [
    {
      themeTitle: 'Walking Forward in Bold Faith',
      themeSubtitle: 'The Almighty Lord goes with you wherever you go',
      verse: {
        reference: 'Joshua 1:9',
        testament: 'OT',
        book: 'Joshua',
        chapter: 1,
        verseRange: '9',
        text: 'Haven’t I commanded you? Be strong and courageous. Don’t be afraid. Don’t be dismayed, for Yahweh your God is with you wherever you go.',
        context:
          'Before crossing the Jordan into an uncertain future, God assured Joshua that divine presence is the true source of courage.',
        keyword: 'Courage & Victory',
      },
      reflectionGuide:
        'Challenges may stand tall before you, but remember: the battle belongs to the Lord. Courage is not the absence of fear; it is stepping forward because God is right beside you.',
      reflectionQuestions: [
        'What obstacle or fear feels largest before you right now?',
        'How does God’s promise "I am with you" reshape your outlook?',
        'What one brave step of faith can you take today?',
      ],
      actionCore: 'Begin one task you have been putting off with a short prayer of courage.',
      actionItems: [
        {
          id: 'courage-en-1',
          title: 'Keep Joshua 1:9 Visible',
          description: 'Write "Be strong and courageous" on a note or phone lock screen.',
          category: 'word',
        },
        {
          id: 'courage-en-2',
          title: '30-Second Prayer Before Action',
          description: 'Before a meeting or challenge, pray for wisdom and boldness.',
          category: 'prayer',
        },
        {
          id: 'courage-en-3',
          title: 'Encourage Someone Discouraged',
          description: 'Tell a friend or coworker, "You can do this, I am praying for you."',
          category: 'love',
        },
      ],
      prayerTitle: '1-Minute Prayer for Boldness',
      prayerBody:
        'Almighty God, thank You for holding my hand at every step. Free me from fear of circumstances or opinions, and fix my eyes on Your greatness. Grant me wisdom and bold faith to face every task before me today. In Jesus’ name, Amen.',
      prayerConfession: 'Because God is with me, I will not be afraid.',
      praise: {
        title: 'A Mighty Fortress Is Our God',
        artist: 'Traditional Hymn',
        lyricSnippet: 'A mighty fortress is our God, a bulwark never failing.',
        theme: 'Strength & Victory',
      },
      spiritualHabit: 'Repeat "I can do all things through Christ" when facing difficulty.',
      readingSuggestion: 'Joshua 1 (Be Strong and Courageous)',
    },
    {
      themeTitle: 'Strengthened in Christ',
      themeSubtitle: 'Heaven’s strength filling every human weakness',
      verse: {
        reference: 'Philippians 4:13',
        testament: 'NT',
        book: 'Philippians',
        chapter: 4,
        verseRange: '13',
        text: 'I can do all things through Christ, who strengthens me.',
        context:
          'Paul testifies that whether in plenty or in want, union with Christ supplies every strength needed to fulfill God’s calling.',
        keyword: 'Strength in Christ',
      },
      reflectionGuide:
        'You do not have to rely solely on your limited energy. When you walk within God’s purpose, Christ’s strength meets your weakness and carries you through every hurdle.',
      reflectionQuestions: [
        'Where have you felt stretched beyond your own strength lately?',
        'What peace arrives when you rely on Christ’s power instead of your own?',
        'How can you honor God in your work and responsibilities today?',
      ],
      actionCore: 'Approach each responsibility today declaring, "Christ strengthens me."',
      actionItems: [
        {
          id: 'courage-en-4',
          title: 'Speak a Blessing of Identity',
          description: 'Remind yourself: "I am God’s beloved child, strengthened by His grace."',
          category: 'prayer',
        },
        {
          id: 'courage-en-5',
          title: 'Focused First 5 Minutes',
          description: 'Dedicate 5 focused minutes to start a difficult task you delayed.',
          category: 'word',
        },
        {
          id: 'courage-en-6',
          title: 'Give Glory to God',
          description: 'When things go well today, thank God immediately for His help.',
          category: 'thanks',
        },
      ],
      prayerTitle: '1-Minute Prayer for Strength',
      prayerBody:
        'Lord Jesus, You know my limits and my weaknesses. I humbly lean on Your mighty strength today. Equip me with clarity, endurance, and grace to fulfill the work You have entrusted to me for Your glory. In Jesus’ name, Amen.',
      prayerConfession: 'Through Christ who strengthens me, I am more than equipped.',
      praise: {
        title: 'Be Thou My Vision',
        artist: 'Traditional Hymn',
        lyricSnippet: 'Be Thou my wisdom, and Thou my true word.',
        theme: 'Strength & Devotion',
      },
      spiritualHabit: 'Pause before key choices and whisper, "Lead me, Lord."',
      readingSuggestion: 'Isaiah 40 (Those Who Wait on the Lord)',
    },
  ],

  wisdom: [
    {
      themeTitle: 'Trusting the Lord with All Your Heart',
      themeSubtitle: 'When you acknowledge Him, He makes your path straight',
      verse: {
        reference: 'Proverbs 3:5-6',
        testament: 'OT',
        book: 'Proverbs',
        chapter: 3,
        verseRange: '5-6',
        text: 'Trust in Yahweh with all your heart, and don’t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.',
        context:
          'Solomon’s timeless wisdom teaches that surrendering our limited perspective to God’s sovereign guidance leads to true clarity.',
        keyword: 'Wisdom & Guidance',
      },
      reflectionGuide:
        'At life’s crossroads, overthinking brings confusion, while trusting God brings clarity. Acknowledge Him in small decisions as well as big ones, and watch Him gently straighten your path.',
      reflectionQuestions: [
        'Where have you been relying only on your own calculations lately?',
        'What does acknowledging God look like in your small choices today?',
        'Which decision needs patient prayer before taking action?',
      ],
      actionCore: 'Seek God’s peace and wisdom before making any important decision today.',
      actionItems: [
        {
          id: 'wisdom-en-1',
          title: '3-Minute Proverbs Reading',
          description: 'Read one short passage from Proverbs and underline one verse of wisdom.',
          category: 'word',
        },
        {
          id: 'wisdom-en-2',
          title: 'Listen Twice as Much',
          description: 'Be quick to listen and slow to speak in conversations today.',
          category: 'love',
        },
        {
          id: 'wisdom-en-3',
          title: '5-Second Pause Before Reacting',
          description: 'In tense moments, pause 5 seconds to ask God for a wise response.',
          category: 'prayer',
        },
      ],
      prayerTitle: '1-Minute Prayer for Wisdom',
      prayerBody:
        'Source of all wisdom, I choose to trust You with my whole heart today rather than leaning on my limited understanding. Grant me discernment to recognize what is good and pleasing to You, and guide every step I take. In Jesus’ name, Amen.',
      prayerConfession: 'As I acknowledge the Lord, He makes my path straight.',
      praise: {
        title: 'Guide Me, O Thou Great Jehovah',
        artist: 'Traditional Hymn',
        lyricSnippet: 'Pilgrim through this barren land; I am weak, but Thou art mighty.',
        theme: 'Guidance & Wisdom',
      },
      spiritualHabit: 'Read one Bible verse before checking notifications in the morning.',
      readingSuggestion: 'Proverbs 3 (Trust in the Lord)',
    },
    {
      themeTitle: 'A Lamp to My Feet and a Light to My Path',
      themeSubtitle: 'Faithful light for the very next step before you',
      verse: {
        reference: 'Psalm 119:105',
        testament: 'OT',
        book: 'Psalms',
        chapter: 119,
        verseRange: '105',
        text: 'Your word is a lamp to my feet, and a light for my path.',
        context:
          'Like a handheld lamp illuminating one step at a time along a dark road, Scripture faithfully guides us through each day.',
        keyword: 'Light of the Word',
      },
      reflectionGuide:
        'God rarely shows the entire ten-year map at once. Instead, His Word lights the exact step right in front of your feet. Walk honestly in the light He gives you today.',
      reflectionQuestions: [
        'Are worries about the distant future distracting you from today’s step?',
        'Which Scripture has brought light to you during a confusing season?',
        'What single truth can you put into practice today?',
      ],
      actionCore: 'Keep today’s verse on a small card or note and reflect on it throughout the day.',
      actionItems: [
        {
          id: 'wisdom-en-4',
          title: 'Memorize Psalm 119:105',
          description: 'Quietly recite today’s verse while walking or commuting.',
          category: 'word',
        },
        {
          id: 'wisdom-en-5',
          title: 'Choose Integrity in Small Things',
          description: 'Act with honesty and faithfulness even when no one is watching.',
          category: 'love',
        },
        {
          id: 'wisdom-en-6',
          title: 'Pray for a Wise Mentor',
          description: 'Lift up a prayer of thanks for someone who gives you godly counsel.',
          category: 'prayer',
        },
      ],
      prayerTitle: '1-Minute Prayer of Light',
      prayerBody:
        'God of Light, thank You for giving Your Word to guide my steps in a confusing world. Even when I cannot see far ahead, I walk in peace because Your truth lights my feet. Lead me in the way of life today. In Jesus’ name, Amen.',
      prayerConfession: 'God’s Word is the sure lamp lighting my step today.',
      praise: {
        title: 'Holy, Holy, Holy',
        artist: 'Traditional Hymn',
        lyricSnippet: 'Early in the morning our song shall rise to Thee.',
        theme: 'Reverence & Light',
      },
      spiritualHabit: 'Review your day tonight and thank God for His guidance.',
      readingSuggestion: 'Psalm 119:97-112 (Sweeter Than Honey)',
    },
  ],

  love: [
    {
      themeTitle: 'Walking in Patient, Kind Love',
      themeSubtitle: 'Reflecting the heart of Christ to those around you',
      verse: {
        reference: '1 Corinthians 13:4-7',
        testament: 'NT',
        book: '1 Corinthians',
        chapter: 13,
        verseRange: '4-7',
        text: 'Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud, doesn’t behave itself inappropriately, doesn’t seek its own way, is not provoked, takes no account of evil; bears all things, believes all things, hopes all things, and endures all things.',
        context:
          'Paul reminds the church that without selfless, Christlike love, even the greatest gifts fall short of God’s heart.',
        keyword: 'Gentle Agape Love',
      },
      reflectionGuide:
        'While the world rushes to put self first, the love of the cross is patient, gentle, and generous. Your kindness today can become living water to a weary heart nearby.',
      reflectionQuestions: [
        'Who has been hardest for you to show patience toward recently?',
        'How has Jesus shown patience and forgiveness toward you?',
        'Where can you choose gentleness over frustration today?',
      ],
      actionCore: 'Say a quiet prayer of blessing for someone who has been on your mind.',
      actionItems: [
        {
          id: 'love-en-1',
          title: 'Share a Small Treat or Drink',
          description: 'Offer a coffee, tea, or snack with a kind word to someone working hard.',
          category: 'love',
        },
        {
          id: 'love-en-2',
          title: 'Speak with Gentleness',
          description: 'Respond calmly and warmly even if a stressful situation arises.',
          category: 'word',
        },
        {
          id: 'love-en-3',
          title: 'Tell Loved Ones You Care',
          description: 'Express "I love you" or "I appreciate you" to family today.',
          category: 'thanks',
        },
      ],
      prayerTitle: '1-Minute Prayer of Love',
      prayerBody:
        'Father of Love, thank You for loving me first with endless grace. Fill my heart with Your patience, kindness, and humility. Help me seek the good of others today so that the fragrance of Christ’s love shines through me. In Jesus’ name, Amen.',
      prayerConfession: 'As Christ has loved me, I gladly love my neighbors.',
      praise: {
        title: 'Love Divine, All Loves Excelling',
        artist: 'Traditional Hymn',
        lyricSnippet: 'Joy of heaven, to earth come down.',
        theme: 'Love & Grace',
      },
      spiritualHabit: 'Before criticizing anyone, think of three good qualities in them.',
      readingSuggestion: '1 Corinthians 13 (The Way of Love)',
    },
    {
      themeTitle: 'Love One Another as I Have Loved You',
      themeSubtitle: 'The unmistakable mark of Christ’s disciples',
      verse: {
        reference: 'John 13:34',
        testament: 'NT',
        book: 'John',
        chapter: 13,
        verseRange: '34',
        text: 'A new commandment I give to you, that you love one another. Just as I have loved you, you also love one another.',
        context:
          'After humbly washing His disciples’ feet, Jesus gave this enduring command as the defining sign of His followers.',
        keyword: 'Serving Love',
      },
      reflectionGuide:
        'Jesus’ standard of love is humble, active service. Today, look for one simple, unseen way to serve someone with joy and sincerity.',
      reflectionQuestions: [
        'Whose burdens can you help lighten in a practical way today?',
        'How can your love show up in action, not only in words?',
        'What wall in your heart melts when you remember Jesus’ love?',
      ],
      actionCore: 'Do one helpful task for someone else today without expecting credit.',
      actionItems: [
        {
          id: 'love-en-4',
          title: 'Tidy a Shared Space',
          description: 'Quietly clean or organize a shared area at home or work.',
          category: 'love',
        },
        {
          id: 'love-en-5',
          title: 'Check In on an Old Friend',
          description: 'Send a warm message asking how they are doing and cheering them on.',
          category: 'thanks',
        },
        {
          id: 'love-en-6',
          title: 'Share Today’s Verse',
          description: 'Pass along today’s encouraging Scripture to someone who needs hope.',
          category: 'word',
        },
      ],
      prayerTitle: '1-Minute Prayer of Service',
      prayerBody:
        'Lord Jesus, You stooped low to wash Your disciples’ feet. Give me a humble and generous heart to serve others joyfully today. Let every small act of kindness point quietly to Your love. In Jesus’ name, Amen.',
      prayerConfession: 'Christ’s love flows through me as I serve with joy.',
      praise: {
        title: 'Blest Be the Tie That Binds',
        artist: 'Traditional Hymn',
        lyricSnippet: 'Our hearts in Christian love.',
        theme: 'Fellowship & Love',
      },
      spiritualHabit: 'Serve someone else first at the table today.',
      readingSuggestion: '1 John 4 (God Is Love)',
    },
  ],

  peace: [
    {
      themeTitle: 'The Peace of God Beyond Understanding',
      themeSubtitle: 'Prayer that guards your heart and mind in Christ',
      verse: {
        reference: 'Philippians 4:6-7',
        testament: 'NT',
        book: 'Philippians',
        chapter: 4,
        verseRange: '6-7',
        text: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.',
        context:
          'Paul gives a practical remedy for anxiety: bring every request to God with thanksgiving, and His peace will stand watch over your mind.',
        keyword: 'Shalom & Peace',
      },
      reflectionGuide:
        'Even when storms stir the surface of the ocean, the deep water remains still. God’s peace is deeper than today’s noise. Trade every anxious thought for a thankful prayer.',
      reflectionQuestions: [
        'What quiet worry is trying to disturb your peace today?',
        'When have you experienced God’s surprising calm in the past?',
        'What request can you lift to God with thanksgiving right now?',
      ],
      actionCore: 'When worry appears, pray immediately: "Lord, I place this in Your hands."',
      actionItems: [
        {
          id: 'peace-en-1',
          title: '3 Minutes of Still Prayer',
          description: 'Sit quietly for 3 minutes, resting in God’s peaceful presence.',
          category: 'prayer',
        },
        {
          id: 'peace-en-2',
          title: 'Bring Calm into Conversations',
          description: 'Respond with unhurried warmth and steady eyes to those you meet.',
          category: 'love',
        },
        {
          id: 'peace-en-3',
          title: 'Play Peaceful Instrumental Music',
          description: 'Listen to gentle piano hymns to keep a restful atmosphere.',
          category: 'thanks',
        },
      ],
      prayerTitle: '1-Minute Prayer for Peace',
      prayerBody:
        'Prince of Peace, thank You for guarding my heart and mind amid a busy world. I bring every concern to You with thanksgiving. Quiet my anxious thoughts and let Your deep shalom rule over my day. In Jesus’ name, Amen.',
      prayerConfession: 'The peace of God stands guard over my heart and mind.',
      praise: {
        title: 'Like a River Glorious',
        artist: 'Traditional Hymn',
        lyricSnippet: 'Like a river glorious is God’s perfect peace.',
        theme: 'Peace & Stillness',
      },
      spiritualHabit: 'Thank God for restful sleep as you close your eyes tonight.',
      readingSuggestion: 'John 14 (Do Not Let Your Hearts Be Troubled)',
    },
    {
      themeTitle: 'The Creator Who Speaks Light into Darkness',
      themeSubtitle: 'Turning chaos into order and opening a new beginning',
      verse: {
        reference: 'Genesis 1:1-3',
        testament: 'OT',
        book: 'Genesis',
        chapter: 1,
        verseRange: '1-3',
        text: 'In the beginning, God created the heavens and the earth. The earth was formless and empty... God said, "Let there be light," and there was light.',
        context:
          'The majestic opening of Scripture reveals a sovereign Creator whose Spirit hovers over emptiness and speaks new light into being.',
        keyword: 'Creation & New Start',
      },
      reflectionGuide:
        'Whenever life feels chaotic or uncertain, remember that the Spirit of God hovers over the dark waters ready to speak "Let there be light." Trust the Creator to bring fresh beauty to your day.',
      reflectionQuestions: [
        'Where in your life do you need God to speak fresh light today?',
        'Can you entrust your smaller problems to the Creator of the universe?',
        'What new step of faith would you like to begin today?',
      ],
      actionCore: 'Look at the daylight today and pray, "Lord, shine Your new light into my life."',
      actionItems: [
        {
          id: 'peace-en-4',
          title: 'Open a Window & Refresh',
          description: 'Let fresh air in and tidy your desk or room for a clean start.',
          category: 'word',
        },
        {
          id: 'peace-en-5',
          title: 'Write One Fresh Intention',
          description: 'Write "A new day begun with God" at the top of your notes.',
          category: 'thanks',
        },
        {
          id: 'peace-en-6',
          title: 'Admire God’s Creation',
          description: 'Pause to thank God for trees, sky, or sunlight you see today.',
          category: 'prayer',
        },
      ],
      prayerTitle: '1-Minute Prayer to the Creator',
      prayerBody:
        'Almighty Creator, thank You for speaking light into darkness and bringing order out of chaos. I trust Your creative power over my life today. Begin a fresh season of grace in me and let me reflect Your light. In Jesus’ name, Amen.',
      prayerConfession: 'My Creator is shaping my life with new light and grace.',
      praise: {
        title: 'This Is My Father’s World',
        artist: 'Traditional Hymn',
        lyricSnippet: 'This is my Father’s world, and to my listening ears all nature sings.',
        theme: 'Creation & Wonder',
      },
      spiritualHabit: 'Pause once outdoors today to praise God for His handiwork.',
      readingSuggestion: 'Genesis 1 (In the Beginning)',
    },
  ],
};
