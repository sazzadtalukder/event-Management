const pool = require('../db');
const createEvent = async (req, res) => {
    try {
        const { title, datetime, location, capacity } = req.body;

        if (!title || !datetime || !location || !capacity) {
            return res.status(400)
                .json({ error: "All Fields are required" })
        }
        if (capacity < 1 || capacity > 1000) {
            return res.status(400)
                .json({ error: "Capacity must be between 1 and 1000" })
        }
        
        const result = await pool.query(
            `INSERT INTO events (title, datetime, location, capacity)
             VALUES ($1, $2, $3, $4)
             RETURNING id`, [title,datetime, location, capacity]
        )
        const createdId = result.rows[0].id;
        res.status(201).json({ eventId: createdId });
    } catch (error) {
        console.error('Error when creating event', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
}
const getEventDetails = async (req,res)=>{
    const eventId = req.params.id;
    try{
        const eventResult = await pool.query(
            `SELECT * 
            FROM events 
            WHERE id = $1`,
            [eventId]
        );
        if(eventResult.rows.length === 0){
            return res.status(404).json({error: 'Event not found'})
        }
        const event = eventResult.rows[0];
        const registrationsResult = await pool.query(
            `
            SELECT users.id, users.name, users.email
            FROM event_registrations
            JOIN users ON event_registrations.user_id = users.id
            WHERE event_registrations.event_id = $1
            `,
            [eventId]
        )
        event.registered_users = registrationsResult.rows;
        res.status(200).json(event)
    } catch (error){
        console.error('Error when getting event Details',error);
        res.status(500).json({error: 'Internal Server Error'})
    }
}
module.exports = { createEvent ,getEventDetails}