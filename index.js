// Set up a server

const { query } = require('express');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.listen(PORT, function() {
    console.log(`Server is running on port, ${PORT}.`);
})


// Establish connection to mongoDB

const { MongoClient } = require('mongodb');
const CONNECTION_URL = "mongodb+srv://RandomUser:NYRjkAaMbCmzl4Aq@randomcluster.klfjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(CONNECTION_URL, { useUnifiedTopology: true });
client.connect();


// Receive request to Home Page

app.get('/', (req, res) => {
    res.send("HALF-LIFE 2 IS THE BEST GAME EVER. PERIOD.");
});


app.get('/crazyMessage', (req, res) => {
    const cargo = checkForUpdate({_id: "app_config"});
    cargo.then((value) => {
        if (value.found) {
            res.json({
                ok: "true",
                crazyText: value.crazyText,
                crazyTitle: value.crazyTitle
            });
        }
        else {
            res.json({
                ok: "true",
                found: "false"
            });
        }
    }).catch((err) => {
        res.json({
            ok: "false",
            errCode: err.errorCode
        });
    });
})


// Status request

app.get('/status', (req, res) => {
    let query = req.query;
    let group_id = query.groupID;
    if (group_id == "gl55tf3-5pMuhammad Ali_d0621") {
        group_id = "gl55tf3-5pMuhammad_Ali_d0621"
    }
    const cargo = findSimilar({_id: group_id});
    const time = getStringDateTime(new Date);
    const openedTime = time.substring(9);
    cargo.then((value_gs) => {
        if(value_gs.found === true) {
            let array = value_gs.list, k = -1;
            for (let i = 0; i < array.length; i++) {
                if (array[i].phoneNumber == query.phoneNumber) {
                    k = i;
                    break;
                }
            };
            if (k > -1) {
                res.json({
                    ok: "true",
                    cleanables: array[k].cleanables,
                    uncleanables: array[k].uncleanables,
                    message: array[k].message,
                    updatetime: array[k].updatetime
                });
                if (array[k].name !== "Shahobiddin") {
                    writeToLogs({
                        who: array[k].name,
                        when: openedTime
                    });
                }
                statusIsSeen(array[k].phoneNumber, "true");
            }
            else res.json({
                ok: "false",
                errCode: "no_student_found"
            });
        }
        else res.json({
            ok: "false",
            errCode: "no_group_found"
        });
    }).catch((err) => {
        res.json({
            ok: "false",
            errCode: err.Code
        });
    });
});


// Write to logs

async function writeToLogs(opened) {
    const result = await client.db("RandomData").collection("RandomCollection").updateOne(
        {
            "_id": "usage_logs"
        },
        {
            $push: { 
                "opened": opened
            }
        }
    );
}


// Get current time

function getStringDateTime(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours() + 5;
    if (h === 24) {
        h = 0;
        d++;
    }
    if (h === 25) {
        h = 1;
        d++;
    }
    if (h === 26) {
        h = 2;
        d++;
    }
    if (h === 27) {
        h = 3;
        d++;
    }
    if (h === 28) {
        h = 4;
        d++;
    }
    var mi = date.getMinutes();
    var strDate = (h < 10 ? '0' + h : h) + ':' + (mi < 10 ? '0' + mi : mi);
    let yy = String(y).substring(2);
    switch(String(m)) {
        case "1":
            mw = "January";
            break;
        case "2":
            mw = "February";
            break;
        case "3":
            mw = "March";
            break;
        case "4":
            mw = "April";
            break;
        case "5":
            mw = "May";
            break;
        case "6":
            mw = "June";
            break;
        case "7":
            mw = "July";
            break;
        case "8":
            mw = "August";
            break;
        case "9":
            mw = "September";
            break;
        case "10":
            mw = "October";
            break;
        case "11":
            mw = "November";
            break;
        case "12":
            mw = "December";
            break;
    }
    strDate = 'Updated: ' + mw + ' ' + d + ', at ' + strDate;
    return strDate;
}


// Change the value of seen

async function statusIsSeen(phoneNumber, seenValue) {
    const result = await client.db("RandomData").collection("RandomCollection").updateOne(
        {
            "students.phoneNumber": phoneNumber
        },
        {
            $set: {
                "students.$.seen": seenValue
            }
        }
    );
}


