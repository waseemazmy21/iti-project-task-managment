const Task = require("../models/Task")

async function searchTasks (req , res , next) {
    try{
        const queryParams = req.query

        const limit = +queryParams.limit || 10
        const page = +queryParams.page || 1
        const skip = (page - 1)* limit

        const filterbleFields = new Map([
            ["priority" , val => val.trim().split(' ').map(v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()).join(" ")],
            ["status" , val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()],
            ["category" , val => val.trim()],
        ])

        const filter = {}
        
        filterbleFields.forEach((transformFun , key) => {
            if(queryParams[key]){
                filter[key] = transformFun(queryParams[key])
            }
        })

        if((req.user.role).toLowerCase() != "admin" && req.body.user)
            filter.user =  req.user.id
        
        const sortBy = queryParams.sortBy || "createdAt"
        const order = queryParams.order === "asc" ? 1 : -1

        
        const tasks = await Task.find(filter ).limit(limit).skip(skip).sort({ [sortBy] : order})

        res.status(201).json({
            status: "success",
            message: 'get Tasks successfully',
            data: tasks
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({status:'error', message: 'Internal server error' });
    }
        
}

module.exports = searchTasks