
const express = require("express");
const router = express.Router();

const { BlogPosts } = require("./models");

BlogPosts.create("Yesterday", "All my troubles seemed so far away", "Ringo");
BlogPosts.create("All you need is love!", "Love is all you need", "Paul");
BlogPosts.create("Yellow Submarine", "We all live in a yellow submarine", "John");
BlogPosts.create("Eleanor Rigby", "All the lonely people, Where do they all come from ?", "Gerorge");


//Get request
router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});



//POST request
router.post("/", (req, res) => {
    const requiredInfo = ["title", "content", "author"];
    for (let i = 0; i < requiredInfo.length; i++) {
        const info = requiredInfo[i];
        if (!(info in req.body)) {
            const msg = `Missing \`${info}\` in request body`
            console.error(msg);
            return res.status(400).send(msg);
        }
    }
    const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(post);
    console.log('posted');
});


//PUT request
router.put("/:id", (req, res) => {
    const requiredInfo = ["title", "content", "author", "id"];
    for (let i = 0; i < requiredInfo.length; i++) {
        const info = requiredInfo[i];
        if (!(info in req.body)) {
            const msg = `Missing \`${info}\` in request body`;
            console.error(msg);
            return res.status(400).send(msg);
        }
    };
    if (req.params.id !== req.body.id) {
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`updating blog post \`${req.params.id}\``);
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
    });
    res.status(204).end()
    console.log('updated');
});

//DELETE request
router.delete("/:id", (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted post \`${req.params.id}\``);
    res.status(204).end();
    console.log('deleted');
});

module.exports = router;