// Recieve request to get group info

app.get('/groupInfo', (req, res) => {
    let query = req.query;
    let group_id = query.groupID;
    if (group_id == "gl55tf3-5pMuhammad Ali_d0621") {
        group_id = "gl55tf3-5pMuhammad_Ali_d0621"
    }
    const cargo = findSimilar({ _id: group_id});
    cargo.then((value_gs) => {
        res.json({
            ok: "true",
            groupID: value_gs.groupID,
            code: value_gs.code,
            level: value_gs.level,
            days: value_gs.days,
            time: value_gs.time,
            teacher: value_gs.teacher,
            date: value_gs.date,
            cashier: value_gs.cashier,
	        cashierName: value_gs.cashierName,
            students: value_gs.list
        });
    }).catch((err) => {
        res.json({
            ok: "false",
            errCode: err.errorCode
        });
    });
});


// Receive request to get students list

app.get('/studentsList', (req, res) => {
    let query = req.query;
    let group_id = query.groupID;
    if (group_id == "gl55tf3-5pMuhammad Ali_d0621") {
        group_id = "gl55tf3-5pMuhammad_Ali_d0621"
    }
    const cargo = findSimilar({ _id: group_id });
    cargo.then((value_gs) => {
        res.json({
            ok: "true",
            displayOrder: value_gs.order,
            students: value_gs.list
        });
    }).catch((err) => {
        res.json({
            ok: "false",
            errCode: err.errorCode
        });
    });
});


// Receive request to get students list - corrupted

app.get('/students', (req, res) => {
    let query = req.query;
    const cargo = findSimilar({ _id: query.groupID });
    cargo.then((value_gs) => {
        res.json({
            ok: "false",
        });
    }).catch((err) => {
        res.json({
            ok: "false",
            errCode: err.errorCode
        });
    });
});


// Receive request to change name

app.get('/changeName', (req, res) =>  {
    let query = req.query;
    changeName(query.phoneNumber, query.name).then(() => {
        res.json({
            ok: "true"
        });
    }).catch(() => {
        res.json({
            ok: "false",
            errCode: "operation_error"
        });
    });
});


// Change name

async function changeName(phoneNumber, newName) {
    const result = await client.db("RandomData").collection("RandomCollection").updateOne(
        {
            "students.phoneNumber": phoneNumber
        },
        {
            $set: {
                "students.$.name": newName
            }
        }
    );
}


// Receive request to update status

app.get('/update', (req, res) => {
    let query = req.query;
    let time = getStringDateTime(new Date);
    updateStatus(query.phoneNumber, query.cln, query.uncln, query.msg, time).then(() => {
        res.json({
            ok: "true",
        });
    }).catch(() => {
        res.json({
            ok: "false",
            errCode: "operation_error"
        });
    });
});


// Update status

async function updateStatus(phoneNumber, cleanables, uncleanables, message, time) {
    const result = await client.db("RandomData").collection("RandomCollection").updateOne(
        {
            "students.phoneNumber": phoneNumber
        },
        { 
            $set: {
                "students.$.cleanables": cleanables,
                "students.$.uncleanables": uncleanables,
                "students.$.message": message,
                "students.$.updatetime": time,
                "students.$.seen": "false"
            }
        }
    );
}


// Receive request to check cashier

app.get('/checkCashier', (req, res) => {
    let query = req.query;
    const cargo = findSimilar({cashier: query.cashier});
    cargo.then((value) => {
        if (value.found) {
            res.json({
                ok: "true",
                found: "true",
                groupID: value.groupID,
                password: value.password
            });
        }
        else {
            res.json({
                ok: "true",
                found: "false"
            });
        }
    }).catch((err) => {
        res.json({
            ok: "false",
            errCode: err.errorCode
        });
    });
})



// Receive request to appoint a new cashier

