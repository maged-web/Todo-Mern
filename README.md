# Todo-Mern

Step-by-Step Instructions

1. Clone the Repository

git clone <repository-url>
cd <repository-folder>

2. Setup Backend

Navigate to the backend directory:
cd backend

npm install

Create a .env file in the backend folder and add the necessary environment variables. The .env file should contain the following:

MONGO_URL=your_mongodb_atlas_uri
PORT=5000

To start the backend server, run:

npm run run:dev

The backend server will now be running on http://localhost:5000.

3. Setup Frontend

Navigate to the frontend directory:

cd ../frontend

Install the frontend dependencies:

npm install

Create a .env file in the frontend folder with the necessary environment variables. The .env file should look like this:

VITE_API_BASE_URL=http://localhost:5000

To start the frontend, run:

npm run dev

The frontend server will now be running on http://localhost:5173/.

4. MongoDB Atlas Setup

Make sure that you have a MongoDB Atlas cluster set up. You'll need to:

Create a database in MongoDB Atlas.
Add your MongoDB URI in the backend .env file under MONGO_URI.
Ensure the database is accessible (whitelist your IP in Atlas if needed).

5. Running the Application

Once both the frontend and backend are set up and running:

Open two terminal windows.

In one terminal, navigate to the backend folder and run the backend server (npm run run:dev).
In the other terminal, navigate to the frontend folder and run the frontend server (npm run dev).
Access the application at http://localhost:5173/ in your web browser.