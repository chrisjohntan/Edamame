# Orbital 2024 - Edamame
### By Team Exparagus
>"Call me exparagus" - DJ Khaled

## About
Edamame is a flashcard web app designed especially for language learning

Features include:
- Creating personalised flashcards
- Automatic filling and translation of fields, providing definitions and examples from official dictionaries
- Multi language translations (from English)

## Tech stack
Frontend: 
- Typescript
- React

Backend: 
- Python
- Flask

## Setup (local only)
Backend API:
- Optional: venv setup `python -m venv venv`    `source venv/Scripts/activate`
- Install dependencies: `pip install -r requirements.txt`
- Create `.env` file within `backend/` containing `SECRET_KEY=<your secret key>` and `SQLALCHEMY_DATABASE_URI="<your database uri>"`
- Navigate to `./backend` and run `python run.py` or alternatively `flask run --debug -p 8080`
- Server should be running on port 8080

Frontend client:
- Navigate to `./frontend`
- `npm install`
- `npm run dev`
- Client running on port 5173