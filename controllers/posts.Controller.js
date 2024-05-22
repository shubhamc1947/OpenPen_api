import con from "../db.js";
import jwt from "jsonwebtoken";
export const getPosts = async (req, resp) => {
  // console.log("hello")
  // console.log(req.query.cat);

  const q = req.query.cat
    ? "SELECT posts.id AS postId, posts.title, posts.description, posts.img AS postImg, posts.date, posts.uid, posts.cat, users.id AS userId, users.username, users.email, users.img AS userImg FROM posts LEFT JOIN users ON posts.uid = users.id WHERE posts.cat = ?"
    : "SELECT posts.id AS postId, posts.title, posts.description, posts.img AS postImg, posts.date, posts.uid, posts.cat, users.id AS userId, users.username, users.email, users.img AS userImg FROM posts LEFT JOIN users ON posts.uid = users.id";

  con.query(q, req.query.cat ? [req.query.cat] : [], (err, data) => {
    if (err) {
      // Log the error for debugging
      console.error("Database error:", err);
      return resp.status(500).send("An error occurred while fetching posts.");
    }
    resp.status(200).json(data);
    // console.log("Data fetched: multiple wala", data);
  });
};

export const getPost = async (req, resp) => {
  const id = req.params.id;
  // console.log(id);
  const q = "SELECT posts.id AS postId, posts.title, posts.description, posts.img AS postImg, posts.date, posts.uid, posts.cat, users.id AS userId, users.username, users.email, users.img AS userImg FROM posts LEFT JOIN users ON posts.uid = users.id WHERE posts.id=?";

  con.query(q,[id] , (err, data) => {
    if (err) {
      // Log the error for debugging
      console.error("Database error:", err);
      return resp.status(500).send("An error occurred while fetching posts.");
    }
    resp.status(200).json(data);
    // console.log("Data fetched:single wala ", data);
  });
};

export const addPost = async (req, res) => {
  const token = req.cookies.access_token;
  // console.log(token)
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`title`, `description`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];
// console.log(values);
    con.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  });
};
export const deletePost = async (req, res) => {

  const token = req.cookies.access_token;
  
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    con.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.status(200).json("Post has been deleted!");
    });
  });
};
export const updatePost = async (req, res) => {
  const token = req.cookies.access_token;
  // console.log(token);
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q =
      "UPDATE posts SET `title`=?,`description`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";

    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];
    // console.log(values)
    // console.log(postId)
    // console.log(userInfo.id)

    con.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  });
};
