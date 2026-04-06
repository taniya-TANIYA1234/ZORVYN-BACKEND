To run the project locally:

Clone the repository:

git clone repo link
cd project folder

Install dependencies:

npm install
Start MongoDB (make sure MongoDB is running locally)

Run the application:

node app.js

Open in browser:

http://localhost:3000
   API Explanation
 
 Authentication Routes
POST /signup → Register a new user   // only admin can create it 
POST /login → Login user
 
 Records Routes
GET /records → Fetch all records
POST /records → Create a new record
PUT /records/:id → Update a record
DELETE /records/:id → Delete a record

🔹 Dashboard
GET /dashboard/:id → View user dashboard with:
Total Income
Total Expenses
Summary insights

-> Each user has a unique username and email
-> Records belong to a single user
-> Users must be authenticated to access protected     routes
-> Default values are assigned for optional fields like category and notes
-> MongoDB is running locally