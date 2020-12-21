const express = require('express');

const Posts = require('../db.js')

const router = express.Router();

// | GET    | /api/posts       

router.get('/', (req, res) =>
    Posts
        .find()
        .then(postList => res.status(200).json(postList))
        .catch(() =>
            res.status(500).json({ error: "The posts information could not be retrieved." })
        )
);

// | GET    | /api/posts/:id         

router.get('/:id', (req, res) =>
    Posts
        .findById(req.params.id)
        .then(post =>
            post.length
                ? res.status(200).json(post)
                : res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
        )
        .catch(() =>
            res.status(500).json({ error: "The post information could not be retrieved." })
        )
);

// | GET    | /api/posts/:id/comments 

router.get('/:id/comments', (req, res) =>
    Posts
        .findPostComments(req.params.id)
        .then(comments =>
            comments.length
                ? res.status(200).json(comments)
                : res.status(404).json({ error: "The comments information could not be retrieved." })
        )
        .catch(() =>
            res.status(500).json({ error: "The comments information could not be retrieved." })
        )
);

// | DELETE | /api/posts/:id      

router.delete('/:id', (req, res) => {
    Posts
        .findById(req.params.id)
        .then(post => {
            post
                ? Posts.remove(post.id)
                    .then(() =>
                        res.status(200).json(post)
                    )
                    .catch(() =>
                        res.status(500).json({ error: "The post could not be removed" })
                    )
                : res.status(404).json({ message: "The post with the specified ID does not exist." })
        })
});

// | POST   | /api/posts              | Creates a post using the information sent inside the `request body`.     

router.post('/', (req, res) =>
    (!req.body.title || !req.body.contents)
        ? res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        : Posts
            .insert(req.body)
            .then(post =>
                Posts.findById(post.id)
                    .then(post => res.status(201).json(post))
            )
            .catch(() =>
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            )
);

// | POST   | /api/posts/:id/comments 

router.post('/:id/comments', (req, res) =>
    req.body.text
        ? Posts
            .insertComment({ ...req.body, post_id: req.params.id })
            .then(comment =>
                comment.id
                    ? Posts
                        .findCommentById(comment.id)
                        .then(returnedPost => res.status(201).json(returnedPost))
                    : res.status(404).json({ message: "The post with the specified ID does not exist." })
            )
            .catch(() =>
                res.status(500).json({ error: "There was an error while saving the comment to the database" }))
        : res.status(400).json({ errorMessage: "Please provide text for the comment." })
);

// | PUT    | /api/posts/:id 

router.put('/:id', (req, res) =>
    (req.body.title && req.body.contents)
        ? Posts
            .update(req.params.id, req.body)
            .then(updatedPostId =>
                updatedPostId
                    ? Posts
                        .findById(req.params.id)
                        .then(updatedPost => res.status(200).json(updatedPost))
                    : res
                        .status(404)
                        .json({ message: "The post with the specified ID does not exist." })
            )
            .catch(() => res.status(500).json({ error: "The post information could not be modified." }))
        : res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
);

module.exports = router;