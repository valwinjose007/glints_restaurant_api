// const { donationDetailsModel } = require("../model/donation-details");
const db = require("../pg/pgpool");
const pool = db.getPool();

class Restaurant {
  static getRestaurantList(req) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT restaurant_id,restaurant_name,opening_hours FROM public.restaurants LIMIT 10",
        (err, res) => {
          if (err) reject(err.stack);
          else resolve(res.rows);
        }
      );
    });
  }

  static getRestaurants(restaurants) {
    return new Promise((resolve, reject) => {
      pool.query(
        `select restaurant_id,restaurant_name,opening_hours from public.restaurants where restaurant_id in ($1) limit 10;`,
        [restaurants.join(",")],
        (err, res) => {
          if (err) reject(err.stack);
          else resolve(res.rows);
        }
      );
    });
  }

  static searchRestaurantList(
    restaurant_name,
    openby_day,
    openby_start_time,
    openby_end_time
  ) {
    let reqData = [];
    let query = `SELECT restaurant_id,restaurant_name,opening_hours FROM public.restaurants WHERE is_active=true limit 10;`;
    if (restaurant_name && openby_day && openby_start_time && openby_end_time) {
      query = `SELECT res.restaurant_id,res.restaurant_name,res.opening_hours FROM public.restaurants AS res INNER JOIN public.schedule AS scd ON res.restaurant_id=scd.restaurant_id
          WHERE res.restaurant_name ILIKE $1 AND scd.opening_days @> $2 
          AND scd.opening_time >= $3 AND scd.opening_time < $4 
          AND res.is_active=true AND scd.is_active=true limit 10;`;
      reqData = [
        `%${restaurant_name}%`,
        `{${openby_day}}`,
        `'${openby_start_time}'`,
        `'${openby_end_time}'`,
      ];
    } else if (openby_day && openby_start_time && openby_end_time) {
      query = `SELECT res.restaurant_id,res.restaurant_name,res.opening_hours FROM public.restaurants AS res INNER JOIN public.schedule AS scd ON res.restaurant_id=scd.restaurant_id
          WHERE scd.opening_days @> $1 AND scd.opening_time >= $2 AND scd.opening_time < $3 AND res.is_active=true AND scd.is_active=true limit 10;`;
      reqData = [
        `{${openby_day}}`,
        `'${openby_start_time}'`,
        `'${openby_end_time}'`,
      ];
    } else if (restaurant_name) {
      query = `SELECT restaurant_id,restaurant_name,opening_hours FROM public.restaurants WHERE restaurant_name ILIKE $1 limit 10;`; //ILIKE for case-insenstive.
      reqData = [`%${restaurant_name}%`];
    }
    console.log("query", query);
    console.log("reqData", reqData);
    return new Promise((resolve, reject) => {
      pool.query(query, reqData, (err, res) => {
        console.log("err", err);
        if (err) reject(err.stack);
        else resolve(res.rows);
      });
    });
  }

  static uploadRestaurants(restaurant_data) {
    const { restaurant_name, opening_hours } = restaurant_data;
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO public.restaurants(restaurant_name, opening_hours) 
              VALUES ($1, $2) RETURNING restaurant_id`,
        [restaurant_name, opening_hours],
        (err, res) => {
          if (err) reject(err.stack);
          else resolve(res.rows);
        }
      );
    });
  }

  static uploadSchedule(restaurant_data) {
    const { restaurant_id, opening_days, opening_time, closing_time } =
      restaurant_data;
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO public.schedule (restaurant_id, opening_days,opening_time,closing_time)
              VALUES($1,Array[${"'" + opening_days.join("','") + "'"}],$2,$3)
              RETURNING schedule_id`,
        [restaurant_id, opening_time, closing_time],
        (err, res) => {
          if (err) reject(err.stack);
          else resolve(res.rows);
        }
      );
    });
  }
}

module.exports = Restaurant;
