import express from "express";
import bodyParser from "body-parser";
import pg from "pg";



const app = express();
const port = 3000;


const db = new pg.Client({
  user : "postgres",
  host : "localhost",
  database : "world",
  password : "J2a8m0i5e!",
  port : 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {

  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  //console.log(result.rows);
  res.render("index.ejs", { countries: countries, total: countries.length });
  //db.end();
});

app.post("/add", async (req, res) => {

  const country = req.body["country"];
  console.log(country);

  const result = await db.query("SELECT country_code FROM countries WHERE country_name ILIKE  $1", [`%${country}%`]);
  const data = result.rows[0];
  const countryCode = data.country_code;
  console.log(countryCode);

  try 
  {
    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode]);
    res.redirect("/");
  }
  catch(error)
  {
    if(error.code === '23505')
    {
      console.error('Duplicate Entry', error.details);

    }
    else
    {
      console.error('Error:', error.message);
    }
  }

});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
