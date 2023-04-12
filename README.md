# UrbanSC2006

Updated as of 13/4/23

<b><h2>
Welcome to Urban, the ultimate running and cycling tracking app! <br/>
 With this app, you can easily monitor and analyze your outdoor workouts.</h2></b>

<b><h3>Notable Tech Stack</h3></b><br/>
Our app is built using MongoDB, React Native, Express, Node, and Expo.<br/>
MongoDB, a popular NoSQL database, is used to store all of our user and session data.<br/>
React Native, a powerful JavaScript framework, provides a modern and intuitive user interface, allowing users to quickly view and manage their workout sessions. <br/>
Express and Node are used on the backend to handle all of the app's requests and manage data flow between the app and the database.<br/>
Expo enables us to develop and deploy cross-platform mobile applications. This means that our app runs seamlessly on both iOS and Android devices, allowing you to track your workouts no matter what device you use.

<b><h3>Start Up Guild</h3></b>
1. Open 2 terminals, 1: cd api, 2: cd urban
2. Run yarn command on both!

3. Go to .env file under api and input your MongoDB Connection String
4. Go to config.js file under urban and input your Google Maps API Key and Base URL
5. Run node index.js on terminal 1 (ensure you have node installed), and yarn start on terminal 2
6. Use expo app (android) or use camera (ios) to scan the QR code generated

<b><h2>Functionalities:</h2></b>
<b><h3>Login/Register</h3></b><br/>
Users can create an account (Fetch API) by inputting an email, username, and password (hashed using bcrypt), a new User will be created in db (+ generate jwt).<br/>
Users can login (Fetch API) using their registered email and password.
<p float="left" align="middle">
<img src="https://user-images.githubusercontent.com/45598522/231523556-d6e833b1-e0e9-4a8f-9bcc-884e57840604.jpg" width="32%" height="750" />
<img src="https://user-images.githubusercontent.com/45598522/231523548-465a79ea-748c-4d8d-b628-499d80ef5f01.jpg" width="32%" height="750" />
<img src="https://user-images.githubusercontent.com/45598522/231523553-ca1cf6d4-f597-4ecc-ba2d-5b2e05108e72.jpg" width="32%" height="750" />
</p>

<b><h3>Map/Search</h3></b><br/>
Users can see their location (after allowing location permissions) on a google map.<br/>
Users can search for a location (Places API), and a route will be created.
<p float="left" align="middle">
  <img src="https://user-images.githubusercontent.com/45598522/231531446-e354c2fe-8427-47e4-8438-bcef443768a3.jpg" width="32%" height="750" />
  <img src="https://user-images.githubusercontent.com/45598522/231530646-73ba9f3c-e5a1-40c8-84a0-6f3363065196.jpg" width="32%" height="750" />
  <img src="https://user-images.githubusercontent.com/45598522/231530975-b840fa7c-1c69-4706-af22-384d4fa18313.jpg" width="32%" height="750" />
</p>

<b><h3>Tracking</h3></b><br/>
Users can choose whether they want to track their cycling/running session, they can also edit title.<br/>
Users can start, stop, resume, pause, while checking their distance, time, and speed. <br/>
Tracking is saved (Fetch API) after stop. 
<p float="left" align="middle">
  <img src="https://user-images.githubusercontent.com/45598522/231533148-026aa847-9cc3-419e-bfc7-1c33e4fab5cb.jpg" width="32%" height="750" />
  <img src="https://user-images.githubusercontent.com/45598522/231536033-56cfa510-43d1-452a-bf17-dd6dff91bc4e.jpg" width="32%" height="750" />
  <img src="https://user-images.githubusercontent.com/45598522/231533164-1c869d98-6d7c-4392-9c0d-876092a48f5a.jpg" width="32%" height="750" />
</p>

<b><h3>View Sessions</h3></b><br/>
Users can view the session (Fetch API) they have saved.
<p float="left" align="middle">
  <img src="https://user-images.githubusercontent.com/45598522/231536840-e573dc84-29d3-4090-a172-d5b55f45466e.jpg" width="32%" height="750" />
  <img src="https://user-images.githubusercontent.com/45598522/231536850-b215ca73-a4ca-4047-acc1-93c744d64f96.jpg" width="32%" height="750" />
</p>

<b><h3>View/Edit Profile & Goals</h3></b><br/>
Users can view their profile details and goals (Fetch API). </br>
Users can edit their profile picture, name, and goal (Fetch API, put request). </br>
Users can also reset their goal (Fetch API). </br>
Users can logout.
<p float="left" align="middle">
  <img src="https://user-images.githubusercontent.com/45598522/231537985-488bf7eb-e7d4-4537-8de1-7640880ee313.jpg" width="32%" height="750" />
  <img src="https://user-images.githubusercontent.com/45598522/231538095-a4844879-c1b9-49fe-8d5f-8e2d85afb84e.jpg" width="32%" height="750" />
  <img src="https://user-images.githubusercontent.com/45598522/231538116-1119973d-d424-4d6c-9426-b82e6288a7cd.jpg" width="32%" height="750" />
  <img src="https://user-images.githubusercontent.com/45598522/231538271-a495700d-c64c-41d2-8391-f3e7d6c764d9.jpg" width="32%" height="750" />
  <img src="https://user-images.githubusercontent.com/45598522/231538287-76d01bc0-9481-4a03-8ba8-0e46a77585fb.jpg" width="32%" height="750" />
</p>

<b><h2>Quality Assurance</h2></b>
Black Box and White Box testing </br>
Use of console log statements and postman
<p float="left" align="middle">
  <img src="https://user-images.githubusercontent.com/45598522/231539696-8f002e29-3583-4c68-a31b-fa1bd709f806.jpg" width="32%" height="750" />
  <img src="https://user-images.githubusercontent.com/45598522/231539685-7db9e584-0764-4aa3-8f3f-f18395540375.jpg" width="32%" height="750" />
  <img src="https://user-images.githubusercontent.com/45598522/231539714-cc2735d2-8833-4428-ae55-513b7c0b7fc5.jpg" width="32%" height="750" />
</p>

<b><h2>UI/UX Considerations</h2></b>
1. Simple and Intuitive, with minimal pages
2. Use of navigation (Stack Navigation and Tab Navigation)
3. Use of both Alert and errorMessages for invalid user inputs
4. Map zooms according to location searched
5. Warning for reset goalProgress
6. Chose a set of complementary colors (palette); Used canva to create logo and icons

<b><h2>Future Considerations</h2></b>
1. User Acceptance Testing (UAT)
2. No guidance for UI/UX design, might be considered not ideal
3. Use of Realm
4. Weather API
5. Allow sharing of sessions to other user (addition Functionality)
