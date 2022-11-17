# Metrics

[Live Demo](https://factorial-metrics.vercel.app/)

Webapp built with

- [NextJs](https://nextjs.org/)
- [Next-Auth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [TailwindCSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- MySQL Database

Tested with

- Jest
- Cypress

# Environment variables

I have uploaded the .env.example file with my real environment variables to make it easier if you want to do some local testing. Just rename it to .env and it will work.

Don't worry about the data leak, I will disable the database and Github Oauth after the interview.

# CSV Example Data

If you want to create a new metric with a lot of data you can use a CSV (comma separated) with the columns 'timestamp' and 'values'. I have left two example CSVs in the example-data folder in case you want to try.

# Sign In

In order to create and visualize metrics, you must be sing in with Github. I wanted to make a login with a test user but I haven't had time. Sorry about that! Maybe the authentication itself for this application has been a bad idea.

# Things that have not been done because of lack of time

- Add new values to existing metrics.
- More tests.
- Better validation of inputs and CSV.
- E2E test with authentication. I had never done it before, I had problems and I didn't have time to try it more.
