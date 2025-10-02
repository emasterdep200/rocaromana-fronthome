
echo "Pulling Code"
git pull

echo "Build Next App"
npm run build

echo "Restart App PM2"
pm2 restart 0
