CHALO RAIL - Test aur Live karne ke steps
================================================

Files:
  index.html   -> website ka page
  api/live.js  -> server, jo RailRadar se live data laata hai
  api/pnr.js, api/seats.js, api/between.js, api/stations.js, api/classes.js, api/prediction.js, api/_rr.js
                -> PNR status, trains search aur seat availability ke liye
  server.js    -> apne computer par test karne ke liye
  key.txt      -> isme apni API key daalni hai (sirf computer wale test ke liye)

PEHLE: Free API key lo
  1. railradar.in par free account banao
  2. railradar.in/developers par jaakar API key banao (rr_live_ se shuru hogi)

----------------------------------------------------
TAREEKA A: Laptop/Computer par test (5 minute)
----------------------------------------------------
  1. nodejs.org se Node.js (LTS) install karo
  2. Zip ko unzip karo (Extract All)
  3. key.txt kholo, usme likha hua hata kar apni key paste karo, save karo
  4. Us folder mein terminal kholo:
       Windows: folder ke address bar mein "cmd" likh kar Enter
       Mac: folder par right-click > New Terminal at Folder
  5. Ye likho aur Enter dabao:
       node server.js
  6. "Chalu ho gaya!" aayega. Browser mein kholo:
       http://localhost:3001
  7. Train number (jaise 02569) daalo aur "Dekho" dabao
  Band karne ke liye terminal mein Ctrl + C dabao.

  PHONE PAR KHOLNA HO (laptop wala server):
    - Phone aur laptop ek hi Wi-Fi par hon
    - Terminal mein "Phone par kholo" wala link dikhega, jaise
        http://192.168.1.5:3001
      wahi link phone ke Chrome mein kholo
    - Windows "Allow access" pooche toh Allow dabao

----------------------------------------------------
TAREEKA C: Sirf Android phone par (bina laptop)
----------------------------------------------------
  1. F-Droid se "Termux" app install karo
  2. Zip ko phone ke Download folder mein unzip karo
     (folder ka naam: train-kahan-hai)
  3. Termux kholo aur ek-ek line likh kar Enter dabao:
       termux-setup-storage
       pkg install nodejs -y
       cd ~/storage/downloads/train-kahan-hai
       node server.js
  4. Chrome mein kholo: http://localhost:3001
  (iPhone par ye tareeka nahi chalta)

----------------------------------------------------
TAREEKA B: Phone se, internet par live (Vercel)
----------------------------------------------------
  1. github.com par account banao, "New repository" banao
  2. index.html upload karo
  3. "Add file > Create new file" mein naam likho: api/live.js
     aur live.js ka code paste karke save karo.
     Isi tarah api/ folder ki baaki saari files (pnr, seats, between,
     stations, classes, prediction, _rr) bhi banao
     (server.js, key.txt, package.json upload mat karna)
  4. vercel.com par "Continue with GitHub" se login karo
  5. "Add New > Project" mein apni repository chuno
  6. Environment Variables mein:
        Name:  RAILRADAR_API_KEY
        Value: aapki key
  7. "Deploy" dabao. 1 minute mein aapka link mil jayega.

DHYAN RAKHO
  - key.txt kabhi kisi ko mat bhejna, GitHub par bhi mat daalna.
  - Error aaye toh terminal/screen ka screenshot bhejo.
