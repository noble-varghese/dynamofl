# Use an official Python runtime as a parent image
FROM python:3.8.10-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

RUN apk add --no-cache \
    gcc \
    linux-headers \
    musl-dev \
    python3 \
    python3-dev\
    make

RUN pip install uwsgi
# Install any needed packages specified in requirements.txt
RUN pip install --upgrade pip \
    && pip install -r requirements.txt \
    && pip install uwsgi

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD make run
