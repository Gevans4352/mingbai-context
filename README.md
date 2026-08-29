⋆ 明白 · MÍNGBAI ⋆

not another translator. a decoder.

────────────────────────

so google translate will tell you 人的命，天注定 means "a person's fate is determined by heaven." cool. thanks. but WHY did my friend just send me that after failing an exam. what is the VIBE here. that's the gap míngbai lives in.

paste a chinese phrase, idiom, meme, whatever internet slang you saw on xiaohongshu or weibo, and instead of a flat dictionary definition you get the actual breakdown: literal meaning, natural meaning, pinyin, the tone (is this dramatic? sarcastic? memeable? wholesome?), a real "here's when you'd actually hear this" example, and the cultural context behind it. flip a toggle and the whole explanation switches voice, gen z or formal, your call.

built this while bored, teaching myself mandarin, refusing to build another to do list app.

☾ what it does

paste a phrase and get:
- pinyin
- literal translation
- natural english meaning
- tone tags (chosen from a fixed set so the ui stays consistent, not ai chaos)
- an actual example of when someone would say it
- short cultural context, kept snappy, not a wikipedia essay
- register toggle: gen z voice or formal voice, changes the explanation AND the whole interface theme
- everything you decode auto saves to your history once you're logged in
- a profile page that's basically an infobox of your own decoding journey

⚜ tech stack

frontend
- react + typescript, built with vite
- react router for navigation
- plain css, no tailwind, no styled components, hand rolled design tokens because i wanted to actually understand what i was doing
- custom fonts doing the heavy lifting: bebas neue for headlines, archivo expanded for the chinese text specifically, space grotesk for body, courier prime for labels

backend
- node, express, full es modules, no commonjs in sight
- postgresql via supabase
- auth built from scratch, jwt stored in httponly cookies, never localstorage, because anything js can read, malicious js can also read
- google gemini api doing the actual linguistic and cultural analysis

✦ design

editorial, not cutesy. cream and ink base, burgundy and warm gold accents, hard black borders, squared cards not rounded pills, drop shadows that actually shift on hover instead of just glowing softly. two modes tied to one single toggle: formal is the restrained magazine version, gen z is the same magazine gone a little feral at night with darker decorative symbols scattered near headings.

no leopard print anywhere anymore. RIP leopard print. it was a mood, then it was too much, then it was gone.

𖹭 running it locally

backend
```
cd backend
npm install
```
drop your own .env with a DATABASE_URL and GEMINI_API_KEY and JWT_SECRET, then
```
node index.js
```

frontend
```
npm install
npm run dev
```

that's it. two terminals, one app.

⋆ what's still coming

- image and screenshot upload with ocr, so you can just paste a screenshot of a meme instead of typing it out
- a proper 梗 mode for pure internet meme decoding
- small cultural term tags like 春节 and 红包 linked to relevant phrases, kept connected to language, not a whole encyclopedia
- rabbitmq, eventually, purely because i want to learn it and this felt like the right project to learn it on

────────────────────────

built by feranmi. still learning mandarin. still bored sometimes. this is what happens when both are true at once.