app.get('/setCashier', (req, res) =>  {
    let query = req.query;
    let group_id = query.groupID;
    if (group_id == "gl55tf3-5pMuhammad Ali_d0621") {
        group_id = "gl55tf3-5pMuhammad_Ali_d0621"
    }
    setCashier(group_id, query.phoneNumber, query.cashierName).then(() => {
        res.json({
            ok: "true"
        });
    }).catch(() => {
        res.json({
            ok: "false",
            errCode: "operation_error"
        });
    });
});


// Appoint new cashier

async function setCashier(groupID, phoneNumber, cashierName) {
    const result = await client.db("RandomData").collection("RandomCollection").updateMany(
        {
            "_id": groupID
        },
        {
            $set: {
                "cashier": phoneNumber,
                "password": "null",
                "cashierName": cashierName
            }
        }
    );
}


// Receive request to change password

app.get('/changePassword', (req, res) =>  {
    let query = req.query;
    let group_id = query.groupID;
    if (group_id == "gl55tf3-5pMuhammad Ali_d0621") {
        group_id = "gl55tf3-5pMuhammad_Ali_d0621"
    }
    updatePassword(group_id, query.password).then(() => {
        res.json({
            ok: "true"
        });
    }).catch(() => {
        res.json({
            ok: "false",
            errCode: "operation_error"
        });
    });
});


// Change password

async function updatePassword(groupID, password) {
    const result = await client.db("RandomData").collection("RandomCollection").updateOne(
        {
            "_id": groupID
        },
        {
            $set: {
                "password": password
            }
        }
    );
}


// Receive request to check group's existence

app.get('/checkGroup', (req, res) => {
    let query = req.query;
    const ID = buildID(query.level, query.days, query.time, query.teacher, query.date);
    const cargo = findSimilar({_id: ID});
    cargo.then((value) => {
        if (value.found) {
            res.json({
                ok: "true",
                found: "true"
            });
        }
        else {
            res.json({
                ok: "true",
                found: "false"
            });
        }
    }).catch((err) => {
        res.json({
            ok: "false",
            errCode: err.errorCode
        });
    });
})


// Receive request to check group's existence by ID

app.get('/checkGroupID', (req, res) => {
    let query = req.query;
    let group_id = query.groupID;
    if (group_id == "gl55tf3-5pMuhammad Ali_d0621") {
        group_id = "gl55tf3-5pMuhammad_Ali_d0621"
    }
    const cargo = findSimilar({_id: group_id});
    cargo.then((value) => {
        if (value.found) {
            res.json({
                ok: "true",
                found: "true"
            });
        }
        else {
            res.json({
                ok: "true",
                found: "false"
            });
        }
    }).catch((err) => {
        res.json({
            ok: "false",
            errCode: err.errorCode
        });
    });
})


// Receive request to create group

app.get('/addGroup', (req, res) => {
    let query = req.query;
    const ID = buildID(query.level, query.days, query.time, query.teacher, query.date);
    const color = background();
    const CODE = buildCode(8);
    insertGroup({
        _id: ID,
        code: CODE,
        level: query.level,
        days: query.days,
        time: query.time,
        teacher: query.teacher,
        date: query.date,
        cashier: query.phoneNumber,
        password: "null",
        cashierName: query.cashierName,
        students: [
            {
                phoneNumber: query.phoneNumber,
                name: query.name,
                cleanables: 0,
                uncleanables: 0,
                message: "",
				avatar: color,
                updatetime: "Tomorrow",
                seen: "true"
            }
        ]
    }).then(() => {
        res.json({
            ok: "true",
            groupID: ID
        })
    }).catch(() => {
        res.json({
            ok: "false",
            errCode: "operation_error"
        });
    });
});


// Insert new group to mongoDB

async function insertGroup(newGroup) {
    const result = await client.db("RandomData").collection("RandomCollection").insertOne(newGroup);
}


// Recieve request to delete group

app.get('/deleteGroup', (req, res) => {
    let query = req.query;
    let group_id = query.groupID;
    if (group_id == "gl55tf3-5pMuhammad Ali_d0621") {
        group_id = "gl55tf3-5pMuhammad_Ali_d0621"
    }
    deleteGroup(group_id).then(() => {
        res.json({
            ok: "true"
        })
    }).catch(() => {
        res.json({
            ok: "false",
            errCode: "operation_error"
        });
    });
});


