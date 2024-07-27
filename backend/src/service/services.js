const { dbConn } = require("../db/dbConnect")

async function createService(service, user) {
    const query = `INSERT INTO services(type,location,capacity,description,userId) VALUES(?,?,?,?,?)`
    const res = await dbConn.promise().query(query,[service.type.toLowerCase(),service.location,service.capacity,service.description,user.email]);
    // console.log(res[0].insertId);
    return { serviceId: res[0].insertId}
}

module.exports = { createService };