# 🎉 Event Management API

A clean **Node.js + Express + PostgreSQL REST API** for creating and managing events, registering users, and retrieving event statistics systematically.

---


## 🛠️ Setup Instructions

**1. Clone the repository:**
```bash
git clone https://github.com/sazzadtalukder/event-Management.git
cd event-Management
```
 **2. Install dependencies:**
```bash
npm install
```
**3. Set up PostgreSQL:**
- Create a database:
```sql
CREATE DATABASE eventmanagement;
```
- Create tables:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    datetime TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0 AND capacity <= 1000)
);

CREATE TABLE event_registrations (
    user_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id),
    PRIMARY KEY (user_id, event_id)
);
```
**4. Configure environment variables:**

- Create a .env file:
```ini
PORT=5000
DB_URL=postgres://event:Ppassword1%40@localhost:5432/eventmanagement
```
Or use .env.example as a reference.

**5. Start the server:**
```bash
npm run dev
```
Server will run on:
```arduino
http://localhost:5000
```

---

## 📚 API Endpoints
**✔Create Event**


POST /events
```json
{
    "title": "Tech Conference",
    "datetime": "2025-09-10T08:00:00Z",
    "location": "Dhaka",
    "capacity": 300
}
```
**Response:**
```json
{
    "eventId": 1
}
```
**✔Get Event Details**


GET /events/:id<br>
**Response:**
```json
{
    "id": 1,
    "title": "Tech Conference",
    "datetime": "2025-09-10T08:00:00Z",
    "location": "Dhaka",
    "capacity": 300,
    "registered_users": [
        { "id": 1, "name": "Md. Sazzad", "email": "sazzadtalukdercseiu@gmail.com" }
    ]
}
```
**✔ Register User for Event** <br>
POST /events/:id/register
```json
{
    "userId": 1
}
```
**Response:**
```bash
{
    "message": "Successfully registered for this event"
}
```
**✔ Cancel Registration** <br>
DELETE /events/:id/register
```json
{
    "userId": 1
}
```
**Response:**
```json
{
    "message": "Registration cancelled for this event successfully"
}
```
**✔Get Upcoming Events** <br>
GET /events/upcoming<br>
**Response:**
```json
[
    {
        "id": 1,
        "title": "Tech Conference",
        "datetime": "2025-09-10T08:00:00Z",
        "location": "Dhaka",
        "capacity": 300
    }
]
```
**✔Get Event Stats** <br>
GET /events/:id/stats<br>
**Response:**
```json
{
    "totalRegistrations": 5,
    "remainingCapacity": 295,
    "percentageUsed": 1.67
}
```


