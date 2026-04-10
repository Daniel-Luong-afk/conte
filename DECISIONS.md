## 2026-04-03 - Chose Clerk over Auth.js and custom auth

**Context:** Needed an authentication system for Conte

**Alternatives considered**: Auth.js (Open-source), Build from scratch

**Decision:**: Since an authentication system isn't the main focus of this project but the translation pipeline is, Clerk is chosen as the free version has covered all the needed features for this project. Other alternatives such as Auth.js or building one from scratch were considered, but Auth.js needs to be self-hosted and has much to configure, while building one from scratch needs too many factors to consider, like security problems such as timing attacks where bad actors can slowly guess the correct password based on the timing of password comparison or XSS attacks where they can steal JWT from Local Storage if not stored properly. The problems for Auth.js and building one from scratch are addressed automatically by Clerk, which gives us a UI, handles security problems and removes the need to spend time on configuration; it also gives us the ability to integrate with other accounts with OAuth providers. The only main problem of Clerk, which is vendor locking, has been mitigated by not having it as the main ID for users but just a column in it. This design will reduce most of the time and resources needed should one want to change a vendor or self-host.

## 2026-04-10 - Switched from DeepL + GPT to DeepSeek + Qwen

**Context:** Needed an AI translator for the novel

**Alternatives considered**: DeepL + GPT

**Decision:**: Originally, the plan was to stick with DeepL + GPT for glossary, but abandoned after careful consideration because the most important thing when translation fiction work in general is the surrounding context, which LLM is superior when compared with traditional translation with DeepL or google translate, and because the translation languages focus of this project is Japanese, Chinese and Korean. DeepSeek is chosen because it's dataset is geared towards Chinese and its training data includes a large proportion of the novel content in the web, making it extremely suitable for translation Chinese, as for the other 2 languages, Qwen is selected, specifically the MT (Machine Translation) where it is ranked among the top when translation asian novels. and by switching to DeepSeek from GPT, cost drops from ~$2.50/million tokens with GPT-4o to ~$0.14/million with DeepSeek, which saves significantly on cost, furthermore, the character bible and glossary when translating are identical across all chapter, so the cached prefix drops the cost by 40-60% on long novels
