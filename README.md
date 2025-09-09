# Cross-Border Payment Optimization Tool

## Overview
The Cross-Border Payment Optimization Tool is a full-stack web application designed to optimize international money transfers by recommending the best payment route based on cost and speed. It leverages real-time exchange rate data and a dataset of payment providers to provide actionable insights, targeting use cases like remittances or business payments across corridors such as US to Nigeria or US to UK. This project demonstrates end-to-end development skills, combining backend logic, API integration, and a responsive frontend.

## Features
- Analyzes payment options (e.g., Wise, Swift, Western Union) based on fixed fees, percentage fees, and transfer speed.
- Fetches live exchange rates to calculate total costs.
- Offers a user interface to input transfer details and view optimized routes.
- Simulates cost savings (e.g., 15% reduction compared to baseline providers).

## Tech Stack
- **Backend**: Python, FastAPI, Requests, Pandas
- **Frontend**: React, Tailwind CSS
- **Data Sources**: Frankfurter API (exchange rates)
- **Version Control**: Git, GitHub

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- Git

### Setup Instructions
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cross-border-payment-optimizer.git
   cd cross-border-payment-optimizer
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
     uvicorn main:app --reload
     ```
3. Set up the frontend:
   - Navigate to the frontend directory:
     ```
     cd frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Start the development server:
     ```
     npm start
     ```
4. Ensure the Frankfurter API is accessible (no key required for free tier).

## Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. Enter the source country (e.g., US), destination country (e.g., NGN), and transfer amount.
3. Select a priority (cost or speed) and submit to view the recommended payment route.
4. Explore the dashboard for cost comparisons and route details.

## Project Structure
- `backend/`: Contains `main.py` for API logic and data processing.
- `frontend/`: Houses React components and Tailwind styling.
- `README.md`: This file.

## Development Status
This project is in active development, with the initial version in completion. Current features include basic route optimization and a functional UI. Future enhancements may include advanced filtering and live deployment.

## Contributing
Contributions are welcome. To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make changes and commit (`git commit -m "Description of changes"`).
4. Push to the branch (`git push origin feature-branch`).
5. Submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For questions or feedback, reach out via divineuzoukwu3@gmail.com or connect on [linkedin](www.linkedin.com/in/uzoukwu-divine)
