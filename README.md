# Software Engineering Talent Tree
Are you a software engineer? Do your friends, colleagues, acquaintances or just random people
on the Internet keep asking you the same question: *What language should I learn*? Are you or
they a hardcore RPG fan? **Then this is the right place for you!**

Software Engineering Talent Tree is the ultimate (well, one day it will be) Software Engineering
Talent Tree inspired by old school Role Playing Games.

## Link?
LINK HERE

## What's next?
I have tons of ideas:
* More Professions and Talents (Game developer, DevOps Engineer, Embedded Developer, Mobile Developer, etc..)
* Incorporate Stats/Properties system to test different build paths (i.e. How likely are you to be employed by going this path):
    * Employability - how likely are you to be employed if you learn this Skill
    * Endurance - How hard or complex it is to acquire this skill
    * Hipsterims - How "cool" or popular this skill is
    * And more..
* Incorporate transition paths. For example "I am a frontend engineer who knows X, Y, Z.
Where to I can progress now?". Might be Graph similar to [Path of Exile planner](https://poeplanner.com/)
* Small UI/UX enhancements such as:
    * Unlearn skill
    * Share your skill path via unique URL

Of course your help is very much welcome! Keep reading to learn how you can help.

## I want to help
Thank you! Any help is needed whether its graphic, design, programming, ideas or even sharing!

### How it all works?
The heart of the entire system is in `Skill.ts` file. This file defines all the possible skills
and dependencies between them. If you want to introduce a new skill - do it there.

Inside `professions` directory we have the basic `Profession.ts` file that defines a Profession
and its talents. Profession is the equivalent of Class in many games. So Mage, Hunter, Berserk are all Classes and Web Developer, DevOps Engineer, Game Developer
are all Professions. Then we have Talent. Talent is the equivalent of a talent or development
branch inside a Profession. In RPG if you for example a Mage (this is your class) then your talents
might be Arcane, Fire or Frost. The same in real world. If you are a Web Developer (this is your profession)
your Talents might be Frontend Developer, Backend Developer and etc.

Each Profession is defined in its own file inside `professions` directory (you can take a look at 
`WebDeveloper.ts`). Professions consist of Talents and Talents in turn consist of `SkillLevel`s.
A skill level is a collection of skill you can learn and in order to progress to the next level
you have to learn all `requires` skills from your current level in addition to the minimum required
skills in order to progress.

All application logic is written inside `components/ApplicationContainer.tsx` with React.
Styles are in `styles` and icons are in `icons`.
