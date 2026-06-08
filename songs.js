/* ============================================================================
   SONGS DATABASE  —  this is the ONLY file you edit to add/remove songs.
   ----------------------------------------------------------------------------
   Format is ChordPro. Rules:
     - Put chords in [square brackets] right before the syllable they land on:
         [G]Amazing [G7]grace, how [C]sweet the [G]sound
     - {title: ...}   song title (shown in the list + header)
     - {key: ...}     the ORIGINAL key (lets the app show "Original: G")
     - {comment: ...} a label line, e.g. {comment: Bridge} or {comment: x2}
     - {start_of_chorus} ... {end_of_chorus}   marks a chorus block
     - {start_of_verse}  ... {end_of_verse}    marks a verse block
     - Bar lines / measures: just type |   e.g.  | [G] . . . | [C] . . . |
   Blank line = paragraph break.

   To add a song: copy one block below, paste it, edit the text. Save, redeploy.
   The samples below are PUBLIC-DOMAIN hymns. Replace them with your set list.

   ---- TWO LANGUAGES (e.g. Ukrainian + English) ----
   A song can be a plain ChordPro string (one language) OR an object with
   multiple versions that the app shows as tappable language tabs:

     {
       title: "Великий Бог",            // optional; else taken from first version
       versions: [
         { lang: "Українською", text: `{title: Великий Бог}\n{key: A}\n...` },
         { lang: "English",      text: `{title: How Great Thou Art}\n{key: G}\n...` }
       ]
     }

   Each version keeps its OWN key and its OWN transpose setting (the English
   version can sit in a different key than the Ukrainian one). If instead you
   want both languages on screen at once (line under line), just write ONE
   string with the lines alternating; no object needed.
   ========================================================================== */
