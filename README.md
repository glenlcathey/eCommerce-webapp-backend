Root folder must have a '.env' file with the following format:  <br>
MONGODB=" ***MongoDB connection string here*** "  <br>
JWT_KEY=" ***User defined secret key to be used when issuing JWT's here*** "

JWT's should be issued alongside protected requests in the request header with the key 'Authorization" and should be in the form of 'Header ***JWT***'.  <br>