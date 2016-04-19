# online-bios

* This Node.js program uses passport local authentication and mongoDB to create an online biography.  A user can sign up or login to edit their username or biography information.

* A user not logged in can view all profiles but cannot edit any profile including their own.

* A logged in user can view all profiles but can only edit their own profile.

* Other Node.js module used for this are flash messages, bcrypt-nodejs for proper salting and hashing of password as well as proper hashed password comparing for logging in, mongoose for model creation of users, and pug/jade for template building.

