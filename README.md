# Mii Clicker - Local Version
This is a preserved and playable version of **Mii Clicker** (originally at `miis.whatastupididea.com`), archived before its shutdown on February 20th, 2026 at roughly 10:01:10 PM EST.

---

## Prerequisites
You need Python3 installed (which comes pre-installed on macOS and most Linux distros; but its downloadable at https://python.org for Windows) to run the server.

## Steps to Run
Step 1: Open the Terminal/Command Prompt
- **Windows**: Right-click in the folder -> "Open in Terminal" (or type "cmd" in the directory bar)
- **macOS**: Right-click the folder -> "New Terminal at Folder"
- **Linux**: Open terminal and `cd` to this folder

Step 2: Start the Server
- Run this command: **python3 server.py**

Step 3: Open the Game
- Open your browser and go to: **http://localhost:8080**

Press `Ctrl+C` in the terminal to stop the server when done.

---

## What Works
- Home page, with easter eggs and fake BlueSky authentication
- All SFX and background music
- Clicker and its functionality
- Leaderboard viewing/submitting (includes post data)
- All submitted scores and posts made from the original server (courtesy of David himself)
- Mii rendering via the API
- Mii data uploads from files or Nintendo/Pretendo Network IDs

## What Doesn't Work
- "People have played" number updates (uses preset number for all the currently stored records, haven't figured out how to update that yet lol)

---

## Notes
- Rendering Miis still work because it uses an external API at `mii-unsecure.ariankordi.net`, and requires an internet connection to work properly.
- Your own scores are saved in your browser's `localStorage` under `mii_clicker_local_records`, and will persist between sessions.
- Fake BlueSky authentications will go into your browser's cookies. Don't type any real login details, just in case you get hacked!
- To see the full list of records and posts, go to mock-api.js and find the `_ALLTIME_RECORDS` variable.

---

*Mii Clicker was created by David Joaq (@dwyazzo90). Mii rendering API is by Arian Kordi (@ariankordi) and can be found at (mii-unsecure.ariankordi.net).*  
*This local version was preserved for archival purposes, and is not affiliated with Project Rosé.*
