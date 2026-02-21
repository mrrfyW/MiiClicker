# Mii Clicker - Local Version
This is a preserved and playable version of **Mii Clicker** (originally at [miis.whatastupididea.com](https://miis.whatastupididea.com)), archived before its shutdown on February 20th, 2026 at roughly 10:01:10 PM EST.
- **Mii Clicker** was originally created by [@dwyazzo90](https://github.com/dwyazzo90) (David Joaq).
- Mii rendering API is by [@ariankordi](https://github.com/ariankordi) and can be found at **[mii-unsecure.ariankordi.net](https://mii-unsecure.ariankordi.net)**.
- This local version was preserved for archival purposes, and is not affiliated with **[Project Rosé](https://github.com/Project-Rose)**. If either David or Arian see this, feel free to contact me on Discord to tell me if this is okay to keep up or not. If it is okay, feel free to tell me what license this should have.

## Prerequisites
You need **Python**/**Python3** installed (which comes pre-installed on macOS and most Linux distros; but its downloadable at **[python.org](https://python.org)** for Windows) to run the server.

## Steps to Run
Step 1: Open the Terminal/Command Prompt
- **Windows**: Right-click in the folder -> "Open in Terminal" (or type "cmd" in the directory bar)
- **macOS**: Right-click the folder -> "New Terminal at Folder"
- **Linux**: Open terminal and `cd` to this folder

Step 2: Start the Server
- Run this command: `python3 server.py`

Step 3: Open the Game
- Open your browser and go to: **[http://localhost:8080](http://localhost:8080)**

Press `Ctrl+C` in the terminal to stop the server when done, or end the Python task in task manager.

## What Works/Doesn't Work
- ✓ - Home page, with easter eggs and fake BlueSky authentication
- ✓ - All SFX and background music
- ✓ - Clicker and its functionality
- ✓ - Leaderboard viewing/submitting (includes post data)
- ✓ - All submitted scores and posts made from the original server (provided in Project Rosé's Discord server by David himself)
- ✓ - Mii rendering via the API
- ✓ - Mii data uploads from files or Nintendo/Pretendo Network IDs
- ✕ - "People have played" number updates (uses preset number for all the currently stored records, haven't figured out how to update that yet lol)

## Notes
- Rendering Miis still works because the original site uses an external API (see fowel.js), and requires an internet connection to properly use the Mii data.
- Your own scores are saved in your browser's `localStorage` under `mii_clicker_local_records`, and will persist between sessions.
- Fake BlueSky authentications will go into your browser's cookies. Don't type any real login details, just in case you get hacked!
- To see the full list of records and posts, go to mock-api.js and find the `_ALLTIME_RECORDS` variable.

## Fun Facts
- This game was first announced on Februrary 1st, 2026 at 11:15:47 PM EST, but the database has entries starting from January 30th, 2026 at 11:45:08 PM EST.
- Over 856 entries were logged in the final database of scores.
- There was only one YouTube video made on this game before its closure. Check it out [here](https://www.youtube.com/watch?v=CNEpVKelteU).
