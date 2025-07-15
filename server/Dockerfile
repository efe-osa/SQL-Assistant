# Dockerfile
FROM alpine:latest

# SQLite
RUN apk update && apk add sqlite

# Create a directory for SQLite data
WORKDIR /sqlite_data/

# Copy the initialization script
# COPY ./sqlite_data/ .

# RUN source init-cars-db.sh

# Set the default command to open SQLite
# Note: SQLite is a serverless database, so it does not require a port to be exposed.
CMD  ["sqlite3"]
