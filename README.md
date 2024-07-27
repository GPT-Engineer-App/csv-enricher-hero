# csv-enricher-hero

Functionality and Process:

	1.	CSV Upload and Parsing:
	•	Users select and upload a CSV file.
	•	The app parses the CSV file and stores the data in a state.
	•	Once parsed, the data is displayed in a table format.
	2.	Data Display with Pagination:
	•	The table displaying the CSV data should paginate to handle large datasets.
	•	The pagination should be user-friendly, with clear navigation to move between pages.
	•	Each page should display a fixed number of rows (e.g., 10 or 20) to ensure performance is maintained.
	3.	Initiate Enrichment Process:
	•	Users click a button to start the enrichment process.
	•	The app sends each row to the Anthropic Claude API.
	•	The API returns a description for each row, which is then displayed in the table.
	•	The app should show real-time progress of the enrichment process, perhaps with a progress bar or percentage completion indicator.
	4.	Visual and Functional Feedback:
	•	The UI should provide clear feedback at each step: uploading, parsing, displaying, and enriching.
	•	Use visual indicators such as progress bars, loading spinners, or success/error messages to keep the user informed.

Design Considerations:

	•	The app should use Shad/cdn components for a consistent and modern look.
	•	The interface should be clean, simple, and responsive to ensure a good user experience on various devices.
	•	Focus on usability, ensuring that all interactions are straightforward and intuitive.

Final Notes:

	•	Security is not a primary concern for this internal tool, so API keys can be hardcoded.
	•	Aim for a balance between functionality and simplicity, ensuring the tool is easy to use while meeting the core requirements.


## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with .

- Vite
- React
- shadcn-ui
- Tailwind CSS

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/csv-enricher-hero.git
cd csv-enricher-hero
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
