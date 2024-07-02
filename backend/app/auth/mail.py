import smtplib, ssl
from dotenv import load_dotenv
import os

load_dotenv()


port = 465  # For SSL

sender_email = "edamameorbital@gmail.com"
password = os.environ.get("EMAIL_PASSWORD")


# Create a secure SSL context
context = ssl.create_default_context()

def send_email(receiver_email: str, message: str):
    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message)
