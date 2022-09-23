const http = require("http");
const { v4 } = require("uuid");
const getBodyData = require("./util");

// BOOKS
let books = [
  {
    id: "1",
    title: "",
    pages: "",
    author: "",
  },
];

const server = http.createServer(async (req, res) => {
  //GET ALL BOOKS
  if (req.url === "/books" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json charset=utf8" });
    const resp = {
      status: "ok",
      books,
    };

    res.end(JSON.stringify(resp));
  } else if (req.url === "/books" && req.method === "POST") {
    const data = await getBodyData(req),
      { title, pages, author } = JSON.parse(data),
      newBook = {
        id: v4(),
        title,
        pages,
        author,
      };

    books.push(newBook);
    const resp = {
      status: "Created",
      book: newBook,
    };

    res.writeHead(200, { "Content-Type": "application/json charset=utf8" });
    res.end(JSON.stringify(resp));
  } else if (req.url.match(/\/books\/\w+/) && req.method === "GET") {
    const id = req.url.split("/")[2];
    const book = books.find((b) => b.id === id);
    res.writeHead(200, { "Content-Type": "application/json charset-uft8" });
    const resp = {
      status: "OK",
      book,
    };
    res.end(JSON.stringify(resp));
  } else if (req.url.match(/\/books\/\w+/) && req.method === "PUT") {
    const id = req.url.split("/")[2];
    const idx = books.findIndex((b) => b.id === id);
    const data = await getBodyData(req),
      { title, pages, author } = JSON.parse(data);
    const changedBook = {
      id: books[idx].id,
      title: title || books[idx].title,
      pages: pages || books[idx].pages,
      author: author || books[idx].author,
    };
    books[idx] = changedBook;
    res.writeHead(200, { "Content-Type": "application/json charset-uft8" });
    const resp = {
      status: "OK",
      book: changedBook,
    };
    res.end(JSON.stringify(resp));
  } else if (req.url.match(/\/books\/\w+/) && req.method === "DELETE") {
    const id = req.url.split("/")[2];
    books = books.filter((b) => b.id !== id);
    res.writeHead(200, { "Content-Type": "application/json charset-uft8" });
    const resp = {
      status: "Deleted",
    };
    res.end(JSON.stringify(resp));
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
