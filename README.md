# Cross Border Payments
In summary this is basically a full web application designed to optimize international money transfers by recommending the best payment route based on cost and speed. I used real time exchange rate data and a dataset of some payment providers to provide insights, targeting use cases like remittances or business payments across corridors such as US to Nigeria or US to UK.

## Features
- Analyzes payment options (e.g.,Wise, Swift, Western Union) based on fixed fees, percentage fees, and transfer speed.
- Fetches live exchange rates to calculate total costs.
- Offers a user interface to input transfer details and view optimized routes.
- Simulates cost savings.

## Stack
- **App**: FastAPI, Requests
- **Client**: React, Tailwind CSS
- **Data Sources**: Open Exchange Rates API

## Installation

### Prerequisites
- Python 3.9+
- Node.js 14+
- Git

### Setup Instructions
1. Clone the repository:
   ```
   git clone https://github.com/astrovine/cross-border-payments.git
   cd cross-border-payments
   ```
2. Set up the backend:
   - Create a virtual environment:
     ```
     python -m venv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     ```
   - Install dependencies:
     ```
     pip install fastapi uvicorn requests pandas
     ```
   - Run the server:
     ```
     uvicorn app.main:app --reload
     ```
3. Set up the frontend:
   - Navigate to the frontend directory:
     ```
     cd client
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Start the development server:
     ```
     npm start
     ```
4. Ensure the Open Exchange Rate API is accessible (1000 requests/month for the free tier).

## Usage
1. Open your browser and go to `http://localhost:3000`.
2. Enter your source country, destination country, and transfer amount.
3. Select a priority (cost or speed) and submit to view the recommended payment route.
4. Explore the dashboard for cost comparisons and route details.

I wrote a more formal paper about the project on substack so if you still want more clarity on the lore of the project you can read it here [Across the border](https://open.substack.com/pub/uzoukwud/p/cross-the-border?utm_source=share&utm_medium=android&r=15nwd5)

## Architecture
- `app/`: API logic and data processing, used a minimalistic design pattern for separation of concerns.
- `client/`: Houses React components and Tailwind styling.
- `data/`: Payment csv and my eda notebook.
- `README.md`: This file.


## Contributing
Contributions are very welcome. To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make changes and commit (`git commit -m "Description of changes/feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Submit a pull request.


## Contact
For questions or feedback, reach out via divineuzoukwu3@gmail.com or connect on [linkedin](www.linkedin.com/in/uzoukwu-divine)
