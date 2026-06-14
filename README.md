# Mii Clicker - Local Version
This is a preserved and playable version of **Mii Clicker** (originally at **[miis.whatastupididea.com](https://miis.whatastupididea.com)**), archived before its shutdown on February 20th, 2026 at roughly 10:01:10 PM EST.
- **Mii Clicker** was originally created by [@dwyazzo90](https://github.com/dwyazzo90) (David Joaq) as a way to test BlueSky authentication/implementation.
- Mii rendering API is by [@ariankordi](https://github.com/ariankordi) and can be found at **[mii-unsecure.ariankordi.net](https://mii-unsecure.ariankordi.net)**.
- This local version was preserved for archival purposes, and is not affiliated with **[Project Rosé](https://github.com/Project-Rose)** or anyone mentioned here.

## Prerequisites
You need **Python**/**Python3** installed (which comes pre-installed on macOS and most Linux distros; but its downloadable at **[python.org](https://python.org)** for Windows) in order to run the server on your machine.

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
- ✓ - Home page, along with its easter eggs
- ✓ - All SFX and background music
- ✓ - Clicker game and its functionality
- ✓ - Leaderboard viewing/submitting (includes post data if submitted)
- ✓ - All submitted scores and posts made from the original server (provided in Project Rosé's Discord server by David himself)
- ✓ - Submitting Miis to be used from files or Nintendo/Pretendo Network IDs, which includes the Mii rendering API
- ✕ - "People have played" number updates (uses preset number for all the currently stored records, haven't figured out how to update that yet)
- ✕ - Actual BlueSky authentication (it would be a hassle to figure it out myself)

## Notes
- Rendering Miis still works because the original site uses an external API (see fowel.js for how its implemented), and requires an internet connection to properly use the Mii data.
- Your own scores are saved in your browser's `localStorage` under `mii_clicker_local_records`, and will persist between browser sessions.
- BlueSky authentications are faked, and will go into your browser's cookies. DO NOT type real login details, just in case you get hacked!
- To see the full list of records and posts, go to mock-api.js and find the `_ALLTIME_RECORDS` variable.

## Fun Facts
- This game was first announced on Februrary 1st, 2026 at 11:15:47 PM EST, but the database has entries starting from January 30th, 2026 at 11:45:08 PM EST.
- Over 856 entries were logged in the final database of scores.
- There was only one YouTube video made on this game before its closure. Check it out [here](https://www.youtube.com/watch?v=CNEpVKelteU).
