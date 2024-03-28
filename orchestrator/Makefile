# Define variables
FLASK_APP = app.py
# FLASK_ENV = development
UWSGI_HOST = 0.0.0.0
UWSGI_PORT = 8000
UWSGI_PROCESSES = 4
UWSGI_THREADS = 2

# Set up virtual environment
venv:
	python3 -m venv venv
	. venv/bin/activate && pip install -r requirements.txt

# Run Flask app using uWSGI
# --module $(FLASK_APP):app 
# --ini orchestrator.ini
run:
	uwsgi --ini orchestrator.ini

# Clean up
clean:
	rm -rf venv

# Help message
help:
	@echo "Available targets:"
	@echo " make venv        - Create virtual environment and install dependencies"
	@echo " make run         - Run Flask app using uWSGI"
	@echo " make clean       - Remove virtual environment"
	@echo " make help        - Show this help message"
