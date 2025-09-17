# Tiktok-Web-Scrapper
---

# TikTok Scraper

This is a JavaScript scraper designed to extract user data from Tiktok Explorer page and automatically send it to a Google Sheet. The script is intended to be run in the browser's developer console.

---

### **How It Works**

The core of the process involves three key components:

1.  **Browser Scraper**: The main JavaScript code runs on a TikTok page, scraping user information, likes, and video descriptions.
2.  **Node.js Proxy Server**: A local server that acts as an intermediary. It receives data from the scraper and forwards it to Google Sheets, bypassing browser security restrictions (CORS).
3.  **Google Apps Script Webhook**: A script in Google Sheets that listens for data sent by the proxy server and populates the spreadsheet with the received information.

---

### **Code Functions**

The repository contains three main code files or snippets, each with a specific role:

#### **`scraper.js` (Browser Script)**

This is the script you run in your browser's console. It's responsible for the data extraction.

* `scrapeVideo(videoId)`: Scrapes a single video element from the DOM using its ID. It extracts the username, number of likes, video description, and song information. It returns an object with this data or `null` if the video is not found.
* `sendToGoogleSheets(data, webhookUrl)`: Takes the scraped data and the URL of the proxy server as arguments. It uses the `fetch` API to send the data as a JSON object to the proxy.

#### **`server.js` (Node.js Proxy Server)**

This is the server-side code that handles the communication between the browser and Google Sheets.

* **POST `/import-data`**: This is the main endpoint. It listens for incoming data from the browser script. It then uses the `axios` library to make a `POST` request to the Google Apps Script webhook, sending the data and bypassing any CORS errors.

#### **`google_apps_script.js` (Google Apps Script)**

This code runs on Google's cloud and directly interacts with your spreadsheet.

* `doPost(e)`: This is the trigger function for the webhook. It automatically runs when a `POST` request is received. It parses the incoming JSON data and appends it as a new row in the active Google Sheet. The script is configured to add headers only if the sheet is empty, preventing duplication on subsequent runs.
