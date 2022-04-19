const db = require("../pg/pgpool");
const pool = db.getPool();

class Collection {
  static getCollectionList() {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT collection_id, collection_name FROM public.collection WHERE is_active = true;",
        (err, res) => {
          if (err) reject(err.stack);
          else resolve(res.rows);
        }
      );
    });
  }

  static getCollectionDetailList(collection_id) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT res.restaurant_id,res.restaurant_name,res.opening_hours from public.collection AS col INNER JOIN public.restaurants AS res ON res.restaurant_id = Any(col.restaurants) WHERE col.collection_id = $1 AND res.is_active=true AND col.is_active=true;",
        [collection_id],
        (err, res) => {
          if (err) reject(err.stack);
          else resolve(res.rows);
        }
      );
    });
  }

  static addToCollection(restaurant_id, collection_name) {
    return new Promise((resolve, reject) => {
      if (Number.isInteger(parseInt(restaurant_id)))
        pool.query(
          `INSERT INTO public.collection (collection_name,restaurants) VALUES ($1, Array[${restaurant_id}]);`,
          [collection_name],
          (err, res) => {
            if (err) reject(err.stack);
            else resolve(res.rowCount);
          }
        );
      else reject(new Error("Something went wrong!"));
    });
  }

  static updateToCollection(collection_id, restaurant_id) {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE public.collection SET restaurants = array_append(restaurants, $1) WHERE collection_id = $2",
        [restaurant_id, collection_id],
        (err, res) => {
          if (err) reject(err.stack);
          else resolve(res.rowCount);
        }
      );
    });
  }
}

module.exports = Collection;