window.SONGS = [
  {
    title: "Приклад / Sample (bilingual)",
    versions: [
      {
        lang: "Українською",
        text: `{title: Приклад пісні}
{key: A}

{comment: Verse}
[A]Це приклад [D]тексту пісні [E]українською [A]мовою
[A]Заміни цей [D]блок своєю [E]власною [A]піснею

{comment: Chorus}
[D]Пошук пра[A]цює з кири[E]лицею [A]теж`,
      },

      {
        lang: "English",
        text: `{title: Sample Song}
{key: G}

{comment: Verse}
[G]This is a [C]sample of song [D]lyrics in [G]English
[G]Replace this [C]block with a [D]song of your [G]own

{comment: Chorus}
[C]Each language [G]keeps its [D]own key and [G]transpose`,
      },
    ],
  },

  `{title: So Be It}
{key: Ab}

{comment: Intro}
| [Gb/Ab] . . . | [Db/Ab] . . . | [Ab] . . . . |

{comment: Verse 1}
[Gb/Ab]When the King speaks a word
[Db/Ab]It cannot be overturned
[Ab]It's as good as done
[Gb/Ab]And when Heaven touches earth
[Db/Ab]It can never be reversed
[Ab]It's the Kingdom come
[Gb/Ab]So get the liars out the way
[Db/Ab]They don't have the final say
[Ab]There is only One
[Gb]Sovereign and Supreme
[Db]Every word He speaks is Holy [Ab]

{comment: Chorus}
[Ab]The Lamb of God has overcome
My testimony is His blood
And if He said that it is done, it is done
[Gb]So [F]be [Db]it [Ab]God

{comment: Verse 2}
[Gb/Ab]To the One on the throne
[Db/Ab]Who can not be overthrown
[Ab]Sing Hallelujah
[Gb/Ab]To the Last and the First
[Db/Ab]Ruler of the universe
[Ab]Sing Hallelujah
To the [Gb/Ab]Alpha, [Gb/C]Omega
The [Db/F]Master, the [Db/Ab]Maker
The [Ab]Name [Ab/C]a - bove [Ab]
[Gb]Every other name
[Db/F]Give Him all the praise
He's [Db]ho - [C]ly [Ab]

{comment: Chorus}
[Ab]The Lamb of God has overcome
My testimony is His blood
And if He said that it is done, it is done
[Gb]So [F]be [Db]it [Ab]God

[Ab]The weapons of the enemy
They have no power over me
The One with all authority covers me
[Gb]So [F]be [Db]it [Ab]God
[Gb]So [F]be [Db]it [Ab]God

{comment: Chorus Tag}
[Gb]So [F]be [Db]it [Ab]God

{comment: Bridge 1}
[Ebm]From a throne to a [Bbm]cross
[Db]Who would pay such a [Ab]price
[Ebm]For the sin of the [Bbm]world
[Db]Here's your King crucified

[Ebm]See the nails in His [Bbm]hands
[Db]See the wounds in His [Ab]side
[Ebm]See the crown meant to [Db]mock
That in[Ab]stead prophesied

[Ebm]Don't forget that He [Bbm]said
[Db]On the third He would [Ab]rise
[Ebm]That it was not the [Db]end
Wipe the [Ab]tears from your eyes

{comment: Bridge 1 Tag x4}
[Ebm]He's alive [Bbm]He's alive
[Db]He's alive [Ab]He's alive

{comment: Instrumental 1}
| [Gb] [F] [Db] | [Ab] . . . | [Gb] [F] [Db] | [Ab] . . . |
| [Gb] [F] [Db] | [Ab] . . . . . . . . . . . . . |

{comment: Bridge 2 x2}
[Ab]It is final, [Ebm]It is written
[Bbm]It is settled, [Ab]It is finished
[Ebm]See that old grave, He was in it
[Bbm]Now He isn't, [Ab]He is risen

{comment: Bridge 2 Tag}
[Gb]Hallelujah Hallelujah [Ab]Hallelujah Hallelujah [Bbm]
[Gb]Hallelujah Hallelujah [Ab]Hallelujah Hallelujah [Bbm]

{comment: Instrumental 2}
| [Ebm] . . . | [Bbm] . . . | [Db] . . . | [Ab] . . . |

{comment: Verse 3}
[Ebm]Like a thief in the [Bbm]night
[Db]He'll return for His [Ab]bride
[Ebm]Even so, Jesus [Bbm]come
[Db]Jesus come split the [Ab]skies

{comment: Outro}
[Gb]So [F]be [Db]it [Ab]God`,

  `{title: Only A Holy God}
{key: D}

{comment: Intro/Turns x2}
| [Bm] . [D] . | [G] . [D] . . . . . |

{comment: Verse 1}
[Bm]Who else com[D]mands all the [G]hosts of [D]heaven
[Bm]Who else could [D]make every [G]king bow [D]down
[Bm]Who else can [D]whisper and [G]darkness [D]trembles
[G]Only a [A]Holy [D]God

{comment: Verse 2}
[Bm]What other [D]beauty de[G]mands such [D]praises
[Bm]What other [D]splendour out[G]shines the [D]sun
[Bm]What other [D]majesty [G]rules with [D]justice
[G]Only a [A]Holy [D]God

{comment: Chorus}
[Bm]Come and be[G]hold Him
[D]The One and the [A]Only
[Bm]Cry out, sing [G]holy
[D]Forever a [A/C#]Holy [Bm]God
[G]Come and [A]worship the Holy [D]God

{comment: Verse 3}
[Bm]What other [D]glory con[G]sumes like [D]fire
[Bm]What other [D]power can [G]raise the [D]dead
[Bm]What other [D]name remains [G]unde[D]feated
[G]Only a [A]Holy [D]God

{comment: Chorus x2}
[Bm]Come and be[G]hold Him
[D]The One and the [A]Only
[Bm]Cry out, sing [G]holy
[D]Forever a [A/C#]Holy [Bm]God
[G]Come and [A]worship the Holy [D]God

{comment: Verse 4}
[Bm]Who else could [D]rescue me [G]from my [D]failing
[Bm]Who else would [D]offer His [G]only [D]Son
[Bm]Who else in[D]vites me to [G]call Him [D]Father
[G]Only a [A]Holy [D]God
[G]Only my [A]Holy [D]God

{comment: Chorus}
[Bm]Come and be[G]hold Him
[D]The One and the [A]Only
[Bm]Cry out, sing [G]holy
[D]Forever a [A/C#]Holy [Bm]God
[G]Come and [A]worship the Holy [D]God`,

  `{title: Закохавсь}
{key: D}

{comment: Intro x2}
| [D] . . . | [D] . . . | [G] . . . | [G] . . . |

{comment: Verse 1}
[D]Далеко було моє серце,
[G]Коли в житті Ти моє прийшов.
[D]І я не думав, що це можливо,
[G]Але любов – це все, що важливо!

{comment: Chorus}
[D]Закохавсь і не уявляю
[A]Те життя, де Тебе немає.
[Hm]Серце захопила
[G]Любов, що мені відкрилась.

{comment: Turnaround}
| [D] . . . | [D] . . . | [G] . . . | [G] . . . |

{comment: Verse 2}
[D]Далеко було моє серце,
[G]Коли в житті Ти моє прийшов.
[D]І я не думав, що це можливо,
[G]Але любов – це все, що важливо!
[D]І я не думав, що це можливо,
[G]Але любов – це все, що важливо!

{comment: Chorus}
[D]Закохавсь і не уявляю
[A]Те життя, де Тебе немає.
[Hm]Серце захопила
[G]Любов, що мені відкрилась.

{comment: Bridge 1 x4}
[G]Врятував мою душу –
[D]Непроміняю цю любов.
[A]
[Hm]      [G] [D] [A]

{comment: Chorus}
[D]Закохавсь і не уявляю
[A]Те життя, де Тебе немає.
[Hm]Серце захопила
[G]Любов, що мені відкрилась.

{comment: Bridge 2 x4}
[G]Ти є сильний,
[D]Ти могутній, Бог!
[A]Ти є сильний,
[A]Тиdrop могутній, Бог!
[G]Я нічого не боюсь!

{comment: Outro}
| [G] | [D] | [A] | [A] |`,

  {
    title: "Вільний я / I Thank God",
    versions: [
      {
        lang: "Українською",
        text: `{title: Вільний я}
{key: B}

{comment: Intro}
[B] [Bsus] [B] [Bsus] [B] [Bsus]

{comment: Verse 1}
[B]Я уночі блукав,
[B]Притистку я шукав.
[E]Себе знайшов, безсилий став.
[B]Силу шукав в собі,
[B]Змучився в боротьбі
[E]І плив повільно по течії.

{comment: Prechorus}
[F#]Як боротьбу я припинив –
[E]Ісус Христос мене зустрів,
[F#]Сказав мені, що не самотній я. [G#m] [E]

{comment: Chorus}
[B]Ти долю так змінив мою! [C#m7]
[B/D#]На скелі я тепер стою! [E]
[G#m]Тобі я вдячний,
[E]Господь – Спаситель.
[B]Бо Ти зцілив мене, змінив мене. [C#m7]
[B/D#]Навік вільний я тепер. [E]
[G#m]Тобі я вдячний,
[E]Господь – Спаситель.
[B]Ти – мій Бог.

{comment: Verse 2}
[B]Я вільний у Боже Ім'я,
[B]Вже вирі йду я.
[E]Мій сум і звину,
[E]Розвіявся, мов дим.

[B]Старим своїм приятелям –
[B]Смуткам і тягарям
[E]Скажу: "Не знаю я вас!
[E]Пройшов назавжди ваш час!"

{comment: Prechorus}
[F#]Спіткати муг Тебе я
[E]По днях, як буду в небесах.
[F#]Цей блуклий син
[E]Знайшов додому шлях.

{comment: Chorus}
[B]Ти долю так змінив мою! [C#m7]
[B/D#]На скелі я тепер стою! [E]
[G#m]Тобі я вдячний,
[E]Господь – Спаситель.
[B]Бо Ти зцілив мене, змінив мене. [C#m7]
[B/D#]Навік вільний я тепер. [E]
[G#m]Тобі я вдячний,
[E]Господь – Спаситель.
[B]Ти – мій Бог.

{comment: Bridge 1}
[B]Пекло мене втратило!
[B]Вільний я! Вільний я! Вільний я!

{comment: Bridge 2}
[F#]Пекло мене втратило!
[G#m]Вільний я! [E]Вільний я! [B]Вільний я!`,
      },

      {
        lang: "English",
        text: `{title: I Thank God}
{key: B}

{comment: Intro}
[B] [Bsus] [B] [Bsus] [B] [Bsus]

{comment: Verse 1}
[B]Wandering into the night
[B]Wanting a place to hide
This weary [E]soul, this bag of[B] bones
[B]And I tried with all my might
[B]But I just can't win the fight
I'm slowly [E]drifting, a [B]vagabond

{comment: Prechorus}
And [F#]just when I ran [G#m]out of road
I [E]met a man I [B]didn't know
And [F#]He told me that [B/D#]I was not a[E]lone

{comment: Chorus}
He [B]picked me up
He [C#m]turned me around
He [B/D#]placed my feet on [E]solid ground
I thank the [G#m]Master
I thank the [E]Savior
Because He [B]healed my heart
He [C#m]changed my name
For[B/D#]ever free, I'm [E]not the same
I thank the [G#m]Master
I thank the [E]Savior
I thank [B]God

{comment: Interlude}
[B] [Bsus4]

{comment: Verse 2}
[B]I cannot dеny what I see
[B]Got no choice but to believе
My doubts are [E]burning
Like ashes in the [B]wind
[B]So, so long to my old friends
[B]Burden and bitterness
You can just keep it [E]moving
Nah, you ain't welcome [B]here
From [F#]now 'til I walk the [G#m]streets of gold
I'll [E]sing of how you [B]saved my soul
This [F#]wayward son has [B/D#]found his way back [E]home

{comment: Chorus}
He [B]picked me up
He [C#m]turned me around
He [B/D#]placed my feet on [E]solid ground
I thank the [G#m]Master
I thank the [E]Savior
Because He [B]healed my heart
He [C#m]changed my name
For[B/D#]ever free, I'm [E]not the same
I thank the [G#m]Master
I thank the [E]Savior
Oh, I thank [B]God

{comment: Interlude}
[B] [Bsus4] [B] [Bsus4] [B] [Bsus4] [B] [Bsus4]

{comment: Bridge 1}
[B]Hell lost another one
[B]I am free, I am free, I am free
[B]Hell lost another one
[B]I am free, I am free, I am free
[B]Hell lost another one
[B]I am free, I am free, I am free
[B]Hell lost another one
[B]I am free, I am free, I am free

{comment: Bridge 2}
[F#]Hell lost another one
[G#m]I am free, [E]I am free, [B]I am free
[F#]Hell lost another one
[G#m]I am free, [E]I am free, [B]I am free
[F#]Hell lost another one
[G#m]I am free, [E]I am free, [B]I am free
[F#]Hell lost another one
[G#m]I am free, [E]I am free, [B]I am free

{comment: Chorus}
He [B]picked me up
He [C#m]turned me around
He [B/D#]placed my feet on [E]solid ground
I thank the [G#m]Master
I thank the [E]Savior
Because He [B]healed my heart
He [C#m]changed my name
For[B/D#]ever free, I'm [E]not the same
I thank the [G#m]Master
I thank the [E]Savior
I thank [B]God

{comment: Spontaneous}
[B]`,
      },
    ],
  },

  `{title: Lion}
{key: F}

{comment: Intro}
| [Dm] . . . | [Bb] . . . | [F] . . . | [C] . . . |

{comment: Verse 1}
[Dm]God of Jacob, [Bb]Great I Am
[F]King of Angels, [C]Son of Man
[Dm]Voice of many [Bb]waters
[F]Song of Heaven's [C]throne
[Dm]Louder than the [Bb]thunder
[F]Make Your glory [C]known

{comment: Chorus}
[Dm]Hail, hail [Bb]Lion of Judah
[F]Let the Lion [C]roar
[Dm]Hail, hail [Bb]Lion of Judah
[F]Let the Lion [C]roar

{comment: Verse 2}
[Dm]Pride of Zion, [Bb]Prophet spoke
[F]Our Messiah, [C]Flesh and bone
[Dm]You alone are [Bb]worthy
[F]To open up the [C]scroll
[Dm]Like a Lamb You [Bb]suffered
[F]But the Lion has [C]roared

{comment: Chorus x2}
[Dm]Hail, hail [Bb]Lion of Judah
[F]Let the Lion [C]roar
[Dm]Hail, hail [Bb]Lion of Judah
[F]Let the Lion [C]roar

{comment: Bridge}
[Dm]Prepare the way
[Bb]Prepare the way of the Lord
[F]O valley be raised up
[C]O mountain be made low

[Dm]Prepare the way
[Bb]Prepare the way of the Lord
[F]O valley be raised up
[C]O mountain be made low

{comment: Chorus x2}
[Dm]Hail, hail [Bb]Lion of Judah
[F]Let the Lion [C]roar
[Dm]Hail, hail [Bb]Lion of Judah
[F]Let the Lion [C]roar`,

  `{title: Oceans (Where Feet May Fail)}
{key: D}

{comment: Intro}
| [Bm] . . . | [G] . . . | [D] . . . | [A] . . . |

{comment: Verse 1}
[Bm]You call me out upon the [G]waters
The great un[D]known where feet may [A]fail
[Bm]And there I find You in the [G]mystery
In oceans [D]deep my faith will [A]stand

{comment: Chorus}
[G]And I will call upon Your [D]Name
[A]And keep my eyes above the [Bm]waves
When oceans [G]rise
My soul will rest in Your em[D]brace
For I am [A]Yours and You are [Bm]mine

{comment: Verse 2}
[Bm]Your grace abounds in deepest [G]waters
Your sovereign [D]hand will be my [A]guide
[Bm]Where feet may fail and fear sur[G]rounds me
You've never [D]failed and You won't [A]start now

{comment: Chorus x2}
[G]And I will call upon Your [D]Name
[A]And keep my eyes above the [Bm]waves
When oceans [G]rise
My soul will rest in Your em[D]brace
For I am [A]Yours and You are [Bm]mine

{comment: Bridge}
[Bm]Spirit lead me where my trust is without [G]borders
Let me walk upon the [D]waters
Wherever You would [A]call me

[Bm]Take me deeper than my feet could ever [G]wander
And my faith will be made [D]stronger
In the presence of my [A]Savior

{comment: Bridge x3}
[Bm]Spirit lead me where my trust is without [G]borders
Let me walk upon the [D]waters
Wherever You would [A]call me

[Bm]Take me deeper than my feet could ever [G]wander
And my faith will be made [D]stronger
In the presence of my [A]Savior

{comment: Chorus}
[G]And I will call upon Your [D]Name
[A]And keep my eyes above the [Bm]waves
When oceans [G]rise
My soul will rest in Your em[D]brace
For I am [A]Yours and You are [Bm]mine`,

  `{title: No One Like The Lord}
{key: E}

{comment: Intro}
[F#m/C#]
[C#m] [B/D#] [E] [F#m7] [A] [B] [C#m]
[C#m] [B/D#] [E] [F#m7] [A] [B] [C#m]

{comment: Verse 1}
There is One on the t[A]hrone
Jes[E]us, ho[G#m7]ly
[C#m]He is worthy of [F#m7]praise
Hono[E]r and glor[B]y
(Hey)

{comment: Verse 2}
[C#m]There is One on the [A]throne
Jes[E]us, ho[G#m7]ly
(You are, You are)
[C#m]He is worthy of [F#m7]praise
Hon[E]or and glo[B]ry

{comment: Chorus}
(So we sing)
[C#m]Worthy [B/D#]is the [E]Lamb
Who was s[F#m]lain and seated on the [A]throne
There’s [B]no one like the [C#m]Lord
And the [C#m]elders, [B/D#]creatures [E]bow
Giving [F#m]praise to Him and Him a[A]lone
‘Cause there’s [B]no one like the [C#m]Lord
(Yeah)

{comment: Verse 3}
There is One on the [A]throne
Je[E]us, ho[G#m7]ly
[C#m]He is worthy of [F#m7]praise
All the hon[E]or and glo[B]ry
(You are, You are)

{comment: Chorus}
[C#m]Worthy [B/D#]is the [E]Lamb
Who was [F#m]slain and seated on the t[A]hrone
There’s n[B]o one like the [C#m]Lord
Woah, and the [C#m]elders, [B/D#]creatures [E]bow
Giving p[F#m]raise to Him and Him [A]alone
‘Cause there’s [B]no one like the [C#m]Lord

{comment: Chorus}
(Oh and we cry)
[C#m]Worthy [B/D#]is the [E]Lamb
Who was [F#m]slain and seated on the [A]throne
There’s [B]no one like the [C#m]Lord
And the [C#m]elders, [B/D#]creatures [E]bow
Giving [F#m]praise to Him and Him [A]alone
‘Cause there’s [B]no one like the [C#m]Lord

{comment: Bridge}
And we crown You King of [C#m]glory
And we crown You King of [C#m]glory
And we crown You King of [A]glory
And we [B]crown You Lord of [C#m]all

We crown You, You are [C#m]worthy
We crown You, You are [C#m]worthy
We crown You, You are [A]worthy
We [B]crown You Lord of [C#m]all
And we crown You King of [C#m]glory
And we crown You King of [C#m/E]glory
And we crown You King of [A]glory
And we [B]crown You Lord of [C#m]all

We crown You, You are [F#m]worthy
We crown You, You are [C#m/E]worthy
We crown You, You are [A]worthy
We [B]crown You Lord of [C#m]all

{comment: Chorus}
Oh we sing [A]worthy [B/A]is the [A]Lamb
Who was [F#m]slain and seated on the [A]throne
And there’s [B]no one like the [C#m]Lord
All of the [A]elders, [B]creatures [C#m]bow
Giving [F#m]praise to Him and Him [A]alone
‘Cause there’s no one like the [C#m]Lord

{comment: Chorus}
(Oh, You are)
[A]Worthy [B]is the [C#m]Lamb
Who was [F#m]slain and seated on the [A]throne
There’s [B]no one like the [C#m]Lord
And all of the [A]elders, [B]creatures [C#m]bow
Giving [F#m]praise to Him and Him [A]alone
‘Cause there’s [B]no one like the [F#]Lord

{comment: Interlude}
[A]There’s no one like you
[F#]There’s just no one like you
Yea[A]h
(There’s no one like the Lord)
There’s no one like the [F#]Lord
(There’s no one like the Lord)
So wonderful in all His [A]ways
(There’s no one like the Lord)
So beautiful in all His [F#]ways
(There’s no one like the Lord)
So majest[A]ic
(There’s no one like the Lord)
Oh the King above all [F#]Kings
(There’s no one like the Lord)
Yea[A]h
(There’s no one like the Lord)
Oh the angels around your [F#]throne
(There’s no one like the Lord)
Every time they sing, they sing a new song at your feet
[A](There’s no one like the Lord)
They cry Holy, Holy, [F#]Holy
(There’s no one like the Lord)
They cry worthy, worthy, [A]worthy
(There’s no one like the Lord)
’cause there’s no like you [F#]
(There’s no one like the Lord)

{comment: Bridge}
And we crown You King of [C#m]glory
And we crown You King of [C#m/E]glory
And we crown You King of [F#]glory
And we crown You Lord of [A]all

We crown You, You are [C#m]worthy
We crown You, You are [C#m/E]worthy
We crown You, You are [F#]worthy
We crown You Lord of [A]all

{comment: Chorus}
Oh we sing [A]worthy i[B/A]s the [A]Lamb
Who was [F#m]slain and seated on the [A]throne
And there’s [B]no one like the [C#m]Lord
[A]All the [B]creatures [C#m]bow
Giving [F#m]praise to Him and Him [A]alone
‘Cause there’s [B]no one like the [C#m]Lord

[A]Worthy [B]is the [C#m]Lamb
Who was [F#m]slain and seated on the [A]throne
There’s [B2]no one like the [C#m]Lord
And the [A]elders, [B2]creatures [C#m]bow
Giving [F#m7]praise to Him and Him [A]alone
‘Cause there’s [B2]no one like the [F#]Lord
There’s no one like you
[A] (There’s [B2]no one like the [C#m]Lord)
There’s no one like you
[A] (There’s [B2]no one like the [C#m]Lord)

[A]There’s just [B2]no one like the [C#m]Lord`,

  `{title: We Fall Down}
{key: F}

{comment: Chorus}
[F]We fall down, we lay our [C]crowns [Dm7]
At the [Bb]feet of [Gm]Jesus

[F]The greatness of mercy and [C]love [Dm7]
At the [Bb]feet of [Gm]Jesus

{comment: Chorus}
[F/A]And we cry [Bb]holy, holy, [F/A]ho[Gm]ly
[F/A]And we cry [Bb]holy, holy, [F/A]ho[Gm]ly
And we cry [Bb]holy, holy, holy is the [F/A]Lamb [Gm] [Csus] [C]`,

  `{title: Jesus I Come}
{key: G}

{comment: Verse 1}
Oh how I [C]need your [G]grace
More than my [C]words can [G]say
Jesus I [Em]come Jesus I [C]come
In all [C]my [G]weaknesses
You are [C]my [G]confidence
Jesus I [Em]come Jesus I [C]come

{comment: Chorus}
I will [C]rise and stand re[Em]deemed
Heaven [G/B]open over [D]me
To your [C]name e[Em]ternally
Endless [G/B]glory I will [D]bring

{comment: Verse 2}
Oh what a[C]mazing [G]love
Beneath your [C]cleansing [G]flood
Jesus I [Em]come Jesus I [C]come
In every [C]broken [G]place
You are [C]my [G]righteousness
Jesus I [Em]come Jesus I [C]come

{comment: Tag}
[G]Thank you Jesus [D]Just [Am]as [Em]I [C]am I [G]come
[G]Halle[D]lu[Am]j[Em]ah [C]Oh what a[D]mazing [G]love`,

  `{title: Freedom}
{key: G}

{comment: Intro}
| [Em] . | [C] . | [G] . | [Bm7] . |

{comment: Verse 1}
Step out of the [Em]shadows, step out of the [C]grave [G]
[Bm7]Break into the [Em]wild and [C]don't be afraid [D] [Bm7]

[Bm7]Run into wide open [C]spaces, [Em7]grace is waiting [D]for you
[Bm7]Dance like the [C]weight has been lifted, grace is [Em7]wait[D]ing

{comment: Chorus}
Where the [C]Spirit of the Lord is
[G]There is freedom, [Em]there is [D]freedom
Where the [C]Spirit of the Lord is
[G]There is freedom, [Em]there is [D]freedom
Come out of the [Em]dark just as you [C]are
[G]Into the fullness [Bm7]of His love
For the [Em]Spirit is here, [C]let there be [D]freedom
[D]Let there be freedom

{comment: Interlude 1}
| [Em] . | [C] . | [G] . | [Bm7] . | (x2)

{comment: Verse 2}
Bring all of your [Em]burdens, bring [C]all of your scars [G]
[Bm7]Come back to com[Em]munion, [C]come back to the start [D] [Bm7]
[Bm7]Run into wide [C]open spaces, [Em7]grace is waiting [D]for you
[Bm7]Dance like the [C]weight has been lifted, grace is [Em7]wait[D]ing

{comment: Chorus}
Where the [C]Spirit of the Lord is
[G]There is freedom, [Em]there is [D]freedom
Where the [C]Spirit of the Lord is
[G]There is freedom, [Em]there is [D]freedom
Come out of the [Em]dark just as you [C]are
[G]Into the fullness [Bm7]of His love
For the [Em]Spirit is here, [C]let there be [D]freedom
[D]Let there be freedom

{comment: Interlude 2}
| [Bm7] . | [C] . | [C] . | [Em7] . | [D] . | (x2)

{comment: Tag}
[Bm7]Chains will fall, [C]prisons shake
At the [Em7]sound of Jesus' [D]name
[Bm7]Lives made whole, [C]hearts awake
At the [Em7]sound of Jesus' [D]name (x2)

{comment: Interlude 3}
| [G] . . . |

{comment: Chorus}
Where the [C]Spirit of the Lord is
[G]There is freedom, [Em]there is [D]freedom
Where the [C]Spirit of the Lord is
[G]There is freedom, [Em]there is [D]freedom
Come out of the [Em]dark just as you [C]are
[G]Into the fullness [Bm7]of His love
For the [Em]Spirit is here, [C]let there be [D]freedom
[D]Let there be freedom

{comment: Interlude 2}
| [Bm7] . | [C] . | [C] . | [Em7] . | [D] . |

{comment: Bridge}
[Bm7]Dance like the [C]weight has been lifted, grace is [Em7]waiting [D]for you
Dance like the weight has been lifted
Dance like the weight has been lifted, grace is waiting for you
Dance like the weight has been lifted, grace is waiting
Dance like the weight has been lifted, 'cause He did it, yes, He did it
Oh, dance like the weight has been lifted, grace is waiting!

{comment: Final Chorus}
Where the [C]Spirit of the Lord is
[G]There is freedom, [Em]there is [D]freedom
Where the [C]Spirit of the Lord is
[G]There is freedom, [Em]there is [D]freedom
Come out of the [Em]dark just as you [C]are
[G]Into the fullness [Bm7]of His love
For the [Em]Spirit is here, [C]let there be [D]freedom
[D]Let there be freedom [Em] [C] [G] [Bm]
Let there be freedom [Em] [C] [G] [Bm]
Let there be [Em]freedom!`,

  `{title: Even So Come}
{key: Bb}

{comment: Intro}
| [Cm] | [Gm] | [Bb] [F] |

{comment: Verse 1}
[Cm]All of creation, all of the earth
[Gm]Make straight a highway, a path for the Lord
[Bb]Jesus is coming [F]soon
[Cm]Call back the sinner, wake up the saint
[Gm]Let every nation, shout of Your fame
[Bb]Jesus is coming [F]soon

{comment: Chorus}
[Gm]Like a bride [Eb]waiting for her [Bb]groom
We'll be a [Dm]church ready for [Gm]You
Every heart [Eb]longing for our [Bb]King we [Dm]sing
[Eb]Even so come, [Bb]Lord Jesus [F]come [F/A]
[Eb]Even so come, [Bb]Lord Jesus [F]come

{comment: Verse 2}
[Cm]There will be justice, all will be new
[Gm]Your name forever, faithful and true
[Bb]Jesus is coming [F]soon

{comment: Chorus}
[Gm]Like a bride [Eb]waiting for her [Bb]groom
We'll be a [Dm]church ready for [Gm]You
Every heart [Eb]longing for our [Bb]King we [Dm]sing
[Eb]Even so come, [Bb]Lord Jesus [F]come [F/A]
[Eb]Even so come, [Bb]Lord Jesus [F]come

{comment: Bridge (x2)}
So we [Eb]wait, we [Gm]wait for [F]You
God we [Eb]wait, You're [Gm]coming [F]soon

{comment: Chorus}
[Gm]Like a bride [Eb]waiting for her [Bb]groom
We'll be a [Dm]church ready for [Gm]You
Every heart [Eb]longing for our [Bb]King we [Dm]sing
[Eb]Even so come, [Bb]Lord Jesus [F]come [F/A]
[Eb]Even so come, [Bb]Lord Jesus [F]come`,

  `{title: I Surrender}
{key: F}

{comment: Intro}
| [Dm] [F] | [C] [Bb] |

{comment: Verse 1}
[Dm]Here I am Down on my knees a[F]gain
[C]Surrendering all Surrendering [Bb]all
[Dm]Find me here Lord as You draw me [F]near
[C]Desperate for You Desperate for [Bb]You
[Dm]I surrender

{comment: Instruments}
| [Dm] [F] | [C] [Bb] |

{comment: Verse 2}
[Dm]Drench my soul As mercy and grace un[F]fold
[C]I hunger and thirst I hunger and [Bb]thirst
[Dm]With arms stretched wide I know You hear my [F]cry
[C]Speak to me now Speak to me [Bb]now

{comment: Chorus (x2)}
[Dm]I surrender I sur[F]render
I want to [Gm]know You more
I want to [Bb]know You more

{comment: Interlude}
| [Bb] [F] | [C] [C] | [Gm] [Dm] | [C] [C] |

{comment: Bridge (x2)}
Like a [Bb]rushing wind Jesus [F]breathe with[C]in
Lord have Your [Gm]way Lord have Your [Dm]way in [C]me
Like a [Bb]mighty storm Stir [F]within my [C]soul
Lord have Your [Gm]way Lord have Your [Dm]way in [C]me

{comment: Instruments}
| [Bb] [F] | [C] [C] | [Gm] [Dm] | [C] [C] |

{comment: Bridge}
Like a [Bb]rushing wind Jesus [F]breathe with[C]in
Lord have Your [Gm]way Lord have Your [Dm]way in [C]me
Like a [Bb]mighty storm Stir [F]within my [C]soul
Lord have Your [Gm]way Lord have Your [Dm]way in [C]me

{comment: Chorus (quiet)}
[Dm]I surrender I sur[F]render
I want to [Gm]know You more
I want to [Bb]know You more`,

  `{title: Great I Am}
{key: C}

{comment: Intro (2x)}
| [C] [Dm] | [G/B] |

{comment: Verse 1}
[C]I wanna to be close, [Dm]close to [G/B]your side [C]
So [Dm]heaven is real and [G/B]death is a [Am]lie
[Dm]I wanna hear voices of [G/B]angels a[C]bove
[Dm]Singing as one [G]

{comment: Chorus}
[Am]Hallelujah, [F]Holy Holy
[C]God almighty, The Great I [G]am
[Am]Who is worthy
[F]None beside Thee
[C]God Almighty
The [G]Great I Am [Am] [F]
{comment: 2nd time: He's the Great I Am, The Great I Am  (G - Am - F)}

{comment: Verse 2}
[C]I wanna be near, [Dm]near to [G/B]your heart [C]
[Dm]Loving the world, [G/B]hating the [Am]dark
[Dm]I wanna see dry bones [G/B]living a[C]gain
[Dm]Singing as one [G]

{comment: Chorus}
[Am]Hallelujah, [F]Holy Holy
[C]God almighty, The Great I [G]am
[Am]Who is worthy
[F]None beside Thee
[C]God Almighty
The [G]Great I Am [Am] [F]

{comment: Bridge}
[Am]The mountains shake before Him, The demons run and flee
[F]At the mention of the name King of Majesty
[C]There is no power in hell or any who can stand
[G]Before the power and the presence of
[Am]The Great I am, The [F]Great I am, The Great I am [C] [G]

{comment: Chorus}
[Am]Hallelujah, [F]Holy Holy
[C]God almighty, The Great I [G]am
[Am]Who is worthy
[F]None beside Thee
[C]God Almighty
The [G]Great I Am [Am] [F]

{comment: Bridge}
[Am]The mountains shake before Him, The demons run and flee
[F]At the mention of the name King of Majesty
[C]There is no power in hell or any who can stand
[G]Before the power and the presence of
[Am]The Great I am, The [F]Great I am, The Great I am [C] [G]

{comment: Chorus}
[Am]Hallelujah, [F]Holy Holy
[C]God almighty, The Great I [G]am
[Am]Who is worthy
[F]None beside Thee
[C]God Almighty
The [G]Great I Am [Am] [F]`,

  `{title: Єгипет}
{key: D}

{comment: Куплет 1}
[Bm]Я не забуду те [G]чудо, що [D]зробив [A]Ти
[Bm]Звільнив мене і [G]серце [D]нове [A]дав
[Bm]Знайшов щоб [G]звільнити
І [D]стримав [A]води, щоб [Bm]я прой[G]шов
О, [A]Яхве

{comment: Приспів}
Ти за мене в бо[Bm]ротьбі, перемога лиш в [G]Тобі
[D]Алілуя! А[A]лілуя!
Море ти ме[Bm]ні відкрив, через глибину про[G]вів
[D]Алілуя! А[A]лілуя!

{comment: Куплет 2}
Хмара вдень - це знак що Ти зі мною
Вогонь вночі - це світло, щоб дійшов я
Знайшов щоб звільнити
І стримав води, щоб я пройшов
О, Яхве

{comment: Intro}
| [Bm] [G] | [D] [A] |

{comment: Бридж}
[G]Ти увійшов у мій Єгипет
І [A]мене за руку Ти взяв
[Bm]Дарував мені свободу
В [D/F#]землі, що обіцяв
[G]Не забуду я Тебе повік
[A]Прославлю всі діла
[Bm]Смерть вже знищена назавжди
перемогою [D]Христа`,

  `{title: You Say}
{key: G}

{comment: Verse 1}
[G]I keep fighting voices in my [Bm]mind that say I'm not enough
[Bm]Every single lie that tells me I will never [C]measure up
Am I more than just the sum of every high and every low?
Remind me once again just who I am, because I need to know (ooh oh)

{comment: Chorus}
You say I am loved when I can't feel a thing
You say I am strong when I think I am weak
You say I am held when I am falling short
When I don't belong, oh You say that I am Yours
And I believe, oh I believe
What You say of me
I believe

{comment: Verse 2}
The only thing that matters now is everything You think of me
In You I find my worth, in You I find my identity, (ooh oh)

{comment: Verse 3}
Taking all I have and now I'm laying it at Your feet
You have every failure God, and You'll have every victory, (ooh oh)`,

  `{title: Псалом 46}
{key: A}

{comment: Куплет 1}
[F#m]Взгляни на дело Божьих рук, земля по[D]трясена,
[E]Он сокрушает меч и лук и прекращает брань,
[F#m]Великий Бог Израилев в защиту [D]нашу встал.
[E]Мы веруем в Того, Кто словом мир обра[D]зовал.

{comment: Припев}
Сильный Бог ве[D]дет нас, Ведёт нас через [F#m]пламя,
Ведёт нас через [E]море, Сохранит от [D]зла.
По[D]беждает великие сра[F#m]женья.
И мы идем без [E]страха,
Ведь с нами Сава[D]оф!

{comment: Куплет 2}
[F#m]Могучий Бог Иакова, Ты голосом [D]Своим
[E]Сдвигаешь горы в глубь морей. Вовек непобе[D]дим!
[F#m]Людское сердце зная Ты любви не пре[D]кратил.
[E]У ног Твоих склоняются народы всей [D]Земли.

{comment: Бридж}
[F#m]Пусть ревут моря, со мною Бог все[D]го,
[A]Он усмиряет шторм и в сердце мне дает по[E]кой.
[F#m]Пусть дрожит земля, народы тре[D]пещат.
[A]Я знаю, что мой Бог всё держит сильною ру[E]кой.
[F#m]Ты мне даешь покой. [D] [A] [E]
[F#m]Держишь сильною рукой. [D] [E]`,

  `{title: Вірю я}
{key: Gm}

{comment: Intro}
| [Gm] [Bb] | [F] [Eb] |

{comment: Куплет 1}
[Gm]Ти мій Господь моя [Bb]любов,
[F]Дух Святий в мені запалює [Eb]вогонь,
[Gm]Моє життя належить [Bb]тобі,
[F]Я твоє дити Ти є батько [Eb]мій.

{comment: Приспів (x2)}
[Gm]Вірю я, Вірю я, Вірю [Bb]я
[F]У Святого духа, Сина і [Eb]Отця [Cm]

{comment: Куплет 2}
[Gm]Серед людей вибрав [Bb]мене.
[F]Бути Твоїм сином то велика [Eb]честь.
[Gm]Любов'є серця наповняєш [Bb]Ти.
[F]І даєш бажання служи[Eb]ти.

{comment: Бридж (x2)}
[Gm]Я на Божій стороні, Дух Святий живе в [Bb]мені.
[F]Наставляє Він мене жити по [Eb]правді.
[Gm]Сил дає у боротьбі, підкріпляє у [Bb]журбу.
[F]З Господом моїм живу я у сво[Cm]боді.`,

  `{title: Way Maker}
{key: A}

{comment: Intro}
A D A E F#m A D A E F#m

{comment: Verse 1 (2x)}
You are [D]here, moving in our [A]midst
I [E]worship You, I worship [F#m]You
You are [D]here, working in this [A]place
I [E]worship You, I worship [F#m]You

{comment: Chorus (2x)}
[D]Way maker, Miracle Worker [A]Promise Keeper, Light in the darkness
[E]My God, that is who [F#m]You are

{comment: Verse 2}
[D]You are here, touching every [A]heart
I [E]worship You, I worship [F#m]You
[A]You are [D]here, healing every [A]heart
I [E]worship You, I worship [F#m]You
[A]You are [D]here, mending every [A]heart
I [E]worship You, I worship [F#m]You
You are [D]here, turning lives a[A]round
I [E]worship You, I worship [F#m]You

{comment: Chorus (2x)}
[D]Way maker, Miracle Worker [A]Promise Keeper, Light in the darkness
[E]My God, that is who [F#m]You are

{comment: Chorus Tag (2x)}
[D]That is who You are [A](That is who You are)
[E]That is who You are [F#m](That is who You are)

{comment: Refrain (2x)}
[D]Waymaker, Miracle Worker [A]Waymaker, Miracle Worker
[E]Waymaker, Miracle Worker [F#m]Waymaker, Miracle Worker

{comment: Bridge (4x)}
[D]Even when I don't see it, You're working [A]Even when I can't feel it, You're working
[E]You never stop, You never stop working [F#m]You never stop, You never stop working

{comment: Chorus (4x)}
[D]Way maker, Miracle Worker [A]Promise Keeper, Light in the darkness
[E]My God, that is who [F#m]You are`,

  `{title: Превыше власти земных царей}
{key: G}

{comment: Куплет 1}
[G]Превыше власти [C]земных [D]царей, [G]
Над всем тво[C]реньем и над [D]природой [G]всей,
Больше, чем [Em]мудрость и все [D]пути лю[C]дей, [G]
Ты - [Am]Тот, кто был здесь [C]до начала [D]дней.

{comment: Куплет 2}
Превыше [C]воли люд[D]ских сер[G]дец,
Превыше [C]всех немы[D]симых чу[G]дес,
Ты больше [Em]силы, превыше [D]красо[C]ты, [G]
Не из[Am]мерить мне как [C]ценен [B7]Ты!

{comment: Бридж}
[G]Ты для нас [Am]жил, чтобы [D]умереть, [G]
[G]Там ви[Am]сел, смог [D]все претер[G]петь,
Как цве[Em]ток растоптан на [G]земле.... [C] [G]
Там на крес[Am]те [G]Ты [C]думал [D]обо мне! [G]
[C] [D]`,

  `{title: Who You Say I Am}
{key: G}

{comment: Verse 1 (x2)}
[G]Who am I that the highest King
Would [Em]welcome [D]me [G]
[G]I was lost but He brought me in
Oh [Em]His [D]love for [C]me

{comment: Chorus}
Who the [G]Son sets free, Oh is [D]free indeed
[Em]I'm a [D]child [C]of God Yes [G]I am

{comment: Verse 2}
[G]Free at last He has ransomed me
[Em]His grace [D]runs [G]deep
[G]While I was a slave to sin
[Em]Jesus [D]died for [C]me
[Em]Yes He [D]died for [C]me

{comment: Chorus}
Who the [G]Son sets free, Oh is [D]free indeed
[Em]I'm a [D]child [C]of God Yes [G]I am
In my [G]Father's house, There's a [D]place for me
[Em]I'm a [D]child [C]of God Yes [G]I am

{comment: Bridge}
[Em]I am chosen, not for[D/F#]saken
[G]I am who You [C]say I am
[Em]You are for me, not a[D/F#]gainst me
[G]I am who You [C]say I am`,

  `{title: Господь наш Бог}
{key: D}

{comment: Куплет 1}
[D]Господь наш [A]Бог [D]– великий [Bm]Цар! [A] [D]
[G]Хвала Тобі [A]лунає із [D]сер[A]дець!
[D]Ти дав [A]життя, [D]Ти радість [Bm]дав. [A] [D]
[G]В Тобі вся [A]повнота і смисл [D]увесь.

{comment: Куплет 2}
[G]Твоя кров пресвята омиває наш [D]гріх,
[G]Ти нас водиш до рік [D]живої [A]води.
[G]Ти воскрес, мій Христос, І Ти з нами [D]ходи, [Bm]
[G]Будь же Паном [D]сердець, Гос[A]поди!

{comment: Куплет 3}
[D]Ти на [A]хресті [D]смерть подо[Bm]лав, [A] [D]
[G]Воскрес, возніс[A]ся в славі до не[D]бес. [A]
[D]Готу[A]єш [D]Ти осе[Bm]лі [A]нам, [D]
[G]Повернешся за [A]нами скоро [D]Сам!`,

  {
    title: "Tremble / Приводишь тьму Ты в трепет",
    versions: [
      {
        lang: "Русский",
        text: `{title: Приводишь тьму Ты в трепет}
{key: E}

{comment: Куплет 1}
[G#m]Мир, принеси Твой [E]мир,
[B]И бури успокой повели им [F#sus]уйти!
[G#m]Бог, слушают Те[E]бя
[B]И бездны и моря – голос Твой так [F#sus]велик!

{comment: Припев}
[E]Иисус! Ии[G#m]сус! Приводишь тьму Ты в тре[F#]пет!
[E]Иисус! Ии[G#m]сус! И страх мол[F#]чит!
[E]Иисус! Ии[G#m]сус! Приводишь тьму Ты в тре[F#]пет!
[E]Иисус! Ии[G#m]сус! [F#]

{comment: Куплет 2}
[G#m]Жизнь даёшь сухим кос[E]тям,
[B]Даёшь дыханье мне что бы петь для [D#m]Тебя.

{comment: Припев 2x}

{comment: Бридж}
[E]Вся власть, сила вся только в [H]Имени Тво[F#]ём,
[E]Весь мрак тре[F#]пещет от Те[G#m]бя.
[E]Иисус, Ты есть свет, Твоё [H]имя на ве[F#]ка,
[E]Никто [F#]не победит Те[G#m]бя.

{comment: x2 at the end}
Никто не победит Тебя
{comment: Припев}
{comment: Бридж 2x}`,
      },
      {
        lang: "English",
        text: `{title: Tremble}
{key: E}

{comment: Verse 1}
[G#m]Peace, bring it all to [E]peace
The [B]storm is wild but I know that You're with [F#sus]me
[G#m]God, the seas obey Your [E]voice
The [B]deep and the waves cannot drown out Your [F#sus]sound

{comment: Chorus}
[E]Jesus, [G#m]Jesus, You make the darkness [F#]tremble
[E]Jesus, [G#m]Jesus, You silence [F#]fear
[E]Jesus, [G#m]Jesus, You make the darkness [F#]tremble
[E]Jesus, [G#m]Jesus [F#]

{comment: Verse 2}
[G#m]Breathe, call these bones to [E]live
[B]Breathe, call this heart to sing for [D#m]You again

{comment: Chorus 2x}

{comment: Bridge}
[E]All authority, all the power is in [H]Your great [F#]name
[E]The very [F#]darkness trembles at Your [G#m]name
[E]Jesus, You are light, Your great [H]name endures for[F#]ever
[E]Nothing [F#]can stand against Your [G#m]name`,
      },
    ],
  },

  `{title: In Jesus' Name}
{key: G}

{comment: Intro}
C D C D C D

{comment: Verse 1}
[G]God is fighting for us God is on our [Em7]side
[Bm]He has overcome Yes He has over[D]come
[G]We will not be shaken We will not be [Em7]moved
[D]Jesus You are here

{comment: Interlude}
G Em7 Bm D G Em7 D

{comment: Verse 2}
[G]Carrying our burdens Covering our [Em7]shame
[Bm]He has overcome Yes He has over[D]come
[G]We will not be shaken We will not be [Em7]moved
[D]Jesus You are here

{comment: Chorus}
[A]I will live, I will not [G]die
[D]The resurrection power of [Bm]Christ
[C]Alive in me and I am [G]free
[D]In Jesus' Name
[A]I will live, I will not [G]die
[D]I will declare and lift You [Bm]high
[C]Christ revealed and I am [G]healed
[D]In Jesus' Name [C] [D]

{comment: Bridge (x3)}
[G]God is fighting for us Pushing back the [A]darkness
[Bm]Lighting up the Kingdom That cannot be [D/F#]shaken
[G]In the Name of Jesus Enemy's de[A]feated
[Bm]And we will shout it out, Shout it [D]out`,

  `{title: Revelation Song}
{key: G}

{comment: Verse 1}
[D]Worthy is the, [Am]Lamb who was slain
[C]Holy, Holy, [G]is He
[D]Sing a new song, [Am]to Him who sits on
[C]Heaven's mercy [G]seat

{comment: Chorus}
[D]Holy, Holy, Holy
[Am]Is the Lord God Almighty
[C]Who was, and is, and is to [G]come
[D]With all creation I sing
[Am]Praise to the King of Kings
[C]You are my everything
[G]And I will adore You [D] [Am] [C] [G]

{comment: Verse 2}
[D]Clothed in rainbows, [Am]of living color
[C]Flashes of lightning, rolls of [G]thunder
[D]Blessing and honor, strength and glory and power [Am]be
[C]To You the only wise [G]King

{comment: Chorus}
[D]Holy, Holy, Holy
[Am]Is the Lord God Almighty
[C]Who was, and is, and is to [G]come
[D]With all creation I sing
[Am]Praise to the King of Kings
[C]You are my everything
[G]And I will adore You [D] [Am] [C] [G]

{comment: Verse 3}
[D]Filled with wonder, [Am]awestruck wonder
[C]At the mention of your [G]name
[D]Jesus your name is power
[Am]Breath and living water
[C]Such a marvelous mys[G]tery [Am] [F] [C] [G]

{comment: Chorus}
[D]Holy, Holy, Holy
[Am]Is the Lord God Almighty
[C]Who was, and is, and is to [G]come
[D]With all creation I sing
[Am]Praise to the King of Kings
[C]You are my everything
[G]And I will adore You`,

  `{title: Our God}
{key: F}

{comment: Intro}
| [Dm] | [Bb] | [F] | [C] |

{comment: Verse 1}
[Dm]Water You [Bb]turned into [F]wine
[Dm]Opened the [Bb]eyes of the [F]blind
There's no one like [Gm7]You
None like [C]You

{comment: Verse 2}
[Dm]Into the [Bb]darkness You [F]shine
[Dm]Out of the [Bb]ashes we [F]rise
There's no one like [Gm7]You
None like [C]You

{comment: Chorus}
[Dm]Our God is greater Our God is [Bb]stronger
[F]God, You are higher than any [C]other
[Dm]Our God is Healer Awesome in [Bb]power
[F]Our God [C]Our God

{comment: Verse 1}
{comment: Chorus 2x}
{comment: Instrumental}

{comment: Bridge}
[Dm]And if our God is for us
[Bb]Then who could ever stop us
[F]And if our God is with us
[Csus]Then what could stand against

{comment: Chorus 2x  Bridge}`,

  `{title: Любов Твоя за гори вища}
{key: D}

{comment: Куплет 1}
[A]Любов Твоя за [D]гори вища,
[A]Глибша океану, ширша [Bm]небозводу,
[G]І ясніша зір.
[D]Співатиму, який [A]прекрасний [D]Ти!

{comment: Куплет 2}
[G]Всемогутній, [D]Справедли[G]вий, [D]
[Bm]Ти – незмінний і святий
[G]Нема таких як Ти.
[Em]Оооо, який прекрасний [A]Ти!
[D]Який прекрасний Ти!`,

  `{title: О благодать}
{key: D}

{comment: Куплет 1}
[D]О благо[D7]дать! [G]Спасён то[D]бой
[D]Я из пу[Bm]чины [A]бед,
[D]Был мёртв и чудом [G]стал жи[D]вой,
[Bm]Был слеп и [A]вижу [D]свет.

{comment: Куплет 2}
Сперва внушила сердцу страх,
Затем дала покой.
Я скорбь души излил в слезах,
Твой мир течёт рекой.

{comment: Куплет 3}
Словам Господним верю я,
Моя вся крепость в них:
Он – верный щит, Он – часть моя
Во всех путях моих.

{comment: Куплет 4 (модуляция в E)}
[E]Пройдут де[E7]сятки [A]тысяч [E]лет,
[E]Забудем [C#m]смерти [B]тень,
[E]А Богу так же [A]будем [E]петь,
[C#m]Как в самый [B]первый [E]день.`,

  `{title: Ми – Його діти}
{key: Eb}

{comment: Intro}
Eb Gm Cm Ab

{comment: Куплет 1}
[Eb]Бог – наш Отець, а ми – Його [Bb]діти.
[Cm]Ніхто не вміє так, як Він, [Ab]любити.
[Eb]Його творіння, такі уні[Bb]кальні,
[Cm]Радісні, добрі, щирі, веселі, часом [Ab]печальні.

{comment: Приспів}
[Eb]Ми – Його діти, церква, сім'я,
[Bb]Обручена Христу наречена.
[Cm]Тіло Ісуса, смерть Його з'єднала [Ab]нас.
[Eb]Кров'ю омиті, чисті, святі,
[Bb]Духом народжені ми згори,
[Cm]Вічним коханням полюбив, Себе [Ab]відкрив.

{comment: Interlude}
Eb Gm Cm Ab

{comment: Куплет 2}
[Eb]Будем разом Бога хвалити, [Bb]
[Cm]Віддано й щиро всі Йому [Ab]служити.
[Eb]Божу любов ми світу по[Bb]кажем,
[Cm]І про Його пролиту кров усім [Ab]розкажем.

{comment: Outro}
Eb Bb Cm Ab Gm`,

  `{title: А кров стікає з креста}
{key: G}

{comment: Куплет 1}
[G]Тіло ломиме, пробиті [D/F#]руки
[Am]Він не достойний такої [Em]му[D]ки!
[G]Святий Господь мій, кров про[D/F#]ливає
[Am]«Прости їм Отче» в небо [Em]взи[D]ває.

{comment: Приспів}
[G]А кров стікає з [D]креста,
[Am]За мої гріхи ви[Em]сока [D]ціна.
[G]То кров Ісуса [D]Христа,
[Am]У небо кричить прости їм, [Em]Боже, [D]про[C]сти[D]! [G]

{comment: Куплет 2}
[G]Такий не легкий, шлях до [D/F#]Голгофи
[Am]І не жалів Він себе ані [Em]тро[D]хи
[G]Хто з Ним піде, більше не за[D/F#]блукає
[Am]Йди за Христом він тебе так [Em]ко[D]хає.

{comment: Interlude}
Eb Abmaj7 D4

{comment: Куплет 3}
[G]Такий нелегкий шлях [D/F#]Ісуса
[Am]Звернись ти до Нього, не йди у [Em]спо[D]кусу.
[G]Я любий друже, тебе за[D/F#]кликаю
[Am]Йди до Христа, Він тебе так [Em]че[D]кає!`,

  `{title: Цар воскреслий}
{key: G}

{comment: Куплет 1}
[C]О! Любові не [G]збагну -
[C]Жертву за [Em]гріх прине[D]сену
[C]Розбитий за моє [G]сцілення
[C]Розп'ятий [Em]щоб я здобув [D]життя

{comment: Куплет 2}
[Em]На хресті - [C]Мессія, [G]невин[D/F#]ний
[Em]Агнець, [C]Він - надія, [G]Бог вір[D/F#]ний

{comment: Приспів}
[Em]Цар воскреслий, Пан лю[C]бові,
[G]Вознесенний, вічно в [D]славі!
[Em]Алілуя! Переміг [C]Він.
[G]Я омитий, навіки [D]вільний!

{comment: Куплет 3}
[C]О! Дивує знов і [G]знов
[C]Милість [Em]Свята Його [D]любов
[C]Смертний, від смерті щоб [G]спасти,
[C]Відкинений, [Em]щоб я був [D]прийнятий`,

  `{title: Навіки}
{key: G}

{comment: Intro}
G D Em C

{comment: Куплет 1}
[G]Був смуток в небесах і [D]сонце згасло в [Em]час,
Коли вмирав Спаситель [C]світу.
[G]І кров текла свята з [D]ганебного хрес[Em]та —
Тягар усіх гріхів поніс [C]Він.

{comment: Instrumental}
G D Am C

{comment: Куплет 2}
[G]Останній подих Свій, [D]вмираючи, зро[Em]бив,
І смерть Він переміг у [C]битві.
[G]І хоч лежав три дні в [D]могилі темній [Em]Він,
Всі сили пекла й зла роз[C]биті!

{comment: Заспів}
[G]Здригнулася земля й [D]могила вже пус[Em]та —
Не може смерть любов [C]здолати.
[G]А смерті жало де? [D]Ісус, наш Цар, вос[Em]крес,
Він зруйнував гріха [C]кайдани.

{comment: Приспів}
[G]Навіки прославлений, [D]навіки під[Em]несе[C]ний,
[G]Навіки воскреслий, [D]вічно живий, [Em]вічно жи[C]вий!

{comment: Брідж}
[G]Слава, алилуя! [D]Слава, алилу[Em]я!
Слава, алилуя [C]Агнцю Бож[G]ому!`,

  {
    title: "Поклоняюсь тебе",
    versions: [
      {
        lang: "Русский",
        text: `{title: Поклоняюсь тебе}
{key: Cm}

{comment: Intro}
D# Cm Gm Bb

{comment: Куплет 1}
[D#]Так желаю быть с То[Cm]бой
Я жажду слышать голос Твой, [Gm]Ты так нужен [Bb]мне
[D#]Тебе известны все [Cm]пути
Глубины сердца и мечты [Gm]все что во [Bb]мне возьми [D#]Ии[Cm]сус

{comment: Припев}
[Gm]Поклоняюсь Тебе, по[D#]клоняюсь Те[F]бе
[Cm]Бог Ты так нужен мне!
[Gm]Поклоняюсь Тебе, по[D#]клоняюсь Те[F]бе
[Cm]Бог Ты так нужен мне!

{comment: Куплет 2}
[D#]Ты путь, Ты истина, [Cm]Ты жизнь
Меня так дивно сотворил [Gm]буду Тебя [Bb]хвалить
[D#]Тебе известны все [Cm]пути
Глубины сердца и мечты [Gm]все что во [Bb]мне возьми [D#]Ии[Cm]сус`,
      },
      {
        lang: "English",
        text: `{title: I Worship You}
{key: Cm}

{comment: Intro}
Eb Cm Gm Bb

{comment: Verse 1}
[Eb]I so desire to be with [Cm]You
I long to hear Your voice, oh [Gm]how I need [Bb]You
[Eb]You know my every [Cm]way
The depths of heart and dreams [Gm]all that's in [Bb]me take [Eb]Je[Cm]sus

{comment: Chorus}
[Gm]I worship You, I [Eb]worship [F]You
[Cm]God how I need You!
[Gm]I worship You, I [Eb]worship [F]You
[Cm]God how I need You!

{comment: Verse 2}
[Eb]You're the way, the truth, the [Cm]life
You made me wonderfully [Gm]I will praise [Bb]You
[Eb]You know my every [Cm]way
The depths of heart and dreams [Gm]all that's in [Bb]me take [Eb]Je[Cm]sus`,
      },
    ],
  },

  `{title: Psalm 91 (On Eagles' Wings)}
{key: E}

{comment: Intro}
A E

{comment: Verse 1}
[A]You who dwell in the shelter of the [E]Lord
[A]Who abide in his shadow for [E]life
[G]Say to the Lord, "My Refuge, my [E]Rock in [G]whom I [B]trust"

{comment: Chorus}
And He will [E]raise you up on eagles' wings
[A]Bear you on the breath of dawn
[E]Make you to [E/G#]shine like the [A]sun
[B]And hold [C#m]you in the [A]palm [F#m] [B]
[B]Of His [E]hand

{comment: Verse 2}
[A]The snare of the fowler will never capture [E]you
[A]And famine will bring you no [E]fear
[G]Under His wings your [E]refuge
[G]His faithfulness your [B]shield

{comment: Chorus}
And He will [E]raise you up on eagles' wings
[A]Bear you on the breath of dawn
[E]Make you to [E/G#]shine like the [A]sun
[B]And hold [C#m]you in the [A]palm [F#m] [B]
[B]Of His [E]hand

{comment: Bridge}
[A/E]You need not fear the terror of the [E]night
[A/E]Nor the arrow that flies by [E]day
[G]Though thousands fall about [E]you
[G]Near you it shall not [B]come`,

  `{title: No Longer Slaves}
{key: B}

{comment: Verse 1}
[B]You unravel me, with a melody
[E]You surround me with a [F#]song [B]
[B]Of deliverance, from my enemies
[E]Till all my fears are [F#]gone [B]

{comment: Chorus}
[E]I'm no longer a [F#]slave to [B]fear
[G#m]I am a [F#]child of [B]God
[E]I'm no longer a [F#]slave to [B]fear
[G#m]I am a [F#]child of [G#m]God [F#] [B] [E]

{comment: Verse 2}
[B]From my Mothers womb
[D#m]You have chosen me
[E]Love has called my [F#]name [B]
[B]I've been born again, into your [D#m]family
[E]Your blood flows through my [F#]veins [B]

{comment: Chorus}
[E]I'm no longer a [F#]slave to [B]fear
[G#m]I am a [F#]child of [B]God
[E]I'm no longer a [F#]slave to [B]fear
[G#m]I am a [F#]child of [G#m]God [F#] [B] [E]

{comment: Bridge}
[G#m]You split the sea so I could walk right through [F#]it [B] [E]
[G#m]My fears are drowned in perfect [F#]love [B] [E]
[G#m]You rescued me and I will [F#]stand and [B]sing [D#m]
[E]I am a [F#]child of [B]God

{comment: Tag}
Gm#7 F# B E`,

  `{title: Світло життя}
{key: E}

{comment: Куплет}
[E]Світло життя, [B]Ти осяяв [F#m]те[A]мінь
[E]Господи, [B]дай мені [A]зір
[E]Милість [B]Твоя [F#m]сягає [A]неба,
[E]Правда [B]Твоя вища [A]гір.

{comment: Приспів}
[E]Ти єдиний вірний, [B/D#]Ти єдиний вічний,
[C#m]Ти єдиний гідний [A]похвали.
[E]Ти єдиний славний, [B]Ти єдиний Цар мій,
[C#m]Ти єдиний Бог мій, [A]тільки Ти.

{comment: Bridge}
[B]І я ніколи [E]не зба[A]гну
[B]За гріх мій [E]сплачену [A]ціну.`,

  `{title: Адонай}
{key: G#m}

{comment: Intro}
G#m E B F#

{comment: Куплет 1}
[G#m]Кто сей Царь Славы, [B]Господь великий
[F#]Сильный и крепкий, [C#m]в брани Своей,
[G#m]Благословен Ты, [B]Бог Вседержитель,
[F#]Слово Твоё [C#m]правды чистые лей

{comment: Припев}
[G#m]Слава Тебе вовеки, [E]о Адонай великий,
[B]Господи, [F#]Господи.
[G#m]Слава Тебе вовеки, [E]о Адонай великий,
[B]Господи, [F#]Господи.

{comment: Куплет 2}
[G#m]Кто в сердце славы, [B]кроткий и дивный
[F#]В праведны руки, [C#m]возложен венец
[G#m]Бог в своём Сыне [B]послал оправдание
[F#]Вернул в Свою [C#m]обитель заблудших овец.

{comment: Припев}
[G#m]Слава Тебе вовеки, [E]о Адонай великий,
[B]Господи, [F#]Господи.
[G#m]Слава Тебе вовеки, [E]о Адонай великий,
[B]Господи, [F#]Господи.`,

  `{title: King of Kings}
{key: D}

{comment: Verse 1}
[D/F#]In the darkness we were [G]waiting without [A]hope without [D]light
[D/F#]Till from heaven You came [G]running there was [A]mercy in [D]Your eyes
[D/F#]To fulfill the law and [G]prophets to a [A]virgin came the [D]Word
[D/F#]From a throne of endless [G]glory to a [A]cradle in the [D]dirt

{comment: Chorus}
[D]Praise the Father [G]Praise the Son
[Bm]Praise the Spirit [D/A]three in [A]one
[D]God of glory, [G]Majesty
[Bm]Praise for[G]ever to the [A]King of [D]Kings

{comment: Verse 2}
[D/F#]To reveal the kingdom [G]coming and to [A]reconcile the [D]lost
[D/F#]To redeem the whole cre[G]ation, You did [A]not despise the [D]cross
[D/F#]For even in Your [G]suffering You [A]saw to the other [D]side
[D/F#]Knowing this was our sal[G]vation [A]Jesus for our sake You [D]died

{comment: Chorus}
[D]Praise the Father [G]Praise the Son
[Bm]Praise the Spirit [D/A]three in [A]one
[D]God of glory, [G]Majesty
[Bm]Praise for[G]ever to the [A]King of [D]Kings

{comment: Verse 3 (music subsides)}
[Bm]And the morning that You [G]rose all of [A]heaven held it's [D]breath
[Bm]Till that stone was moved for [G]good for the [A]Lamb had conquered [D]death
[Bm]And the dead rose from their [G]tombs and the [A]angels stood in [D]awe
[Bm]For the souls of all who'd [G]come to the [A]Father are re[D]stored

{comment: Verse 4}
[D/F#]And the Church of Christ was [G]born then the [A]Spirit lit the [D]flame
[D/F#]Now this gospel truth of [G]old shall not [A]kneel, shall not [D]fade
[D/F#]By His blood and in His [G]name and in His [A]freedom I am [D]free
[D/F#]For the love of Jesus [G]Christ who has [A]resurrected [D]me

{comment: Chorus (last line 2x)}
[D]Praise the Father [G]Praise the Son
[Bm]Praise the Spirit [D/A]three in [A]one
[D]God of glory, [G]Majesty
[Bm]Praise for[G]ever to the [A]King of [D]Kings`,

  `{title: Ты Моя Скала}
{key: Cm}

{comment: Intro}
Cm Gm/Bb Fm/Ab Gm Cm

{comment: Куплет 1}
[Cm]Слышу я голос [Eb]Твой [Bb]
Каждый миг [Fm]Ты со [Cm]мной
[Cm]Я укрыт в Тебе [Eb]от бурь [Bb] [F]
Как за [Cm]стеной

{comment: Приспів (+2)}
[Ab]Зажигая свет, по[Cm]беждая тьму
[Eb]Я Твоей любви знамя под[Bb]ниму
[Ab]Твоих вечных слов ждёт [Cm]душа моя
[Eb]Верю, что с Тобой всё [Bb]смогу я!
[Cm]Ты моя [Ab]скала! С Тобою не боюсь [Eb] [Bb/D]
[Cm]Сквозь боли и страх Ввысь на [F/A]руках
[Eb/Bb]Подними, если я [G/B]споткнусь

{comment: Interlude}
Ab Cm Eb Bb

{comment: Куплет 2}
Слышу я голос Твой
Каждый миг Ты со мной
Я укрыт в Тебе от бурь
Как за стеной...

{comment: Interlude}
Ab Cm Eb Bb

{comment: Приспів (+2)}
[Ab]Зажигая свет, по[Cm]беждая тьму
[Eb]Я Твоей любви знамя под[Bb]ниму
[Ab]Твоих вечных слов ждёт [Cm]душа моя
[Eb]Верю, что с Тобой всё [Bb]смогу

{comment: Модуляция}
[Dm]Ты моя [Bb]скала! С Тобою не боюсь [F]  [C/E]
[Dm]Сквозь боли и страх Ввысь на [G/B]руках
[F/C]Подними, если я спот[A/C#]кнусь   (+2)
[Dm]Ты моя скала`,

  `{title: Love Was Born}
{key: Gm}

{comment: Verse 1}
[Gm]Love was born that night
[Eb]Starlight shone in the [F]night [Gm]sky
[Gm]The King was born for [Eb]us
[F]Who we've waited [Gm]for

{comment: Chorus}
And we sing [Gm/Eb]Holy, [F]Holy [Dm] [Gm]
We sing [Gm/Eb]Holy, [F]Holy You [Gm]are

{comment: Verse 2}
[Gm]Love was born that night
[Eb]Angels filled the [F]sky [Gm]
[Gm]God gave us a [Eb]gift
[F]His beloved [Gm]son

{comment: Chorus}
And we sing [Gm/Eb]Holy, [F]Holy [Dm] [Gm]
We sing [Gm/Eb]Holy, [F]Holy You [Gm]are

{comment: Bridge}
The King was [Eb]born To reign for[F]ever
Born to [Dm]fight for us to love and [Gm]save.
By Him the [Eb]world Has changed for[F]ever
He has [Dm]shown to us The way to [Gm]win
No greater [Eb/Gm]gift No higher [F]name above
You re[Dm]vealed to us the Father's [Gm]grace
Let all The [Eb/Gm]Earth know
Your name is [F]Jesus You de[Dm]serve unending [Gm]praise!`,

  `{title: Проявиш Ти Себе}
{key: Em}

{comment: Приспів}
[C]Ягве, [D]Рафа, [Bm]Єлохім, [Em]Єль Шадай, [C]Іре, [D]Адонаі проявиш Ти [Em]Себе

{comment: Куплет 1}
[Em]Ти тут, Твоя слава відчутна [D]скрізь [Bm]
Святий, Творець чудес в [C]житті
Даєш нам сили далі [D]йти / 2р.

{comment: Приспів}
Ягве, Рафа, Єлохім, Єль Шадай, Іре, Адонаі проявиш Ти Себе

{comment: Куплет 2}
[Em]Ти тут, Твоя слава відчутна [Bm]скрізь
Святий, Творець чудес в [C]житті
Даєш нам сили далі [D]йти / 2р.

{comment: Приспів}
Ягве, Рафа, Єлохім, Єль Шадай, Іре, Адонаі проявиш Ти Себе

{comment: Бридж}
[Em]Якщо прославиш, проявить Він [D]себе
Якщо покличеш, проявить Він [C]себе
Якщо шукатимеш, проявить Він [D]себе

{comment: Tag}
[Em]Ягве - сильний наш Творець
[D/Em]Рафа - ти цілитель мій
[C]Іре - прояви Себе
Прояви Себе [D]`,

  `{title: Another In The Fire}
{key: G}

{comment: Intro}
Em C G

{comment: Verse 1}
[Em]There's a grace when the [C]heart is under [G]fire
[Em]Another way when the [C]walls are closing [G]in
[Em]And when I look at the [C]space between
[G]Where I used to be and this [D/G]reckoning
[Em]I know I will [C]never be a[G]lone

{comment: Chorus}
There was another in the [Em]fire [C]Standing next to [G]me
There was another in the [Em]waters [C]Holding back the [G]seas
And should I ever need re[Em]minding [C]Of how I've been set [G]free
There is a cross that bears the [Em]burden
Where a[C]nother died for [G]me
There is another in the [Em]fire [C] [G]

{comment: Interlude}
Em C G

{comment: Verse 2}
[Em]All my debt left for [C]dead beneath the [G]waters
[Em]I'm no longer a [C]slave to my sin any[G]more
[Em]And should I fall in the [C]space between
[G]What remains of me and this [Bm7]reckoning
[Em]Either way I won't [C]bow
To the [G]things of this world
[Em]And I know I will [C]never be a[G]lone

{comment: Chorus 2}
There is another in the [Em]fire [C]Standing next to [G]me
There is another in the [Em]waters [C]Holding back the [G]seas
And should I ever need re[Em]minding [C]What power set me [G]free
There is a grave that holds no [Em]body
And now that [C]power lives in [G]me
There is another in the [Em]fire [C] [G]

{comment: Bridge}
And I can see the [Em]light in the darkness [C]As the darkness [G]bows to [D]Him
I can hear the [Em]roar in the heavens [C]As the space be[G/B]tween wears [D]thin
I can feel the [Em]ground shake beneath us [C]As the prison [G/B]walls cave [D]in
Nothing stands be[Am]tween us Nothing stands be[C]tween [D]us

{comment: Interlude}
Em C G / Em C G

{comment: Verse 3}
[Em]There is no other [C]name But the Name that is [G]Jesus
[Em]He who was and still [C]is And will be through it [G]all
So come what may in the space between
[G]All the things unseen and this [D/G]reckoning
[Em]I know I will [C]never be a[G]lone

{comment: Chorus 3}
There'll be another in the [Em]fire [C]Standing next to [G]me
There'll be another in the [Em]waters [C]Holding back the [G]seas
And should I ever need re[Em]minding [C]How good You've been to [G]me
I'll count the joy come every [Em]battle
'Cause I [C]know that's where You'll [G]be`,

  `{title: You Make Me Brave}
{key: Cm}

{comment: Intro}
Ab Fm Eb

{comment: Verse 1}
[Cm]I stand before You [Ab]now [Eb]
The [Cm]greatness of your [Ab]re[Eb]nown
[Cm]I have heard of the [Ab]majesty and [Eb]wonder of [Bb]you
[Cm]King of Heaven, in [Ab]humility, I [Fm]bow

{comment: Chorus 1}
As Your [Eb]love, in wave after [Cm]wave [Bb]
[Fm]Crashes [Eb/G]over me, crashes [Ab]over [Bb]me
For [Eb]You are for us You are [Cm]not against [Bb]us
[Fm]Champion of [Eb/G]Heaven You made a way [Ab]for all to [Bb]enter in

{comment: Verse 2}
[Cm]I have heard You [Ab]calling my [Eb]name
[Cm]I have heard the song of [Ab]love that You [Eb]sing
[Cm]So I will [Ab]let You draw me [Eb]out beyond the [Bb]shore
[Fm]Into Your [Eb/G]grace ... Your [Ab]grace [Bb]

{comment: Chorus 2}
As Your [Eb]love, in wave after [Cm]wave [Bb]
[Fm]Crashes [Eb/G]over me, crashes [Ab]over [Bb]me
For [Eb]You are for us You are [Cm]not against [Bb]us
[Fm]Champion of [Eb/G]Heaven You made a way [Ab]for all to [Bb]enter
To Your love, in wave after wave
Crashes over me, crashes over me
For You are for us You are not against us
Champion of Heaven You made a way for all to enter in

{comment: Bridge}
Cause You make me [Cm]brave You make me [Ab]brave
You call me out [Eb/G]beyond the shore into the [Bb]waves
You make me [Cm]brave You make me [Ab]brave
No fear can [Eb/G]hinder now the love that made a [Bb]way
You make me [Cm]brave You make me [Ab]brave
You call me out [Eb/G]beyond the shore into the [Bb]waves
Cause You make me [Cm]brave You make me [Ab]brave
No fear can [Eb/G]hinder now the promises you [Bb]made   (x2)

{comment: Chorus 3}
Because Your love, in wave after wave
Crashes over me, crashes over me
For You are for us You are not against us
Champion of Heaven You made a way...
Because Your love, in wave after wave
Crashes over me, crashes over me
For You are for us You are not against us
Champion of Heaven You made a way
Champion of Heaven You made a way [Fm]for all to [Eb/G]enter in [Ab] [Bb] [Eb]`,

  `{title: Raise A Hallelujah}
{key: C}

{comment: Verse 1}
[C]I raise a hallelujah, [F]in the presence of my enemies
[Am]I raise a hallelujah, [G]louder than the unbelief
[C]I raise a hallelujah, [F]my weapon is a melody
[Am]I raise a hallelujah, [G]Heaven comes to fight for me

{comment: Chorus}
[F]I'm gonna sing in the [C]middle of the storm
[Am]Louder and louder, you're [G]gonna hear my praises roar
[F]Up from the ashes, [C]hope will arise
[Am]Death is defeated, [G]the King is [G]alive

{comment: Verse 2}
[C]I raise a Hallelujah, [F]with everything inside of me
[Am]I raise a Hallelujah, [G]I will watch the darkness flee
[C]I raise a Hallelujah, [F]in the middle of the mystery
[Am]I raise a Hallelujah, [G]fear you lost your hold on me

{comment: Chorus}
[F]I'm gonna sing in the [C]middle of the storm
[Am]Louder and louder, you're [G]gonna hear my praises roar
[F]Up from the ashes, [C]hope will arise
[Am]Death is defeated, [G]the King is alive

{comment: Bridge}
[C]Sing a little louder [G]Sing a little louder [Am]Sing a little louder [F]Sing a little louder
[C]Sing a little louder (In the presence of my enemies)
[G]Sing a little louder (Louder than the unbelief)
[Am]Sing a little louder (My weapon is a melody)
[F]Sing a little louder (Heaven comes to fight for me)

{comment: Chorus 2x}

{comment: Tag}
[C]I'll raise a Hallelujah I'll [F]raise a Hallelujah I'll [Am]raise a Hallelujah I'll [G]raise a Hallelujah`,

  `{title: Муж скорбот}
{key: Em}

{comment: Куплет 1}
[Em]Муж скорбот з хворобами зна[Am]йомий,
[D]Був відкинутим й терпів зне[Em]ва[D]гу.
[C]Смертну кару прийняв Він сві[Am]домо,
[B7]Є вздоровлення у Його [Em]ранах.
[Em]На заколення Він йшов по[Am]кірно,
[D]Мов вівця, невинним був й без[Em]мов[D]ним,
[C]Ранений Він був за гріхи [Am]світу,
[B7]Пишноти не мав Він і при[B7]нади.

{comment: Приспів}
[Em]Співай Алілуя, спі[Am]вай Алілуя,
[D]Співай Алілуя [G]Госпо[B7]ду.
[Em]Співай Алілуя, спі[Am]вай Алілуя,
[B7]Співай Алілуя Госпо[Em]ду. [B7]

{comment: Куплет 2}
[Em]Кожен схилить перед Ним ко[Am]ліна,
[D]Перед святим та величним Й[Em]мен[D]ням,
[C]Перед Агнцем чистим й непо[Am]рочним,
[B7]Що зазнав нестерпних мук й страж[Em]дання.
[Em]Його одяг немов сонце [Am]сяє,
[D]Його ім'я - Слово [Em]Бо[D]же,
[C]Цар царів, Сидячий на пре[Am]столі,
[B7]Він гряде, Він - Перший і Ос[Em]танній!

{comment: Приспів}
[Em]Співай Алілуя, спі[Am]вай Алілуя,
[D]Співай Алілуя [G]Госпо[B7]ду.
[Em]Співай Алілуя, спі[Am]вай Алілуя,
[B7]Співай Алілуя Госпо[Em]ду.`,

  `{title: Бог з Нами}
{key: C}

{comment: Intro}
F Am C G

{comment: Куплет}
[F]Всесильний, нездо[Am]ланний
[C]Хто збагне великого [G]Творця?
[F]Ми безсилі, безпо[Am]радні
[C]Хто зійде явити нам [G]життя?

{comment: Перехід}
[Dm]Світу, що сидить [C/E]у темноті [F]світло за[G]сяя[C/E]ло

{comment: Приспів}
[F]Бог з нами Цар [Am]всього творіння
[C]Прийняв на Себе тління долю всіх [G]людей
[F]Бог з нами Він зняв [Am]небесні шати
[C]Щоб зодягнути в славу усіх Своїх [G]дітей

{comment: Бридж}
[C]Слава Богу ввисо[G]ті
[Dm]Мир людям на землі! Радійте, Бог з [F]нами! [G]
[C]Слава Богу ввисо[G]ті
[Dm]Мир людям на землі! Радійте, Бог з [F]нами! [G]`,

  `{title: Living Hope}
{key: A}

{comment: Verse 1}
How great the [A]chasm that lay be[E]tween us How high the [D]mountain I could [F#m]not climb [E]
In desper[A]ation, I turned to [E]heaven And spoke Your [D]name [E]into the [A]night
Then through the [D]darkness, Your loving-[A]kindness
Tore through the [F#m]shadows of my [E]soul
The work is [A]finished, the end is [E]written
Jesus [D]Christ, [E]my living [A]hope [F#m] [D]

{comment: Verse 2}
Who could i[A]magine so great a [E]mercy? What heart could [D]fathom such [F#m]boundless grace? [E]
The God of [A]ages stepped down from [E]glory To wear my [D]sin and [E]bear my [A]shame
The cross has [D]spoken, I am for[A]given
The King of [F#m]kings calls me His [E]own
Beautiful [A]Savior, I'm Yours for[E]ever
Jesus [D]Christ, [E]my living [A]hope

{comment: Chorus}
[D]Halle[A]lujah, praise the [E]One who set me [F#m]free
[D]Halle[A]lujah, death has [E]lost its grip on [F#m]me
[D]You have broken every [A]chain
[E]There's salvation in Your [F#m]name
Jesus [D]Christ, [E]my living [A]hope

{comment: Verse 3}
Then came the [A]morning that sealed the [E]promise
Your buried [D]bo[F#m]dy began to [E]breathe Out of the [A]silence, the Roaring [E]Lion
Declared the [D]grave has [E]no claim on [A]me
Then came the [A]morning that sealed the [E]promise
Your buried [D]bo[F#m]dy began to [E]breathe Out of the [A]silence, the Roaring [E]Lion
Declared the [D]grave has [E]no claim on [A]me. [F#m]Jesus, [D]Yours is the [E]victory, [A]whoa!

{comment: Chorus}
[D]Halle[A]lujah, praise the [E]One who set me [F#m]free
[D]Halle[A]lujah, death has [E]lost its grip on [F#m]me
[D]You have broken every [A]chain
[E]There's salvation in Your [F#m]name
Jesus [D]Christ, [E]my living [A]hope`,

  `{title: Чудова благодать}
{key: D}

{comment: Куплет 1}
[D]Хто гріх і темінь перемагає,
[G]Хто нас незмінно, усіх кохає
[Bm]Господь могутній, [A]Ти над царями - [G]Цар.
[D]Хто чудесами людей вражає
[G]І хто в обіймах цей світ тримає
[Bm]Господь могутній, [A]Ти над царями - [G]Цар.

{comment: Приспів}
Чудова [D]благодать... Мене Ти полю[G]бив,
Поніс усі [Bm]гріхи, За мене на хрес[A]ті,
Віддав [D]Своє життя, Щоб я свободу [G]мав,
[Bm]Тебе прославлю за [A]все, що Ти нам [D]дав

{comment: Куплет 2}
[D]Хто відродив нас і дав надію
[G]Хто всиновив нас і завжди вірний
[Bm]Господь могутній, [A]Господь могут[G]ній.
[D]Хто править в правді, хто справедливий,
[G]Хто в славі сяє, Величний, Сильний,
[Bm]Господь могутній, [A]Ти над царями - [G]Цар.

{comment: Бридж (2 times)}
[D]Гідний Агнець честі й хвали
[G]Гідний слави Цар, що смерть переміг
[Bm]Гідний Агнець честі й хвали
[G]Гідний слави Цар, що смерть переміг
[G]Гідний слави Цар...`,

  `{title: Боже, Україну збережи}
{key: Dm}

{comment: Куплет 1}
[Dm]Минає час, минають дні, [C]і змінюється [A]все навколо,
[Dm]Та тільки Бог, Господь [C]Святий, не змінюєть[A]ся Він ніколи.
[Dm]В одну хвилину може Він [C]змінити все в [A]нашій країні,
[Dm]Господь, благаємо [Gm]Тебе, даруй спа[A]сіння Україні.

{comment: Приспів}
[Dm]Боже, Україну збережи, [Gm]Господи, [A]помилуй грішних, [Dm]  [A]
[Dm]Змилуйся над нами і прости, [Gm]молимо [A]Тебе, Всевишній. [Dm]  [A]
[Dm]І від ворога нас захисти, [Gm]бо без [A]Тебе ми безсилі, [Dm]  [A]
[Dm]Господи зміни все навкруги, [Gm]дай спа[A]сіння Україні. [Dm]

{comment: Куплет 2}
І як над цим спостерігать, якщо людей отак вбивають,
Коли жива людська душа вже зовсім цінності не має?..
І як же нам тут далі жить і нашим дітям в цій країні?
Якщо не вступишся, Господь, загине наша Україна!

{comment: Модуляція}
[Am]Боже, Україну збережи, [B]Господи, помилуй грішних, [Em]  [B]
[Em]Змилуйся над нами і прости, [Am]молимо [B]Тебе, Всевишній. [Em]  [B]
[Em]І від ворога нас захисти, [Am]бо без [B]Тебе ми безсилі, [Em]  [B]
[Em]Господи зміни все навкруги, [Am]дай спа[B]сіння Україні. [Em]`,

  `{title: В Твоїй милості}
{key: Fm}

{comment: Приспів}
[Fm]Я буду радіти і я буду [Db]тішитися
[Eb]В Твоїй милості, в Твоїй [Cm]милості
[Fm]Я буду радіти і я буду [Db]тішитися
[Eb]В Твоїй милості, в Твоїй [Cm]милості

{comment: Куплет}
[Fm]Що побачив Ти горе [Eb]моє,
[Bbm]Що приглянувся Ти до скорботи моєї [Cm]душі
[Fm]Що побачив Ти горе [Eb]моє,
[Bbm]Що приглянувся Ти до скорботи моєї [Cm]душі`,

  `{title: We Believe}
{key: D}

{comment: Verse 1}
[D]In this time of despe[D]ration When all we know is doubt and [D]fear
[Bm]There is only one foun[G]dation We be[D]lieve, we be[D]lieve
[D]In this broken gene[D]ration When all is dark, You help us [D]see
[Bm]There is only one sal[G]vation We be[D]lieve, we be[D]lieve

{comment: Chorus}
[D]We believe in God the Father We believe in [A]Jesus Christ
[Bm]We believe in the Holy Spirit And He's given us new [G]life
[D]We believe in the crucifixion We believe that He conquered [A]death
[B]We believe in the resurrection And He's comin' back again, we be[G]lieve [D]

{comment: Verse 2}
So, let our faith be more than anthems
Greater than the songs we sing
And in our weakness and temptations
We believe, we believe!

{comment: Bridge}
[G]Let the lost be found and the dead be [A]raised!
[Bm]In the here and now, let love in[F#m]vade!
[G]Let the church live loud, our God we'll [A]say
[Bm]We believe, we be[F#m]lieve!
[G]And the gates of hell will not pre[A]vail!
[Bm]For the power of God, has torn the [F#m]veil!
[G]Now we know Your love will never [A]fail!
[Bm]We believe, we be[A/C#]lieve!
He's comin' back a[D]gain, He's [A]coming back a[Bm]gain
We be[G]lieve, we believe`,

  `{title: It Is Well}
{key: G}

{comment: Verse 1}
[G]Grander earth has quaked be[D]fore [Em]
Moved by the sound of His voice
Seas that are shaken and stirred
Can be calmed and broken for my regard

{comment: Chorus}
[C]Through it all, through it [D]all
[Em]My eyes are on You
[C]Through it all, through it [D]all
[Em]It is well
[C]Through it all, through it [D]all
[Em]My eyes are on You
[D]It is well with [G]me

{comment: Verse 2}
[G]Far be it from me to not be[D]lieve [Em]
[G]Even when my eyes can't [D]see [Em]
[G]And this mountain that's [D]in front of [Em]me
[G]Will be thrown into the [D]midst of the [Em]sea

{comment: Pre-Bridge}
So let [G]go my soul and [D]trust in [Em]Him [C]
The [C]waves and wind still [D]know His [Em]name
So let go my soul and trust in Him
The waves and wind still know His name
So let go my soul and trust in Him
The waves and wind still know His name
The waves and wind still know His name

{comment: Bridge (2x)}
[C]It is well with my [Em]soul
[C]It is well with my [Em]soul
[C]It is well with my [Em]soul
[C]It is well, it is [D]well, with my [Em]soul [G]`,

  `{title: In The River}
{key: Gm}

{comment: Intro}
Bb Gm Dm F/A

{comment: Verse 1}
[Bb]There is a river where [Gm]goodness flows
[Dm]There is a fountain that [F/A]drowns sorrow
[Bb]There is an ocean [Gm]deeper than fear
[Dm]The tide is rising, [F/A]rising

{comment: Pre-Chorus}
[Bb]There is a current stirring [Gm]deep inside
[Dm]It's overflowing from the [F/A]heart of God
[Bb]The flood of heaven [Gm]crashing over us
[Dm]The tide is rising, [F/A]rising
[Bb]Bursting, bursting Up [Gm]from the [Dm]ground
[F/A]We feel it now
[Bb]Bursting, bursting Up [Gm]from the [Dm]ground
[F/A]We feel it now

{comment: Chorus}
[Bb]We come alive in the [Gm]river
[Dm]We come alive in the [F/A]river
[Bb]We come alive in the [Gm]river
[Dm]We come alive in the [F/A]river

{comment: Verse 2}
[Bb]There is a current stirring [Gm]deep inside
[Dm]It's overflowing from the [F/A]heart of God
[Bb]The flood of heaven [Gm]crashing over us
[Dm]The tide is rising, [F/A]rising

{comment: Pre-Chorus}
Bursting...
{comment: Chorus}
We come alive in the river...

{comment: Bridge}
[Bb]Break open prison [Gm]doors
[Dm]Set all the captives [F/A]free
[Bb]Spring up a well, spring up a [Gm]well
[Dm]Spring up a well in [F/A]me
[Bb]Nothing can stop this [Gm]joy
[Dm]We're dancing in the [F/A]street
[Bb]Spring up a well, spring up a [Gm]well
[Dm]Spring up a well in [F/A]me
[Bb]We come alive in the [Gm]river

{comment: Outro}
Bursting, bursting
We come alive in the river (x4)
Spring up a well Spring up a well Spring up a well in me (x2)`,

  `{title: О, Зійди}
{key: Bm}

{comment: Куплет 1 (На-на....)}
[Bm]Вся земля схили[G]лася
[D/F#]Втомлена від бо[A]ротьби [F#m]
[Bm]Зітхаємо у [G]марноті
[D]Бо втратили ми [A]Твій дотик

{comment: Приспів}
[Em]О, зій[Bm]ди! [A]
[Em]Спа-се [Bm]від-ро-[D]ди. [A]Зій-[G]ди! [Bm] [A]

{comment: Куплет 2 (На-на....)}
Небеса далекі нам
Власний шлях обрали ми
Вся земля чекає на
Спасителя, на мир і спокій

{comment: Перехід}
О, прийди!
Царю милості, прийди!
Освіти!
Всім хто в темноті, світи
[C#m]Небеса схиля[A]ються
[E/G#]Являють нам святе [B]дитя [G#m]
[C#m]Земле вся, заспі[A]вай
[E]Правдивий Цар, Бог наш [B]з нами

{comment: Приспів (На-на....)}
[F#m]О, [C#m]ра-[B]дій!
[F#m]Спас [C#m]Ме-сі-я [E]нам ро-[B]дивсь! [A] [C#m] [B]
О, вклонись!
Царю всіх царів, вклонись!

{comment: Бридж}
[A]Підіймай опущені [B]руки
[A]Потішай тих хто відчаєм [C#m]скуті [B]
[A]Відкриває Син [B]нову
[F#m]Надію, [G#m]силу [A]й повноту [B]

{comment: Приспів (На-на....)}
[F#m]О, [C#m]ра-[B]дій!
[F#m]Спас [C#m]Ме-сі-я [E]нам ро-[B]дивсь! [A] [C#m] [B]
О, прийми!
Це рятунок твій, прийми!`,

  `{title: Він родився}
{key: E}

{comment: Intro}
E A E B

{comment: Куплет 1}
[E]Століття пройшли, а зоря та [A]палає і [B]нині,
[E]Показує напрямок, шлях до [A]свободи лю[B]дині.
[C#m]В хліві народилось від діви [A]Марії [B]дитя,
[A]Що стало Спасителем з неба і дало [B]життя.

{comment: Приспів}
[E]Він родився Царь Ме[A]сія
[B]Людям світ у серця дару[E]вав [B]
[E]Ми співаєм ми ра[A]дієм
[B]Бо любов'ю ти нас обі[E]грів [B]

{comment: Instrumental}
E A E B

{comment: Куплет 2}
[E]Знайди же Ісуса і добру [A]новину [B]неси,
[E]У радості іншим, чинили [A]бо так пас[B]тухи.
[C#m]Є сила у Бога, надія та [A]віра — в [B]Творця,
[A]Будь приклад для інших і вірний Йому до [B]кінця.

{comment: Бридж}
[E]Хей! Мій Цар родився [F#]всесвіт поклонився, [G#m]слава і честь [A]Йому
[E]Хей! Мій Цар родився [F#]всесвіт поклонився, [G#m]слава і честь [A]Йому`,

  `{title: Angels We Have Heard On High}
{key: C}

{comment: Verse 1}
[C]Angels we have heard on high
Sweetly singing o'er the plains
And the mountains in reply
Echoing their joyous strains

{comment: Refrain}
[C]Glo-[Am]ooo-[Dm]o-[G]ooo-[C]o-[F]ooo-[G]o-[C]ria in Excelsis [G]Deo
[C]Gloria [Am]in [Dm]Ex[G]cel[C]sis [F][G][C]De[G]o [C]

{comment: Verse 2}
[C]Shepherds, why this jubilee?
Why your joyous strains prolong?
What the gladsome tidings be
Which inspire your heavenly song

{comment: Refrain}
[C]Glo-[Am]ooo-[Dm]o-[G]ooo-[C]o-[F]ooo-[G]o-[C]ria in Excelsis [G]Deo
[C]Gloria [Am]in [Dm]Ex[G]cel[C]sis [F]De[G]o [C][G][C]

{comment: Verse 3}
[D]Come to Bethlehem and see
Him whose birth the angels sing
Come adore on bended knee
Christ our Lord, the new born King

{comment: Refrain}
[D]Glo-[Bm]ooo-[Em]o-[A]ooo-[D]o-[G]ooo-[A]o-[D]ria in Excelsis [A]Deo
[D]Gloria [Bm]in [Em]Ex[A]cel[D]sis [G][A]De[D]o`,

  `{title: Я приношу Тобі}
{key: D}

{comment: Intro}
D G Bm A G

{comment: Куплет 1}
[D]Я приношу Тобі тривоги, Мої поразки й пере[G]моги -
[Bm]Я віддаю їх [A]Тобі. [G]
[D]І приношу Тобі проблеми, Сльози душі мої да[G]ремні -
[Bm]Я віддаю їх Тобі, [A]Я від[G]даю їх [Em]Тобі. [D/F#] [A7] [A]

{comment: Приспів}
[G]Даруєш мир серед [D]війни, [A]
[G]Осяєш шлях у [D]темряві, [A]
[D/F#]Ти ллєш Свій дощ [G]серед пустель - [A]
[Bm]Я не один тепер, [G]я не [A]один.

{comment: Куплет 2}
Свої думки Тобі відкрию, Рани душі, розбиті мрії -
Я віддаю їх Тобі.
Страхи свої, розчарування, Біль від образ та всі бажання -
Я віддаю їх Тобі, Я віддаю їх Тобі.

{comment: Бридж}
[G]У глибині землі й [D]морів, У [G]висоті не[D]бес, [A/C#]
[G]Серед днів і [D]темних ночей - [A/C#]
[Bm]Я не один тепер, [G]я не один, [A] [D/F#]
[G]Я не один тепер, [Bm]я не [A]один.
[D/F#]Я не [G]один тепер, [Bm]я не один... [A]`,

  `{title: Пісня Соломона}
{key: C}

{comment: Intro}
C G/B F C

{comment: Куплет 1}
[C]Серед холоду та вітру [G/B]
[F]Ти мені потрібен, Боже [C]мій!..
[C]Наче пелена [G/B]туману,
[F]Смуток мій розтане, Боже [C]мій!..

{comment: Приспів}
[Am]Понад горами, [Em/G]через [Dm]моря [Am]
[Am]Ти поспі[Em/G]шаєш, [F]Любове [C]моя! [G/B]

{comment: Куплет 2}
Дай відчути рідний подих
І тепло долонь Твоїх, Боже мій!..
Душу полонив красою,
Серця добротою, Боже мій!..

{comment: Приспів (2)}

{comment: Бридж}
[C]Хоч серед ночі тьма шлях по[Bb]крила,
[F/A]Ти поспішаєш, щоб світлом о[C]горнуть!..
[C]Хоч серед ночі тьма шлях по[Bb]крила,
[Dm]Ти поспішаєш, щоб світлом о[C]горнуть! [G/B]

{comment: Приспів (2)}`,

  `{title: Любов Христа}
{key: Em}

{comment: Куплет 1}
[Em7]Любов Христа безмірна і [F#m7]палка
[B]Нема по[B7]чатку, ллється як [C#m7b5]ріка.
[Cmaj7]І наче хвиля близько бе[Bm6]регів,
[D]Так і вона [Edim]близька споконвіків [Em7]

{comment: Куплет 2}
[Em7]Він полюбив тебе, мене [F#m7]давно
[B]Він полю[B7]бив і тих, хто все[C#m7b5]одно
[Cmaj7]Кричали «Ні!» - і підіймали [Bm6]сміх,
[D]А Він з лю[Edim]бов'ю закликає [Em7]всіх.

{comment: Приспів}
[Am7]Якщо б любові не [Em7]було
[D]Ми б не змогли здолати [Gmaj7]зло,
[Am7]Надію мати на [Gmaj9]життя, [C7]
[F#7]Що може дати лиш [B7]любов Христа.

{comment: Куплет 3}
Якби пізнали люди на землі
Любов Христа спрямовану до всіх
Якщо любов забрати хоч на мить
То світ увесь в ненависті згорить

{comment: Куплет 4}
Прийди до Нього швидше, не барись,
Давно чекає Він, лише звернись,
Ще кличе Він, прийми любов Христа,
Що дасть тобі спасіння і життя.`,

  `{title: Я переможу, Господи}
{key: E}

{comment: Куплет 1}
[C#m]Впаде вся зброя, що є [A]проти ме[E]не
[C#m]Зникне морок, темря[A]ва пі[E]де
[C#m]Бог, Якому я слу[A]жу - перема[E]гає
[C#m]Мій Бог не [A]під[E]веде
[C#m]О, мій Бог не [A]під[E]веде

{comment: Приспів}
[C#m]Я переможу, Господи!
[A]Я переможу, Господи!
[E]Бо ця битва належить [B]Тобі!
[C#m]Я переможу, Господи!
[A]Я переможу, Господи!
[E]Бо ця битва належить [B]Тобі!

{comment: Куплет 2}
[C#m]Могутня сила в [A]імені Іс[E]уса
У двобої виграє Творець
З велетнем зійдусь сміливо в битві
Знаю битви цієї кінець!
Знаю битви цієї кінець!

{comment: Interlude}
A B A B A B

{comment: Бридж}
[A]Візьми темні задуми ворогів [C#m]всіх [B]
[E/G#]І зміни на [A]добро! Зміни на [C#m]добро! [B]`,

  `{title: За все Тобі я дякую}
{key: Cm}

{comment: Куплет 1}
[Cm]За все Тобі я дякую, [G7]Ісусе Спасе [Cm]мій
[Cm]За кров святу про[G7]литую, за дар [Cm]любові [Bb]Твій.

{comment: Приспів}
[Eb]Я дякую за все, [Bb]за те що спас [G7]мене,
[Cm]За те, що небо [G]дав, мене своїм наз[Cm]вав, [Bb]
[Eb]О, Господи святий, [Bb]живи в душі [G7]моїй,
[Cm]Завжди мене [Bb]навчай, [Ab]веди в [Bb/G]небесний [Cm]край.

{comment: Куплет 2}
За все Тобі я дякую, що Ти у світ прийшов,
І душу змучену мою для вічності знайшов.

{comment: Куплет 3}
[Cm]За все Тобі я дякую, [G7]за мир і Дух Свя[Cm]тий.
[Cm]Що Ти у пору всяку [G7]живеш в душі [Cm]моїй.

{comment: Куплет 4}
[Dm]За все Тобі я дякую. [A7]Ти небо дав [Dm]мені.
[Dm]Я з вічною подякою [A7]служитиму [Dm]Тобі. [C]`,

  `{title: Goodness of God}
{key: G#}

{comment: Intro}
G# C# G# C#

{comment: Verse 1}
[G#]I love you, Lord for [C#]Your mercy never [G#]fails me
[D#/G] [Fm]All my days, I've [C#]been held in Your [D#]hands
From the moment that I [Fm]wake up [C#]till I lay my head [G#] [D#/G] [Fm]
[C#]I will sing of the [D#]goodness of [G#]God

{comment: Chorus}
[C#]All my life You have [G#]been faithful
[C#]All my life You have [G#]been so, [D#]so good
[C#]With every breath that I am [G#]able [D#/G] [Fm]
[C#]I will sing of the [D#]goodness of [G#]God

{comment: Verse 2}
[G#]I love Your voice You [C#]have led me through the [G#]fire
[D#/G] [Fm]In darkest night [C#]You are close like no [D#]other
I've known You as a [Fm]father [C#]I've known You as a friend [G#] [D#/G] [Fm]
[C#]I have lived in the [D#]goodness of [G#]God

{comment: Chorus}
[C#]All my life You have [G#]been faithful
[C#]All my life You have [G#]been so, [D#]so good
[C#]With every breath that I am [G#]able [D#/G] [Fm]
[C#]I will sing of the [D#]goodness of [G#]God

{comment: Bridge (2X)}
[G#/C]Your goodness is running [C#]after, It's running [D#]after [G#]me
[G#/C]Your goodness is running [C#]after, It's running [D#]after [G#]me
[G#/C]With my life laid down, [C#]I'm surrendered now [D#]I give You every[Fm]thing
[G#/C]Your goodness is running [C#]after, It's running [D#]after [G#]me

{comment: Chorus (quietly, loudly: I'm gonna sing of the goodness of God)}`,

  `{title: Кров Христа}
{key: Dm}

{comment: Куплет 1}
[Dm]У стражданнях і тузі наш [Gm]Господь був на [A]хресті.
[Bb]Він поніс туди [Gm]всі болі і [A]гріхи.
[F]Він – Предвічний і Святий [D]всіх людей так полюбив...
[Gm]Свою Кров за всіх людей [Gm/E]Він про[A]ливав.

{comment: Приспів}
[Dm]Кров Христа за мене [Dm/C]теж лилась...
[Bb]Кров Христа за[Gm]хистить моє [A]життя!
[F]Кров Христа – оми[Bb]ває від [Eb]гріха,
[A]Сила, що [Dm]рятує [C]нас – Кров [Bb]Хрис[Gm]та! Кров [A]Христа!

{comment: Куплет 2}
І немов мале Ягня, став Він жертвою за нас,
Його Кров з хреста лилася за людей...
Кров змиває всі гріхи і рятує від діл тьми.
Кожен день, в молитві, кличу до Христа!

{comment: Приспів}
[Dm]Кров Христа за [Dm/C]тебе теж лилась...
[Bb]Кров Христа за[Gm]хистить твоє [A]життя!
[F]Кров Христа – оми[Bb]ває від [Eb]гріха,
[A]Сила, що [Dm]рятує [C]нас – Кров [Bb]Хрис[Gm]та! Кров [A]Христа! [D]`,

  `{title: Господь, я славлю Тебе}
{key: Em}

{comment: Куплет 1}
[Em]Господь, я славлю Тебе за [C]все, що [Am]Ти зробив, [B7]
[Em]Я дякую за Твій [C]хрест, за [Am]кров, що Ти про[B7]лив,
[Em]Я за [C]Тобою [Am]піду, куди б [B7]Ти не вказав мені,
[Em]Я славлю [C]Тебе, і [Am]лиш Тебе [B7]люблю!

{comment: Приспів}
[Em]Хай Твій вогонь все [C]спалить, що [Am]для Тебе [B7]зайве,
[Em]Хай Дух Святий [C]дощем [Am]проллє в життя [B7]моє,
[Em]Я славлю [C]Тебе, [Am]Тобі життя я [B7]довіряю,
[Em]О, мій [C]Господь, [B7]Ісус!

{comment: Куплет 2}
Господь, Ти – скеля моя, спасіння Ти для нас,
Прийшов до нас Ти з небес, любов'ю осіяв,
Я за Тобою піду, куди б Ти не вказав мені,
Я славлю Тебе, і лиш Тебе люблю!`,

  `{title: Ти – кожен подих мій}
{key: F}

{comment: Куплет 1 (2р.)}
[F]Ти – кожен подих [Bb/F]мій,
[F]Ти – кожен подих [Bb/F]мій,
[F]Твоя при[C/E]сутність [Dm]завжди [Dm/C]в ме[Bb]ні. [C]

{comment: Приспів}
[F]Ось я перед [C/E]То[Dm]бою, [Bb]Господь, [C]
[F]Живу я, [C/E]бо [Dm]Ти зі мною, [Bb]мій [C]Бог!

{comment: Куплет 2 (2р.)}
[F]Ти – мій щоденний [Bb/F]Хліб,
Ти – мій щоденний Хліб,
[F]Ти сієш [C/E]Слово [Dm]в серце [Dm/C]ме[Bb]ні. [C]

{comment: Приспів}
Ось я перед Тобою, Господь,
Живу я, бо Ти зі мною, мій Бог!

{comment: Bridge}
[F]Ось я перед [C/E]То[Dm]бою, [Bb]Ісус, [C]
[F]І я – ніх[C/E]то [Dm]без Тебе, [Bb]Ісус! [C]

{comment: English Bridge}
[F]We fall down We [C]lay our [Dm7]crowns
[Bb]At the [Bm]feet of [C]Jesus
[F]The greatness of [C]Mercy and [Dm7]love
[Bb]At the [Bm]feet of [C]Jesus
[F/C]And we cry holy, [Bb]holy, [F/A]ho[C]ly
[F/C]We cry holy, [Bb]holy, [F/A]ho[C]ly
We cry holy, [Bb]holy, [F/A]ho[C]ly
Is the [F]lamb`,

  `{title: Throne Room}
{key: D}

{comment: Verse 1}
[D]Dream after dream, You are
[Bm]Speaking to me, breathing
[A]Word after word of kingdom [E]come
[D]Here at Your feet, I can
[Bm]See the unseen, truly
[A]One look at You and I'm un[E]done

{comment: Pre-Chorus}
[D]I run to the throne room
[Bm]I run to the throne room

{comment: Chorus}
[D]And I fall on my face With [Bm]angels and saints
And all I can say is
[F#m]Holy, holy, holy are [E]You, God
[D]My heart can't contain The [Bm]weight of Your name
And all I can say is
[F#m]Holy, holy, holy are [E]You

{comment: Verse 2}
[D]Grace upon grace, all my
[Bm]Fear falls away only
[A]Your perfect love for me re[E]mains
[D]Oh, time after time You stay
[Bm]Close by my side burning
[A]Fire inside I can't con[E]tain

{comment: Instrumental}
D Bm F#m E

{comment: Outro (2 times)}
[D]I run to the throne room [Bm]Before You, [F#m]the only [E]One
[D]I run to the throne room [Bm]Before You, [F#m]I'm over[E]come`,

  `{title: Хвилина мовчання}
{key: Cm}

{comment: Вступ}
Cm Cm

{comment: Куплет 1}
[Cm]Хвилина мовчання одні [G]запитання
[Fm]Без відповідей немає [G]людей...
[Cm]Їх Тисячі й сотні здається [G]безмовні
[Fm]Та голос у них гучніший за [G]всіх.

{comment: Заспів}
[Ab]Хто підніме меч на наш народ
[G]Збира собі на голову праведний суд.

{comment: Приспів}
[Cm]Перемога наша, перемога
[G]Є вона у Бога, вірим в Бога
[Ab]Син Божий за нас на хресті вмер
[G]А на третій день воскрес-переміг смерть!
[Cm]Перемога наша, перемога
[G]Є вона у Бога, вірим в Бога
[Ab]Син Божий за нас на хресті вмер
[G]А на третій день воскрес-переміг [Ab]смерть!
[G]А на третій день воскрес-переміг [Cm]смерть!

{comment: Куплет 2}
[Cm]Біль беззупинний нервові [G]клітини
[Fm]Вже не відновить чого ж так [G]болить?
[Cm]Всеодно будем жити і в [G]темні часи
[Fm]Духом пламеніти щоб темряву пере[G]могти.

{comment: Приспів}
[Cm]Перемога наша, перемога
[G]Є вона у Бога, вірим в Бога
[Ab]Син Божий за нас на хресті вмер
[G]А на третій день воскрес-переміг смерть!
[Cm]Перемога наша, перемога
[G]Є вона у Бога, вірим в Бога
[Ab]Син Божий за нас на хресті вмер
[G]А на третій день воскрес-переміг [Ab]смерть!
[G]А на третій день воскрес-переміг [Cm]смерть!

{comment: Бридж (x2)}
[Ab]Я знаю в небеснім краю
[Bb]Не буде плачу, не буде смерті там
[Cm]Туди ракети не долітають
[Gm]Там править правда, любов і доброта
[Ab]Ніхто не знищить, не пограбує
[Bb]Не перекрутить істину на фейк
[Cm]Там править правда, там Бог царює
[Gm]Там є притолук і дім для всіх [Ab]людей

{comment: Програш}
Ab Bb Cm Gm
Ab Bb Cm Gm`,

  `{title: King Of My Heart}
{key: A}

{comment: Verse 1}
[A]Let the King of my heart be the [D]mountain where I [A]run
The [F#m]Fountain I drink [E]from, oh [D]He is my [A]song
[A]Let the King of my heart be the [D]shadow where I [A]hide
The [F#m]ransom for my [E]life, oh [D]He is my [A]song

{comment: Chorus (x2)}
[F#m]You are [E]good, [D]good, [A]oh
[F#m]You are [E]good, [D]good, [A]oh

{comment: Verse 2 (x2)}
[A]Let the King of my heart be the [D]wind inside my [A]sails
The [F#m]anchor in the [E]waves, oh [D]He is my [A]song
[A]Let the King of my heart be the [D]fire inside my [A]veins
The [F#m]echo of my [E]days, oh [D]He is my [A]song

{comment: Chorus (x2)}
[F#m]You are [E]good, [D]good, [A]oh
[F#m]You are [E]good, [D]good, [A]oh

{comment: Bridge 1 (x2)}
[A]You're never gonna let, [B]never gonna let me [E]down
[F#m]You're never gonna [E]let, [D]never gonna let me [A]down

{comment: Outro (x2)}
F#m E D A
F#m E D A`,

  `{title: Ти Тут}
{key: A}

{comment: Приспів}
[A]Ти тут Долину плачу я [B]пройду з То[D#m]бою
[A]Ти тут Укріпиш кроки Ти [B]своєю любов'[D#m]ю
[A]До останнього подиху в [B]Твоїх все руках
[D#m]Ти один серце втішиш коли сам на сам
[A]Уся влада і сила, [B]мій Бог, у Твоїх все [D#m]руках

{comment: Куплет}
[A]Я знаю З Тобою [B]лиш все пройду
[D#m]І я вірю, Твій мир [E]знову знайду
[A]Тільки Ти оновиш [B]силу мою Я [D#m]пройду Я пройду [E]

{comment: Приспів}
[A]Ти тут Долину плачу я [B]пройду з То[D#m]бою [E]
[A]Ти тут Укріпиш кроки Ти [B]своєю любов'[D#m]ю [E]
[A]До останнього подиху в [B]Твоїх все руках
[D#m]Ти один серце втішиш коли [E]сам на сам
[A]Уся влада і сила, [B]мій Бог, у Твоїх все [D#m]руках [E]

{comment: Програш (x2)}
A B D#m E

{comment: Бридж (X4)}
[A]Ти за мене, Бог, [B]воюєш В [D#m]тіні крил Твоїх [E]стою я
[A]Оновив в мені Ти [B]силу Я [D#m]піду і не [E]боюсь

{comment: Приспів}
{comment: Кінцівка (x2)}
A B D#m E

{comment: Tag}
[A]Своїм словом мене [B]Ти провів І [D#m]у серці пісню [E]відновив
[A]Обітниці Твої [B]бережу Бог, я [D#m]йду`,

  `{title: Наш Бог – Всемогутній Бог}
{key: Em}

{comment: Куплет 1}
[Em]Підносьте голос в пісні, з'єднайтесь всі в хвалі.
[C]Наш Бог - Всемо[D]гутній [Em]Бог.
[Em]Звіщає хор небесний і ми тут на землі:
[C]Наш Бог - Всемо[D]гутній [E]Бог.
[Am]Хай славлять всі народи Того, Хто дав життя
[Bm]Нехай хвалою наші напов[Em]няться серця.
[Am]І скажемо ми світу про те, Який Наш Бог:
[C]Наш Бог - Всемо[D]гутній [Em]Бог!

{comment: Приспів}
[C]Наш Бог-Всемогутній, [G]править Він на [D]небі у [Em]славі.
[C]Мудрий, [G]Сильний, [Am]Люблячий, [Bm]Всемогутній [Em]Бог!

{comment: Куплет 2}
[Em]Настане скоро славний фінал на цій Землі.
[C]Наш Бог - Всемо[D]гутній [Em]Бог.
[Em]Зруйнує Цар небесний престол всій силі злій.
[C]Наш Бог - Всемо[D]гутній [Em]Бог.
[Am]Який Великий Бог наш Ісус, наш Син Творця
[Bm]І наша є свобода - відкуплені [Em]серця.
[Am]Розкажемо ми світу про те, Який Наш Бог:
[C]Наш Бог - Всемо[D]гутній [Em]Бог!`,

  `{title: Лиш у Христі}
{key: C}

{comment: Куплет 1}
[F]Лиш у Хрис[C]ті надія [Am]є - [G]Світ[C/E]ло [F]моє і [G]сила! [C]
[F]На Скелі [C]Цій життя [Am]моє, [G]Віра мене [G]зміц[C]нила.

{comment: 1 Приспів}
Є мій [C/E]Господь [F]на Небе[Am]сах, [G]Його [C/E]лю[F]бов до[Am]лає [G]страх,
[F]Дару[C]є мир ду[Am]ші [G]моїй. [C/E]Си[F]ла моя - [G]Спаситель [C]мій!
О-о-о-о-о-о (C-F-Am-F) +2

{comment: Куплет 2}
[F]Ісус Хрис[C]тос, Що в [Am]світ [G]прийшов, [C/E]Мав, [F]як і ми, [G]і плоть і [C]кров.
[F]Страж[C]дав за нас, [Am]по[G]мер за нас, [C/E]Гріш[F]них людей [G]від смерті [C]спас!

{comment: 2 Приспів}
Там, на [C/E]хресті, [F]Ісус [Am]вмирав, [G]За нас [C/E]у[F]сіх жит[Am]тя від[G]дав.
[F]Мій [C]гріх і [Am]твій [G]на Себе [C/E]взяв, [F]Вічне [G]життя нам да[C]рував
О-о-о-о-о (C-F-Am-F) +2

{comment: Куплет 3}
[F]Життя при[C]йшло, здо[Am]лав[G]ши смерть - [C/E]Си[F]ла Христа [G]в мені [C]тепер
[F]Усе [C]життя [Am]моє [G]земне [C/E]Знаю: [F]Ісус [G]веде [C]мене

{comment: 3 Приспів}
Він пере[C/E]міг, [F]проливши [Am]кров - [G]Прок[C/E]лят[F]тя більше [Am]не прийде [G]знов!
[F]Бо [C]я - Йо[Am]го, [G]а Він [C/E]Є [F]мій, [G]Сила і Щит [C]душі моїй!
О-о-о-о-о-о (C-F-Am-F) +2

{comment: Бридж}
[C]Світло моє, [F]сила [Am]моя, Моя [F]надія - лиш у Христі!
[C]Я не боюсь [F]силу [Am]пітьми: Я [F]мир знайду лиш у Христі!
[C]Життя моє, [Dm]все, що [Am]в мені, І [F]пісня ця - Тобі, Ісус!
[C]Ти Цар царів, [Dm]Господь [Am]всього! Хвала [F]Небес - Тобі, Христос! [C] [F] [Am] [F]
[C]Тобі, [F]Хрис[Am]тос! [F] [C]

{comment: Кінцівка}
[F]Лиш [C]у Христі [Am]надія [G]є - [C/E]Світ[F]ло моє [G]і [C]сила.
[F]На [C]скелі [Am]Цій життя [G]моє, [C/E]Ві[F]ра мене [G]зміцни[C]ла!`,

  `{title: Єрусалим}
{key: Gm}

{comment: Куплет 1}
[Gm]Є на Небі місто [Cm]світле [D7]і чу[Gm]дове
[Gm]Там не буде тісно [Cm]Бо життя [F]там но[Bb]ве
[G7]Там живуть святії [Cm]Грають [F]там на гус[Bb]лях
[Cm]Прославляють разом [Gm]Господа [Cm]Ісу[D7]са

{comment: Приспів}
[Gm]Там хворих нема, там квітне весна - Єруса[Cm]лим
[F]Там вічно живуть, поклін віддають - Єруса[Bb]лим [D7]
[Gm]Ти місто живих, ти місто святих - Єруса[Cm]лим
[Eb]До тебе душа так прагне [D7]моя, Єруса[Gm]лим

{comment: Куплет 2}
[Gm]Золото повсюди [Cm]в тім [D7]чудовім [Gm]місті
[Gm]Там щасливі люди [Cm]і ду[F]шею чис[Bb]ті
[G7]Я життя переміню [Cm]тут [F]в земній доли[Bb]ні
[Cm]І з надією дійду [Gm]до [Cm]Єруса[D7]лиму

{comment: Куплет 3}
[Gm]Браття мої, сестри, [Cm]скоро [D7]разом всі [Gm]ми
[Gm]Будемо співати [Cm]в Іє[F]русали[Bb]мі
[G7]Тож давайте на землі [Cm]разом [F]славить [Bb]Бога
[Cm]Щоб скоріш відкрилась [Cm]нам в небеса до[D7]рога`,

  `{title: Ти понад усе}
{key: Gm}

{comment: Куплет 1}
[Gm]Могутній правитель [Bb]І [F]нездоланний [C]Ти,
[Gm]Співає [Bb]творіння: [F]"Бог з нами на[C]завжди!"
[Dm]Бо царство Твоє вже [Bb]скоро [F]прийде
[C]Та кожну [Dm]сльозу з очей [Bb]людей [C]зітре!

{comment: Приспів}
[Gm]Ти понад усе, Бог незмінний,
[Bb]Тобі я [F]цінний і нероздільні [C]ми.
[Gm]Ти врятував і є знов надія,
[Bb]Найбільша [F]мрія - вічно з Тобою [C]ми,
[Gm]Прославлю [Bb]я Твоє [F]Ім'[C]я!

{comment: Куплет 2}
[Gm]Дарунок прощення, [Bb]Боже, [F]не заслужив, [C]о-о-о.
[Gm]Твій захист, [Bb]як скеля, [F]Я відчуваю [C]мир.
[Dm]Бо царство Твоє вже [Bb]скоро [F]прийде
[C]Та кожну [Dm]сльозу з очей [Bb]людей [C]зітре!

{comment: Програш}
Gm Bb F C

{comment: Бридж (/2)}
[Gm]Своїм ангелам
[Bb]Заповів Ти бе[F]регти [C]мене.
[Gm]Через прірви зла
[Bb]На міцних руках Ти [F]поне[C]сеш`,

  `{title: Життя – не життя}
{key: F#m}

{comment: Intro}
D A C#m F#m F#m/E F#m

{comment: Куплет 1}
[F#m]Твоєю благодаттю наповнена [C#m]земля,
[E]Веде мене в житті Твоя [F#]рука!
[F#m]Понад усе на світі найбільше [C#m]надбання -
[E]То право пізнання [F#m]Христа!
[D]Життя – не [A]життя без [C#m]Ісуса [F#m]Христа!
[D]Він - вся [A]повнота! [C#m]Алелуя! [F#m]Алелуя

{comment: Куплет 2}
[F#m]Ти - моя надія, Ти - моє [C#m]майбуття!
[E]Все, що без Тебе, то [F#]марнота!
[F#m]Дай сили так прожити, щоб почути ті [C#m]слова:
[E]Прошу тебе заходь, моє [F#m]дитя!
[D]Життя – не [A]життя без [C#m]Ісуса [F#m]Христа!
[D]Він - вся [A]повнота! [C#m]Алелуя! [F#m]Алелуя! (2)

{comment: Bridge}
F#m D
[F#m]Куди піду від Тебе?.. [D]Де зможу заховатись [F#m]я?..
[F#m]Ти – Бог наш всевидючий! [D]В Твоїй долоні вся [F#m]Земля! (2)
[E]В Тобі моя мета! Покину своє [F#m]"Я"!
[D]Господь, вся слава [E]Твоя!
[D]Життя – не [A]життя без [C#m]Ісуса [F#m]Христа!
[D]Він - вся [A]повнота! [C#m]Алелуя! [F#m]Алелуя! (2)
[C#m]Алелуя! [F#m]Алелуя! [C#m]Алелуя! [F#m]Алелуя!`,

  `{title: Тримаєш}
{key: Em}

{comment: Intro}
Em Em C

{comment: Куплет 1}
[Em]Ісус, Ти так міцно тримаєш
[Em]Серце моє у долонях Своїх три[C]маєш
[Em]Не відпускай!
[Em]Ми разом проходим з Тобою в безоднях
[C]Вогонь, біль і холод, криваву війну
[Am]Тримаєш мене Ти за руку
[D]Господь зі [B7]мною

{comment: Приспів}
[C]Ти зі мною, Боже, [Am]завжди [Em]поруч [D]Я відчуваю.
[C]Захищаєш, крилом [Am]Своїм [Em]Ти сховаєш, І страх про[D]ганяєш
[C]Забираєш [Am]біль, [Em]Ісус

{comment: Куплет 2}
[Em]Змій мою слабкість шукає
[Em]В душу мою темні сумніви ядом пускає [C]Бог ожив[Em]ляє.
[Em]Коли страх думки у полоні тримає
[C]Зневірююсь я і вогонь мій згасає
[Am]Та мій Бог запалює [D]Вірю ми пере[B7]можем!

{comment: Програш}
C B7 Em Bm (x2)
C Am Em D (x3)
C Am B7`,

  `{title: He Will Keep You}
{key: F}

{comment: Intro}
F Bb F Bb

{comment: Verse 1}
[F]I lift my [Gm7]eyes and [F/A]see, [F]I need not [Gm7]be a[F/A]fraid
[Dm]All my help comes [Bb]from the [Csus]Lord [C]
[Dm]Who the earth and [Bb]sky has [Csus]made [C]

{comment: Chorus}
[F]He will keep you from all [C/E]evils, [Dm]behind you and be[Bb]fore
[F]He will sustain you, through this [C/E]journey
[Dm]From now [C]and [Bb]ever[Bb]more

{comment: Verse 2}
[F]The Lord will [Gm7]never [F/A]sleep
[F]My steps He [Gm7]has or[F/A]dained
[Dm]For the One who [Bb]holds the [Csus]night [C]
[Dm]Is the Sovereign [Bb]of my [Csus]days [C]

{comment: Chorus (3 times, 3x end of F)}`,

  `{title: Святий навіки}
{key: G}

{comment: Intro}
G C D Bm Em D

{comment: Куплет 1}
[G]Тисячі народів єдна[C]ються в [G]хвалі
[Em]Щоб заспівати [D]пісню Отцю [C]Віків
[G]І всі, хто були до нас [C]І всі, хто ще [G]прийдуть
[Em]Заспівають [D]пісню нову Отцю [C]віків

{comment: Перед приспів}
[Em]Ім'я [D]Твоє - є славне [C]Ім'я Твоє - прекрасне
[Em]Ім'я, що є [D]вище над усі
[C]Всі престоли, [Em]панування [D]Повноваження і влади
[Em]Ім'я Твоє [Am]вище над усі...

{comment: Приспів}
[C]Чуєш спів небес - [Em]СВЯ[D]ТИЙ Славить вся земля - [Bm]СВЯ[Em]ТИЙ
[Am]Будь піднесений - СВЯ[D]ТИЙ Святий на[G]віки!

{comment: Куплет 2}
Твій гріх омив він кров'ю Пробачив і звільнив
Тож прослав ім'я Святого Царя Царів
Ти носиш його ім'я Ти вільний у Христі
Тож співай пісню нову Отцю Віків
Ми прославим Твоє Ім'я і амінь

{comment: Приспів}
[C]Чуєш спів небес - [Em]СВЯ[D]ТИЙ Славить вся земля - [Bm]СВЯ[Em]ТИЙ
[Am]Будь піднесений - [D]СВЯТИЙ Святий на[G]віки!
[C]Чуєш шум хвали - [Em]СВЯ[D]ТИЙ Він є Бог Богів - [Bm]СВЯ[Em]ТИЙ
[Am]Ти є Той, хто назавжди - СВЯТИЙ [D]Святий на[G]віки.`,

  `{title: Praise}
{key: C}

{comment: Intro}
[C]Let's go, one, two, hey
Let everything that has breath
Praise the Lord (You got it), praise the Lord
Let everything, let everything that has breath
Praise the Lord, praise the Lord
(Let everything) Let everything (Hey) that has breath (Hey)

{comment: Verse 1}
[C]I'll praise in the valley, [F2]praise on the [C]mountain (Yeah)
[G/B]I'll praise when I'm sure, [F2]praise when I'm [C]doubting
[C]I'll praise when outnumbered, [F2]praise when sur[C]rounded
[G/B]'Cause praise is the [F]waters my enemies [C]drown in

{comment: Chorus}
[G]As long as I'm breathing [F]I've got a reason to
[Am]Praise [F]the [C]Lord, oh my [G]soul (C'mon)
[Am]Praise [F]the [C]Lord, oh my [G]soul

{comment: Verse 2}
[C]I'll praise when I feel it, [F2]and I'll praise when I [C]don't (Yeah)
[G/B]I'll praise 'cause I know [F2]You're still in con[C]trol
[C]'Cause my praise is a weapon, [F2]it's more than a [C]sound (More than a sound)
[G/B]Oh, my praise is the [F2]shout that brings Jericho [C]down (Yeah)

{comment: Chorus}
[G]As long as I'm breathing [F]I've got a reason to
[Am]Praise [F]the [C]Lord (C'mon), oh my [G]soul
[Am]Praise [F]the [C]Lord, oh my [G]soul
[Am]I won't be quiet, [F]my God is alive
[C]So how could I keep it in[G]side? (I gotta)
[Am]Praise [F]the [C]Lord, oh my [G]soul (Yeah, praise the Lord)

{comment: Interlude}
[C]C'mon let me see that dance, put a dance on it tonight (Yeah)
If you're grateful, c'mon Hey, hey, yeah

{comment: Bridge}
[C]I'll praise 'cause You're sovereign, [Dm]praise 'cause You reign
[Em]Praise 'cause You rose and de[F]feated the grave
[C]I'll praise 'cause You're faithful, [Dm]praise 'cause You're true
[Em]Praise 'cause there's nobody [F]greater than You
I'll praise 'cause You're sovereign, praise 'cause You reign (You reign)
Praise 'cause You rose and defeated the grave
I'll praise 'cause You're faithful, praise 'cause You're true
Praise 'cause there's nobody greater than You

{comment: Chorus}
[Am]Praise [F]the [C]Lord, oh my [G]soul (C'mon, c'mon, c'mon, c'mon)
Praise the Lord, oh my soul (Praise the Lord, oh my soul)
Praise the Lord, oh my soul
Praise the Lord, oh my soul
[Am]I won't be quiet, [F]my God is alive [C]How could I keep it in[G]side? (How could I)
[Am]I won't be quiet, [F]my God is alive [C]How could I keep it in[G]side? (I won't keep quiet)
[Am]I won't be quiet, [F]my God is alive [C]How could I keep it in[G]side? (I gotta)
[Am]Praise [F]the [C]Lord, oh my [G]soul
Am / F / C / G`,

  `{title: Авва}
{key: Fm}

{comment: Куплет 1}
[Fm]Ти є той, Хто захищає
[Db]Лише Ти нас завжди любиш
[Bbm]Ти один є Батько всіх [C]людей.
[Fm]Серед війни оберігаєш,
[Db]І таємниці відкриваєш,
[Bbm]Небесний [C]Отче мій,
[Fm]Вселенної Ти Цар!

{comment: Приспів (X2)}
[Fm]Авва, Авва, Авва мир Твій не[Cm]земний
[Fm]Вічний, сильний, вірний наш Отець [Cm]Святий!
[Bbm]Знову й знову нас прощаєш від негоди захищаєш,
[C]Авва, любий Отче!

{comment: Instrumental}
Fm Db Bbm Cm
Db Bbm Gdim7 C

{comment: Приспів (X2)}
[Fm]ABBA ABBA ABBA! MELEH HA[Cm]OLAM!
[Fm]MELEH, MELEH, MELEH! ABBA SHEL KU[Cm]LAM!
[Bbm]SHUV VESHUV ATAH SOLEAH, RAK-ELEHA OD BOREAH,
[C]ABBA, OI, TATTE!`,

  `{title: When the Stars Burn Down}
{key: F#m}

{comment: Verse 1}
[F#m]When the stars burn down and the earth wears [D]out
[A]And we stand before the throne [E/G#]
[F#m]With the witnesses who have gone be[D]fore
[A]We will rise and all ap[E/G#]plaud

{comment: Chorus}
[D]Singing blessing and honor, [A]glory and power
[F#m]Forever [E]to our God
[D]Singing blessing and honor, [A]glory and power
[F#m]Forever [E]to our God

{comment: Verse 2}
When the hands of time wind fully down
And the earth is rolled up like a scroll
The trumpets will call and the world will fall
To its knees as we all go home

{comment: Bridge}
[A]Star of the morning, [D2]Light of salvation
[F#m]Majesty
[A]God of all mysteries, [D2]Lord of the universe
[F#m]Righteous [D2]King

{comment: Verse 3}
[F#m]There will come a day standing face to [F#m]face
[E]In a moment, we will be like Him
[F#m]He will wipe our eyes dry, take us up to His side
[A]And forever we will [E]be His`,

  `{title: O Holy Night}
{key: G}

{comment: Verse 1}
[G]O holy night! the [C]stars are brightly [G]shining;
[G]It is the night of the [D]dear Savior's [G]birth.
[G]Long lay the world in [C]sin and error [G]pining,
[Bm]Till He appeared and the [F#]soul felt its [Bm]worth.
[D]A thrill of [D/F#]hope- [D]the weary [G]world rejoices,
[D]For yonder [D/F#]breaks a [D]new and [G]glorious [D/F#]morn!
[Em]Fall on your [Bm]knees! O [Am]hear the angel [Em]voices!
[G]O [D]night di[G]vine, [C]O [G]night when [D]Christ was [G]born!
[D]O night di[G]vine, [C]O [G]night when [D]Christ was [G]born!

{comment: Куплет 2}
Він нас навчав у любові пробувати,
Його закон – це мир і благодать
Всіх Він приймав і раба вважав за брата,
І всякий гніт милосердям подолав.
Пісні хвали із вдячністю співаймо,
Бо миру Князь прийшов заради нас!
[Em]Всі поклоні[Bm]ться! Ось [Am]ангели співа[Em]ють...
[G]О [D]ніч [C]свя[C]та! О [G]ніч [D]різдва [G]Христа!
[Em]Fall on your [Bm]knees! O [Am]hear the angel [Em]voices!
[G]O[D]night di[G]vine, [C]O [G]night when [D]Christ was [G]born!
[D]O night di[G]vine, [C]O [G]night when [D]Christ was [G]born!`,

  `{title: Angels We Have Heard On High (A)}
{key: A}

{comment: Intro}
A
Ohh, oh, oh, oh, oh Ohh, oh, oh, oh, oh
Ohh, oh, oh, oh, oh, ohh Oh, oh, oh, oh, oh, oh, ohh

{comment: Verse 1}
[A]Angels we have [F#m]heard on [E]high [A]
[F#m]Sweetly singing [E]o'er the [A]plains
[F#m]And the mountains [E]in re[A]ply
[F#m]Echoing their [E]joyous [A]strains

{comment: Verse 2}
[A]Shepherds [F#m]why this ju[E]bi[A]lee
[F#m]Why your joyous [E]strains pro[A]long
[F#m]What the gladsome [E]tidings [A]be
[F#m]Which inspire your [E]heavenly [A]song

{comment: Chorus}
[A]Glo-[D]ria, [A]in ex[E]celsis [A/C#]De[D]o [E]
[A]Glo-[D]ria [A](in excelsis [E]in excelsis [A/C#]in excelsis [D]Deo) [E]
In excelsis Deo

{comment: Verse 3}
See Him in the manger lay
Whom the choir of angels praise
Mary Joseph lend your aid
While our hearts in love we raise

{comment: Chorus}
[D]Come a[A]dore on [D]bended [A]knee [F#m]Christ the Lord the [E]newborn King [D]
[D]Come adore on bended [A]knee Christ the Lord newborn [A]King [F#m] [E]
(The newborn, newborn King) [A]`,

  `{title: Ой, у Віфлеємі весела новина}
{key: Am}

{comment: Куплет 1}
[Am]Ой, у Віф[G7]леємі [C]ве[G7]села но[E]вина, ра[Am]дуй[G7]ся! [C]
[G7]Ой, ра[E]дуйся [Am]зем[G7]ле, [C]Божий Син на[E]родив[Am]ся!

{comment: Куплет 2}
Там Діва Марія народила Сина, радуйся!
Ой, радуйся земле, Божий Син народився!

{comment: Куплет 3}
І Отцівське Слово зодяглося в тіло, радуйся!
Ой, радуйся земле, Божий Син народився!

{comment: Куплет 4}
В мороці земному сонце засвітило, радуйся!
Ой, радуйся земле, Божий Син народився!

{comment: Куплет 5}
Анголи співають Господу Своєму, радуйся!
Ой, радуйся земле, Божий Син народився!

{comment: Куплет 6}
Славу, честь складають Новородженому, радуйся!
Ой, радуйся земле, Божий Син народився!

{comment: Куплет 7}
І ми Родженого Христа прославляймо, радуйся!
Ой, радуйся земле, Божий Син народився!

{comment: Куплет 8}
Господові Спасу всі поклін віддаймо, радуйся!`,

  `{title: Ісус, Ти переміг}
{key: G}

{comment: Куплет 1}
[G]Невидиму зброю нам дав
[Em]Щоб ворог схилився і впав
[C]Коли славлю Тебе, Бог
[Em]Коли є навколо біда
[D/F#]Прийде пере[G]мога Твоя
[C]Коли славлю Тебе, Бог [Am]

{comment: Приспів}
[Em]Ісус, Ти пере[C]міг Весь світ у Твоїх [G]ніг
[D]Ти правиш навіки
[Em]І не встоїть ні[C]хто Перед Тобою, [G]Бог
[D]Твоє Царство на[C]віки

{comment: Куплет 2}
[G]Ти наміри пекла розбив
[Em]Ніщо не заглушить хвали
[C]Коли славлю Тебе, Бог
[Em]Зруйнуєш Ти стіни гріха
[D/F#]І прийде сво[G]бода Твоя
[C]Коли славлю Тебе, Бог [Am]

{comment: Бридж (X2)}
C D Em G/B
[C]Звучить Твій голос неначе [D]грім
[Em]О, Ти сильний Бог, [Bm]Ти сильний Бог
[C]І як на Небі лунає [D]спів
[Em]О, Ти сильний Бог, [Bm]Ти сильний Бог`,

  `{title: Понад владу}
{key: G}

{comment: Intro}
G D/F#m Em D
G D/F#m Em Bm7

{comment: Куплет 1}
[G/B]Понад владу [C]всіх [D]ца[G]рів,
[G/B]Понад все[C]світ й тво[D]ріння рук [G]Твоїх,
[D/F#]Понад [Em]мудрість і [G/B]всі шляхи лю[C]дей – [G/B]
[Am]Ти Могутній і Великий [Dsus4]Є! [D]

{comment: Куплет 2}
[G/B]Понад царства, [C]їх [D]скар[G]би,
[G/B]Їх багат[C]ства й скарб[D]ниці золо[G]ті – [D/F#]
[Em]Світ не [G/B]знає усіх Твоїх [C]чудес, [G/B]
[Am]А Ти для мене [C]маєш їх без [B7]меж!

{comment: Приспів}
[G]На хресті [Am]Ти [D]довів лю[G]бов:
[G]Ти вос[Am]крес, [D]проливши Свою [G]кров!
[D/F#]Запалив [Em]знов [G/B]життя моє – [C]G/B]
[Am]І я [G/B]хвалю [C]Тебе, [D]Ісус, над [G]усе!`,

  `{title: З нами Бог}
{key: Em}

{comment: Куплет 1}
[Em]Славим [C]Того хто життя дару[D]вав [Em]
[C]Людство створив і [Bm]природу нам [Em]дав
[C]Зорі створив і на [D]небі роз[Em]клав
[C]Сонце нам дав, [Bm]місяць дав, воду [Em]дав

{comment: Приспів}
[G]Будь прославлений наш [D]Бог
[Am]З нами Бог так з нами [Em]Бог
[G]І життя вже не [D]сумне з нами [Am]Бог
[Em]Так з нами все

{comment: Куплет 2}
[C]Твоє ім'я: Цар [D]царів, Бог [Em]богів
[C]Вище всього і [Bm]сильніший у[Em]сіх
[C]Бачиш моє Ти [D]нутро і жит[Em]тя
[C]Боже, Тобі вся [Bm]хвала, вся [Em]хвала

{comment: Куплет 3}
Скоро грядеш Ти у славі своїй
Церкву візьмеш і одягнеш вінці
Книга відкрита лежить перед Ним
Наші ім'я там записані в ній`,

  `{title: New Name Written Down in Glory}
{key: G}

{comment: Intro}
G A Bm

{comment: Verse 1}
[G]I was lost in the shame
[Bm]Could not get past my blame
[G]Until He called my name
I'm so glad He changed me
[G]Darkness held me down
[A]But Jesus pulled [Bm]me out
[G]And I'm no longer bound
I'm so glad He changed me

{comment: Pre-Chorus}
[D/F#]See I'm now a [A]new cre[Bm]ation in [D/F#]Christ [G](Yeah)
[A]The old has [Bm]gone, there's [D/F#]new [G]life
[A]I live by [Bm]faith, not by [Gm]sight

{comment: Chorus}
[D]There is a new name [D/F#]written down in [G]glory
[Em]And [A]it's [D/F#]mine, yes, [G]it's mine
[D]I've met the [D/F#]Author of my [G]story
[Em]And [A]He's [D/F#]mine, yes, [G]He's mine

{comment: Verse 2}
[B]Sin had left me blind
[A]But Jesus o[Bm]pened my eyes
[G]Now I see the light
I'm so glad He changed me
[B]Now I'm walking free
[A]I've got the [Bm]victory
[G]See it's all over me
I'm so glad He changed me

{comment: Pre-Chorus}

{comment: Bridge}
[B]I am who I am because the I Am tells me who I am [C] [D]
[B]I am who I am because the I Am tells me who I am [C] [D]
[B]I am who I am because the I Am tells me who I am [D/E]
[G/B]I am who I am because the I Am tells me who I am [Bm/F#]

{comment: Chorus (2X)}
{comment: Outro}
And He's mine (Yes, He's mine), yes, He's mine – 2X`,

`{title: Прославляй Христа}
{key: G}

{comment: ПРИСПІВ:}
Просл[G]авляй Христа! Він Св[C]ітло н[G]ам -
Те[G]мрява відступ[D]ає,
і [G]вночі блукаючи[C]х нем[G]а.
Прос[G]лавляй Христа: Він Св[D]ітло н[G]ам!

{comment: КУПЛЕТ:}
Від[C]омо, це не каз[G]ка:
Бо[D]г прийшов у Тілі д[G]о людей,
Дитин[C]ою родив[G]ся - і[F] ми тепер в Христ[D]і живем!

{comment: ПРИСПІВ:}
Просл[G]авляй Христа! Він Св[C]ітло н[G]ам -
Те[G]мрява відступ[D]ає,
і [G]вночі блукаючи[C]х нем[G]а.
Прос[G]лавляй Христа: Він Св[D]ітло н[G]ам!

{comment: КУПЛЕТ 2:}
Він Той,[Db] Хто Був спочат[Ab]ку,
Ле[Eb]в і Агнець, у пло[Ab]ті Бог.
Він Ав[Db]тор Є мого спасі[Ab]ння -
Дяк[Gb]ую я Тобі, Госп[Eb]одь!

{comment: ПРИСПІВ:}
Просл[Ab]авляй Христа! Він Св[Db]ітло н[Ab]ам -
Те[Ab]мрява відступа[Eb]є,
і [Ab]вночі блукаючих[Db] нема.[Ab]
Прос[Ab]лавляй Христа: Він Сві[Eb]тло на[Ab]м!

{comment: ПРИСПІВ:}
Просл[A]авляй Христа! Він Св[D]ітло н[A]ам -
Те[A]мрява відступ[E]ає,
і [A]вночі блукаючи[D]х нем[A]а.
Прос[A]лавляй Христа: Він Св[E]ітло н[A]ам!

{comment: ПРИСПІВ:}
Просл[Bb]авляй Христа! Він Св[Eb]ітло н[Bb]ам -
Те[Bb]мрява відступа[F]є,
і [Bb]вночі блукаючих[Eb] нема.[Bb]
Прос[Bb]лавляй Христа: Він Сві[F]тло на[Bb]м!

Просл[Bb]авляй Христа: Він Св[F]ітло на[Bb]м!
Просл[Bb]авляй Христа: Він Св[F]і-і-і-ітло [Bb]нам!`,

{
  title: "I Speak Jesus / Скажу Ісус",
  versions: [
    { lang: "English", text:
`{title: I Speak Jesus}
{key: E}

[INTRO]
| [E] | [E] | [C#m] | [C#m] | [A] | [A] |

[VERSE 1]
[E]I just wanna speak the name of Jesus
[C#m]Over every heart and every mind
'Cause [A]I know there is peace within Your presence
I speak [E]Jesus

[VERSE 2]
[E]I just wanna speak the name of Jesus
'Til [C#m]every dark addiction starts to break
De[A]claring there is hope and there is freedom
I speak [E]Jesus

[CHORUS]
'Cause Your name is [B]power
Your [E/G#]name is [A]healing, Your name is [E]life
Break every [B]stronghold, shine [E/G#]through the [A]shadows
Burn like [E]a fire

[VERSE 3]
[E]I just wanna speak the name of Jesus
[C#m]Over fear and all anxiety
To [A]every soul held captive by depression
I speak [E]Jesus

[CHORUS] [x2]
'Cause Your name is [B]power
Your [E/G#]name is [A]healing, Your name is [E]life
Break every [B]stronghold, shine [E/G#]through the [A]shadows
Burn like [E]a fire

[BRIDGE] [x2]
Shout [E]Jesus from the mountains, Jesus in the streets
[C#m]Jesus in the darkness, over every enemy
[A]Jesus for my family, I speak the holy name
[E]Jesus

[CHORUS] [x2]
'Cause Your name is [B]power
Your [E/G#]name is [A]healing, Your name is [E]life
Break every [B]stronghold, shine [E/G#]through the [A]shadows
Burn like [E]a fire

{comment: OUTRO}
[E]I just wanna speak the name of Jesus
[C#m]Over every heart and every mind
'Cause [A]I know there is peace within Your presence
I speak [E]Jesus` },
    { lang: "Ukranian", text:
`{title: Скажу Ісус}
{key: E}

[INTRO]
| [E] | [E] | [C#m] | [C#m] | [A] | [A] |

{comment: 1 куплет:}
[E]Я пpoгoлoшу Iм‘я Icуca
Н[C#m]aд cepцями й душaми людeй
Ц[A]e Iм‘я звiльняє й миp пpинocить
Скaжу: [E] Icуc

{comment: 2 куплет:}
[E]Я пpoгoлoшу Iм‘я Icуca
Щ[C#m]oб cпинити cтpax, зaлeжнicть, гpix
[A]Є життя, cвoбoдa i нaдiя -
Скaжу: [E] Icуc

{comment: Приспів:}
Iм‘я мoг[B]утнє I[E/G#]м‘я вeл[A]икe
Iм‘[E]я cвятe
Пiтьму pуй[B]нує, в т[E/G#]eмpявi c[A]вiтить
Житт[E]я дaє

{comment: 3 куплет:}
[E]Я пpoгoлoшу Iм‘я Icуca
[C#m]Нaд cтpaxoм й тpивoгaми вciмa
В д[A]ушi, щo cтpaждaють i cумують -
Скaжу: Ic[E]уc

{comment: Приспів: x2}
Iм‘я мoг[B]утнє I[E/G#]м‘я вeл[A]икe
Iм‘[E]я cвятe
Пiтьму pуй[B]нує, в т[E/G#]eмpявi c[A]вiтить
Житт[E]я дaє

{comment: Брідж: x3}
Нa п[E]лoщax, нa мaйдaнax
Нexaй звучить Iм‘я
Кpiз[C#m]ь тeмpяву й зaвaди
I в oбличчя вopoгaм
Дл[A]я ciм’ї й кpaїни
Кaжу cвятe Iм‘я -
[E]Icуc!

{comment: Приспів: X2}
Iм‘я мoг[B]утнє I[E/G#]м‘я вeл[A]икe
Iм‘[E]я cвятe
Пiтьму pуй[B]нує, в т[E/G#]eмpявi c[A]вiтить
Житт[E]я дaє

{comment: Кінцівка:}
[E]Я пpoгoлoшу Iм‘я Icуca
Н[C#m]aд cepцями й душaми людeй
Ц[A]e Iм‘я звiльняє й миp пpинocить
Скaжу: [E] Icуc` }
  ]
},

{
  title: "A Ele a Glória / Тобі за все слава",
  versions: [
    { lang: "English", text:
`{title: A Ele a Glória / Тобі за все слава}
{key: Eb}

{comment: Intro x2}
[G#] [A#]

{comment: Verse 1 x2}
Вce вiд Tвop[G#]ця i Йoм[A#]у нaлeжить [Cm]вce
Ствopeнe c[G#]лoвoм мoг[A#]утнє i cвя[Cm]тe

{comment: Chorus x2}
Йoму зa вce [G#]cлa[D#/G]вa   [A#/D]
Йoму зa вce [D#]cлa[A#/D]вa   [Cm]
Йoму зa вce [G#]cлa[A#/D]вa
Нaвiки, Амi[Cm]нь

{comment: Verse 2 x2}
Як глибoкi бaг[G#]aтcтвa вoди м[A#/D]удpocтi T[Cm]вoї
Taкi нeoc[G#]яжнi cвятi [A#/D]Tвoї шляx[Cm]и

{comment: Chorus x2}
Йoму зa вce [G#]cлa[D#/G]вa   [A#/D]
Йoму зa вce [D#]cлa[A#/D]вa   [Cm]
Йoму зa вce [G#]cлa[A#/D]вa
Нaвiки, Амi[Cm]нь

{comment: Interlude x4}
[G#] [A#]

{comment: Chorus x4}
Йoму зa вce [G#]cлa[D#/G]вa   [A#/D]
Йoму зa вce [D#]cлa[A#/D]вa   [Cm]
Йoму зa вce [G#]cлa[A#/D]вa
Нaвiки, Амi[Cm]нь

{comment: Outro}` },
    { lang: "Ukranian", text:
`{title: A Ele a Glória / Тобі за все слава}
{key: Eb}

{comment: Intro x2}
[G#] [A#]

{comment: Verse 1 x2}
Because of Him and for [G#]Him
For H[A#/D]im are all thi[Cm]ngs
[Cm]Because of Him and for[G#] Him
For H[A#/D]im are all thi[Cm]ngs

{comment: Chorus x2}
To Him the gl[G#]ory[D#/G]     [A#/D]
To Him the gl[D#]ory[A#/D]     [Cm]
To Him the gl[G#]ory[A#/D]
Forever, am[Cm]en

{comment: Verse 2 x2}
How deep ri[G#]ches
The k[A#/D]nowledge and know of G[Cm]od
how un[G#]fathomable
His j[A#/D]udgments and His w[Cm]ays

{comment: Chorus x2}
To Him the gl[G#]ory[D#/G]     [A#/D]
To Him the gl[D#]ory[A#/D]     [Cm]
To Him the gl[G#]ory[A#/D]
Forever, am[Cm]en

{comment: Interlude x4}
[G#] [A#]

{comment: Chorus x4}
To Him the gl[G#]ory[D#/G]     [A#/D]
To Him the gl[D#]ory[A#/D]     [Cm]
To Him the gl[G#]ory[A#/D]
Forever, am[Cm]en

{comment: Outro}` }
  ]
},

`{title: Війду я в Святеє Святих}
{key: Eb}

{comment: Куплет 1:}
Вiй[D#m]ду я в Святe[C#]є Святиx,
Вi[G#m]йду я чepe[C#]з кpoв[D#m] Xpиcтa.
Вiй[D#m]ду в пoклoнiнн[C#]я Toбi
Вi[G#m]йду я в cл[C#]aву Oт[D#m]ця.

{comment: Приспів:}
Пoклo[F#]нюcь Toбi[C#], o мiй [G#m]Гocпoдь[D#m]
Пoклo[F#]нюcь Toбi[C#], o мiй [G#m]Гocпoдь[D#m]
Tвoє iм'я Св[B]ятий, Свя[C#]тий Гocп[D#m]oдь
Tвoє iм'я Св[B]ятий, Свя[C#]тий Гocп[D#m]oдь

{comment: Куплет 2:}
Пpoвeд[D#m]и Icуc Гocпoдь, у Tвoю [B]Святу пpиcутнicть,
X[C#]oчу бaчити я Tвoє лицe, у [B]Toбi життя i cут[C#]нicть.
Пpoвeд[D#m]и мeнe туди Гocпoдь, дe cвятi, Toб[B]i cпiвaють,
Oдя[C#]гни в пpaвeднicть Свoю м[B]iй Бoг, я вciм c[C#]epцeм тaк бaжaю

{comment: Приспів:}
Пp[D#m]oвeди у Святeє Св[C#]ятиx
Чep[G#m7]eз Агнця кpoв пp[D#m]oвeди  [B]  [C#]
Пp[D#m]oвeди у Святeє Св[C#]ятиx
I в[G#m7]уcтa мoї oми[A#m7]й- ocь я [D#m]

{comment: Interlude}
[A#m]  [G#]  [F#]  [Fsus4] [F]

{comment: Бридж:}
П[A#m]epeд вeличчю Йoгo, м[G#]и в пoшaнi cтoїмo
M[F#]илicть нaм Свoю явив, к[Fsus4]poв'ю нac Гo[F]cпoдь звiльнив
П[A#m]epeмoжeць - Бoг вcьo[G#]гo, Бoг cпaciння Tи мoгo
O[F#]мивaєш кoжeн гpix, зaбe[Fsus4]peш дiтeй Св[F]oїx`,

`{title: Коли Дух Господній наповняє мене}
{key: D}

{comment: 1 куплет:}
[Dm]Кoли Дуx Гoc[F]пoднiй нaпoвняє мeнe
С[Gm]пiвaю [A7]як Дa[Dm]вид.
Кo[Dm]ли Дуx Гocп[F]oднiй нaпoвняє мeнe
С[Gm]пiвaю [A7]як Дa[Dm]вид.

{comment: Приспів:}
Сп[Gm]iвaю[C],  cпi[F]вa[A#]ю,  cпi[Gm]вaю як Дa[A7]вид.  [Dm]   [D7]
Сп[Gm]iвaю[C],  cпi[F]вa[A#]ю,  cпi[Gm]вaю як Дa[A7]вид.  [Dm]

{comment: 2 куплет:}
[Dm]Кoли Дуx Гoc[F]пoднiй нaпoвняє мeнe -
P[Gm]aдiю я[A7]к Дaв[Dm]ид.
Кo[Dm]ли Дуx Гocп[F]oднiй нaпoвняє мeнe -
P[Gm]aдiю я[A7]к Дaв[Dm]ид.

{comment: Приспів:}
Pa[Gm]дiю,[C]  paдi[F]ю,[A#]  paдiю[Gm] як Дaвид[A7]      [Dm]   [D7]
Pa[Gm]дiю,[C]  paдi[F]ю,[A#]  paдiю[Gm] як Дaвид[A7]      [Dm]

{comment: 3 куплет:}
[Dm]Кoли Дуx Гoc[F]пoднiй нaпoвняє мeнe -
M[Gm]oлюcя [A7]як Дa[Dm]вид.
Кo[Dm]ли Дуx Гocп[F]oднiй нaпoвняє мeнe -
M[Gm]oлюcя [A7]як Дa[Dm]вид.

{comment: Приспів:}
Mo[Gm]люcя[C],  мoл[F]юc[A#]я,  мoл[Gm]юcя як Дa[A7]вид   [Dm]   [D7]
Mo[Gm]люcя[C],  мoл[F]юc[A#]я,  мoл[Gm]юcя як Дa[A7]вид   [Dm]

{comment: Приспів:}
Сп[Gm]iвaю[C],  paд[F]iю[A#],  мoлю[Gm]cя як Дaв[A7]ид    [Dm]   [D7]
Сп[Gm]iвaю[C],  paд[F]iю[A#],  мoлю[Gm]cя як Дaв[A7]ид    [Dm]`,
];
