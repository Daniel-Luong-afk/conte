## 2026-04-03 - Chose Clerk over Auth.js and custom auth

**Context:** Needed an authentication system for Conte

**Alternatives considered**: Auth.js (Open-source), Build from scratch

**Decision:**: Since an authentication system isn't the main focus of this project but the translation pipeline is, Clerk is chosen as the free version has covered all the needed features for this project. Other alternatives such as Auth.js or building one from scratch were considered, but Auth.js needs to be self-hosted and has much to configure, while building one from scratch needs too many factors to consider, like security problems such as timing attacks where bad actors can slowly guess the correct password based on the timing of password comparison or XSS attacks where they can steal JWT from Local Storage if not stored properly. The problems for Auth.js and building one from scratch are addressed automatically by Clerk, which gives us a UI, handles security problems and removes the need to spend time on configuration; it also gives us the ability to integrate with other accounts with OAuth providers. The only main problem of Clerk, which is vendor locking, has been mitigated by not having it as the main ID for users but just a column in it. This design will reduce most of the time and resources needed should one want to change a vendor or self-host.