// Remove group from mongoDB

async function deleteGroup(groupID) {
    const result = await client.db("RandomData").collection("RandomCollection").deleteOne(
        { "_id": groupID}
    );
}


// Receive request to generate code

app.get('/generateCode', (req, res) => {
    let query = req.query;
    const CODE = buildCode(8);
    let group_id = query.groupID;
    if (group_id == "gl55tf3-5pMuhammad Ali_d0621") {
        group_id = "gl55tf3-5pMuhammad_Ali_d0621"
    }
    updateCode(group_id, CODE).then(() => {
        res.json({
            ok: "true",
		    code: CODE
        });
    }).catch(() => {
        res.json({
            ok: "false",
            errCode: "operation_error"
        });
    });
});


// Update code

async function updateCode(groupID, code) {
    const result = await client.db("RandomData").collection("RandomCollection").updateOne(
        {
            "_id": groupID
        },
        {
            $set: {
                "code": code
            }
        }
    );
}


// Receive request to check the student

app.get('/checkStudent', (req, res) => {
    let query = req.query;
    const cargo = findStudent(query.phoneNumber);
    cargo.then((value) => {
        if (value.found) {
            res.json({
                ok: "true",
                found: "true",
                groupID: value.groupID,
                level: value.level,
                days: value.days,
                time: value.time,
                teacher: value.teacher,
                date: value.date,
                cashier: value.cashier,
                password: value.password
            });
        }
        else {
            res.json({
                ok: "true",
                found: "false"
            });
        }
    }).catch((err) => {
        res.json({
            ok: "false",
            errCode: err.errorCode
        });
    });
})


// Receive request to check the code

app.get('/checkCode', (req, res) => {
    let query = req.query;
    const cargo = findSimilar({code: query.code});
    cargo.then((value) => {
        if (value.found) {
            res.json({
                ok: "true",
                found: "true",
                groupID: value.groupID,
                cashier: value.cashier
            });
        }
        else {
            res.json({
                ok: "true",
                found: "false"
            });
        }
    }).catch((err) => {
        res.json({
            ok: "false",
            errCode: err.errorCode
        });
    });
})


// Recieve request to add student

app.get('/joinGroup', (req, res) => {
    let query = req.query;
    const color = background();
    insertStudent(query.code, {
        phoneNumber: query.phoneNumber,
        name: query.name,
        cleanables: 0,
        uncleanables: 0,
        message: "",
        avatar: color,
        updatetime: "Tomorrow",
        seen: "true"
    }).then(() => {
        res.json({
            ok: "true"
        });
    }).catch(() => {
        res.json({
            ok: "false",
            errCode: "operation_error"
        });
    });
});


// Insert new student to a group

async function insertStudent(invite_code, newStudent) {
    const result = await client.db("RandomData").collection("RandomCollection").updateOne(
        {
            "code": invite_code
        },
        {
            $push: { "students": newStudent }
        }
    );
}


// Recieve request to remove student

app.get('/leaveGroup', (req, res) => {
    let query = req.query;
    let group_id = query.groupID;
    if (group_id == "gl55tf3-5pMuhammad Ali_d0621") {
        group_id = "gl55tf3-5pMuhammad_Ali_d0621"
    }
    removeStudent(group_id, {
        phoneNumber: query.phoneNumber
    }).then(() => {
        res.json({
            ok: "true"
        })
    }).catch(() => {
        res.json({
            ok: "false",
            errCode: "operation_error"
        });
    });
});


// Remove student from a group

async function removeStudent(groupID, student) {
    const result = await client.db("RandomData").collection("RandomCollection").updateOne(
        { "_id": groupID}, { $pull: { "students": student}}
    );
}


// Search similar

function findSimilar(value) {
    return new Promise((resolve, reject) => {
        (client.db("RandomData").collection("RandomCollection").findOne(value)).then((data) => {
            if (data)
                resolve({
                    found: true,
                    groupID: data._id,
                    code: data.code,
                    level: data.level,
                    days: data.days,
                    time: data.time,
                    teacher: data.teacher,
                    date: data.date,
                    cashier: data.cashier,
		            cashierName: data.cashierName,
		            password: data.password,
                    order: data.order,
                    list: data.students
                });
            else
                resolve({found: false});
        }).catch(err => {
            reject({errorCode: "operation_error"});
        });
    }).catch(err => {
        reject({errorCode: "operation_error"});
    });
}


