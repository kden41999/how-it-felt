# How It Felt - Everything You Need Before the Presentation

## The one-line version

How It Felt is an interactive museum of ordinary experiences from 2026, built for the people of 3026. Each exhibit is a small playable simulation, so the future does not read about our lives, it briefly lives them.

## The idea in your own words

Most messages to the future try to say something big, and they all blur together. What actually vanishes over a thousand years is the texture of daily life, not the big statements. A museum in 3026 can keep my phone. It cannot keep the feeling of watching three typing dots for ten minutes and getting "ok". So this project preserves feelings instead of objects, and the only way to preserve a feeling on a webpage is to make the visitor feel it. That is why every exhibit is played, not read.

## The three exhibits and what to say about each

**Exhibit 001, The Typing Bubble.** A chat where the other person types, stops, and starts again. After a long wait the reply is just "ok". Clicking sends another "?" and makes the wait longer, which is exactly what we all did. Say: this is about waiting, and about how a tiny animation could hold your whole attention.

**Exhibit 002, One Percent.** The battery is at 1%. Every cursor movement drains it faster. Holding completely still is the only way to make it last. When it dies, the screen fades and says you never saw the reply, and tells you how many seconds you lasted. Say: this is battery anxiety turned into a rule. Stillness as the only defense.

**Exhibit 003, Rain on Glass.** Rain falls over blurred city lights. Dragging wipes the glass so you can see the lights more clearly, and the rain keeps falling. Filtered pink noise plays as rain sound. Say: this is the quiet one. Watching rain used to be a complete activity, and this exhibit asks whether anyone in 3026 will still do nothing.

## How the code works, in case they ask

- index.html is the gallery page, styled like an archival catalog, plus the about section with the project description.
- sketch.js holds everything else. There is a base class called Exhibit with start, stop, draw, mousePressed, and mouseDragged methods.
- Each exhibit is its own class that extends Exhibit: TypingBubble, OnePercent, RainOnGlass. That is the object-oriented requirement.
- The gallery opens one exhibit at a time and calls its methods from the main draw loop. Closing an exhibit stops its sound and returns to the collection.
- Sound is p5.sound. Small oscillator blips play when a message arrives. Rain is pink noise through a low pass filter, started on enter and faded on exit.
- The canvas is 900 by 560, plain x and y coordinates, no vectors, only course syntax.

## The script, about 2.5 minutes

**Slide 1, cover, 15 seconds.**
Hi, I'm Aitole. My project is called How It Felt. It's an interactive museum of ordinary experiences from 2026, built for the people of 3026. It's a website with three small exhibits, and the whole thing is already playable.

**Slide 2, the idea, 35 seconds.**
The starting point was a frustration. Most messages to the future try to say something big, love, hope, warnings, and they all end up sounding the same. What actually disappears is the texture of being alive. People in 3026 will have our phones in their museums. They will never know what it felt like to wait eleven minutes for a reply and then receive "ok". So in this project, you don't read about the feeling. You have the feeling, briefly. Each exhibit is a small simulation, not a text.

**Slide 3, the exhibits, 45 seconds.**
Three exhibits. The Typing Bubble is about waiting. You watch the dots, you can click to send another question mark, and it only makes the wait longer. One Percent is about battery anxiety. Every movement of your cursor drains the battery faster, so the only way to survive is to hold completely still. Rain on Glass is the quiet one. You drag to wipe the glass, and the rain keeps coming, because sometimes watching rain was a complete activity. These are all running live right now.

**Slide 4, references, 25 seconds.**
Three references. Neal.fun showed me that a browser can be a museum and that you explain things by letting people do them. Pippin Barr's v r 3 is a gallery of ordinary water, and it taught me that the mundane becomes meaningful when you frame it as a collection. And the Museum of Broken Relationships is the physical version of my idea. Objects survive. What needs preserving is the feeling around them.

**Slide 5, how it works, 25 seconds.**
Technically, it's p5.js. There's one shared Exhibit class, and each exhibit extends it with its own draw and interaction methods. Sound is oscillator blips for messages and filtered noise for rain. Next week I'm adding two more exhibits, the loading bar stuck at 99, and one more I want to choose with classmates during testing. Presentation on December 8.

**Slide 6, closing, 10 seconds.**
That's it. The message to 3026 is: you had to be there, until now. The site is live at this link if anyone wants to feel it for themselves. Thank you.

## Questions they might ask, and your answers

**Is this original?** Yes. The ingredients have ancestors, and that is the point of the references slide. A browser as a museum comes from Neal.fun, mundane things framed as a collection comes from Pippin Barr, objects carrying feelings comes from the Museum of Broken Relationships. The specific combination, playable simulations of ordinary 2026 feelings for the year 3026, is mine.

**Why not just write letters to the future?** Because a letter describes a feeling and a simulation produces it. Reading about waiting gives you information. Actually waiting gives you understanding.

**Is the interaction a gimmick?** No, it is the content. The piece only works if you feel a little impatient, or a little anxious, or a little calm.

**What are the next exhibits?** 004 is the loading bar that reaches 99 and waits. 005 I want to choose with classmates during testing, because the best exhibits come from experiences everyone recognizes.

**What is in your time capsule?** Ordinary objects, a dead charging cable and a transit card, with no explanation. The cable is the physical twin of One Percent. That is the thesis of the whole project: objects without feelings are just objects.

**Does it work on phones?** It is built for a browser on a laptop. Mouse interactions are the medium, since holding still and dragging are the two main gestures.

## Checklist before you present

- Open kden41999.github.io/how-it-felt/ once and play all three exhibits so nothing surprises you
- Read the script out loud twice, once tonight and once before class
- Deck: HowItFelt_Proposal.pptx, presenter notes have the script per slide
- Time capsule: sealed, name on it, contents secret
- Blog post: description, prototype image, and the deck link, submitted on Classroom
- Deck link in the section Slack channel at least one hour before class
