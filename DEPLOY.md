# Publishing to guillermovaldivia.com

You bought the domain through Vercel, so there's no DNS setup to do. Vercel handles the records and the HTTPS certificate for you.

## 1. Put the code on GitHub

1. Create an empty repository on github.com (for example `portfolio`). No README.
2. In your project folder:

```bash
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git push -u origin main
```

(If the folder is already a git repo, just `git add .`, `git commit`, `git push`.)

## 2. Deploy on Vercel

1. vercel.com → **Add New… → Project** → pick the `portfolio` repo → **Import**.
2. Leave the settings as detected (Next.js) → **Deploy**.
3. You'll get a working link like `portfolio-xyz.vercel.app`. Open it and check everything.

## 3. Connect guillermovaldivia.com

1. In the project: **Settings → Domains**.
2. Type `guillermovaldivia.com` → **Add**. Because the domain is in your Vercel account, it connects right away.
3. When asked, also add `www.guillermovaldivia.com` and choose **Redirect to guillermovaldivia.com**, so both addresses work.
4. Wait for the green **Valid Configuration** check. Usually a minute or two. HTTPS is automatic.

## 4. From now on

Every `git push` to `main` updates the live site in about a minute.
To try something without touching the live site, push to another branch. Vercel gives you a private preview link.

## Domain renewal

Vercel domains renew yearly. In your Vercel account, check **Domains → guillermovaldivia.com** and make sure auto-renew is on and a card is on file.
