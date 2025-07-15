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
const registerEvent = async (req,res)=>{
    const eventId = req.params.id;
    const {userId} = req.body;

    try{
        const eventResult = await pool.query(
            `SELECT * 
            FROM events 
            WHERE id = $1`, 
            [eventId]
        )

        if(eventResult.rows.length === 0){
            return res.status(404).json({error: "Event not Found"});

        }
        const event = eventResult.rows[0];
        const todayDate  = new Date();
        if(new Date(event.datetime) < todayDate){
            return res.status(400).json({
                error : "Event Already past, you can't registered"
            })
        }
        const isUser = await pool.query(
            `SELECT * 
            FROM users 
            WHERE id = $1`, 
            [userId]
        )
        if(isUser.rows.length === 0){
            return res.status(404).json({
                error: 'User not Found'
            })
        }
        const isRegistered = await pool.query(
            `SELECT * 
            FROM event_registrations 
            WHERE user_id = $1 AND event_id = $2`,
            [userId, eventId]
        )
        if(isRegistered.rows.length > 0){
            return res.status(409).json({
                error: "User Already Registered For this event"
            })
        }

        const allRegisteredUser = await pool.query(
            `SELECT COUNT(*) 
            FROM event_registrations 
            WHERE event_id = $1`,
            [eventId]
        )
        const allRegisteredUserNumber = parseInt(allRegisteredUser.rows[0].count);
        if(allRegisteredUserNumber >= event.capacity){
            return registerEvent.status(400).json({
                error: " Capacity is full, you can't registered"
            })
        }

        await pool.query(
            `INSERT INTO event_registrations (user_id, event_id) VALUES ($1, $2)`,
            [userId, eventId]
        )
        res.status(201).json({message: " Successfully registered for this event"})

    } catch (error){
        console.error("Error when registering user on event",error)
        res.status(500).json({
            error: "Server Error"
        })
    }
}
const cancelRegistration = async (req,res)=>{
    const eventId = req.params.id;
    const {userId} = req.body;

    try {
        const isEvent = await pool.query(
            `SELECT *
            FROM events
            WHERE id = $1
            `,
            [eventId]
        )
        if(isEvent.rows.length === 0){
            return res.status(404).json({
                error: "Event not Founnd"
            })
        }

        const isUser = await pool.query(
            `
            SELECT *
            FROM users
            WHERE id = $1
            `,
            [userId]
        )
        if(isUser.rows.length === 0 ){
            return res.status(404).json({
                error: " User not found"
            })
        }
        const isRegisteredForEvent = await pool.query(
            `
            SELECT *
            FROM event_registrations
            WHERE user_id = $1 AND event_id = $2
            `,
            [userId,eventId]
        )
        if(isRegisteredForEvent.rows.length === 0){
            return res.status(404).json({
                error: " Registration not found for this user and event"
            })
        }
        await pool.query(
            `
            DELETE
            FROM event_registrations
            WHERE user_id = $1 AND event_id = $2
            `,
            [userId,eventId]

            
        )
        res.status(200).json({
            message: "Registration cancelled for this event successfully"
        })
    }catch(error){
        console.error("Error when canceling registration: ",error);
        res.status(500).json({
            error: "Server Error"
        })
    }
}
const getUpcomingEvents = async (req,res)=>{
    try{
        
        const today = new Date().toISOString();

        const result = await pool.query(
            `
            SELECT *
            FROM events
            WHERE datetime > $1
            ORDER BY datetime ASC, location ASC
            `,
            [today]
        )
        res.status(200).json(result.rows)
    }catch (error){
        console.error("Error when fetching upcoming",error)
        return res.status(500).json({
            error: "Server Error"
        })
    }
}
module.exports = { createEvent ,
    getEventDetails,
    registerEvent,
    cancelRegistration,
    getUpcomingEvents 
}