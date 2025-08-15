const mysql = require('mysql2');
require('dotenv').config();

const  conn = mysql.createConnection({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASS,
   database: process.env.DB_DATABASE,
 })


conn.connect((err) => {
     if(err){
         console.log("ERROR: " + err.message);
         return;   
     }
     console.log('Connection established');
   })


   let dataPool = {};
   dataPool.getUsersDetails = (username) => {
     return new Promise((resolve, reject) => {
       conn.query(`SELECT * FROM User WHERE username = ?`, [username], (err, res) => {
         if (err) { return reject(err); }
         return resolve(res);
       });
     });
   };
   dataPool.createUser = (username, email, password, role, created_on) => {
     return new Promise((resolve, reject) => {
       const sql = 'INSERT INTO User (username, email, password_hash, role, created_on) VALUES (?, ?, ?, ?, ?)';
       conn.query(sql, [username, email, password, role, created_on], (err, result) => {
         if (err) return reject(err);
         return resolve(result);
       });
     });
   };
   
// Create a new blog post
dataPool.createPost = (title, content, published_on, tags, image_url, author) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO BlogPost (title, content, published_on, tags, image_url, author) VALUES (?, ?, ?, ?, ?, ?)';
    conn.query(sql, [title, content, published_on, tags, image_url, author], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

// Get all blog posts
dataPool.getPosts = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM BlogPost ORDER BY published_on DESC';
    conn.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};
   
dataPool.getHeroes = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Hero';
    conn.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
}

dataPool.addHero = (
  hero_idPrimary, name, description, role,
  ability1Name, ability2Name, ability3Name, ability4Name,
  image_url, ability1_img, ability2_img, ability3_img, ability4_img,
  ability1Quip, ability2Quip, ability3Quip, ability4Quip,
  weaponName, weaponImage, playstyle,
  abiltity1Id, abiltity2Id, abiltity3Id, abiltity4Id, weaponId
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Hero (
      hero_id, name, description, role,
      ability1Name, ability2Name, ability3Name, ability4Name,
      image_url, ability1_img, ability2_img, ability3_img, ability4_img,
      ability1Quip, ability2Quip, ability3Quip, ability4Quip,
      weaponName, weaponImage, playstyle,
      abiltity1Id, abiltity2Id, abiltity3Id, abiltity4Id, weaponId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    conn.query(sql, [
      hero_idPrimary, name, description, role,
      ability1Name, ability2Name, ability3Name, ability4Name,
      image_url, ability1_img, ability2_img, ability3_img, ability4_img,
      ability1Quip, ability2Quip, ability3Quip, ability4Quip,
      weaponName, weaponImage, playstyle,
      abiltity1Id, abiltity2Id, abiltity3Id, abiltity4Id, weaponId
    ], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

dataPool.getHeroById = (hero_id) => {
  console.log('Fetching hero with ID:', hero_id);
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Hero WHERE hero_id = ?';
    conn.query(sql, [hero_id], (err, results) => {
      if (err) return reject(err);
      return resolve(results[0]);
    });
  });
}
dataPool.getItemAll = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Item';
    conn.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
}
dataPool.getItemById = (item_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Item WHERE item_id = ?';
    conn.query(sql, [item_id], (err, results) => {
      if (err) return reject(err);
      return resolve(results[0]);
    });
  });
}

dataPool.getItemByCategory = (category) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Item WHERE category = ?';
    conn.query(sql, [category], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
}

dataPool.addItem = (id, name, item_tier, item_slot_type, shop_image) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Item (item_id, name, tier, category, img_url) VALUES (?, ?, ?, ?, ?)';
    conn.query(sql, [id, name, item_tier, item_slot_type, shop_image], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

dataPool.votePost = (postId, userId, voteType) => {
 return new Promise((resolve, reject) => {
  const checkSql = 'SELECT vote_type FROM PostVote WHERE post_id = ? AND user_id = ?';
  conn.query(checkSql, [postId, userId], (err, results) => {
    if (err) return reject(err);

    if (results.length > 0) {
      // Update existing vote
      const updateSql = 'UPDATE PostVote SET vote_type = ? WHERE post_id = ? AND user_id = ?';
      conn.query(updateSql, [voteType, postId, userId], (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    } else {
      // Insert new vote
      const insertSql = 'INSERT INTO PostVote (post_id, user_id, vote_type) VALUES (?, ?, ?)';
      conn.query(insertSql, [postId, userId, voteType], (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    }
  });
});
}

dataPool.getPostVotes = (postId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
      COUNT(CASE WHEN vote_type = 1 THEN 1 END) AS likes,
      COUNT(CASE WHEN vote_type = -1 THEN 1 END) AS dislikes
      FROM PostVote WHERE post_id = ?`;
    conn.query(sql, [postId], (err, results) => {
      if (err) return reject(err);
      const votes = {
        likes: results[0].likes || 0,
        dislikes: results[0].dislikes || 0
      };
      return resolve(votes);
    });
  });
}
dataPool.getUserVotes = (postId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT vote_type FROM PostVote WHERE post_id = ? AND user_id = ?';
    conn.query(sql, [postId, userId], (err, results) => {
      if (err) return reject(err);
      if (results.length > 0) {
        return resolve(results[0].vote_type);
      } else {
        return resolve(0); 
      }
    });
  });
}

dataPool.conn = conn;
module.exports = dataPool;
