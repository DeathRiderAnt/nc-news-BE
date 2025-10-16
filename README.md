# NC News Seeding

.env files are necessary if you want access to the required environment variables.
Run the command 'npm install dotenv' to be able to access the dotenv package and create your own .env files.

In the root of the project directory, create 2 .env files, .env.test and .env.development.
Populate each with the PGDATABASE environment variable set to the name of the respective database (In this case, nc_news_test and nc_news respectfully)
DO NOT end these variable declarations with a semi-colon!