// Search for a student

function findStudent(studentID) {
    return new Promise((resolve, reject) => {
        (client.db("RandomData").collection("RandomCollection").findOne( {
            students: { $elemMatch: {phoneNumber: studentID}}
        })).then((data) => {
            if (data)
                resolve({
                    found: true,
                    groupID: data._id,
                    code: data.code,
                    level: data.level,
                    days: data.days,
                    time: data.time,
                    teacher: data.teacher,
                    date: data.date,
                    cashier: data.cashier,
                    password: data.password,
                    list: data.students
                });
            else
                resolve({found: false});
        }).catch(err => {
            reject({errorCode: "operation_error"});
        });
    }).catch(err => {
        reject({errorCode: "operation_error"});
    });
}


// Receive request to check for update

app.get('/checkUpdate', (req, res) => {
    const cargo = checkForUpdate({_id: "app_config"});
    cargo.then((value) => {
        if (value.found) {
            res.json({
                ok: "true",
                version_code: value.version_code,
                version_name: value.version_name,
                update: value.update,
                logs: value.logs,
                apk_url: value.apk_url
            });
        }
        else {
            res.json({
                ok: "true",
                found: "false"
            });
        }
    }).catch((err) => {
        res.json({
            ok: "false",
            errCode: err.errorCode
        });
    });
})


// Check for update

function checkForUpdate(value) {
    return new Promise((resolve, reject) => {
        (client.db("RandomData").collection("RandomCollection").findOne(value)).then((data) => {
            if (data)
                resolve({
                    found: true,
                    version_code: data.version_code,
                    version_name: data.version_name,
                    update: data.update,
                    logs: data.logs,
                    apk_url: data.apk_url,
                    crazyText: data.crazyText,
                    crazyTitle: data.crazyTitle
                });
            else
                resolve({found: false});
        }).catch(err => {
            reject({errorCode: "operation_error"});
        });
    }).catch(err => {
        reject({errorCode: "operation_error"});
    });
}


// Save display order

app.get('/changeDisplayOrder', (req, res) =>  {
    let query = req.query;
    let group_id = query.groupID;
    if (group_id == "gl55tf3-5pMuhammad Ali_d0621") {
        group_id = "gl55tf3-5pMuhammad_Ali_d0621"
    }
    updateOrder(group_id, query.order).then(() => {
        res.json({
            ok: "true"
        });
    }).catch(() => {
        res.json({
            ok: "false",
            errCode: "operation_error"
        });
    });
});


// Change password

async function updateOrder(groupID, order) {
    const result = await client.db("RandomData").collection("RandomCollection").updateOne(
        {
            "_id": groupID
        },
        {
            $set: {
                "order": order
            }
        }
    );
}

// Generate custom group ID

function buildID(gLevel, gDays, gTime, gTeacher, gDate) {
    //gl4ts0305pShahlo_d0621
    var ultimate = 'gl' + gLevel + 't' + gDays + gTime + 'p';
    for ( var i = 0; i < gTeacher.length; i++ ) {
        if (gTeacher.charAt(i) == ' ') {
            let s1 = gTeacher.substring(0, i);
            let s2 = gTeacher.substring(i + 1);
            gTeacher = s1 + '_' + s2;
        }
    }
    ultimate = ultimate + gTeacher + '_d' + gDate;
    var ultimateID = ultimate.toString();
    return ultimateID;
}


// Generate invite link

function buildCode(length) {
    var result           = '';
    var characters       = 'abcdefghijkmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function background() {
    let colorList1 = ["#ff4d4d", "#33ccff"]
    let colorList2 = ["#ffad33", "#1a1aff"]
    let colorList = ["#ff3333", "#ffa31a", "#ff3399", "#33ccff", "#1a1aff"]
    start = getRandomInt(5);
    end = getRandomInt(5);
    while (start === end)
        end = getRandomInt(5);
    return (colorList[start] + "-" + colorList[end]);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}