(function() {
    const allVideoData = [];

    function scrapeVideo(videoId) {
        const videoContainer = document.querySelector(`#column-item-video-container-${videoId}`);
        
        if (videoContainer) {
            const usernameElement = videoContainer.querySelector('[data-e2e="explore-card-user-unique-id"]');
            const username = usernameElement ? usernameElement.innerText : 'Not Found';

            const likesElement = videoContainer.querySelector('[data-e2e="explore-card-like-container"] span');
            const likes = likesElement ? likesElement.innerText : 'Not Found';

            const videoDescElement = videoContainer.querySelector('img[alt]');
            const videoDescription = videoDescElement ? videoDescElement.alt : 'Not Found';

            
            const views = "Not available in Explore";

            // get song info from description
            let songName = 'Not Found';
            let songAuthor = 'Not Found';

            if (videoDescription && videoDescription.includes(" with ")) {
                const parts = videoDescription.split(" with ");
                if (parts.length > 1) {
                    const songPart = parts[1];
                    // SONG NAME
                    songName = songPart.replace(/’s original sound/i, '').trim();

                    // AUTHOR
                    const match = songPart.match(/^(.*?)’s/);
                    if (match) {
                        songAuthor = match[1].trim();
                    }
                }
            }

            return { username, likes, views, videoDescription, songName, songAuthor };
        } else {
            console.log(`I could not find the video with the ${videoId} id.`);
            return null;
        }
    }
    
    function sendToGoogleSheets(data, webhookUrl) {
        if (!Array.isArray(data) || data.length === 0) {
            console.error("There is no data to send.");
            return;
        }

        const payload = JSON.stringify(data);
        
        fetch(webhookUrl, {
            method: 'POST',
            body: payload,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.text())
        .then(result => console.log('Éxito:', result))
        .catch(error => console.error('Error:', error));
    }

    
    for (let i = 0; i <= 15; i++) {
        const videoData = scrapeVideo(i);
        if (videoData) {
            allVideoData.push(videoData);
        }
    }
    
    const transformedData = allVideoData.map(item => {
        return {
            user: item.username,
            like: item.likes,
            view: item.views,
            description: item.videoDescription,
            song: item.songName,
            songAuthor: item.songAuthor
        };
    });
    
    const PROXY_URL = "http://localhost:3000/import-data";
    sendToGoogleSheets(transformedData, PROXY_URL);
})();