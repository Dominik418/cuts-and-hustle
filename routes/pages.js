const express = require("express");
const router = express.Router();
const db = require("../database")

router.get("/", (req, res) => {
    res.render("login", { session: req.session });
});

router.get("/register", (req, res) => {
    res.render("register");
});

function processPictures(rows) {
    return rows.map(row => {
        Object.keys(row).forEach(key => {
            let raw = row[key];

            if (Buffer.isBuffer(raw)) {
                const asText = raw.toString("utf8");

                if (asText.startsWith("/images/") || asText.startsWith("images/")) {
                    row[key] = asText.startsWith("/") ? asText : `/${asText}`;
                } 
                else {
                    const base64 = raw.toString("base64");
                    row[key] = `data:image/jpeg;base64,${base64}`;
                }
            }
        });
        return row;
    });
}
router.get("/guest", (req, res) => {
    const employeesQuery = `SELECT * FROM employees`;
    const servicesQuery = `SELECT * FROM services`;

    db.query(servicesQuery, (err, service) => {
        if (err) return res.status(500).send("Database error");
        const services = processPictures(service);

        db.query(employeesQuery, (err, employees) => {
            if (err) return res.status(500).send("Database error");
            const barbers = processPictures(employees);

            res.render("guest", {
                userName: req.session.userName,
                barbers: barbers,
                services: services
            });
        });
    });
});


router.get("/logged", (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    const employeesQuery = `SELECT * FROM employees`;
    const servicesQuery = `SELECT * FROM services`;

    db.query(servicesQuery, (err, service) => {
        if (err) return res.status(500).send("Database error");
        const services = processPictures(service);

        db.query(employeesQuery, (err, employees) => {
            if (err) return res.status(500).send("Database error");
            const barbers = processPictures(employees);

            res.render("logged", {
                userName: req.session.userName,
                barbers: barbers,
                services: services
            });
        });
    });
});

router.get("/barber-dashboard",(req,res)=>{
    const query = `
        SELECT 
            a.customer_name, 
            a.customer_phone, 
            a.customer_email, 
            DATE_FORMAT(a.appointment_date, '%Y-%m-%d') AS appointment_date,
            a.appointment_time, 
            s.name AS service_name
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        WHERE a.employee_id = (SELECT id FROM employees WHERE name = ?) 
        ORDER BY a.appointment_date ASC, a.appointment_time ASC
    `;

    db.query(query,[req.session.userName],(err,result)=>{
        if(err){
            res.status(500).send("Database error",err)
        }
        res.render("barber-dashboard",{
            barberName : req.session.userName,
            appointments: result
        })
    })
})

router.get("/admin-dashboard",(req,res)=>{
    const query = `
        SELECT a.id, e.name AS barber_name, a.customer_name, a.customer_phone, 
               a.customer_email, s.name AS service_name, 
               DATE_FORMAT(a.appointment_date, '%Y-%m-%d') AS appointment_date, 
               a.appointment_time
        FROM appointments a
        JOIN employees e ON a.employee_id = e.id
        JOIN services s ON a.service_id = s.id
        ORDER BY a.appointment_date ASC;
    `;

    db.query(query,[req.session.userName],(err,result)=>{
        if(err){
            res.status(500).send("Database error",err)
        }
        res.render("admin-dashboard",{
            adminName: req.session.userName,
            appointments: result
        })
    })
})

router.get("/users",(req,res)=>{
    const query = "SELECT id, username, role, phone_num, email FROM users";
    db.query(query,[req.session.userName],(err,result)=>{
        if(err){
            res.status(500).send("Database error",err)
        }
        res.render("users",{
            adminName: req.session.userName,
            users: result
        })
    })
})

router.get("/services",(req,res)=>{
    const query = "SELECT id, name, price, duration_minutes, pictures FROM services ORDER BY id ASC";
    db.query(query,[req.session.userName],(err,result)=>{
        if(err){
             res.status(500).send("Database error",err)
        }
        const services = processPictures(result)
        res.render("services",{
            adminName:req.session.userName,
            services:services
        })
    })
})

router.get("/employees",(req,res)=>{
    const query = "SELECT id, name, experience, speciality, small_text, pictures FROM employees";

    db.query(query,[req.session.userName],(err,result)=>{
        if(err){
             res.status(500).send("Database error",err)
        }
        const employees = processPictures(result);
        res.render("employees",{
            adminName:req.session.userName,
            employees: employees
        })
    })
})

router.get("/works/:id",(req,res)=>{
    const barberId = req.params.id
    const query = "select * from employees where id = ?"

    db.query(query,[barberId],(err,result)=>{
        if(err){
            return res.status(500).send("Database error")
        }
        if(result.length === 0){
            return res.status(404).send("Barber not found")
        }
        const employees = processPictures(result)
        res.render("works",{
            barber:employees[0],
            loggedOrNot: req.session.userId ? true:false
        })
    })
})

router.get("/admin-works",(req,res)=>{
    const query = "Select id,name,description,work1,work2,work3,work4,work5,work6 from employees"

    db.query(query,[req.session.userName],(err,result)=>{
        if(err) return res.status(500).send("Database error")
        
        const employees = processPictures(result)
        res.render("admin-works",{
            adminName:req.session.userName,
            employees:employees
        })
    })
})

module.exports = router;
