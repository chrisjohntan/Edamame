from app import create_app

# pass configs as argumemt if necessary
app = create_app()

if (__name__ == "__main__"): 
    app.run(debug=True)