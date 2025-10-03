# Daily OS
# (Please note that this is not the actual functioning repository. This is just a public samplpe of the core code without personal google credentials and pther private info, the actual repository runs elsewhere)


Generate a focused, actionable daily morning message using Groq's Llama 3 model. Messages include strategic insights, grit motivation, and a reflection prompt—ideal for mental calibration.

## Features

- Uses Groq API (Llama 3) for message generation
- Customizable prompt for elite morning routines
- Outputs message to console
- Environment-based configuration
- Easily extendable for email delivery (see dependencies)

## Setup

1. **Clone the repository**

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment variables**

   Create a [`.env`](.env ) file (see example below):

   ```
   GROQ_API_KEY=your_groq_api_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_TO=recipient@example.com
   ```

## Usage

Run the script to generate your daily message:

```sh
node daily-groq.js
```

## Files

- [`daily-groq.js`](daily-groq.js ): Main script for generating and displaying the daily message.
- [`.env`](.env ): Environment variables for API keys and email (if extended).
- [`package.json`](package.json ): Project metadata and dependencies.

## Dependencies

- [axios](https://www.npmjs.com/package/axios)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [nodemailer](https://www.npmjs.com/package/nodemailer) (for email, not used in main script)
- [openai](https://www.npmjs.com/package/openai) (not used in main script)

## Customization

- Edit the [`generatePrompt`](daily-groq.js ) in [`daily-groq.js`](daily-groq.js ) to change the message format or tone.
- Extend with email delivery using `nodemailer` and the provided email environment variables.

## License

ISC

---

**Note:** Requires a valid Groq API key.
