const express = require('express');

const PostsRouter = require('./data/posts/posts-router');

const server = express();

server.use(express.json());

server.use('/api/posts', PostsRouter);

server.get('/', (req, res) => {
    res.send(`
    <h2>Node API2 Project API </h2>`
    );
});

module.exports = server;