# sound_board



# deployment steps: static web
```cmd
ls -1 audio_files | awk 'BEGIN{print "["}{printf "%s\"audio_files/%s\"", sep, $0; sep=","}END{print "]"}' > sounds.json
```

# force refresh after deployment
```
Ctrl + F5
```

<!-- Run App
npm install express
node server.js -->