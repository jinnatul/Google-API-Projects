
<p align='center'>
  <img src='https://isd-soft.com/wp-content/uploads/2017/04/Accessing-Google-APIs-using-Service-account-in-Node.JS_Logo.png' height='300' weight='550'>
</p>

### Google Drive ([Code here](https://github.com/jinnatul/Google-API-Projects/tree/master/Drive))
  - File Upload
  ```js
    * Response
    { 
      "id": "1LuMlaNIBX6IRIw6QhY1FF4CV4Nom072B" 
    }
  ```
  - File Find by ID
  ```js
    * Response (Custom)
    {
      "id": "1LuMlaNIBX6IRIw6QhY1FF4CV4Nom072B",
      "name": "me.jpg",
      "mimeType": "image/jpeg",
      "webViewLink": "https://drive.google.com/file/d/1LuMlaNIBX6IRIw6QhY1FF4CV4Nom072B/view?usp=drivesdk",
      "size": "410606"
    }
  ```


### Google Gmail ([Code here](https://github.com/jinnatul/Google-API-Projects/tree/master/Gmail))
  - Send Email
  ```js
    * Request Body
    { 
      "from": 'morolswediu@gmail.com', 
      "to": 'anyone@gmail.com', 
      "subject": 'Send Email', 
      "message": 'Email send successfully ✌️'
    }

    * Response (Custom)
    { 
      "status": 200, 
      "message": 'OK' 
    }
  ```