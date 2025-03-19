const Client = require('../models/clientdb');

//mood tracker
const moodTracker = {
    addMood: async (req, res) =>{
        try{
            const{mood, description} = req.body;
            const client = await Client.findById(req.user.id);
            if(!client){
                return res.status(404).json({message:'Client not found'});
            }

            client.moodTracker.push({mood, description});
            await client.save();
            res.status(201).json(client.moodTracker);

        }catch(error){
            res.status(500).json({message: error.message});
        }
    },
    
}