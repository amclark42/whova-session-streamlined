# Whova Session Streamlined

This is a user script — a Javascript file which will make some changes to a session in the Whova website. I wrote it because I was having a hard time focusing during a [session at Balisage 2023](https://balisage.net/2023/Program.html). The loud, hard-to-dismiss notifications were especially hard to ignore. This script does a few things to put more focus on the Zoom window:

1. Hides the left- and right-hand sidebars by default.
2. Adds buttons which toggle the sidebars open.
3. Adds a button which will hide all(?) notifications on the page.
4. Applies some CSS tweaks to the web page structure.


## Caveats

I've only tested this script on Chrome, on a laptop. (Whova + Zoom works best in Chromium browsers. As much as I prefer Firefox, I didn't care to bash my head against that particular restriction.)

I have not tested this script on mobile. I have not tested this on any conference besides Balisage.

I may not be willing or able to fix this script after August 4th, 2023. **Bug reports and pull requests are welcome at any time, however** — even if I can't fix it, you may be able to help the next person who comes along!


## How to install the script

1. Install a userscript manager. I used [Tampermonkey for Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en).
2. Open the [Whova Session Streamlined script](https://raw.githubusercontent.com/amclark42/whova-session-streamlined/main/whova-session.user.js). 
3. Your userscript manager should open. Look the script over and if it seems good to you, "Install" it.
4. Once the script is installed, it will run automatically whenever you enter a Whova session. For example, a page with a URL like this: `https://whova.com/portal/webapp/EVENT_NAME/Agenda/SESSION_KEY`
5. To disable the script, customize it, etc., use your userscript manager extension.
