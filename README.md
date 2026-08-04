url-https://dashboards-wi7r.onrender.com/login



To run the project locally:

Clone the repository:

git clone https://github.com/taniya-TANIYA1234/ZORVYN-BACKEND.git

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
GET request localhost:3000/users/signup → Register a new user   // only admin can create it 
GET localhost:3000/login → Login user  // If you are registered
 
 Records and Users Routes
GET localhost:3000/records → Fetch all records and Users // only Admin and Analyst can see this
GET localhost:3000/users/:id →  Get a viewer dashboard
GET localhost:3000/users/:id/edit → Update a user role ..
GET localhost:3000/users/:id/edit → Update a user role ..
GET localhost:3000/records/:id/edit → Update a user record ..
GET localhost:3000/records/create → create a user record ..
GET localhost:3000/records/:id/edit → Update a user record ..

# if you are admin you have all the access 
-> to create 
-> to delete
-> to update 
user and records. By clicking button on the admin dashboard you can do all these tasks and move to the routes specified above.

# use login id as an admin
username : hello1
password : hello1 

so that you can notice all records and users 


-> Each user has a unique username and email
-> Records belong to a single user
-> Users must be authenticated to access protected  routes
-> MongoDB is running locally
